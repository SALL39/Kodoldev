import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { formatCoordinate } from '../../../utils/map/formatting';

interface DeviceMarkerProps {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  isSelected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function DeviceMarker({ 
  id, 
  name, 
  position, 
  isSelected, 
  onClick, 
  onClose 
}: DeviceMarkerProps) {
  return (
    <>
      <Marker
        position={position}
        title={name}
        onClick={onClick}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#EAB308',
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
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-yellow-600" />
              <h3 className="font-semibold">{name}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {formatCoordinate(position.lat)}, {formatCoordinate(position.lng)}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}