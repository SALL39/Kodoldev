import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

interface Settings {
  notify_low_battery: boolean;
  notify_escape: boolean;
  notify_health: boolean;
}

const defaultSettings: Settings = {
  notify_low_battery: true,
  notify_escape: true,
  notify_health: true,
};

export function useSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  async function loadSettings() {
    if (!user) return;

    try {
      // Try to get or create settings in a single operation using upsert
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          { user_id: user.id, settings: defaultSettings },
          { onConflict: 'user_id' }
        )
        .select('settings')
        .single();

      if (error) throw error;
      setSettings(data.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast('error', 'Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(newSettings: Partial<Settings>) {
    if (!user) return false;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      const { error } = await supabase
        .from('user_settings')
        .update({ settings: updatedSettings })
        .eq('user_id', user.id);

      if (error) throw error;
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('error', 'Erreur lors de la mise à jour des préférences');
      return false;
    }
  }

  return { settings, loading, updateSettings };
}