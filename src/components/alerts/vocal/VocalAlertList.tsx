import React from 'react';
import { Volume2 } from 'lucide-react';
import { useVocalAlerts } from '../../../hooks/useVocalAlerts';
import { formatRelativeTime } from '../../../utils/dateUtils';
import LoadingSpinner from '../../common/LoadingSpinner';

const alertTypeIcons = {
  vaccination: '💉',
  health: '🏥',
  movement: '🚶',
  system: '⚙️'
};

export default function VocalAlertList() {
  const { alerts, loading, error, markAsPlayed } = useVocalAlerts();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucune alerte vocale
      </div>
    );
  }

  const playAudio = async (alertId: string, audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
      await markAsPlayed(alertId);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{alertTypeIcons[alert.type]}</span>
              <div>
                <h3 className="font-medium text-gray-900">{alert.title}</h3>
                {alert.description && (
                  <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(alert.created_at)}
                </p>
              </div>
            </div>
            <button
              onClick={() => playAudio(alert.id, alert.audio_url)}
              className="p-2 text-yellow-600 hover:text-yellow-700 rounded-full hover:bg-yellow-50"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}