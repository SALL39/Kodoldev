import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUsers } from '../../../hooks/useUsers';
import FormInput from '../../common/FormInput';
import AudioUploader from './AudioUploader';
import { createFormConfig } from '../../../hooks/useForm';

interface VocalAlertFormData {
  title: string;
  description?: string;
  audio_url: string;
  type: 'vaccination' | 'health' | 'movement' | 'system';
  recipient_ids: string[];
}

interface VocalAlertFormProps {
  onSubmit: (data: VocalAlertFormData) => Promise<void>;
  onCancel: () => void;
}

export default function VocalAlertForm({ onSubmit, onCancel }: VocalAlertFormProps) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<VocalAlertFormData>();
  const { users } = useUsers();
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleAudioUpload = (url: string) => {
    setAudioUrl(url);
    setValue('audio_url', url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Titre"
        registration={createFormConfig(register, 'title', {
          required: 'Le titre est requis'
        })}
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Audio</label>
        <AudioUploader onUpload={handleAudioUpload} />
        <input type="hidden" {...register('audio_url', { required: 'L\'audio est requis' })} />
        {errors.audio_url && (
          <p className="mt-1 text-sm text-red-600">{errors.audio_url.message}</p>
        )}
        {audioUrl && (
          <audio controls className="mt-2 w-full">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          <option value="vaccination">Vaccination</option>
          <option value="health">Santé</option>
          <option value="movement">Mouvement</option>
          <option value="system">Système</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Destinataires</label>
        <select
          multiple
          {...register('recipient_ids', { required: 'Sélectionnez au moins un destinataire' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.email}
            </option>
          ))}
        </select>
        {errors.recipient_ids && (
          <p className="mt-1 text-sm text-red-600">{errors.recipient_ids.message}</p>
        )}
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
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}