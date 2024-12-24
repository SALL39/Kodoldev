import React from 'react';
import { Syringe } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import type { VaccinationEntry } from '../../types/healthRecord';

interface VaccinationHistoryProps {
  vaccinations: VaccinationEntry[];
  onAdd: () => void;
}

export default function VaccinationHistory({ vaccinations, onAdd }: VaccinationHistoryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Historique des vaccinations</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
        >
          <Syringe className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      {vaccinations.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucune vaccination enregistrée</p>
      ) : (
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
      )}
    </div>
  );
}