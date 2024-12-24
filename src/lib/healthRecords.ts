import { supabase } from './supabase';
import type { HealthRecord } from '../types/healthRecord';

export async function addHealthRecord(animalId: string, data: Partial<HealthRecord>) {
  const { data: record, error } = await supabase
    .from('health_records')
    .insert([{
      animal_id: animalId,
      vaccination_history: [{
        id: Date.now().toString(),
        name: 'Vaccination contre la fièvre aphteuse',
        date: '2024-01-15',
        next_date: '2024-07-15',
        veterinarian: 'Dr. Coulibaly'
      }],
      medical_history: [{
        id: Date.now().toString(),
        type: 'checkup',
        date: '2024-01-15',
        description: 'Examen de routine',
        veterinarian: 'Dr. Coulibaly',
        notes: 'Animal en bonne santé'
      }],
      genetic_info: {
        breed: 'Zébu Peul',
        birth_weight: 25,
        father_tag_id: 'ZP001',
        mother_tag_id: 'ZP002'
      }
    }])
    .select()
    .single();

  if (error) throw error;
  return record;
}