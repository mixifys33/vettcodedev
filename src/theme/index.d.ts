/**
 * VettCode Design System - TypeScript Definitions
 * For better IDE autocomplete and type safety
 */

import { Theme } from '@mui/material/styles'

// Theme
declare const theme: Theme
export default theme

// Tokens
export interface Colors {
  primary: string
  primaryDark: string
  primaryLight: string
  primaryBg: string
  slate50: string
  slate100: string
  slate200: string
  slate300: string
  slate400: string
  slate500: string
  slate600: string
  slate700: string
  slate800: string
  slate900: string
  success: string
  successBg: string
  successText: string
  error: string
  errorBg: string
  errorText: string
  warning: string
  warningBg: string
  warningText: string
  info: string
  infoBg: string
  infoText: string
  pageBackground: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  textDisabled: string
  textHint: string
  border: string
  divider: string
}

export interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
}

export interface FontFamily {
  primary: string
  mono: string
}

export interface FontSize {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface FontWeight {
  normal: number
  medium: number
  semibold: number
  bold: number
}

export interface LineHeight {
  tight: number
  normal: number
  relaxed: number
}

export interface LetterSpacing {
  tighter: string
  tight: string
  normal: string
  wide: string
  wider: string
  widest: string
}

export interface BorderRadius {
  none: string
  sm: string
  base: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface Shadows {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  inner: string
  focus: string
}

export interface Transitions {
  fast: string
  base: string
  slow: string
}

export interface ZIndex {
  base: number
  dropdown: number
  sticky: number
  fixed: number
  modalBackdrop: number
  modal: number
  popover: number
  tooltip: number
}

export interface Breakpoints {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface IconSize {
  xs: number
  sm: number
  base: number
  lg: number
  xl: number
}

export interface Status {
  active: { bg: string; text: string; border: string }
  pending: { bg: string; text: string; border: string }
  inactive: { bg: string; text: string; border: string }
  error: { bg: string; text: string; border: string }
  draft: { bg: string; text: string; border: string }
}

export const colors: Colors
export const spacing: Spacing
export const fontFamily: FontFamily
export const fontSize: FontSize
export const fontWeight: FontWeight
export const lineHeight: LineHeight
export const letterSpacing: LetterSpacing
export const borderRadius: BorderRadius
export const shadows: Shadows
export const transitions: Transitions
export const zIndex: ZIndex
export const breakpoints: Breakpoints
export const iconSize: IconSize
export const status: Status

export function getSpacing(multiplier: number): string
export function createShadow(y?: number, blur?: number, opacity?: number): string
export function createFocusRing(color?: string): string

// Components
export { default as components } from './components'
