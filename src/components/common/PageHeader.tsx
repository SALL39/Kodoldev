import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function PageHeader({ title, icon: Icon, iconColor = 'text-gray-500' }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <h1 className="text-2xl font-semibold text-gray-900">
        {title}
      </h1>
    </div>
  );
}