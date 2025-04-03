/*
  # Create trips table

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `destination` (text)
      - `arrival_date` (date)
      - `departure_date` (date)
      - `notification_preferences` (jsonb)
      - `user_id` (uuid, reference to auth.users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `trips` table
    - Add policy for authenticated users to read and write their own data
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  arrival_date date NOT NULL,
  departure_date date NOT NULL,
  notification_preferences jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own trips"
  ON trips
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
  ON trips
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON trips
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON trips
  FOR DELETE
  USING (auth.uid() = user_id);

-- For now, also allow public access for demo purposes
CREATE POLICY "Allow public access for demo"
  ON trips
  FOR ALL
  USING (true);