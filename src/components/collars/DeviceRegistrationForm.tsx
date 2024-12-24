import React from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';
import { QrCode } from 'lucide-react';

interface DeviceRegistrationData {
  accountName: string;
  accountPassword: string;
  confirmPassword: string;
  imei: string;
  devicePassword: string;
}

interface DeviceRegistrationFormProps {
  onSubmit: (data: DeviceRegistrationData) => Promise<void>;
  onCancel: () => void;
}

export default function DeviceRegistrationForm({ onSubmit, onCancel }: DeviceRegistrationFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<DeviceRegistrationData>();
  const password = watch('accountPassword');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nom du compte"
        registration={createFormConfig(register, 'accountName', {
          required: 'Le nom du compte est requis'
        })}
        error={errors.accountName?.message}
      />

      <FormInput
        label="Mot de passe du compte"
        type="password"
        registration={createFormConfig(register, 'accountPassword', {
          required: 'Le mot de passe est requis',
          minLength: {
            value: 6,
            message: 'Le mot de passe doit contenir au moins 6 caractères'
          },
          maxLength: {
            value: 12,
            message: 'Le mot de passe ne doit pas dépasser 12 caractères'
          },
          pattern: {
            value: /^[a-zA-Z0-9]*$/,
            message: 'Pas de symboles spéciaux autorisés'
          }
        })}
        error={errors.accountPassword?.message}
      />

      <FormInput
        label="Confirmez le mot de passe"
        type="password"
        registration={createFormConfig(register, 'confirmPassword', {
          required: 'Veuillez confirmer le mot de passe',
          validate: value => value === password || 'Les mots de passe ne correspondent pas'
        })}
        error={errors.confirmPassword?.message}
      />

      <div className="space-y-2">
        <FormInput
          label="Numéro IMEI"
          registration={createFormConfig(register, 'imei', {
            required: 'Le numéro IMEI est requis',
            pattern: {
              value: /^\d{15}$/,
              message: 'Le numéro IMEI doit contenir 15 chiffres'
            }
          })}
          error={errors.imei?.message}
        />
        
        <button
          type="button"
          className="inline-flex items-center text-sm text-yellow-600 hover:text-yellow-700"
          onClick={() => {/* TODO: Implement QR code scanner */}}
        >
          <QrCode className="h-4 w-4 mr-1" />
          Scanner le QR code
        </button>
      </div>

      <FormInput
        label="Mot de passe de l'appareil"
        type="password"
        registration={createFormConfig(register, 'devicePassword', {
          required: 'Le mot de passe de l\'appareil est requis'
        })}
        error={errors.devicePassword?.message}
      />

      <div className="flex justify-end space-x-2 pt-4">
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