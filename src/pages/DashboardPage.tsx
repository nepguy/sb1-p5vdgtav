import React, { useState, useEffect } from 'react';
import { Table as Tabs, List as TabsList, Compass, AlertTriangle, History, CalendarDays, Loader, LayoutDashboard } from 'lucide-react';
import Button from '../components/Button';
import TripCard from '../components/TripCard';
import { Trip, ScamEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserTrips, getOngoingTrips, getUpcomingTrips, getPastTrips, deleteTrip } from '../lib/trips';
import { getScamEventsForTrip, getUserScamEvents } from '../lib/scamEvents';
import { useNavigate } from 'react-router-dom';

type TabType = 'ongoing' | 'upcoming' | 'past' | 'reports';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [scamReports, setScamReports] = useState<ScamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripScamEvents, setTripScamEvents] = useState<Record<string, ScamEvent[]>>({});
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  // Fetch trips based on active tab
  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let fetchedTrips: Trip[] = [];
        
        switch(activeTab) {
          case 'ongoing':
            fetchedTrips = await getOngoingTrips(user.id);
            break;
          case 'upcoming':
            fetchedTrips = await getUpcomingTrips(user.id);
            break;
          case 'past':
            fetchedTrips = await getPastTrips(user.id);
            break;
          case 'reports':
            // For reports tab, we fetch the user's scam reports
            const reports = await getUserScamEvents(user.id);
            setScamReports(reports);
            break;
          default:
            fetchedTrips = await getUserTrips(user.id);
        }
        
        if (activeTab !== 'reports') {
          setTrips(fetchedTrips);
          
          // Fetch scam events for each trip
          const scamEventsByTrip: Record<string, ScamEvent[]> = {};
          for (const trip of fetchedTrips) {
            try {
              const events = await getScamEventsForTrip(
                trip.destination,
                trip.arrival_date,
                trip.departure_date
              );
              
              // Ensure scam_type is defined for all events
              const validatedEvents = events.map(event => ({
                ...event,
                scam_type: event.scam_type || 'Other' // Provide default value if undefined
              }));
              
              scamEventsByTrip[trip.id] = validatedEvents;
            } catch (err) {
              console.error(`Error fetching scam events for trip to ${trip.destination}:`, err);
              scamEventsByTrip[trip.id] = []; // Set empty array on error
            }
          }
          setTripScamEvents(scamEventsByTrip);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} trips:`, err);
        setError(`Failed to load your ${activeTab} trips. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [activeTab, user?.id]);

  // Handle trip deletion
  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }
    
    setDeletingTripId(tripId);
    
    try {
      const { error } = await deleteTrip(tripId);
      if (error) {
        throw error;
      }
      
      // Remove trip from state
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setDeletingTripId(null);
    }
  };

  // Navigate to plan trip page with edit mode
  const handleEditTrip = (tripId: string) => {
    navigate(`/plan-trip?edit=${tripId}`);
  };

  // Navigate to scam map with destination filter
  const handleViewScams = (destination: string) => {
    navigate(`/scam-map?destination=${encodeURIComponent(destination)}`);
  };

  // Navigate to edit report page
  const handleEditReport = (reportId: string) => {
    navigate(`/report-scam?edit=${reportId}`);
  };

  // Render trip cards
  const renderTrips = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      );
    }
    
    if (trips.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <Compass className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No {activeTab} trips found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {activeTab === 'ongoing' && "You don't have any ongoing trips at the moment."}
            {activeTab === 'upcoming' && "You don't have any upcoming trips planned."}
            {activeTab === 'past' && "You haven't completed any trips yet."}
          </p>
          <Button onClick={() => navigate('/plan-trip')}>
            Plan a New Trip
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            scamEvents={tripScamEvents[trip.id] || []}
            onEdit={() => handleEditTrip(trip.id)}
            onDelete={() => handleDeleteTrip(trip.id)}
            onViewScams={() => handleViewScams(trip.destination)}
          />
        ))}
      </div>
    );
  };

  // Render scam reports
  const renderScamReports = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      );
    }
    
    if (scamReports.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No scam reports found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't reported any scams or safety issues yet.
          </p>
          <Button onClick={() => navigate('/report-scam')}>
            Report a Scam
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {scamReports.map(report => (
          <div 
            key={report.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report.title}
                </h3>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  report.verified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {report.verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>{report.description}</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                  {report.location}
                </div>
                
                {report.scam_type && (
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                    {report.scam_type}
                  </div>
                )}
                
                {report.created_at && (
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 text-gray-500 mr-1" />
                    Reported: {new Date(report.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditReport(report.id)}
                >
                  Edit Report
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            Your Travel Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Manage your trips and stay updated on travel safety information
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 px-6 py-3">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-3 py-2 font-medium text-sm rounded-md flex items-center ${
                  activeTab === 'ongoing'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Compass className="h-5 w-5 mr-2" />
                Ongoing Trips
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-2 font-medium text-sm rounded-md flex items-center ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <CalendarDays className="h-5 w-5 mr-2" />
                Upcoming Trips
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 py-2 font-medium text-sm rounded-md flex items-center ${
                  activeTab === 'past'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <History className="h-5 w-5 mr-2" />
                Past Trips
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 font-medium text-sm rounded-md flex items-center ${
                  activeTab === 'reports'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Your Reports
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === 'ongoing' && 'Ongoing Trips'}
                {activeTab === 'upcoming' && 'Upcoming Trips'}
                {activeTab === 'past' && 'Past Trips'}
                {activeTab === 'reports' && 'Your Scam Reports'}
              </h2>
              
              <div>
                {activeTab !== 'reports' ? (
                  <Button onClick={() => navigate('/plan-trip')}>
                    Plan New Trip
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/report-scam')}>
                    Report New Scam
                  </Button>
                )}
              </div>
            </div>
            
            {activeTab === 'reports' ? renderScamReports() : renderTrips()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              Travel Safety Tips
            </h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-200">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-center leading-5 mr-2 flex-shrink-0">
                  •
                </span>
                <span>Keep digital copies of important documents</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-center leading-5 mr-2 flex-shrink-0">
                  •
                </span>
                <span>Register with your embassy when visiting high-risk areas</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-center leading-5 mr-2 flex-shrink-0">
                  •
                </span>
                <span>Research common scams at your destination before traveling</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-center leading-5 mr-2 flex-shrink-0">
                  •
                </span>
                <span>Use ATMs inside banks during business hours</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
              Community Impact
            </h3>
            <p className="text-green-700 dark:text-green-200 mb-4">
              Your contributions help make travel safer for everyone. By reporting scams and sharing your experiences, you've helped:
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="block text-2xl font-bold text-green-600 dark:text-green-400">50+</span>
                <span className="text-sm text-green-700 dark:text-green-300">Countries Covered</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="block text-2xl font-bold text-green-600 dark:text-green-400">1,000+</span>
                <span className="text-sm text-green-700 dark:text-green-300">Scams Reported</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="block text-2xl font-bold text-green-600 dark:text-green-400">10,000+</span>
                <span className="text-sm text-green-700 dark:text-green-300">Travelers Protected</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="block text-2xl font-bold text-green-600 dark:text-green-400">$2M+</span>
                <span className="text-sm text-green-700 dark:text-green-300">Saved from Scams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;