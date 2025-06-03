import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/types';
import MessageItem from './MessageItem';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';

interface ChatThreadProps {
  messages: Message[];
  isLoading?: boolean;
  onRegenerate?: (messageId: string) => void;
  isTransitioning?: boolean; // Add prop to track sidebar transitions
  onEditMessage?: (messageId: string, content: string) => void;
  onSendMessage?: (content: string) => void; // Add prop to handle sending quick chat messages
}

const ChatThread: React.FC<ChatThreadProps> = ({ 
  messages, 
  isLoading = false, 
  onRegenerate, 
  isTransitioning = false, 
  onEditMessage,
  onSendMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [shouldPreserveScroll, setShouldPreserveScroll] = useState(false);
  const prevMessageLengthRef = useRef<number>(messages.length);
  const scrollPositionRef = useRef<number>(0);
  const { isSignedIn } = useUser();
  
  // Enhanced quick chat suggestions with categories
  const quickChatSuggestions = [
    { text: "Tell me about yourself", icon: "🤖", category: "General" },
    { text: "How can you help me?", icon: "🔍", category: "General" },
    { text: "Generate a React component", icon: "💻", category: "Coding" },
    { text: "Explain how APIs work", icon: "💡", category: "Learning" },
    { text: "Write a blog post", icon: "✍️", category: "Content" },
    { text: "Help me brainstorm ideas", icon: "🧠", category: "Creative" },
  ];
  
  // Initial mount effect
  useEffect(() => {
    setIsInitialMount(false);
  }, []);
  
  // Preserve scroll position during sidebar transitions
  useEffect(() => {
    if (isTransitioning && containerRef.current) {
      // Save current scroll position
      scrollPositionRef.current = containerRef.current.scrollTop;
      setShouldPreserveScroll(true);
    } else if (!isTransitioning && shouldPreserveScroll && containerRef.current) {
      // Restore scroll position after transition
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = scrollPositionRef.current;
        }
        setShouldPreserveScroll(false);
      }, 50); // Small delay to ensure layout is complete
    }
  }, [isTransitioning, shouldPreserveScroll]);
  
  // Check for new messages
  useEffect(() => {
    // Only trigger scroll for new messages if not transitioning
    if (messages.length > prevMessageLengthRef.current && !isTransitioning && !shouldPreserveScroll) {
      setHasNewMessages(true);
    }
    
    prevMessageLengthRef.current = messages.length;
  }, [messages, isTransitioning, shouldPreserveScroll]);
  
  // Handle scrolling when new messages arrive
  useEffect(() => {
    if (hasNewMessages && messagesEndRef.current && !isTransitioning && !shouldPreserveScroll) {
      // Scroll to the bottom with new messages
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessages(false);
    }
  }, [hasNewMessages, isTransitioning, shouldPreserveScroll]);
  
  // Initial scroll to bottom
  useEffect(() => {
    if (!isInitialMount && messagesEndRef.current && messages.length > 0 && !isTransitioning) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [isInitialMount, messages.length, isTransitioning]);

  // Handle quick chat suggestion click
  const handleQuickChatClick = (suggestion: string) => {
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h3 className="text-xl font-medium mb-2 text-text text-center">Start a conversation</h3>
        <p className="text-muted max-w-md mb-4 text-center">
          Type a message below or select a suggestion to begin.
        </p>
        

        
        {/* Enhanced quick chat suggestions with better UI */}
        <div className="w-full max-w-2xl px-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mx-auto">
            {quickChatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickChatClick(suggestion.text)}
                className="group p-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--global-radius)] text-left hover:border-[var(--accent)] hover:shadow-md transition-all duration-200 animate-fade-in relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[var(--global-radius)]"></div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-[var(--accent)] transition-colors duration-200">
                      {suggestion.text}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-[var(--background)] text-[var(--text-secondary)] rounded-full">
                      {suggestion.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="py-2 px-4 w-full h-full chat-thread-container overflow-y-auto" 
      ref={containerRef}
      style={{ 
        overscrollBehavior: 'none',
        scrollBehavior: isTransitioning ? 'auto' : 'smooth'
      }}
    >
      {messages.map((message, index) => (
        <MessageItem 
          key={message.id} 
          message={message}
          isLastMessage={index === messages.length - 1}
          onRegenerate={onRegenerate}
          onEditMessage={onEditMessage}
          subsequentMessages={messages.slice(index + 1)}
        />
      ))}
      
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-150"></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatThread;