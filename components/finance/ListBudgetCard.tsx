/**
 * List Budget Card Component
 * Displays budget vs spent for a single shopping list
 */

import { Card } from '@/components/ui';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { ShoppingList } from '@/types';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListBudgetCardProps {
  list: ShoppingList;
  onPress?: () => void;
}

export default function ListBudgetCard({ list, onPress }: ListBudgetCardProps) {
  const hasBudget = list.budget && list.budget > 0;
  const percentUsed = hasBudget ? (list.spent / list.budget!) * 100 : 0;
  const isOverBudget = list.status === 'Over Budget';
  const isTightBudget = list.status === 'Tight Budget';
  
  const getStatusColor = () => {
    if (isOverBudget) return AppColors.semantic.error;
    if (isTightBudget) return AppColors.semantic.warning;
    if (hasBudget) return AppColors.semantic.success;
    return AppColors.text.muted;
  };
  
  const getStatusBgColor = () => {
    if (isOverBudget) return 'rgba(239, 68, 68, 0.1)';
    if (isTightBudget) return 'rgba(245, 158, 11, 0.1)';
    if (hasBudget) return 'rgba(34, 197, 94, 0.1)';
    return AppColors.background.tertiary;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.header}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: list.color + '20' }]}>
            <Text style={styles.iconText}>{list.icon}</Text>
          </View>
          
          {/* List info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{list.name}</Text>
            <Text style={styles.itemCount}>{list.itemCount} items</Text>
          </View>
          
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor() }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {list.status}
            </Text>
          </View>
        </View>
        
        {/* Budget info */}
        <View style={styles.budgetSection}>
          <View style={styles.budgetRow}>
            <Text style={styles.spentLabel}>Spent</Text>
            <Text style={styles.spentValue}>${list.spent.toFixed(2)}</Text>
          </View>
          
          {hasBudget && (
            <>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Budget</Text>
                <Text style={styles.budgetValue}>${list.budget!.toFixed(2)}</Text>
              </View>
              
              {/* Mini progress bar */}
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(percentUsed, 100)}%` },
                    isOverBudget && styles.overBudgetFill,
                    isTightBudget && styles.tightBudgetFill,
                  ]} 
                />
              </View>
            </>
          )}
        </View>
        
        {/* Chevron */}
        <View style={styles.chevron}>
          <ChevronRight size={20} color={AppColors.text.muted} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  itemCount: {
    fontSize: Typography.size.xs,
    color: AppColors.text.muted,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  budgetSection: {
    marginLeft: 52,
    marginRight: 24,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  spentLabel: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
  },
  spentValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
  },
  budgetLabel: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  budgetValue: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.background.tertiary,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
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
  tightBudgetFill: {
    backgroundColor: AppColors.semantic.warning,
  },
  chevron: {
    position: 'absolute',
    right: Spacing.lg,
    top: '50%',
    marginTop: -10,
  },
});
