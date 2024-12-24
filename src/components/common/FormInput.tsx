import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  type?: 'text' | 'tel' | 'email' | 'password' | 'number';
  error?: string;
  registration: UseFormRegisterReturn;
}

export default function FormInput({ 
  label, 
  type = 'text', 
  error, 
  registration 
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        {...registration}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}