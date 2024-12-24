import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import type { VocalAlert, VocalAlertRecipient } from '../types/vocalAlert';

export function useVocalAlerts() {
  const [alerts, setAlerts] = useState<VocalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAlerts();

    const subscription = supabase
      .channel('vocal_alerts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vocal_alerts'
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setAlerts(current => [payload.new as VocalAlert, ...current]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('vocal_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      showToast('error', 'Erreur lors du chargement des alertes vocales');
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (data: Partial<VocalAlert>, recipientIds: string[]) => {
    try {
      const { data: alert, error: alertError } = await supabase
        .from('vocal_alerts')
        .insert([data])
        .select()
        .single();

      if (alertError) throw alertError;

      const recipients = recipientIds.map(userId => ({
        alert_id: alert.id,
        user_id: userId
      }));

      const { error: recipientError } = await supabase
        .from('vocal_alert_recipients')
        .insert(recipients);

      if (recipientError) throw recipientError;

      showToast('success', 'Alerte vocale créée avec succès');
      return alert;
    } catch (err) {
      showToast('error', 'Erreur lors de la création de l\'alerte vocale');
      throw err;
    }
  };

  const markAsPlayed = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('vocal_alert_recipients')
        .update({ 
          status: 'played',
          played_at: new Date().toISOString()
        })
        .eq('alert_id', alertId)
        .eq('user_id', supabase.auth.user()?.id);

      if (error) throw error;
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  return {
    alerts,
    loading,
    error,
    createAlert,
    markAsPlayed,
    refresh: fetchAlerts
  };
}