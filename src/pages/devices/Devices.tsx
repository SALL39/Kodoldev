import React from 'react';
import { MapPin } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import DeviceList from '../../components/devices/DeviceList';

export default function Devices() {
  return (
    <div>
      <PageHeader 
        title="Appareils GPS" 
        icon={MapPin}
        iconColor="text-yellow-500"
      />
      <Card>
        <div className="p-6">
          <DeviceList />
        </div>
      </Card>
    </div>
  );
}