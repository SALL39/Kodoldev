import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

interface Device {
  imei: string;
  account_name: string;
  last_location: [number, number];
  battery_level: number;
}

interface DeviceMarkerProps {
  device: Device;
}

const deviceIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #EAB308;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function DeviceMarker({ device }: DeviceMarkerProps) {
  if (!device.last_location) return null;

  return (
    <Marker
      position={device.last_location}
      icon={deviceIcon}
    >
      <Popup>
        <div className="p-2">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-yellow-600" />
            <h3 className="font-semibold">{device.account_name}</h3>
          </div>
          <p className="text-sm text-gray-600">IMEI: {device.imei}</p>
          <p className="text-sm text-gray-600">
            Batterie: {device.battery_level}%
          </p>
        </div>
      </Popup>
    </Marker>
  );
}