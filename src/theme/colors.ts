/**
 * colors.ts
 * Central color palette for StudyBuddy.
 * Having all colors in one place makes it trivial to maintain light/dark mode
 * and ensures visual consistency across every screen.
 */

export const palette = {
  // Primary brand color — a calm indigo that feels academic
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo400: '#818CF8',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',

  // Accent — a warm amber used for streaks and highlights
  amber400: '#FBBF24',
  amber500: '#F59E0B',

  // Semantic colors
  green500: '#22C55E',
  red400: '#F87171',
  red500: '#EF4444',
  orange400: '#FB923C',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
} as const;

/** Light-mode semantic tokens */
export const lightColors: AppColors = {
  primary: palette.indigo500,
  primaryDark: palette.indigo700,
  primaryLight: palette.indigo100,
  accent: palette.amber500,

  background: palette.gray50,
  surface: palette.white,
  surfaceSecondary: palette.gray100,
  border: palette.gray200,

  textPrimary: palette.gray900,
  textSecondary: palette.gray500,
  textDisabled: palette.gray300,
  textOnPrimary: palette.white,

  success: palette.green500,
  error: palette.red500,
  warning: palette.orange400,

  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  tabBarActive: palette.indigo500,
  tabBarInactive: palette.gray400,
} as const;

/** Dark-mode semantic tokens (same keys, different values) */
export const darkColors: AppColors = {
  primary: palette.indigo400,
  primaryDark: palette.indigo600,
  primaryLight: palette.indigo700,
  accent: palette.amber400,

  background: palette.gray900,
  surface: palette.gray800,
  surfaceSecondary: palette.gray700,
  border: palette.gray700,

  textPrimary: palette.gray50,
  textSecondary: palette.gray400,
  textDisabled: palette.gray600,
  textOnPrimary: palette.white,

  success: palette.green500,
  error: palette.red400,
  warning: palette.orange400,

  tabBar: palette.gray900,
  tabBarBorder: palette.gray700,
  tabBarActive: palette.indigo400,
  tabBarInactive: palette.gray500,
};

// Use an explicit interface so dark-mode values (different hex strings) can satisfy the type
export interface AppColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
  success: string;
  error: string;
  warning: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
}
