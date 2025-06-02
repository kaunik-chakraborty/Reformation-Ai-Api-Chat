'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './CustomCursor.module.css';
import { useTheme } from '@/hooks/useTheme';

// Debug function to log cursor state
const debugCursor = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[CustomCursor] ${message}`, data || '');
  }
};

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [cursorState, setCursorState] = useState({
    isHovering: false,
    isClicking: false,
    isTextInput: false,
    isHidden: false,
    lastX: 0,
    lastY: 0,
    velocity: { x: 0, y: 0 }
  });

  useEffect(() => {
    setMounted(true);
    debugCursor('Component mounted');
    
    // Don't add js-enabled class to keep default cursor visible
    // document.body.classList.add('js-enabled');
    // document.documentElement.classList.add('js-enabled');
    
    // Don't force inline style to keep default cursor visible
    // document.body.style.cursor = 'none';
    // document.documentElement.style.cursor = 'none';
    let rafId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTimeStamp = 0;

    // Simplified cursor animation for better visibility
    const animateCursor = (timestamp: number) => {
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      lastTimeStamp = timestamp;
      
      debugCursor('Animation frame', { x: cursorState.lastX, y: cursorState.lastY });
      
      // No need to update styles here as we're using inline styles in the render method
      // This function now just keeps the animation loop going
      
      rafId = requestAnimationFrame(animateCursor);
    };

    // Update cursor position
    const updatePosition = (e: MouseEvent) => {
      // Debug cursor position occasionally
      if (Math.random() < 0.01) {
        debugCursor('Cursor position', { x: e.clientX, y: e.clientY });
      }
      
      setCursorState(prev => ({
        ...prev,
        lastX: e.clientX,
        lastY: e.clientY,
        isHidden: false // Show cursor when it moves
      }));
      
      if (!rafId) {
        rafId = requestAnimationFrame(animateCursor);
      }
    };

    // Handle hover states for interactive elements
    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for different interactive elements
      const isHoverable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.classList.contains('hoverable') ||
        target.classList.contains('interactive') ||
        target.hasAttribute('role') ||
        target.closest('a') !== null ||
        target.closest('button') !== null;
      
      // Check for text input elements
      const isTextInput =
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.classList.contains('text-input') ||
        target.getAttribute('contenteditable') === 'true';

      setCursorState(prev => ({
        ...prev,
        isHovering: isHoverable,
        isTextInput: isTextInput
      }));
    };

    // Handle mouse down/up for click effect
    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }));
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, isHidden: true }));
    };

    const handleMouseEnter = () => {
      setCursorState(prev => ({ ...prev, isHidden: false }));
    };

    // Add event listeners
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      debugCursor('Component unmounting');
      
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [cursorState.lastX, cursorState.lastY, cursorState.isHovering, cursorState.isClicking, cursorState.isTextInput]);

  // Don't render until mounted on client
  if (!mounted) {
    debugCursor('Not mounted yet, returning null');
    return null;
  }

  // Determine cursor colors based on theme
  const isDarkMode = typeof document !== 'undefined' ? 
    document.documentElement.classList.contains('dark') : 
    theme === 'dark';

  // Colors for light and dark modes
  const dotColor = isDarkMode ? '#FFFFFF' : '#000000';
  const ringColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  const accentColor = cursorState.isTextInput ? '#4C8BF5' : (isDarkMode ? '#8B5CF6' : '#6366F1');

  // Debug render
  debugCursor('Rendering cursor', { state: cursorState, theme: isDarkMode ? 'dark' : 'light' });

  return (
    <>
      {/* Debug button */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => debugCursor('Debug button clicked')}
          style={{ 
            position: 'fixed', 
            bottom: '0px', 
            right: '0px', 
            zIndex: 9999, 
            padding: '0px 0px',
            background: '#ff0000',
            color: 'white',
            border: 'none',
            borderRadius: '0px'
          }}
        >
          
        </button>
      )}
      
      {/* Cursor dot element - colorful and theme-responsive */}
      <div 
        ref={dotRef} 
        style={{ 
          position: 'fixed',
          pointerEvents: 'none',
          width: cursorState.isHovering ? '10px' : '8px',
          height: cursorState.isHovering ? '10px' : '8px',
          backgroundColor: cursorState.isTextInput ? accentColor : dotColor,
          borderRadius: '50%',
          transform: `translate(${cursorState.lastX}px, ${cursorState.lastY}px) translate(-50%, -50%)`,
          zIndex: 2147483647, // Maximum z-index value
          opacity: cursorState.isHidden ? 0 : 0.95,
          boxShadow: `0 0 8px ${isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'}`,
          transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, opacity 0.2s ease',
          ...(cursorState.isClicking && {
            transform: `translate(${cursorState.lastX}px, ${cursorState.lastY}px) translate(-50%, -50%) scale(0.7)`,
          })
        }}
      />
      {/* Cursor ring element - jellyfish-like animation */}
      <div 
        ref={ringRef} 
        style={{ 
          position: 'fixed',
          pointerEvents: 'none',
          width: cursorState.isHovering ? '35px' : '25px',
          height: cursorState.isHovering ? '35px' : '25px',
          border: `1.5px solid ${cursorState.isTextInput ? accentColor : ringColor}`,
          borderRadius: '50%',
          transform: `translate(${cursorState.lastX}px, ${cursorState.lastY}px) translate(-50%, -50%)`,
          zIndex: 2147483646, // One less than the dot
          opacity: cursorState.isHidden ? 0 : 0.5,
          transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, opacity 0.3s ease, transform 0.2s ease',
          animation: cursorState.isHovering ? 'pulse 2s infinite' : 'none',
          ...(cursorState.isClicking && {
            transform: `translate(${cursorState.lastX}px, ${cursorState.lastY}px) translate(-50%, -50%) scale(0.8)`,
            opacity: 0.7,
          })
        }}
      />
      
      {/* Additional jellyfish tentacle effect when hovering */}
      {cursorState.isHovering && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            width: '45px',
            height: '45px',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            borderRadius: '50%',
            transform: `translate(${cursorState.lastX}px, ${cursorState.lastY}px) translate(-50%, -50%)`,
            zIndex: 2147483645,
            opacity: 0.3,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'tentaclePulse 3s infinite'
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;