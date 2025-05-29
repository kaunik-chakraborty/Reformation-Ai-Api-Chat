import axios from 'axios';
import { AIModel, ChatCompletionRequest, ChatCompletionResponse, Message } from '@/types';
import { generateId } from './helpers';
import { processMessageContent } from './markdownUtils';

// Function to check if a model has a valid API key
export const hasValidApiKey = (model: AIModel): boolean => {
  if (!model.apiKey || model.apiKey.trim().length === 0) {
    return false;
  }

  // Specific validation for OpenRouter API keys
  if (model.provider === 'openrouter') {
    return isValidOpenRouterApiKey(model.apiKey);
  }

  return true;
};

// Function to validate OpenRouter API key format
const isValidOpenRouterApiKey = (apiKey: string): boolean => {
  // OpenRouter API keys can have different formats
  const openRouterKeyPattern = /^(sk-or-v1-[a-zA-Z0-9]+|sk_or_[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]{24,})$/;
  return openRouterKeyPattern.test(apiKey.trim());
};

// Main function to send message to the appropriate model API
export const sendMessageToModel = async (
  model: AIModel,
  messages: Message[],
  options?: { signal?: AbortSignal }
): Promise<ChatCompletionResponse> => {
  if (!hasValidApiKey(model)) {
    throw new Error(`No API key provided for ${model.name}. Please add your API key in the Models section.`);
  }

  try {
    // Use the appropriate API based on the provider
    switch (model.provider) {
      case 'openai':
        return callOpenAIAPI(model, messages, options);
      case 'anthropic':
        return callAnthropicAPI(model, messages, options);
      case 'google':
        return callGoogleGeminiAPI(model, messages, options);
      case 'mistral':
        return callMistralAPI(model, messages, options);
      case 'openrouter':
        return callOpenRouterAPI(model, messages, options);
      case 'custom':
      default:
        return callCustomAPI(model, messages, options);
    }
  } catch (error) {
    console.error('Error sending message to model:', error);
    throw error;
  }
};

// OpenAI API implementation
const callOpenAIAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // You can make this configurable
        messages: formattedMessages,
        max_tokens: model.maxTokens || 2048,
        temperature: model.temperature || 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        signal: options?.signal
      }
    );

    return {
      message: {
        id: generateId(),
        role: 'assistant',
        content: response.data.choices[0]?.message?.content || 'No response received',
        timestamp: Date.now(),
      },
      usage: {
        promptTokens: response.data.usage?.prompt_tokens || 0,
        completionTokens: response.data.usage?.completion_tokens || 0,
        totalTokens: response.data.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Fallback to mock for development
    return mockOpenAIRequest(model, messages);
  }
};

