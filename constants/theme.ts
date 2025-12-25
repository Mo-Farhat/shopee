/**
 * Shopee App Theme Configuration
 * Design system colors, fonts, and spacing based on the dark-themed UI mockups
 */

import { Platform } from 'react-native';

// React Navigation theme colors (for compatibility)
const tintColorLight = '#22C55E';
const tintColorDark = '#22C55E';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F0F0F',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * App-specific color palette
 * Based on the dark-themed UI mockups with green accent
 */
export const AppColors = {
  // Primary colors
  primary: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#16A34A',
    contrast: '#FFFFFF',
  },
  
  // Background colors
  background: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#252525',
    elevated: '#2A2A2A',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    muted: '#737373',
    disabled: '#525252',
  },
  
  // Border colors
  border: {
    default: '#2E2E2E',
    subtle: '#1F1F1F',
    focus: '#22C55E',
  },
  
  // Semantic colors
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Social brand colors
  social: {
    google: '#EA4335',
    apple: '#FFFFFF',
    facebook: '#1877F2',
  },
} as const;

/**
 * Spacing scale (in pixels)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

/**
 * Border radius scale
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

/**
 * Font configuration
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

/**
 * Typography scale
 */
export const Typography = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Shadow styles
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;
