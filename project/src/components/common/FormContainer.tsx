import React from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  error?: string | null;
  success?: string | null;
  onErrorDismiss?: () => void;
  onSuccessDismiss?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  error,
  success,
  onErrorDismiss,
  onSuccessDismiss,
  onSubmit,
  isSubmitting = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {title && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      {error && (
        <div className="mb-4">
          <ErrorMessage 
            message={error} 
            onDismiss={onErrorDismiss} 
          />
        </div>
      )}

      {success && (
        <div className="mb-4">
          <SuccessMessage 
            message={success} 
            onDismiss={onSuccessDismiss} 
          />
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </div>
  );
};

export default FormContainer;