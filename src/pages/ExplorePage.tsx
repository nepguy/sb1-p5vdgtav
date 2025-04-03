import React, { useState, useEffect } from 'react';
import { Search, Navigation, Calendar, AlertCircle } from 'lucide-react';
import SafetyMap from '../components/Map';
import EventCard from '../components/EventCard';
import { getMockEvents, EventbriteEvent } from '../lib/eventbrite';
import Button from '../components/Button';

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'destinations' | 'events'>('destinations');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Sample destination data with coordinates
  const destinations = [
    {
      id: '1',
      title: 'London, UK',
      safety: 'High',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      alerts: 2,
      position: [51.505, -0.09] as [number, number]
    },
    {
      id: '2',
      title: 'Barcelona, Spain',
      safety: 'Medium',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
      alerts: 7,
      position: [41.3851, 2.1734] as [number, number]
    },
    {
      id: '3',
      title: 'Tokyo, Japan',
      safety: 'Very High',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      alerts: 0,
      position: [35.6762, 139.6503] as [number, number]
    },
    {
      id: '4',
      title: 'New York, USA',
      safety: 'Medium',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      alerts: 5,
      position: [40.7128, -74.0060] as [number, number]
    },
    {
      id: '5',
      title: 'Sydney, Australia',
      safety: 'High',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
      alerts: 1,
      position: [-33.8688, 151.2093] as [number, number]
    }
  ];

  // Convert destinations to map locations format
  const mapLocations = destinations.map(dest => ({
    id: dest.id,
    title: dest.title,
    safetyLevel: dest.safety as 'Low' | 'Medium' | 'High' | 'Very High',
    position: dest.position,
    alertCount: dest.alerts
  }));

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest => 
    searchQuery === '' || dest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter map locations based on search query
  const filteredMapLocations = mapLocations.filter(loc => 
    searchQuery === '' || loc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to fetch events for a destination
  const fetchEventsForDestination = async (destination: string) => {
    setIsLoadingEvents(true);
    try {
      // In a real implementation, this would call the Eventbrite API with the actual API key
      // Using the mock implementation for now
      const eventsData = getMockEvents(destination, 6);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Handle destination selection for events
  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
    setActiveTab('events');
    fetchEventsForDestination(destination);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchQuery) {
      // If the search query matches a destination, select it
      const matchedDestination = destinations.find(dest => 
        dest.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchedDestination) {
        handleDestinationSelect(matchedDestination.title);
      } else {
        // If no match, just fetch events for the search query
        setSelectedDestination(searchQuery);
        setActiveTab('events');
        fetchEventsForDestination(searchQuery);
      }
    }
  };

  // Load events for the selected destination when component mounts
  useEffect(() => {
    if (selectedDestination) {
      fetchEventsForDestination(selectedDestination);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Explore Safe Destinations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse our interactive map to find safe travel destinations and receive real-time safety alerts.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <Button
                onClick={handleSearchSubmit}
              >
                Find Destinations
              </Button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 ${
                activeTab === 'destinations'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('destinations')}
            >
              <div className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                Safe Destinations
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => {
                setActiveTab('events');
                if (selectedDestination) {
                  fetchEventsForDestination(selectedDestination);
                } else if (filteredDestinations.length > 0) {
                  setSelectedDestination(filteredDestinations[0].title);
                  fetchEventsForDestination(filteredDestinations[0].title);
                }
              }}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Local Events
              </div>
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'destinations' ? (
            <>
              {/* Interactive Map */}
              <SafetyMap 
                locations={filteredMapLocations}
                center={[20, 0]} // Centered to show most of the world
                zoom={2}
                height="500px"
              />

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                <p>Map shows safe travel destinations with color-coded safety levels. Click on markers for more details.</p>
              </div>
            </>
          ) : (
            <>
              {/* Events Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Events in {selectedDestination || 'Selected Destination'}
                  </h2>
                  
                  {/* Destination selector dropdown */}
                  <div className="relative">
                    <select
                      value={selectedDestination || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedDestination(e.target.value);
                          fetchEventsForDestination(e.target.value);
                        }
                      }}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="" disabled>Select a destination</option>
                      {destinations.map(dest => (
                        <option key={dest.id} value={dest.title}>{dest.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isLoadingEvents ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <p>No events found for this destination.</p>
                    <p className="text-sm mt-2">Try selecting a different destination or checking back later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={() => window.open(event.url, '_blank')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div 
              key={destination.id} 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:transform hover:scale-[1.02] cursor-pointer"
              onClick={() => handleDestinationSelect(destination.title)}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  src={destination.image} 
                  alt={destination.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${
                  destination.safety === 'High' || destination.safety === 'Very High' 
                    ? 'bg-green-500' 
                    : destination.safety === 'Medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`}>
                  {destination.safety} Safety
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{destination.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {destination.alerts} active alerts
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDestinationSelect(destination.title);
                      }}
                    >
                      View Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;