/**
 * Finance Tab Screen
 * Displays budget overview and per-list spending analytics
 */

import { FinanceSummary, ListBudgetCard } from '@/components/finance';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useLists } from '@/contexts';
import { router } from 'expo-router';
import { Calendar, DollarSign } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type TimeFilter = 'today' | 'week' | 'month';

const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

export default function FinanceScreen() {
  const { lists, isLoading } = useLists();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  
  // Sort lists by spent (highest first)
  const sortedLists = useMemo(() => {
    return [...lists].sort((a, b) => (b.spent || 0) - (a.spent || 0));
  }, [lists]);

  const handleListPress = (listId: string) => {
    router.push(`/list/${listId}`);
  };

  const renderListCard = ({ item, index }: { item: typeof lists[0]; index: number }) => (
    <Animated.View entering={FadeInDown.delay(200 + index * 50).springify()}>
      <ListBudgetCard
        list={item}
        onPress={() => handleListPress(item.id)}
      />
    </Animated.View>
  );

  const ListHeader = () => (
    <>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(50).springify()}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <DollarSign size={28} color={AppColors.primary.main} />
          <Text style={styles.title}>Finance</Text>
        </View>
      </Animated.View>
      
      {/* Time Filter */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.filterContainer}
      >
        {TIME_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              timeFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => setTimeFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
      
      {/* Summary Card */}
      <FinanceSummary timeFilter={timeFilter} />
      
      {/* Lists Section Header */}
      <Animated.View 
        entering={FadeInDown.delay(150).springify()}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>Spending by List</Text>
        <Text style={styles.sectionSubtitle}>
          {sortedLists.length} {sortedLists.length === 1 ? 'list' : 'lists'}
        </Text>
      </Animated.View>
    </>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Calendar size={48} color={AppColors.text.muted} />
      <Text style={styles.emptyTitle}>No spending data yet</Text>
      <Text style={styles.emptySubtitle}>
        Add items with prices to your shopping lists to see spending analytics
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={sortedLists}
        renderItem={renderListCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!isLoading ? EmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.background.secondary,
    borderWidth: 1,
    borderColor: AppColors.border.default,
  },
  filterButtonActive: {
    backgroundColor: AppColors.primary.main,
    borderColor: AppColors.primary.main,
  },
  filterText: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  filterTextActive: {
    color: AppColors.primary.contrast,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
  },
  sectionSubtitle: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
    textAlign: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
});
