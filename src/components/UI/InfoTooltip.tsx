import React, { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  text,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // Calculate tooltip position to prevent it from being cut off
  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = buttonRect.top - tooltipRect.height - 8;
          left = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = buttonRect.bottom + 8;
          left = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = buttonRect.top + buttonRect.height / 2 - tooltipRect.height / 2;
          left = buttonRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = buttonRect.top + buttonRect.height / 2 - tooltipRect.height / 2;
          left = buttonRect.right + 8;
          break;
      }
      
      // Ensure tooltip stays within viewport
      if (top < 8) top = 8;
      if (left < 8) left = 8;
      if (top + tooltipRect.height > window.innerHeight - 8) {
        top = window.innerHeight - tooltipRect.height - 8;
      }
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      
      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        className="text-[var(--text)] opacity-70 hover:opacity-100 transition-opacity duration-200 focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
        aria-label="Information"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5"
        >
          <path 
            fillRule="evenodd" 
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 w-64 max-w-[calc(100vw-16px)] p-3 text-sm bg-[var(--card)] text-[var(--text)] rounded-xl shadow-lg border border-[var(--border)]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip; 