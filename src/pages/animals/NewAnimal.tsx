import React from 'react';
import { Beef } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import AnimalForm from '../../components/animals/form/AnimalForm';

export default function NewAnimal() {
  return (
    <div>
      <PageHeader 
        title="Ajouter un animal" 
        icon={Beef}
        iconColor="text-yellow-500"
      />
      <Card>
        <div className="p-6">
          <AnimalForm />
        </div>
      </Card>
    </div>
  );
}