'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 hover:border-indigo-500/30 hover:shadow-md hover:scale-105"
      aria-label={label}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={18} />
    </motion.a>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      href={href} 
      className="text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 text-sm group flex items-center"
    >
      <span className="relative">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600/70 to-indigo-400/70 transition-all duration-300 group-hover:w-full"></span>
      </span>
      <motion.span 
        className="opacity-0 transform translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 0, x: 0 }}
        whileHover={{ opacity: 1, x: 4 }}
      >
        <FiArrowRight className="ml-1 inline-block" size={12} />
      </motion.span>
    </Link>
  </li>
);

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t border-[var(--border)] bg-[var(--background)]">
      {/* Blurred background elements - only render after mounting to prevent hydration issues */}
      {mounted && (
        <>
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-600/10 to-purple-500/10 rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-full blur-3xl opacity-70" />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-500">Reformation</span>
              <span className="text-xl font-bold text-[var(--text)] transition-all duration-300">AI</span>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Revolutionizing AI interactions with a powerful, customizable chat interface that adapts to your needs.
            </p>
            <div className="flex space-x-3 pt-2">
              <SocialLink href="https://github.com" icon={FiGithub} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={FiTwitter} label="Twitter" />
              <SocialLink href="https://linkedin.com" icon={FiLinkedin} label="LinkedIn" />
              <SocialLink href="https://instagram.com" icon={FiInstagram} label="Instagram" />
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-[var(--text)] font-semibold mb-5 text-base">Product</h3>
            <ul className="space-y-3.5">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/integrations">Integrations</FooterLink>
              <FooterLink href="/changelog">Changelog</FooterLink>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-[var(--text)] font-semibold mb-5 text-base">Resources</h3>
            <ul className="space-y-3.5">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/api">API Reference</FooterLink>
              <FooterLink href="/tutorials">Tutorials</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[var(--text)] font-semibold mb-5 text-base">Company</h3>
            <ul className="space-y-3.5">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/press">Press</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-14 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--muted)] text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Reformation AI. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 text-sm group relative">
              <span>Privacy Policy</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600/70 to-indigo-400/70 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/terms" className="text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 text-sm group relative">
              <span>Terms of Service</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600/70 to-indigo-400/70 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/cookies" className="text-[var(--muted)] hover:text-[var(--text)] transition-all duration-300 text-sm group relative">
              <span>Cookie Policy</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600/70 to-indigo-400/70 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;