import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import HerdList from '../../components/herds/HerdList';

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
        <div className="p-6">
          <HerdList />
        </div>
      </Card>
    </div>
  );
}