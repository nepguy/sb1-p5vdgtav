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