/*
  # Health Records Schema Update

  1. Changes:
    - Add indexes for performance optimization
    - Add validation constraints
    - Update RLS policies for better security

  2. Security:
    - Maintain RLS policies
    - Add data validation
*/

-- Add validation constraints
ALTER TABLE health_records
  ADD CONSTRAINT valid_vaccination_history CHECK (jsonb_typeof(vaccination_history) = 'array'),
  ADD CONSTRAINT valid_medical_history CHECK (jsonb_typeof(medical_history) = 'array'),
  ADD CONSTRAINT valid_genetic_info CHECK (jsonb_typeof(genetic_info) = 'object');

-- Add composite index for better query performance
CREATE INDEX IF NOT EXISTS idx_health_records_animal_updated 
  ON health_records(animal_id, updated_at DESC);

-- Update RLS policies for better security
DROP POLICY IF EXISTS "Users can manage health records of their animals" ON health_records;

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