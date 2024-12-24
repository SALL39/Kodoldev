import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../../hooks/useToast';
import FormInput from '../common/FormInput';
import { createFormConfig } from '../../hooks/useForm';
import { useForm } from 'react-hook-form';

interface NewUserFormData {
  email: string;
  role: 'user' | 'admin';
}

export default function UserManagement() {
  const { users, createUser } = useUsers();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewUserFormData>({
    defaultValues: {
      role: 'user'
    }
  });

  const handleCreateUser = async (data: NewUserFormData) => {
    try {
      await createUser(data.email, data.role);
      reset();
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestion des utilisateurs</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
        >
          Ajouter un utilisateur
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4 bg-gray-50 p-4 rounded-md">
          <FormInput
            label="Email"
            type="email"
            registration={createFormConfig(register, 'email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide'
              }
            })}
            error={errors.email?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Rôle: {user.user_role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}