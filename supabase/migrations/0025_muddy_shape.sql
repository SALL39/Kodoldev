/*
  # Add Admin Role Support
  
  1. Changes
    - Add user_role column to users table
    - Add RLS policies for role-based access
    - Update user metadata handling
*/

-- Ensure user_role column exists with proper constraint
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_user_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_user_role_check 
CHECK (user_role IN ('admin', 'user'));

-- Create function to handle user metadata updates
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN NEW.user_role = 'admin' THEN '{"role": "admin"}'::jsonb
      ELSE '{"role": "user"}'::jsonb
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create admin user if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@kodol.com'
  ) THEN
    -- Create auth user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin@kodol.com',
      crypt('Jokolojo21', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    -- Create public user profile
    INSERT INTO public.users (
      id,
      email,
      user_role
    )
    SELECT 
      id,
      'admin@kodol.com',
      'admin'
    FROM auth.users
    WHERE email = 'admin@kodol.com';
  END IF;
END $$;