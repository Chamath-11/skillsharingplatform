import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
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