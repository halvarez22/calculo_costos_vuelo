
import React, { useState, useEffect } from 'react';
import { AirportTax, Airport, OperationType, BillingUnit, TaxStatus } from '../../types';
import { BILLING_UNITS, TAX_CONCEPTS } from '../../constants';
import { Modal } from '../Modal';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface TaxManagerProps {
  taxes: AirportTax[];
  setTaxes: React.Dispatch<React.SetStateAction<AirportTax[]>>;
  airports: Airport[];
}

const emptyTax: Omit<AirportTax, 'id'> = {
  airportIata: '',
  concept: TAX_CONCEPTS[0],
  operationType: OperationType.NATIONAL,
  baseRate: 0,
  criticalHourRate: 0,
  billingUnit: BillingUnit.PER_PASSENGER,
  effectiveDate: new Date().toISOString().split('T')[0],
  status: TaxStatus.ACTIVE,
  description: '',
  notes: '',
};

export const TaxManager: React.FC<TaxManagerProps> = ({ taxes, setTaxes, airports }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<AirportTax | null>(null);
  const [formData, setFormData] = useState<Omit<AirportTax, 'id'>>(emptyTax);

  useEffect(() => {
    if (editingTax) {
      setFormData(editingTax);
    } else {
      setFormData({...emptyTax, airportIata: airports[0]?.iata || ''});
    }
  }, [editingTax, airports]);

  const handleOpenModal = (tax: AirportTax | null = null) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTax(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['baseRate', 'criticalHourRate'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTax) {
      setTaxes(prev => prev.map(t => t.id === editingTax.id ? { ...formData, id: t.id } : t));
    } else {
      const newTax: AirportTax = { ...formData, id: `tax_${Date.now()}` };
      setTaxes(prev => [...prev, newTax]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este impuesto?')) {
      setTaxes(prev => prev.filter(t => t.id !== id));
    }
  };

  const taxesByAirport = taxes.reduce((acc, tax) => {
    (acc[tax.airportIata] = acc[tax.airportIata] || []).push(tax);
    return acc;
  }, {} as Record<string, AirportTax[]>);

  const getAirportName = (iata: string) => airports.find(a => a.iata === iata)?.name || iata;


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Gestor de Impuestos</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-accent hover:bg-accent-hover text-white font-bold py-2 px-3 rounded-lg text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Añadir
        </button>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {Object.keys(taxesByAirport).map(iata => (
          <div key={iata}>
            <h4 className="text-md font-bold text-sky-400 mb-2 border-b border-slate-700 pb-1">{getAirportName(iata)}</h4>
            <div className="space-y-2">
              {taxesByAirport[iata].map(tax => (
                <div key={tax.id} className="bg-primary-700 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{tax.concept}</p>
                    <p className="text-xs text-gray-400">{tax.operationType} | {tax.billingUnit} | <span className={tax.status === TaxStatus.ACTIVE ? 'text-green-400' : 'text-red-400'}>{tax.status}</span></p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleOpenModal(tax)} className="p-2 hover:bg-primary-600 rounded-full"><PencilIcon className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={() => handleDelete(tax.id)} className="p-2 hover:bg-primary-600 rounded-full"><TrashIcon className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {taxes.length === 0 && <p className="text-gray-400 text-center py-8">No hay impuestos definidos.</p>}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTax ? 'Editar Impuesto' : 'Añadir Impuesto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="airportIata" className="block text-sm font-medium text-slate-300 mb-2">Aeropuerto *</label>
              <select id="airportIata" name="airportIata" value={formData.airportIata} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                {airports.map(ap => <option key={ap.iata} value={ap.iata}>{ap.name} ({ap.iata})</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="concept" className="block text-sm font-medium text-slate-300 mb-2">Concepto *</label>
                <select id="concept" name="concept" value={formData.concept} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                    {TAX_CONCEPTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="operationType" className="block text-sm font-medium text-slate-300 mb-2">Tipo de Operación *</label>
                    <select id="operationType" name="operationType" value={formData.operationType} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                        {Object.values(OperationType).map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="billingUnit" className="block text-sm font-medium text-slate-300 mb-2">Unidad de Cobro *</label>
                    <select id="billingUnit" name="billingUnit" value={formData.billingUnit} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                        {BILLING_UNITS.map(bu => <option key={bu.id} value={bu.id}>{bu.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="baseRate" className="block text-sm font-medium text-slate-300 mb-2">Tarifa Base (MXN) *</label>
                    <input id="baseRate" name="baseRate" type="number" step="0.01" value={formData.baseRate} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
                </div>
                <div>
                    <label htmlFor="criticalHourRate" className="block text-sm font-medium text-slate-300 mb-2">Tarifa Horario Crítico (MXN)</label>
                    <input id="criticalHourRate" name="criticalHourRate" type="number" step="0.01" value={formData.criticalHourRate} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="effectiveDate" className="block text-sm font-medium text-slate-300 mb-2">Fecha de Vigencia *</label>
                    <input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white" />
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">Estado *</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white">
                        {Object.values(TaxStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"></textarea>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">Notas Adicionales</label>
                <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"></textarea>
            </div>
          <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg mt-4">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};
