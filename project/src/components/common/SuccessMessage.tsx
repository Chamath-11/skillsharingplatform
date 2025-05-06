import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string | null;
  onDismiss?: () => void;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onDismiss,
  className = ''
}) => {
  if (!message) return null;
  
  return (
    <div className={`p-3 bg-green-50 border border-green-200 rounded-lg flex items-center ${onDismiss ? 'justify-between' : ''} text-green-600 ${className}`}>
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-green-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;