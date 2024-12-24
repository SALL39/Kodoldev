import { supabase } from './supabase';

export async function ensureUserProfile(userId: string, email: string) {
  try {
    // First try to get the user profile
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId);

    if (selectError) throw selectError;

    // If no user profile exists, create one
    if (!users || users.length === 0) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email,
          full_name: email.split('@')[0],
          preferred_language: 'fr'
        }]);

      if (insertError) {
        // If insert fails due to race condition (profile already created),
        // that's fine - we can ignore that specific error
        if (!insertError.message.includes('duplicate key')) {
          throw insertError;
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}