/**
 * ListCard Component
 * Displays a shopping list with progress, budget status, and collaborators
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { ShoppingList } from '@/types';
import { MoreHorizontal, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../ui';

interface ListCardProps {
  list: ShoppingList;
  onPress: () => void;
  onMorePress?: () => void;
}

export function ListCard({ list, onPress, onMorePress }: ListCardProps) {
  const progress = list.itemCount > 0 ? (list.completedCount / list.itemCount) * 100 : 0;
  
  const getStatusColor = () => {
    switch (list.status) {
      case 'On Budget': return AppColors.primary.main;
      case 'Tight Budget': return AppColors.semantic.warning;
      case 'Over Budget': return AppColors.semantic.error;
      default: return AppColors.text.muted;
    }
  };

  const getStatusBg = () => {
    switch (list.status) {
      case 'On Budget': return 'rgba(34, 197, 94, 0.1)';
      case 'Tight Budget': return 'rgba(245, 158, 11, 0.1)';
      case 'Over Budget': return 'rgba(239, 68, 68, 0.1)';
      default: return AppColors.background.tertiary;
    }
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{list.name}</Text>
          {list.status !== 'No Budget' && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {list.status}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
          <MoreHorizontal size={20} color={AppColors.text.muted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {list.category || 'Personal List'}
      </Text>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.itemCount}>
            {list.completedCount}/{list.itemCount} items
          </Text>
          <Text style={[styles.percentage, { color: getStatusColor() }]}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progress}%`, backgroundColor: getStatusColor() }
            ]} 
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.collaborators}>
          {list.collaborators.length > 0 ? (
            <View style={styles.avatarStack}>
              {/* Placeholder for avatars */}
              <View style={[styles.avatar, { backgroundColor: '#FFD700' }]} />
              <View style={[styles.avatar, { backgroundColor: '#FF69B4', marginLeft: -10 }]} />
              {list.collaborators.length > 2 && (
                <View style={styles.avatarMore}>
                  <Text style={styles.avatarMoreText}>+{list.collaborators.length - 2}</Text>
                </View>
              )}
            </View>
          ) : (
            <Users size={16} color={AppColors.text.muted} />
          )}
        </View>

        {list.budget !== undefined && (
          <View style={styles.budgetInfo}>
            <Text style={styles.spentLabel}>SPENT</Text>
            <Text style={styles.budgetText}>
              <Text style={styles.spentAmount}>${list.spent}</Text>
              <Text style={styles.budgetTotal}> / ${list.budget}</Text>
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  name: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
    marginBottom: Spacing.lg,
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemCount: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
  },
  percentage: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collaborators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.background.secondary,
  },
  avatarMore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    borderWidth: 2,
    borderColor: AppColors.background.secondary,
  },
  avatarMoreText: {
    fontSize: 10,
    color: AppColors.text.secondary,
    fontWeight: Typography.weight.bold,
  },
  budgetInfo: {
    alignItems: 'flex-end',
  },
  spentLabel: {
    fontSize: 10,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.muted,
    marginBottom: 2,
  },
  budgetText: {
    fontSize: Typography.size.sm,
  },
  spentAmount: {
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  budgetTotal: {
    color: AppColors.text.muted,
  },
});
