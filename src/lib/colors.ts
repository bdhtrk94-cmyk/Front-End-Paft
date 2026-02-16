/**
 * PAFT Brand Colors
 * Centralized color constants for consistent theming across the application
 */

export const PAFT_COLORS = {
  // Primary Brand Colors
  primary: {
    main: '#06B6D4',      // cyan-600 - Main brand color from logo
    light: '#67E8F9',     // cyan-300 - Lighter variant
    dark: '#0891B2',      // cyan-700 - Darker variant
    50: '#ECFEFF',        // cyan-50
    100: '#CFFAFE',       // cyan-100
    200: '#A5F3FC',       // cyan-200
    300: '#67E8F9',       // cyan-300
    400: '#22D3EE',       // cyan-400
    500: '#06B6D4',       // cyan-500
    600: '#0891B2',       // cyan-600
    700: '#0E7490',       // cyan-700
    800: '#155E75',       // cyan-800
    900: '#164E63',       // cyan-900
  },

  // Secondary Brand Colors
  secondary: {
    main: '#2563EB',      // blue-600 - Secondary brand color
    light: '#60A5FA',     // blue-400 - Lighter variant
    dark: '#1D4ED8',      // blue-700 - Darker variant
    50: '#EFF6FF',        // blue-50
    100: '#DBEAFE',       // blue-100
    200: '#BFDBFE',       // blue-200
    300: '#93C5FD',       // blue-300
    400: '#60A5FA',       // blue-400
    500: '#3B82F6',       // blue-500
    600: '#2563EB',       // blue-600
    700: '#1D4ED8',       // blue-700
    800: '#1E40AF',       // blue-800
    900: '#1E3A8A',       // blue-900
  },

  // Semantic Colors
  success: {
    main: '#10B981',      // green-600
    light: '#34D399',     // green-400
    dark: '#059669',      // green-700
  },

  warning: {
    main: '#F59E0B',      // amber-600
    light: '#FCD34D',     // amber-300
    dark: '#D97706',      // amber-700
  },

  error: {
    main: '#EF4444',      // red-600
    light: '#F87171',     // red-400
    dark: '#DC2626',      // red-700
  },

  // Neutral Colors
  gray: {
    50: '#F8FAFC',        // slate-50
    100: '#F1F5F9',       // slate-100
    200: '#E2E8F0',       // slate-200
    300: '#CBD5E1',       // slate-300
    400: '#94A3B8',       // slate-400
    500: '#64748B',       // slate-500
    600: '#475569',       // slate-600
    700: '#334155',       // slate-700
    800: '#1E293B',       // slate-800
    900: '#0F172A',       // slate-900
  },

  // Background Colors
  background: {
    primary: '#06B6D4',   // primary main
    secondary: '#2563EB', // secondary main
    light: '#F0F9FF',     // cyan-50
    gray: '#F8FAFC',      // slate-50
    white: '#FFFFFF',
  },

  // Text Colors
  text: {
    primary: '#06B6D4',   // primary main
    secondary: '#2563EB', // secondary main
    dark: '#1F2937',      // gray-800
    light: '#6B7280',     // gray-500
    white: '#FFFFFF',
  },

  // Border Colors
  border: {
    primary: '#06B6D4',   // primary main
    secondary: '#2563EB', // secondary main
    light: '#E5E7EB',     // gray-200
    gray: '#D1D5DB',      // gray-300
  },
} as const;

/**
 * CSS Custom Properties (CSS Variables) for PAFT Colors
 * Use these in CSS files or styled-components
 */
