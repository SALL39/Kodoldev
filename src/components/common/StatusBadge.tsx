import React from 'react';

interface StatusConfig {
  label: string;
  className: string;
}

interface StatusMap {
  [key: string]: StatusConfig;
}

const statusStyles: StatusMap = {
  active: {
    label: 'Actif',
    className: 'bg-green-100 text-green-800'
  },
  inactive: {
    label: 'Inactif',
    className: 'bg-gray-100 text-gray-800'
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-yellow-100 text-yellow-800'
  },
  healthy: {
    label: 'En bonne santé',
    className: 'bg-green-100 text-green-800'
  },
  attention: {
    label: 'Attention requise',
    className: 'bg-yellow-100 text-yellow-800'
  },
  critical: {
    label: 'Critique',
    className: 'bg-red-100 text-red-800'
  }
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusStyles[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.className}`}>
      {config.label}
    </span>
  );
}