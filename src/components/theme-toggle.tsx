import React from 'react';
import { Icon, Box } from 'zmp-ui';
import { useTheme } from '../contexts/theme-context';

export const ThemeToggle: React.FC = () => {
  const { effectiveTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 active:scale-95"
      aria-label="Toggle theme"
      style={{
        boxShadow: effectiveTheme === 'dark' 
          ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box className="relative w-6 h-6 flex items-center justify-center">
        {effectiveTheme === 'light' ? (
          <Icon 
            icon="zi-moon" 
            size={20} 
            className="text-gray-700 transition-transform duration-200 hover:rotate-12" 
          />
        ) : (
          <Icon 
            icon="zi-sun" 
            size={20} 
            className="text-yellow-400 transition-transform duration-200 hover:rotate-90" 
          />
        )}
      </Box>
    </button>
  );
};
