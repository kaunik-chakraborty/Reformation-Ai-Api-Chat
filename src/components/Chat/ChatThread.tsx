import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/types';
import MessageItem from './MessageItem';

interface ChatThreadProps {
  messages: Message[];
  isLoading?: boolean;
  onRegenerate?: (messageId: string) => void;
  isTransitioning?: boolean; // Add prop to track sidebar transitions
  onEditMessage?: (messageId: string, content: string) => void;
}

const ChatThread: React.FC<ChatThreadProps> = ({ messages, isLoading = false, onRegenerate, isTransitioning = false, onEditMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [shouldPreserveScroll, setShouldPreserveScroll] = useState(false);
  const prevMessageLengthRef = useRef<number>(messages.length);
  const scrollPositionRef = useRef<number>(0);
  
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

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-medium mb-2 text-text">Start a conversation</h3>
        <p className="text-muted max-w-md">
          Type a message below to start chatting with the AI assistant.
        </p>
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