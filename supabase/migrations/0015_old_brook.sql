/*
  # Health Records Schema Update

  1. Changes
    - Drop existing health_records table if it exists
    - Create new health_records table with proper constraints
    - Add RLS policies
    - Add performance indexes
    - Add data validation constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Restrict access to animal owners only

  3. Performance
    - Add indexes for common queries
    - Add composite index for animal_id and updated_at
*/

-- Drop existing table and related objects
DROP TABLE IF EXISTS health_records CASCADE;

-- Create health records table
CREATE TABLE health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  vaccination_history jsonb DEFAULT '[]'::jsonb,
  medical_history jsonb DEFAULT '[]'::jsonb,
  genetic_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_vaccination_history CHECK (jsonb_typeof(vaccination_history) = 'array'),
  CONSTRAINT valid_medical_history CHECK (jsonb_typeof(medical_history) = 'array'),
  CONSTRAINT valid_genetic_info CHECK (jsonb_typeof(genetic_info) = 'object')
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage health records of their animals"
  ON health_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

-- Add indexes for better query performance
CREATE INDEX idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX idx_health_records_created_at ON health_records(created_at);
CREATE INDEX idx_health_records_animal_updated ON health_records(animal_id, updated_at DESC);

-- Create trigger for updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_health_records_updated_at'
    ) THEN
        CREATE TRIGGER update_health_records_updated_at
          BEFORE UPDATE ON health_records
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;