import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/common/FormInput';
import { validationRules } from '../utils/validation';
import useFormValidation from '../hooks/useFormValidation';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, register, isLoading: authLoading, error: authError } = useAuth();
  
  // Form validation setup
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useFormValidation<RegisterFormValues>(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    {
      name: [
        validationRules.required('Name is required'),
        validationRules.minLength(2, 'Name must be at least 2 characters long'),
        validationRules.maxLength(50, 'Name must not exceed 50 characters')
      ],
      email: [
        validationRules.required('Email is required'),
        validationRules.email('Please enter a valid email address')
      ],
      password: [
        validationRules.required('Password is required'),
        validationRules.minLength(6, 'Password must be at least 6 characters long'),
        validationRules.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
      ],
      confirmPassword: [
        validationRules.required('Please confirm your password'),
        (value) => ({
          test: () => value === values.password,
          message: 'Passwords do not match'
        })
      ]
    }
  );

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleRegistration = async (formValues: RegisterFormValues) => {
    try {
      await register({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
      });
      // No need to redirect here as the useEffect will handle it when currentUser changes
    } catch (error) {
      console.error('Registration failed:', error);
      // Auth error is handled by the auth context
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        <div className="relative">
          <button
            onClick={() => navigate('/login')}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/70 text-gray-700 hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-blue-100">Join our community of learners and share your knowledge</p>
          </div>
        </div>
        
        <div className="p-6">
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">{authError.message}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
            <FormInput
              id="name"
              label="Full Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              required
              errorMessage={touched.name ? errors.name : undefined}
              validationRules={[
                validationRules.required('Name is required'),
                validationRules.minLength(2, 'Name must be at least 2 characters long')
              ]}
            />
            
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              required
              errorMessage={touched.email ? errors.email : undefined}
              validationRules={[
                validationRules.required('Email is required'),
                validationRules.email('Please enter a valid email address')
              ]}
            />
            
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={(e) => {
                handleChange(e);
                // If confirm password is already filled, revalidate it when password changes
                if (values.confirmPassword) {
                  setFieldValue('confirmPassword', values.confirmPassword);
                }
              }}
              onBlur={handleBlur}
              placeholder="Create a password"
              required
              errorMessage={touched.password ? errors.password : undefined}
              validationRules={[
                validationRules.required('Password is required'),
                validationRules.minLength(6, 'Password must be at least 6 characters long')
              ]}
            />

            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              required
              errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
              validationRules={[
                validationRules.required('Please confirm your password'),
                {
                  test: (value) => value === values.password,
                  message: 'Passwords do not match'
                }
              ]}
            />
            
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting || authLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;