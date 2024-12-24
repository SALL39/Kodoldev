import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import HealthRecordList from '../../components/health/records/HealthRecordList';
import HealthRecordModal from '../../components/health/HealthRecordModal';
import QRCodeButton from '../../components/health/QRCodeButton';
import { useAnimals } from '../../hooks/useAnimals';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import type { HealthRecord } from '../../types/healthRecord';

export default function HealthRecords() {
  const [search, setSearch] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { animals, loading: loadingAnimals, error: animalError } = useAnimals();
  const { createHealthRecord, updateHealthRecord } = useHealthRecords(selectedAnimal || undefined);

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(search.toLowerCase()) ||
    animal.tag_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditRecord = (animalId: string) => {
    setSelectedAnimal(animalId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<HealthRecord>) => {
    try {
      if (selectedAnimal) {
        if (data.id) {
          await updateHealthRecord(data.id, data);
        } else {
          await createHealthRecord({ ...data, animal_id: selectedAnimal });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save health record:', error);
    }
  };

  if (loadingAnimals) {
    return (
      <div>
        <PageHeader title="Carnets de santé" icon={FileText} iconColor="text-yellow-500" />
        <div className="flex justify-center mt-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (animalError) {
    return (
      <div>
        <PageHeader title="Carnets de santé" icon={FileText} iconColor="text-yellow-500" />
        <div className="text-red-500 text-center mt-8">
          Une erreur est survenue lors du chargement des animaux
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
          title="Carnets de santé" 
          icon={FileText}
          iconColor="text-yellow-500"
        />
        <QRCodeButton />
      </div>

      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un animal..."
        />
      </div>

      {animals.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="Aucun animal enregistré"
            description="Ajoutez d'abord des animaux pour créer leurs carnets de santé"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <Card key={animal.id}>
              <div className="p-4">
                <HealthRecordList
                  animalId={animal.id}
                  animalName={animal.name}
                  animalTagId={animal.tag_id}
                  onEdit={() => handleEditRecord(animal.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredAnimals.length === 0 && animals.length > 0 && (
        <Card>
          <div className="text-center text-gray-500 py-8">
            Aucun animal trouvé
          </div>
        </Card>
      )}

      <HealthRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnimal(null);
        }}
        onSubmit={handleSubmit}
        title="Modifier le carnet de santé"
      />
    </div>
  );
}