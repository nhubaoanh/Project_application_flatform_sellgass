export const Colors = {
  // Primary Colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Secondary Colors
  secondary: '#FF6B35',
  secondaryDark: '#E55A2B',
  secondaryLight: '#FF8A5C',
  
  // Success Colors
  success: '#34C759',
  successDark: '#28A745',
  successLight: '#5CDB7A',
  
  // Warning Colors
  warning: '#FF9500',
  warningDark: '#E6850E',
  warningLight: '#FFB340',
  
  // Error Colors
  error: '#FF3B30',
  errorDark: '#DC3545',
  errorLight: '#FF6B6B',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  grayLight: '#F2F2F7',
  grayDark: '#3A3A3C',
  
  // Background Colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Border Colors
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Brand Colors
  apple: '#007AFF',
  samsung: '#1428A0',
  xiaomi: '#FF6B35',
  huawei: '#C70039',
  oppo: '#00B4DB',
  vivo: '#FF6B6B',
  
  // Status Colors
  online: '#34C759',
  offline: '#8E8E93',
  busy: '#FF3B30',
  
  // Rating Colors
  star: '#FFD700',
  starEmpty: '#E5E5EA',
} as const;

export type ColorKey = keyof typeof Colors;
