
import React, { useState, useEffect } from 'react';
import { Airport } from '../../types';
import { Modal } from '../Modal';
import { InputField } from '../InputField';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface AirportManagerProps {
  airports: Airport[];
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
}

const emptyAirport: Airport = {
  iata: '', oaci: '', name: '', city: '', country: '',
  lat: 0, lon: 0, landingFee: 0, handlingFeePerTon: 0
};

export const AirportManager: React.FC<AirportManagerProps> = ({ airports, setAirports }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const [formData, setFormData] = useState<Airport>(emptyAirport);

  useEffect(() => {
    if (editingAirport) {
      setFormData(editingAirport);
    } else {
      setFormData(emptyAirport);
    }
  }, [editingAirport]);

  const handleOpenModal = (airport: Airport | null = null) => {
    setEditingAirport(airport);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAirport(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['lat', 'lon', 'landingFee', 'handlingFeePerTon'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAirport) {
      setAirports(prev => prev.map(ap => ap.iata === editingAirport.iata ? formData : ap));
    } else {
      setAirports(prev => [...prev, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (iata: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este aeropuerto?')) {
      setAirports(prev => prev.filter(ap => ap.iata !== iata));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Aeropuertos</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-accent hover:bg-accent-hover text-white font-bold py-2 px-3 rounded-lg text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Añadir
        </button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {airports.map(ap => (
          <div key={ap.iata} className="bg-primary-700 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{ap.name}</p>
              <p className="text-xs text-gray-400">{ap.city}, {ap.country} ({ap.iata})</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleOpenModal(ap)} className="p-2 hover:bg-primary-600 rounded-full"><PencilIcon className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => handleDelete(ap.iata)} className="p-2 hover:bg-primary-600 rounded-full"><TrashIcon className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAirport ? 'Editar Aeropuerto' : 'Añadir Aeropuerto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="IATA (único)" id="iata" name="iata" value={formData.iata} onChange={handleChange} required disabled={!!editingAirport} maxLength={3} />
            <InputField label="OACI" id="oaci" name="oaci" value={formData.oaci} onChange={handleChange} maxLength={4} />
            <InputField label="Nombre" id="name" name="name" value={formData.name} onChange={handleChange} required className="md:col-span-2" />
            <InputField label="Ciudad" id="city" name="city" value={formData.city} onChange={handleChange} required />
            <InputField label="País" id="country" name="country" value={formData.country} onChange={handleChange} required />
            <InputField label="Latitud" id="lat" name="lat" type="number" step="any" value={formData.lat} onChange={handleChange} required />
            <InputField label="Longitud" id="lon" name="lon" type="number" step="any" value={formData.lon} onChange={handleChange} required />
            <InputField label="Tasa de Aterrizaje ($)" id="landingFee" name="landingFee" type="number" value={formData.landingFee} onChange={handleChange} required />
            <InputField label="Tasa de Manejo ($/ton)" id="handlingFeePerTon" name="handlingFeePerTon" type="number" value={formData.handlingFeePerTon} onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg mt-4">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};
