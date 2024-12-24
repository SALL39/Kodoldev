export interface Animal {
  id: string;
  name: string;
  type: 'cattle' | 'sheep' | 'goat';
  tag_id: string;
  birth_date: string;
  gender: 'male' | 'female';
  owner_id: string;
  herd_id: string;
  last_location: [number, number];
  battery_level: number;
  health_status: 'healthy' | 'attention' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface Herd {
  id: string;
  name: string;
  owner_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  animal_id: string;
  type: 'escape' | 'battery' | 'health' | 'movement';
  severity: 'low' | 'medium' | 'high';
  message: string;
  read: boolean;
  created_at: string;
  animal?: Animal;
}

export interface Location {
  id: string;
  animal_id: string;
  position: [number, number];
  battery_level: number;
  recorded_at: string;
  animal: Animal;
}