export const PAFT_CSS_VARS = {
  // Primary Colors
  '--paft-primary': PAFT_COLORS.primary.main,
  '--paft-primary-light': PAFT_COLORS.primary.light,
  '--paft-primary-dark': PAFT_COLORS.primary.dark,

  // Secondary Colors
  '--paft-secondary': PAFT_COLORS.secondary.main,
  '--paft-secondary-light': PAFT_COLORS.secondary.light,
  '--paft-secondary-dark': PAFT_COLORS.secondary.dark,

  // Semantic Colors
  '--paft-success': PAFT_COLORS.success.main,
  '--paft-warning': PAFT_COLORS.warning.main,
  '--paft-error': PAFT_COLORS.error.main,

  // Background Colors
  '--paft-bg-primary': PAFT_COLORS.background.primary,
  '--paft-bg-secondary': PAFT_COLORS.background.secondary,
  '--paft-bg-light': PAFT_COLORS.background.light,
  '--paft-bg-gray': PAFT_COLORS.background.gray,

  // Text Colors
  '--paft-text-primary': PAFT_COLORS.text.primary,
  '--paft-text-secondary': PAFT_COLORS.text.secondary,
  '--paft-text-dark': PAFT_COLORS.text.dark,
  '--paft-text-light': PAFT_COLORS.text.light,

  // Border Colors
  '--paft-border-primary': PAFT_COLORS.border.primary,
  '--paft-border-secondary': PAFT_COLORS.border.secondary,
  '--paft-border-light': PAFT_COLORS.border.light,

  // Gradients
  '--paft-gradient-primary': `linear-gradient(135deg, ${PAFT_COLORS.primary.main} 0%, ${PAFT_COLORS.secondary.main} 100%)`,
  '--paft-gradient-light': `linear-gradient(135deg, ${PAFT_COLORS.primary.light} 0%, ${PAFT_COLORS.secondary.light} 100%)`,

  // Shadow Colors
  '--paft-shadow-primary': `rgba(6, 182, 212, 0.3)`,
  '--paft-shadow-secondary': `rgba(37, 99, 235, 0.3)`,
} as const;

/**
 * Tailwind CSS class names for PAFT colors
 * Use these for consistent styling with Tailwind
 */
export const PAFT_TAILWIND_CLASSES = {
  // Background Classes
  bg: {
    primary: 'bg-paft-primary',
    primaryLight: 'bg-paft-primary-light',
    primaryDark: 'bg-paft-primary-dark',
    secondary: 'bg-paft-secondary',
    secondaryLight: 'bg-paft-secondary-light',
    secondaryDark: 'bg-paft-secondary-dark',
    gradient: 'bg-paft-gradient',
    gradientLight: 'bg-paft-gradient-light',
  },

  // Text Classes
  text: {
    primary: 'text-paft-primary',
    primaryLight: 'text-paft-primary-light',
    primaryDark: 'text-paft-primary-dark',
    secondary: 'text-paft-secondary',
    secondaryLight: 'text-paft-secondary-light',
    secondaryDark: 'text-paft-secondary-dark',
  },

  // Border Classes
  border: {
    primary: 'border-paft-primary',
    secondary: 'border-paft-secondary',
    light: 'border-paft-light',
  },

  // Ring Classes (for focus states)
  ring: {
    primary: 'ring-paft-primary',
    secondary: 'ring-paft-secondary',
  },

  // Shadow Classes
  shadow: {
    primary: 'shadow-paft-primary',
    secondary: 'shadow-paft-secondary',
  },

  // Hover Classes
  hover: {
    bgPrimary: 'hover:bg-paft-primary',
    bgPrimaryDark: 'hover:bg-paft-primary-dark',
    bgSecondary: 'hover:bg-paft-secondary',
    bgSecondaryDark: 'hover:bg-paft-secondary-dark',
    textPrimary: 'hover:text-paft-primary',
    textSecondary: 'hover:text-paft-secondary',
  },
} as const;

/**
 * Helper function to get color value by path
 * Example: getColor('primary.main') returns '#06B6D4'
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: unknown = PAFT_COLORS;

  for (const key of keys) {
    value = (value as Record<string, unknown>)[key];
    if (value === undefined) {
      throw new Error(`Color path "${path}" not found`);
    }
  }

  return value as string;
}

/**
 * Helper function to generate rgba color with opacity
 * Example: getRgbaColor('primary.main', 0.5) returns 'rgba(6, 182, 212, 0.5)'
 */
export function getRgbaColor(path: string, opacity: number): string {
  const color = getColor(path);
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}