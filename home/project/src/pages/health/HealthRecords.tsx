import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import HealthRecordList from '../../components/health/HealthRecordList';
import HealthRecordModal from '../../components/health/HealthRecordModal';
import { useAnimals } from '../../hooks/useAnimals';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import SearchInput from '../../components/common/SearchInput';
import type { HealthRecord } from '../../types/healthRecord';

export default function HealthRecords() {
  const [search, setSearch] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { animals } = useAnimals();
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

  return (
    <div>
      <PageHeader 
        title="Carnets de santé" 
        icon={FileText}
        iconColor="text-yellow-500"
      />

      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un animal..."
        />
      </div>

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

      {filteredAnimals.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Aucun animal trouvé
        </div>
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