// Google Gemini API implementation
const callGoogleGeminiAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    // Get the last user message (Gemini API is not as conversational as OpenAI)
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    // Use the model name to extract the appropriate model ID
    // Model name should follow the format "Gemini Pro", "Gemini 1.5 Pro", etc.
    const modelName = model.name.trim().toLowerCase();
    
    // Map of display names to their API identifiers
    const modelMap: Record<string, string> = {
      // Gemini 2.5 models
      "gemini 2.5 flash": "gemini-2.5-flash-preview-05-20",
      "gemini 2.5 pro": "gemini-2.5-pro-preview-05-06",
      
      // Gemini 2.0 models
      "gemini 2.0 flash": "gemini-2.0-flash",
      "gemini 2.0 flash lite": "gemini-2.0-flash-lite",
      
      // Gemini 1.5 models
      "gemini 1.5 flash": "gemini-1.5-flash",
      "gemini 1.5 pro": "gemini-1.5-pro",
      
      // Legacy models
      "gemini pro": "gemini-pro",
    };
    
    // Extract the API model ID - first try using the normalized model name,
    // then try using the model.id directly if it appears to be a valid Gemini model ID
    let effectiveModelId = modelMap[modelName];
    
    // If not found in our map, check if the ID itself is a valid Gemini model ID
    if (!effectiveModelId && model.id.includes('gemini-')) {
      effectiveModelId = model.id;
    }
    
    // Fall back to gemini-pro if we couldn't determine the model
    if (!effectiveModelId) {
      effectiveModelId = "gemini-pro";
      console.warn(`Could not determine Gemini model ID from name "${model.name}". Defaulting to gemini-pro.`);
    }
    
    console.log(`Using model name "${modelName}" which maps to model ID "${effectiveModelId}" for Gemini API request`);
    
    // Validate API key
    if (!model.apiKey || model.apiKey.trim() === '') {
      throw new Error('No API key provided for Google Gemini. Please add your API key in the Models section.');
    }

    // Construct the API URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModelId}:generateContent`;
    
    // Prepare request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: lastUserMessage.content
            }
          ]
        }
      ],
      generationConfig: {
        temperature: model.temperature || 0.7,
        maxOutputTokens: model.maxTokens || 2048,
      }
    };

    // Log request details for debugging
    console.log('Sending request to Gemini API:', apiUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    // Make the API request
    const response = await axios.post(`${apiUrl}?key=${model.apiKey}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
      signal: options?.signal
    });
    
    // Log successful response
    console.log('Received response from Gemini API');
    
    // Extract content from response
    let assistantContent = 'No response received';
    let promptTokens = 0;
    let completionTokens = 0;
    let totalTokens = 0;
    
    if (response.data?.candidates?.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content?.parts?.length > 0) {
        assistantContent = candidate.content.parts[0].text || assistantContent;
      }
      
      // Extract token usage if available
      if (response.data.usageMetadata) {
        promptTokens = response.data.usageMetadata.promptTokenCount || 0;
        completionTokens = response.data.usageMetadata.candidatesTokenCount || 0;
        totalTokens = response.data.usageMetadata.totalTokenCount || 0;
      }
    }

    // Return formatted response
    return {
      message: {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      },
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
      },
    };
    
  } catch (error: any) {
    console.error('Google Gemini API Error:');
    
    // Detailed error logging
    if (error.response) {
      // Server responded with non-2xx status
      console.error('Error status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      // Extract the specific error message if available
      const errorMessage = error.response.data?.error?.message || 
                           error.response.data?.error?.details?.[0]?.message || 
                           'Unknown API error';
      
      // Provide a more user-friendly error message based on status code
      if (error.response.status === 404) {
        throw new Error(`Model not found: The model ID is invalid or not available. Please use a valid Gemini model name like "Gemini Pro", "Gemini 1.5 Pro", or "Gemini 2.5 Flash". Details: ${errorMessage}`);
      } else if (error.response.status === 400) {
        throw new Error(`Invalid request to Gemini API: ${errorMessage}`);
      } else if (error.response.status === 401 || error.response.status === 403) {
        throw new Error(`Authentication error: Your Gemini API key may be invalid or expired. Details: ${errorMessage}`);
      } else {
        throw new Error(`Gemini API error (${error.response.status}): ${errorMessage}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from Gemini API');
      throw new Error('No response received from Gemini API. Please check your internet connection and try again.');
    } else {
      // Error in setting up the request
      console.error('Error message:', error.message);
      throw new Error(`Error setting up Gemini API request: ${error.message}`);
    }
  }
};

// Anthropic API implementation
const callAnthropicAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    // Format the messages for Anthropic's API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-2', // You can make this configurable
        messages: formattedMessages,
        max_tokens: model.maxTokens || 2048,
        temperature: model.temperature || 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': model.apiKey,
          'anthropic-version': '2023-06-01'
        },
        signal: options?.signal
      }
    );

    return {
      message: {
        id: generateId(),
        role: 'assistant',
        content: response.data.content?.[0]?.text || 'No response received',
        timestamp: Date.now(),
      },
      usage: {
        promptTokens: 0, // Anthropic doesn't provide token usage in the same format
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  } catch (error) {
    console.error('Anthropic API Error:', error);
    // Fallback to mock for development
    return mockAnthropicRequest(model, messages);
  }
};

