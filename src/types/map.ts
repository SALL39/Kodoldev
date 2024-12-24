export interface MapLocation {
  id: string;
  name: string;
  location: [number, number] | string;
  type?: 'animal' | 'device';
}

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapConfig {
  center: MapPosition;
  zoom: number;
  options?: google.maps.MapOptions;
}