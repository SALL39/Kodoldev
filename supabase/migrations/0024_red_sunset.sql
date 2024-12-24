-- Add role management
DO $$ 
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_role'
    ) THEN
        ALTER TABLE users ADD COLUMN user_role text DEFAULT 'user' CHECK (user_role IN ('admin', 'user'));
    END IF;

    -- Update policies for vocal alerts to respect admin role
    DROP POLICY IF EXISTS "Creators can manage their alerts" ON vocal_alerts;
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

    -- Ensure first user is admin
    UPDATE users 
    SET user_role = 'admin' 
    WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
    AND user_role IS NULL;
END $$;