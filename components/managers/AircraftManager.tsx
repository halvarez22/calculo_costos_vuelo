
import React, { useState, useEffect } from 'react';
import { Aircraft } from '../../types';
import { Modal } from '../Modal';
import { InputField } from '../InputField';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface AircraftManagerProps {
  aircrafts: Aircraft[];
  setAircrafts: React.Dispatch<React.SetStateAction<Aircraft[]>>;
}

const emptyAircraft: Omit<Aircraft, 'id'> = {
  brand: '', model: '', registration: '', passengers: 0,
  averageSpeedKmh: 0, fuelConsumptionLph: 0,
  fovCostPerFh: 0, weightTon: 0,
};

export const AircraftManager: React.FC<AircraftManagerProps> = ({ aircrafts, setAircrafts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  const [formData, setFormData] = useState<Omit<Aircraft, 'id' | 'maintenanceCostPerFh'>>(emptyAircraft);

  useEffect(() => {
    if (editingAircraft) {
      const { id, ...rest } = editingAircraft;
      setFormData(rest);
    } else {
      setFormData(emptyAircraft);
    }
  }, [editingAircraft]);

  const handleOpenModal = (aircraft: Aircraft | null = null) => {
    setEditingAircraft(aircraft);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAircraft(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const isTextField = ['brand', 'model', 'registration'].includes(name);
    const processedValue = isTextField ? value : parseFloat(value) || 0;

    setFormData(prev => ({
        ...prev,
        [name]: processedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAircraft) {
      setAircrafts(prev => prev.map(ac => ac.id === editingAircraft.id ? { ...formData, id: editingAircraft.id } : ac));
    } else {
      // Use registration as the unique ID
      setAircrafts(prev => [...prev, { ...formData, id: formData.registration }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta aeronave?')) {
      setAircrafts(prev => prev.filter(ac => ac.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Aeronaves</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-accent hover:bg-accent-hover text-white font-bold py-2 px-3 rounded-lg text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Añadir
        </button>
      </div>
      <div className="space-y-2">
        {aircrafts.map(ac => (
          <div key={ac.id} className="bg-primary-700 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{`${ac.brand} ${ac.model}`}</p>
              <p className="text-xs text-gray-400">Matrícula: {ac.registration} | Pasajeros: {ac.passengers}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleOpenModal(ac)} className="p-2 hover:bg-primary-600 rounded-full"><PencilIcon className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => handleDelete(ac.id)} className="p-2 hover:bg-primary-600 rounded-full"><TrashIcon className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAircraft ? 'Editar Aeronave' : 'Añadir Aeronave'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Marca" id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
                <InputField label="Modelo" id="model" name="model" value={formData.model} onChange={handleChange} required />
                <InputField label="Matrícula (único)" id="registration" name="registration" value={formData.registration} onChange={handleChange} required disabled={!!editingAircraft} />
                <InputField label="Pasajeros" id="passengers" name="passengers" type="number" value={formData.passengers} onChange={handleChange} required />
            </div>
            
            <p className="text-sm text-gray-400 pt-3 border-t border-primary-600">Parámetros de Rendimiento</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Velocidad Promedio (km/h)" id="averageSpeedKmh" name="averageSpeedKmh" type="number" value={formData.averageSpeedKmh} onChange={handleChange} required />
                <InputField label="Consumo Combustible (L/h)" id="fuelConsumptionLph" name="fuelConsumptionLph" type="number" value={formData.fuelConsumptionLph} onChange={handleChange} required />
                <InputField label="Costo FOV por hora ($)" id="fovCostPerFh" name="fovCostPerFh" type="number" value={formData.fovCostPerFh} onChange={handleChange} required />
                <InputField label="Peso (toneladas)" id="weightTon" name="weightTon" type="number" step="0.1" value={formData.weightTon} onChange={handleChange} required />
            </div>
          
          <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg mt-4">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};