import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { updateUserProfile } from '../../lib/database';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';

interface ProfileFormData {
  full_name: string;
  phone_number: string;
}

const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export default function ProfileForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile(user!.id, data);
      showToast('success', 'Profil mis à jour avec succès');
    } catch (error) {
      showToast('error', 'Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nom complet"
        registration={createFormConfig(register, 'full_name', {
          required: true,
          minLength: 2,
          maxLength: 50
        })}
        error={errors.full_name?.message}
      />

      <FormInput
        label="Numéro de téléphone"
        type="tel"
        registration={createFormConfig(register, 'phone_number', {
          pattern: PHONE_REGEX
        })}
        error={errors.phone_number?.message}
      />

      <div className="flex justify-end">
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