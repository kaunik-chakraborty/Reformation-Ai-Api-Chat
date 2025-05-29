// MessageItem.tsx
import React, { useState } from 'react';
import { Message } from '@/types';
import ReactMarkdown from 'react-markdown';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import 'highlight.js/styles/github.css';
import MessageActions from './MessageActions';
import { FiCopy, FiCheck, FiEdit2 } from 'react-icons/fi';
import { processMessageContent } from '@/utils/markdownUtils';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useTheme } from 'next-themes';

// Add these imports for code block rendering
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
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

const MessageItem: React.FC<MessageItemProps> = ({ message, isLastMessage = false, onRegenerate, onEditMessage, subsequentMessages }) => {
  const isUser = message.role === 'user';
  const { copyToClipboard, isCopied } = useCopyToClipboard(3000); // 3 second timeout for copy feedback
  const { theme, systemTheme } = useTheme();
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const words = message.content.split(' ');
  const shouldTruncate = isUser && words.length > 30;
  const truncatedContent = shouldTruncate && !showFullMessage
    ? words.slice(0, 30).join(' ') + '...'
    : message.content;
  
  // Determine if we're in dark mode
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = resolvedTheme === 'dark';
  
  // Choose the appropriate theme for syntax highlighting
  const syntaxTheme = isDarkMode ? darkTheme : lightTheme;
  
  // Get the processed content
  const displayContent = processMessageContent(truncatedContent, isUser);
  
  // Determine if we should apply the gradient effect
  const applyGradientEffect = shouldTruncate && !showFullMessage;
  
  return (
    <div 
      className={`group relative py-6 ${isLastMessage ? '' : 'border-b border-[var(--border)]'}`}
      id={`message-${message.id}`}
    >
      {isUser && (
        <div className="absolute top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setShowEditConfirm(true)}
            className="p-2.5 bg-[var(--card)] border border-[var(--border)] rounded-[var(--global-radius)] shadow-lg hover:bg-[var(--background)] hover:scale-110 transition-transform duration-200"
            title="Edit message"
          >
            <FiEdit2 className="w-5 h-5 text-[var(--text)]" />
          </button>
        </div>
      )}
      
      <div className="flex flex-col">
        <div className={`flex items-center mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <h4 className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'Varela Round, sans-serif' }}>
            {isUser ? 'You' : 'Reformation AI'}
          </h4>
        </div>
        
        <div className={`prose prose-slate dark:prose-invert max-w-none text-[var(--text)] ${
          isUser ? 'ml-auto max-w-[60%]' : 'w-full'
        } ${isUser ? 'bg-[var(--card)] p-4' : 'bg-[var(--background)] p-4'} rounded-[var(--global-radius)]`}>
          <div className="relative">
            <div 
              className={`${applyGradientEffect ? 'gradient-mask-bottom' : ''}`}
              style={{
                maskImage: applyGradientEffect ? 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))' : 'none',
                WebkitMaskImage: applyGradientEffect ? 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))' : 'none',
              }}
            >
              <ReactMarkdown
                components={{
                code({node, inline, className, children, ...props}: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const codeId = `code-${message.id}-${Math.random().toString(36).substring(2, 9)}`;
                  
                  if (!inline && (match || codeString.includes('\n'))) {
                    // Determine language display
                    const language = match?.[1] || '';
                    
                    return (
                      <div className="my-4 relative rounded-[var(--global-radius)] overflow-hidden border border-[var(--border)]">
                        {/* Code block header with language and copy button */}
                        <div className={`flex justify-between items-center px-3 py-2 text-sm ${isDarkMode ? 'bg-gray-800 text-gray-200 border-b border-gray-700' : 'bg-gray-100 text-gray-700 border-b border-gray-200'}`}>
                          {/* Language indicator */}
                          <div className="font-mono font-medium">
                            {language || 'Code'}
                          </div>
                          
                          {/* Copy button with tooltip */}
                          <div className="relative">
                            <button
                              onClick={() => copyToClipboard(codeId, codeString)}
                              className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 ${isCopied(codeId) ? 'bg-green-500 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                              aria-label={isCopied(codeId) ? "Copied!" : "Copy code"}
                            >
                              {isCopied(codeId) ? (
                                <>
                                  <FiCheck size={14} className="animate-fade-in" />
                                  <span className="animate-fade-in">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy size={14} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Code content */}
                        <div className="overflow-auto max-w-full">
                          <SyntaxHighlighter
                            // @ts-ignore - Type issues with react-syntax-highlighter styles
                            style={syntaxTheme}
                            language={language || 'text'}
                            PreTag="div"
                            showLineNumbers={true}
                            wrapLines={true}
                            wrapLongLines={false}
                            customStyle={{
                              margin: 0,
                              padding: '1em',
                              borderRadius: '0 0 0.375rem 0.375rem',
                              fontSize: '0.9rem',
                              maxWidth: '100%',
                              border: 'none',
                              boxShadow: 'none',
                              backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa'
                            }}
                            lineNumberStyle={{
                              minWidth: '2.5em',
                              paddingRight: '1em',
                              color: isDarkMode ? 'rgba(156, 163, 175, 0.5)' : 'rgba(107, 114, 128, 0.5)',
                              textAlign: 'right',
                              userSelect: 'none',
                              borderRight: 'none'
                            }}
                            lineProps={{}
                            }
                            codeTagProps={{
                              style: {
                                backgroundColor: 'transparent'
                              }
                            }}
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    );
                  }
                  
                  // Inline code element
                  return (
                    <code 
                      className={`${className} inline-code-element px-1.5 py-0.5 rounded text-sm ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-200' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            >
              {displayContent}
            </ReactMarkdown>
            </div>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="text-[#4C8BF5] hover:underline focus:outline-none inline-flex items-center gap-1 mt-2"
              >
                {showFullMessage ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showEditConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[var(--card)] p-6 rounded-[var(--global-radius)] shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Message</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                This will delete this message and {subsequentMessages.length} subsequent message{subsequentMessages.length !== 1 ? 's' : ''}. Are you sure?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditConfirm(false)}
                  className="px-4 py-2 text-sm rounded-[var(--global-radius)] hover:bg-[var(--background)]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onEditMessage) {
                      onEditMessage(message.id, message.content);
                    }
                    setShowEditConfirm(false);
                  }}
                  className="px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-[var(--global-radius)] hover:bg-[var(--accent)]/90"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {!isUser && (
          <div className="mt-3">
            <MessageActions
              onRegenerate={() => onRegenerate?.(message.id)}
              content={displayContent}
              isUser={isUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;