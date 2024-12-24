import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ensureUserProfile } from '../lib/database';
import type { Herd } from '../types';

export function useHerds() {
  const [herds, setHerds] = useState<Herd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHerds();
  }, []);

  async function fetchHerds() {
    try {
      const { data, error } = await supabase
        .from('herds')
        .select('*, animals:animals(count)')
        .order('name');

      if (error) throw error;
      setHerds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch herds');
    } finally {
      setLoading(false);
    }
  }

  async function createHerd(name: string, description?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure user profile exists before creating herd
      await ensureUserProfile(user.id, user.email || '');

      const { data, error } = await supabase
        .from('herds')
        .insert([{ 
          name, 
          description,
          owner_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      setHerds(current => [...current, data]);
      return data;
    } catch (err) {
      console.error('Failed to create herd:', err);
      throw err instanceof Error ? err : new Error('Failed to create herd');
    }
  }

  async function updateHerd(id: string, updates: Partial<Herd>) {
    try {
      const { data, error } = await supabase
        .from('herds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setHerds(current =>
        current.map(herd => (herd.id === id ? { ...herd, ...data } : herd))
      );
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update herd');
    }
  }

  return {
    herds,
    loading,
    error,
    createHerd,
    updateHerd,
    refresh: fetchHerds,
  };
}