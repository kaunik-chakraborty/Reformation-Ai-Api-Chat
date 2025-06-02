'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme'; // your custom hook to get theme

const HeroImage = () => {
  const { theme } = useTheme(); // get current theme ('light' or 'dark')
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render placeholder to avoid hydration mismatch
    return <div style={{ width: '100%', height: 400 }} aria-hidden="true" />;
  }

  return (
    <motion.div
      key={theme} // force remount on theme change to update image
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 2.8, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="relative z-10 w-[90%] md:w-[80%] lg:w-[70%] max-w-5xl mx-auto"
    >
      <Image
        src={theme === 'dark' ? '/images/ui-preview-dark.webp' : '/images/ui-preview.webp'}
        alt="Reformation AI Interface"
        width={1200}
        height={800}
        className="w-full h-auto rounded-xl shadow-2xl"
        priority
      />
    </motion.div>
  );
};

export default HeroImage;
