import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Hero from '@/components/Layout/Hero';
import Features from '@/components/Layout/Features';
// import AboutSection from '@/components/Layout/AboutSection'; // Removed
import CtaSection from '@/components/Layout/CtaSection';
// Removed Testimonials import as requested

export default function LandingPage() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      {/* <AboutSection /> */}
      <CtaSection />
    </MainLayout>
  );
}