/**
 * VettCode Design Tokens
 * Quick reference for design values across the application
 * Use these tokens for consistent styling outside of MUI components
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Brand
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryLight: '#6366F1',
  primaryBg: '#EEF2FF',

  // Neutrals (Slate Scale)
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',

  // Semantic Colors
  success: '#10B981',
  successBg: '#D1FAE5',
  successText: '#065F46',

  error: '#EF4444',
  errorBg: '#FEE2E2',
  errorText: '#991B1B',

  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningText: '#92400E',

  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoText: '#1E40AF',

  // Surfaces
  pageBackground: '#F8FAFC',
  cardBackground: '#FFFFFF',
  
  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  textHint: '#CBD5E1',

  // Borders & Dividers
  border: '#E2E8F0',
  divider: '#F1F5F9',
}

// ============================================================================
// SPACING (8px Grid System)
// ============================================================================

export const spacing = {
  xs: '4px',    // 0.5 unit
  sm: '8px',    // 1 unit
  md: '16px',   // 2 units
  lg: '24px',   // 3 units
  xl: '32px',   // 4 units
  '2xl': '48px', // 6 units
  '3xl': '64px', // 8 units
  '4xl': '96px', // 12 units
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const fontFamily = {
  primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"Fira Code", "Courier New", monospace',
}

export const fontSize = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
}

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
}

export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.05em',
  widest: '0.08em',
}

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}

// ============================================================================
// SHADOWS (Ambient & Subtle)
// ============================================================================

export const shadows = {
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)',
  md: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)',
  lg: '0px 10px 15px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.03)',
  xl: '0px 20px 25px rgba(0, 0, 0, 0.05), 0px 10px 10px rgba(0, 0, 0, 0.02)',
  inner: 'inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
  focus: '0 0 0 3px #EEF2FF', // Indigo halo
}

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
}

// ============================================================================
// ICON SIZES
// ============================================================================

export const iconSize = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 32,
  xl: 40,
}

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const button = {
  paddingSmall: '6px 16px',
  paddingMedium: '10px 20px',
  paddingLarge: '12px 24px',
  borderRadius: '6px',
  transition: transitions.fast,
}

export const input = {
  padding: '12px 14px',
  borderRadius: '6px',
  borderColor: colors.border,
  borderColorHover: colors.slate300,
  borderColorFocus: colors.primary,
  backgroundColor: colors.cardBackground,
  transition: transitions.fast,
}

export const card = {
  padding: '24px',
  borderRadius: '8px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.cardBackground,
  shadow: shadows.sm,
}

export const badge = {
  paddingX: '8px',
  paddingY: '2px',
  borderRadius: '6px',
  fontSize: fontSize.xs,
  fontWeight: fontWeight.medium,
}

// ============================================================================
// STATUS COLORS (For Badges, Indicators, etc.)
// ============================================================================

export const status = {
  active: {
    bg: colors.successBg,
    text: colors.successText,
    border: '#A7F3D0',
  },
  pending: {
    bg: colors.warningBg,
    text: colors.warningText,
    border: '#FDE68A',
  },
  inactive: {
    bg: colors.slate100,
    text: colors.slate700,
    border: colors.slate200,
  },
  error: {
    bg: colors.errorBg,
    text: colors.errorText,
    border: '#FECACA',
  },
  draft: {
    bg: colors.infoBg,
    text: colors.infoText,
    border: '#BFDBFE',
  },
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get spacing value by multiplier
 * @param {number} multiplier - Number of 8px units
 * @returns {string} Spacing value in pixels
 */
export const getSpacing = (multiplier) => `${multiplier * 8}px`

/**
 * Create a custom shadow
 * @param {number} y - Y offset
 * @param {number} blur - Blur radius
 * @param {number} opacity - Shadow opacity (0-1)
 * @returns {string} Box shadow CSS value
 */
export const createShadow = (y = 4, blur = 6, opacity = 0.05) => 
  `0px ${y}px ${blur}px rgba(0, 0, 0, ${opacity})`

/**
 * Create a focus ring
 * @param {string} color - Ring color (default: primary)
 * @returns {string} Box shadow CSS value
 */
export const createFocusRing = (color = colors.primaryBg) => 
  `0 0 0 3px ${color}`

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  colors,
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  iconSize,
  button,
  input,
  card,
  badge,
  status,
  getSpacing,
  createShadow,
  createFocusRing,
}
