import React from 'react';
import { useTranslation } from 'react-i18next';
import AlertItem from './AlertItem';
import { useAlerts } from '../../hooks/useAlerts';

export default function AlertList() {
  const { t } = useTranslation();
  const { alerts, loading, error, markAsRead } = useAlerts();

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Chargement des alertes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Aucune alerte
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {alerts.map(alert => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
}