import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import AnimalCard from './AnimalCard';
import LoadingSpinner from '../common/LoadingSpinner';
import AnimalForm from './AnimalForm';

export default function AnimalList() {
  const { t } = useTranslation();
  const { animals, loading, error, createAnimal } = useAnimals();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(search.toLowerCase()) ||
    animal.tag_id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un animal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel animal
        </button>
      </div>

      {isCreating && (
        <AnimalForm
          onSubmit={async (data) => {
            await createAnimal(data);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Aucun animal trouvé
        </div>
      )}
    </div>
  );
}