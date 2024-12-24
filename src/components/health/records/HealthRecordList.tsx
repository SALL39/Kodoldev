import React from 'react';
import { useHealthRecords } from '../../../hooks/useHealthRecords';
import HealthRecordCard from './HealthRecordCard';
import LoadingSpinner from '../../common/LoadingSpinner';
import EmptyState from '../../common/EmptyState';
import { FileText } from 'lucide-react';

interface HealthRecordListProps {
  animalId: string;
  animalName: string;
  animalTagId: string;
  onEdit: () => void;
}

export default function HealthRecordList({
  animalId,
  animalName,
  animalTagId,
  onEdit,
}: HealthRecordListProps) {
  const { records, loading, error } = useHealthRecords(animalId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!records || records.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Aucun carnet de santé"
        description="Créez un carnet de santé pour cet animal"
        action={{
          label: "Créer un carnet",
          onClick: onEdit
        }}
      />
    );
  }

  return (
    <HealthRecordCard
      healthRecord={records[0]}
      animalName={animalName}
      animalTagId={animalTagId}
      onEdit={onEdit}
    />
  );
}