/*
  # Add devices table and relationships

  1. New Tables
    - `devices`
      - `id` (uuid, primary key)
      - `imei` (text, unique)
      - `account_name` (text)
      - `account_password` (text)
      - `device_password` (text)
      - `status` (text)
      - `last_location` (point)
      - `battery_level` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `devices` table
    - Add policies for authenticated users
*/

-- Create devices table
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

-- Create policies
CREATE POLICY "Users can manage their own devices"
  ON devices
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Create trigger for updating updated_at
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();