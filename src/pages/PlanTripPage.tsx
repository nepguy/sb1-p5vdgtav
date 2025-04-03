import React, { useState } from 'react';
import { Calendar, MapPin, CloudSun, Ticket, Languages, AlertCircle, Bus, Landmark, Utensils, DollarSign, Bell } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type NotificationType = 'weather' | 'events' | 'customs' | 'phrases' | 'safety' | 'transport' | 'attractions' | 'restaurants' | 'exchange';

interface TripFormData {
  destination: string;
  arrivalDate: string;
  departureDate: string;
  notificationPreferences: Record<NotificationType, boolean>;
}

const PlanTripPage: React.FC = () => {
  const { user } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    arrivalDate: '',
    departureDate: '',
    notificationPreferences: {
      weather: true,
      events: true,
      customs: true,
      phrases: true,
      safety: true,
      transport: true,
      attractions: true,
      restaurants: true,
      exchange: true
    }
  });

  const notificationTypes: { type: NotificationType; label: string; icon: React.ReactNode }[] = [
    { type: 'weather', label: 'Weather Forecasts', icon: <CloudSun className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'events', label: 'Local Events & Festivals', icon: <Ticket className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'customs', label: 'Cultural Customs', icon: <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'phrases', label: 'Essential Phrases', icon: <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'safety', label: 'Safety Updates', icon: <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'transport', label: 'Local Transportation', icon: <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'attractions', label: 'Must-visit Attractions', icon: <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'restaurants', label: 'Restaurant Recommendations', icon: <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" /> },
    { type: 'exchange', label: 'Exchange Rates', icon: <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (type: NotificationType) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Save the trip data to Supabase
      const { data, error } = await supabase
        .from('trips')
        .insert([
          { 
            destination: formData.destination,
            arrival_date: formData.arrivalDate,
            departure_date: formData.departureDate,
            notification_preferences: formData.notificationPreferences,
            user_id: user?.id // Include the user ID for the trip
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('Trip saved successfully:', data);
      if (data && data.length > 0) {
        setTripId(data[0].id);
      }
      
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error saving trip:', error);
      setErrorMessage('Failed to save your trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setTripId(null);
    setFormData({
      destination: '',
      arrivalDate: '',
      departureDate: '',
      notificationPreferences: {
        weather: true,
        events: true,
        customs: true,
        phrases: true,
        safety: true,
        transport: true,
        attractions: true,
        restaurants: true,
        exchange: true
      }
    });
  };

  const renderResults = () => {
    const arrivalDate = new Date(formData.arrivalDate);
    const departureDate = new Date(formData.departureDate);
    const tripDuration = Math.round((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trip to {formData.destination}</h2>
          <Button variant="secondary" onClick={resetForm}>Plan Another Trip</Button>
        </div>
        
        {tripId && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
            <p className="text-sm">Trip saved successfully! Trip ID: {tripId}</p>
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trip Details</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Arrival:</span> {formData.arrivalDate}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Departure:</span> {formData.departureDate}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Duration:</span> {tripDuration} days
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              You'll receive updates about:
            </p>
            <div className="flex flex-wrap gap-2">
              {notificationTypes
                .filter(item => formData.notificationPreferences[item.type])
                .map(item => (
                  <span 
                    key={item.type} 
                    className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full"
                  >
                    {item.label}
                  </span>
                ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What to expect
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CloudSun className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Weather</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Weather information will be updated daily during your trip.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Safety Updates</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Real-time safety alerts and travel advisories for {formData.destination}.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Ticket className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Local Events</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Information about festivals and events during your stay.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            To stop receiving notifications at any time, simply reply "STOP" to any update message.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Let us help you stay informed and safe during your travels with personalized updates.
          </p>
        </div>
        
        {!formSubmitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="p-8">
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
                  <p>{errorMessage}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Where will you be traveling to? (City, Country)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      required
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Paris, France"
                      className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Arrival Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="arrivalDate"
                        name="arrivalDate"
                        required
                        value={formData.arrivalDate}
                        onChange={handleInputChange}
                        className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Departure Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="departureDate"
                        name="departureDate"
                        required
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Customize your update preferences
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {notificationTypes.map(item => (
                        <div key={item.type} className="flex items-center">
                          <input
                            id={`pref-${item.type}`}
                            type="checkbox"
                            checked={formData.notificationPreferences[item.type]}
                            onChange={() => handleCheckboxChange(item.type)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          />
                          <div className="flex items-center ml-2">
                            {item.icon}
                            <label htmlFor={`pref-${item.type}`} className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Plan My Trip'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You'll receive daily notifications with updated information about your destination until your departure date.
              </p>
            </div>
          </div>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
};

export default PlanTripPage;