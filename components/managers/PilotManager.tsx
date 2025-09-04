
import React, { useState, useEffect } from 'react';
import { Pilot } from '../../types';
import { Modal } from '../Modal';
import { InputField } from '../InputField';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';


interface PilotManagerProps {
  pilots: Pilot[];
  setPilots: React.Dispatch<React.SetStateAction<Pilot[]>>;
}

const emptyPilot: Omit<Pilot, 'id'> = {
  name: '',
  costPerHour: 0,
};

export const PilotManager: React.FC<PilotManagerProps> = ({ pilots, setPilots }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  const [formData, setFormData] = useState<Omit<Pilot, 'id'>>(emptyPilot);

  useEffect(() => {
    if (editingPilot) {
        const { id, ...rest } = editingPilot;
        setFormData(rest);
    } else {
      setFormData(emptyPilot);
    }
  }, [editingPilot]);

  const handleOpenModal = (pilot: Pilot | null = null) => {
    setEditingPilot(pilot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPilot(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['costPerHour'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPilot) {
      setPilots(prev => prev.map(p => p.id === editingPilot.id ? { ...formData, id: p.id } : p));
    } else {
      const newPilot: Pilot = { ...formData, id: `pilot_${Date.now()}` };
      setPilots(prev => [...prev, newPilot]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar a este piloto?')) {
      setPilots(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Pilotos</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3 rounded-lg text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Añadir
        </button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {pilots.map(p => (
          <div key={p.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="w-5 h-5 text-slate-400 mr-3"/>
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-xs text-slate-400">Costo: ${p.costPerHour.toFixed(2)} / hr</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-slate-700 rounded-full"><PencilIcon className="w-4 h-4 text-slate-400" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-slate-700 rounded-full"><TrashIcon className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
         {pilots.length === 0 && <p className="text-slate-400 text-center py-8">No hay pilotos definidos.</p>}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPilot ? 'Editar Piloto' : 'Añadir Piloto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nombre Completo" id="name" name="name" value={formData.name} onChange={handleChange} required />
          <InputField label="Costo por Hora ($)" id="costPerHour" name="costPerHour" type="number" step="0.01" value={formData.costPerHour} onChange={handleChange} required />
          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg mt-4">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};