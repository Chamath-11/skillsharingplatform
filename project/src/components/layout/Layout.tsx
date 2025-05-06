import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Apply transitions when component mounts
  useEffect(() => {
    // Add transition class to body for smoother theme changes
    document.body.classList.add('transition-colors', 'duration-300');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('transition-colors', 'duration-300');
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="flex">
        {currentUser && <Sidebar />}
        <main className={`flex-1 p-4 ${currentUser ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;