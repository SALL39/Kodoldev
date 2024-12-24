import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  activeAnimals: number;
  alerts: number;
  herds: number;
  lowBattery: number;
  loading: boolean;
  error: string | null;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    activeAnimals: 0,
    alerts: 0,
    herds: 0,
    lowBattery: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: animalsCount },
          { count: alertsCount },
          { count: herdsCount },
          { count: lowBatteryCount },
        ] = await Promise.all([
          supabase
            .from('animals')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('read', false),
          supabase
            .from('herds')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('animals')
            .select('*', { count: 'exact', head: true })
            .lt('battery_level', 20),
        ]);

        setStats({
          activeAnimals: animalsCount || 0,
          alerts: alertsCount || 0,
          herds: herdsCount || 0,
          lowBattery: lowBatteryCount || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats(current => ({
          ...current,
          loading: false,
          error: 'Failed to load stats',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}