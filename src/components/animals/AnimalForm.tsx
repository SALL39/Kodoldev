import React from 'react';
import { useForm } from 'react-hook-form';
import { useHerds } from '../../hooks/useHerds';
import type { Animal } from '../../types';

type AnimalFormData = Omit<Animal, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'last_location'>;

interface AnimalFormProps {
  onSubmit: (data: AnimalFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<AnimalFormData>;
}

export default function AnimalForm({ onSubmit, onCancel, initialData }: AnimalFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AnimalFormData>({
    defaultValues: {
      name: '',
      type: 'cattle',
      tag_id: '',
      birth_date: '',
      gender: 'female',
      battery_level: 100,
      health_status: 'healthy',
      ...initialData,
    },
  });

  const { herds } = useHerds();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tag_id" className="block text-sm font-medium text-gray-700">
            Identifiant
          </label>
          <input
            type="text"
            {...register('tag_id', { required: "L'identifiant est requis" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          {errors.tag_id && (
            <p className="mt-1 text-sm text-red-600">{errors.tag_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="cattle">Bovin</option>
            <option value="sheep">Mouton</option>
            <option value="goat">Chèvre</option>
          </select>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            {...register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="female">Femelle</option>
            <option value="male">Mâle</option>
          </select>
        </div>

        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
            Date de naissance
          </label>
          <input
            type="date"
            {...register('birth_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label htmlFor="herd_id" className="block text-sm font-medium text-gray-700">
            Troupeau
          </label>
          <select
            {...register('herd_id', { required: 'Le troupeau est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            {herds.map((herd) => (
              <option key={herd.id} value={herd.id}>
                {herd.name}
              </option>
            ))}
          </select>
          {errors.herd_id && (
            <p className="mt-1 text-sm text-red-600">{errors.herd_id.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}