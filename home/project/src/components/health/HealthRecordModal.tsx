import React from 'react';
import Modal from '../common/Modal';
import HealthRecordForm from './HealthRecordForm';
import type { HealthRecord } from '../../types/healthRecord';

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<HealthRecord>) => Promise<void>;
  initialData?: Partial<HealthRecord>;
  title: string;
}

export default function HealthRecordModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: HealthRecordModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4">
        <HealthRecordForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}