/*
  # Fix Authentication Setup
  
  1. Changes
    - Add proper user role management
    - Set up correct auth user creation
    - Ensure proper metadata handling
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
DECLARE
  admin_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@kodol.com'
  ) THEN
    -- Generate UUID for admin user
    admin_id := gen_random_uuid();
    
    -- Create auth user with specific UUID
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
      aud,
      confirmation_token,
      recovery_token,
      is_super_admin,
      phone,
      phone_confirmed_at,
      confirmed_at,
      last_sign_in_at
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@kodol.com',
      crypt('Jokolojo21', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated',
      encode(gen_random_bytes(32), 'hex'),
      encode(gen_random_bytes(32), 'hex'),
      false,
      null,
      null,
      now(),
      now()
    );

    -- Create public user profile with same UUID
    INSERT INTO public.users (
      id,
      email,
      user_role,
      created_at
    ) VALUES (
      admin_id,
      'admin@kodol.com',
      'admin',
      now()
    );
  END IF;
END $$;