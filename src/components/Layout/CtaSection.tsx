'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CtaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Blurred background elements - only render when mounted to prevent hydration issues */}
      {mounted && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/5 via-transparent to-purple-500/5" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl blur-xl opacity-80" />
          </div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-indigo-500/20 rounded-full opacity-50"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-purple-500/20 rounded-full opacity-50"></div>
          <div className="absolute bottom-40 right-40 w-32 h-32 border border-indigo-500/10 rounded-full opacity-30"></div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-sm shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"
          >
            Ready to Transform Your AI Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[var(--muted)] mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of users who are already experiencing the power of Reformation AI. Get started today and see the difference for yourself.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link 
              href="/signup" 
              className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 text-center hover:translate-y-[-2px] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10">Get Started Free</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-30"></span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-4 bg-[var(--card)] hover:bg-[var(--accent-background)] border border-[var(--border)] text-[var(--text)] font-medium rounded-xl shadow-lg hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 text-center hover:translate-y-[-2px]"
            >
              View Live Demo
            </Link>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-sm text-[var(--muted)] italic"
          >
            No credit card required. Free plan includes all essential features.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
