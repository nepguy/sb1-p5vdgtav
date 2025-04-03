// Event and Scam Types
export type ScamType = 
  | 'Tourist Trap' 
  | 'Overcharging' 
  | 'Fake Products' 
  | 'Pickpocketing' 
  | 'Taxi Scam' 
  | 'Fake Officials' 
  | 'Counterfeit Currency' 
  | 'Accommodation Scam' 
  | 'ATM Fraud' 
  | 'Distraction Theft'
  | 'Other';

export type SafetyLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

export interface ScamEvent {
  id: string;
  title: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  is_scam_related: boolean;
  scam_type?: ScamType;
  safety_level?: SafetyLevel;
  external_id?: string;
  external_url?: string;
  source?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  verified: boolean;
}

// Trip Types
export interface Trip {
  id: string;
  destination: string;
  arrival_date: string;
  departure_date: string;
  notification_preferences?: NotificationPreferences;
  user_id?: string;
  created_at?: string;
}

export interface NotificationPreferences {
  weather?: boolean;
  events?: boolean;
  customs?: boolean;
  phrases?: boolean;
  safety?: boolean;
  transport?: boolean;
  attractions?: boolean;
  restaurants?: boolean;
  exchange?: boolean;
}