// Utility functions for handling location data
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

export function formatCoordinate(value: number): string {
  return Number(value).toFixed(6);
}

export function isValidLocation(location: any): location is [number, number] {
  if (!Array.isArray(location) || location.length !== 2) return false;
  return !isNaN(Number(location[0])) && !isNaN(Number(location[1]));
}