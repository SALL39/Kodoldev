export interface HealthRecord {
  id: string;
  animal_id: string;
  vaccination_history: VaccinationEntry[];
  medical_history: MedicalEntry[];
  genetic_info: GeneticInfo;
  veterinarian_info: VeterinarianInfo;
  attachments: Attachment[];
  treatment_costs: TreatmentCost[];
  created_at: string;
  updated_at: string;
}

export interface VaccinationEntry {
  id: string;
  name: string;
  date: string;
  next_date?: string;
  veterinarian: string;
}

export interface MedicalEntry {
  id: string;
  type: 'checkup' | 'treatment' | 'surgery' | 'other';
  date: string;
  description: string;
  veterinarian: string;
  notes?: string;
}

export interface GeneticInfo {
  father_tag_id?: string;
  mother_tag_id?: string;
  breed: string;
  birth_weight?: number;
  genetic_traits?: string[];
}

export interface VeterinarianInfo {
  name: string;
  phone: string;
  clinic: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface TreatmentCost {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
}