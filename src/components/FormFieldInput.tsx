import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormFieldInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export default function FormFieldInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  options = [],
  icon: Icon,
  error,
  required = false,
  disabled = false,
  rows = 3,
}: FormFieldInputProps) {
  const baseInputStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed';
  const errorInputStyles = 'border-red-300 focus:ring-red-500';

  const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={rows}
          className={`${baseInputStyles} ${error ? errorInputStyles : ''} resize-none`}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseInputStyles} ${error ? errorInputStyles : ''}`}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseInputStyles} ${error ? errorInputStyles : ''} ${Icon ? 'pl-10' : ''}`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}