import React, { useState, useEffect } from 'react';
import { AIModel } from '@/types';
import Input from '../UI/Input';
import Button from '../UI/Button';
import InfoTooltip from '../UI/InfoTooltip';
import { isValidApiKey } from '@/utils/helpers';
import { generateId } from '@/utils/helpers';
import { updateOpenRouterModelId } from '@/utils/helpers';

interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

interface OpenRouterModelOption extends ModelOption {
  category: string;
}

// Define available models for each provider
const PROVIDER_MODELS: {
  openai: ModelOption[];
  anthropic: ModelOption[];
  google: ModelOption[];
  openrouter: OpenRouterModelOption[];
} = {
  openai: [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-4o', name: 'GPT-4o' },
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'claude-2', name: 'Claude 2' },
  ],
  google: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  ],
  openrouter: [
    // OpenAI models
    { id: 'openai/gpt-4o', name: 'OpenAI: GPT-4o', category: 'OpenAI' },
    { id: 'openai/gpt-4-turbo', name: 'OpenAI: GPT-4 Turbo', category: 'OpenAI' },
    { id: 'openai/gpt-4', name: 'OpenAI: GPT-4', category: 'OpenAI' },
    { id: 'openai/gpt-3.5-turbo', name: 'OpenAI: GPT-3.5 Turbo', category: 'OpenAI' },

    // Anthropic models
    { id: 'anthropic/claude-3-opus', name: 'Anthropic: Claude 3 Opus', category: 'Anthropic' },
    { id: 'anthropic/claude-3-sonnet', name: 'Anthropic: Claude 3 Sonnet', category: 'Anthropic' },
    { id: 'anthropic/claude-3-haiku', name: 'Anthropic: Claude 3 Haiku', category: 'Anthropic' },
    { id: 'anthropic/claude-2', name: 'Anthropic: Claude 2', category: 'Anthropic' },

    // Google models
    { id: 'google/gemini-pro', name: 'Google: Gemini Pro', category: 'Google' },
    { id: 'google/gemini-1.5-pro', name: 'Google: Gemini 1.5 Pro', category: 'Google' },
    { id: 'google/gemini-1.5-flash', name: 'Google: Gemini 1.5 Flash', category: 'Google' },

    // Meta models
    { id: 'meta-llama/llama-4-maverick:free', name: 'Meta: Llama 4 Maverick', category: 'Meta', description: 'High-capacity multimodal model (17B, 128E)' },
    { id: 'meta-llama/llama-4-scout:free', name: 'Meta: Llama 4 Scout', category: 'Meta', description: 'Mixture-of-experts model (17B, 16E)' },
    { id: 'meta-llama/llama-3-70b-instruct:free', name: 'Meta: Llama 3 70B Instruct', category: 'Meta' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Meta: Llama 3 8B Instruct', category: 'Meta' },

    // DeepSeek models
    { id: 'deepseek/deepseek-coder', name: 'DeepSeek: DeepSeek Coder', category: 'DeepSeek' },
    { id: 'deepseek/deepseek-llm-67b-chat', name: 'DeepSeek: DeepSeek LLM 67B Chat', category: 'DeepSeek' },

    // Other/Custom models
    { id: 'custom', name: 'Custom Model ID', category: 'Other', description: 'Use a custom model ID from OpenRouter' },
  ],
};

// Group OpenRouter models by category
const groupedOpenRouterModels = () => {
  const models = PROVIDER_MODELS.openrouter;
  const grouped: Record<string, OpenRouterModelOption[]> = {};

  models.forEach(model => {
    if (!grouped[model.category]) {
      grouped[model.category] = [];
    }
    grouped[model.category].push(model);
  });

  return grouped;
};

