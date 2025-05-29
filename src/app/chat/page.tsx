'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIModel, Chat, Message } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { generateId } from '@/utils/helpers';
import { sendMessageToModel, hasValidApiKey } from '@/utils/api';
import MobileLayout from '@/components/Layout/MobileLayout';
import ChatThread from '@/components/Chat/ChatThread';
import ChatInput from '@/components/Chat/ChatInput';
import ChatHistory from '@/components/Chat/ChatHistory';
import ModelCard from '@/components/Models/ModelCard';
import ModelForm from '@/components/Models/ModelForm';
import Button from '@/components/UI/Button';
import DeleteButton from '@/components/UI/DeleteButton';
import DeleteDialog from '@/components/UI/DeleteDialog';
import { IoAdd, IoSettings, IoChatbubbles, IoGrid, IoAlert, IoEllipsisVertical } from 'react-icons/io5';
import { FiDownload } from 'react-icons/fi';
import ThemeSwitcher from '@/components/UI/ThemeSwitcher';
import { gsap } from 'gsap';

// Replace IoAdd with custom Add SVG
const AddIcon = (
  <svg viewBox="0 0 24 24" fill="none" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);
// Replace IoChatbubbles with custom Chat SVG
const ChatIcon = (
  <svg viewBox="0 0 24 24" fill="none" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M13.0867 21.3877L13.6288 20.4718C14.0492 19.7614 14.2595 19.4062 14.5972 19.2098C14.9349 19.0134 15.36 19.0061 16.2104 18.9915C17.4658 18.9698 18.2531 18.8929 18.9134 18.6194C20.1386 18.1119 21.1119 17.1386 21.6194 15.9134C22 14.9946 22 13.8297 22 11.5V10.5C22 7.22657 22 5.58985 21.2632 4.38751C20.8509 3.71473 20.2853 3.14908 19.6125 2.7368C18.4101 2 16.7734 2 13.5 2H10.5C7.22657 2 5.58985 2 4.38751 2.7368C3.71473 3.14908 3.14908 3.71473 2.7368 4.38751C2 5.58985 2 7.22657 2 10.5V11.5C2 13.8297 2 14.9946 2.3806 15.9134C2.88807 17.1386 3.86144 18.1119 5.08658 18.6194C5.74689 18.8929 6.53422 18.9698 7.78958 18.9915C8.63992 19.0061 9.06509 19.0134 9.40279 19.2098C9.74049 19.4063 9.95073 19.7614 10.3712 20.4718L10.9133 21.3877C11.3965 22.204 12.6035 22.204 13.0867 21.3877ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V7C11.25 6.58579 11.5858 6.25 12 6.25ZM8.75 9C8.75 8.58579 8.41421 8.25 8 8.25C7.58579 8.25 7.25 8.58579 7.25 9V13C7.25 13.4142 7.58579 13.75 8 13.75C8.41421 13.75 8.75 13.4142 8.75 13V9ZM16 8.25C16.4142 8.25 16.75 8.58579 16.75 9V13C16.75 13.4142 16.4142 13.75 16 13.75C15.5858 13.75 15.25 13.4142 15.25 13V9C15.25 8.58579 15.5858 8.25 16 8.25Z" fill="var(--accent)"></path>
  </svg>
);
// Replace IoGrid with custom Models SVG
const ModelsIcon = (
  <svg viewBox="0 0 24 24" fill="none" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.64855 5.36234 3.6059 5.9095 2.95969 6.64132L12 11.1615L21.0403 6.64132C20.3941 5.9095 19.3515 5.36234 17.5777 4.43152Z" fill="var(--accent)"></path>
    <path d="M21.7484 7.96435L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86558 21.7484 7.96435Z" fill="var(--accent)"></path>
    <path d="M11.25 21.904V12.4635L2.25164 7.96434C2 8.86557 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="var(--accent)"></path>
  </svg>
);
// Replace IoSettings with custom Settings SVG
const SettingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l1.86-1.41c.2-.15.25-.42.13-.64l-1.86-3.23c-.12-.22-.39-.3-.61-.22l-2.19.87c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.44 5.42c-.22-.08-.49 0-.61.22L2.97 8.87c-.12.22-.07.49.13.64L4.96 11c-.04.32-.07.65-.07.97c0 .32.03.65.07.97l-1.86 1.41c-.2.15-.25.42-.13.64l1.86 3.23c.12.22.39.3.61.22l2.19-.87c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.19.87c.22.08.49 0 .61-.22l1.86-3.23c.12-.22.07-.49-.13-.64L19.43 13Z" fill="var(--accent)" />
  </svg>
);


