/**
 * Lists Home Screen
 * Displays all shopping lists with filtering and creation options
 */

import { CreateListModal, ListCard } from '@/components/lists';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth, useLists } from '@/contexts';
import { router } from 'expo-router';
import { Bell, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Active', 'Shared', 'Archived'];

export default function ListsScreen() {
  const { user } = useAuth();
  const { lists, isLoading, deleteList } = useLists();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Real-time sync handles this, but we can simulate a delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredLists = lists.filter(list => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Shared') return list.collaborators.length > 0;
    // For now Active/Archived are same as we don't have archived state yet
    return true;
  });

  const handleListPress = (id: string) => {
    router.push({
      pathname: '/list/[id]',
      params: { id }
    });
  };

  const handleMorePress = (id: string) => {
    // TODO: Show options menu (Edit, Delete, Archive)
    console.log('More pressed for list:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color={AppColors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color={AppColors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>My Lists</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                activeFilter === item && styles.activeFilterChip
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.activeFilterText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lists */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.primary.main} />
        </View>
      ) : filteredLists.length > 0 ? (
        <FlatList
          data={filteredLists}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppColors.primary.main} />
          }
          renderItem={({ item }) => (
            <ListCard
              list={item}
              onPress={() => handleListPress(item.id)}
              onMorePress={() => handleMorePress(item.id)}
            />
          )}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No lists found</Text>
          <Text style={styles.emptySubtext}>Create your first shopping list to get started!</Text>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>New List</Text>
      </TouchableOpacity>

      <CreateListModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Typography.size.lg,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  filterContainer: {
    marginBottom: Spacing.xl,
  },
  filterList: {
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
  },
  activeFilterChip: {
    backgroundColor: AppColors.text.primary,
  },
  filterText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
  },
  activeFilterText: {
    color: AppColors.background.primary,
  },
  listContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: 100, // Space for FAB
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
  fab: {
    position: 'absolute',
    bottom: Spacing['3xl'],
    right: Spacing['2xl'],
    backgroundColor: AppColors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.base,
    marginLeft: Spacing.sm,
  },
});
