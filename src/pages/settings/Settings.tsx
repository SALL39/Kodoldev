import React from 'react';
import { Settings as SettingsIcon, User, Bell, Globe, Users } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import ProfileForm from '../../components/settings/ProfileForm';
import NotificationSettings from '../../components/settings/NotificationSettings';
import LanguageSelector from '../../components/settings/LanguageSelector';
import UserManagement from '../../components/settings/UserManagement';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Paramètres" 
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Profil</h2>
            </div>
            <ProfileForm />
          </div>
        </Card>

        {isAdmin && (
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Utilisateurs</h2>
              </div>
              <UserManagement />
            </div>
          </Card>
        )}

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>
            <NotificationSettings />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Langue</h2>
            </div>
            <LanguageSelector />
          </div>
        </Card>
      </div>
    </div>
  );
}