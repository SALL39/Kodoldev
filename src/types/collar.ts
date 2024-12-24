export interface Collar {
  id: string;
  tag_id: string;
  animal_id: string | null;
  battery_level: number;
  last_location: [number, number] | null;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface CollarFormData {
  tag_id: string;
  animal_id?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}