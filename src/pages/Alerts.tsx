import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import AlertList from '../components/alerts/AlertList';

export default function Alerts() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader 
        title={t('dashboard.alerts')} 
        icon={AlertTriangle} 
        iconColor="text-red-500" 
      />
      <Card>
        <AlertList />
      </Card>
    </div>
  );
}