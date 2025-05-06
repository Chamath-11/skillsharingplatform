import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss,
  className = ''
}) => {
  if (!message) return null;
  
  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-lg flex items-center ${onDismiss ? 'justify-between' : ''} text-red-600 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;