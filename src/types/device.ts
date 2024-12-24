export interface Device {
  id: string;
  imei: string;
  account_name: string;
  battery_level: number;
  last_location?: [number, number] | string;
  status: 'active' | 'inactive' | 'maintenance';
  updated_at: string;
}