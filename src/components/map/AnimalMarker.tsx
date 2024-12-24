import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { Animal } from '../../types';
import { getMarkerIcon } from '../../utils/mapUtils';

interface AnimalMarkerProps {
  animal: Animal;
}

export default function AnimalMarker({ animal }: AnimalMarkerProps) {
  if (!animal.last_location) return null;

  return (
    <Marker
      position={animal.last_location}
      icon={getMarkerIcon(animal.type)}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{animal.name}</h3>
          <p className="text-sm text-gray-600">ID: {animal.tag_id}</p>
          <p className="text-sm text-gray-600">
            Batterie: {animal.battery_level}%
          </p>
        </div>
      </Popup>
    </Marker>
  );
}