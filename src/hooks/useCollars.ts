import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Collar, CollarFormData } from '../types/collar';
import { useToast } from './useToast';

export function useCollars() {
  const [collars, setCollars] = useState<Collar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCollars();
  }, []);

  async function fetchCollars() {
    try {
      const { data, error } = await supabase
        .from('collars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollars(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collars');
      showToast('error', 'Erreur lors du chargement des colliers');
    } finally {
      setLoading(false);
    }
  }

  async function createCollar(data: CollarFormData) {
    try {
      const { data: newCollar, error } = await supabase
        .from('collars')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setCollars(current => [newCollar, ...current]);
      showToast('success', 'Collier ajouté avec succès');
      return newCollar;
    } catch (err) {
      showToast('error', 'Erreur lors de l\'ajout du collier');
      throw err;
    }
  }

  async function updateCollar(id: string, updates: Partial<CollarFormData>) {
    try {
      const { data: updatedCollar, error } = await supabase
        .from('collars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCollars(current =>
        current.map(collar => collar.id === id ? updatedCollar : collar)
      );
      showToast('success', 'Collier mis à jour avec succès');
      return updatedCollar;
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour du collier');
      throw err;
    }
  }

  return {
    collars,
    loading,
    error,
    createCollar,
    updateCollar,
    refresh: fetchCollars,
  };
}