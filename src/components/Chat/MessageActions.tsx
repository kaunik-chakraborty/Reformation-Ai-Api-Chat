import React, { useState, useRef, useEffect } from 'react';
import { IoShareOutline, IoDownloadOutline } from 'react-icons/io5';
// Import html2pdf dynamically to avoid SSR issues
let html2pdf: any = null;

interface MessageActionsProps {
  onRegenerate: () => void;
  content: string;
  isUser: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({ onRegenerate, content, isUser }) => {
  const [showCopied, setShowCopied] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamically import html2pdf.js only on client-side
  useEffect(() => {
    import('html2pdf.js').then(module => {
      html2pdf = module.default;
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Generated Response',
          text: content,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(content);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share: ', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Check if html2pdf is loaded
      if (!html2pdf) {
        console.error('html2pdf is not loaded yet');
        alert('PDF export is not ready yet. Please try again in a moment.');
        return;
      }

      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4C8BF5; margin-bottom: 20px;">AI Generated Response</h2>
          <div style="white-space: pre-wrap;">${content}</div>
        </div>
      `;

      const opt = {
        margin: 1,
        filename: 'ai-response.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      setShowExportDropdown(false);
    } catch (err) {
      console.error('Failed to export PDF: ', err);
    }
  };

  if (isUser) return null;

  return (
    <div className="mt-3 p-1 bg-[var(--card)] rounded-[var(--global-radius)] shadow-sm">

      {/* Mobile layout - stacked in two rows */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex justify-between gap-2">
          <button
            onClick={onRegenerate}
            className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
            title="Regenerate response"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--text)]"
            >
              <path
                d="M29,18c0,3.472-1.353,6.736-3.808,9.192S19.473,31,16,31c-3.472,0-6.736-1.352-9.192-3.807 C4.353,24.737,3,21.472,3,18s1.353-6.737,3.808-9.192C9.263,6.353,12.527,5,16,5h2.172l-1.586-1.586 c-0.781-0.781-0.781-2.047,0-2.828s2.047-0.781,2.828,0l5,5c0.781,0.781,0.781,2.047,0,2.828l-5,5c-0.782,0.782-2.059,0.769-2.828,0 c-0.781-0.781-0.781-2.047,0-2.828L18.172,9H16c-2.404,0-4.664,0.936-6.364,2.636C7.937,13.336,7,15.596,7,18 s0.937,4.664,2.636,6.364C11.336,26.064,13.597,27,16,27c2.404,0,4.664-0.936,6.364-2.636C24.063,22.664,25,20.403,25,18 c0-1.104,0.896-2,2-2S29,16.896,29,18z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--text)]">Rewrite</span>
          </button>

          <button
            onClick={handleCopy}
            className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-lg transition-colors duration-200 relative"
            title="Copy to clipboard"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--text)]"
            >
              <path
                d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--text)]">Copy</span>
            {showCopied && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[var(--card)] text-[var(--text)] px-3 py-1 rounded-[var(--global-radius)] text-sm font-medium shadow-lg border border-[var(--border)] animate-fade-in-out">
                Copied!
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={handleShare}
            className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
            title="Share response"
          >
            <IoShareOutline className="w-5 h-5 text-[var(--text)]" />
            <span className="text-sm font-medium text-[var(--text)]">Share</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
              title="Export options"
            >
              <IoDownloadOutline className="w-5 h-5 text-[var(--text)]" />
              <span className="text-sm font-medium text-[var(--text)]">Export</span>
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-[var(--global-radius)] shadow-lg border border-[var(--border)] py-1 z-10 animate-fade-in">
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--background)] transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18H17V16H7V18Z" fill="currentColor"/>
                    <path d="M17 14H7V12H17V14Z" fill="currentColor"/>
                    <path d="M7 10H11V8H7V10Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor"/>
                  </svg>
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablet and desktop layout - all in one row */}
      <div className="hidden md:flex md:flex-row md:items-center md:gap-1">
        <button
          onClick={onRegenerate}
          className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
          title="Regenerate response"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-[var(--text)]"
          >
            <path
              d="M29,18c0,3.472-1.353,6.736-3.808,9.192S19.473,31,16,31c-3.472,0-6.736-1.352-9.192-3.807 C4.353,24.737,3,21.472,3,18s1.353-6.737,3.808-9.192C9.263,6.353,12.527,5,16,5h2.172l-1.586-1.586 c-0.781-0.781-0.781-2.047,0-2.828s2.047-0.781,2.828,0l5,5c0.781,0.781,0.781,2.047,0,2.828l-5,5c-0.782,0.782-2.059,0.769-2.828,0 c-0.781-0.781-0.781-2.047,0-2.828L18.172,9H16c-2.404,0-4.664,0.936-6.364,2.636C7.937,13.336,7,15.596,7,18 s0.937,4.664,2.636,6.364C11.336,26.064,13.597,27,16,27c2.404,0,4.664-0.936,6.364-2.636C24.063,22.664,25,20.403,25,18 c0-1.104,0.896-2,2-2S29,16.896,29,18z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-medium text-[var(--text)]">Rewrite</span>
        </button>

        <div className="h-5 w-px bg-[var(--border)] mx-1"></div>

        <button
          onClick={handleCopy}
          className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-lg transition-colors duration-200 relative"
          title="Copy to clipboard"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-[var(--text)]"
          >
            <path
              d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="text-sm font-medium text-[var(--text)]">Copy</span>
          {showCopied && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[var(--card)] text-[var(--text)] px-3 py-1 rounded-[var(--global-radius)] text-sm font-medium shadow-lg border border-[var(--border)] animate-fade-in-out">
              Copied!
            </div>
          )}
        </button>

        <div className="h-5 w-px bg-[var(--border)] mx-1"></div>

        <button
          onClick={handleShare}
          className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
          title="Share response"
        >
          <IoShareOutline className="w-5 h-5 text-[var(--text)]" />
          <span className="text-sm font-medium text-[var(--text)]">Share</span>
        </button>

        <div className="h-5 w-px bg-[var(--border)] mx-1"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="group flex items-center gap-2 px-3 py-2 hover:bg-[var(--background)] rounded-[var(--global-radius)] transition-colors duration-200"
            title="Export options"
          >
            <IoDownloadOutline className="w-5 h-5 text-[var(--text)]" />
            <span className="text-sm font-medium text-[var(--text)]">Export</span>
          </button>

          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-[var(--global-radius)] shadow-lg border border-[var(--border)] py-1 z-10 animate-fade-in">
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--background)] transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18H17V16H7V18Z" fill="currentColor"/>
                  <path d="M17 14H7V12H17V14Z" fill="currentColor"/>
                  <path d="M7 10H11V8H7V10Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor"/>
                </svg>
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageActions;