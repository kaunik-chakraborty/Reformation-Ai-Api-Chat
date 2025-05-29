import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-[var(--text)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 focus:border-[#4C8BF5] transition-all duration-200 text-[var(--text)] placeholder:text-muted ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input; 