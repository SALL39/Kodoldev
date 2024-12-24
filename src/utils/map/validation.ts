export function isValidLatitude(lat: number): boolean {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return !isNaN(lng) && lng >= -180 && lng <= 180;
}

export function isValidLocation(location: any): location is [number, number] {
  if (!Array.isArray(location) || location.length !== 2) return false;
  const [lat, lng] = location;
  return isValidLatitude(lat) && isValidLongitude(lng);
}