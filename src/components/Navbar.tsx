import React from 'react';
import { Compass, LogOut, User, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Compass className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">TravelSafe</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/plan-trip">
                    <Button 
                      variant="primary" 
                      className={location.pathname === "/plan-trip" ? "opacity-75" : ""}
                    >
                      Plan Trip
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button 
                      variant="primary" 
                      className={location.pathname === "/explore" ? "opacity-75" : ""}
                    >
                      Explore
                    </Button>
                  </Link>
                  <Link to="/report-scam">
                    <Button 
                      variant="secondary" 
                      className={location.pathname === "/report-scam" ? "opacity-75" : ""}
                    >
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      Report Scam
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button 
                      variant="secondary" 
                      className={location.pathname === "/dashboard" ? "opacity-75" : ""}
                    >
                      <LayoutDashboard className="mr-1 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center ml-4 gap-4">
                  <div className="text-gray-600 dark:text-gray-300 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate max-w-[100px]">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/signin">
                <Button 
                  variant="signin" 
                  className={location.pathname === "/signin" ? "opacity-75" : ""}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu for authenticated users */}
      {user && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-1 p-2">
            <Link 
              to="/plan-trip" 
              className={`flex flex-col items-center p-2 text-xs rounded-md ${
                location.pathname === "/plan-trip" 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Compass className="h-5 w-5 mb-1" />
              <span>Plan</span>
            </Link>
            <Link 
              to="/explore" 
              className={`flex flex-col items-center p-2 text-xs rounded-md ${
                location.pathname === "/explore" 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              <span>Explore</span>
            </Link>
            <Link 
              to="/report-scam" 
              className={`flex flex-col items-center p-2 text-xs rounded-md ${
                location.pathname === "/report-scam" 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span>Report</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center p-2 text-xs rounded-md ${
                location.pathname === "/dashboard" 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mb-1" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;