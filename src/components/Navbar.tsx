import React, { useState } from 'react';
import { Search, Plus, Bell, Settings, User, LogOut, ArrowLeft } from 'lucide-react';
import Button from './Button';

interface NavbarProps {
  onCreateTask: () => void;
  onSearch: (query: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
}

export default function Navbar({ 
  onCreateTask, 
  onSearch, 
  onBack, 
  showBackButton = false,
  title = 'TaskFlow'
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={onBack}
              className="p-2"
            />
          )}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Search Bar */}
        {!showBackButton && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onCreateTask}
            icon={Plus}
            variant="primary"
            size="sm"
          >
            New Task
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={Bell}
            className="p-2"
          />

          <Button
            variant="ghost"
            size="sm"
            icon={Settings}
            className="p-2"
          />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
                <hr className="my-1" />
                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}