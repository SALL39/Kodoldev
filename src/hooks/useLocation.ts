import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Location } from '../types';

interface LocationUpdate {
  animalId: string;
  position: [number, number];
  batteryLevel?: number;
}

export function useLocation() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLocation = async ({ animalId, position, batteryLevel }: LocationUpdate) => {
    setIsUpdating(true);
    try {
      const updates: any = {
        last_location: `(${position[0]},${position[1]})`
      };

      if (batteryLevel !== undefined) {
        updates.battery_level = batteryLevel;
      }

      // Update animal's last known location
      const { error: updateError } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', animalId);

      if (updateError) throw updateError;

      // Record location in history
      const { error: historyError } = await supabase
        .from('locations')
        .insert({
          animal_id: animalId,
          position: `(${position[0]},${position[1]})`,
          battery_level: batteryLevel,
        });

      if (historyError) throw historyError;

      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateLocation, isUpdating };
}