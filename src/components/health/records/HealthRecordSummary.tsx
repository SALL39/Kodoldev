import React from 'react';
import { Calendar, Activity, Dna } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import type { HealthRecord } from '../../../types/healthRecord';

interface HealthRecordSummaryProps {
  healthRecord: HealthRecord;
}

export default function HealthRecordSummary({ healthRecord }: HealthRecordSummaryProps) {
  const lastVaccination = healthRecord?.vaccination_history?.[0];
  const lastMedicalEntry = healthRecord?.medical_history?.[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-yellow-600" />
        <div>
          <span className="text-sm font-medium">Dernière vaccination:</span>
          <p className="text-sm text-gray-600">
            {lastVaccination ? (
              <>
                {lastVaccination.name} - {formatDate(lastVaccination.date)}
                {lastVaccination.next_date && (
                  <span className="ml-2 text-yellow-600">
                    (Prochain: {formatDate(lastVaccination.next_date)})
                  </span>
                )}
              </>
            ) : (
              'Aucune vaccination'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-yellow-600" />
        <div>
          <span className="text-sm font-medium">Dernier contrôle:</span>
          <p className="text-sm text-gray-600">
            {lastMedicalEntry ? (
              <>{lastMedicalEntry.description} - {formatDate(lastMedicalEntry.date)}</>
            ) : (
              'Aucun contrôle'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dna className="h-5 w-5 text-yellow-600" />
        <div>
          <span className="text-sm font-medium">Race:</span>
          <p className="text-sm text-gray-600">
            {healthRecord?.genetic_info?.breed || 'Non spécifiée'}
          </p>
        </div>
      </div>
    </div>
  );
}