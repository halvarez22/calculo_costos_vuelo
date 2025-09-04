
import React, { useState } from 'react';
import { GlobalCostParameters } from '../../types';
import { InputField } from '../InputField';

interface GlobalSettingsManagerProps {
  globalParams: GlobalCostParameters;
  setGlobalParams: React.Dispatch<React.SetStateAction<GlobalCostParameters>>;
}

export const GlobalSettingsManager: React.FC<GlobalSettingsManagerProps> = ({ globalParams, setGlobalParams }) => {
  const [formData, setFormData] = useState<GlobalCostParameters>(globalParams);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalParams(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Ajustes Globales</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
          label="Precio del Combustible ($ por Litro)" 
          id="fuelPricePerLiter" 
          name="fuelPricePerLiter" 
          type="number" 
          step="0.01"
          value={formData.fuelPricePerLiter} 
          onChange={handleChange} 
          required 
        />
        <InputField 
          label="Cargo de Navegación ($ por km)" 
          id="navigationChargePerKm" 
          name="navigationChargePerKm" 
          type="number" 
          step="0.01"
          value={formData.navigationChargePerKm} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg">
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};
