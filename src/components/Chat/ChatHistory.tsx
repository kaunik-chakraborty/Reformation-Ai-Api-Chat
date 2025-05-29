'use client';

import React, { useState } from 'react';
import { Chat } from '@/types';
import Button from '@/components/UI/Button';
import DeleteButton from '@/components/UI/DeleteButton';
import DeleteDialog from '@/components/UI/DeleteDialog';
import { IoArrowBack, IoAdd } from 'react-icons/io5';

interface ChatHistoryProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onBack: () => void;
  onDeleteChat: (chatId: string) => void;
  setShowDeleteAllChatModal: (show: boolean) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onBack,
  onDeleteChat,
  setShowDeleteAllChatModal
}) => {
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  // Custom Add SVG icon
  const AddIcon = (
    <svg viewBox="0 0 24 24" fill="none" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
      <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="#4C8BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-[var(--background)] md:pl-4 lg:pl-4">
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={chatToDelete !== null}
        onClose={() => setChatToDelete(null)}
        onConfirm={() => {
          if (chatToDelete) {
            onDeleteChat(chatToDelete);
            setChatToDelete(null);
          }
        }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            aria-label="Back to Chat"
          >
            <IoArrowBack size={18} />
          </Button>
          <h1 className="text-xl font-normal text-[#000000]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Chat History
          </h1>
        </div>
        {chats.filter(chat => chat.messages.length > 0).length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteAllChatModal(true)}
            aria-label="Delete All Chat History"
            className="text-red-500"
          >
            Delete All Chat
          </Button>
        )}
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-4">
        {chats.filter(chat => chat.messages.length > 0).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-400 mb-4">
              <svg viewBox="0 0 24 24" fill="none" width={48} height={48} xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.0867 21.3877L13.6288 20.4718C14.0492 19.7614 14.2595 19.4062 14.5972 19.2098C14.9349 19.0134 15.36 19.0061 16.2104 18.9915C17.4658 18.9698 18.2531 18.8929 18.9134 18.6194C20.1386 18.1119 21.1119 17.1386 21.6194 15.9134C22 14.9946 22 13.8297 22 11.5V10.5C22 7.22657 22 5.58985 21.2632 4.38751C20.8509 3.71473 20.2853 3.14908 19.6125 2.7368C18.4101 2 16.7734 2 13.5 2H10.5C7.22657 2 5.58985 2 4.38751 2.7368C3.71473 3.14908 3.14908 3.71473 2.7368 4.38751C2 5.58985 2 7.22657 2 10.5V11.5C2 13.8297 2 14.9946 2.3806 15.9134C2.88807 17.1386 3.86144 18.1119 5.08658 18.6194C5.74689 18.8929 6.53422 18.9698 7.78958 18.9915C8.63992 19.0061 9.06509 19.0134 9.40279 19.2098C9.74049 19.4063 9.95073 19.7614 10.3712 20.4718L10.9133 21.3877C11.3965 22.204 12.6035 22.204 13.0867 21.3877Z" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Chat History</h3>
            <p className="text-gray-400 mb-4">Start a new conversation to see your chat history here.</p>
            <Button
              variant="primary"
              onClick={onNewChat}
              leftIcon={AddIcon}
              className="font-medium flex items-center justify-center gap-2"
            >
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {chats
              .filter(chat => chat.messages.length > 0)
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map(chat => {
                const firstUserMessage = chat.messages.find(m => m.role === 'user');
                const preview = firstUserMessage?.content.slice(0, 100) || 'No messages';
                const isActive = chat.id === activeChat;
                
                return (
                  <div
                    key={chat.id}
                    className={`p-4 rounded-[var(--global-radius)] border-2 transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#4C8BF5]/1 border-[#4C8BF5] shadow-sm'
                        : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--background)] hover:border-[#4C8BF5]/10'
                    }`} 
                    onClick={() => {
                      onChatSelect(chat.id);
                      onBack();
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium truncate flex-1 mr-2 ${
                        isActive ? 'text-[#4C8BF5]' : 'text-[var(--text)]'
                      }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {chat.title || 'Untitled Chat'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                        <DeleteButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatToDelete(chat.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          onTouchEnd={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {preview}{preview.length >= 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;