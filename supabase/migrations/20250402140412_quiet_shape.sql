/*
  # Add foreign key constraint to events table for user_id (if not exists)

  This migration adds a foreign key constraint to the events table to ensure
  that user_id references an existing user in the auth.users table.
  The migration checks if the constraint already exists before attempting to add it.
*/

DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'events_user_id_fkey'
  ) THEN
    -- Add the constraint only if it doesn't exist
    ALTER TABLE events
    ADD CONSTRAINT events_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id);
  END IF;
END $$;