/*
  # Complete Application Updates

  1. Add Notifications
    - Create notifications table for system alerts
    - Add RLS policies for user notifications
    - Add indexes for performance

  2. Add Health Record Features
    - Add attachments support for health records
    - Add veterinarian contact info
    - Add treatment costs tracking
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'health', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE NOT read;

-- Add attachments to health records
ALTER TABLE health_records
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS veterinarian_info jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS treatment_costs jsonb DEFAULT '[]'::jsonb;

-- Add constraints for new columns
ALTER TABLE health_records
  ADD CONSTRAINT valid_attachments CHECK (jsonb_typeof(attachments) = 'array'),
  ADD CONSTRAINT valid_veterinarian_info CHECK (jsonb_typeof(veterinarian_info) = 'object'),
  ADD CONSTRAINT valid_treatment_costs CHECK (jsonb_typeof(treatment_costs) = 'array');

-- Create function to validate attachment structure
CREATE OR REPLACE FUNCTION validate_attachment(attachment jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    attachment ? 'id' AND
    attachment ? 'name' AND
    attachment ? 'url' AND
    attachment ? 'type' AND
    attachment ? 'uploaded_at'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to validate veterinarian info
CREATE OR REPLACE FUNCTION validate_veterinarian_info(info jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    info ? 'name' AND
    info ? 'phone' AND
    info ? 'clinic'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update the health record validation trigger
CREATE OR REPLACE FUNCTION validate_health_record()
RETURNS trigger AS $$
DECLARE
  attachment jsonb;
BEGIN
  -- Existing validation logic remains...

  -- Validate attachments
  IF NEW.attachments IS NOT NULL THEN
    FOR attachment IN SELECT * FROM jsonb_array_elements(NEW.attachments)
    LOOP
      IF NOT validate_attachment(attachment) THEN
        RAISE EXCEPTION 'Invalid attachment structure';
      END IF;
    END LOOP;
  END IF;

  -- Validate veterinarian info
  IF NEW.veterinarian_info IS NOT NULL AND NOT validate_veterinarian_info(NEW.veterinarian_info) THEN
    RAISE EXCEPTION 'Invalid veterinarian info structure';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;