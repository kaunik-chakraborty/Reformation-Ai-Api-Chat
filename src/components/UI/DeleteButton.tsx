'use client';

import React from 'react';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  className = '', 
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd
}) => {
  return (
    <button
      className={`p-2 rounded-lg text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors duration-200 group ${className}`}
      onClick={onClick}
      title="Delete Chat"
      aria-label="Delete Chat"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-200 group-hover:scale-110"
      >
        <path
          d="M17 6H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 6H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 3V5C7 5.55228 7.44772 6 8 6H16C16.5523 6 17 5.55228 17 5V3C17 2.44772 16.5523 2 16 2H8C7.44772 2 7 2.44772 7 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 8V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 12V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 12V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default DeleteButton;