export default function Home() {
  const handleDownloadClick = () => {
    alert('Download functionality coming soon!');
  };

  const isMobile = useMobileDetect();

  // Add sidebar visibility state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Add state to track if transition is in progress
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for GSAP animations
  const sidebarRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Handle sidebar toggle with smooth GSAP animation
  const toggleSidebar = () => {
    if (isTransitioning) return; // Prevent multiple animations

    setIsTransitioning(true);

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        timelineRef.current = null;
      }
    });

    timelineRef.current = tl;

    if (isSidebarVisible) {
      // Hide sidebar
      tl.to(sidebarRef.current, {
        x: '-100%',
        duration: 0.8,
        ease: 'power3.inOut'
      })
        .to(mainContentRef.current, {
          marginLeft: '0',
          width: '100%',
          duration: 0.8,
          ease: 'power3.inOut'
        }, '<'); // Start at the same time as sidebar animation

      setIsSidebarVisible(false);
    } else {
      // Show sidebar
      tl.to(sidebarRef.current, {
        x: '0%',
        duration: 0.8,
        ease: 'power3.inOut'
      })
        .to(mainContentRef.current, {
          marginLeft: '16rem',
          width: 'calc(100% - 16rem)',
          duration: 0.8,
          ease: 'power3.inOut'
        }, '<'); // Start at the same time as sidebar animation

      setIsSidebarVisible(true);
    }
  };

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // State for models
  const [models, setModels] = useLocalStorage<AIModel[]>('reformation-ai-models', [
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      apiKey: '',
      maxTokens: 2048,
      temperature: 0.7,
      isDefault: true,
    },
  ]);

  // State for chats
  const [chats, setChats] = useLocalStorage<Chat[]>('reformation-ai-chats', [
    {
      id: 'default-chat',
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: models[0]?.id || '',
      // Add a flag to indicate if the title is temporary
      isTitleTemporary: true,
    },
  ]);

  // Current active states
  const [activeView, setActiveView] = useState<'chat' | 'models' | 'settings' | 'chatHistory'>('chat');
  const [activeChat, setActiveChat] = useState<string>(chats[0]?.id || '');

  // Use localStorage to persist active model between refreshes
  // If current chat has a model specified, use that, otherwise use default model
  const defaultModelId = chats[0]?.modelId || models.find(m => m.isDefault)?.id || models[0]?.id || '';
  const [activeModel, setActiveModel] = useLocalStorage<string>('reformation-ai-active-model', defaultModelId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [showModelForm, setShowModelForm] = useState<boolean>(false);
  const [editingModel, setEditingModel] = useState<AIModel | undefined>(undefined);
  const [showModelModal, setShowModelModal] = useState(false);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState<string | null>(null);
  const [showDeleteAllChatModal, setShowDeleteAllChatModal] = useState(false);

  // State for mobile dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  // State for message editing
  const [editingMessage, setEditingMessage] = useState<string | undefined>();

  // Get current chat and model
  const currentChat = chats.find(c => c.id === activeChat);
  const currentModel = models.find(m => m.id === activeModel) || models[0];

  // Update active model when changing chats
  useEffect(() => {
    if (currentChat?.modelId) {
      // Only update if the chat has a specific model assigned
      // and it's different from the current active model
      if (currentChat.modelId !== activeModel) {
        setActiveModel(currentChat.modelId);
      }
    }
  }, [activeChat, currentChat?.modelId, activeModel, setActiveModel]);

  // Check if the active model has an API key set
  useEffect(() => {
    if (currentModel && !hasValidApiKey(currentModel)) {
      setErrorMessage(`No API key set for ${currentModel.name}. Please add your API key in the Models section.`);
    } else {
      setErrorMessage(null);
    }
  }, [currentModel]);

  // Create a new chat
  const createNewChat = () => {
    // Only save the current chat if it has messages
    if (currentChat && currentChat.messages.length === 0 && chats.length > 0) {
      // Don't save empty chat, just switch to the next available chat
      const nextChat = chats.find(c => c.id !== currentChat.id && c.messages.length > 0);
      setActiveChat(nextChat ? nextChat.id : '');
      setActiveView('chat');
      return;
    }
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: activeModel,
      isTitleTemporary: true,
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setActiveView('chat');
  };

  // Handle model change from chat input
  const handleModelChange = (modelId: string) => {
    setActiveModel(modelId);

    // Update current chat to use this model
    if (currentChat) {
      const updatedChat = {
        ...currentChat,
        modelId,
        updatedAt: Date.now(),
      };

      setChats(chats.map(c => (c.id === activeChat ? updatedChat : c)));
    }
  };

  // Handle message editing
const handleEditMessage = (messageId: string) => {
  if (!currentChat) return;

  const messageIndex = currentChat.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return;

  const message = currentChat.messages[messageIndex];
  const updatedMessages = currentChat.messages.slice(0, messageIndex);

  // Set the message content to be edited
  setEditingMessage(message.content);

  const updateChats = (prevChats: Chat[]) =>
    prevChats.map((chat: Chat) =>
      chat.id === currentChat.id
        ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
        : chat
    );

  setChats(updateChats(chats));
};

  // Send message to AI
  const [paused, setPaused] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sendMessage = async (content: string) => {
    // Clear editing state
    setEditingMessage(undefined);
    if (!currentChat || !currentModel) return;
    setPaused(false); // Reset pause on new message
    setErrorMessage(null);
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    let updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: Date.now(),
    };

    // If the chat title is temporary, set it to the first user message
    if (currentChat.isTitleTemporary) {
      updatedChat = {
        ...updatedChat,
        title: content,
        isTitleTemporary: false,
      };
    }
    setChats(chats.map(c => (c.id === activeChat ? updatedChat : c)));
    if (!hasValidApiKey(currentModel)) {
      setErrorMessage(`No API key set for ${currentModel.name}. Please add your API key in the Models section.`);
      return;
    }
    setIsLoading(true);
    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await sendMessageToModel(
        currentModel,
        [...updatedChat.messages],
        { signal: controller.signal }
      );
      if (paused) return; // If paused after API call, do not update chat
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, response.message],
        updatedAt: Date.now(),
      };
      setChats(chats.map(c => (c.id === activeChat ? finalChat : c)));
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was aborted, do nothing
      } else if (!paused) {
        console.error('Error sending message:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setPaused(false);
      abortControllerRef.current = null;
    }
  };

  // Handle model operations
  const handleAddModel = (model: AIModel) => {
    // If setting as default, update other models
    let updatedModels = [...models];

    if (model.isDefault) {
      updatedModels = updatedModels.map(m => ({
        ...m,
        isDefault: m.id === model.id,
      }));
    }

    setModels([...updatedModels.filter(m => m.id !== model.id), model]);
    setActiveModel(model.id);
    setShowModelModal(false);
    setEditingModel(undefined);
  };

  const handleEditModel = (model: AIModel) => {
    setEditingModel(model);
    setShowModelModal(true);
  };

  const handleDeleteModel = (modelId: string) => {
    if (models.length <= 1) {
      alert('You cannot delete the last model. Please add another model first.');
      return;
    }

    setModels(models.filter(m => m.id !== modelId));

    // If deleting active model, switch to another model
    if (modelId === activeModel) {
      setActiveModel(models.find(m => m.id !== modelId)?.id || '');
    }
  };

  // Go to add model form
  const goToAddModel = () => {
    setActiveView('models');
    setEditingModel(undefined);
    setShowModelForm(true);
  };

  // Mobile header component
  const MobileHeader = () => (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-xl font-semibold text-[#4C8BF5]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Reformation AI
      </h1>
      <div className="flex space-x-2">



        {isMobile && (<Button variant="primary" size="sm" onClick={createNewChat} aria-label="New Chat"> {AddIcon} </Button>)}

        {/* Three-dot menu for mobile view */}
        {isMobile && (
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Options"
            >
              <IoEllipsisVertical size={18} color="#4C8BF5" />
            </Button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveView('models');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left"
                >
                  Models
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                     setActiveView('chatHistory');
                     setShowDropdown(false);
                   }}
                   className="w-full text-left"
                 >
                   Chat History
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Original buttons for non-mobile view or when dropdown is not needed */}
        {!isMobile && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (activeView === 'chat') {
                  setActiveView('settings');
                } else if (activeView === 'settings') {
                  setActiveView('chat');
                } else if (activeView === 'models') {
                  setActiveView('chat');
                }
              }}
              aria-label={activeView === 'chat' ? 'Switch to Settings' : 'Switch to Chat'}
            >
              {activeView === 'chat' ? SettingsIcon : ChatIcon}
            </Button>
            {activeView === 'chat' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveView('models')}
                aria-label="Switch to Models"
              >
                {ModelsIcon}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Mobile footer component
  const MobileFooter = () => (
    <div className="w-full">
      {activeView === 'chat' ? (
        <ChatInput
                onSendMessage={sendMessage}
                isLoading={isLoading}
                onPause={handlePause}
                placeholder="Message Reformation AI..."
                currentModel={currentModel}
                availableModels={models}
                onModelChange={handleModelChange}
                onAddModel={goToAddModel}
                initialMessage={editingMessage}
              />
      ) : null}
    </div>
  );

  // Main desktop layout
  const DesktopLayout = () => (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
      {/* Sidebar Toggle Button (when sidebar is hidden) */}
      {!isSidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-[var(--global-radius)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background)] transition-colors shadow-md"
          aria-label="Show Sidebar"
          disabled={isTransitioning}
        >
          <svg viewBox="0 0 24 24" fill="none" width={24} height={24} xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11V13C22 16.7712 22 18.6569 20.8284 19.8284C19.8541 20.8028 18.3859 20.9668 15.75 20.9944V3.00559C18.3859 3.03321 19.8541 3.19724 20.8284 4.17157C22 5.34315 22 7.22876 22 11Z" fill="#4C8BF5"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M10 3H14H14.25L14.25 21H14H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3ZM4.75 10C4.75 9.58579 5.08579 9.25 5.5 9.25H11.5C11.9142 9.25 12.25 9.58579 12.25 10C12.25 10.4142 11.9142 10.75 11.5 10.75H5.5C5.08579 10.75 4.75 10.4142 4.75 10ZM5.75 14C5.75 13.5858 6.08579 13.25 6.5 13.25H10.5C10.9142 13.25 11.25 13.5858 11.25 14C11.25 14.4142 10.9142 14.75 10.5 14.75H6.5C6.08579 14.75 5.75 14.4142 5.75 14Z" fill="#4C8BF5"></path>
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
               ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-[calc(100%-32px)] w-64 rounded-[var(--global-radius)] gsap-sidebar ${isTransitioning ? 'pointer-events-none' : ''
           }`} // Using --card for sidebar background for better visual hierarchy // Using --card for sidebar background for better visual hierarchy
        style={{
          margin: isSidebarVisible ? '1rem' : '1rem 1rem 1rem -16rem', // Add margin based on sidebar visibility
          background: 'var(--card)',
          border: `2px solid var(--border)`, 
          transform: isSidebarVisible ? 'translateX(0%)' : 'translateX(-100%)'
        }}
      >
        {/* Sidebar content */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#4C8BF5]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Reformation AI
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-[var(--global-radius)] hover:bg-[var(--background)] transition-colors"
            aria-label="Hide Sidebar"
            disabled={isTransitioning}
          >
            <svg viewBox="0 0 24 24" fill="none" width={20} height={20} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6L9 12L15 18" stroke="#4C8BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <Button
            variant="primary"
            onClick={createNewChat}
            className="w-full mb-4 font-medium flex items-center justify-center gap-2 rounded-[var(--global-radius)]"
            leftIcon={AddIcon}
          >
            New Chat
          </Button>
          {/* Chat History List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-between mb-4 gap-2 w-full">
                <div className="flex items-center gap-2">
                  <svg width={18} height={18} viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4C8BF5" strokeWidth="2">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.09958 2.39754C9.24874 2.78396 9.05641 3.21814 8.66999 3.36731C8.52855 3.42191 8.38879 3.47988 8.2508 3.54114C7.87221 3.70921 7.42906 3.53856 7.261 3.15997C7.09293 2.78139 7.26358 2.33824 7.64217 2.17017C7.80267 2.09892 7.96526 2.03147 8.12981 1.96795C8.51623 1.81878 8.95041 2.01112 9.09958 2.39754ZM5.6477 4.24026C5.93337 4.54021 5.92178 5.01495 5.62183 5.30061C5.51216 5.40506 5.40505 5.51216 5.30061 5.62183C5.01495 5.92178 4.54021 5.93337 4.24026 5.6477C3.94031 5.36204 3.92873 4.88731 4.21439 4.58736C4.33566 4.46003 4.46002 4.33566 4.58736 4.21439C4.88731 3.92873 5.36204 3.94031 5.6477 4.24026ZM3.15997 7.261C3.53856 7.42907 3.70921 7.87221 3.54114 8.2508C3.47988 8.38879 3.42191 8.52855 3.36731 8.66999C3.21814 9.05641 2.78396 9.24874 2.39754 9.09958C2.01112 8.95041 1.81878 8.51623 1.96795 8.12981C2.03147 7.96526 2.09892 7.80267 2.17017 7.64217C2.33824 7.26358 2.78139 7.09293 3.15997 7.261ZM2.02109 11.004C2.43518 11.0141 2.76276 11.3579 2.75275 11.7719C2.75092 11.8477 2.75 11.9237 2.75 12C2.75 12.0763 2.75092 12.1523 2.75275 12.2281C2.76276 12.6421 2.43518 12.9859 2.02109 12.996C1.60699 13.006 1.26319 12.6784 1.25319 12.2643C1.25107 12.1764 1.25 12.0883 1.25 12C1.25 11.9117 1.25107 11.8236 1.25319 11.7357C1.26319 11.3216 1.60699 10.994 2.02109 11.004ZM21.6025 14.9004C21.9889 15.0496 22.1812 15.4838 22.032 15.8702C21.9685 16.0347 21.9011 16.1973 21.8298 16.3578C21.6618 16.7364 21.2186 16.9071 20.84 16.739C20.4614 16.5709 20.2908 16.1278 20.4589 15.7492C20.5201 15.6112 20.5781 15.4714 20.6327 15.33C20.7819 14.9436 21.216 14.7513 21.6025 14.9004ZM2.39754 14.9004C2.78396 14.7513 3.21814 14.9436 3.36731 15.33C3.42191 15.4714 3.47988 15.6112 3.54114 15.7492C3.70921 16.1278 3.53856 16.5709 3.15997 16.739C2.78139 16.9071 2.33824 16.7364 2.17017 16.3578C2.09892 16.1973 2.03147 16.0347 1.96795 15.8702C1.81878 15.4838 2.01112 15.0496 2.39754 14.9004ZM19.7597 18.3523C20.0597 18.638 20.0713 19.1127 19.7856 19.4126C19.6643 19.54 19.54 19.6643 19.4126 19.7856C19.1127 20.0713 18.638 20.0597 18.3523 19.7597C18.0666 19.4598 18.0782 18.9851 18.3782 18.6994C18.4878 18.5949 18.5949 18.4878 18.6994 18.3782C18.9851 18.0782 19.4598 18.0666 19.7597 18.3523ZM4.24026 18.3523C4.54021 18.0666 5.01495 18.0782 5.30061 18.3782C5.40506 18.4878 5.51216 18.5949 5.62183 18.6994C5.92178 18.9851 5.93337 19.4598 5.6477 19.7597C5.36204 20.0597 4.88731 20.0713 4.58736 19.7856C4.46003 19.6643 4.33566 19.54 4.21439 19.4126C3.92873 19.1127 3.94031 18.638 4.24026 18.3523ZM7.261 20.84C7.42907 20.4614 7.87221 20.2908 8.2508 20.4589C8.38879 20.5201 8.52855 20.5781 8.66999 20.6327C9.05641 20.7819 9.24874 21.216 9.09958 21.6025C8.95041 21.9889 8.51623 22.1812 8.12981 22.032C7.96526 21.9685 7.80267 21.9011 7.64217 21.8298C7.26358 21.6618 7.09293 21.2186 7.261 20.84ZM16.739 20.84C16.9071 21.2186 16.7364 21.6618 16.3578 21.8298C16.1973 21.9011 16.0347 21.9685 15.8702 22.032C15.4838 22.1812 15.0496 21.9889 14.9004 21.6025C14.7513 21.216 14.9436 20.7819 15.33 20.6327C15.4714 20.5781 15.6112 20.5201 15.7492 20.4589C16.1278 20.2908 16.5709 20.4614 16.739 20.84ZM11.004 21.9789C11.0141 21.5648 11.3579 21.2372 11.7719 21.2472C11.8477 21.2491 11.9237 21.25 12 21.25C12.0763 21.25 12.1523 21.2491 12.2281 21.2472C12.6421 21.2372 12.9859 21.5648 12.996 21.9789C13.006 22.393 12.6784 22.7368 12.2643 22.7468C12.1764 22.7489 12.0883 22.75 12 22.75C11.9117 22.75 11.8236 22.7489 11.7357 22.7468C11.3216 22.7368 10.994 22.393 11.004 21.9789Z" fill="#4C8BF5"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 12.4142 21.5858 12.75 22 12.75C22.4142 12.75 22.75 12.4142 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C11.5858 1.25 11.25 1.58579 11.25 2C11.25 2.41421 11.5858 2.75 12 2.75Z" fill="#4C8BF5"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V12.25H16C16.4142 12.25 16.75 12.5858 16.75 13C16.75 13.4142 16.4142 13.75 16 13.75H12C11.5858 13.75 11.25 13.4142 11.25 13V9C11.25 8.58579 11.5858 8.25 12 8.25Z" fill="#4C8BF5"></path>
                    </g>
                  </svg>
                  <h2 className="text-md font-semibold text-black-500">Chat History</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView('chatHistory')}
                  aria-label="View All Chat History"
                  className="text-[#4C8BF5] ml-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="#4C8BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>


            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {chats.filter(chat => chat.messages.length > 0).map(chat => (
                <div key={chat.id} className="flex items-center justify-between group">
                  <button
                    className={`flex-1 text-left px-3 py-2 rounded-[var(--global-radius)] flex items-center gap-2 transition-all duration-150 font-medium truncate ${chat.id === activeChat
                      ? '!bg-[var(--background)] !text-[var(--text)] !shadow-md border border-[#4C8BF5]' // Updated active state styling
                      : 'hover:bg-[var(--background)] hover:text-[var(--text)] text-gray-700' // Keep hover/inactive state styling
                      }`} 
                    onClick={() => {
                      setActiveChat(chat.id);
                      setActiveView('chat');
                    }}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    title={chat.title}
                  >
                    <span className="truncate max-w-[110px]">{chat.title || 'Untitled Chat'}</span>
                    <span className="ml-auto text-xs text-gray-400">{new Date(chat.createdAt).toLocaleDateString()}</span>
                  </button>
                  <DeleteButton
                    onClick={() => {
                      if (chats.length <= 1) {
                        alert('You cannot delete the last chat.');
                        return;
                      }
                      setChatToDeleteId(chat.id);
                      setShowDeleteModal(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
          <nav className="space-y-1">
            <button
              className={`w-full p-2 text-left rounded-[var(--global-radius)] font-medium flex items-center gap-2 transition-all duration-150 ${activeView === 'chat'
                ? '!bg-[var(--background)] !text-[var(--text)] !shadow-md border border-[#4C8BF5]'
                : 'hover:!bg-[var(--background)] hover:!text-[var(--text)]'
                }`} 
              onClick={() => setActiveView('chat')}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {ChatIcon}
              Chat
            </button>

            <button
              className={`w-full p-2 text-left rounded-[var(--global-radius)] font-medium flex items-center gap-2 transition-all duration-150 ${activeView === 'models'
                ? '!bg-[var(--background)] !text-[var(--text)] !shadow-md border border-[#4C8BF5]'
                : 'hover:!bg-[var(--background)] hover:!text-[var(--text)]'
                }`} 
              onClick={() => setActiveView('models')}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {ModelsIcon}
              Models
            </button>

            <button
              className={`w-full p-2 text-left rounded-[var(--global-radius)] font-medium flex items-center gap-2 transition-all duration-150 ${activeView === 'settings'
                ? '!bg-[var(--background)] !text-[var(--text)] !shadow-md border border-[#4C8BF5]'
                : 'hover:!bg-[var(--background)] hover:!text-[var(--text)]'
                }`} 
              onClick={() => setActiveView('settings')}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {SettingsIcon}
              Settings
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 px-4 pt-4 w-64">
  <div className="flex flex-col items-center justify-center w-full py-4" style={{ color: 'var(--text)' }}>
    <a
      href="#"
      onClick={handleDownloadClick}
      className="download-button w-full flex justify-center"
    >
      <FiDownload size={18} />
      <span className="ml-2">Download</span>
    </a>
  </div>
</div>
      </aside>

      {/* Main content area with GSAP animation */}
      <main
        ref={mainContentRef}
        className={`flex flex-col h-full w-full gsap-main-content ${isTransitioning ? 'overflow-hidden' : 'overflow-visible'
          }`}
        style={{
          marginLeft: isSidebarVisible ? '16rem' : '0',
          width: isSidebarVisible ? 'calc(100% - 16rem)' : '100%'
        }}
      >
        {activeView === 'chat' ? (
          <div className="flex-1 flex flex-col h-full">
            <div className={`flex-1 ${isTransitioning ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              {errorMessage && (
                <div className="m-4 p-3 bg-red-500/20 border border-red-500 rounded-md flex items-center">
                  <IoAlert className="mr-2 text-red-500" size={18} />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              <div className="mx-auto max-w-[800px] w-full" style={{ height: 'calc(100vh - 130px)' }}>
                <ChatThread
                messages={currentChat?.messages || []}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
                onEditMessage={handleEditMessage}
                isTransitioning={isTransitioning}
              />
              </div>
            </div>
            <div className="p-4 border-t border-[var(--border)]">
              <div className="mx-auto max-w-[800px]">
                <ChatInput
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  onPause={handlePause}
                  placeholder="Message Reformation AI..."
                  currentModel={currentModel}
                  availableModels={models}
                  onModelChange={handleModelChange}
                  onAddModel={goToAddModel}
                  initialMessage={editingMessage}
                />
              </div>
            </div>
          </div>
        ) : activeView === 'settings' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 ml-4">Settings</h2>

              <div className="bg-[var(--card)] rounded-[var(--global-radius)] p-4 shadow-sm border border-[var(--border)] ml-4">
                <h3 className="text-xl font-medium mb-4">Appearance</h3>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        ) : activeView === 'chatHistory' ? (
          <ChatHistory
            chats={chats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            onNewChat={createNewChat}
            onBack={() => setActiveView('chat')}
            onDeleteChat={(chatId) => {
              setChatToDeleteId(chatId);
              setShowDeleteModal(true);
            }}
            setShowDeleteAllChatModal={setShowDeleteAllChatModal}
          />
        ) : ( // Models view
          <div className="flex-1 overflow-y-auto p-6">
            {/* Modal for Add/Edit Model */}
            {showModelModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
                <div className="bg-[var(--card)] rounded-2xl shadow-lg p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <ModelForm
                    model={editingModel}
                    onSave={handleAddModel}
                    onCancel={() => {
                      setShowModelModal(false);
                      setEditingModel(undefined);
                    }}
                  />
                </div>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 p-4">
                <div className="bg-[var(--card)] rounded-2xl shadow-lg p-4 md:p-6 max-w-sm w-full">
                  <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                  <p className="mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={() => {
                      if (chatToDeleteId) {
                        setChats(chats.filter(c => c.id !== chatToDeleteId));
                        if (activeChat === chatToDeleteId && chats.length > 1) {
                          const nextChat = chats.find(c => c.id !== chatToDeleteId && c.messages.length > 0);
                          setActiveChat(nextChat ? nextChat.id : '');
                        } else if (chats.length <= 1) {
                          // If deleting the last chat, create a new default one
                          const newChat: Chat = {
                            id: generateId(),
                            title: 'New Chat',
                            messages: [],
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            modelId: models[0]?.id || '',
                            isTitleTemporary: true,
                          };
                          setChats([newChat]);
                          setActiveChat(newChat.id);
                        }
                      }
                      setShowDeleteModal(false);
                      setChatToDeleteId(null);
                    }}>Delete</Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 ml-4">Models</h2>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingModel(undefined);
                  setShowModelModal(true);
                }}
                leftIcon={AddIcon}
                className="font-medium flex items-center justify-center gap-2"
              >
                Add New Model
              </Button>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {models.map(model => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={model.id === activeModel}
                  onSelect={() => setActiveModel(model.id)}
                  onEdit={() => handleEditModel(model)}
                  onDelete={handleDeleteModel}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );

  // Pause handler
  const handlePause = () => {
    setPaused(true);
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (!currentChat || !currentModel) return;

    // Find the message to regenerate
    const messageIndex = currentChat.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Get all messages up to the user message before this AI response
    const messagesToKeep = currentChat.messages.slice(0, messageIndex);

    // Update chat with messages up to the user message
    const updatedChat = {
      ...currentChat,
      messages: messagesToKeep,
      updatedAt: Date.now(),
    };
    setChats(chats.map(c => (c.id === activeChat ? updatedChat : c)));

    // Send the last user message again
    const lastUserMessage = messagesToKeep.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prevChats: Chat[]) => {
      const updatedChats = prevChats.filter((chat: Chat) => chat.id !== chatId);

      if (activeChat === chatId) {
        if (updatedChats.length > 0) {
          setActiveChat(updatedChats[0].id);
        } else {
          // If no chats left, create a new one. createNewChat should handle setting the active chat.
          createNewChat();
        }
      }
      setShowDeleteModal(false);
      return updatedChats;
    });
  };



  const handleDeleteAllChats = () => {
    setChats([]);
    createNewChat();
    setShowDeleteAllChatModal(false);
  };

  interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    requiresConfirmationText?: boolean;
    confirmationText?: string;
  }

  const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message = 'Are you sure you want to delete this item?',
    confirmText = 'Delete',
    requiresConfirmationText = false,
    confirmationText = '',
  }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[var(--card)] p-6 rounded-[var(--global-radius)] shadow-lg max-w-sm w-full border border-[var(--border)]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-red-500 bg-red-100 p-1 rounded"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            {title}
          </h2>
          <p className="mb-4 text-gray-700">{message}</p>
          {requiresConfirmationText && (
            <input
              type="text"
              className="w-full p-2 mb-4 border border-[var(--border)] rounded-[var(--global-radius)] bg-[var(--background)] text-[var(--text)]"
              placeholder={`Type "${confirmationText}" to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
            variant="danger"
            onClick={onConfirm}
            disabled={requiresConfirmationText && inputValue !== confirmationText}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
              {confirmText}
          </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-[var(--background)] text-[var(--text)] min-h-screen">
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteChat(chatToDeleteId!)}
        />
      )}

      {showDeleteAllChatModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteAllChatModal}
          onClose={() => setShowDeleteAllChatModal(false)}
          onConfirm={handleDeleteAllChats}
          title="Delete All Chats"
          message="Are you sure you want to delete all chat history? This action cannot be undone."
          confirmText="Delete All Chat"
          requiresConfirmationText={true}
          confirmationText="Delete All Chat"
        />
      )}
      {isMobile ? (
        <MobileLayout header={<MobileHeader />} footer={<MobileFooter />}>
          {activeView === 'chat' ? (
            <>
              {errorMessage && (
                <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md flex items-center">
                  <IoAlert className="mr-2 text-red-500" size={18} />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              <ChatThread
                messages={currentChat?.messages || []}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
              />
            </>
          ) : activeView === 'settings' ? (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="bg-[var(--card)] rounded-lg p-4 shadow-sm border border-[var(--border)]">
                <h3 className="text-lg font-medium mb-3">Appearance</h3>
                <ThemeSwitcher />
              </div>
            </div>
          ) : activeView === 'chatHistory' ? (
            <ChatHistory
              chats={chats}
              activeChat={activeChat}
              onChatSelect={setActiveChat}
              onNewChat={createNewChat}
              onBack={() => setActiveView('chat')}
              onDeleteChat={(chatId) => {
                setChatToDeleteId(chatId);
                setShowDeleteModal(true);
              }}
              setShowDeleteAllChatModal={setShowDeleteAllChatModal}
            />
          ) : showModelModal ? (
            <div className="p-4 backdrop-blur-sm bg-[var(--background)]/80">
              <ModelForm
                model={editingModel}
                onSave={handleAddModel}
                onCancel={() => {
                  setShowModelModal(false);
                  setEditingModel(undefined);
                }}
              />
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Models</h2>
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingModel(undefined);
                    setShowModelModal(true);
                  }}
                  leftIcon={AddIcon}
                  className="font-medium flex items-center justify-center gap-2"
                >
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {models.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={model.id === activeModel}
                    onSelect={() => setActiveModel(model.id)}
                    onEdit={() => handleEditModel(model)}
                    onDelete={handleDeleteModel}
                  />
                ))}
              </div>
            </div>
          )}
        </MobileLayout>
      ) : (
        <DesktopLayout />
      )}
    </main>
  );
}