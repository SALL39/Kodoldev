import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAnimals } from '../../../hooks/useAnimals';
import { useHerds } from '../../../hooks/useHerds';
import { useToast } from '../../../hooks/useToast';
import FormInput from '../../common/FormInput';
import { createFormConfig } from '../../../hooks/useForm';
import type { Animal } from '../../../types';

type AnimalFormData = Omit<Animal, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'last_location'>;

export default function AnimalForm() {
  const navigate = useNavigate();
  const { createAnimal } = useAnimals();
  const { herds } = useHerds();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AnimalFormData>();

  const onSubmit = async (data: AnimalFormData) => {
    try {
      await createAnimal(data);
      showToast('success', 'Animal ajouté avec succès');
      navigate('/animals');
    } catch (error) {
      showToast('error', 'Erreur lors de l\'ajout de l\'animal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nom"
          registration={createFormConfig(register, 'name', {
            required: 'Le nom est requis'
          })}
          error={errors.name?.message}
        />

        <FormInput
          label="Identifiant"
          registration={createFormConfig(register, 'tag_id', {
            required: 'L\'identifiant est requis'
          })}
          error={errors.tag_id?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
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
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <select
            {...register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="female">Femelle</option>
            <option value="male">Mâle</option>
          </select>
        </div>

        <FormInput
          label="Date de naissance"
          type="date"
          registration={createFormConfig(register, 'birth_date')}
          error={errors.birth_date?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Troupeau</label>
          <select
            {...register('herd_id', { required: 'Le troupeau est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="">Sélectionner un troupeau</option>
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

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
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