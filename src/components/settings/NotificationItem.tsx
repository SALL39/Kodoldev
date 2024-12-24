import React from 'react';
import { LucideIcon } from 'lucide-react';
import Toggle from '../common/Toggle';

interface NotificationItemProps {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  onToggle: (id: string) => void;
}

export default function NotificationItem({
  id,
  label,
  description,
  icon: Icon,
  enabled,
  onToggle,
}: NotificationItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <Icon className="h-5 w-5 text-gray-400 mt-1" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{label}</h4>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <Toggle
            enabled={enabled}
            onChange={() => onToggle(id)}
            label={label}
          />
        </div>
      </div>
    </div>
  );
}