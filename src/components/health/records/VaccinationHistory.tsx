import React from 'react';
import { Syringe } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import type { VaccinationEntry } from '../../../types/healthRecord';

interface VaccinationHistoryProps {
  vaccinations?: VaccinationEntry[];
}

export default function VaccinationHistory({ vaccinations = [] }: VaccinationHistoryProps) {
  if (!vaccinations || vaccinations.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Vaccinations</h4>
        <p className="text-sm text-gray-500 italic">Aucune vaccination enregistrée</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Syringe className="h-5 w-5 text-yellow-600" />
        <h4 className="font-medium text-gray-900">Vaccinations</h4>
      </div>

      <div className="space-y-3">
        {vaccinations.map((vaccination) => (
          <div key={vaccination.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{vaccination.name}</h4>
                <p className="text-sm text-gray-500">
                  Par {vaccination.veterinarian} le {formatDate(vaccination.date)}
                </p>
              </div>
              {vaccination.next_date && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Prochain: {formatDate(vaccination.next_date)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}