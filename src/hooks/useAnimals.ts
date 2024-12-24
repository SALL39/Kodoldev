import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Animal } from '../types';

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('name');

      if (error) throw error;
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  }

  async function createAnimal(animalData: Partial<Animal>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('animals')
        .insert([{ ...animalData, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setAnimals(current => [...current, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create animal');
    }
  }

  async function updateAnimal(id: string, updates: Partial<Animal>) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAnimals(current =>
        current.map(animal => (animal.id === id ? { ...animal, ...data } : animal))
      );
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update animal');
    }
  }

  return {
    animals,
    loading,
    error,
    createAnimal,
    updateAnimal,
    refresh: fetchAnimals,
  };
}