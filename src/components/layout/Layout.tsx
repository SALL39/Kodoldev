import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Bell,
  Volume2,
  Users, 
  Map, 
  Settings,
  MapPin,
  FileText,
  Plus
} from 'lucide-react';
import UserMenu from './UserMenu';
import NotificationBell from '../notifications/NotificationBell';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const navigation = [
    { name: t('dashboard.title'), href: '/', icon: LayoutDashboard },
    { name: t('dashboard.alerts'), href: '/alerts', icon: Bell },
    ...(isAdmin ? [{ name: 'Alertes vocales', href: '/vocal-alerts', icon: Volume2 }] : []),
    { name: t('dashboard.herds'), href: '/herds', icon: Users },
    { name: 'Carte', href: '/map', icon: Map },
    { name: 'Appareils GPS', href: '/devices', icon: MapPin },
    { name: 'Carnets de santé', href: '/health-records', icon: FileText },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              <Logo />
              <NotificationBell />
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-2 pb-4">
                <Link
                  to="/animals/new"
                  className="flex items-center w-full px-2 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="mr-3 h-5 w-5" />
                  Ajouter un animal
                </Link>
              </div>

              <UserMenu />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}