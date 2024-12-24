import { supabase } from './supabase';
import { ensureUserProfile } from './database';

export const DEFAULT_EMAIL = 'sallkidal2@kodol.com';
export const DEFAULT_PASSWORD = 'Jokolojo21';

export async function signIn(email: string, password: string) {
  // First try to sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If login succeeds, ensure user profile exists and return data
  if (!signInError && signInData.user) {
    await ensureUserProfile(signInData.user.id, signInData.user.email || email);
    return signInData;
  }

  // If it's not the default user or error is not invalid credentials, throw
  if (email !== DEFAULT_EMAIL || signInError.message !== 'Invalid login credentials') {
    throw signInError;
  }

  // Try to create the default user
  return createDefaultUser();
}

async function createDefaultUser() {
  try {
    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });

    if (signUpError) throw signUpError;
    if (!signUpData.user) throw new Error('User creation failed');

    // Wait a moment for the auth session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create the user profile
    await ensureUserProfile(signUpData.user.id, DEFAULT_EMAIL);

    return signUpData;
  } catch (error) {
    // If anything fails, try to sign in one last time
    const { data, error: finalSignInError } = await supabase.auth.signInWithPassword({
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });

    if (finalSignInError) throw finalSignInError;
    return data;
  }
}