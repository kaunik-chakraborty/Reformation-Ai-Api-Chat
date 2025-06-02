'use client';

import { gsap } from 'gsap';

interface ParallaxOptions {
  container: HTMLElement;
  layers: HTMLElement[];
  speeds?: number[];
  disableOnTouch?: boolean;
  disableOnMobile?: boolean;
  mobileBreakpoint?: number;
  strength?: number;
  ease?: string;
  glowEffect?: boolean;
  onInit?: () => void;
  onDestroy?: () => void;
}

interface ParallaxInstance {
  init: () => void;
  destroy: () => void;
  update: () => void;
}

/**
 * Creates a mouse-based parallax effect for layered elements
 * @param options Configuration options for the parallax effect
 * @returns ParallaxInstance with init, destroy, and update methods
 */
export const createParallaxEffect = (options: ParallaxOptions): ParallaxInstance => {
  // Default options
  const {
    container,
    layers,
    speeds = layers.map((_, i) => (i + 1) * 0.05), // Default speeds based on layer index
    disableOnTouch = true,
    disableOnMobile = true,
    mobileBreakpoint = 768,
    strength = 1,
    ease = 'power2.out',
    glowEffect = true,
    onInit = () => {},
    onDestroy = () => {}
  } = options;

  // State variables
  let isEnabled = true;
  let isTouchDevice = false;
  let isMobile = false;
  let mouseX = 0;
  let mouseY = 0;
  let windowWidth = 0;
  let windowHeight = 0;
  let centerX = 0;
  let centerY = 0;
  let rafId: number | null = null;
  let lastUpdateTime = 0;
  const throttleTime = 8; // Reduced from 10ms for more responsive animation

  // Check if device supports touch
  const checkTouchDevice = (): boolean => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  };

  // Check if viewport is mobile size
  const checkMobileViewport = (): boolean => {
    return window.innerWidth < mobileBreakpoint;
  };

  // Update dimensions
  const updateDimensions = (): void => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    centerX = windowWidth / 2;
    centerY = windowHeight / 2;
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent): void => {
    if (!isEnabled) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  // Apply glow effect based on mouse distance
  const applyGlowEffect = (layer: HTMLElement, distX: number, distY: number, index: number): void => {
    if (!glowEffect) return;
    
    // Calculate distance from mouse to center
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDistance = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2;
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    // Calculate glow intensity based on distance and layer index
    const baseIntensity = 0.5 + (index % 3) * 0.2; // Vary intensity by layer
    const glowIntensity = baseIntensity * (1 - normalizedDistance * 0.5);
    
    // Apply different glow effects based on layer type
    if (layer.classList.contains('border')) {
      // For border elements
      const borderColor = layer.classList.contains('border-purple-500/20') 
        ? `rgba(168, 85, 247, ${0.2 + glowIntensity * 0.3})` 
        : `rgba(99, 102, 241, ${0.2 + glowIntensity * 0.3})`;
      
      const shadowSize = 5 + glowIntensity * 15;
      const shadowColor = layer.classList.contains('border-purple-500/20')
        ? `rgba(168, 85, 247, ${0.3 * glowIntensity})` 
        : `rgba(99, 102, 241, ${0.3 * glowIntensity})`;
      
      layer.style.borderColor = borderColor;
      layer.style.boxShadow = `0 0 ${shadowSize}px ${shadowColor}`;
    } else {
      // For gradient elements
      const blurAmount = layer.classList.contains('blur-md') 
        ? 8 + glowIntensity * 4 
        : 4 + glowIntensity * 3;
      
      const opacity = parseFloat(layer.style.opacity || '0.5');
      const newOpacity = Math.min(opacity + glowIntensity * 0.2, 0.85);
      
      layer.style.filter = `blur(${blurAmount}px)`;
      layer.style.opacity = newOpacity.toString();
    }
  };

  // Animation loop
  const animate = (): void => {
    if (!isEnabled) return;

    const now = Date.now();
    if (now - lastUpdateTime < throttleTime) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    lastUpdateTime = now;

    // Calculate distance from center
    const distX = mouseX - centerX;
    const distY = mouseY - centerY;
    
    // Animate each layer with different speeds
    layers.forEach((layer, index) => {
      const speed = speeds[index] || (index + 1) * 0.05;
      const adjustedSpeed = speed * strength;
      
      // Add will-change for better performance
      if (!layer.style.willChange) {
        layer.style.willChange = 'transform, opacity, filter';
      }

      // Apply glow effect
      applyGlowEffect(layer, distX, distY, index);

      // Use translate3d for hardware acceleration
      gsap.to(layer, {
        x: distX * adjustedSpeed,
        y: distY * adjustedSpeed,
        duration: 0.6, // Even faster response time
        ease,
        overwrite: 'auto',
        force3D: true // Force 3D transforms
      });
    });
    
    rafId = requestAnimationFrame(animate);
  };

  // Initialize parallax effect
  const init = (): void => {
    // Check device capabilities
    isTouchDevice = checkTouchDevice();
    isMobile = checkMobileViewport();
    
    // Disable on touch devices if specified
    if ((disableOnTouch && isTouchDevice) || (disableOnMobile && isMobile)) {
      isEnabled = false;
      return;
    }
    
    // Set up initial state
    updateDimensions();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateDimensions);
    
    // Start animation loop
    lastUpdateTime = Date.now();
    rafId = requestAnimationFrame(animate);
    
    // Call onInit callback
    onInit();
  };

  // Clean up event listeners and animations
  const destroy = (): void => {
    isEnabled = false;
    
    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', updateDimensions);
    
    // Cancel animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    
    // Reset layer positions and styles
    layers.forEach((layer) => {
      gsap.set(layer, { x: 0, y: 0 });
      layer.style.willChange = 'auto';
      layer.style.filter = '';
      layer.style.boxShadow = '';
      
      // Reset border color if it was a border element
      if (layer.classList.contains('border-indigo-500/20')) {
        layer.style.borderColor = 'rgba(99, 102, 241, 0.2)';
      } else if (layer.classList.contains('border-purple-500/20')) {
        layer.style.borderColor = 'rgba(168, 85, 247, 0.2)';
      }
    });
    
    // Call onDestroy callback
    onDestroy();
  };

  // Force update (useful when container or layers change)
  const update = (): void => {
    destroy();
    init();
  };

  return {
    init,
    destroy,
    update
  };
};

