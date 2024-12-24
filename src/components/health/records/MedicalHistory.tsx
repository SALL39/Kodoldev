import React from 'react';
import { Stethoscope } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import type { MedicalEntry } from '../../../types/healthRecord';

interface MedicalHistoryProps {
  entries?: MedicalEntry[];
}

const typeLabels = {
  checkup: 'Contrôle',
  treatment: 'Traitement',
  surgery: 'Chirurgie',
  other: 'Autre'
};

export default function MedicalHistory({ entries = [] }: MedicalHistoryProps) {
  if (!entries || entries.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Historique médical</h4>
        <p className="text-sm text-gray-500 italic">Aucun historique médical enregistré</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="h-5 w-5 text-yellow-600" />
        <h4 className="font-medium text-gray-900">Historique médical</h4>
      </div>

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
    </div>
  );
}