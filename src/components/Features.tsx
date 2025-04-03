import React from 'react';
import { Map, AlertTriangle, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: <Map className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Interactive Maps',
    description: 'Visualize scam hotspots and safety information on our interactive maps with real-time updates.'
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Scam Alerts',
    description: 'Receive instant notifications about scams and safety concerns in your area or planned destinations.'
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Community Reports',
    description: 'Benefit from our community of travelers sharing their experiences and warning others.'
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Global Coverage',
    description: 'Access safety information for destinations worldwide, from major cities to remote locations.'
  }
];

const Features: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Stay Safe Wherever You Go
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Our comprehensive travel safety platform keeps you informed and protected.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;