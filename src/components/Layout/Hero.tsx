'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/UI/Button';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation for the background gradient - only run on client
  useEffect(() => {
    if (!mounted || !heroRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.08
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  const titleText = "Experience AI-Powered";
  const highlightedText = "Conversations";

  // Determine which UI preview to show based on theme
  const uiPreviewSrc = mounted ? 
    (theme === 'dark' ? '/images/ui-preview-dark.png' : '/images/ui-preview.png') : 
    '/images/ui-preview.png';

  // Determine which background blur to show based on theme
  const blurBgSrc = mounted ? 
    (theme === 'dark' ? '/images/blur-bg-dark.svg' : '/images/blur-bg.svg') : 
    '/images/blur-bg.svg';

  return (
    <motion.div 
      ref={heroRef}
      style={{ opacity }}
      className="relative min-h-[120vh] md:min-h-[110vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 md:pb-0"
    >
      {/* Background blur image - conditionally rendered based on mounted state */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src={blurBgSrc}
            alt="Background blur"
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Dynamic gradient background - only render on client to avoid hydration mismatch */}
      {mounted && (
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[var(--background)]"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--primary-light, rgba(79, 70, 229, 0.15)) 0%, transparent 60%)`
          }}
        />
      )}

      {/* Content */}
      <motion.div 
        style={{ y }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            ref={textRef}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text)] leading-tight">
              {/* Animated text with letter-by-letter animation */}
              <span className="block mb-2">
                {titleText.split('').map((char, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
              <span className="text-primary relative inline-block">
                {highlightedText.split('').map((char, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
                <motion.span 
                  className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform -rotate-1"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto">
              Reformation AI delivers intelligent, context-aware responses for natural conversations that feel human-like and insightful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/chat" className="w-full sm:w-auto">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 border-none shadow-lg shadow-primary/20 dark:shadow-primary/10"
                rightIcon={<FiArrowRight />}
              >
                Start Chatting
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-primary/30 hover:bg-primary/5"
              leftIcon={<FiDownload />}
              onClick={() => {
                alert('Download functionality would be implemented here');
              }}
            >
              Download App
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating UI Preview - only render when mounted to avoid hydration issues */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.0, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative z-10 mt-12 md:mt-16 lg:mt-24 w-[95%] md:w-[85%] lg:w-[75%] max-w-6xl mx-auto"
        >
          <div className="bg-white/5 dark:bg-black/10 backdrop-blur-md p-3 rounded-t-lg shadow-2xl shadow-primary/10 dark:shadow-black/20 flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-2 md:p-4 rounded-b-lg shadow-2xl shadow-primary/10 dark:shadow-black/20 overflow-hidden">
            <Image 
              src={uiPreviewSrc}
              alt="App Interface Preview"
              width={1200}
              height={800}
              className="w-full h-auto rounded object-cover"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 md:bottom-10"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-[var(--text)] rounded-full flex justify-center p-1"
        >
          <motion.div 
            animate={{ height: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 bg-[var(--text)] rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
