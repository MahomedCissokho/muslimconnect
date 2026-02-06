/**
 * Couleurs de l'application Muslim Universe
 */
export const COLORS = {
  // Couleurs principales
  primary: '#040C23',
  secondary: '#121A3A',
  
  // Accent
  gold: '#F9BD64',
  purple: '#672CBC',
  purpleLight: '#9879E9',
  
  // Neutres
  white: '#FFFFFF',
  black: '#000000',
  
  // Gris
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  
  // Bordures
  border: '#1F2937',
  
  // États
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  
  // Transparents
  whiteAlpha70: 'rgba(255, 255, 255, 0.7)',
  whiteAlpha15: 'rgba(255, 255, 255, 0.15)',
  blackAlpha50: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKey = keyof typeof COLORS;
