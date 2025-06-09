
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LIGHT_THEME, DARK_THEME, ThemeColors } from '@/constants/themes';

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
  };

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Convert HSL to RGB if needed, or use direct values
        root.style.setProperty(`--theme-${key}`, value);
      }
    });
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
