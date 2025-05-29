'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Docs', href: '/docs' }, // Changed from Contact to Docs
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Reformation</span>
              <span className="text-2xl font-bold text-[var(--heading)]">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/chat"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              Chat Now
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button - Only render when mounted */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            )}

            {/* Login Button */}
            <Link
              href="/login"
              className="hidden md:inline-flex px-4 py-2 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--border)] text-[var(--text)] rounded-lg transition-colors duration-200"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="hidden md:inline-flex px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200 px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                  href="/chat"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat Now
                </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-[var(--border)]">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--border)] text-[var(--text)] rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
