import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, Users, Battery } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/stats/StatCard';
import ActivityList from '../../components/activity/ActivityList';
import Card from '../../components/common/Card';
import { useStats } from '../../hooks/useStats';

export default function Dashboard() {
  const { t } = useTranslation();
  const { activeAnimals, alerts, herds, lowBattery, loading, error } = useStats();

  const stats = [
    {
      name: 'Animaux actifs',
      value: activeAnimals,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: t('dashboard.alerts'),
      value: alerts,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      name: t('dashboard.herds'),
      value: herds,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Batterie faible',
      value: lowBattery,
      icon: Battery,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div>
      <PageHeader 
        title={t('dashboard.title')} 
        icon={Activity}
        iconColor="text-green-500"
      />

      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.name}
              name={stat.name}
              value={loading ? '-' : stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Card>
          <div className="p-6">
            <ActivityList />
          </div>
        </Card>
      </div>
    </div>
  );
}