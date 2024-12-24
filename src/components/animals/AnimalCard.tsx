import React from 'react';
import { Battery, Activity } from 'lucide-react';
import type { Animal } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import CollarLocation from './CollarLocation';

const healthStatusColors = {
  healthy: 'bg-green-100 text-green-800',
  attention: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

interface AnimalCardProps {
  animal: Animal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
          <p className="text-sm text-gray-500">ID: {animal.tag_id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Battery className="h-4 w-4 text-gray-400 mr-1" />
            <span className={`text-sm ${
              animal.battery_level < 20 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {animal.battery_level}%
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            healthStatusColors[animal.health_status]
          }`}>
            {animal.health_status}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Type</span>
          <span className="text-gray-900">{animal.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Genre</span>
          <span className="text-gray-900">{animal.gender}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date de naissance</span>
          <span className="text-gray-900">{formatDate(animal.birth_date)}</span>
        </div>
      </div>

      <CollarLocation animal={animal} />
    </div>
  );
}