/*
  # Ajout des carnets de santé numériques

  1. Nouvelles Tables
    - `health_records`
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `vaccination_history` (jsonb)
      - `medical_history` (jsonb)
      - `genetic_info` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `health_records`
    - Ajout des policies pour la gestion des accès
*/

CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  vaccination_history jsonb DEFAULT '[]'::jsonb,
  medical_history jsonb DEFAULT '[]'::jsonb,
  genetic_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Policies pour les propriétaires d'animaux
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

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();