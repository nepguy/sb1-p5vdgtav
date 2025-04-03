import React, { useState, useEffect } from 'react';
import { ScamType, SafetyLevel, ScamEvent } from '../types';
import { AlertTriangle, MapPin, Calendar, Shield, Info } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

interface ScamReportFormProps {
  onSubmit: (scamReport: Omit<ScamEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Partial<ScamEvent>;
  isEditing?: boolean;
}

const ScamReportForm: React.FC<ScamReportFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEditing = false 
}) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Omit<ScamEvent, 'id' | 'created_at' | 'updated_at'>>({
    title: initialData.title || '',
    description: initialData.description || '',
    location: initialData.location || '',
    latitude: initialData.latitude,
    longitude: initialData.longitude,
    start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
    end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
    is_scam_related: true,
    scam_type: initialData.scam_type || 'Other',
    safety_level: initialData.safety_level || 'Medium',
    external_id: initialData.external_id || '',
    external_url: initialData.external_url || '',
    source: 'user_reported',
    user_id: user?.id || '',
    verified: initialData.verified || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update form if initial data changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
        is_scam_related: true,
        user_id: user?.id || '',
      }));
    }
  }, [initialData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous errors when user makes changes
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.title) {
      setError("Please provide a title for the report");
      setIsSubmitting(false);
      return;
    }

    if (!formData.location) {
      setError("Please specify a location");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        user_id: user?.id || '',
      });
      
      // Reset form on successful submission (only if not editing)
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          location: '',
          latitude: undefined,
          longitude: undefined,
          start_date: '',
          end_date: '',
          is_scam_related: true,
          scam_type: 'Other',
          safety_level: 'Medium',
          external_id: '',
          external_url: '',
          source: 'user_reported',
          user_id: user?.id || '',
          verified: false,
        });
      }
      
      setSuccess(isEditing ? "Report updated successfully!" : "Thank you for submitting your report!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while submitting the report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-green-700 dark:text-green-300">
          <div className="flex items-start">
            <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Report Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., Pickpocketing at Central Market"
        />
      </div>

      <div>
        <label htmlFor="scam_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type of Scam/Issue <span className="text-red-500">*</span>
        </label>
        <select
          id="scam_type"
          name="scam_type"
          value={formData.scam_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="Tourist Trap">Tourist Trap</option>
          <option value="Overcharging">Overcharging</option>
          <option value="Fake Products">Fake Products</option>
          <option value="Pickpocketing">Pickpocketing</option>
          <option value="Taxi Scam">Taxi Scam</option>
          <option value="Fake Officials">Fake Officials</option>
          <option value="Counterfeit Currency">Counterfeit Currency</option>
          <option value="Accommodation Scam">Accommodation Scam</option>
          <option value="ATM Fraud">ATM Fraud</option>
          <option value="Distraction Theft">Distraction Theft</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Please describe what happened, how the scam works, or any useful details for other travelers..."
        ></textarea>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-400 absolute ml-3" />
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Paris, France or Eiffel Tower, Paris"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Latitude (Optional)
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            step="any"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 48.8584"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Longitude (Optional)
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            step="any"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 2.2945"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date (Optional)
          </label>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 absolute ml-3" />
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            When did you encounter this issue or when did it start?
          </p>
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date (Optional)
          </label>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 absolute ml-3" />
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            If it's an ongoing issue, when does it end?
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="safety_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Safety Level
        </label>
        <select
          id="safety_level"
          name="safety_level"
          value={formData.safety_level}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="Very Low">Very Low - Dangerous</option>
          <option value="Low">Low - Exercise High Caution</option>
          <option value="Medium">Medium - Exercise Normal Caution</option>
          <option value="High">High - Generally Safe</option>
          <option value="Very High">Very High - Extremely Safe</option>
        </select>
      </div>

      <div className="flex items-center pt-2">
        <Info className="h-5 w-5 text-gray-500 mr-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your report will help other travelers stay safe. Thank you for contributing to our community!
        </p>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Submitting...') 
            : (isEditing ? 'Update Report' : 'Submit Report')}
        </Button>
      </div>
    </form>
  );
};

export default ScamReportForm;