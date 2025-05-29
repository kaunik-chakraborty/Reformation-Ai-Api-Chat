import { useState, useCallback } from 'react';

interface CopyToClipboardState {
  copiedMap: Record<string, boolean>;
  copyToClipboard: (id: string, text: string) => Promise<void>;
  isCopied: (id: string) => boolean;
}

/**
 * Custom hook for handling copy to clipboard functionality
 * @param timeout Time in milliseconds before copied state is reset
 * @returns State and functions for clipboard operations
 */
export const useCopyToClipboard = (timeout = 2000): CopyToClipboardState => {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const copyToClipboard = useCallback(async (id: string, text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap(prev => ({ ...prev, [id]: true }));
      
      // Reset after timeout
      setTimeout(() => {
        setCopiedMap(prev => ({ ...prev, [id]: false }));
      }, timeout);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  }, [timeout]);

  const isCopied = useCallback((id: string): boolean => {
    return !!copiedMap[id];
  }, [copiedMap]);

  return { copiedMap, copyToClipboard, isCopied };
};

export default useCopyToClipboard; 