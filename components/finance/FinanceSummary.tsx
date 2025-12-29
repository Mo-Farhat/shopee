/**
 * Finance Summary Component
 * Displays aggregate spending overview
 */

import { Card } from '@/components/ui';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useLists } from '@/contexts';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FinanceSummaryProps {
  timeFilter: 'today' | 'week' | 'month';
}

export default function FinanceSummary({ timeFilter }: FinanceSummaryProps) {
  const { lists } = useLists();
  
  const stats = useMemo(() => {
    // Filter lists by time (simplified - in production would filter by item dates)
    const filteredLists = lists; // For MVP, show all lists
    
    const totalSpent = filteredLists.reduce((sum, list) => sum + (list.spent || 0), 0);
    const totalBudget = filteredLists.reduce((sum, list) => sum + (list.budget || 0), 0);
    const listsWithBudget = filteredLists.filter(list => list.budget && list.budget > 0).length;
    const listsOverBudget = filteredLists.filter(list => list.status === 'Over Budget').length;
    
    const remaining = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      totalSpent,
      totalBudget,
      remaining,
      percentUsed,
      listsWithBudget,
      listsOverBudget,
    };
  }, [lists]);

  const isOverBudget = stats.remaining < 0;
  const progressWidth = Math.min(stats.percentUsed, 100);

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <Card style={styles.container}>
        {/* Main stat */}
        <View style={styles.mainStat}>
          <View style={styles.iconContainer}>
            <Wallet size={24} color={AppColors.primary.main} />
          </View>
          <View style={styles.mainStatText}>
            <Text style={styles.label}>Total Spent</Text>
            <Text style={styles.amount}>${stats.totalSpent.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Progress bar */}
        {stats.totalBudget > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>
                ${stats.totalSpent.toFixed(0)} of ${stats.totalBudget.toFixed(0)}
              </Text>
              <Text style={[
                styles.progressPercent,
                isOverBudget && styles.overBudgetText
              ]}>
                {stats.percentUsed.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${progressWidth}%` },
                isOverBudget && styles.overBudgetFill
              ]} />
            </View>
          </View>
        )}
        
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, isOverBudget ? styles.statIconDanger : styles.statIconSuccess]}>
              {isOverBudget ? (
                <TrendingUp size={16} color={AppColors.semantic.error} />
              ) : (
                <TrendingDown size={16} color={AppColors.semantic.success} />
              )}
            </View>
            <View>
              <Text style={styles.statValue}>
                ${Math.abs(stats.remaining).toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>
                {isOverBudget ? 'Over budget' : 'Remaining'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.listsWithBudget}</Text>
            <Text style={styles.statLabel}>Lists with budget</Text>
          </View>
          
          {stats.listsOverBudget > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.overBudgetText]}>
                  {stats.listsOverBudget}
                </Text>
                <Text style={styles.statLabel}>Over budget</Text>
              </View>
            </>
          )}
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  mainStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  mainStatText: {
    flex: 1,
  },
  label: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
    marginBottom: 2,
  },
  amount: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  progressSection: {
    marginBottom: Spacing.xl,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
  },
  progressPercent: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: AppColors.primary.main,
  },
  progressBar: {
    height: 8,
    backgroundColor: AppColors.background.tertiary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary.main,
    borderRadius: BorderRadius.full,
  },
  overBudgetFill: {
    backgroundColor: AppColors.semantic.error,
  },
  overBudgetText: {
    color: AppColors.semantic.error,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: AppColors.text.muted,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: AppColors.border.default,
    marginHorizontal: Spacing.md,
  },
});
