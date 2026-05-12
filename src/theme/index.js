import { createTheme } from '@mui/material/styles'

/**
 * VettCode Design System
 * Enterprise-grade theme inspired by Stripe and Linear
 * 
 * Philosophy:
 * - Borders over shadows for clarity
 * - Minimalist and trustworthy
 * - High contrast for accessibility
 * - Consistent spacing and rhythm
 */

// ============================================================================
// COLOR PALETTE - "The Trust Palette"
// ============================================================================

const colors = {
  // Primary Brand - Deep Indigo (Financial/Professional)
  primary: {
    main: '#4F46E5',      // Primary actions
    dark: '#4338CA',      // Hover states
    light: '#6366F1',     // Lighter variant
    50: '#EEF2FF',        // Backgrounds
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',       // Main
    700: '#4338CA',       // Dark
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutrals - Slate Scale (Modern with blue tint)
  neutral: {
    50: '#F8FAFC',        // Page background
    100: '#F1F5F9',       // Dividers (barely-there)
    200: '#E2E8F0',       // Borders
    300: '#CBD5E1',       // Disabled
    400: '#94A3B8',       // Placeholders
    500: '#64748B',       // Sub-text/labels
    600: '#475569',       // Secondary text
    700: '#334155',       // Body text
    800: '#1E293B',       // Titles
    900: '#0F172A',       // Main text (almost black)
  },

  // Success - Emerald (Desaturated & Professional)
  success: {
    main: '#10B981',
    dark: '#059669',
    light: '#34D399',
    bg: '#D1FAE5',        // Light background
    text: '#065F46',      // Dark text on light bg
  },

  // Error - Rose (Refined, not bright red)
  error: {
    main: '#EF4444',
    dark: '#DC2626',
    light: '#F87171',
    bg: '#FEE2E2',        // Light pink background
    text: '#991B1B',      // Dark red text
  },

  // Warning - Amber
  warning: {
    main: '#F59E0B',
    dark: '#D97706',
    light: '#FCD34D',
    bg: '#FEF3C7',
    text: '#92400E',
  },

  // Info - Sky Blue
  info: {
    main: '#3B82F6',
    dark: '#2563EB',
    light: '#60A5FA',
    bg: '#DBEAFE',
    text: '#1E40AF',
  },

  // Surfaces
  background: {
    default: '#F8FAFC',   // Page background (Soft Slate White)
    paper: '#FFFFFF',     // Cards, modals (Pure White)
    elevated: '#FFFFFF',  // Elevated surfaces
  },

  // Text
  text: {
    primary: '#0F172A',   // Main text
    secondary: '#64748B', // Sub-text
    disabled: '#94A3B8',  // Disabled/placeholder
    hint: '#CBD5E1',      // Hints
  },

  // Dividers
  divider: '#F1F5F9',     // Barely-there lines
}

// ============================================================================
// TYPOGRAPHY - Inter Font System
// ============================================================================

const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  
  // Headings - Tighter letter-spacing
  h1: {
    fontSize: '3rem',           // 48px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',   // Tighter
    color: colors.neutral[900],
  },
  h2: {
    fontSize: '2.25rem',        // 36px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: colors.neutral[900],
  },
  h3: {
    fontSize: '1.875rem',       // 30px
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: colors.neutral[800],
  },
  h4: {
    fontSize: '1.5rem',         // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.005em',
    color: colors.neutral[800],
  },
  h5: {
    fontSize: '1.25rem',        // 20px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0',
    color: colors.neutral[800],
  },
  h6: {
    fontSize: '1rem',           // 16px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0',
    color: colors.neutral[800],
  },

  // Body - 1.5x line-height for readability
  body1: {
    fontSize: '1rem',           // 16px
    fontWeight: 400,
    lineHeight: 1.5,            // 1.5x for readability
    letterSpacing: '0',
    color: colors.neutral[700],
  },
  body2: {
    fontSize: '0.875rem',       // 14px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
    color: colors.neutral[600],
  },

  // Utility
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
    color: colors.neutral[700],
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
    color: colors.neutral[600],
  },
  caption: {
    fontSize: '0.75rem',        // 12px
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
    color: colors.neutral[500],
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: colors.neutral[500],
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    textTransform: 'none',      // No uppercase buttons
  },
}

// ============================================================================
// SPACING - Consistent 8px Grid
// ============================================================================

const spacing = 8 // Base unit: 8px

// ============================================================================
// SHADOWS - Ambient & Subtle (Borders over Shadows)
// ============================================================================

const shadows = [
  'none',
  '0px 1px 2px rgba(0, 0, 0, 0.05)',                                    // xs - Buttons
  '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)',  // sm - Cards
  '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)',  // md - Elevated
  '0px 10px 15px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.03)', // lg - Modals
  '0px 20px 25px rgba(0, 0, 0, 0.05), 0px 10px 10px rgba(0, 0, 0, 0.02)', // xl - Drawers
  ...Array(20).fill('none'), // Fill remaining shadow levels
]

// ============================================================================
// SHAPE - Slightly Rounded (2-6px)
// ============================================================================

const shape = {
  borderRadius: 6, // Default: 6px (slightly rounded)
}

// ============================================================================
// COMPONENT OVERRIDES - "World Class" Styling
// ============================================================================

