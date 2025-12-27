/**
 * List Detail Screen
 * Displays and manages items in a shopping list
 */

import { AddItemInput, ListItemRow } from '@/components/lists';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useItems, useLists } from '@/contexts';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MoreHorizontal, Trash2, Users } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lists } = useLists();
  const { 
    items, 
    isLoading, 
    setActiveListId, 
    addItem, 
    toggleItem,
    deleteItem,
    clearCompleted
  } = useItems();

  // Set active list when screen loads
  useEffect(() => {
    if (id) {
      setActiveListId(id);
    }
    return () => setActiveListId(null);
  }, [id, setActiveListId]);

  // Get current list details
  const list = useMemo(() => 
    lists.find(l => l.id === id), 
    [lists, id]
  );

  // Separate pending and completed items
  const pendingItems = useMemo(() => 
    items.filter(item => !item.isCompleted),
    [items]
  );

  const completedItems = useMemo(() => 
    items.filter(item => item.isCompleted),
    [items]
  );

  const handleAddItem = async (name: string) => {
    try {
      await addItem(name);
    } catch (err) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleToggleItem = async (itemId: string, isCompleted: boolean) => {
    try {
      await toggleItem(itemId, !isCompleted);
    } catch (err) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(itemId);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const handleClearCompleted = () => {
    if (completedItems.length === 0) return;

    Alert.alert(
      'Clear Completed',
      `Remove ${completedItems.length} completed item${completedItems.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCompleted();
            } catch (err) {
              Alert.alert('Error', 'Failed to clear items');
            }
          }
        }
      ]
    );
  };

  const handleMorePress = () => {
    Alert.alert(
      list?.name || 'List Options',
      undefined,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Completed', 
          onPress: handleClearCompleted,
          style: completedItems.length > 0 ? 'default' : 'cancel'
        },
      ]
    );
  };

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>List not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = list.itemCount > 0 ? (list.completedCount / list.itemCount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={AppColors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title} numberOfLines={1}>{list.name}</Text>
          <Text style={styles.subtitle}>
            {list.completedCount}/{list.itemCount} items
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <MoreHorizontal size={24} color={AppColors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progress}%`, backgroundColor: list.color || AppColors.primary.main }
            ]} 
          />
        </View>
        {list.collaborators.length > 0 && (
          <View style={styles.collaboratorsBadge}>
            <Users size={14} color={AppColors.text.muted} />
            <Text style={styles.collaboratorsText}>
              {list.collaborators.length} collaborator{list.collaborators.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Add Item Input */}
      <View style={styles.inputSection}>
        <AddItemInput onAdd={handleAddItem} />
      </View>

      {/* Items List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.primary.main} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No items yet</Text>
          <Text style={styles.emptySubtext}>Add your first item above!</Text>
        </View>
      ) : (
        <FlatList
          data={pendingItems}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => 
            completedItems.length > 0 ? (
              <View style={styles.completedSection}>
                <View style={styles.completedHeader}>
                  <Text style={styles.completedTitle}>
                    Completed ({completedItems.length})
                  </Text>
                  <TouchableOpacity onPress={handleClearCompleted}>
                    <Trash2 size={18} color={AppColors.text.muted} />
                  </TouchableOpacity>
                </View>
                {completedItems.map(item => (
                  <ListItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => handleToggleItem(item.id, item.isCompleted)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <ListItemRow
              item={item}
              onToggle={() => handleToggleItem(item.id, item.isCompleted)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  progressSection: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: AppColors.background.tertiary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  collaboratorsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  collaboratorsText: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  inputSection: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  emptyText: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.size.base,
    color: AppColors.text.muted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.size.lg,
    color: AppColors.semantic.error,
  },
  listContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  completedSection: {
    marginTop: Spacing.xl,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: AppColors.border.default,
  },
  completedTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.muted,
    textTransform: 'uppercase',
  },
});
