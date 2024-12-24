import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';

interface DeviceLocation {
  id: string;
  device_id: string;
  position: [number, number];
  battery_level?: number;
  recorded_at: string;
}

export function useDeviceLocations(deviceId?: string) {
  const [locations, setLocations] = useState<DeviceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        let query = supabase
          .from('device_locations')
          .select('*')
          .order('recorded_at', { ascending: false });

        if (deviceId) {
          query = query.eq('device_id', deviceId);
        }

        const { data, error } = await query;
        if (error) throw error;
        setLocations(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch locations';
        setError(message);
        showToast('error', 'Erreur lors du chargement des positions');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();

    // Subscribe to location updates
    const subscription = supabase
      .channel('device_locations')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'device_locations',
        filter: deviceId ? `device_id=eq.${deviceId}` : undefined
      }, payload => {
        setLocations(current => [payload.new as DeviceLocation, ...current]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [deviceId]);

  const addLocation = async (deviceId: string, position: [number, number], batteryLevel?: number) => {
    try {
      const { error } = await supabase
        .from('device_locations')
        .insert({
          device_id: deviceId,
          position: `(${position[0]},${position[1]})`,
          battery_level: batteryLevel,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  return {
    locations,
    loading,
    error,
    addLocation,
  };
}