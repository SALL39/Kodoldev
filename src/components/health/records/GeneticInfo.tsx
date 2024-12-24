import React from 'react';
import { Dna } from 'lucide-react';
import type { GeneticInfo as GeneticInfoType } from '../../../types/healthRecord';

interface GeneticInfoProps {
  info: GeneticInfoType;
}

export default function GeneticInfo({ info }: GeneticInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Dna className="h-5 w-5 text-yellow-600" />
        <h4 className="font-medium text-gray-900">Information génétique</h4>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Race</dt>
            <dd className="text-sm font-medium text-gray-900">{info.breed}</dd>
          </div>
          
          {info.birth_weight && (
            <div>
              <dt className="text-sm text-gray-500">Poids à la naissance</dt>
              <dd className="text-sm font-medium text-gray-900">{info.birth_weight} kg</dd>
            </div>
          )}
          
          {info.father_tag_id && (
            <div>
              <dt className="text-sm text-gray-500">ID du père</dt>
              <dd className="text-sm font-medium text-gray-900">{info.father_tag_id}</dd>
            </div>
          )}
          
          {info.mother_tag_id && (
            <div>
              <dt className="text-sm text-gray-500">ID de la mère</dt>
              <dd className="text-sm font-medium text-gray-900">{info.mother_tag_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}