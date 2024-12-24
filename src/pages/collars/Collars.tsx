import React from 'react';
import { MapPin } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import CollarList from '../../components/collars/CollarList';

export default function Collars() {
  return (
    <div>
      <PageHeader 
        title="Colliers GPS" 
        icon={MapPin}
        iconColor="text-yellow-500"
      />
      <Card>
        <div className="p-6">
          <CollarList />
        </div>
      </Card>
    </div>
  );
}