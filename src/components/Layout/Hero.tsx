'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

const Hero = () => {
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartChatting = () => {
    window.location.href = '/chat';
  };

  const handleDownloadApp = () => {
    alert('App download would start here!');
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.08 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 180,
        duration: 0.4
      }
    }
  };

  const FloatingSphere = ({ delay, size, position, color }) => (
    <motion.div
      className={`absolute rounded-full opacity-20 blur-sm ${color}`}
      style={{ width: size, height: size, ...position }}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6, delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
    />
  );

  const BackgroundGradient = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900" />
      <motion.div
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 dark:from-blue-400/30 dark:to-purple-600/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 dark:from-purple-400/30 dark:to-pink-600/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  const titleText = 'Experience AI-Powered';
  const highlightedText = 'Conversations';

  return (
    <motion.div
      ref={heroRef}
      style={{ opacity }}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-gray-900 dark:text-white"
    >
      <BackgroundGradient />

      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
        <FloatingSphere delay={0} size="96px" position={{ top: '20%', right: '15%' }} color="bg-gradient-to-br from-blue-400 to-purple-500" />
        <FloatingSphere delay={2} size="64px" position={{ bottom: '30%', left: '10%' }} color="bg-gradient-to-br from-purple-400 to-pink-500" />
        <FloatingSphere delay={4} size="128px" position={{ top: '40%', left: '5%' }} color="bg-gradient-to-br from-indigo-400 to-blue-500" />
        <FloatingSphere delay={1} size="80px" position={{ bottom: '20%', right: '20%' }} color="bg-gradient-to-br from-pink-400 to-purple-500" />
      </div>

      <motion.div style={{ y }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-8 px-6 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full backdrop-blur-sm border border-blue-500/20 dark:border-blue-400/30 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Next Generation AI Platform
              </span>
            </div>
          </motion.div>

          <motion.div variants={titleVariants} initial="hidden" animate="visible" className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="block mb-4">
                {titleText.split('').map((char, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {highlightedText.split('').map((char, index) => (
                    <motion.span key={index} variants={letterVariants} className="inline-block">
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 h-3 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-blue-400/40 dark:to-purple-400/40 rounded-full transform -rotate-1"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 2, duration: 1, ease: 'easeOut' }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.2 }}>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Reformation AI delivers intelligent, context-aware responses for natural conversations that feel human-like and insightful.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.75 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <button
                onClick={handleStartChatting}
                className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-2xl border border-transparent"
              >
                <span>Start Chatting</span>
              </button>
            </motion.div>

            <motion.button
              onClick={handleDownloadApp}
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Download App</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 2.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="relative z-10 w-[90%] md:w-[80%] lg:w-[70%] max-w-5xl mx-auto"
      >
        {/* Colored Dots - from provided code */}
        <div className="absolute -top-6 left-0 flex space-x-2">
          <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
          <span className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse delay-150" />
          <span className="w-4 h-4 rounded-full bg-green-500 animate-pulse delay-300" />
        </div>

        {mounted && (
  <Image
    src={theme === 'dark' ? '/images/ui-preview-dark.webp' : '/images/ui-preview.webp'}
    alt="Reformation AI Interface"
    width={1200}
    height={800}
    className="w-full h-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
  />
)}

      </motion.div>
    </motion.div>
  );
};

export default Hero;