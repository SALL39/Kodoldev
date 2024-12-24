import React from 'react';
import { Battery, MapPin, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../../hooks/useToast';
import NotificationItem from './NotificationItem';

const notifications = [
  {
    id: 'notify_low_battery',
    label: 'Batterie faible',
    description: 'Notifications lorsque la batterie d\'un appareil est faible',
    icon: Battery,
  },
  {
    id: 'notify_escape',
    label: 'Sortie de zone',
    description: 'Notifications lorsqu\'un animal sort de sa zone habituelle',
    icon: MapPin,
  },
  {
    id: 'notify_health',
    label: 'Alertes santé',
    description: 'Notifications sur l\'état de santé des animaux',
    icon: AlertTriangle,
  },
];

export default function NotificationSettings() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const handleToggle = async (id: string) => {
    try {
      await updateSettings({ [id]: !settings[id] });
      showToast('success', 'Préférences mises à jour');
    } catch (error) {
      showToast('error', 'Erreur lors de la mise à jour des préférences');
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          enabled={settings[notification.id]}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}