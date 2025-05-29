import React, { useState, useRef, useEffect } from 'react';
import Button from '../UI/Button';
import { IoSend, IoAdd, IoChevronDown, IoCopyOutline } from 'react-icons/io5';
import { AIModel } from '@/types';
import { sendMessageToModel } from '@/utils/api';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  currentModel?: AIModel;
  availableModels: AIModel[];
  onModelChange?: (modelId: string) => void;
  onAddModel?: () => void;
  onPause?: () => void;
  initialMessage?: string;
}

const PauseIcon = (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#4C8BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect>
  </svg>
);

const ImprovePromptIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    <path d="M15 4V2M15 16V14M8 9H10M20 9H22M17.8 11.8L19 13M17.8 6.2L19 5M3 21L12 12M12.2 6.2L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  placeholder = 'Type your message here...',
  currentModel,
  availableModels,
  onModelChange,
  onAddModel,
  onPause,
  initialMessage
}): JSX.Element => {
  const [message, setMessage] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '' || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAddModelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddModel) {
      onAddModel();
      setShowModelDropdown(false);
    }
  };

  const openPromptModal = () => {
    setPromptInput(message);
    setEnhancedPrompt('');
    setShowPromptModal(true);
  };

  const closePromptModal = () => {
    setShowPromptModal(false);
  };

  const enhancePrompt = async () => {
    if (!promptInput.trim() || !currentModel) return;
    
    setIsEnhancing(true);
    setEnhancedPrompt('');
    
    try {
      // Create a prompt improvement instruction for the AI
      const improvementPrompt = getPromptImprovementInstruction(promptInput);
      
      // Use the actual AI model to improve the prompt
      const response = await sendMessageToModel(
        currentModel,
        [{ role: 'user', content: improvementPrompt, id: 'improve-prompt', timestamp: Date.now() }],
        {}
      );
      
      if (response && response.message) {
        // Incrementally display the response for better UX
        let displayedContent = '';
        const content = response.message.content;
        const chunkSize = Math.max(10, Math.floor(content.length / 20)); // Display in ~20 chunks
        
        for (let i = 0; i < content.length; i += chunkSize) {
          await new Promise(resolve => setTimeout(resolve, 50));
          displayedContent = content.substring(0, i + chunkSize);
          setEnhancedPrompt(displayedContent);
        }
        
        // Ensure the full content is displayed
        setEnhancedPrompt(content);
      } else {
        throw new Error('Failed to generate an improved prompt');
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      setEnhancedPrompt(`Sorry, there was an error improving your prompt. Please try again.`);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Create instruction for the AI to improve the prompt
  const getPromptImprovementInstruction = (text: string) => {
    const originalPrompt = text.trim();
    
    // Detect prompt type for better context
    const isQuestion = originalPrompt.endsWith('?');
    const hasInstructions = /please|explain|describe|provide|how to|steps to|create|generate|list|compare|analyze|evaluate/i.test(originalPrompt);
    const isCreative = /story|poem|write|generate|create|design|develop|idea|concept/i.test(originalPrompt);
    const isTechnical = /code|function|algorithm|api|program|debug|fix|optimize|implementation|architecture|data structure/i.test(originalPrompt);
    
    // Build a context-aware improvement request
    let instruction = `You are an expert prompt engineer. Your task is to improve the following prompt to get better results from an AI assistant:\n\n`;
    instruction += `ORIGINAL PROMPT: "${originalPrompt}"\n\n`;
    instruction += `Please rewrite this prompt to make it more effective by:\n`;
    instruction += `1. Adding more specific details and context\n`;
    instruction += `2. Structuring it clearly with proper formatting\n`;
    instruction += `3. Incorporating effective prompt engineering techniques\n`;
    
    // Add context-specific instructions based on prompt type
    if (isTechnical) {
      instruction += `4. Since this is a technical request, include specific requirements for code quality, architecture, or implementation details\n`;
    } else if (isCreative) {
      instruction += `4. Since this is a creative request, add specific creative direction and constraints\n`;
    } else if (isQuestion) {
      instruction += `4. Since this is a question, specify the depth and format of the answer required\n`;
    } else if (hasInstructions) {
      instruction += `4. Since this is an instructional request, add structure for a step-by-step response\n`;
    }
    
    instruction += `\nProvide ONLY the improved prompt text without any explanations, introductions, or additional commentary. The improved prompt should be ready to use as-is.`;
    
    return instruction;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const useEnhancedPrompt = () => {
    setMessage(enhancedPrompt);
    closePromptModal();
    // Focus the textarea after a short delay to ensure the UI has updated
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Auto resize textarea and handle initialMessage
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle initialMessage updates
  useEffect(() => {
    if (initialMessage !== undefined) {
      setMessage(initialMessage);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialMessage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
      
      if (showPromptModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closePromptModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update message when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialMessage]);

  useEffect(() => {
    // Handle prompt modal changes
  }, [showPromptModal]);

  return (
    <div className="relative">
      {/* Model selector */}
      <div className="mb-2 flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center space-x-1 text-sm text-[var(--text)] hover:text-[var(--accent)] px-3 py-1.5 rounded-[var(--global-radius)] bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow transition-all duration-200"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
          >
            <span>{currentModel?.name || 'Select model'}</span>
            <IoChevronDown size={14} />
          </button>
          
          {showModelDropdown && (
            <div className="absolute left-0 bottom-full mb-1 w-60 bg-[var(--card)] border border-[var(--border)] rounded-[var(--global-radius)] shadow-lg z-10 max-h-60 overflow-y-auto">
              {availableModels.map(model => (
                <button
                  key={model.id}
                  className={`w-full text-left px-3 py-2 hover:bg-[var(--accent)]/5 transition-colors duration-200 ${currentModel?.id === model.id ? 'bg-[var(--accent-background)] font-medium text-[var(--accent)]' : ''}`}
                  onClick={() => {
                    if (onModelChange) onModelChange(model.id);
                    setShowModelDropdown(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mr-2">
                      <span className="text-[var(--accent)] text-xs">{model.provider.substring(0, 1).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text)]">{model.name}</div>
                      <div className="text-xs text-muted">{model.provider}</div>
                    </div>
                  </div>
                </button>
              ))}
              
              <button
                className="w-full text-left px-3 py-2 border-t border-[var(--border)] hover:bg-[var(--background)] text-secondary flex items-center"
                onClick={handleAddModelClick}
              >
                <IoAdd size={16} className="mr-2" />
                Add new model
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openPromptModal}
          className="flex items-center gap-1 text-sm text-[var(--text)] hover:text-[var(--accent)] px-3 py-1.5 rounded-[var(--global-radius)] bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow transition-all duration-200"
        >
          {ImprovePromptIcon}
          <span>Improve Prompt</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="rounded-[var(--global-radius)]">
          <textarea
            ref={textareaRef}
            className="w-full px-4 py-3 pr-16 bg-[var(--card)] border border-[var(--border)] rounded-[var(--global-radius)] focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 transition-all duration-200 text-[var(--text)] placeholder:text-muted font-normal resize-none chat-input-textarea"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {!isLoading ? (
              <button
                type="submit"
                disabled={message.trim() === '' || isLoading}
                aria-label="Send message"
                className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-150 disabled:opacity-60 bg-transparent"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                  <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23015 7.39969 6.32015Z" stroke="#4C8BF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path opacity="0.34" d="M10.1094 13.6501L13.6894 10.0601" stroke="#4C8BF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                aria-label="Pause generation"
                className="rounded-full w-10 h-10 flex items-center justify-center shadow transition-all duration-150 border border-[var(--border)] hover:bg-[var(--background)]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                onClick={onPause}
              >
                {PauseIcon}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Prompt Improvement Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-[var(--card)] rounded-[var(--global-radius)] shadow-xl w-full max-w-3xl mx-4 overflow-hidden border border-[var(--border)]"
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">AI Prompt Enhancement</h3>
                <p className="text-sm text-muted mt-1">Using AI to optimize your prompt for better results</p>
              </div>
              {currentModel && (
                <div className="px-3 py-1.5 rounded-[var(--global-radius)] bg-[var(--background)] border border-[var(--border)] text-xs flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-[10px]">{currentModel?.provider.substring(0, 1).toUpperCase()}</span>
                  </div>
                  <span>Using {currentModel?.name}</span>
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {!currentModel ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-md">
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>No Model Selected</span>
                  </div>
                  <p className="text-sm">Please select an AI model first to use this feature.</p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[var(--text)]">Your Original Prompt</label>
                      {enhancedPrompt && (
                        <div className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                          <span>Enhanced by AI</span>
                        </div>
                      )}
                    </div>
                    <textarea
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--global-radius)] focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 transition-all duration-200 text-[var(--text)] placeholder:text-muted resize-none min-h-[80px]"
                      placeholder="Enter your prompt here..."
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      rows={3}
                    ></textarea>
                  </div>
                  
                  {isEnhancing && !enhancedPrompt && (
                    <div className="bg-[var(--background)]/50 rounded-[var(--global-radius)] p-6 border border-[var(--border)] flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                      <p className="text-sm font-medium text-[var(--text)]">
                        {currentModel.name} is analyzing and enhancing your prompt...
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-2">
                        The AI is applying advanced prompt engineering techniques to optimize your request
                      </p>
                    </div>
                  )}
                  
                  {enhancedPrompt && (
                    <>
                      {/* Prompt Analysis and Indicators */}
                      <div className="bg-[var(--background)]/50 rounded-[var(--global-radius)] p-4 border border-[var(--border)]">
                        <h4 className="text-sm font-medium text-[var(--text)] mb-3">Enhancement Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Model Used */}
                          <div className="rounded-md p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            <div className="text-xs uppercase font-semibold mb-1">Model Used</div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
                                <path fillRule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">
                                {currentModel?.name}
                              </span>
                            </div>
                          </div>
                          
                          {/* Prompt Strength */}
                          <div className="rounded-md p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            <div className="text-xs uppercase font-semibold mb-1">Enhancement Level</div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <div className="flex items-center">
                                  <div className="h-2 rounded-full bg-green-200 dark:bg-green-700/50 w-24">
                                    <div 
                                      className="h-2 rounded-full bg-green-500 dark:bg-green-500" 
                                      style={{ width: `${Math.min(100, Math.max(20, (enhancedPrompt.length / promptInput.length * 30)))}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm">
                                    {enhancedPrompt.length > promptInput.length * 3 ? 'Advanced' : 
                                     enhancedPrompt.length > promptInput.length * 2 ? 'Strong' : 'Basic'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Word Count */}
                          <div className="rounded-[var(--global-radius)] p-3 bg-[var(--accent-background)] text-[var(--accent)]">
                            <div className="text-xs uppercase font-semibold mb-1">Length Comparison</div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm">
                                {promptInput.split(/\s+/).length} → {enhancedPrompt.split(/\s+/).length} words
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      {/* Enhanced Prompt */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-[var(--text)]">AI-Enhanced Prompt</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={copyToClipboard}
                              className="flex items-center gap-1 text-xs text-[var(--text)] hover:text-primary px-2 py-1 rounded-[var(--global-radius)] bg-[var(--background)] hover:bg-[var(--background)]/80 transition-colors duration-200"
                            >
                              <IoCopyOutline size={14} />
                              <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                        <div className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--global-radius)] text-[var(--text)] whitespace-pre-wrap overflow-y-auto max-h-[250px] text-sm">
                          {enhancedPrompt}
                        </div>
                        <div className="mt-2 text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                          </svg>
                          <span>This prompt was enhanced by {currentModel?.name} to help you get better results.</span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--background)] flex justify-end gap-3">
              <button
                type="button"
                onClick={closePromptModal}
                className="px-4 py-2 text-[var(--text)] hover:bg-[var(--border)] rounded-[var(--global-radius)] bg-[var(--card)] transition-colors duration-200 border-2 border-[var(--border)]"
              >
                Cancel
              </button>
              
              {enhancedPrompt ? (
                <button
                  type="button"
                  onClick={useEnhancedPrompt}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--text)] rounded-[var(--global-radius)] hover:bg-[var(--border)] transition-colors duration-200 flex items-center gap-2 border-2 border-[var(--border)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span>Use Enhanced Prompt</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enhancePrompt}
                  disabled={!promptInput.trim() || isEnhancing || !currentModel}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--accent)] rounded-[var(--global-radius)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[var(--border)]"
                >
                  {isEnhancing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      {ImprovePromptIcon}
                      <span>Enhance with AI</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;