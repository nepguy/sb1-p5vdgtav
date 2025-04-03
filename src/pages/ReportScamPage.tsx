import React, { useState } from 'react';
import { AlertTriangle, Shield, Info, UserCheck } from 'lucide-react';
import ScamReportForm from '../components/ScamReportForm';
import { ScamEvent } from '../types';
import { addScamEvent } from '../lib/scamEvents';
import { useAuth } from '../context/AuthContext';

const ReportScamPage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (scamReport: Omit<ScamEvent, 'id' | 'created_at' | 'updated_at'>) => {
    // Add the user ID to the report
    const report = { ...scamReport, user_id: user?.id };
    
    const { error } = await addScamEvent(report);
    
    if (error) {
      throw new Error('Failed to submit report. Please try again.');
    }
    
    setIsSubmitted(true);
    
    // Reset the submission status after a delay
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            Report a Scam or Safety Issue
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help protect other travelers by sharing your experience
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Why Report Scams?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your reports help build a safer travel community. When you share your experience, you're potentially saving someone else from falling victim to the same scam.
              </p>
            </div>
          </div>

          <div className="flex items-start mb-8">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                What to Include
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Detailed description of what happened</li>
                <li>Specific location where it occurred</li>
                <li>Date and time if possible</li>
                <li>How the scam works and what to watch for</li>
                <li>Any evidence or photos if available</li>
              </ul>
            </div>
          </div>

          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-8">
            <div className="flex">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                  You're signed in as {user?.email?.split('@')[0]}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your report will be associated with your account but your personal information will remain private.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Report Form
            </h2>
            
            <ScamReportForm onSubmit={handleSubmit} />
            
            {isSubmitted && (
              <div className="mt-6 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-green-700 dark:text-green-300">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <p className="font-medium">Your report has been submitted successfully! Thank you for contributing to traveler safety.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          <p>
            All reports are reviewed by our team. Verified reports are shared with the community to help everyone stay safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportScamPage;