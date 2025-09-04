
import React, { useState, useEffect } from 'react';
import { MaintenanceProgram, Aircraft } from '../../types';
import { Modal } from '../Modal';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface MaintenanceManagerProps {
  maintenancePrograms: MaintenanceProgram[];
  setMaintenancePrograms: React.Dispatch<React.SetStateAction<MaintenanceProgram[]>>;
  aircrafts: Aircraft[];
}

const emptyProgram: Omit<MaintenanceProgram, 'id'> = {
  aircraftId: '',
  name: '',
  cost: 0,
  intervalFh: 0,
  description: '',
};

export const MaintenanceManager: React.FC<MaintenanceManagerProps> = ({ maintenancePrograms, setMaintenancePrograms, aircrafts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<MaintenanceProgram | null>(null);
  const [formData, setFormData] = useState<Omit<MaintenanceProgram, 'id'>>(emptyProgram);

  useEffect(() => {
    if (editingProgram) {
      setFormData(editingProgram);
    } else {
      setFormData({...emptyProgram, aircraftId: aircrafts[0]?.id || ''});
    }
  }, [editingProgram, aircrafts]);

  const handleOpenModal = (program: MaintenanceProgram | null = null) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['cost', 'intervalFh'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      setMaintenancePrograms(prev => prev.map(p => p.id === editingProgram.id ? { ...formData, id: p.id } : p));
    } else {
      const newProgram: MaintenanceProgram = { ...formData, id: `maint_${Date.now()}` };
      setMaintenancePrograms(prev => [...prev, newProgram]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este programa de mantenimiento?')) {
      setMaintenancePrograms(prev => prev.filter(p => p.id !== id));
    }
  };

  const programsByAircraft = maintenancePrograms.reduce((acc, program) => {
    (acc[program.aircraftId] = acc[program.aircraftId] || []).push(program);
    return acc;
  }, {} as Record<string, MaintenanceProgram[]>);

  const getAircraftDisplay = (id: string) => {
    const ac = aircrafts.find(a => a.id === id);
    return ac ? `${ac.brand} ${ac.model} (${ac.registration})` : id;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Gestor de Mantenimiento</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3 rounded-lg text-sm" disabled={aircrafts.length === 0}>
          <PlusIcon className="w-4 h-4 mr-1" />
          Añadir
        </button>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {Object.keys(programsByAircraft).map(aircraftId => (
          <div key={aircraftId}>
            <h4 className="text-md font-bold text-sky-400 mb-2 border-b border-slate-700 pb-1">{getAircraftDisplay(aircraftId)}</h4>
            <div className="space-y-2">
              {programsByAircraft[aircraftId].map(program => (
                <div key={program.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{program.name}</p>
                    <p className="text-xs text-slate-400">Costo: ${program.cost.toLocaleString()} | Intervalo: {program.intervalFh} FH</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleOpenModal(program)} className="p-2 hover:bg-slate-700 rounded-full"><PencilIcon className="w-4 h-4 text-slate-400" /></button>
                    <button onClick={() => handleDelete(program.id)} className="p-2 hover:bg-slate-700 rounded-full"><TrashIcon className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {maintenancePrograms.length === 0 && <p className="text-slate-400 text-center py-8">{aircrafts.length > 0 ? 'No hay programas de mantenimiento definidos.' : 'Añada primero una aeronave para poder crear programas de mantenimiento.'}</p>}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProgram ? 'Editar Programa' : 'Añadir Programa'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="aircraftId" className="block text-sm font-medium text-slate-300 mb-2">Aeronave *</label>
              <select id="aircraftId" name="aircraftId" value={formData.aircraftId} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                {aircrafts.map(ac => <option key={ac.id} value={ac.id}>{getAircraftDisplay(ac.id)}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nombre del Programa *</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-slate-300 mb-2">Costo Total ($) *</label>
                    <input id="cost" name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
                </div>
                <div>
                    <label htmlFor="intervalFh" className="block text-sm font-medium text-slate-300 mb-2">Intervalo (Horas de Vuelo) *</label>
                    <input id="intervalFh" name="intervalFh" type="number" value={formData.intervalFh} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"></textarea>
            </div>
          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg mt-4">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};