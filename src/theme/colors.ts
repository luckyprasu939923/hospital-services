export const colors = {
  primary: '#5AB31C', // OneBuddy Brand Green (from logo)
  primaryLight: '#EBF8E4', // Soft green tint
  primaryDark: '#418B11', // Deep forest green
  primaryGradientStart: '#66C325',
  primaryGradientEnd: '#4B9B14',

  secondary: '#161C22', // OneBuddy Charcoal Black (from logo)
  secondaryLight: '#26303B',
  secondaryMuted: '#4F5B68',

  accent: '#5AB31C', // Brand Green
  accentLight: '#F0FCE9',
  accentGold: '#F59E0B', // Star ratings & badges
  accentGoldLight: '#FEF3C7',

  // Medical specific brand accents
  medicalBlue: '#0EA5E9', // Doctor / Online Consultation (Lighter color)
  doctorBanner: '#38BDF8', // Light sky blue for doctor banner
  medicalBlueDark: '#0284C7',
  medicalBlueLight: '#E0F2FE',
  hospitalRed: '#E11D48', // Hospital / Emergency / OP
  hospitalRedLight: '#FFE4E6',
  pharmacyTeal: '#0D9488', // Pharmacy / Medicine Delivery
  pharmacyTealLight: '#CCFBF1',

  background: '#F6F9F5', // Fresh modern light background
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111821', // Dark text
  textSecondary: '#4B5563',
  textMuted: '#8E9BA8',
  border: '#E2E9DF',
  borderLight: '#EEF4EC',
  divider: '#E4EDE2',

  // Status Colors
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#DBEAFE',
  purple: '#7C3AED',
  purpleLight: '#F3E8FF',
  teal: '#0D9488',
  tealLight: '#CCFBF1',

  // Shadows & Overlays
  overlay: 'rgba(0, 0, 0, 0.55)',
  shadow: '#111821',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const typography = {
  titleLarge: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  titleMedium: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  titleSmall: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  bodyLarge: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
};
