import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'bm', name: 'Bamanankan' },
  { code: 'ff', name: 'Fulfulde' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <Globe className="h-5 w-5 text-gray-400" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}