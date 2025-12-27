/**
 * Input Component
 * Reusable text input with icon support, error states, and password toggle
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { InputProps } from '@/types';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  autoFocus = false,
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const showPasswordToggle = secureTextEntry && !rightIcon;
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;
  
  const getBorderColor = () => {
    if (error) return AppColors.semantic.error;
    if (isFocused) return AppColors.border.focus;
    return AppColors.border.default;
  };
  
  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View
        style={[
          styles.container,
          { borderColor: getBorderColor() },
          disabled && styles.disabled,
          multiline && styles.multilineContainer,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            (rightIcon || showPasswordToggle) ? styles.inputWithRightIcon : undefined,
            multiline ? styles.multilineInput : undefined,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AppColors.text.muted}
          secureTextEntry={actualSecureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={AppColors.text.secondary} />
            ) : (
              <Eye size={20} color={AppColors.text.secondary} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: AppColors.text.secondary,
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.tertiary,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    minHeight: 52,
  },
  multilineContainer: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
  leftIconContainer: {
    paddingLeft: Spacing.lg,
  },
  rightIconContainer: {
    paddingRight: Spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    color: AppColors.text.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.md,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.size.sm,
    color: AppColors.semantic.error,
    marginTop: Spacing.xs,
  },
});

export default Input;