/**
 * Creates a tilt effect for elements on hover
 * @param element The element to apply the tilt effect to
 * @param options Configuration options for the tilt effect
 * @returns Function to remove the tilt effect
 */
export const createTiltEffect = (
  element: HTMLElement,
  options: {
    max?: number;
    scale?: number;
    speed?: number;
    disableOnTouch?: boolean;
    glowOnHover?: boolean;
  } = {}
): (() => void) => {
  const {
    max = 10, // max tilt rotation in degrees
    scale = 1.05, // scale on hover
    speed = 400, // speed of the transition
    disableOnTouch = true,
    glowOnHover = true
  } = options;

  // Check if device supports touch
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  // Don't apply effect on touch devices if specified
  if (disableOnTouch && isTouchDevice) {
    return () => {}; // Return empty cleanup function
  }

  let isHovering = false;
  let originalBoxShadow = '';
  
  // Handle mouse enter
  const handleMouseEnter = (): void => {
    isHovering = true;
    originalBoxShadow = element.style.boxShadow;
    
    // Apply scale effect
    gsap.to(element, {
      scale,
      duration: speed / 1000,
      ease: 'power2.out',
      force3D: true
    });
    
    // Apply glow effect on hover if enabled
    if (glowOnHover) {
      // Determine if element has gradient background
      const hasGradient = element.classList.contains('bg-gradient-to-r') || 
                         element.classList.contains('from-indigo-600') ||
                         element.classList.contains('to-purple-600');
      
      // Apply appropriate glow effect
      if (hasGradient) {
        gsap.to(element, {
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)',
          duration: speed / 1000,
          ease: 'power2.out'
        });
      } else {
        // For non-gradient elements, use a more subtle glow
        gsap.to(element, {
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
          duration: speed / 1000,
          ease: 'power2.out'
        });
      }
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent): void => {
    if (!isHovering) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply rotation with translate3d for better performance
    gsap.to(element, {
      rotationX: -percentY * max,
      rotationY: percentX * max,
      duration: speed / 1000,
      ease: 'power2.out',
      force3D: true
    });
  };

  // Handle mouse leave
  const handleMouseLeave = (): void => {
    isHovering = false;
    // Reset transform and glow
    gsap.to(element, {
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      boxShadow: originalBoxShadow,
      duration: speed / 1000,
      ease: 'power2.out',
      force3D: true
    });
  };

  // Add event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    
    // Reset any applied transformations
    gsap.set(element, {
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      boxShadow: originalBoxShadow
    });
  };
};