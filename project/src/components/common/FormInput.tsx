import React, { useState, useEffect } from 'react';
import { ValidationRule, validateField } from '../../utils/validation';
import { AlertCircle } from 'lucide-react';

type FormInputProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  autoComplete?: string;
  min?: number;
  max?: number;
  validationRules?: ValidationRule[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  errorMessage?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  className = '',
  required = false,
  disabled = false,
  rows = 4,
  autoComplete,
  min,
  max,
  validationRules = [],
  validateOnChange = false,
  validateOnBlur = true,
  errorMessage,
}) => {
  const [error, setError] = useState<string | null>(errorMessage || null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // Update error from prop if provided
    if (errorMessage !== undefined) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  const validate = (currentValue: string) => {
    if (validationRules.length > 0) {
      const result = validateField(currentValue, validationRules);
      setError(result.isValid ? null : result.errors[0]);
      return result.isValid;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
    if (validateOnChange && touched) {
      validate(e.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(true);
    if (validateOnBlur) {
      validate(e.target.value);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  const inputProps = {
    id,
    name: id,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder,
    disabled,
    required,
    autoComplete,
    className: `w-full px-3 py-2 border ${
      error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    } rounded-lg focus:outline-none focus:ring-2 transition-colors ${className}`,
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea 
          {...inputProps} 
          rows={rows}
        />
      ) : (
        <input 
          {...inputProps} 
          type={type}
          min={min}
          max={max}
        />
      )}
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;