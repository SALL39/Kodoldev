import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';

interface DeviceRegistrationData {
  accountName: string;
  accountPassword: string;
  imei: string;
  devicePassword: string;
}

interface Device {
  id: string;
  imei: string;
  account_name: string;
  battery_level: number;
  last_location?: [number, number];
  status: 'active' | 'inactive' | 'maintenance';
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDevices();

    // Subscribe to device updates
    const subscription = supabase
      .channel('devices')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'devices'
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setDevices(current => [payload.new, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setDevices(current =>
            current.map(device =>
              device.id === payload.new.id ? payload.new : device
            )
          );
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(message);
      showToast('error', 'Erreur lors du chargement des appareils');
    } finally {
      setLoading(false);
    }
  };

  const registerDevice = async (data: DeviceRegistrationData) => {
    setIsRegistering(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('devices')
        .insert([{
          imei: data.imei,
          account_name: data.accountName,
          account_password: data.accountPassword,
          device_password: data.devicePassword,
          owner_id: user.id,
        }]);

      if (error) throw error;
      showToast('success', 'Appareil enregistré avec succès');
      return true;
    } catch (error) {
      console.error('Error registering device:', error);
      showToast('error', 'Erreur lors de l\'enregistrement de l\'appareil');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const updateDeviceLocation = async (imei: string, position: [number, number], batteryLevel?: number) => {
    try {
      const updates: any = {
        last_location: `(${position[0]},${position[1]})`,
      };

      if (batteryLevel !== undefined) {
        updates.battery_level = batteryLevel;
      }

      const { error } = await supabase
        .from('devices')
        .update(updates)
        .eq('imei', imei);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating device location:', error);
      throw error;
    }
  };

  return {
    devices,
    loading,
    error,
    registerDevice,
    updateDeviceLocation,
    isRegistering,
  };
}