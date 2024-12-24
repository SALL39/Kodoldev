/*
  # Add collars management

  1. New Tables
    - `collars`
      - `id` (uuid, primary key)
      - `tag_id` (text, unique)
      - `animal_id` (uuid, foreign key to animals)
      - `battery_level` (integer)
      - `last_location` (point)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `collars` table
    - Add policies for authenticated users to manage their collars
*/

-- Create collars table
CREATE TABLE IF NOT EXISTS collars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text UNIQUE NOT NULL,
  animal_id uuid REFERENCES animals(id),
  battery_level integer DEFAULT 100,
  last_location point,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view collars of their animals"
  ON collars
  FOR SELECT
  TO authenticated
  USING (
    animal_id IS NULL OR
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = collars.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create collars"
  ON collars
  FOR INSERT
  TO authenticated
  WITH CHECK (
    animal_id IS NULL OR
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = collars.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their collars"
  ON collars
  FOR UPDATE
  TO authenticated
  USING (
    animal_id IS NULL OR
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = collars.animal_id
      AND animals.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    animal_id IS NULL OR
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = collars.animal_id
      AND animals.owner_id = auth.uid()
    )
  );

-- Create trigger for updating updated_at
CREATE TRIGGER update_collars_updated_at
  BEFORE UPDATE ON collars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();