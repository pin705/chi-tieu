import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStorage, setStorage } from 'zmp-sdk';
import { Theme } from '../types/theme';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await getStorage({ keys: ['theme'] });
        if (stored.theme) {
          setThemeState(stored.theme as Theme);
        }
      } catch (error) {
        console.warn('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Apply theme
  useEffect(() => {
    let newEffectiveTheme: 'light' | 'dark' = 'light';

    if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newEffectiveTheme = prefersDark ? 'dark' : 'light';
    } else {
      newEffectiveTheme = theme;
    }

    setEffectiveTheme(newEffectiveTheme);

    // Apply to DOM
    if (newEffectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await setStorage({
        data: { theme: newTheme },
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
