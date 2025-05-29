// Chat types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  isTitleTemporary?: boolean;
}

// AI model types
export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'mistral' | 'custom' | 'openrouter';
  apiKey: string;
  iconUrl?: string;
  maxTokens?: number;
  temperature?: number;
  isDefault?: boolean;
  modelId?: string;
}

// API request/response types
export interface ChatCompletionRequest {
  modelId: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResponse {
  message: Message;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// UI States
export interface UIState {
  isMobile: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  activeView: 'chat' | 'models' | 'settings';
}