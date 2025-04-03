import React from 'react';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { EventbriteEvent } from '../lib/eventbrite';

interface EventCardProps {
  event: EventbriteEvent;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get venue name and location
  const venueName = event.venue?.name || 'TBA';
  const venueLocation = event.venue?.address?.city || 'Location TBA';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
        {event.logo?.url ? (
          <img 
            src={event.logo.url} 
            alt={event.name.text} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
            <Calendar className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          </div>
        )}
        
        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-white mr-1" />
            <span className="text-xs text-white font-medium">
              {event.is_free ? 'Free Event' : 'Paid Event'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {event.name.text}
        </h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(event.start.utc)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(event.start.utc)} - {formatTime(event.end.utc)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {venueName}, {venueLocation}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <a 
            href={event.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View on Eventbrite
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;