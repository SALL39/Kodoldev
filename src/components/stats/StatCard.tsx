import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatCard({ name, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
      <dt>
        <div className={`absolute rounded-md ${bgColor} p-3`}>
          <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">
          {name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </dd>
    </div>
  );
}