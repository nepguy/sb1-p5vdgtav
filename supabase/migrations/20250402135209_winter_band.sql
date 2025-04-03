/*
  # Create events table for storing external and user-reported events

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, not null) - The title of the event
      - `description` (text) - Description of the event
      - `location` (text, not null) - Location name of the event
      - `latitude` (float) - Latitude coordinate of the event
      - `longitude` (float) - Longitude coordinate of the event
      - `start_date` (timestamptz) - When the event starts
      - `end_date` (timestamptz) - When the event ends
      - `is_scam_related` (boolean, default false) - Whether this event is scam-related
      - `scam_type` (text) - Type of scam if applicable
      - `safety_level` (text) - Safety level assessment
      - `external_id` (text) - ID from an external API like Eventbrite
      - `external_url` (text) - URL to the event on an external platform
      - `source` (text) - Source of the event (e.g., "eventbrite", "user_reported")
      - `user_id` (uuid) - Reference to the user who added/reported this event
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `verified` (boolean, default false) - Whether this event has been verified

  2. Security
    - Enable RLS on `events` table
    - Add policy for public to read events
    - Add policy for authenticated users to insert their own events
    - Add policy for authenticated users to update their own events
    - Add policy for authenticated users to delete their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  latitude float,
  longitude float,
  start_date timestamptz,
  end_date timestamptz,
  is_scam_related boolean DEFAULT false,
  scam_type text,
  safety_level text,
  external_id text,
  external_url text,
  source text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for public to read all events
CREATE POLICY "Events are readable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert their own events
CREATE POLICY "Users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to update their own events
CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own events
CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index on location for faster searching
CREATE INDEX IF NOT EXISTS events_location_idx ON events (location);

-- Create an index on latitude and longitude for spatial queries
CREATE INDEX IF NOT EXISTS events_coordinates_idx ON events (latitude, longitude);

-- Create an index on start_date for date-based queries
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events (start_date);

-- Create an index on is_scam_related for filtering
CREATE INDEX IF NOT EXISTS events_is_scam_related_idx ON events (is_scam_related);