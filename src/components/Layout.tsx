import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Bell, 
  Users, 
  Map, 
  Settings,
  Sun
} from 'lucide-react';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: t('dashboard.title'), href: '/', icon: LayoutDashboard },
    { name: t('dashboard.alerts'), href: '/alerts', icon: Bell },
    { name: t('dashboard.herds'), href: '/herds', icon: Users },
    { name: 'Carte', href: '/map', icon: Map },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold">Kodol</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={\`group flex items-center px-2 py-2 text-sm font-medium rounded-md \${
                        isActive
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }\`}
                    >
                      <item.icon
                        className={\`mr-3 h-5 w-5 \${
                          isActive ? 'text-yellow-500' : 'text-gray-400'
                        }\`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
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