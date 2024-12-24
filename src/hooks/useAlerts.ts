import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select(`
            *,
            animal:animals(
              name,
              tag_id,
              type
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Subscribe to new alerts
    const subscription = supabase
      .channel('alerts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts' 
      }, payload => {
        setAlerts(current => [payload.new as Alert, ...current]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setAlerts(current =>
        current.map(alert =>
          alert.id === id ? { ...alert, read: true } : alert
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return { alerts, loading, error, markAsRead };
}