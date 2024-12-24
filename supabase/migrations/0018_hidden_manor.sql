-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS health_records CASCADE;

-- Create health records table with basic constraints
CREATE TABLE health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  vaccination_history jsonb DEFAULT '[]'::jsonb,
  medical_history jsonb DEFAULT '[]'::jsonb,
  genetic_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Simple type checking constraints
  CONSTRAINT valid_vaccination_history CHECK (jsonb_typeof(vaccination_history) = 'array'),
  CONSTRAINT valid_medical_history CHECK (jsonb_typeof(medical_history) = 'array'),
  CONSTRAINT valid_genetic_info CHECK (jsonb_typeof(genetic_info) = 'object'),
  CONSTRAINT genetic_info_has_breed CHECK (genetic_info ? 'breed')
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for access control
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
CREATE INDEX idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX idx_health_records_created_at ON health_records(created_at);
CREATE INDEX idx_health_records_animal_updated ON health_records(animal_id, updated_at DESC);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();