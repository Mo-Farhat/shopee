/**
 * ListItemRow Component
 * Displays a single shopping list item with checkbox and swipe actions
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { ListItem } from '@/types';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Checkbox } from '../ui';

interface ListItemRowProps {
  item: ListItem;
  onToggle: () => void;
  onDelete: () => void;
  onPress?: () => void;
}

export function ListItemRow({ item, onToggle, onDelete, onPress }: ListItemRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable 
        style={styles.content}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Checkbox
          checked={item.isCompleted}
          onChange={onToggle}
          size="md"
        />
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.name, 
              item.isCompleted && styles.completedText
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {(item.quantity || item.category) && (
            <Text style={styles.details}>
              {item.quantity && `${item.quantity}${item.unit ? ` ${item.unit}` : ''}`}
              {item.quantity && item.category && ' • '}
              {item.category}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={18} color={AppColors.text.muted} />
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingLeft: Spacing.lg,
    gap: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: AppColors.text.primary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: AppColors.text.muted,
  },
  details: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
    marginTop: 2,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
});
