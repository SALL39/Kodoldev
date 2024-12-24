import React from 'react';
import { Stethoscope } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import type { MedicalEntry } from '../../types/healthRecord';

interface MedicalHistoryProps {
  entries: MedicalEntry[];
  onAdd: () => void;
}

const typeLabels = {
  checkup: 'Contrôle',
  treatment: 'Traitement',
  surgery: 'Chirurgie',
  other: 'Autre'
};

export default function MedicalHistory({ entries, onAdd }: MedicalHistoryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Historique médical</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
        >
          <Stethoscope className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucun historique médical enregistré</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{typeLabels[entry.type]}</h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Par {entry.veterinarian}</p>
                  {entry.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">{entry.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}