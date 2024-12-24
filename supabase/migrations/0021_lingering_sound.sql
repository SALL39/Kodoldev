/*
  # Add Vocal Alerts System and User Roles

  1. Add role to users
  2. Create vocal alerts tables
  3. Set up security policies
*/

-- First add role to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role text DEFAULT 'user';

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

-- Policies for vocal_alerts
CREATE POLICY "Admins can manage vocal alerts"
  ON vocal_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Users can view vocal alerts sent to them"
  ON vocal_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vocal_alert_recipients
      WHERE vocal_alert_recipients.alert_id = vocal_alerts.id
      AND vocal_alert_recipients.user_id = auth.uid()
    )
  );

-- Policies for vocal_alert_recipients
CREATE POLICY "Admins can manage recipients"
  ON vocal_alert_recipients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Users can view and update their own alerts"
  ON vocal_alert_recipients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_vocal_alerts_created_at ON vocal_alerts(created_at DESC);
CREATE INDEX idx_vocal_alert_recipients_user_id ON vocal_alert_recipients(user_id);
CREATE INDEX idx_vocal_alert_recipients_status ON vocal_alert_recipients(status) WHERE status != 'played';