'use client'

import React, { ButtonHTMLAttributes, useRef, useEffect, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'link' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magnetic?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  magnetic = false,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Magnetic effect handler
  useEffect(() => {
    if (!magnetic || !buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center (0-1)
      const distanceX = (e.clientX - centerX) / (rect.width / 2) * 10;
      const distanceY = (e.clientY - centerY) / (rect.height / 2) * 5;
      
      setPosition({ x: distanceX, y: distanceY });
    };
    
    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magnetic]);
  
  // Premium styles with enhanced hover effects
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-none shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-600';
      case 'secondary':
        return 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-none shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 hover:from-teal-400 hover:to-emerald-400';
      case 'outline':
        return 'bg-transparent backdrop-blur-sm text-[var(--text)] border border-[var(--border)] hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-500 text-white border-none shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-500 hover:to-red-600';
      case 'ghost':
        return 'bg-transparent hover:bg-[var(--accent-background)] text-[var(--text)] border-none';
      case 'link':
        return 'bg-transparent text-[var(--accent)] hover:text-indigo-600 dark:hover:text-indigo-400 underline-offset-4 hover:underline';
      default:
        return 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-none shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-600';
    }
  };
  
  const sizeClasses = size === 'sm' 
    ? 'text-sm px-4 py-2 text-xs' 
    : size === 'lg' 
      ? 'text-base px-8 py-4 font-medium' 
      : 'text-sm px-5 py-2.5';
  
  const magneticStyle = magnetic ? {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: position.x === 0 && position.y === 0 ? 'transform 0.5s var(--transition-smooth)' : 'none'
  } : {};
  
  return (
    <button
      ref={buttonRef}
      className={`${getVariantClasses()} ${sizeClasses} ${className} 
        flex items-center justify-center gap-2 rounded-[var(--global-radius)] 
        transition-all duration-300 relative overflow-hidden group 
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-2px]'} 
        ${magnetic ? 'magnetic-button' : ''}`}
      disabled={disabled || isLoading}
      style={magneticStyle}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      
      {/* Content wrapper */}
      <span className="relative flex items-center justify-center gap-2 z-10">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {!isLoading && leftIcon && <span className="transition-transform duration-300 group-hover:translate-x-[-2px]">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="transition-transform duration-300 group-hover:translate-x-[2px]">{rightIcon}</span>}
      </span>
    </button>
  );
};

export default Button;