import React from 'react';
import { Trip, ScamEvent } from '../types';
import { format, differenceInDays, isBefore, isAfter, isSameDay } from 'date-fns';
import { MapPin, Calendar, AlertTriangle, Clock, Trash, Edit } from 'lucide-react';
import Button from './Button';

interface TripCardProps {
  trip: Trip;
  scamEvents?: ScamEvent[];
  onEdit?: () => void;
  onDelete?: () => void;
  onViewScams?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  scamEvents = [], 
  onEdit, 
  onDelete,
  onViewScams
}) => {
  const arrivalDate = new Date(trip.arrival_date);
  const departureDate = new Date(trip.departure_date);
  const today = new Date();
  
  // Calculate trip status
  const tripStatus = (): { status: string; color: string } => {
    if (isBefore(today, arrivalDate)) {
      const daysToTrip = differenceInDays(arrivalDate, today);
      return {
        status: `Upcoming in ${daysToTrip} ${daysToTrip === 1 ? 'day' : 'days'}`,
        color: 'text-blue-600 dark:text-blue-400'
      };
    } else if (isAfter(today, departureDate)) {
      return {
        status: 'Completed',
        color: 'text-gray-600 dark:text-gray-400'
      };
    } else {
      // Trip is ongoing
      const daysLeft = differenceInDays(departureDate, today);
      if (isSameDay(today, departureDate)) {
        return {
          status: 'Last day of trip',
          color: 'text-orange-600 dark:text-orange-400'
        };
      }
      return {
        status: `Ongoing - ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`,
        color: 'text-green-600 dark:text-green-400'
      };
    }
  };
  
  const { status, color } = tripStatus();
  const tripDuration = differenceInDays(departureDate, arrivalDate) + 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {trip.destination}
          </h3>
          <span className={`text-sm font-medium ${color} ${isBefore(today, arrivalDate) ? 'animate-pulse' : ''}`}>
            {status}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {format(arrivalDate, 'MMM d, yyyy')} - {format(departureDate, 'MMM d, yyyy')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({tripDuration} {tripDuration === 1 ? 'day' : 'days'})
              </span>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {trip.destination}
            </span>
          </div>
          
          {scamEvents.length > 0 && (
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {scamEvents.length} {scamEvents.length === 1 ? 'warning' : 'warnings'} for this destination
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Created {format(new Date(trip.created_at || Date.now()), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between gap-2">
          {onViewScams && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onViewScams}
              className="flex-1"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              View Warnings
            </Button>
          )}
          
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;