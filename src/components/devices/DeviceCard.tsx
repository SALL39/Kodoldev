import React from 'react';
import { Battery, Signal, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import DeviceLocation from './DeviceLocation';
import StatusBadge from '../common/StatusBadge';

interface DeviceProps {
  device: {
    id: string;
    imei: string;
    account_name: string;
    battery_level: number;
    last_location?: [number, number] | string;
    status: 'active' | 'inactive' | 'maintenance';
    updated_at: string;
  };
}

export default function DeviceCard({ device }: DeviceProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{device.account_name}</h3>
          <p className="text-sm text-gray-500">IMEI: {device.imei}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={device.status} />
          <div className="flex items-center">
            <Battery className="h-4 w-4 text-gray-400 mr-1" />
            <span className={`text-sm ${
              device.battery_level < 20 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {device.battery_level}%
            </span>
          </div>
        </div>
      </div>

      <DeviceLocation
        deviceId={device.id}
        imei={device.imei}
        lastLocation={device.last_location}
      />

      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>
            Mis à jour {formatDistanceToNow(new Date(device.updated_at), { addSuffix: true, locale: fr })}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Signal className="h-4 w-4" />
          <span>
            {device.status === 'active' ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
      </div>
    </div>
  );
}