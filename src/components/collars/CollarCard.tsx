import React from 'react';
import { Battery, MapPin } from 'lucide-react';
import type { Animal } from '../../types';
import CollarLocation from '../animals/CollarLocation';

interface CollarCardProps {
  animal: Animal;
}

export default function CollarCard({ animal }: CollarCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
          <p className="text-sm text-gray-500">ID: {animal.tag_id}</p>
        </div>
        <div className="flex items-center">
          <Battery className="h-4 w-4 text-gray-400 mr-1" />
          <span className={`text-sm ${
            animal.battery_level < 20 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {animal.battery_level}%
          </span>
        </div>
      </div>

      <CollarLocation animal={animal} />
    </div>
  );
}