import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Plus, Edit2 } from 'lucide-react';
import { useHerds } from '../../hooks/useHerds';
import type { Herd } from '../../types';

export default function HerdList() {
  const { t } = useTranslation();
  const { herds, loading, error, createHerd, updateHerd } = useHerds();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingHerd, setEditingHerd] = useState<Herd | null>(null);
  const [newHerdName, setNewHerdName] = useState('');
  const [newHerdDescription, setNewHerdDescription] = useState('');

  const filteredHerds = herds.filter(herd =>
    herd.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateHerd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHerd(newHerdName, newHerdDescription);
      setNewHerdName('');
      setNewHerdDescription('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create herd:', err);
    }
  };

  const handleUpdateHerd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHerd) return;
    
    try {
      await updateHerd(editingHerd.id, {
        name: newHerdName,
        description: newHerdDescription,
      });
      setEditingHerd(null);
      setNewHerdName('');
      setNewHerdDescription('');
    } catch (err) {
      console.error('Failed to update herd:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un troupeau..."
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
          Nouveau troupeau
        </button>
      </div>

      {(isCreating || editingHerd) && (
        <form onSubmit={editingHerd ? handleUpdateHerd : handleCreateHerd} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom du troupeau
            </label>
            <input
              type="text"
              id="name"
              value={newHerdName}
              onChange={(e) => setNewHerdName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={newHerdDescription}
              onChange={(e) => setNewHerdDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingHerd(null);
                setNewHerdName('');
                setNewHerdDescription('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {editingHerd ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredHerds.map((herd) => (
            <li key={herd.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm font-medium text-gray-900">{herd.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingHerd(herd);
                      setNewHerdName(herd.name);
                      setNewHerdDescription(herd.description || '');
                    }}
                    className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                {herd.description && (
                  <p className="mt-2 text-sm text-gray-500">{herd.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}