import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Alerts from './pages/alerts/Alerts';
import VocalAlerts from './pages/alerts/VocalAlerts';
import Herds from './pages/herds/Herds';
import Map from './pages/map/Map';
import Devices from './pages/devices/Devices';
import Settings from './pages/settings/Settings';
import HealthRecords from './pages/health/HealthRecords';
import HealthRecordDetails from './pages/health/HealthRecordDetails';
import NewAnimal from './pages/animals/NewAnimal';
import Login from './pages/auth/Login';
import AuthRequired from './components/auth/AuthRequired';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './contexts/toast';
import './i18n';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <AuthRequired>
                <Layout />
              </AuthRequired>
            }>
              <Route index element={<Dashboard />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="vocal-alerts" element={<VocalAlerts />} />
              <Route path="herds" element={<Herds />} />
              <Route path="map" element={<Map />} />
              <Route path="devices" element={<Devices />} />
              <Route path="health-records" element={<HealthRecords />} />
              <Route path="health-records/:id" element={<HealthRecordDetails />} />
              <Route path="animals/new" element={<NewAnimal />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}