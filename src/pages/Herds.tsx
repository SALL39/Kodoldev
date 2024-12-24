import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

export default function Herds() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader 
        title={t('dashboard.herds')} 
        icon={Users} 
        iconColor="text-blue-500" 
      />
      <Card>
        {/* Herd management interface will be implemented here */}
      </Card>
    </div>
  );
}