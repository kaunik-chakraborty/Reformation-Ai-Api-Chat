// MessageItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CSSProperties } from 'react';
import MessageActions from './MessageActions';
import { FiCopy, FiCheck, FiEdit2, FiUser } from 'react-icons/fi';
import { processMessageContent } from '@/utils/markdownUtils';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useTheme } from 'next-themes';
import { useUser } from '@clerk/nextjs';
import { useMobileDetect } from '@/hooks/useMobileDetect';

// Add these imports for code block rendering
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { tomorrow as darkTheme } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { oneLight as lightTheme } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MessageItemProps {
  message: Message;
  isLastMessage?: boolean;
  onRegenerate?: (messageId: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  subsequentMessages: Message[];
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLastMessage = false,
  onRegenerate,
  onEditMessage,
  subsequentMessages,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const { isSignedIn, user } = useUser();
  const isMobile = useMobileDetect();
  
  const isUser = message.role === 'user';
  const displayContent = showFullMessage || message.content.length < 500 
    ? message.content 
    : `${message.content.substring(0, 500)}...`;

  // Auto-resize textarea when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editedContent]);

  const handleEditClick = () => {
    if (subsequentMessages.length > 0) {
      setShowEditConfirm(true);
    } else {
      setIsEditing(true);
      setEditedContent(message.content);
    }
  };

  const handleEditSubmit = () => {
    if (onEditMessage && editedContent.trim() !== '') {
      onEditMessage(message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div 
      className={`message-item mb-6 ${isUser ? 'user-message mt-6' : 'ai-message'} animate-fade-in relative ${showEditConfirm ? 'pointer-events-none' : ''}`} 
      style={{ 
        zIndex: showEditConfirm ? 0 : 1,
        filter: showEditConfirm ? 'none' : 'none',
        opacity: showEditConfirm ? 1 : 1
      }}
    >
      <div className="flex items-start gap-3">
        {!isMobile && (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)] overflow-hidden">
            {isUser ? (
              isSignedIn && user && user.imageUrl ? (
                <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-4 h-4" />
              )
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor"/>
              </svg>
            )}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm text-accent">
              {isUser ? (
                isSignedIn && user ? user.fullName || user.firstName || 'You' : 'You'
              ) : 'Reformation AI'}
            </span>
            {isUser && !isEditing && (
              <button
                onClick={handleEditClick}
                className="ml-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-[var(--global-radius)] focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] outline-none transition-all duration-200 resize-none min-h-[100px] bg-[var(--background)]"
                placeholder="Edit your message..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm rounded-[var(--global-radius)] border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 text-sm bg-[var(--accent)] text-white rounded-[var(--global-radius)] hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="message-content">
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">
                  {displayContent}
                  {message.content.length > 500 && !showFullMessage && (
                    <button
                      onClick={() => setShowFullMessage(true)}
                      className="ml-1 text-[var(--accent)] hover:underline text-sm font-medium"
                    >
                      Show more
                    </button>
                  )}
                  {message.content.length > 500 && showFullMessage && (
                    <button
                      onClick={() => setShowFullMessage(false)}
                      className="ml-1 text-[var(--accent)] hover:underline text-sm font-medium"
                    >
                      Show less
                    </button>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        
                        if (inline) {
                          return (
                            <code className={`px-1 py-0.5 rounded text-sm ${theme === 'dark' ? 'bg-[var(--code-bg-dark)] text-[var(--code-text-dark)]' : 'bg-[var(--code-bg-light)] text-[var(--code-text-light)]'}`} {...props}>
                              {children}
                            </code>
                          );
                        }
                        
                        // Generate a unique index for this code block
                        const codeIndex = node.position?.start.offset || 0;
                        
                        return (
                          <div className="relative group rounded-[var(--global-radius)] overflow-hidden">
                            <div className={`flex items-center justify-between px-4 py-2 text-xs ${theme === 'dark' ? 'bg-[#1E1E1E] text-white' : 'bg-[#e9ecef] text-[#24292e]'}`}>
                              <span>{match?.[1] || 'code'}</span>
                              <button 
                                onClick={() => handleCopyCode(codeString, codeIndex)}
                                className={`text-xs transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                              >
                                {copiedCodeIndex === codeIndex ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              language={match?.[1] || 'javascript'}
                              style={theme === 'dark' ? darkTheme as any : lightTheme as any}
                              showLineNumbers={true}
                              wrapLines={true}
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                padding: '1rem',
                                background: theme === 'dark' ? 'var(--code-bg-dark)' : 'var(--code-block-bg-light)',
                                fontSize: '0.875rem', // Add consistent font size (14px)
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                              }}
                              lineProps={{
                                style: { display: 'block', width: '100%' }
                              }}
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
          
          {/* Move MessageActions to the bottom for AI messages */}
          {!isUser && (
            <div className="mt-4">
              <MessageActions
                onRegenerate={() => onRegenerate?.(message.id)}
                content={displayContent}
                isUser={isUser}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Confirmation Dialog */}
      {showEditConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm rounded-[var(--global-radius)] border border-[var(--border)]">
          <div className="bg-[var(--card)] p-4 rounded-[var(--global-radius)] shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Edit this message?</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Editing this message will remove all subsequent messages in this conversation.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditConfirm(false)}
                className="px-3 py-1 text-sm rounded-[var(--global-radius)] border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditConfirm(false);
                  setIsEditing(true);
                  setEditedContent(message.content);
                }}
                className="px-3 py-1 text-sm bg-[var(--accent)] text-white rounded-[var(--global-radius)] hover:bg-[var(--accent)]/90 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;