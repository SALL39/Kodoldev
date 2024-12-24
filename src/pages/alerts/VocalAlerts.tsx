import React, { useState } from 'react';
import { Volume2, Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import VocalAlertList from '../../components/alerts/vocal/VocalAlertList';
import VocalAlertForm from '../../components/alerts/vocal/VocalAlertForm';
import Modal from '../../components/common/Modal';
import { useVocalAlerts } from '../../hooks/useVocalAlerts';
import { useAuth } from '../../hooks/useAuth';

export default function VocalAlerts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createAlert } = useVocalAlerts();
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      await createAlert({
        title: data.title,
        description: data.description,
        audio_url: data.audio_url,
        type: data.type,
        created_by: user!.id
      }, data.recipient_ids);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create vocal alert:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
          title="Alertes vocales" 
          icon={Volume2}
          iconColor="text-yellow-500"
        />
        {user?.user_metadata?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle alerte
          </button>
        )}
      </div>

      <Card>
        <div className="p-6">
          <VocalAlertList />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle alerte vocale"
      >
        <div className="p-4">
          <VocalAlertForm
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}