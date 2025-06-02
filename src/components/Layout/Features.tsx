'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiCpu, FiClock, FiShield, FiGlobe, FiLayers, FiHardDrive, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent-background)] transition-all duration-300 shadow-sm hover:shadow-lg hover:border-indigo-500/30 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/5 to-purple-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600/10 to-indigo-400/10 flex items-center justify-center text-indigo-600 mb-5 relative z-10 shadow-sm border border-indigo-500/10 group-hover:shadow-md group-hover:border-indigo-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-[var(--text)] mb-3 relative z-10 group-hover:text-indigo-600 transition-colors duration-300">{title}</h3>
      <p className="text-[var(--muted)] relative z-10 leading-relaxed">{description}</p>
      
      <motion.div 
        className="absolute bottom-6 right-6 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatType: "loop" }}
      >
        <FiArrowRight className="text-indigo-500" size={20} />
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: false, amount: 0.1 });
  const { scrollYProgress } = useScroll({
    target: featuresRef,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuresList = [
    {
      icon: <FiCpu size={28} />,
      title: 'Advanced AI Engine',
      description: 'Leverage cutting-edge models for nuanced, context-aware interactions.'
    },
    {
      icon: <FiHardDrive size={28} />, // New Local LLM feature
      title: 'Local LLM Support',
      description: 'Run powerful language models directly on your device for ultimate privacy and offline access.'
    },
    {
      icon: <FiClock size={28} />,
      title: 'Real-time Processing',
      description: 'Experience instant responses with our highly optimized inference engine.'
    },
    {
      icon: <FiShield size={28} />,
      title: 'Ironclad Privacy',
      description: 'Your conversations are yours alone. We prioritize data security and user anonymity.'
    },
    {
      icon: <FiGlobe size={28} />,
      title: 'Global Reach',
      description: 'Communicate effortlessly in multiple languages with our robust translation capabilities.'
    },
    {
      icon: <FiLayers size={28} />,
      title: 'Deep Customization',
      description: 'Adapt the AI to your unique workflow with extensive settings and preferences.'
    }
  ];

  // Placeholder images for the gallery
  const galleryImages = [
    '/images/ui-preview.webp',
    '/images/ss1.webp',
    '/images/ss2.webp',
    '/images/ss4.webp',
    '/images/ss5.webp',
    '/images/ss6.webp',
  ];

  return (
    <section 
      id="features" 
      ref={featuresRef}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-[var(--background)] via-[var(--background-alt)] to-[var(--background)]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
          <div className="absolute top-1/3 -left-60 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-70 animate-pulse-slow animation-delay-2000" />
          <div className="absolute -bottom-60 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-70 animate-pulse-slow animation-delay-4000" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          style={{ y }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--heading)] mb-6 tracking-tight"
          >
            Powerful Features, Reimagined
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed"
          >
            Explore the core capabilities that set Reformation AI apart, designed for intuitive interaction and powerful results, including robust Local LLM support.
          </motion.p>
        </motion.div>

        {/* Feature Cards - New Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20 md:mb-28">
          {featuresList.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* Never-ending Product Image Gallery */}
        <div className="relative w-full overflow-hidden group">
          <motion.div 
            className="flex space-x-6 md:space-x-8"
            animate={{
              x: ['0%', '-100%'],
            }}
            transition={{
              ease: 'linear',
              duration: 30, // Adjust duration for speed
              repeat: Infinity,
            }}
          >
            {[...galleryImages, ...galleryImages].map((src, index) => (
              <div key={index} className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden group-hover:[animation-play-state:paused]">
                <Image 
                  src={src} 
                  alt={`Product snapshot ${index + 1}`} 
                  width={384} 
                  height={256} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background-alt)] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background-alt)] to-transparent pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

export default Features;