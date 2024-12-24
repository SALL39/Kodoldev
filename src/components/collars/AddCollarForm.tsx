import React from 'react';
import { useForm } from 'react-hook-form';
import { useAnimals } from '../../hooks/useAnimals';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';
import type { CollarFormData } from '../../types/collar';

interface AddCollarFormProps {
  onSubmit: (data: CollarFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CollarFormData>;
}

export default function AddCollarForm({ onSubmit, onCancel, initialData }: AddCollarFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CollarFormData>({
    defaultValues: initialData
  });
  const { animals } = useAnimals();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="ID du collier"
        registration={createFormConfig(register, 'tag_id', {
          required: true,
          pattern: /^[A-Za-z0-9-]+$/
        })}
        error={errors.tag_id?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Animal associé (optionnel)
        </label>
        <select
          {...register('animal_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          <option value="">Sélectionner un animal</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name} ({animal.tag_id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="maintenance">En maintenance</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}