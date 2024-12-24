import React, { useState } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript } from '@react-google-maps/api';
import { parseLocation } from '../../utils/map/formatting';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from '../../utils/map/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import AnimalMarker from './markers/AnimalMarker';
import DeviceMarker from './markers/DeviceMarker';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface MapProps {
  locations: Array<{
    id: string;
    name: string;
    location: [number, number] | string;
    type: 'animal' | 'device';
  }>;
  className?: string;
}

export default function GoogleMap({ locations = [], className = '' }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Google Maps API key is missing</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      loadingElement={<LoadingSpinner size="large" />}
    >
      <GoogleMapComponent
        mapContainerClassName={`w-full h-full ${className}`}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={{
          styles: MAP_STYLES.silver,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {locations.map(({ id, name, location, type }) => {
          const parsedLocation = parseLocation(location);
          if (!parsedLocation) return null;

          const position = { 
            lat: parsedLocation[0], 
            lng: parsedLocation[1] 
          };

          const MarkerComponent = type === 'device' ? DeviceMarker : AnimalMarker;

          return (
            <MarkerComponent
              key={id}
              id={id}
              name={name}
              position={position}
              isSelected={selectedMarker === id}
              onClick={() => setSelectedMarker(id)}
              onClose={() => setSelectedMarker(null)}
            />
          );
        })}
      </GoogleMapComponent>
    </LoadScript>
  );
}