// Mistral API implementation
const callMistralAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny', // You can make this configurable
        messages: formattedMessages,
        max_tokens: model.maxTokens || 2048,
        temperature: model.temperature || 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        signal: options?.signal
      }
    );

    return {
      message: {
        id: generateId(),
        role: 'assistant',
        content: response.data.choices[0]?.message?.content || 'No response received',
        timestamp: Date.now(),
      },
      usage: {
        promptTokens: response.data.usage?.prompt_tokens || 0,
        completionTokens: response.data.usage?.completion_tokens || 0,
        totalTokens: response.data.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error('Mistral API Error:', error);
    // Fallback to mock for development
    return mockMistralRequest(model, messages);
  }
};

// Custom API implementation
const callCustomAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    // This would need to be customized based on the specific API
    // For now, just returning a mock response
    return mockCustomRequest(model, messages);
  } catch (error) {
    console.error('Custom API Error:', error);
    return mockCustomRequest(model, messages);
  }
};

// Mock implementations as fallbacks for development or when APIs fail

// Mock OpenAI API request
const mockOpenAIRequest = async (model: AIModel, messages: Message[]): Promise<ChatCompletionResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: {
      id: generateId(),
      role: 'assistant',
      content: `This is a simulated response from OpenAI's model using your API key: ${maskApiKey(model.apiKey)}. In a production environment, this would make a real request to OpenAI's API.`,
      timestamp: Date.now(),
    },
    usage: {
      promptTokens: 50,
      completionTokens: 30,
      totalTokens: 80,
    },
  };
};

// Mock Anthropic API request
const mockAnthropicRequest = async (model: AIModel, messages: Message[]): Promise<ChatCompletionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    message: {
      id: generateId(),
      role: 'assistant',
      content: `This is a simulated response from Anthropic's Claude model using your API key: ${maskApiKey(model.apiKey)}. In a production environment, this would make a real request to Anthropic's API.`,
      timestamp: Date.now(),
    },
    usage: {
      promptTokens: 60,
      completionTokens: 40,
      totalTokens: 100,
    },
  };
};

// Mock Mistral API request
const mockMistralRequest = async (model: AIModel, messages: Message[]): Promise<ChatCompletionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return {
    message: {
      id: generateId(),
      role: 'assistant',
      content: `This is a simulated response from Mistral AI using your API key: ${maskApiKey(model.apiKey)}. In a production environment, this would make a real request to Mistral's API.`,
      timestamp: Date.now(),
    },
    usage: {
      promptTokens: 45,
      completionTokens: 25,
      totalTokens: 70,
    },
  };
};

// Mock Custom API request
const mockCustomRequest = async (model: AIModel, messages: Message[]): Promise<ChatCompletionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1100));
  
  return {
    message: {
      id: generateId(),
      role: 'assistant',
      content: `This is a simulated response from a custom model provider using your API key: ${maskApiKey(model.apiKey)}. In a production environment, this would make a real request to the custom API endpoint.`,
      timestamp: Date.now(),
    },
  };
};

// Utility to mask API key for display purposes
const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 8) return '********';
  
  const firstFour = apiKey.substring(0, 4);
  const lastFour = apiKey.substring(apiKey.length - 4);
  
  return `${firstFour}...${lastFour}`;
};

