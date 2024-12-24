import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

export default function Map() {
  return (
    <div>
      <PageHeader 
        title="Carte" 
        icon={MapIcon} 
        iconColor="text-green-500" 
      />
      <Card className="h-[600px]">
        {/* Interactive map will be implemented here */}
      </Card>
    </div>
  );
}