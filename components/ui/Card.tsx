/**
 * Card Component
 * Reusable card container with optional press handling
 */

import { AppColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import type { CardProps } from '@/types';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export function Card({
  children,
  onPress,
  style,
  variant = 'default',
}: CardProps) {
  const cardStyles: ViewStyle[] = [
    styles.container,
    variant === 'elevated' && styles.elevated,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: AppColors.border.default,
    padding: Spacing.lg,
  },
  elevated: {
    ...Shadows.md,
    backgroundColor: AppColors.background.elevated,
  },
});

export default Card;
