import { supabase } from './supabase';
import { ScamEvent, ScamType, SafetyLevel } from '../types';
import { format } from 'date-fns';
import { getGlobalScamEvents, getComprehensiveScamData } from './globalScamData';

// Get all scam events
export const getAllScamEvents = async (): Promise<ScamEvent[]> => {
  try {
    // First try to get data from the database
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // If we have data in the database, return it
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise, fall back to comprehensive global data
    console.log('No scam events found in database, fetching global data...');
    return await getComprehensiveScamData(200);
  } catch (error) {
    console.error('Error fetching scam events:', error);
    // Fall back to comprehensive global data in case of error
    return await getComprehensiveScamData(200);
  }
};

// Get scam events by location (city or country)
export const getScamEventsByLocation = async (location: string): Promise<ScamEvent[]> => {
  try {
    // Try database first
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .ilike('location', `%${location}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // If we have data in the database, return it
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise, filter from global data
    console.log(`No scam events found for location "${location}" in database, using global data...`);
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching scam events by location:', error);
    // Fall back to filtered global data
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase())
    );
  }
};

// Get scam events by type
export const getScamEventsByType = async (scamType: ScamType): Promise<ScamEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .eq('scam_type', scamType)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      return data;
    }
    
    // Fall back to filtered global data
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => event.scam_type === scamType);
  } catch (error) {
    console.error('Error fetching scam events by type:', error);
    // Fall back to filtered global data
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => event.scam_type === scamType);
  }
};

// Get verified scam events
export const getVerifiedScamEvents = async (): Promise<ScamEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      return data;
    }
    
    // Fall back to filtered global data
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => event.verified);
  } catch (error) {
    console.error('Error fetching verified scam events:', error);
    // Fall back to filtered global data
    const allEvents = await getComprehensiveScamData(300);
    return allEvents.filter(event => event.verified);
  }
};

// Get user's reported scam events
export const getUserScamEvents = async (userId: string): Promise<ScamEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user scam events:', error);
    return [];
  }
};

// Add a new scam event
export const addScamEvent = async (scamEvent: Omit<ScamEvent, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ScamEvent | null, error: Error | null }> => {
  try {
    // Format dates to ISO strings if they exist
    const formattedEvent = {
      ...scamEvent,
      start_date: scamEvent.start_date ? new Date(scamEvent.start_date).toISOString() : undefined,
      end_date: scamEvent.end_date ? new Date(scamEvent.end_date).toISOString() : undefined
    };

    const { data, error } = await supabase
      .from('events')
      .insert([formattedEvent])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error adding scam event:', error);
    return { data: null, error: error as Error };
  }
};

// Update an existing scam event
export const updateScamEvent = async (id: string, updates: Partial<ScamEvent>): Promise<{ data: ScamEvent | null, error: Error | null }> => {
  try {
    // Format dates to ISO strings if they exist
    const formattedUpdates = {
      ...updates,
      start_date: updates.start_date ? new Date(updates.start_date).toISOString() : undefined,
      end_date: updates.end_date ? new Date(updates.end_date).toISOString() : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('events')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating scam event:', error);
    return { data: null, error: error as Error };
  }
};

// Delete a scam event
export const deleteScamEvent = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting scam event:', error);
    return { error: error as Error };
  }
};

// Get scam events for a specific trip (based on destination and dates)
export const getScamEventsForTrip = async (destination: string, arrivalDate: string, departureDate: string): Promise<ScamEvent[]> => {
  try {
    // First try to get from database
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_scam_related', true)
      .ilike('location', `%${destination}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Filter events that are relevant for the trip dates
    // Either events with no specific date, or events that overlap with the trip dates
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    
    const dbEvents = data || [];
    
    // If we have sufficient database events, use those
    if (dbEvents.length >= 5) {
      return dbEvents.filter(event => {
        // If no dates on the event, always include it
        if (!event.start_date) return true;
        
        const eventStart = event.start_date ? new Date(event.start_date) : null;
        const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
        
        // Event with no end date - check if it starts before departure
        if (eventStart && !eventEnd) {
          return eventStart <= departure;
        }
        
        // Event with start and end dates - check for overlap
        if (eventStart && eventEnd) {
          return (eventStart <= departure) && (eventEnd >= arrival);
        }
        
        return true;
      });
    }
    
    // Otherwise, supplement with global data
    console.log(`Insufficient scam events for trip to "${destination}", supplementing with global data...`);
    
    // Get location-filtered global data
    const globalEvents = await getComprehensiveScamData(50);
    const filteredGlobalEvents = globalEvents.filter(event => 
      event.location.toLowerCase().includes(destination.toLowerCase())
    );
    
    // Combine and filter by dates
    const combinedEvents = [...dbEvents, ...filteredGlobalEvents];
    
    return combinedEvents.filter(event => {
      // If no dates on the event, always include it
      if (!event.start_date) return true;
      
      const eventStart = event.start_date ? new Date(event.start_date) : null;
      const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
      
      // Event with no end date - check if it starts before departure
      if (eventStart && !eventEnd) {
        return eventStart <= departure;
      }
      
      // Event with start and end dates - check for overlap
      if (eventStart && eventEnd) {
        return (eventStart <= departure) && (eventEnd >= arrival);
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error fetching scam events for trip:', error);
    // Fall back to global data
    const globalEvents = await getComprehensiveScamData(50);
    const filteredEvents = globalEvents.filter(event => 
      event.location.toLowerCase().includes(destination.toLowerCase())
    );
    
    return filteredEvents;
  }
};

// Get mock data for scam events (useful for development)
export const getMockScamEvents = (count: number = 10): ScamEvent[] => {
  // Use the new global scam data function
  return getGlobalScamEvents(count);
};