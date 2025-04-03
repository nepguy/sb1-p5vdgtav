import { supabase } from './supabase';
import { Trip, NotificationPreferences } from '../types';

// Get user's trips
export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('arrival_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return [];
  }
};

// Get a specific trip by ID
export const getTripById = async (tripId: string): Promise<Trip | null> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching trip by ID:', error);
    return null;
  }
};

// Add a new trip
export const addTrip = async (trip: Omit<Trip, 'id' | 'created_at'>): Promise<{ data: Trip | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([trip])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error adding trip:', error);
    return { data: null, error: error as Error };
  }
};

// Update an existing trip
export const updateTrip = async (id: string, updates: Partial<Trip>): Promise<{ data: Trip | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating trip:', error);
    return { data: null, error: error as Error };
  }
};

// Delete a trip
export const deleteTrip = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { error: error as Error };
  }
};

// Get ongoing trips for a user (trips where current date is between arrival and departure)
export const getOngoingTrips = async (userId: string): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('arrival_date', { ascending: true });

    if (error) {
      throw error;
    }

    const now = new Date();
    return (data || []).filter(trip => {
      const arrivalDate = new Date(trip.arrival_date);
      const departureDate = new Date(trip.departure_date);
      return arrivalDate <= now && departureDate >= now;
    });
  } catch (error) {
    console.error('Error fetching ongoing trips:', error);
    return [];
  }
};

// Get upcoming trips for a user (trips where arrival date is in the future)
export const getUpcomingTrips = async (userId: string): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('arrival_date', { ascending: true });

    if (error) {
      throw error;
    }

    const now = new Date();
    return (data || []).filter(trip => {
      const arrivalDate = new Date(trip.arrival_date);
      return arrivalDate > now;
    });
  } catch (error) {
    console.error('Error fetching upcoming trips:', error);
    return [];
  }
};

// Get past trips for a user (trips where departure date is in the past)
export const getPastTrips = async (userId: string): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('departure_date', { ascending: false });

    if (error) {
      throw error;
    }

    const now = new Date();
    return (data || []).filter(trip => {
      const departureDate = new Date(trip.departure_date);
      return departureDate < now;
    });
  } catch (error) {
    console.error('Error fetching past trips:', error);
    return [];
  }
};

// Update notification preferences for a trip
export const updateTripNotificationPreferences = async (
  tripId: string, 
  preferences: NotificationPreferences
): Promise<{ data: Trip | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update({ notification_preferences: preferences })
      .eq('id', tripId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating trip notification preferences:', error);
    return { data: null, error: error as Error };
  }
};