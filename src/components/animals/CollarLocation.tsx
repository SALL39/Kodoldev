import React, { useState } from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import CollarForm from './CollarForm';
import { useUpdateAnimalLocation } from '../../hooks/useAnimalLocation';
import type { Animal } from '../../types';

interface CollarLocationProps {
  animal: Animal;
}

export default function CollarLocation({ animal }: CollarLocationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateLocation, isUpdating } = useUpdateAnimalLocation();

  const handleSubmit = async (data: { latitude: number; longitude: number }) => {
    try {
      await updateLocation(animal.id, [data.latitude, data.longitude]);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Modifier la position du collier
        </h3>
        <CollarForm
          animal={animal}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Position du collier</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
      {animal.last_location ? (
        <p className="mt-1 text-sm text-gray-900">
          {animal.last_location[0].toFixed(6)}, {animal.last_location[1].toFixed(6)}
        </p>
      ) : (
        <p className="mt-1 text-sm text-gray-500 italic">
          Aucune position enregistrée
        </p>
      )}
    </div>
  );
}