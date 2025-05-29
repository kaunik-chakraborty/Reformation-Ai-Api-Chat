import React from 'react';
import { AIModel } from '@/types';
import Button from '../UI/Button';
import { getInitials } from '@/utils/helpers';

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  onSelect: (model: AIModel) => void;
  onEdit: (model: AIModel) => void;
  onDelete: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`transition-all duration-200 bg-[var(--card)] border ${isSelected ? 'border-[#4C8BF5] bg-blue-50 dark:bg-blue-900/10' : 'border-[var(--border)]'} shadow-sm rounded-[var(--global-radius)] p-5 flex flex-col items-center hover:shadow-md relative`}
    >
      {/* Premium blue dot indicator for selected card */}
      {isSelected && (
        <span className="absolute top-3 right-3 h-3 w-3 rounded-[var(--global-radius)] bg-[#4C8BF5] shadow-lg border-2 border-white dark:border-[var(--card)]" title="Selected" />
      )}
      <div className="flex flex-col items-center w-full">
        <div className="flex-shrink-0 mb-3">
          {model.iconUrl ? (
            <img
              src={model.iconUrl}
              alt={model.name}
              className="h-14 w-14 rounded-[var(--global-radius)] object-contain shadow-md bg-[var(--background)]"
            />
          ) : (
            <div className="h-14 w-14 rounded-[var(--global-radius)] bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">{getInitials(model.name)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center gap-2 w-full justify-center">
            <h3 className="text-xl font-semibold truncate text-[var(--text)] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.5px' }}>{model.name}</h3>
            {model.isDefault && (
              <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-[var(--global-radius)]">Default</span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1 mb-4 font-medium tracking-wide uppercase">{model.provider}</p>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 w-full">
        <Button
          variant={isSelected ? "secondary" : "primary"}
          size="sm"
          className={`font-semibold flex items-center justify-center gap-2 rounded-[var(--global-radius)] shadow-sm transition-all duration-150 ${isSelected ? 'ring-1 ring-[#4C8BF5]' : ''}`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          onClick={() => onSelect(model)}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-medium flex items-center justify-center gap-2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          onClick={() => onEdit(model)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-medium flex items-center justify-center gap-2 hover:text-red-600"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          onClick={() => onDelete(model.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ModelCard;