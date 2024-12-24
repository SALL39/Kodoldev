/*
  # Add Health Records Migration Fix

  1. Changes:
    - Safely create health records table
    - Add proper RLS policies
    - Add indexes for performance
    - Safe trigger creation with existence check

  2. Security:
    - Enable RLS
    - Add policies for CRUD operations
    - Ensure proper access control
*/

-- Safely create health records table
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

-- Create policies for access control
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
CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON health_records(created_at);

-- Safely create trigger with existence check
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