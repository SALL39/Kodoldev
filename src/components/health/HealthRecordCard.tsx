import React from 'react';
import { Edit2 } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import HealthRecordSummary from './HealthRecordSummary';
import type { HealthRecord } from '../../types/healthRecord';

interface HealthRecordCardProps {
  healthRecord: HealthRecord;
  animalName: string;
  animalTagId: string;
  onEdit: () => void;
}

export default function HealthRecordCard({ 
  healthRecord, 
  animalName, 
  animalTagId,
  onEdit 
}: HealthRecordCardProps) {
  const qrValue = `${window.location.origin}/health-records/${healthRecord.id}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{animalName}</h3>
          <p className="text-sm text-gray-500">ID: {animalTagId}</p>
        </div>
        <QRCodeDisplay value={qrValue} />
      </div>

      <HealthRecordSummary healthRecord={healthRecord} />

      <button
        onClick={onEdit}
        className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Modifier le carnet de santé
      </button>
    </div>
  );
}