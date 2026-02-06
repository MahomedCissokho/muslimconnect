/**
 * Polices de l'application Muslim Universe
 */
export const FONTS = {
  // Poppins - Texte latin
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  
  // Amiri - Texte arabe
  arabic: 'Amiri_400Regular',
  arabicBold: 'Amiri_700Bold',
} as const;

export type FontKey = keyof typeof FONTS;

/**
 * Tailles de police
 */
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;
