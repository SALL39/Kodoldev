import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import type { HealthRecord } from '../types/healthRecord';

export function useHealthRecords(animalId?: string) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (animalId) {
      fetchHealthRecords();
    }
  }, [animalId]);

  async function fetchHealthRecords() {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch health records';
      setError(message);
      showToast('error', 'Erreur lors du chargement des carnets de santé');
    } finally {
      setLoading(false);
    }
  }

  async function createHealthRecord(data: Partial<HealthRecord>) {
    try {
      const { data: newRecord, error } = await supabase
        .from('health_records')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setRecords(current => [newRecord, ...current]);
      showToast('success', 'Carnet de santé créé avec succès');
      return newRecord;
    } catch (err) {
      showToast('error', 'Erreur lors de la création du carnet de santé');
      throw err instanceof Error ? err : new Error('Failed to create health record');
    }
  }

  async function updateHealthRecord(id: string, updates: Partial<HealthRecord>) {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('health_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecords(current =>
        current.map(record => record.id === id ? updatedRecord : record)
      );
      showToast('success', 'Carnet de santé mis à jour avec succès');
      return updatedRecord;
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour du carnet de santé');
      throw err instanceof Error ? err : new Error('Failed to update health record');
    }
  }

  return {
    records,
    loading,
    error,
    createHealthRecord,
    updateHealthRecord,
    refresh: fetchHealthRecords,
  };
}