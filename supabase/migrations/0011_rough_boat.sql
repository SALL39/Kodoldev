/*
  # Fix health records table and policies
  
  This migration ensures idempotency by:
  1. Checking if policies exist before creating them
  2. Using IF NOT EXISTS for table creation
  3. Safely handling trigger creation
*/

-- Create health records table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  vaccination_history jsonb DEFAULT '[]'::jsonb,
  medical_history jsonb DEFAULT '[]'::jsonb,
  genetic_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Safely create policy
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'health_records' 
        AND policyname = 'Users can manage health records of their animals'
    ) THEN
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
    END IF;
END
$$;

-- Safely create trigger
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