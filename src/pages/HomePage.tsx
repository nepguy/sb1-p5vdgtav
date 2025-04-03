import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Hero />
      <Features />
      
      {/* Welcome message for logged in users */}
      {user && !loading && (
        <div className="bg-blue-50 dark:bg-blue-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You can now access all features of TravelSafe. Plan trips, explore safe destinations, and get personalized travel recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;