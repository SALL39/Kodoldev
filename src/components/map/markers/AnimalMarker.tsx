import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { formatCoordinate } from '../../../utils/map/formatting';

interface AnimalMarkerProps {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  isSelected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function AnimalMarker({ 
  id, 
  name, 
  position, 
  isSelected, 
  onClick, 
  onClose 
}: AnimalMarkerProps) {
  return (
    <>
      <Marker
        position={position}
        title={name}
        onClick={onClick}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4A5568',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }}
      />
      {isSelected && (
        <InfoWindow
          position={position}
          onCloseClick={onClose}
        >
          <div className="p-2">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-gray-600">
              {formatCoordinate(position.lat)}, {formatCoordinate(position.lng)}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}