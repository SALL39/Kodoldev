import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

export default function Settings() {
  return (
    <div>
      <PageHeader 
        title="Paramètres" 
        icon={SettingsIcon} 
      />
      <Card>
        {/* Settings interface will be implemented here */}
      </Card>
    </div>
  );
}