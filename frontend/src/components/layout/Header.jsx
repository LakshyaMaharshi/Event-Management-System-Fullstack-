import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { ChevronDown, User, LogOut, Plus, Bell, Menu, X } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateEvent = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');

      window.dispatchEvent(new CustomEvent('openEventForm'));
    }
  };

  const handleNotifications = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openNotifications'));
      }, 200);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-neutral-900 font-extrabold">
            EF
          </span>
          <span className="font-semibold tracking-wide text-white">EventFlow</span>
          <span className="sr-only">Home</span>
        </Link>

        {isAuthenticated ? (
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            {user?.role !== 'admin' && (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Button
                onClick={handleCreateEvent}
                variant="ghost"
                className="text-emerald-300 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
              <button
              onClick={handleNotifications}
              className="flex items-center gap-2 hover:text-emerald-400 bg-transparent border-0 text-neutral-300 cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
              </div>
            )}
          </nav>
        ) : (
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <button
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="hover:text-emerald-400 bg-transparent border-0 cursor-pointer transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('why');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="hover:text-emerald-400 bg-transparent border-0 cursor-pointer transition-colors"
            >
              Why EventFlow
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('testimonials');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="hover:text-emerald-400 bg-transparent border-0 cursor-pointer transition-colors"
            >
              Testimonials
            </button>
            <Link
              to="/contact-us"
              className="hover:text-emerald-400 transition-colors"
            >
              Contact
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button
                asChild
                variant="outline"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent hidden sm:flex"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900 hidden sm:flex"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
              
              {}
              <Button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                variant="ghost"
                className="md:hidden text-neutral-300 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setShowDropdown(!showDropdown)}
                variant="ghost"
                className="flex items-center gap-2 text-neutral-300 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-neutral-900 font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block">{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-neutral-700 bg-neutral-800 py-2 shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-emerald-400"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-emerald-400"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <hr className="my-2 border-neutral-700" />
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {}
      {showMobileMenu && !isAuthenticated && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-3">
              <button
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-neutral-300 hover:text-emerald-400 py-2 bg-transparent border-0 cursor-pointer transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('why');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-neutral-300 hover:text-emerald-400 py-2 bg-transparent border-0 cursor-pointer transition-colors"
              >
                Why EventFlow
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('testimonials');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-neutral-300 hover:text-emerald-400 py-2 bg-transparent border-0 cursor-pointer transition-colors"
              >
                Testimonials
              </button>
              <Link
                to="/contact-us"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full text-left text-neutral-300 hover:text-emerald-400 py-2 transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <Button
                asChild
                variant="outline"
                className="w-full border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent"
              >
                <Link to="/login" onClick={() => setShowMobileMenu(false)}>Login</Link>
              </Button>
              <Button
                asChild
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-900"
              >
                <Link to="/register" onClick={() => setShowMobileMenu(false)}>Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
