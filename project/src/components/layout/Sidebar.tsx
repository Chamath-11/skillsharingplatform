import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, User, BookOpen, Users, Bell, PlusCircle, Settings, Lightbulb, Book
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: `/profile/${user.id}`, label: 'Profile', icon: <User className="h-5 w-5" /> },
    { path: '/learning-plans', label: 'Learning Plans', icon: <BookOpen className="h-5 w-5" /> },
    { path: '/resources', label: 'Resource Library', icon: <Book className="h-5 w-5" /> },
    { path: '/people', label: 'Find People', icon: <Users className="h-5 w-5" /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16 z-0">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="space-y-2 font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-4">
          <Link
            to="/create-post"
            className="flex items-center p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="ml-3">Create Post</span>
          </Link>
          
          <Link
            to="/create-plan"
            className="flex items-center p-3 mt-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="ml-3">New Learning Plan</span>
          </Link>
        </div>
        
        <div className="absolute bottom-8 left-3 right-3">
          <Link
            to="/settings"
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span className="ml-3">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;