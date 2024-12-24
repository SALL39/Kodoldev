/*
  # Fix Health Records Policies and Structure

  1. Changes
    - Safely recreate health records table if needed
    - Drop and recreate policies to fix duplicate issue
    - Ensure proper RLS setup
    - Add indexes for better performance

  2. Security
    - Enable RLS
    - Add comprehensive policies for CRUD operations
    - Ensure proper access control based on animal ownership
*/

-- Safely recreate health records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  vaccination_history jsonb DEFAULT '[]'::jsonb,
  medical_history jsonb DEFAULT '[]'::jsonb,
  genetic_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage health records of their animals" ON health_records;

-- Create new policies with proper access control
CREATE POLICY "Users can read health records of their animals"
  ON health_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create health records for their animals"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update health records of their animals"
  ON health_records
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON health_records(created_at);

-- Ensure updated_at is managed
DROP TRIGGER IF EXISTS update_health_records_updated_at ON health_records;
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();