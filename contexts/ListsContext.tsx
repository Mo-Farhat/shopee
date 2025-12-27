/**
 * Lists Context
 * Manages shopping lists state and real-time sync with Firebase
 */

import { db } from '@/services/firebase';
import type { ShoppingList } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface ListsContextType {
  lists: ShoppingList[];
  isLoading: boolean;
  error: string | null;
  createList: (name: string, color: string, icon: string, budget?: number, collaborators?: string[]) => Promise<string>;
  updateList: (id: string, updates: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to lists
  useEffect(() => {
    if (!user) {
      setLists([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Query for lists owned by user
    const listsQuery = query(
      collection(db, 'shoppingLists'),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(listsQuery, (snapshot) => {
      const updatedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShoppingList[];
      
      setLists(updatedLists);
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching lists:', err);
      setError('Failed to load shopping lists');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Create list
  const createList = useCallback(async (
    name: string, 
    color: string, 
    icon: string, 
    budget?: number,
    collaborators: string[] = []
  ) => {
    if (!user) throw new Error('User must be logged in to create a list');

    try {
      // Build the list object, excluding undefined values
      const newList: any = {
        userId: user.id,
        name,
        color,
        icon,
        spent: 0,
        itemCount: 0,
        completedCount: 0,
        status: budget && budget > 0 ? 'On Budget' : 'No Budget',
        collaborators,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Only add budget if it's defined and > 0
      if (budget && budget > 0) {
        newList.budget = budget;
      }

      const docRef = await addDoc(collection(db, 'shoppingLists'), newList);
      return docRef.id;
    } catch (err: any) {
      console.error('Error creating list:', err.message, err);
      throw new Error('Failed to create shopping list');
    }
  }, [user]);

  // Update list
  const updateList = useCallback(async (id: string, updates: Partial<ShoppingList>) => {
    try {
      const listRef = doc(db, 'shoppingLists', id);
      await updateDoc(listRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating list:', err);
      throw new Error('Failed to update shopping list');
    }
  }, []);

  // Delete list
  const deleteList = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'shoppingLists', id));
    } catch (err) {
      console.error('Error deleting list:', err);
      throw new Error('Failed to delete shopping list');
    }
  }, []);

  return (
    <ListsContext.Provider value={{ 
      lists, 
      isLoading, 
      error, 
      createList, 
      updateList, 
      deleteList 
    }}>
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
}