// Tooltip descriptions
const TOOLTIP_DESCRIPTIONS = {
  provider: "Select the AI provider for your model. Each provider offers different models with varying capabilities and pricing.",
  model: "Choose a specific model from the selected provider. Different models have different capabilities and costs.",
  apiKey: "Your API key is required to authenticate with the provider's API. Keep this secure and never share it.",
  displayName: "A custom name to identify this model in your interface. You can use any name that helps you recognize the model.",
  maxTokens: "Maximum number of tokens (words/characters) the model can generate in a single response. Higher values allow longer responses but may cost more.",
  temperature: "Controls randomness. Lower values (0.0) make responses more deterministic and focused. Higher values (1.0) make output more random and creative.",
  iconUrl: "Optional URL to an image that will be displayed as an icon for this model in the interface.",
  defaultModel: "If checked, this model will be used as the default when starting new conversations.",
  openrouter: "OpenRouter provides access to models from multiple providers through a single API, including OpenAI, Anthropic, Google, Meta, and more."
};

interface ModelFormProps {
  model?: AIModel;
  onSave: (model: AIModel) => void;
  onCancel: () => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  model,
  onSave,
  onCancel,
}) => {
  const isEditing = !!model;

  // Update model ID if it's an old format OpenRouter ID
  const updatedModelId = model?.provider === 'openrouter' && model?.modelId
    ? updateOpenRouterModelId(model.modelId)
    : model?.modelId || '';

  // Determine initial category for OpenRouter models
  const determineInitialCategory = (): string => {
    if (model?.provider !== 'openrouter' || !updatedModelId) {
      return 'OpenAI'; // Default category
    }

    // Check if this is a custom model ID not in our predefined list
    const allOpenRouterModels = PROVIDER_MODELS.openrouter;
    const matchingModel = allOpenRouterModels.find(m => m.id === updatedModelId);

    if (!matchingModel) {
      // It's a custom model ID
      return 'Other';
    }

    return matchingModel.category;
  };

  // Initialize custom model ID from existing model
  const initialCustomModelId = model?.provider === 'openrouter' &&
    !PROVIDER_MODELS.openrouter.some(m => m.id === updatedModelId && m.id !== 'custom')
    ? updatedModelId
    : '';

  // Determine if we should show the custom model field initially
  const shouldShowCustomField = model?.provider === 'openrouter' &&
    (updatedModelId === 'custom' || !PROVIDER_MODELS.openrouter.some(m => m.id === updatedModelId && m.id !== 'custom'));

  const [formData, setFormData] = useState<AIModel>({
    id: model?.id || generateId(),
    name: model?.name || '',
    provider: model?.provider || 'openai',
    apiKey: model?.apiKey || '',
    iconUrl: model?.iconUrl || '',
    maxTokens: model?.maxTokens || 2048,
    temperature: model?.temperature || 0.7,
    isDefault: model?.isDefault || false,
    modelId: updatedModelId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean, message: string } | null>(null);
  const [openRouterCategory, setOpenRouterCategory] = useState<string>(determineInitialCategory());
  const [customModelId, setCustomModelId] = useState<string>(initialCustomModelId);
  const [showCustomModelField, setShowCustomModelField] = useState<boolean>(shouldShowCustomField);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Reset test result when provider or API key changes
  useEffect(() => {
    setTestResult(null);
  }, [formData.provider, formData.apiKey]);

  // Update model name when selecting a different model from the dropdown
  const handleModelSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModelId = e.target.value;
    const provider = formData.provider;
    let modelInfo: ModelOption | OpenRouterModelOption | undefined;

    if (provider === 'openrouter') {
      modelInfo = PROVIDER_MODELS.openrouter.find(m => m.id === selectedModelId);

      // If custom model option is selected
      if (selectedModelId === 'custom') {
        setShowCustomModelField(true);
        setFormData(prev => ({
          ...prev,
          name: 'Custom OpenRouter Model',
          modelId: customModelId || '' // Use custom ID if already entered
        }));
        return;
      } else {
        setShowCustomModelField(false);
      }
    } else {
      const models = PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS] || [];
      modelInfo = models.find(m => m.id === selectedModelId);
    }

    if (modelInfo) {
      setFormData(prev => ({
        ...prev,
        name: modelInfo.name,
        modelId: selectedModelId
      }));
    }
  };

  // Handle OpenRouter category change
  const handleCategoryChange = (category: string) => {
    setOpenRouterCategory(category);

    // Set the first model in the category as selected
    const grouped = groupedOpenRouterModels();
    if (grouped[category] && grouped[category].length > 0) {
      const firstModel = grouped[category][0];

      // If this is the "Other" category, automatically select the custom model option
      if (category === 'Other' && firstModel.id === 'custom') {
        setShowCustomModelField(true);
        setFormData(prev => ({
          ...prev,
          name: 'Custom OpenRouter Model',
          modelId: customModelId || '' // Use custom ID if already entered
        }));
      } else {
        // Otherwise use the first model in the category
        setFormData(prev => ({
          ...prev,
          name: firstModel.name,
          modelId: firstModel.id
        }));

        // Reset custom model ID field when changing categories
        if (category !== 'Other') {
          setShowCustomModelField(false);
        }
      }
    }
  };

  // Reset model selection when provider changes
  useEffect(() => {
    // If we're editing an existing model and it already has a modelId,
    // don't reset the model selection when provider changes
    if (isEditing && model?.modelId === formData.modelId) {
      return;
    }

    if (formData.provider === 'openrouter') {
      const grouped = groupedOpenRouterModels();
      const category = openRouterCategory || 'OpenAI';

      if (grouped[category] && grouped[category].length > 0) {
        const firstModel = grouped[category][0];
        setFormData(prev => ({
          ...prev,
          name: firstModel.name,
          modelId: firstModel.id
        }));

        // Reset custom model ID field when changing categories
        if (category !== 'Other') {
          setShowCustomModelField(false);
        }
      }
    } else if (PROVIDER_MODELS[formData.provider as keyof typeof PROVIDER_MODELS]?.length > 0) {
      const firstModel = PROVIDER_MODELS[formData.provider as keyof typeof PROVIDER_MODELS][0];
      setFormData(prev => ({
        ...prev,
        name: firstModel.name,
        modelId: firstModel.id
      }));
      setShowCustomModelField(false);
    }
  }, [formData.provider, openRouterCategory, isEditing, model?.modelId]);

  // Handle custom model ID input
  const handleCustomModelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomModelId(value);

    // Update the form data with the custom model ID
    if (formData.provider === 'openrouter' && showCustomModelField) {
      setFormData(prev => ({
        ...prev,
        modelId: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    } else if (!isValidApiKey(formData.apiKey, formData.provider)) {
      newErrors.apiKey = 'Invalid API Key format';
    }

    if (!formData.modelId) {
      newErrors.model = 'Please select a model';
    }

    // Special validation for custom model ID
    if (formData.provider === 'openrouter' && showCustomModelField && !customModelId.trim()) {
      newErrors.customModelId = 'Custom Model ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Get placeholder text for API key based on provider
  const getApiKeyPlaceholder = () => {
    switch (formData.provider) {
      case 'openai':
        return 'sk-xxxxxxxxxxxxxxxxxxxx';
      case 'anthropic':
        return 'sk-ant-xxxxxxxxxxxxx';
      case 'google':
        return 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      case 'openrouter':
        return 'sk-or-v1-xxxxxxxxxx or sk_or_xxxxxxxxxx';
      default:
        return 'Enter your API key';
    }
  };

  // Get API key requirements help text
  const getApiKeyHelp = () => {
    switch (formData.provider) {
      case 'openai':
        return 'OpenAI API keys start with "sk-"';
      case 'anthropic':
        return 'Anthropic API keys start with "sk-ant-"';
      case 'google':
        return 'Google API keys are alphanumeric and typically 39 characters';
      case 'openrouter':
        return 'OpenRouter supports various API key formats';
      default:
        return '';
    }
  };

  // Get API documentation URL based on provider
  const getApiDocUrl = () => {
    switch (formData.provider) {
      case 'openai':
        return 'https://platform.openai.com/account/api-keys';
      case 'anthropic':
        return 'https://console.anthropic.com/account/keys';
      case 'google':
        return 'https://ai.google.dev/tutorials/setup';
      case 'openrouter':
        return 'https://openrouter.ai/keys';
      default:
        return '';
    }
  };

  // Test API key with actual provider API
  const testApiKey = async () => {
    if (!formData.apiKey.trim()) {
      setErrors({ ...errors, apiKey: 'API Key is required' });
      return;
    }

    // Use the validation function for all providers
    if (!isValidApiKey(formData.apiKey, formData.provider)) {
      setErrors({ ...errors, apiKey: 'Invalid API Key format' });
      return;
    }

    setIsTestingKey(true);
    setTestResult(null);

    try {
      let isValid = false;
      let message = '';

      // Make actual API requests based on provider
      switch (formData.provider) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${formData.apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          isValid = openaiResponse.ok;
          message = isValid ? 'OpenAI API key is valid!' : `Failed: ${(await openaiResponse.json())?.error?.message || 'Invalid API key'}`;
          break;

        case 'anthropic':
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': formData.apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: "claude-3-haiku-20240307",
              max_tokens: 10,
              messages: [
                { role: "user", content: "Hello" }
              ]
            })
          });
          isValid = anthropicResponse.ok;
          message = isValid ? 'Anthropic API key is valid!' : `Failed: ${(await anthropicResponse.json())?.error?.message || 'Invalid API key'}`;
          break;

        case 'openrouter':
          try {
            const openrouterResponse = await fetch('https://openrouter.ai/api/v1/models', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${formData.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'ReformationAI Chat'
              }
            });

            if (openrouterResponse.ok) {
              const models = await openrouterResponse.json();
              isValid = models && Array.isArray(models.data) && models.data.length > 0;
              message = isValid
                ? 'OpenRouter API key is valid!'
                : 'API key is valid but no models were found';

              // Log available models for debugging
              if (isValid) {
                console.log('Available OpenRouter models:', models.data.map((m: any) => m.id));
              }

              // Check if the current model is available
              if (isValid && formData.modelId) {
                const modelExists = models.data.some((model: any) => model.id === formData.modelId);
                if (!modelExists) {
                  message += ` Note: Selected model "${formData.modelId}" may not be available with your current plan.`;
                }
              }
            } else {
              // Try to get a structured error message
              let errorData;
              try {
                errorData = await openrouterResponse.json();
              } catch (e) {
                errorData = { error: { message: 'Unknown error' } };
              }

              isValid = false;
              message = `Failed: ${errorData?.error?.message || `Status code ${openrouterResponse.status}`}`;

              // Special handling for common error codes
              if (openrouterResponse.status === 401) {
                message = 'Invalid API key. Please check your OpenRouter API key and try again.';
              } else if (openrouterResponse.status === 403) {
                message = 'Access forbidden. Your API key may not have sufficient permissions.';
              }
            }
          } catch (openrouterError) {
            console.error('OpenRouter API test error:', openrouterError);
            isValid = false;
            message = `Error connecting to OpenRouter: ${openrouterError instanceof Error ? openrouterError.message : 'Unknown error'}`;
          }
          break;

        case 'google':
          const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${formData.apiKey}`);
          isValid = googleResponse.ok;
          message = isValid ? 'Google API key is valid!' : `Failed: ${(await googleResponse.json())?.error?.message || 'Invalid API key'}`;
          break;
      }

      setTestResult({
        success: isValid,
        message: message
      });
    } catch (error) {
      console.error('API test error:', error);
      setTestResult({
        success: false,
        message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  // Fetch available models from OpenRouter API
  const fetchOpenRouterModels = async () => {
    if (!formData.apiKey.trim()) {
      setErrors({ ...errors, apiKey: 'API Key is required to fetch models' });
      return;
    }

    setIsLoadingModels(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${formData.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ReformationAI Chat'
        }
      });

      if (response.ok) {
        const models = await response.json();

        if (models && Array.isArray(models.data) && models.data.length > 0) {
          const modelIds = models.data.map((model: any) => model.id);
          setAvailableModels(modelIds);

          // Set success message
          setTestResult({
            success: true,
            message: `Successfully fetched ${modelIds.length} models from OpenRouter.`
          });
        } else {
          setTestResult({
            success: false,
            message: 'No models found with your API key.'
          });
        }
      } else {
        // Handle error
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: { message: 'Unknown error' } };
        }

        setTestResult({
          success: false,
          message: `Failed to fetch models: ${errorData?.error?.message || `Status code ${response.status}`}`
        });
      }
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      setTestResult({
        success: false,
        message: `Error fetching models: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Handle selecting a model from the available models list
  const handleSelectAvailableModel = (modelId: string) => {
    setCustomModelId(modelId);

    // Update form data
    if (formData.provider === 'openrouter' && showCustomModelField) {
      setFormData(prev => ({
        ...prev,
        modelId: modelId,
        name: `Custom: ${modelId.split('/').pop() || modelId}`
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  // Find the current model ID
  const getCurrentModelId = () => {
    return formData.modelId || '';
  };

  // Custom model ID input field
  const renderCustomModelIdField = () => {
    return (
      <div className="mt-4">
        <Input
          type="text"
          value={customModelId}
          onChange={handleCustomModelIdChange}
          placeholder="e.g. meta-llama/llama-4-maverick:free"
          error={errors.customModelId}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <span>
              Find model IDs at <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/models</a>
            </span>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={fetchOpenRouterModels}
            isLoading={isLoadingModels}
            disabled={!formData.apiKey.trim() || isLoadingModels}
            className="text-xs w-full sm:w-auto"
          >
            Fetch Models
          </Button>
        </div>

        {/* Display available models fetched from API */}
        {availableModels.length > 0 && (
          <div className="mt-3 border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="bg-[var(--card)] px-3 py-2 border-b border-[var(--border)] flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--text)]">Available Models ({availableModels.length})</span>
              <span className="text-xs text-[var(--text-muted)]">Click to select</span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {availableModels.map((modelId) => (
                <button
                  key={modelId}
                  onClick={() => handleSelectAvailableModel(modelId)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--background)] transition-colors ${customModelId === modelId ? 'bg-[var(--background)] font-medium text-primary' : 'text-[var(--text)]'
                    }`}
                >
                  {modelId}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <h4 className="font-medium mb-2">How to use a custom model ID:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Visit <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter's models page</a></li>
            <li>Find the model you want to use</li>
            <li>Copy the model ID exactly (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">meta-llama/llama-4-maverick:free</code>)</li>
            <li>Paste it here</li>
          </ol>
          <p className="mt-3 text-xs">
            <strong>Note:</strong> Model IDs typically follow the format <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">provider/model-name[:tier]</code> where:
          </p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>provider: The company or organization that created the model</li>
            <li>model-name: The specific model name</li>
            <li>tier: Optional suffix indicating pricing tier (e.g., :free)</li>
          </ul>
          <p className="mt-3 text-xs">
            <strong>Example model IDs:</strong>
          </p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">meta-llama/llama-4-maverick:free</code></li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">anthropic/claude-3-opus</code></li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">openai/gpt-4o</code></li>
          </ul>
        </div>
      </div>
    );
  };

  // Render OpenRouter model selection UI
  const renderOpenRouterModelSelection = () => {
    const grouped = groupedOpenRouterModels();
    const categories = Object.keys(grouped);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-[var(--text)]">
            Provider Category
          </label>
          <InfoTooltip text={TOOLTIP_DESCRIPTIONS.openrouter} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => {
            const isSelected = openRouterCategory === category;
            const models = grouped[category] || [];
            return (
              <button
                key={category}
                type="button"
                className={`px-3 sm:px-4 py-2 text-sm rounded-[var(--global-radius)] transition-all flex items-center gap-2 ${isSelected
                    ? 'bg-[#4C8BF5] text-white shadow-md shadow-[#4C8BF5]/20 scale-[1.02]'
                    : 'bg-[var(--background)] text-[var(--text)] hover:bg-[var(--border)] hover:scale-[1.02]'
                  } ${models.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleCategoryChange(category)}
                disabled={models.length === 0}
              >
                {category}
                {models.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-[var(--global-radius)] bg-[var(--card)] text-[var(--text-muted)]">
                    {models.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!showCustomModelField && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[var(--text)]">
                  Model
                </label>
                <InfoTooltip text={TOOLTIP_DESCRIPTIONS.model} />
              </div>

              {/* Add direct link to switch to custom model input */}
              <button
                type="button"
                onClick={() => {
                  setShowCustomModelField(true);
                  setOpenRouterCategory('Other');
                  setFormData(prev => ({
                    ...prev,
                    name: 'Custom OpenRouter Model',
                    modelId: customModelId || ''
                  }));
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Use custom model ID
              </button>
            </div>

            <div className="relative">
              <select
                value={getCurrentModelId()}
                onChange={handleModelSelection}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 focus:border-[#4C8BF5] transition-all duration-200 text-[var(--text)] appearance-none pr-10 hover:border-[#4C8BF5]/50 responsive-select"
              >
                {grouped[openRouterCategory]?.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}{model.description ? ` - ${model.description}` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Show model details when selected */}
            {!showCustomModelField && getCurrentModelId() && grouped[openRouterCategory]?.find(m => m.id === getCurrentModelId())?.description && (
              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                <p>{grouped[openRouterCategory]?.find(m => m.id === getCurrentModelId())?.description}</p>
              </div>
            )}
          </>
        )}

        {/* Custom model ID input field */}
        {showCustomModelField && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text)]">
                Custom Model ID
              </label>
              <InfoTooltip text="Enter a model ID from OpenRouter" />
            </div>

            {/* Back button to return to model selection */}
            <button
              type="button"
              onClick={() => {
                setShowCustomModelField(false);
                handleCategoryChange(openRouterCategory);
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              Back to model selection
            </button>
          </div>
        )}

        {/* Custom model ID input field */}
        {showCustomModelField && renderCustomModelIdField()}
      </div>
    );
  };

  return (

    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[var(--text)]">
            {isEditing ? 'Edit Model' : 'Add New Model'}
          </h2>

          {/* Premium close button at the end */}
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Your form content goes here */}
        <div className="form-content">
          {/* Add your form fields here */}
        </div>

    
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        {/* Provider selection */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text)]">
                Provider
              </label>
              <InfoTooltip text={TOOLTIP_DESCRIPTIONS.provider} />
            </div>
            {formData.provider && (
              <span className="text-xs px-2 py-1 bg-[var(--background)] text-[var(--text-muted)] rounded-lg border border-[var(--border)]/50 self-start sm:self-auto">
                {formData.provider.charAt(0).toUpperCase() + formData.provider.slice(1)}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 focus:border-[#4C8BF5] transition-all duration-200 text-[var(--text)] appearance-none pr-10 hover:border-[#4C8BF5]/50 responsive-select"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="openrouter">OpenRouter (Multiple Providers)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {formData.provider === 'openrouter' && (
            <div className="mt-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
              <p className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                OpenRouter provides access to models from multiple providers through a single API key.
              </p>
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-blue-700 dark:text-blue-300 hover:underline font-medium"
              >
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Model selection - different UI based on provider */}
        {formData.provider === 'openrouter' ? (
          renderOpenRouterModelSelection()
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--text)]">
                Model
              </label>
              <InfoTooltip text={TOOLTIP_DESCRIPTIONS.model} />
            </div>
            <div className="relative">
              <select
                value={getCurrentModelId()}
                onChange={handleModelSelection}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C8BF5]/20 focus:border-[#4C8BF5] transition-all duration-200 text-[var(--text)] appearance-none pr-10 hover:border-[#4C8BF5]/50 responsive-select"
              >
                {PROVIDER_MODELS[formData.provider as keyof typeof PROVIDER_MODELS].map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* API Key input with test button */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-[var(--text)]">
              API Key
            </label>
            <InfoTooltip text={TOOLTIP_DESCRIPTIONS.apiKey} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <Input
                type="password"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder={getApiKeyPlaceholder()}
                error={errors.apiKey}
                containerClassName="mb-0"
                className="pl-10 w-full responsive-input"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={testApiKey}
              isLoading={isTestingKey}
              disabled={!formData.apiKey.trim() || isTestingKey}
              className="h-[46px] px-4 sm:px-6 font-medium w-full sm:w-auto"
            >
              Test Key
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 gap-1 sm:gap-0">
            {getApiKeyHelp() && (
              <p className="text-xs text-[var(--text-muted)]">{getApiKeyHelp()}</p>
            )}
            {getApiDocUrl() && (
              <a
                href={getApiDocUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Get API key
              </a>
            )}
          </div>

          {/* Additional help for OpenRouter API keys */}
          {formData.provider === 'openrouter' && (
            <div className="mt-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 space-y-2">
              <p>
                <strong>Note:</strong> OpenRouter supports multiple API key formats:
              </p>
              <ul className="list-disc pl-4 mt-1">
                <li>Newer format: <code>sk-or-v1-xxxxxxxxxx</code></li>
                <li>Older format: <code>sk_or_xxxxxxxxxx</code></li>
                <li>Generic API key (24+ characters)</li>
              </ul>
              <p className="mt-1">
                Enter your API key exactly as provided by OpenRouter.
              </p>
            </div>
          )}

          {testResult && (
            <div className={`mt-3 p-3 rounded-xl flex items-start gap-2 text-sm ${testResult.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-100 dark:border-green-800/30' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-100 dark:border-red-800/30'}`}>
              {testResult.success ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="break-words">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Display name input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-[var(--text)]">
              Display Name
            </label>
            <InfoTooltip text={TOOLTIP_DESCRIPTIONS.displayName} />
          </div>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter a name for this model"
            error={errors.name}
            className="responsive-input"
          />
        </div>

        {/* Advanced Settings - Improved Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-[var(--background)] p-4 sm:p-6 rounded-xl border border-[var(--border)]/50">
          <div className="lg:col-span-2 mb-2">
            <h3 className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Advanced Settings
            </h3>
          </div>

          {/* Max tokens input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--text)]">
                Max Tokens
              </label>
              <InfoTooltip text={TOOLTIP_DESCRIPTIONS.maxTokens} />
            </div>
            <Input
              type="number"
              name="maxTokens"
              value={formData.maxTokens?.toString() || "2048"}
              onChange={handleChange}
              placeholder="2048"
              min="1"
              max="100000"
              className="appearance-none w-full responsive-input"
            />
          </div>

          {/* Temperature input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--text)]">
                Temperature
              </label>
              <InfoTooltip text={TOOLTIP_DESCRIPTIONS.temperature} />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="range"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.1"
                className="flex-1 accent-[#4C8BF5] h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
              />
              <span className="text-sm font-medium bg-[var(--card)] border border-[var(--border)] rounded-lg px-2 sm:px-3 py-1 min-w-[40px] text-center text-[var(--text)]">
                {formData.temperature}
              </span>
            </div>
          </div>
        </div>

        {/* Icon URL input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-[var(--text)]">
              Icon URL (Optional)
            </label>
            <InfoTooltip text={TOOLTIP_DESCRIPTIONS.iconUrl} />
          </div>
          <Input
            type="text"
            name="iconUrl"
            value={formData.iconUrl}
            onChange={handleChange}
            placeholder="https://example.com/icon.png"
            className="responsive-input"
          />
        </div>

        {/* Default model checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-5 w-5 rounded-md accent-[#4C8BF5] mr-2 cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-[var(--text)] cursor-pointer">
            Set as default model
          </label>
          <InfoTooltip text={TOOLTIP_DESCRIPTIONS.defaultModel} />
        </div>

        {/* Form buttons - Enhanced Mobile Layout */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="w-full sm:w-auto justify-center py-3 px-6 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isTestingKey}
            className="w-full sm:w-auto justify-center py-3 px-6 font-medium"
            disabled={Object.keys(errors).length > 0}
          >
            {isEditing ? 'Save Changes' : 'Add Model'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModelForm;
