import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  ...props
}) => {
  // Updated styles with rounded backgrounds for all variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--background)] hover:border-[var(--border)]';
      case 'secondary':
        return 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--background)]';
      case 'outline':
        return 'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--background)]';
      case 'danger':
        return 'bg-red-500 text-white border border-red-700 hover:bg-red-600';
      case 'link':
        return 'bg-transparent text-[#4C8BF5] hover:underline';
      default:
        return 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--background)]';
    }
  };
  
  const sizeClasses = size === 'sm' 
    ? 'text-sm px-3 py-1.5' 
    : size === 'lg' 
      ? 'text-lg px-6 py-3' 
      : 'text-base px-4 py-2.5';
  
  return (
    <button
      className={`${getVariantClasses()} ${sizeClasses} ${className} flex items-center justify-center gap-2 rounded-[var(--global-radius)] transition-all duration-200 ${
        disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;