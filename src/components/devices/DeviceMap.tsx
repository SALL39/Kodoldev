import React from 'react';
import MapContainer from '../map/MapContainer';
import type { Device } from '../../types/device';

interface DeviceMapProps {
  devices: Device[];
  className?: string;
}

export default function DeviceMap({ devices, className }: DeviceMapProps) {
  const locations = devices
    .filter(device => device.last_location)
    .map(device => ({
      id: device.id,
      name: device.account_name,
      location: device.last_location!
    }));

  return <MapContainer locations={locations} className={className} />;
}