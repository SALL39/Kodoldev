-- Create vocal_alerts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'vocal_alerts') THEN
        CREATE TABLE vocal_alerts (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title text NOT NULL,
            description text,
            audio_url text NOT NULL,
            type text NOT NULL CHECK (type IN ('vaccination', 'health', 'movement', 'system')),
            created_by uuid REFERENCES users(id) NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;
END $$;

-- Create vocal_alert_recipients table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'vocal_alert_recipients') THEN
        CREATE TABLE vocal_alert_recipients (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            alert_id uuid REFERENCES vocal_alerts(id) ON DELETE CASCADE NOT NULL,
            user_id uuid REFERENCES users(id) NOT NULL,
            status text NOT NULL CHECK (status IN ('sent', 'delivered', 'played')) DEFAULT 'sent',
            sent_at timestamptz DEFAULT now(),
            played_at timestamptz,
            UNIQUE(alert_id, user_id)
        );
    END IF;
END $$;

-- Enable RLS
ALTER TABLE vocal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_alert_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for vocal_alerts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage vocal alerts" ON vocal_alerts;
    CREATE POLICY "Users can manage vocal alerts"
        ON vocal_alerts
        FOR ALL
        TO authenticated
        USING (created_by = auth.uid());

    DROP POLICY IF EXISTS "Users can view vocal alerts sent to them" ON vocal_alerts;
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
END $$;

-- Create policies for vocal_alert_recipients
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage recipients" ON vocal_alert_recipients;
    CREATE POLICY "Users can manage recipients"
        ON vocal_alert_recipients
        FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM vocal_alerts
                WHERE vocal_alerts.id = vocal_alert_recipients.alert_id
                AND vocal_alerts.created_by = auth.uid()
            )
        );

    DROP POLICY IF EXISTS "Users can view and update their own alerts" ON vocal_alert_recipients;
    CREATE POLICY "Users can view and update their own alerts"
        ON vocal_alert_recipients
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocal_alerts_created_at ON vocal_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vocal_alert_recipients_user_id ON vocal_alert_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_vocal_alert_recipients_status ON vocal_alert_recipients(status) WHERE status != 'played';