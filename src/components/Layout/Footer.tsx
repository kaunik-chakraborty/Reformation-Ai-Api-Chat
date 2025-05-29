'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border)] relative">
      {/* Blurred background elements - only render when mounted to prevent hydration issues */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-primary">Reformation</span>
              <span className="text-xl font-bold text-[var(--heading)]">AI</span>
            </Link>
            <p className="text-[var(--muted)] mb-6">
              Building the next generation of AI assistants that understand context, learn from interactions, and deliver meaningful results.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://github.com" icon={<FiGithub size={20} />} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={<FiTwitter size={20} />} label="Twitter" />
              <SocialLink href="https://linkedin.com" icon={<FiLinkedin size={20} />} label="LinkedIn" />
              <SocialLink href="mailto:info@example.com" icon={<FiMail size={20} />} label="Email" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--heading)] mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/download">Download</FooterLink>
              <FooterLink href="/updates">Updates</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--heading)] mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/tutorials">Tutorials</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--heading)] mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/legal">Legal</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--muted)] text-sm mb-4 md:mb-0">
            © {currentYear} Reformation AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <FooterLink href="/privacy" className="text-sm">Privacy Policy</FooterLink>
            <FooterLink href="/terms" className="text-sm">Terms of Service</FooterLink>
            <FooterLink href="/cookies" className="text-sm">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-hover)] transition-colors duration-200"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => {
  return (
    <li>
      <Link
        href={href}
        className={`text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200 ${className}`}
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;