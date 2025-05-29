import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('reformation-ai-theme') as Theme;
      if (storedTheme) {
        return storedTheme;
      }
    }
    // Default to system
    return 'system';
  });

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    
    // Remove previous theme classes and attributes
    root.classList.remove('light', 'dark');
    
    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
    }

    // Save to localStorage
    localStorage.setItem('reformation-ai-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      root.setAttribute('data-theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
}