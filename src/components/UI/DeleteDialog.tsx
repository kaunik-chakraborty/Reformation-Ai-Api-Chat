'use client';

import React from 'react';
import Button from './Button';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this chat? This action cannot be undone.'
}) => {
  if (!isOpen) return null;

  // Premium delete icon SVG
  const DeleteIcon = (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-red-500"
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
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-[var(--card)] rounded-[var(--global-radius)] shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-red-100 rounded-lg dark:bg-red-500/20">
            {DeleteIcon}
          </span>
          <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="!bg-red-500 hover:!bg-red-600 border-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;