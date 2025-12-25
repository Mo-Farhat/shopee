/**
 * Button Component
 * Reusable button with multiple variants: primary, secondary, ghost, danger
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { ButtonProps, ButtonSize, ButtonVariant } from '@/types';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  const opacity = disabled ? 0.5 : 1;
  
  const styles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: AppColors.primary.main,
        borderWidth: 0,
        opacity,
      },
      text: {
        color: AppColors.primary.contrast,
      },
    },
    secondary: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: AppColors.primary.main,
        opacity,
      },
      text: {
        color: AppColors.primary.main,
      },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        opacity,
      },
      text: {
        color: AppColors.primary.main,
      },
    },
    danger: {
      container: {
        backgroundColor: AppColors.semantic.error,
        borderWidth: 0,
        opacity,
      },
      text: {
        color: '#FFFFFF',
      },
    },
  };
  
  return styles[variant];
};

const getSizeStyles = (size: ButtonSize) => {
  const styles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        minHeight: 36,
      },
      text: {
        fontSize: Typography.size.sm,
      },
    },
    md: {
      container: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        minHeight: 48,
      },
      text: {
        fontSize: Typography.size.base,
      },
    },
    lg: {
      container: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing['2xl'],
        minHeight: 56,
      },
      text: {
        fontSize: Typography.size.lg,
      },
    },
  };
  
  return styles[size];
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onPress,
  children,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant, disabled || loading);
  const sizeStyles = getSizeStyles(size);
  
  const content = children || title;
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variantStyles.text.color} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <>{icon}</>
          )}
          {typeof content === 'string' ? (
            <Text
              style={[
                styles.text,
                sizeStyles.text,
                variantStyles.text,
                icon && iconPosition === 'left' ? styles.textWithLeftIcon : undefined,
                icon && iconPosition === 'right' ? styles.textWithRightIcon : undefined,
              ]}
            >
              {content}
            </Text>
          ) : (
            content
          )}
          {icon && iconPosition === 'right' && (
            <>{icon}</>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: Typography.weight.semibold,
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  textWithRightIcon: {
    marginRight: Spacing.sm,
  },
});

export default Button;
