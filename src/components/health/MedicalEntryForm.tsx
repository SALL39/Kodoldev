import React from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';

interface MedicalEntryFormData {
  type: 'checkup' | 'treatment' | 'surgery' | 'other';
  date: string;
  description: string;
  veterinarian: string;
  notes?: string;
}

interface MedicalEntryFormProps {
  onSubmit: (data: MedicalEntryFormData) => void;
  onCancel: () => void;
}

export default function MedicalEntryForm({ onSubmit, onCancel }: MedicalEntryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MedicalEntryFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          <option value="checkup">Contrôle</option>
          <option value="treatment">Traitement</option>
          <option value="surgery">Chirurgie</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <FormInput
        label="Date"
        type="date"
        registration={createFormConfig(register, 'date', { required: true })}
        error={errors.date?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: true })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <FormInput
        label="Vétérinaire"
        registration={createFormConfig(register, 'veterinarian', { required: true })}
        error={errors.veterinarian?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes (optionnel)</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}