'use client';

import React, { TextareaHTMLAttributes, useRef, useEffect } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  containerClassName?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  autoResize = false,
  containerClassName = '',
  className = '',
  value,
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }

    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {label}
        </label>
      )}
      
      <textarea
        ref={textareaRef}
        className={`input min-h-[80px] resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        value={value}
        onChange={handleChange}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextArea;