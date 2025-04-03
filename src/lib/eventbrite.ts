// Eventbrite API service
// Documentation: https://www.eventbrite.com/platform/api

// Define interfaces for Eventbrite data
export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description?: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  venue_id?: string;
  venue?: EventbriteVenue;
  logo?: {
    url: string;
  };
  is_free: boolean;
  category_id?: string;
  subcategory_id?: string;
}

export interface EventbriteVenue {
  id: string;
  name: string;
  address: {
    address_1: string;
    address_2?: string;
    city: string;
    region?: string;
    postal_code: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface EventbriteCategory {
  id: string;
  name: string;
  name_localized: string;
  short_name: string;
  short_name_localized: string;
}

export interface EventbriteResponse<T> {
  pagination: {
    object_count: number;
    page_number: number;
    page_size: number;
    page_count: number;
    has_more_items: boolean;
  };
  events: T[];
}

// API endpoints
const API_BASE_URL = 'https://www.eventbriteapi.com/v3';
const API_KEY = import.meta.env.VITE_EVENTBRITE_API_KEY;

// Helper function to make API requests
const fetchFromEventbrite = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}${endpoint}?${queryParams}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Eventbrite API error: ${errorData.error_description || response.statusText}`);
  }

  return response.json() as Promise<T>;
};

// Get events by location
export const getEventsByLocation = async (
  latitude: number, 
  longitude: number, 
  radius: number = 10, // in miles
  categories?: string[],
  startDate?: Date,
  endDate?: Date,
  limit: number = 10
): Promise<EventbriteEvent[]> => {
  try {
    // Format parameters
    const params: Record<string, string> = {
      'location.latitude': latitude.toString(),
      'location.longitude': longitude.toString(),
      'location.within': `${radius}mi`,
      'expand': 'venue',
      'page_size': limit.toString()
    };

    // Add optional parameters
    if (categories && categories.length > 0) {
      params['categories'] = categories.join(',');
    }

    if (startDate) {
      params['start_date.range_start'] = startDate.toISOString();
    }

    if (endDate) {
      params['start_date.range_end'] = endDate.toISOString();
    }

    // Make the API request
    const response = await fetchFromEventbrite<EventbriteResponse<EventbriteEvent>>('/events/search/', params);
    return response.events;
  } catch (error) {
    console.error('Error fetching events from Eventbrite:', error);
    return [];
  }
};

// Mock function to use when API key is not available or for development/testing
export const getMockEvents = (location: string, limit: number = 5): EventbriteEvent[] => {
  // Generate mock events based on the location
  const events: EventbriteEvent[] = [];
  const cities: Record<string, [number, number]> = {
    'London': [51.505, -0.09],
    'Barcelona': [41.3851, 2.1734],
    'Tokyo': [35.6762, 139.6503],
    'New York': [40.7128, -74.0060],
    'Sydney': [-33.8688, 151.2093],
    // Default coordinates if the city is not found
    'default': [0, 0]
  };

  // Get coordinates for the location or use default
  const coordinates = Object.keys(cities).find(city => 
    location.toLowerCase().includes(city.toLowerCase())
  ) ? cities[Object.keys(cities).find(city => 
    location.toLowerCase().includes(city.toLowerCase())
  ) as string] : cities['default'];

  // Event types
  const eventTypes = [
    'Music Festival', 'Food Fair', 'Art Exhibition', 
    'Cultural Festival', 'Tech Conference', 'Sports Event',
    'Comedy Show', 'Theater Performance', 'Workshop'
  ];
  
  // Event venues
  const venues = [
    'City Hall', 'Convention Center', 'Main Square', 
    'Grand Theater', 'Stadium', 'Museum',
    'Park', 'University', 'Beach'
  ];

  // Generate random events
  for (let i = 0; i < limit; i++) {
    // Random date in the next 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
    
    // End date a few hours after start date
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2 + Math.floor(Math.random() * 4));
    
    // Random slight variation in coordinates
    const lat = coordinates[0] + (Math.random() - 0.5) * 0.05;
    const lng = coordinates[1] + (Math.random() - 0.5) * 0.05;
    
    // Create the event
    events.push({
      id: `mock-event-${i}`,
      name: {
        text: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]} in ${location}`,
        html: `<p>${eventTypes[Math.floor(Math.random() * eventTypes.length)]} in ${location}</p>`
      },
      description: {
        text: `A great event happening in ${location}. Don't miss it!`,
        html: `<p>A great event happening in ${location}. Don't miss it!</p>`
      },
      url: 'https://www.eventbrite.com',
      start: {
        timezone: 'UTC',
        local: startDate.toISOString().replace('Z', ''),
        utc: startDate.toISOString()
      },
      end: {
        timezone: 'UTC',
        local: endDate.toISOString().replace('Z', ''),
        utc: endDate.toISOString()
      },
      venue_id: `mock-venue-${i}`,
      venue: {
        id: `mock-venue-${i}`,
        name: `${venues[Math.floor(Math.random() * venues.length)]} ${location}`,
        address: {
          address_1: `123 Main St`,
          city: location,
          postal_code: '12345',
          country: 'Country',
          latitude: lat,
          longitude: lng
        }
      },
      logo: {
        url: `https://picsum.photos/seed/${i}/200/200`
      },
      is_free: Math.random() > 0.5,
      category_id: `${Math.floor(Math.random() * 20) + 101}`
    });
  }
  
  return events;
};

// Get event categories
export const getEventCategories = async (): Promise<EventbriteCategory[]> => {
  try {
    const response = await fetchFromEventbrite<{ categories: EventbriteCategory[] }>('/categories/');
    return response.categories;
  } catch (error) {
    console.error('Error fetching event categories from Eventbrite:', error);
    return [];
  }
};

// Get events for a specific venue
export const getEventsByVenue = async (venueId: string): Promise<EventbriteEvent[]> => {
  try {
    const response = await fetchFromEventbrite<EventbriteResponse<EventbriteEvent>>(`/venues/${venueId}/events/`);
    return response.events;
  } catch (error) {
    console.error('Error fetching venue events from Eventbrite:', error);
    return [];
  }
};