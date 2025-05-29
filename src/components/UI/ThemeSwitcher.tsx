'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { LightModeIcon, DarkModeIcon, SystemModeIcon } from './ThemeIcons';
import { IoChevronDown } from 'react-icons/io5';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get current theme icon and name
  const getCurrentThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'system':
        return <SystemModeIcon />;
      default:
        return <LightModeIcon />;
    }
  };
  
  const getCurrentThemeName = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm font-medium text-[var(--text)]">Appearance</div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-[var(--global-radius)] bg-[var(--background)] border border-[var(--border)] transition-all duration-200 hover:bg-opacity-80"
        >
          <div className="flex items-center gap-2">
            {getCurrentThemeIcon()}
            <span className="text-sm text-[var(--text)]">{getCurrentThemeName()}</span>
          </div>
          <IoChevronDown size={16} className="text-[var(--text)]" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-[var(--global-radius)] shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--background)] transition-all ${
                theme === 'light' ? 'bg-[var(--background)]' : ''
              }`}
            >
              <LightModeIcon />
              <span className="text-sm text-[var(--text)]">Light</span>
            </button>
            
            <button
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--background)] transition-all ${
                theme === 'dark' ? 'bg-[var(--background)]' : ''
              }`}
            >
              <DarkModeIcon />
              <span className="text-sm text-[var(--text)]">Dark</span>
            </button>
            
            <button
              onClick={() => {
                setTheme('system');
                setIsOpen(false);
              }}
              className={`w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--background)] transition-all ${
                theme === 'system' ? 'bg-[var(--background)]' : ''
              }`}
            >
              <SystemModeIcon />
              <span className="text-sm text-[var(--text)]">System</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;