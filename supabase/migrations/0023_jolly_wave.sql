-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS vocal_alert_recipients CASCADE;
DROP TABLE IF EXISTS vocal_alerts CASCADE;

-- Create vocal_alerts table
CREATE TABLE vocal_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  audio_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('vaccination', 'health', 'movement', 'system')),
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vocal_alert_recipients table
CREATE TABLE vocal_alert_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES vocal_alerts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'delivered', 'played')) DEFAULT 'sent',
  sent_at timestamptz DEFAULT now(),
  played_at timestamptz,
  UNIQUE(alert_id, user_id)
);

-- Enable RLS
ALTER TABLE vocal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_alert_recipients ENABLE ROW LEVEL SECURITY;

-- Simplified policies for vocal_alerts
CREATE POLICY "Creators can manage their alerts"
  ON vocal_alerts
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Recipients can view alerts"
  ON vocal_alerts
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT alert_id 
      FROM vocal_alert_recipients 
      WHERE user_id = auth.uid()
    )
  );

-- Simplified policies for vocal_alert_recipients
CREATE POLICY "Recipients can manage their own records"
  ON vocal_alert_recipients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_vocal_alerts_created_at ON vocal_alerts(created_at DESC);
CREATE INDEX idx_vocal_alert_recipients_user_id ON vocal_alert_recipients(user_id);
CREATE INDEX idx_vocal_alert_recipients_status ON vocal_alert_recipients(status) WHERE status != 'played';