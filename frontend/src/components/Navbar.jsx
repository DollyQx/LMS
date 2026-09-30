import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-darkLayer/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">LMS<span className="text-brand">Hub</span></span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4" />
              <span>{user?.name || 'Student'}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
