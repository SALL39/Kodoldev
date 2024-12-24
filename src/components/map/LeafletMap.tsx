import React from 'react';
import { MapContainer as LeafletMapComponent, TileLayer, Marker, Popup } from 'react-leaflet';
import { getMarkerIcon } from '../../utils/map/markers';
import { parseLocation } from '../../utils/map/formatting';
import type { MapLocation } from '../../types/map';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  locations: MapLocation[];
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  selectedMarker?: string | null;
  onMarkerClick?: (id: string) => void;
  onMarkerClose?: () => void;
}

export default function LeafletMap({ 
  locations,
  center,
  zoom,
  className = '',
  selectedMarker,
  onMarkerClick,
  onMarkerClose
}: LeafletMapProps) {
  return (
    <LeafletMapComponent
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={`w-full h-full ${className}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locations.map(({ id, name, location, type = 'animal' }) => {
        const parsedLocation = parseLocation(location);
        if (!parsedLocation) return null;

        return (
          <Marker 
            key={id} 
            position={parsedLocation}
            icon={getMarkerIcon(type)}
            eventHandlers={{
              click: () => onMarkerClick?.(id)
            }}
          >
            {selectedMarker === id && (
              <Popup onClose={onMarkerClose}>
                <div className="p-2">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-gray-600">
                    {parsedLocation[0].toFixed(6)}, {parsedLocation[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </LeafletMapComponent>
  );
}