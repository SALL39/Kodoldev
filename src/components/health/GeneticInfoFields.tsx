import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import type { HealthRecord } from '../../types/healthRecord';

interface GeneticInfoFieldsProps {
  register: UseFormRegister<Partial<HealthRecord>>;
}

export default function GeneticInfoFields({ register }: GeneticInfoFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          ID du père
        </label>
        <input
          type="text"
          {...register('genetic_info.father_tag_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          ID de la mère
        </label>
        <input
          type="text"
          {...register('genetic_info.mother_tag_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Race
        </label>
        <input
          type="text"
          {...register('genetic_info.breed', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Poids à la naissance (kg)
        </label>
        <input
          type="number"
          step="0.1"
          {...register('genetic_info.birth_weight')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
    </div>
  );
}