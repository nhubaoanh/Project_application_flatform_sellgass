export const Sizes = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border Radius
  radiusXs: 4,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusRound: 50,
  
  // Font Sizes
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontSizeTitle: 28,
  fontSizeLarge: 32,
  
  // Line Heights
  lineHeightXs: 16,
  lineHeightSm: 20,
  lineHeightMd: 24,
  lineHeightLg: 28,
  lineHeightXl: 32,
  lineHeightXxl: 36,
  
  // Icon Sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,
  iconXxl: 48,
  
  // Button Heights
  buttonHeightSm: 36,
  buttonHeightMd: 44,
  buttonHeightLg: 52,
  
  // Input Heights
  inputHeightSm: 36,
  inputHeightMd: 44,
  inputHeightLg: 52,
  
  // Card Dimensions
  cardPadding: 16,
  cardMargin: 8,
  cardBorderRadius: 12,
  
  // Header Heights
  headerHeight: 56,
  tabBarHeight: 49,
  drawerWidth: 280,
  
  // Screen Dimensions
  screenPadding: 16,
  screenMargin: 8,
  
  // Shadow
  shadowOffset: 4,
  shadowRadius: 8,
  shadowOpacity: 0.1,
} as const;

export type SizeKey = keyof typeof Sizes;