// OpenRouter API implementation
const callOpenRouterAPI = async (model: AIModel, messages: Message[], options?: { signal?: AbortSignal }): Promise<ChatCompletionResponse> => {
  try {
    // Format messages for OpenRouter
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get model ID from the model configuration
    // OpenRouter model IDs are in the format 'provider/model-name' or 'provider/model-name:free'
    let modelId = model.modelId || 'openai/gpt-3.5-turbo'; // Default fallback
    
    // Log for debugging
    console.log(`Sending request to OpenRouter using model: ${modelId}`);
    console.log(`Using API key with format: ${maskApiKey(model.apiKey)}`);

    // Special handling for code-related queries
    const lastUserMessage = formattedMessages.filter(msg => msg.role === 'user').pop()?.content || '';
    const isCodeRequest = 
      lastUserMessage.toLowerCase().includes('code') || 
      lastUserMessage.toLowerCase().includes('function') ||
      lastUserMessage.toLowerCase().includes('algorithm') ||
      lastUserMessage.toLowerCase().includes('program') ||
      lastUserMessage.toLowerCase().includes('script');

    // Enhanced parameters for better code generation handling
    const requestParams = {
      model: modelId,
      messages: formattedMessages,
      max_tokens: model.maxTokens || 2048,
      temperature: model.temperature || 0.7,
      // For code generation, ensure proper text formatting
      response_format: {
        type: "text" // Ensures raw text format which preserves code formatting
      }
    };

    // For code requests, add specific instructions to format properly
    if (isCodeRequest) {
      // Modify the last message to include formatting instructions
      const lastIndex = formattedMessages.length - 1;
      if (lastIndex >= 0 && formattedMessages[lastIndex].role === 'user') {
        const originalContent = formattedMessages[lastIndex].content;
        requestParams.messages[lastIndex].content = 
          `${originalContent}\n\nIMPORTANT: When providing code, please wrap code examples in markdown code blocks using triple backticks. Include the language after the opening backticks.`;
      }
    }

    console.log("OpenRouter request parameters:", JSON.stringify(requestParams, null, 2));

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`,
          'HTTP-Referer': window.location.origin, // Required by OpenRouter
          'X-Title': 'ReformationAI Chat', // Application name
        },
        signal: options?.signal
      }
    );

    // Extract response content
    let content = response.data.choices[0]?.message?.content || 'No response received';
    
    // Post-process content to ensure proper formatting
    content = processMessageContent(content, false);
    
    // Log content for debugging
    console.log("OpenRouter response content (preview):", content.substring(0, 200) + (content.length > 200 ? "..." : ""));
    
    // Format token usage information if available
    const usage = response.data.usage ? {
      promptTokens: response.data.usage.prompt_tokens || 0,
      completionTokens: response.data.usage.completion_tokens || 0,
      totalTokens: response.data.usage.total_tokens || 0,
    } : {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    // Extract model info if available
    if (response.data.model) {
      console.log(`Response from model: ${response.data.model}`);
    }

    return {
      message: {
        id: generateId(),
        role: 'assistant',
        content: content,
        timestamp: Date.now(),
      },
      usage: usage,
    };
  } catch (error: any) {
    console.error('OpenRouter API Error:');
    
    if (error.response) {
      // Server responded with an error
      console.error('Error status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      const errorMessage = error.response.data?.error?.message || 
                         error.response.data?.error || 
                         'Unknown API error';
      
      // Provide specific error messages based on status codes
      if (error.response.status === 401) {
        throw new Error(`Authentication error: Your OpenRouter API key is invalid. Details: ${errorMessage}`);
      } else if (error.response.status === 402) {
        throw new Error(`Payment Required: You've reached your usage limit or the model requires payment. Details: ${errorMessage}`);
      } else if (error.response.status === 404) {
        throw new Error(`Model not found: The selected model "${model.modelId}" is not available. Details: ${errorMessage}`);
      } else if (error.response.status === 400 && errorMessage.includes("is not a valid model ID")) {
        throw new Error(`Invalid model ID: "${model.modelId}". Check the format and try again. Visit https://openrouter.ai/models for the correct model IDs.`);
      } else if (error.response.status === 400 && errorMessage.includes("require payment")) {
        throw new Error(`This model requires payment: "${model.modelId}". Either this model isn't available in the free tier or your account needs to be topped up. Visit https://openrouter.ai/account to check your balance.`);
      } else if (error.response.status === 400) {
        throw new Error(`OpenRouter API error: ${errorMessage}. Check your model ID format at https://openrouter.ai/models.`);
      } else {
        throw new Error(`OpenRouter API error (${error.response.status}): ${errorMessage}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response received from OpenRouter. Please check your internet connection and try again.');
    } else {
      // Error in setting up the request
      throw new Error(`Error setting up OpenRouter API request: ${error.message}`);
    }
    
    // Don't fall back to mock response, let the error propagate
  }
};