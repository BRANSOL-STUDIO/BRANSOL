"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, LogOut, Search, Menu, X, User, CreditCard, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardNavProps {
  userName: string;
  notifications?: number;
  onTabChange?: (tab: string) => void;
}

export default function DashboardNav({ userName, notifications = 0, onTabChange }: DashboardNavProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, title: 'New message from Sarah', message: 'Logo concepts are ready for review', time: '5m ago', unread: true },
    { id: 2, title: 'Project update', message: 'Brand Guidelines moved to Review', time: '2h ago', unread: true },
    { id: 3, title: 'Invoice available', message: 'Your October invoice is ready', time: '1d ago', unread: false },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      await signOut();
      console.log('✅ Logout successful, redirecting to home...');
      router.push('/');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Search */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/bransol-logo-dark-2025.png"
                alt="BRANSOL"
                width={120}
                height={32}
                className="h-7 w-auto"
              />
              <span className="hidden sm:block text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-bold">
                Client Portal
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-80">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, files..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
              <kbd className="hidden lg:block px-2 py-1 text-xs bg-white rounded border border-gray-300 text-gray-500">⌘K</kbd>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-600">{notifications} unread notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notif.unread ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{notif.title}</h4>
                            <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                            <p className="text-xs text-gray-400">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full text-sm text-purple-600 hover:text-purple-700 font-semibold">
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <h3 className="font-bold text-gray-900">Settings</h3>
                    <p className="text-xs text-gray-600">Manage your account</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        if (onTabChange) {
                          onTabChange('profile');
                        } else {
                          router.push('/dashboard');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        if (onTabChange) {
                          onTabChange('subscription');
                        } else {
                          router.push('/dashboard/subscription');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing Information
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Opening Help');
                        setShowSettings(false);
                        window.open('https://help.bransol.com', '_blank');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help
                    </button>
                    <div className="my-2 border-t border-gray-200"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {userName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Professional Plan</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <p className="font-bold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600">john@example.com</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        console.log('Navigate to Account Settings');
                        setShowUserMenu(false);
                        // In a real app: router.push('/dashboard/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>
                    <Link 
                      href="/"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                      <span className="text-lg">🏠</span>
                      Back to Website
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden border-t border-gray-200 bg-white"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

