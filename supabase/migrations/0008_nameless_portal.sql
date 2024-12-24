/*
  # Device Management Schema Update
  
  1. Changes
    - Creates devices table for GPS device management
    - Adds RLS policies for device security
    - Sets up automatic timestamp updates
  
  2. Security
    - Enables RLS on devices table
    - Adds policy for authenticated users to manage their own devices
*/

-- Create devices table if it doesn't exist
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  imei text UNIQUE NOT NULL,
  account_name text NOT NULL,
  account_password text NOT NULL,
  device_password text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  last_location point,
  battery_level integer DEFAULT 100,
  owner_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own devices" ON devices;
    
    CREATE POLICY "Users can manage their own devices"
      ON devices
      FOR ALL
      TO authenticated
      USING (owner_id = auth.uid())
      WITH CHECK (owner_id = auth.uid());
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create trigger for updating updated_at
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_devices_updated_at ON devices;
    
    CREATE TRIGGER update_devices_updated_at
      BEFORE UPDATE ON devices
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_object THEN null;
END $$;