import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, MapPin, Eye, EyeOff, Info, Shield } from 'lucide-react';
import Button from '../components/Button';
import ScamMap from '../components/ScamMap';
import { ScamEvent, ScamType } from '../types';
import { getAllScamEvents, getScamEventsByLocation, getMockScamEvents } from '../lib/scamEvents';
import { useSearchParams } from 'react-router-dom';

const ScamMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get('destination');
  
  const [scamEvents, setScamEvents] = useState<ScamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('Loading data...');
  const [showHeatMap, setShowHeatMap] = useState(false);
  
  // Filter states
  const [selectedScamTypes, setSelectedScamTypes] = useState<ScamType[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected event for details panel
  const [selectedEvent, setSelectedEvent] = useState<ScamEvent | null>(null);

  // All available scam types
  const allScamTypes: ScamType[] = [
    'Tourist Trap', 'Overcharging', 'Fake Products', 'Pickpocketing', 
    'Taxi Scam', 'Fake Officials', 'Counterfeit Currency', 'Accommodation Scam', 
    'ATM Fraud', 'Distraction Theft', 'Other'
  ];

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load scam events
  useEffect(() => {
    const fetchScamEvents = async () => {
      setLoading(true);
      try {
        let events: ScamEvent[] = [];
        
        // If destination param is provided, filter events by location
        if (destinationParam) {
          events = await getScamEventsByLocation(destinationParam);
          setDataSource(`Showing scam data for "${destinationParam}"`);
        } else {
          // Otherwise get all events
          events = await getAllScamEvents();
          setDataSource('Showing global scam data');
        }
        
        if (events.length === 0) {
          setError("No scam data found for the specified criteria.");
          // Fall back to mock data for demonstration purposes
          const mockEvents = getMockScamEvents(20);
          setScamEvents(mockEvents);
          setDataSource('Showing sample scam data (no real data found)');
        } else {
          setScamEvents(events);
        }
      } catch (err) {
        console.error("Error fetching scam events:", err);
        setError("Failed to load scam data. Using sample data instead.");
        
        // Fall back to mock data for demonstration purposes
        const mockEvents = getMockScamEvents(20);
        setScamEvents(mockEvents);
        setDataSource('Showing sample scam data (error loading real data)');
      } finally {
        setLoading(false);
      }
    };

    fetchScamEvents();
  }, [destinationParam]);

  // Toggle scam type filter
  const toggleScamType = (scamType: ScamType) => {
    setSelectedScamTypes(prev => 
      prev.includes(scamType)
        ? prev.filter(type => type !== scamType)
        : [...prev, scamType]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedScamTypes([]);
    setOnlyVerified(false);
  };

  // Get scam type color (same as in ScamMap component)
  const getScamTypeColor = (scamType: ScamType): string => {
    const colorMap: Record<ScamType, string> = {
      'Tourist Trap': '#EF4444', // red-500
      'Overcharging': '#F59E0B', // yellow-500
      'Fake Products': '#10B981', // green-500
      'Pickpocketing': '#3B82F6', // blue-500
      'Taxi Scam': '#8B5CF6', // purple-500
      'Fake Officials': '#EC4899', // pink-500
      'Counterfeit Currency': '#F97316', // orange-500
      'Accommodation Scam': '#14B8A6', // teal-500
      'ATM Fraud': '#6366F1', // indigo-500
      'Distraction Theft': '#A855F7', // violet-500
      'Other': '#6B7280', // gray-500
    };
    return colorMap[scamType];
  };

  // Get stats for the scam events
  const getScamStats = () => {
    if (scamEvents.length === 0) return null;
    
    const countries = new Set<string>();
    const cities = new Set<string>();
    
    scamEvents.forEach(event => {
      const parts = event.location.split(',');
      if (parts.length > 1) {
        const country = parts[parts.length - 1].trim();
        const city = parts[0].trim();
        countries.add(country);
        cities.add(city);
      } else {
        // If there's no comma, just add the whole string as a city
        cities.add(event.location.trim());
      }
    });
    
    const scamTypeCount: Record<string, number> = {};
    scamEvents.forEach(event => {
      const type = event.scam_type || 'Unknown';
      scamTypeCount[type] = (scamTypeCount[type] || 0) + 1;
    });
    
    // Get the most common scam type
    let mostCommonScamType = 'Unknown';
    let highestCount = 0;
    
    Object.entries(scamTypeCount).forEach(([type, count]) => {
      if (count > highestCount) {
        highestCount = count;
        mostCommonScamType = type;
      }
    });
    
    // Calculate percentage of verified reports
    const verifiedCount = scamEvents.filter(event => event.verified).length;
    const verifiedPercentage = Math.round((verifiedCount / scamEvents.length) * 100);
    
    return {
      totalEvents: scamEvents.length,
      countryCount: countries.size,
      cityCount: cities.size,
      mostCommonScamType,
      verifiedPercentage
    };
  };

  const stats = getScamStats();

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            Global Scam Map
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore reported scams and safety issues around the world to stay informed during your travels
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {dataSource}
          </p>
        </div>

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-700 dark:text-yellow-300 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {stats && !loading && scamEvents.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalEvents}</div>
              <div className="text-xs text-blue-800 dark:text-blue-200">Reported Scams</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.countryCount}</div>
              <div className="text-xs text-purple-800 dark:text-purple-200">Countries</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.cityCount}</div>
              <div className="text-xs text-green-800 dark:text-green-200">Cities</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.mostCommonScamType}</div>
              <div className="text-xs text-yellow-800 dark:text-yellow-200">Most Common Scam</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.verifiedPercentage}%</div>
              <div className="text-xs text-red-800 dark:text-red-200">Verified Reports</div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={() => setOnlyVerified(!onlyVerified)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">Verified Reports Only</span>
              </label>
              
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showHeatMap}
                  onChange={() => setShowHeatMap(!showHeatMap)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">Heat Map</span>
              </label>
            </div>
          </div>
          
          {showFilters && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Scam Type</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Reset Filters
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allScamTypes.map(scamType => (
                  <button
                    key={scamType}
                    onClick={() => toggleScamType(scamType)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedScamTypes.includes(scamType)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    } flex items-center`}
                    style={{
                      borderLeft: `3px solid ${getScamTypeColor(scamType)}`
                    }}
                  >
                    {scamType}
                    {selectedScamTypes.includes(scamType) ? (
                      <Eye className="h-3 w-3 ml-1" />
                    ) : (
                      <EyeOff className="h-3 w-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2">
              {loading ? (
                <div className="h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : scamEvents.length === 0 ? (
                <div className="h-[600px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md px-4">
                    No scam data available. Please adjust your filters or try a different location.
                  </p>
                </div>
              ) : (
                <ScamMap 
                  scamEvents={scamEvents}
                  height="600px"
                  showHeatMap={showHeatMap}
                  onMarkerClick={setSelectedEvent}
                  filter={{
                    scamTypes: selectedScamTypes.length > 0 ? selectedScamTypes : undefined,
                    onlyVerified
                  }}
                />
              )}
            </div>
            
            <div className="border-l border-gray-200 dark:border-gray-700 overflow-y-auto" style={{ maxHeight: '600px' }}>
              {selectedEvent ? (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {selectedEvent.title}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Scam Type
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedEvent.scam_type || 'Other'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Location
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedEvent.location}
                          {selectedEvent.latitude && selectedEvent.longitude && (
                            <span className="text-xs text-gray-500">
                              {` (${selectedEvent.latitude.toFixed(4)}, ${selectedEvent.longitude.toFixed(4)})`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {(selectedEvent.start_date || selectedEvent.end_date) && (
                      <div className="flex items-start">
                        <Eye className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            When Observed
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedEvent.start_date && formatDate(selectedEvent.start_date)}
                            {selectedEvent.start_date && selectedEvent.end_date && ' to '}
                            {selectedEvent.end_date && formatDate(selectedEvent.end_date)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.description && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${selectedEvent.verified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedEvent.verified ? 'Verified Report' : 'Unverified Report'}
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Reported: {selectedEvent.created_at ? formatDate(selectedEvent.created_at) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select a scam from the map
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click on any marker to view detailed information about reported scams in that location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            How to Stay Safe While Traveling
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                Before Your Trip
              </h3>
              
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">1</span>
                  <span>Research common scams at your destination</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">2</span>
                  <span>Make digital copies of important documents</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">3</span>
                  <span>Register with your embassy when traveling to high-risk areas</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">4</span>
                  <span>Purchase travel insurance that covers theft</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">5</span>
                  <span>Learn a few basic phrases in the local language</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                During Your Trip
              </h3>
              
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">1</span>
                  <span>Be wary of strangers who approach you with unsolicited offers</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">2</span>
                  <span>Use ATMs inside banks during business hours</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">3</span>
                  <span>Only use official taxis or ride-sharing services</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">4</span>
                  <span>Keep valuables secure and be aware in crowded areas</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs mr-2 mt-0.5">5</span>
                  <span>Ask to see ID if approached by someone claiming to be an official</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={() => window.location.href = '/report-scam'}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report a New Scam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamMapPage;