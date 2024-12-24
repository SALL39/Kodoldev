/*
  # Initial Schema for Kodol Livestock Management System

  1. New Tables
    - users
      - Basic user information and authentication
    - herds
      - Herd management and ownership
    - animals
      - Individual animal tracking and monitoring
    - alerts
      - System notifications and warnings
    - locations
      - GPS tracking history

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  preferred_language text DEFAULT 'fr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Herds table
CREATE TABLE IF NOT EXISTS herds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES users(id),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE herds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own herds"
  ON herds
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  tag_id text UNIQUE NOT NULL,
  birth_date date,
  gender text NOT NULL,
  owner_id uuid REFERENCES users(id),
  herd_id uuid REFERENCES herds(id),
  health_status text DEFAULT 'healthy',
  battery_level integer DEFAULT 100,
  last_location point,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own animals"
  ON animals
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id),
  type text NOT NULL,
  severity text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read alerts for their animals"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = alerts.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

-- Locations history table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id),
  position point NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  battery_level integer
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read location history for their animals"
  ON locations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = locations.animal_id
      AND animals.owner_id = auth.uid()
    )
  );