import { COORDINATE_PRECISION } from './constants';

export function formatCoordinate(value: number): string {
  return Number(value).toFixed(COORDINATE_PRECISION);
}

export function parseLocation(location: any): [number, number] | undefined {
  if (!location) return undefined;
  
  // Handle point format from PostgreSQL
  if (typeof location === 'string' && location.startsWith('(') && location.endsWith(')')) {
    const [lat, lng] = location.slice(1, -1).split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }
  
  // Handle array format
  if (Array.isArray(location) && location.length === 2) {
    const [lat, lng] = location.map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }
  
  return undefined;
}