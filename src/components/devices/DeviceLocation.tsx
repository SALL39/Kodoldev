import React, { useState } from 'react';
import { MapPin, Edit2, ExternalLink } from 'lucide-react';
import DeviceLocationForm from './DeviceLocationForm';
import { useDevices } from '../../hooks/useDevices';
import Modal from '../common/Modal';
import { parseLocation, formatCoordinate, isValidLocation } from '../../utils/map';
import MapContainer from '../map/MapContainer';

interface DeviceLocationProps {
  deviceId: string;
  imei: string;
  name: string;
  lastLocation?: [number, number] | string;
}

export default function DeviceLocation({ deviceId, imei, name, lastLocation }: DeviceLocationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { updateDeviceLocation } = useDevices();
  
  const parsedLocation = parseLocation(lastLocation);

  const handleSubmit = async (data: { latitude: number; longitude: number }) => {
    try {
      await updateDeviceLocation(imei, [data.latitude, data.longitude]);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const openGoogleMaps = () => {
    if (parsedLocation) {
      window.open(
        `https://www.google.com/maps?q=${parsedLocation[0]},${parsedLocation[1]}`,
        '_blank'
      );
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Position actuelle</span>
        </div>
        <div className="flex items-center space-x-2">
          {parsedLocation && (
            <button
              onClick={openGoogleMaps}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Ouvrir dans Google Maps"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {parsedLocation && isValidLocation(parsedLocation) ? (
        <>
          <p className="mt-1 text-sm text-gray-900 cursor-pointer hover:text-yellow-600"
             onClick={() => setShowMap(true)}>
            {formatCoordinate(parsedLocation[0])}, {formatCoordinate(parsedLocation[1])}
          </p>
        </>
      ) : (
        <p className="mt-1 text-sm text-gray-500 italic">
          Aucune position enregistrée
        </p>
      )}

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Modifier la position"
      >
        <div className="p-4">
          <DeviceLocationForm
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        title="Position sur la carte"
      >
        <div className="p-4">
          <div className="h-96">
            <MapContainer
              locations={[{
                id: deviceId,
                name,
                location: lastLocation!
              }]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}