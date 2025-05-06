import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, ArrowLeft, AlertCircle, X } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import FormInput from '../components/common/FormInput';
import { validationRules } from '../utils/validation';
import useFormValidation from '../hooks/useFormValidation';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoading: authLoading, user, error: authError } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [successMessage, setSuccessMessage] = React.useState<string | null>(location.state?.message || null);
  
  // Form validation setup
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation<LoginFormValues>(
    {
      email: '',
      password: ''
    },
    {
      email: [
        validationRules.required('Email is required'),
        validationRules.email('Please enter a valid email address')
      ],
      password: [
        validationRules.required('Password is required')
      ]
    }
  );

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  // Add function to clear success message
  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const handleLogin = async (formValues: LoginFormValues) => {
    try {
      await login(formValues);
      // No need to redirect here as the useEffect will handle it when user changes
    } catch (err) {
      console.error('Login failed:', err);
      // Auth error is handled by the auth context
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        <div className="relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/70 text-gray-700 hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-blue-100">Sign in to continue your learning journey</p>
          </div>
        </div>
        
        <div className="p-6">
          {(authError?.message) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">{authError?.message}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-green-600">
              <span className="text-sm">{successMessage}</span>
              <button 
                onClick={clearSuccessMessage} 
                className="p-1 rounded-full hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email and password to continue
            </p>
          </div>
          
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              required
              autoComplete="email"
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
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              errorMessage={touched.password ? errors.password : undefined}
              validationRules={[
                validationRules.required('Password is required')
              ]}
            />
            
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting || authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
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

export default LoginPage;