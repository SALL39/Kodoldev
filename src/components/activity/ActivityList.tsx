import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

export default function ActivityList() {
  const { t } = useTranslation();

  return (
    <div className="flow-root">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Activité récente</h2>
      </div>
      <div className="relative">
        <div className="flex items-center justify-center p-8 text-gray-500">
          <Activity className="h-6 w-6 mr-2" />
          <span>Aucune activité récente</span>
        </div>
      </div>
    </div>
  );
}