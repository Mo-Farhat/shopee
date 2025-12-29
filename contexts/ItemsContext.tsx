/**
 * Items Context
 * Manages shopping list items with real-time sync
 */

import { db } from '@/services/firebase';
import type { ListItem } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLists } from './ListsContext';

interface ItemsContextType {
  items: ListItem[];
  isLoading: boolean;
  error: string | null;
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  addItem: (name: string, quantity?: number, unit?: string, category?: string, price?: number) => Promise<string>;
  updateItem: (id: string, updates: Partial<ListItem>) => Promise<void>;
  toggleItem: (id: string, isCompleted: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const { updateList, lists } = useLists();
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Subscribe to items for active list
  useEffect(() => {
    if (!activeListId) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    
    const itemsQuery = query(
      collection(db, 'listItems'),
      where('listId', '==', activeListId)
    );

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const updatedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ListItem[];
      
      // Sort: uncompleted first, then by creation date
      updatedItems.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return 0;
      });
      
      setItems(updatedItems);
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching items:', err);
      setError('Failed to load items');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeListId]);

  // Update list counts when items change
  const updateListCounts = useCallback(async (listId: string, itemsList: ListItem[]) => {
    const itemCount = itemsList.length;
    const completedCount = itemsList.filter(item => item.isCompleted).length;
    // Calculate total spent from item prices
    const spent = itemsList.reduce((total, item) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      return total + (itemPrice * itemQty);
    }, 0);
    
    // Determine budget status
    const currentList = lists.find(l => l.id === listId);
    let status: 'On Budget' | 'Tight Budget' | 'Over Budget' | 'No Budget' = 'No Budget';
    if (currentList?.budget && currentList.budget > 0) {
      const ratio = spent / currentList.budget;
      if (ratio > 1) status = 'Over Budget';
      else if (ratio > 0.8) status = 'Tight Budget';
      else status = 'On Budget';
    }
    
    try {
      await updateList(listId, { itemCount, completedCount, spent, status });
    } catch (err) {
      console.error('Failed to update list counts:', err);
    }
  }, [updateList, lists]);

  // Add item
  const addItem = useCallback(async (
    name: string, 
    quantity?: number, 
    unit?: string, 
    category?: string,
    price?: number
  ) => {
    if (!activeListId) throw new Error('No active list selected');

    try {
      // Build the item object, excluding undefined values
      const newItem: any = {
        listId: activeListId,
        name,
        isCompleted: false,
        createdAt: serverTimestamp(),
      };

      // Only add optional fields if they have values
      if (quantity !== undefined) newItem.quantity = quantity;
      if (unit) newItem.unit = unit;
      if (category) newItem.category = category;
      if (price !== undefined) newItem.price = price;

      const docRef = await addDoc(collection(db, 'listItems'), newItem);
      
      // Update list counts
      const newItems = [...items, { id: docRef.id, ...newItem }];
      await updateListCounts(activeListId, newItems as ListItem[]);
      
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding item:', err.message, err);
      throw new Error('Failed to add item');
    }
  }, [activeListId, items, updateListCounts]);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<ListItem>) => {
    try {
      const itemRef = doc(db, 'listItems', id);
      await updateDoc(itemRef, updates);
    } catch (err) {
      console.error('Error updating item:', err);
      throw new Error('Failed to update item');
    }
  }, []);

  // Toggle item completion
  const toggleItem = useCallback(async (id: string, isCompleted: boolean) => {
    if (!activeListId) return;
    
    try {
      const itemRef = doc(db, 'listItems', id);
      const updates: any = { isCompleted };
      
      if (isCompleted) {
        updates.completedAt = serverTimestamp();
      } else {
        updates.completedAt = null;
      }
      
      await updateDoc(itemRef, updates);
      
      // Update list counts
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, isCompleted } : item
      );
      await updateListCounts(activeListId, updatedItems);
    } catch (err) {
      console.error('Error toggling item:', err);
      throw new Error('Failed to toggle item');
    }
  }, [activeListId, items, updateListCounts]);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    if (!activeListId) return;
    
    try {
      await deleteDoc(doc(db, 'listItems', id));
      
      // Update list counts
      const updatedItems = items.filter(item => item.id !== id);
      await updateListCounts(activeListId, updatedItems);
    } catch (err) {
      console.error('Error deleting item:', err);
      throw new Error('Failed to delete item');
    }
  }, [activeListId, items, updateListCounts]);

  // Clear all completed items
  const clearCompleted = useCallback(async () => {
    if (!activeListId) return;
    
    try {
      const batch = writeBatch(db);
      const completedItems = items.filter(item => item.isCompleted);
      
      completedItems.forEach(item => {
        batch.delete(doc(db, 'listItems', item.id));
      });
      
      await batch.commit();
      
      // Update list counts
      const remainingItems = items.filter(item => !item.isCompleted);
      await updateListCounts(activeListId, remainingItems);
    } catch (err) {
      console.error('Error clearing completed items:', err);
      throw new Error('Failed to clear completed items');
    }
  }, [activeListId, items, updateListCounts]);

  return (
    <ItemsContext.Provider value={{ 
      items, 
      isLoading, 
      error, 
      activeListId,
      setActiveListId,
      addItem, 
      updateItem, 
      toggleItem,
      deleteItem,
      clearCompleted
    }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}
