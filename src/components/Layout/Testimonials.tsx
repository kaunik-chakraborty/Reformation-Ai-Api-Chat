'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiStar, FiArrowLeft, FiArrowRight, FiMessageSquare } from 'react-icons/fi';

interface TestimonialProps {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: TestimonialProps[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    image: '/images/testimonials/avatar1.svg',
    quote: "Reformation AI has completely transformed how our team interacts with AI. The responses are incredibly nuanced and the interface is intuitive. It's become an essential tool for our product development process.",
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Engineer',
    company: 'DevStream',
    image: '/images/testimonials/avatar2.svg',
    quote: "As a developer, I appreciate the technical accuracy and the ability to run models locally. The code suggestions are spot-on and the customization options allow me to tailor the experience to my specific needs.",
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Content Strategist',
    company: 'MediaPulse',
    image: '/images/testimonials/avatar3.svg',
    quote: "The multi-language support has been a game-changer for our global content team. We can now create and translate content seamlessly with context-aware AI assistance that understands our brand voice.",
    rating: 4
  },
  {
    id: 4,
    name: 'David Okafor',
    role: 'Research Scientist',
    company: 'InnovateLabs',
    image: '/images/testimonials/avatar4.svg',
    quote: "The depth of understanding this AI demonstrates is remarkable. It's not just responding to prompts; it's engaging in meaningful dialogue that advances our research questions in ways we hadn't considered.",
    rating: 5
  },
  {
    id: 5,
    name: 'Aisha Patel',
    role: 'UX Designer',
    company: 'DesignForward',
    image: '/images/testimonials/avatar5.svg',
    quote: "The interface is beautifully designed and the AI responses help me iterate on design concepts quickly. The real-time feedback loop has shortened our design cycles significantly.",
    rating: 5
  }
];

const TestimonialCard: React.FC<{ testimonial: TestimonialProps; isActive: boolean }> = ({ testimonial, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-lg transition-all duration-500 h-full flex flex-col ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-60 z-0'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.6, y: 0, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
    >
      <div className="mb-6 relative">
        <FiMessageSquare className="text-indigo-500/20 absolute -top-2 -left-2 text-5xl" />
        <p className="text-[var(--text-muted)] relative z-10 leading-relaxed italic">"{testimonial.quote}"</p>
      </div>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <Image 
              src={testimonial.image} 
              alt={testimonial.name}
              width={48}
              height={48}
              className="object-cover"
              // Use a placeholder for development
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&background=6366f1&color=fff`;
              }}
            />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text)]">{testimonial.name}</h4>
            <p className="text-sm text-[var(--muted)]">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>
        
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={`${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} w-4 h-4`} 
            />
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {isHovered && isActive && (
          <motion.div 
            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-8"
            initial={{ width: 0, opacity: 0, x: '50%' }}
            animate={{ width: '70%', opacity: 1, x: '15%' }}
            exit={{ width: 0, opacity: 0, x: '50%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Blurred background elements - only render when mounted to prevent hydration issues */}
      {mounted && (
        <>
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-600/10 to-purple-500/10 rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-indigo-500/20 rounded-full opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-purple-500/20 rounded-full opacity-50"></div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3 px-4 py-1.5 bg-gradient-to-r from-indigo-600/10 to-indigo-400/10 rounded-full text-indigo-600 text-sm font-medium"
          >
            Testimonials
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--muted)] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover how Reformation AI is transforming workflows and enhancing productivity for professionals across industries.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
            {[0, 1, 2].map((offset) => {
              const index = (activeIndex + offset) % testimonials.length;
              return (
                <TestimonialCard 
                  key={testimonials[index].id} 
                  testimonial={testimonials[index]} 
                  isActive={offset === 1}
                />
              );
            })}
          </div>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:text-indigo-600 hover:border-indigo-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft size={20} />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:text-indigo-600 hover:border-indigo-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowRight size={20} />
            </motion.button>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-indigo-600' : 'bg-[var(--border)]'}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;