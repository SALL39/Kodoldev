import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Location } from '../types';

export function useHerdLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select(`
            *,
            animal:animals(
              id,
              name,
              tag_id,
              type,
              battery_level
            )
          `)
          .order('recorded_at', { ascending: false });

        if (error) throw error;
        setLocations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();

    // Subscribe to new location updates
    const subscription = supabase
      .channel('locations')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'locations'
      }, payload => {
        setLocations(current => [payload.new as Location, ...current]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { locations, loading, error };
}