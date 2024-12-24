import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cow } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import AnimalList from '../../components/animals/AnimalList';

export default function Animals() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader 
        title={t('dashboard.animals')} 
        icon={Cow}
        iconColor="text-yellow-500"
      />
      <Card>
        <div className="p-6">
          <AnimalList />
        </div>
      </Card>
    </div>
  );
}