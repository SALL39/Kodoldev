import React from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';

interface VaccinationFormData {
  name: string;
  date: string;
  next_date?: string;
  veterinarian: string;
}

interface VaccinationFormProps {
  onSubmit: (data: VaccinationFormData) => void;
  onCancel: () => void;
}

export default function VaccinationForm({ onSubmit, onCancel }: VaccinationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<VaccinationFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nom du vaccin"
        registration={createFormConfig(register, 'name', { required: true })}
        error={errors.name?.message}
      />

      <FormInput
        label="Date"
        type="date"
        registration={createFormConfig(register, 'date', { required: true })}
        error={errors.date?.message}
      />

      <FormInput
        label="Prochaine vaccination (optionnel)"
        type="date"
        registration={createFormConfig(register, 'next_date')}
        error={errors.next_date?.message}
      />

      <FormInput
        label="Vétérinaire"
        registration={createFormConfig(register, 'veterinarian', { required: true })}
        error={errors.veterinarian?.message}
      />

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