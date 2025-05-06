/**
 * Validation utilities for forms and input fields
 */

export type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message
  }),
  minLength: (min: number, message = `Must be at least ${min} characters`): ValidationRule => ({
    test: (value) => value.length >= min,
    message
  }),
  maxLength: (max: number, message = `Must not exceed ${max} characters`): ValidationRule => ({
    test: (value) => value.length <= max,
    message
  }),
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    test: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),
  match: (matchValue: string, message = 'Values do not match'): ValidationRule => ({
    test: (value) => value === matchValue,
    message
  }),
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    test: (value) => regex.test(value),
    message
  })
};

/**
 * Validates a value against a set of rules
 */
export const validateField = (value: string, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates a form with multiple fields
 */
export const validateForm = (form: Record<string, any>, validationSchema: Record<string, ValidationRule[]>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = form[field]?.toString() || '';
    results[field] = validateField(value, rules);
  }
  
  return results;
};

/**
 * Checks if an entire form is valid based on validation results
 */
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};