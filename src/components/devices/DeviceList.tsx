import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';
import DeviceCard from './DeviceCard';
import DeviceRegistrationModal from './DeviceRegistrationModal';
import SearchInput from '../common/SearchInput';
import LoadingSpinner from '../common/LoadingSpinner';

export default function DeviceList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { devices, loading, error, registerDevice } = useDevices();

  const filteredDevices = devices.filter(device => 
    device.account_name.toLowerCase().includes(search.toLowerCase()) ||
    device.imei.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeviceRegistration = async (data: any) => {
    try {
      await registerDevice(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to register device:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un appareil..."
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un appareil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {search ? 'Aucun appareil trouvé' : 'Aucun appareil enregistré'}
        </div>
      )}

      <DeviceRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDeviceRegistration}
      />
    </div>
  );
}