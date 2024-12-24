import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

export default function Toggle({ enabled, onChange, label, description }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
        enabled ? 'bg-yellow-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}