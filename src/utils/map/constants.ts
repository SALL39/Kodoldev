import type { MapPosition } from './types';

export const DEFAULT_CENTER: MapPosition = { lat: 14.4974, lng: -4.2867 }; // Mali center
export const DEFAULT_ZOOM = 6;
export const COORDINATE_PRECISION = 6;

export const MAP_STYLES = {
  silver: [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    }
  ]
};