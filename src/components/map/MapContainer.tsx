import React from 'react';
import { useMapConfig } from './hooks/useMapConfig';
import { useMapMarkers } from './hooks/useMapMarkers';
import GoogleMap from './GoogleMap';
import LeafletMap from './LeafletMap';
import type { MapLocation } from '../../types/map';

interface MapContainerProps {
  locations: MapLocation[];
  className?: string;
  provider?: 'google' | 'leaflet';
}

export default function MapContainer({ 
  locations = [], 
  className = '',
  provider = 'leaflet'
}: MapContainerProps) {
  const { selectedMarker, handleMarkerClick, handleMarkerClose } = useMapMarkers();
  const mapConfig = useMapConfig();

  const MapComponent = provider === 'google' ? GoogleMap : LeafletMap;

  return (
    <MapComponent
      locations={locations}
      className={className}
      selectedMarker={selectedMarker}
      onMarkerClick={handleMarkerClick}
      onMarkerClose={handleMarkerClose}
      {...mapConfig}
    />
  );
}