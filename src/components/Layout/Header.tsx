'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { FiMenu, FiX, FiMoon, FiSun, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { name: 'Docs', href: '/docs' },
  ];

  // Animation variants
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  return (
    <header 
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? 'border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl shadow-sm' : 'border-transparent bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-500">Reformation</span>
              <span className="text-2xl font-bold text-[var(--text)] transition-all duration-300">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300 py-2 group text-sm font-medium tracking-wide"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link
              href="/chat"
              className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:translate-y-[-2px] text-sm font-medium group"
            >
              <span className="relative z-10">Chat Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button - Only render when mounted */}
            {mounted && (
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-indigo-500/30"
                aria-label="Toggle theme"
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 15 }}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.button>
            )}

            {/* Login Button */}
            <Link
              href="/login"
              className="hidden md:inline-flex px-5 py-2.5 bg-[var(--card)] hover:bg-[var(--accent-background)] border border-[var(--border)] text-[var(--text)] rounded-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-md hover:translate-y-[-2px] text-sm font-medium"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="hidden md:inline-flex px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:translate-y-[-2px] text-sm font-medium"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2.5 rounded-md text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300 hover:bg-[var(--accent-background)]"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden border-t border-[var(--border)]"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <nav className="flex flex-col py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300 px-2 py-2 hover:bg-[var(--accent-background)] rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/chat"
                  className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat Now
                </Link>
                <div className="flex flex-col space-y-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    href="/login"
                    className="px-4 py-3 bg-[var(--card)] hover:bg-[var(--accent-background)] border border-[var(--border)] text-[var(--text)] rounded-lg transition-all duration-300 hover:border-indigo-500/30 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
