/**
 * VettCode Component Library
 * Pre-styled, reusable components following the design system
 */

import { styled } from '@mui/material/styles'
import { Box, Button, TextField, Card, Chip, Alert } from '@mui/material'
import { colors, spacing, borderRadius, shadows, transitions } from './tokens'

// ============================================================================
// CONTAINERS
// ============================================================================

/**
 * Page Container - Main content wrapper
 */
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: spacing.lg,
  maxWidth: '1400px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    padding: spacing.md,
  },
}))

/**
 * Section Container - Content sections
 */
export const Section = styled(Box)(({ theme }) => ({
  marginBottom: spacing['2xl'],
}))

/**
 * Grid Container - Responsive grid layout
 */
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: spacing.lg,
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: spacing.md,
  },
}))

// ============================================================================
// CARDS
// ============================================================================

/**
 * Standard Card - Clean, bordered card
 */
export const StyledCard = styled(Card)({
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.sm,
  padding: spacing.lg,
  transition: transitions.fast,
  '&:hover': {
    borderColor: colors.slate300,
    boxShadow: shadows.md,
  },
})

/**
 * Stat Card - For displaying metrics
 */
export const StatCard = styled(Box)({
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  transition: transitions.fast,
  '&:hover': {
    borderColor: colors.primary,
    boxShadow: shadows.md,
    transform: 'translateY(-2px)',
  },
})

/**
 * Elevated Card - Card with more prominence
 */
export const ElevatedCard = styled(Card)({
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.lg,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.lg,
  padding: spacing.xl,
})

// ============================================================================
// BUTTONS
// ============================================================================

/**
 * Primary Button - Main action button
 */
export const PrimaryButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  borderRadius: borderRadius.base,
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: `${shadows.xs}, ${shadows.inner}`,
  transition: transitions.fast,
  '&:hover': {
    backgroundColor: colors.primaryDark,
    boxShadow: `${shadows.sm}, ${shadows.inner}`,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    backgroundColor: colors.slate200,
    color: colors.slate400,
  },
})

/**
 * Secondary Button - Alternative action
 */
export const SecondaryButton = styled(Button)({
  backgroundColor: 'transparent',
  color: colors.slate700,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.base,
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: transitions.fast,
  '&:hover': {
    backgroundColor: colors.slate50,
    borderColor: colors.primary,
    color: colors.primary,
  },
})

/**
 * Danger Button - Destructive actions
 */
export const DangerButton = styled(Button)({
  backgroundColor: colors.error,
  color: '#FFFFFF',
  borderRadius: borderRadius.base,
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: shadows.xs,
  transition: transitions.fast,
  '&:hover': {
    backgroundColor: '#DC2626',
    boxShadow: shadows.sm,
  },
})

/**
 * Icon Button - Minimal button with icon
 */
export const IconButton = styled(Button)({
  minWidth: 'auto',
  width: '40px',
  height: '40px',
  padding: 0,
  borderRadius: borderRadius.base,
  color: colors.slate600,
  transition: transitions.fast,
  '&:hover': {
    backgroundColor: colors.slate50,
    color: colors.primary,
  },
})

// ============================================================================
// INPUTS
// ============================================================================

/**
 * Standard Input - Clean text field
 */
export const StyledInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.base,
    transition: transitions.fast,
    '& fieldset': {
      borderColor: colors.border,
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: colors.slate300,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
      borderWidth: '1px',
      boxShadow: shadows.focus,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
    fontSize: '0.875rem',
    color: colors.textPrimary,
    '&::placeholder': {
      color: colors.textDisabled,
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.textSecondary,
    fontSize: '0.875rem',
    fontWeight: 500,
    '&.Mui-focused': {
      color: colors.primary,
    },
  },
})

/**
 * Search Input - Input with search styling
 */
export const SearchInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.slate50,
    borderRadius: borderRadius.md,
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: colors.cardBackground,
    },
    '&.Mui-focused': {
      backgroundColor: colors.cardBackground,
      boxShadow: `0 0 0 2px ${colors.primaryBg}`,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
    fontSize: '0.875rem',
  },
})

// ============================================================================
// BADGES & CHIPS
// ============================================================================

/**
 * Status Badge - For displaying status
 */
export const StatusBadge = styled(Chip)(({ status = 'active' }) => {
  const statusColors = {
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

  const statusStyle = statusColors[status] || statusColors.active

  return {
    backgroundColor: statusStyle.bg,
    color: statusStyle.text,
    border: `1px solid ${statusStyle.border}`,
    borderRadius: borderRadius.base,
    fontSize: '0.75rem',
    fontWeight: 500,
    height: '24px',
    padding: '0 8px',
    '& .MuiChip-label': {
      padding: 0,
    },
  }
})

/**
 * Count Badge - For displaying counts
 */
export const CountBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  borderRadius: borderRadius.full,
  fontSize: '0.75rem',
  fontWeight: 600,
  minWidth: '20px',
  height: '20px',
  padding: '0 6px',
})

// ============================================================================
// ALERTS & NOTIFICATIONS
// ============================================================================

/**
 * Success Alert
 */
