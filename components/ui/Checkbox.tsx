/**
 * Checkbox Component
 * Animated checkbox for list items and form fields
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { CheckboxProps } from '@/types';
import { Check } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: { box: 18, icon: 12, gap: Spacing.sm },
    md: { box: 24, icon: 16, gap: Spacing.md },
    lg: { box: 28, icon: 18, gap: Spacing.lg },
  };
  return sizes[size];
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: CheckboxProps) {
  const progress = useSharedValue(checked ? 1 : 0);
  const sizeStyles = getSizeStyles(size);
  
  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [checked, progress]);
  
  const animatedBoxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', AppColors.primary.main]
    );
    
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [AppColors.border.default, AppColors.primary.main]
    );
    
    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: withSpring(checked ? 1.05 : 1) }],
    };
  });
  
  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));
  
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <AnimatedView
        style={[
          styles.box,
          { width: sizeStyles.box, height: sizeStyles.box },
          animatedBoxStyle,
        ]}
      >
        <Animated.View style={animatedCheckStyle}>
          <Check size={sizeStyles.icon} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </AnimatedView>
      
      {label && (
        <Text
          style={[
            styles.label,
            { marginLeft: sizeStyles.gap },
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.size.base,
    color: AppColors.text.primary,
    flex: 1,
  },
  labelDisabled: {
    color: AppColors.text.disabled,
  },
});

export default Checkbox;
