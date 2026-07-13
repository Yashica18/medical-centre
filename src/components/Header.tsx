import React, { useState } from 'react';
import { Menu, X, Stethoscope, Phone, Clock, User, LogOut, LogIn, Sun, Moon } from 'lucide-react';
import { ActiveTab } from '../types';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  onSignOut: () => void;
  onSignInClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Header({ activeTab, setActiveTab, user, onSignOut, onSignInClick, theme, toggleTheme }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home' },
    { id: 'about' as ActiveTab, label: 'About Us' },
    { id: 'departments' as ActiveTab, label: 'Departments' },
    { id: 'doctors' as ActiveTab, label: 'Our Doctors' },
    { id: 'tracker' as ActiveTab, label: 'Track Booking' },
  ];

  if (user && user.email === 'yashicajindal1806@gmail.com') {
    navItems.push({ id: 'admin' as ActiveTab, label: '🛡️ Admin Portal' });
  }

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors duration-300">
      {/* Top emergency & info bar */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-900 text-teal-50/90 text-xs py-2 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1.5 justify-center">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Emergency Helpline: <span className="font-semibold text-white">+91 80 4912 8000</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              OPD Hours: Mon - Sat: 8:00 AM - 8:00 PM
            </span>
          </div>
          <div className="text-teal-200 text-[11px] font-medium tracking-wide">
            🏆 NABH Accredited Multi-Speciality Hospital
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group focus:outline-none text-left cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white block leading-tight transition-colors duration-300">
                Sanjeevani
              </span>
              <span className="text-xs font-medium text-brand-600 dark:text-teal-400 uppercase tracking-widest block -mt-0.5 transition-colors duration-300">
                Medical Centre
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-medium text-sm transition-colors relative py-2 focus:outline-none cursor-pointer ${
                  activeTab === item.id 
                    ? 'text-brand-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-teal-400'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 dark:bg-teal-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Call to Action & Auth Widget */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Highly visible and animated Theme Toggle Button */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              className={`relative p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-amber-400 shadow-md shadow-amber-400/20 hover:bg-slate-750'
                  : 'bg-amber-50/60 border-amber-200 text-amber-600 shadow-xs hover:bg-amber-100/50'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.5, rotate: -120 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 200, damping: 15 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 fill-amber-400 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 fill-amber-100 text-amber-600" />
                )}
              </motion.div>
            </motion.button>

            {user ? (
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 pl-3 pr-4 py-1.5 rounded-2xl transition-colors duration-300">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                  alt={user.displayName || 'Patient'} 
                  className="w-8 h-8 rounded-full border border-teal-500/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block">Logged In</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block max-w-[120px] truncate">
                    {user.displayName || 'Patient'}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Patient Login
              </button>
            )}

            <button
              onClick={() => handleNavClick('booking')}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/20'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5'
              }`}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Actions Container (Highly Visible Theme Toggle + Menu Button) */}
          <div className="flex lg:hidden items-center gap-3">
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-amber-50/50 border-amber-200 text-amber-600'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.5, rotate: -120 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 fill-amber-400 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 fill-amber-100 text-amber-600" />
                )}
              </motion.div>
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 animate-fade-in shadow-inner transition-colors duration-300">
          {user && (
            <div className="flex items-center gap-3 bg-teal-50/50 dark:bg-slate-850 border border-teal-100/10 dark:border-slate-700 p-3 rounded-xl mb-3">
              <img 
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                alt={user.displayName || 'Patient'} 
                className="w-10 h-10 rounded-full border border-teal-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="text-left flex-grow">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">Patient Profile</span>
                <span className="text-sm font-bold text-gray-800 dark:text-slate-200 block">
                  {user.displayName || 'Patient'}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400 block truncate">{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-teal-400'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-brand-500 dark:hover:text-teal-400'
                }`}
              >
                {item.label}
              </button>
            ))}

            {!user && (
              <button
                onClick={() => {
                  onSignInClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition-colors mt-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Patient Login
              </button>
            )}

            <div className="border-t border-gray-100 dark:border-slate-800 my-2 pt-3">
              <button
                onClick={() => handleNavClick('booking')}
                className="w-full text-center py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
