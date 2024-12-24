import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import MapView from '../../components/map/MapView';

export default function Map() {
  return (
    <div>
      <PageHeader 
        title="Carte" 
        icon={MapIcon} 
        iconColor="text-green-500" 
      />
      <Card className="h-[600px]">
        <MapView />
      </Card>
    </div>
  );
}