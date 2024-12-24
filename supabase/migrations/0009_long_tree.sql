/*
  # Device Location History Schema
  
  1. New Tables
    - device_locations: Stores historical location data for GPS devices
  
  2. Security
    - Enables RLS on device_locations table
    - Adds policy for users to access their own device locations
*/

CREATE TABLE IF NOT EXISTS device_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  position point NOT NULL,
  battery_level integer,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE device_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their device locations"
  ON device_locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_locations.device_id
      AND devices.owner_id = auth.uid()
    )
  );

CREATE INDEX idx_device_locations_device_id ON device_locations(device_id);
CREATE INDEX idx_device_locations_recorded_at ON device_locations(recorded_at);