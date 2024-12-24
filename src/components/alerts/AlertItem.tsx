import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Battery, Activity, Map } from 'lucide-react';
import type { Alert } from '../../types';

interface AlertItemProps {
  alert: Alert;
  onMarkAsRead: (id: string) => Promise<void>;
}

const alertTypeIcons = {
  escape: Map,
  battery: Battery,
  health: Activity,
  movement: Bell,
};

const alertSeverityColors = {
  low: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  medium: 'bg-orange-50 text-orange-800 border-orange-200',
  high: 'bg-red-50 text-red-800 border-red-200',
};

export default function AlertItem({ alert, onMarkAsRead }: AlertItemProps) {
  const { t } = useTranslation();
  const Icon = alertTypeIcons[alert.type];

  return (
    <div className={`p-4 ${!alert.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${alertSeverityColors[alert.severity]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {alert.animal?.name} ({alert.animal?.tag_id})
            </p>
            <span className="text-xs text-gray-500">
              {new Date(alert.created_at).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
          {!alert.read && (
            <button
              onClick={() => onMarkAsRead(alert.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Marquer comme lu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}