const components = {
  // ========================================
  // BUTTON - Premium Feel
  // ========================================
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        padding: '10px 20px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)', // Fast transition
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', // Subtle pressed effect
        '&:hover': {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
      containedPrimary: {
        background: colors.primary.main,
        color: '#FFFFFF',
        // Inner glow for premium feel
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
        '&:hover': {
          background: colors.primary.dark, // Slightly darker on hover
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
        },
        '&:active': {
          background: colors.primary[800],
        },
      },
      outlined: {
        borderColor: colors.neutral[200],
        color: colors.neutral[700],
        '&:hover': {
          borderColor: colors.primary.main,
          background: colors.primary[50],
        },
      },
      text: {
        color: colors.neutral[700],
        '&:hover': {
          background: colors.neutral[50],
        },
      },
      sizeLarge: {
        padding: '12px 24px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
      },
    },
  },

  // ========================================
  // INPUT FIELDS - Trust Factor
  // ========================================
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF', // White to pop against page background
        borderRadius: 6,
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.neutral[300],
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.primary.main,
          borderWidth: '1px', // Keep 1px, no thick borders
          boxShadow: `0 0 0 3px ${colors.primary[50]}`, // Indigo halo
        },
      },
      notchedOutline: {
        borderColor: colors.neutral[200], // 1px solid border
        borderWidth: '1px',
      },
      input: {
        padding: '12px 14px',
        fontSize: '0.875rem',
        color: colors.neutral[900],
        '&::placeholder': {
          color: colors.neutral[400],
          opacity: 1,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: colors.neutral[600],
        fontSize: '0.875rem',
        fontWeight: 500,
        '&.Mui-focused': {
          color: colors.primary.main,
        },
      },
    },
  },

  // ========================================
  // CARDS - Clean & Minimal
  // ========================================
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        border: `1px solid ${colors.neutral[200]}`, // Border over shadow
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', // Very subtle ambient shadow
        padding: 24, // Consistent padding
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: colors.neutral[300],
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0, // Remove default padding (handled by Card)
        '&:last-child': {
          paddingBottom: 0,
        },
      },
    },
  },

  // ========================================
  // CHIP/BADGE - Refined Status Indicators
  // ========================================
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontSize: '0.75rem',
        fontWeight: 500,
        height: 24,
        border: 'none',
      },
      filled: {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[700],
      },
      colorSuccess: {
        backgroundColor: colors.success.bg, // Light background
        color: colors.success.text,         // Dark text (refined)
      },
      colorError: {
        backgroundColor: colors.error.bg,   // Light pink, not bright red
        color: colors.error.text,           // Dark red text
      },
      colorWarning: {
        backgroundColor: colors.warning.bg,
        color: colors.warning.text,
      },
      colorInfo: {
        backgroundColor: colors.info.bg,
        color: colors.info.text,
      },
    },
  },

  // ========================================
  // DIVIDER - Barely-there
  // ========================================
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: colors.divider,
      },
    },
  },

  // ========================================
  // PAPER - Clean Surfaces
  // ========================================
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
        backgroundImage: 'none',
      },
      outlined: {
        border: `1px solid ${colors.neutral[200]}`,
      },
      elevation1: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
      },
      elevation2: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },

  // ========================================
  // TABLE - Clean Data Display
  // ========================================
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: colors.neutral[50],
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: colors.neutral[100],
        padding: '16px',
        fontSize: '0.875rem',
      },
      head: {
        color: colors.neutral[600],
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
      body: {
        color: colors.neutral[700],
      },
    },
  },

  // ========================================
  // TOOLTIP - Subtle & Helpful
  // ========================================
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: colors.neutral[900],
        color: '#FFFFFF',
        fontSize: '0.75rem',
        padding: '6px 12px',
        borderRadius: 6,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      arrow: {
        color: colors.neutral[900],
      },
    },
  },

  // ========================================
  // ALERT - Professional Notifications
  // ========================================
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        border: '1px solid',
        fontSize: '0.875rem',
        padding: '12px 16px',
      },
      standardSuccess: {
        backgroundColor: colors.success.bg,
        color: colors.success.text,
        borderColor: colors.success.light,
      },
      standardError: {
        backgroundColor: colors.error.bg,
        color: colors.error.text,
        borderColor: colors.error.light,
      },
      standardWarning: {
        backgroundColor: colors.warning.bg,
        color: colors.warning.text,
        borderColor: colors.warning.light,
      },
      standardInfo: {
        backgroundColor: colors.info.bg,
        color: colors.info.text,
        borderColor: colors.info.light,
      },
    },
  },

  // ========================================
  // SWITCH - Modern Toggle
  // ========================================
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 3,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#FFFFFF',
          '& + .MuiSwitch-track': {
            backgroundColor: colors.primary.main,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 20,
        height: 20,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
      },
      track: {
        borderRadius: 13,
        backgroundColor: colors.neutral[300],
        opacity: 1,
      },
    },
  },
}

// ============================================================================
// CREATE THEME
// ============================================================================

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      dark: colors.primary.dark,
      light: colors.primary.light,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.neutral[600],
      dark: colors.neutral[700],
      light: colors.neutral[500],
      contrastText: '#FFFFFF',
    },
    success: {
      main: colors.success.main,
      dark: colors.success.dark,
      light: colors.success.light,
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error.main,
      dark: colors.error.dark,
      light: colors.error.light,
      contrastText: '#FFFFFF',
    },
    warning: {
      main: colors.warning.main,
      dark: colors.warning.dark,
      light: colors.warning.light,
      contrastText: '#FFFFFF',
    },
    info: {
      main: colors.info.main,
      dark: colors.info.dark,
      light: colors.info.light,
      contrastText: '#FFFFFF',
    },
    background: colors.background,
    text: colors.text,
    divider: colors.divider,
  },
  typography,
  spacing,
  shadows,
  shape,
  components,
})

// ============================================================================
// EXPORT
// ============================================================================

export default theme
export { colors, typography, spacing, shadows, shape }
