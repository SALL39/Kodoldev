/*
  # Fix users table RLS policies

  1. Changes
    - Add policy to allow inserting users during signup
    - Add policy to allow users to update their own data
    - Add policy to allow authenticated users to read their own data

  2. Security
    - Maintains data isolation between users
    - Allows necessary operations for auth flow
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Add comprehensive policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);