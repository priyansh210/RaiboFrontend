
export const LIGHT_THEME = {
  // Background colors
  background: 'hsl(30, 30%, 98%)',
  foreground: 'hsl(20, 10%, 5%)',
  
  // Card colors
  card: 'hsl(30, 30%, 98%)',
  cardForeground: 'hsl(20, 10%, 5%)',
  
  // Primary colors
  primary: 'hsl(16, 59%, 58%)', // terracotta
  primaryForeground: 'hsl(30, 30%, 98%)',
  
  // Secondary colors
  secondary: 'hsl(32, 25%, 94%)', // sand
  secondaryForeground: 'hsl(20, 10%, 5%)',
  
  // Muted colors
  muted: 'hsl(30, 10%, 92%)',
  mutedForeground: 'hsl(20, 10%, 40%)',
  
  // Accent colors
  accent: 'hsl(32, 25%, 94%)',
  accentForeground: 'hsl(20, 10%, 5%)',
  
  // Border and input
  border: 'hsl(20, 10%, 90%)',
  input: 'hsl(20, 10%, 90%)',
  ring: 'hsl(16, 59%, 58%)',
  
  // Custom brand colors
  terracotta: '#D27D56',
  sand: '#F7F3ED',
  umber: '#9E6A5F',
  taupe: '#B9B0A2',
  olive: '#595C3C',
  forest: '#2C392F',
  cream: '#F9F5EC',
  charcoal: '#373737',
  linen: '#F4F1EA',
  earth: '#7D6E67'
} as const;

export const DARK_THEME = {
  // Background colors
  background: 'hsl(20, 10%, 10%)',
  foreground: 'hsl(30, 10%, 98%)',
  
  // Card colors
  card: 'hsl(20, 10%, 10%)',
  cardForeground: 'hsl(30, 10%, 98%)',
  
  // Primary colors
  primary: 'hsl(16, 59%, 58%)', // terracotta - keeping same for brand consistency
  primaryForeground: 'hsl(30, 10%, 98%)',
  
  // Secondary colors
  secondary: 'hsl(20, 10%, 20%)',
  secondaryForeground: 'hsl(30, 10%, 98%)',
  
  // Muted colors
  muted: 'hsl(20, 10%, 20%)',
  mutedForeground: 'hsl(30, 10%, 70%)',
  
  // Accent colors
  accent: 'hsl(20, 10%, 20%)',
  accentForeground: 'hsl(30, 10%, 98%)',
  
  // Border and input
  border: 'hsl(20, 10%, 20%)',
  input: 'hsl(20, 10%, 20%)',
  ring: 'hsl(16, 59%, 58%)',
  
  // Custom brand colors - darker variants
  terracotta: '#D27D56', // Keep brand color consistent
  sand: '#2A2520', // Dark sand
  umber: '#6B453F', // Darker umber
  taupe: '#4A453F', // Darker taupe
  olive: '#3D4028', // Darker olive
  forest: '#1F2823', // Darker forest
  cream: '#2B2822', // Dark cream
  charcoal: '#E5E5E5', // Light charcoal for dark theme
  linen: '#2A2721', // Dark linen
  earth: '#5A514B' // Darker earth
} as const;

// Create a proper type that represents the structure of both themes
export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
  terracotta: string;
  sand: string;
  umber: string;
  taupe: string;
  olive: string;
  forest: string;
  cream: string;
  charcoal: string;
  linen: string;
  earth: string;
};

export const getTheme = (isDark: boolean): ThemeColors => {
  return isDark ? DARK_THEME : LIGHT_THEME;
};