export const SuccessAlert = styled(Alert)({
  backgroundColor: colors.successBg,
  color: colors.successText,
  border: `1px solid ${colors.success}`,
  borderRadius: borderRadius.md,
  fontSize: '0.875rem',
  '& .MuiAlert-icon': {
    color: colors.successText,
  },
})

/**
 * Error Alert
 */
export const ErrorAlert = styled(Alert)({
  backgroundColor: colors.errorBg,
  color: colors.errorText,
  border: `1px solid ${colors.error}`,
  borderRadius: borderRadius.md,
  fontSize: '0.875rem',
  '& .MuiAlert-icon': {
    color: colors.errorText,
  },
})

/**
 * Warning Alert
 */
export const WarningAlert = styled(Alert)({
  backgroundColor: colors.warningBg,
  color: colors.warningText,
  border: `1px solid ${colors.warning}`,
  borderRadius: borderRadius.md,
  fontSize: '0.875rem',
  '& .MuiAlert-icon': {
    color: colors.warningText,
  },
})

/**
 * Info Alert
 */
export const InfoAlert = styled(Alert)({
  backgroundColor: colors.infoBg,
  color: colors.infoText,
  border: `1px solid ${colors.info}`,
  borderRadius: borderRadius.md,
  fontSize: '0.875rem',
  '& .MuiAlert-icon': {
    color: colors.infoText,
  },
})

// ============================================================================
// DIVIDERS
// ============================================================================

/**
 * Section Divider - Subtle divider between sections
 */
export const SectionDivider = styled(Box)({
  height: '1px',
  backgroundColor: colors.divider,
  margin: `${spacing.xl} 0`,
})

/**
 * Vertical Divider
 */
export const VerticalDivider = styled(Box)({
  width: '1px',
  backgroundColor: colors.divider,
  height: '100%',
})

// ============================================================================
// TABLES
// ============================================================================

/**
 * Table Container - Wrapper for tables
 */
export const TableContainer = styled(Box)({
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  overflow: 'hidden',
})

/**
 * Table Header Cell
 */
export const TableHeaderCell = styled(Box)({
  backgroundColor: colors.slate50,
  color: colors.slate600,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: spacing.md,
  borderBottom: `1px solid ${colors.divider}`,
})

/**
 * Table Cell
 */
export const TableCell = styled(Box)({
  color: colors.slate700,
  fontSize: '0.875rem',
  padding: spacing.md,
  borderBottom: `1px solid ${colors.divider}`,
})

// ============================================================================
// EMPTY STATES
// ============================================================================

/**
 * Empty State Container
 */
export const EmptyState = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing['3xl'],
  textAlign: 'center',
  color: colors.textSecondary,
})

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Skeleton Box - Loading placeholder
 */
export const SkeletonBox = styled(Box)({
  backgroundColor: colors.slate100,
  borderRadius: borderRadius.base,
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
})

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Flex Row - Horizontal flex container
 */
export const FlexRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
})

/**
 * Flex Column - Vertical flex container
 */
export const FlexColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
})

/**
 * Spacer - Flexible space between elements
 */
export const Spacer = styled(Box)({
  flex: 1,
})

/**
 * Page Header - Consistent page header
 */
export const PageHeader = styled(Box)({
  marginBottom: spacing.xl,
  paddingBottom: spacing.lg,
  borderBottom: `1px solid ${colors.divider}`,
})

/**
 * Page Title
 */
export const PageTitle = styled('h1')({
  fontSize: '2.25rem',
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: '-0.01em',
  color: colors.textPrimary,
  margin: 0,
})

/**
 * Page Subtitle
 */
export const PageSubtitle = styled('p')({
  fontSize: '1rem',
  lineHeight: 1.5,
  color: colors.textSecondary,
  margin: `${spacing.sm} 0 0 0`,
})

/**
 * Section Title
 */
export const SectionTitle = styled('h2')({
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.005em',
  color: colors.textPrimary,
  margin: `0 0 ${spacing.md} 0`,
})

/**
 * Label - Form labels and small headings
 */
export const Label = styled('label')({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.textSecondary,
  display: 'block',
  marginBottom: spacing.xs,
})

/**
 * Helper Text - Small descriptive text
 */
export const HelperText = styled('p')({
  fontSize: '0.75rem',
  lineHeight: 1.4,
  color: colors.textSecondary,
  margin: `${spacing.xs} 0 0 0`,
})

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Containers
  PageContainer,
  Section,
  GridContainer,
  
  // Cards
  StyledCard,
  StatCard,
  ElevatedCard,
  
  // Buttons
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  IconButton,
  
  // Inputs
  StyledInput,
  SearchInput,
  
  // Badges
  StatusBadge,
  CountBadge,
  
  // Alerts
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  
  // Dividers
  SectionDivider,
  VerticalDivider,
  
  // Tables
  TableContainer,
  TableHeaderCell,
  TableCell,
  
  // States
  EmptyState,
  SkeletonBox,
  
  // Utilities
  FlexRow,
  FlexColumn,
  Spacer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionTitle,
  Label,
  HelperText,
}
