import L from 'leaflet';
import type { MapPosition } from './types';

const markerColors = {
  animal: '#4A5568', // gray
  device: '#EAB308', // yellow
};

export function getMarkerIcon(type: 'animal' | 'device' = 'animal') {
  const color = markerColors[type];
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export function getMarkerPosition(location: [number, number]): MapPosition {
  return {
    lat: location[0],
    lng: location[1]
  };
}