import React, { useEffect, useState, ErrorInfo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

/**
 * Error boundary class component to catch rendering errors
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="h-8 w-8 mr-3" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-auto max-h-40 text-sm">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  const [pageError, setPageError] = useState<string | null>(null);
  
  // Apply transitions when component mounts
  useEffect(() => {
    // Add transition class to body for smoother theme changes
    document.body.classList.add('transition-colors', 'duration-300');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('transition-colors', 'duration-300');
    };
  }, []);

  // Global error handler for async errors
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Only show user-friendly errors in production
      if (process.env.NODE_ENV === 'production') {
        setPageError('An unexpected error occurred. Please try again.');
      } else {
        setPageError(`Error: ${event.reason?.message || 'Unknown error'}`);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        
        {/* Global error message */}
        {pageError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mx-4 mt-4 flex items-center shadow-sm">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{pageError}</span>
            <button 
              onClick={() => setPageError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}
        
        <div className="flex">
          {currentUser && <Sidebar />}
          <main className={`flex-1 p-4 ${currentUser ? 'md:ml-64' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;