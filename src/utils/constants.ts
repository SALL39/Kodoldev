export const DEFAULT_MAP_CENTER: [number, number] = [14.4974, -4.2867]; // Mali center
export const DEFAULT_MAP_ZOOM = 6;

export const BATTERY_THRESHOLD = {
  LOW: 20,
  CRITICAL: 10
};

export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  HEALTHY: 'healthy',
  ATTENTION: 'attention',
  CRITICAL: 'critical'
} as const;

export const ANIMAL_TYPES = {
  CATTLE: 'cattle',
  SHEEP: 'sheep',
  GOAT: 'goat'
} as const;

export const ALERT_TYPES = {
  ESCAPE: 'escape',
  BATTERY: 'battery',
  HEALTH: 'health',
  MOVEMENT: 'movement'
} as const;

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;