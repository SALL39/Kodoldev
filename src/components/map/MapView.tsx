import React from 'react';
import { useHerdLocations } from '../../hooks/useHerdLocations';
import { useDeviceLocations } from '../../hooks/useDeviceLocations';
import LoadingSpinner from '../common/LoadingSpinner';
import MapContainer from './MapContainer';

export default function MapView() {
  const { locations: animalLocations, loading: loadingAnimals, error: animalError } = useHerdLocations();
  const { locations: deviceLocations, loading: loadingDevices, error: deviceError } = useDeviceLocations();

  if (loadingAnimals || loadingDevices) {
    return <LoadingSpinner size="large" className="mt-8" />;
  }

  if (animalError || deviceError) {
    return (
      <div className="text-red-500 text-center p-4">
        Une erreur est survenue lors du chargement de la carte
      </div>
    );
  }

  const mapLocations = [
    ...(animalLocations || []).map(loc => ({
      id: loc.id,
      name: loc.animal?.name || 'Unknown',
      location: loc.position,
      type: 'animal'
    })),
    ...(deviceLocations || []).map(loc => ({
      id: loc.id,
      name: loc.device_id,
      location: loc.position,
      type: 'device'
    }))
  ];

  return (
    <div className="h-[600px]">
      <MapContainer locations={mapLocations} />
    </div>
  );
}