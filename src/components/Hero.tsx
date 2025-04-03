import React from 'react';
import { MapPin, Shield, Bell } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Travel with <span className="text-blue-600 dark:text-blue-400">confidence</span>, 
              stay <span className="text-blue-600 dark:text-blue-400">informed</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Real-time scam alerts and safety information for travelers worldwide.
              Stay one step ahead of potential risks.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/plan-trip">
                <Button size="lg">Plan Your Trip</Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg">Learn More</Button>
              </Link>
            </div>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Location-based alerts</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Verified reports</span>
              </div>
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Instant notifications</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80" 
              alt="Travel destinations" 
              className="rounded-lg shadow-xl object-cover h-[500px] w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Safe zone detected</span>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Updated 5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;