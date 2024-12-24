import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';

export function useUpdateAnimalLocation() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  const updateLocation = async (animalId: string, position: [number, number]) => {
    setIsUpdating(true);
    try {
      // Update animal's last known location
      const { error: updateError } = await supabase
        .from('animals')
        .update({ last_location: `(${position[0]},${position[1]})` })
        .eq('id', animalId);

      if (updateError) throw updateError;

      // Record location in history
      const { error: historyError } = await supabase
        .from('locations')
        .insert({
          animal_id: animalId,
          position: `(${position[0]},${position[1]})`,
        });

      if (historyError) throw historyError;

      showToast('success', 'Position mise à jour avec succès');
    } catch (error) {
      console.error('Error updating location:', error);
      showToast('error', 'Erreur lors de la mise à jour de la position');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateLocation, isUpdating };
}