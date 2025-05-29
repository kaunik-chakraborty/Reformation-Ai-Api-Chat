'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Ensure we're only rendering client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}