import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  Search, Bell, PlusCircle, Menu, X, LogOut, Lightbulb, User
} from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-semibold text-gray-900">SkillShare</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for skills, users, or topics..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link 
                  to="/create-post" 
                  className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <PlusCircle className="h-6 w-6" />
                </Link>
                <Link 
                  to="/notifications" 
                  className="p-2 text-gray-600 hover:text-blue-500 transition-colors relative"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button 
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img 
                      src={currentUser.profileImage} 
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <Link 
                        to={`/profile/${currentUser.id}`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link 
                        to="/learning-plans" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span>Learning Plans</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {currentUser ? (
              <div className="space-y-2">
                <Link 
                  to={`/profile/${currentUser.id}`}
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link 
                  to="/create-post"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu}
                >
                  Create Post
                </Link>
                <Link 
                  to="/learning-plans"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu}
                >
                  Learning Plans
                </Link>
                <Link 
                  to="/notifications"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link 
                  to="/login"
                  className="block py-2 px-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;