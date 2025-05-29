import { AIModel, Message } from '@/types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format timestamp to readable date
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Get first characters from string (for avatar)
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  return window.innerWidth < 768;
};

// Get model by ID
export const getModelById = (models: AIModel[], id: string): AIModel | undefined => {
  return models.find(model => model.id === id);
};

// Get default model
export const getDefaultModel = (models: AIModel[]): AIModel | undefined => {
  return models.find(model => model.isDefault) || models[0];
};

// Check if API key is valid format (basic check)
export const isValidApiKey = (key: string, provider: string): boolean => {
  if (!key || key.trim() === '') return false;
  
  const keyPatterns: Record<string, RegExp> = {
    'openai': /^sk-[a-zA-Z0-9]{32,}$/,
    'anthropic': /^sk-ant-[a-zA-Z0-9]{32,}$/,
    'google': /^[a-zA-Z0-9_-]{39}$/,
    'mistral': /^[a-zA-Z0-9]{32,}$/,
    'openrouter': /^(sk-or-v1-[a-zA-Z0-9]+|sk_or_[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]{24,})$/,
  };
  
  return provider in keyPatterns ? keyPatterns[provider].test(key) : key.length > 10;
};

// Update OpenRouter model IDs to the new format if needed
export const updateOpenRouterModelId = (oldModelId: string): string => {
  // Map of old to new model IDs
  const modelIdMap: Record<string, string> = {
    'meta/llama-4-maverick': 'meta-llama/llama-4-maverick:free',
    'meta/llama-4-scout': 'meta-llama/llama-4-scout:free',
    'meta/llama-3-70b-instruct': 'meta-llama/llama-3-70b-instruct:free',
    'meta/llama-3-8b-instruct': 'meta-llama/llama-3-8b-instruct:free',
  };

  return modelIdMap[oldModelId] || oldModelId;
};