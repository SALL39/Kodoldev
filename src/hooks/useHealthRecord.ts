import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { HealthRecord } from '../types/healthRecord';
import type { Animal } from '../types';

export function useHealthRecord(id?: string) {
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      try {
        const { data: recordData, error: recordError } = await supabase
          .from('health_records')
          .select('*, animal:animals(*)')
          .eq('id', id)
          .single();

        if (recordError) throw recordError;
        if (!recordData) throw new Error('Record not found');

        setRecord(recordData);
        setAnimal(recordData.animal);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  return { record, animal, loading, error };
}