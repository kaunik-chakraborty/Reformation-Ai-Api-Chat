'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const CtaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      {/* Blurred background elements - only render when mounted to prevent hydration issues */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6"
          >
            Ready to Transform Your AI Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[var(--muted)] mb-10 max-w-3xl mx-auto"
          >
            Join thousands of users who are already experiencing the power of Reformation AI. Get started today and see the difference for yourself.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-center"
            >
              Get Started Free
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-4 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--border)] text-[var(--text)] font-medium rounded-xl shadow-lg shadow-[var(--shadow)] hover:shadow-xl hover:shadow-[var(--shadow)] transition-all duration-300 text-center"
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
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
