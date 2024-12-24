import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import type { HealthRecord } from '../../types/healthRecord';
import GeneticInfoFields from './GeneticInfoFields';
import VaccinationHistory from './VaccinationHistory';
import MedicalHistory from './MedicalHistory';
import Modal from '../common/Modal';
import VaccinationForm from './VaccinationForm';
import MedicalEntryForm from './MedicalEntryForm';

interface HealthRecordFormProps {
  initialData?: Partial<HealthRecord>;
  onSubmit: (data: Partial<HealthRecord>) => Promise<void>;
  onCancel: () => void;
}

const defaultValues: Partial<HealthRecord> = {
  vaccination_history: [],
  medical_history: [],
  genetic_info: { breed: '' },
  veterinarian_info: {
    name: '',
    phone: '',
    clinic: ''
  },
  attachments: [],
  treatment_costs: []
};

export default function HealthRecordForm({
  initialData,
  onSubmit,
  onCancel
}: HealthRecordFormProps) {
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<HealthRecord>({
    defaultValues: {
      ...defaultValues,
      ...initialData
    }
  });

  const vaccinationHistory = watch('vaccination_history') || [];
  const medicalHistory = watch('medical_history') || [];

  const handleAddVaccination = (vaccination: any) => {
    setValue('vaccination_history', [
      { ...vaccination, id: Date.now().toString() },
      ...vaccinationHistory
    ]);
    setIsVaccinationModalOpen(false);
  };

  const handleAddMedicalEntry = (entry: any) => {
    setValue('medical_history', [
      { ...entry, id: Date.now().toString() },
      ...medicalHistory
    ]);
    setIsMedicalModalOpen(false);
  };

  const handleFormSubmit = async (data: HealthRecord) => {
    // Ensure all required structures are present
    const formattedData = {
      ...data,
      veterinarian_info: {
        name: data.veterinarian_info?.name || '',
        phone: data.veterinarian_info?.phone || '',
        clinic: data.veterinarian_info?.clinic || ''
      },
      attachments: data.attachments || [],
      treatment_costs: data.treatment_costs || []
    };

    await onSubmit(formattedData);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Information génétique</h3>
          <GeneticInfoFields register={register} errors={errors} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Historique des vaccinations</h3>
              <button
                type="button"
                onClick={() => setIsVaccinationModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>
            <VaccinationHistory vaccinations={vaccinationHistory} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Historique médical</h3>
              <button
                type="button"
                onClick={() => setIsMedicalModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>
            <MedicalHistory entries={medicalHistory} />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {isVaccinationModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsVaccinationModalOpen(false)}
          title="Ajouter une vaccination"
        >
          <div className="p-4">
            <VaccinationForm 
              onSubmit={handleAddVaccination}
              onCancel={() => setIsVaccinationModalOpen(false)}
            />
          </div>
        </Modal>
      )}

      {isMedicalModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsMedicalModalOpen(false)}
          title="Ajouter une entrée médicale"
        >
          <div className="p-4">
            <MedicalEntryForm 
              onSubmit={handleAddMedicalEntry}
              onCancel={() => setIsMedicalModalOpen(false)}
            />
          </div>
        </Modal>
      )}
    </>
  );
}