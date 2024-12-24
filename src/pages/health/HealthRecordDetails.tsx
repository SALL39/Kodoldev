import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useHealthRecord } from '../../hooks/useHealthRecord';
import HealthRecordCard from '../../components/health/records/HealthRecordCard';

export default function HealthRecordDetails() {
  const { id } = useParams<{ id: string }>();
  const { record, animal, loading, error } = useHealthRecord(id);

  if (loading) {
    return (
      <div>
        <PageHeader title="Carnet de santé" icon={FileText} iconColor="text-yellow-500" />
        <div className="flex justify-center mt-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error || !record || !animal) {
    return (
      <div>
        <PageHeader title="Carnet de santé" icon={FileText} iconColor="text-yellow-500" />
        <Card>
          <div className="p-6 text-center text-red-500">
            {error || 'Carnet de santé non trouvé'}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Carnet de santé" icon={FileText} iconColor="text-yellow-500" />
      <Card>
        <div className="p-6">
          <HealthRecordCard
            healthRecord={record}
            animalName={animal.name}
            animalTagId={animal.tag_id}
            onEdit={() => {}}
          />
        </div>
      </Card>
    </div>
  );
}