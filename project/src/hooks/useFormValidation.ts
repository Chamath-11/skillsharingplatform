import { useState, useCallback, ChangeEvent } from 'react';
import { ValidationRule, validateForm, isFormValid } from '../utils/validation';

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: ValidationSchema<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the entire form
  const validateAll = useCallback(() => {
    const validationResults = validateForm(values, validationSchema as any);
    
    const newErrors: ValidationErrors<T> = {};
    for (const [field, result] of Object.entries(validationResults)) {
      if (!result.isValid) {
        newErrors[field as keyof T] = result.errors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T) => {
      if (!validationSchema[name]) return true;
      
      const fieldValue = values[name]?.toString() || '';
      const result = validateForm({ [name]: fieldValue }, { [name]: validationSchema[name] } as any);
      const fieldResult = result[name as string];
      
      setErrors(prev => ({
        ...prev,
        [name]: fieldResult.isValid ? undefined : fieldResult.errors[0],
      }));
      
      return fieldResult.isValid;
    },
    [values, validationSchema]
  );

  // Handle input changes
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
      
      // Clear error when typing
      if (errors[name as keyof T]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when setting field value
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Handle blur events for validation
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));
      validateField(name as keyof T);
    },
    [validateField]
  );

  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as { [K in keyof T]: boolean });
      
      setTouched(allTouched);
      
      const isValid = validateAll();
      if (isValid) {
        onSubmit(values);
      }
      
      setIsSubmitting(false);
    },
    [values, validateAll]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    validateField,
    validateForm: validateAll,
    handleSubmit,
  };
}

export default useFormValidation;