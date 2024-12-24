import React from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';

interface LocationFormData {
  latitude: number;
  longitude: number;
}

interface DeviceLocationFormProps {
  onSubmit: (data: LocationFormData) => Promise<void>;
  onCancel: () => void;
}

export default function DeviceLocationForm({ onSubmit, onCancel }: DeviceLocationFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LocationFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Latitude"
          type="number"
          registration={createFormConfig(register, 'latitude', {
            required: 'La latitude est requise',
            validate: (value) => 
              (value >= -90 && value <= 90) || 'La latitude doit être entre -90 et 90'
          })}
          error={errors.latitude?.message}
        />

        <FormInput
          label="Longitude"
          type="number"
          registration={createFormConfig(register, 'longitude', {
            required: 'La longitude est requise',
            validate: (value) => 
              (value >= -180 && value <= 180) || 'La longitude doit être entre -180 et 180'
          })}
          error={errors.longitude?.message}
        />
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