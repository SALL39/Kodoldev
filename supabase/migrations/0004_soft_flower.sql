/*
  # Add user settings table and policies
  
  1. Changes
    - Create user_settings table if not exists
    - Add RLS policies if they don't exist
    - Add trigger for updated_at
*/

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) UNIQUE NOT NULL,
  settings jsonb NOT NULL DEFAULT '{
    "notify_low_battery": true,
    "notify_escape": true,
    "notify_health": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;
    
    CREATE POLICY "Users can manage their own settings"
      ON user_settings
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create or replace the timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and create new one
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
    
    CREATE TRIGGER update_user_settings_updated_at
        BEFORE UPDATE ON user_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_object THEN null;
END $$;