

import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_AIRCRAFT_CATALOG, 
  INITIAL_AIRPORT_CATALOG, 
  INITIAL_GLOBAL_COST_PARAMETERS, 
  INITIAL_TAX_CATALOG, 
  INITIAL_PILOT_CATALOG, 
  INITIAL_MAINTENANCE_CATALOG 
} from './constants';
import { 
  FormData, 
  CalculationBreakdown, 
  Aircraft, 
  Airport, 
  GlobalCostParameters, 
  AirportTax, 
  Pilot, 
  MaintenanceProgram 
} from './types';
import { calculateFlightCosts, parseFlightData, calculateTrackDetails, formatNumber } from './lib/utils';
import { CostBreakdownModal } from './components/CostBreakdownModal';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  // Catalogs state
  const [aircrafts, setAircrafts] = useState<Aircraft[]>(INITIAL_AIRCRAFT_CATALOG);
  const [airports, setAirports] = useState<Airport[]>(INITIAL_AIRPORT_CATALOG);
  const [globalParams, setGlobalParams] = useState<GlobalCostParameters>(INITIAL_GLOBAL_COST_PARAMETERS);
  const [taxes, setTaxes] = useState<AirportTax[]>(INITIAL_TAX_CATALOG);
  const [pilots, setPilots] = useState<Pilot[]>(INITIAL_PILOT_CATALOG);
  const [maintenancePrograms, setMaintenancePrograms] = useState<MaintenanceProgram[]>(INITIAL_MAINTENANCE_CATALOG);

  // Form and results state
  const [formData, setFormData] = useState<FormData>({
    aircraftId: INITIAL_AIRCRAFT_CATALOG[0]?.id || '',
    pilotInCommandId: INITIAL_PILOT_CATALOG[0]?.id || '',
    firstOfficerId: INITIAL_PILOT_CATALOG[2]?.id || '',
    flightDataCsv: '',
  });
  
  const [results, setResults] = useState<CalculationBreakdown | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form selectors if the selected items are removed from the catalog
  useEffect(() => {
    const updateFormData = (currentFormData: FormData): FormData => {
      let newFormData = { ...currentFormData };
      
      if (!aircrafts.some((a: Aircraft) => a.id === currentFormData.aircraftId)) {
        newFormData.aircraftId = aircrafts[0]?.id || '';
      }
      
      if (!pilots.some((p: Pilot) => p.id === currentFormData.pilotInCommandId)) {
        newFormData.pilotInCommandId = pilots[0]?.id || '';
      }
      
      if (!pilots.some((p: Pilot) => p.id === currentFormData.firstOfficerId) || 
          currentFormData.firstOfficerId === currentFormData.pilotInCommandId) {
        const availablePilots = pilots.filter((p: Pilot) => p.id !== newFormData.pilotInCommandId);
        newFormData.firstOfficerId = availablePilots[0]?.id || '';
      }
      
      return newFormData;
    };
    
    setFormData(prevFormData => updateFormData(prevFormData));
  }, [aircrafts, pilots]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevFormData => {
      const newFormData: FormData = { ...prevFormData, [name]: value };
      
      // Prevent selecting the same pilot for both roles
      if (name === 'pilotInCommandId' && value === prevFormData.firstOfficerId) {
        const otherPilot = pilots.find((p: Pilot) => p.id !== value);
        newFormData.firstOfficerId = otherPilot?.id || '';
      } else if (name === 'firstOfficerId' && value === prevFormData.pilotInCommandId) {
        const otherPilot = pilots.find((p: Pilot) => p.id !== value);
        newFormData.pilotInCommandId = otherPilot?.id || '';
      }
      
      return newFormData;
    });

    // Auto-select aircraft from CSV data
    if (name === 'flightDataCsv') {
      try {
        const { callsign } = parseFlightData(value);
        if (callsign) {
          const matchedAircraft = aircrafts.find(
            (a: Aircraft) => a.registration.toUpperCase() === callsign.toUpperCase()
          );
          if (matchedAircraft) {
            setFormData(prev => ({
              ...prev,
              aircraftId: matchedAircraft.id,
              flightDataCsv: value
            }));
          }
        }
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        return;
      }
    }

    setError(null);
    setResults(null);
    setIsCalculated(false);
  }, [aircrafts, pilots]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target?.result as string;
        setFormData(prev => ({ ...prev, flightDataCsv: csvContent }));
        setError(null);
        setResults(null);
        setIsCalculated(false);
      };
      reader.readAsText(file);
    } else {
      setError('Por favor selecciona un archivo CSV válido.');
    }
  }, []);

  const handleCalculate = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.flightDataCsv.trim()) {
      setError("Por favor, pegue los datos de seguimiento del vuelo.");
      return;
    }
    
    if (formData.pilotInCommandId === formData.firstOfficerId) {
      setError("El Piloto y el Primer Oficial no pueden ser la misma persona.");
      return;
    }
    
    setError(null);
    setIsCalculated(false);
    
    try {
      // Verificar que existan los catálogos necesarios
      if (aircrafts.length === 0 || airports.length < 2 || pilots.length < 2) {
        throw new Error("Faltan datos en los catálogos. Asegúrese de tener al menos una aeronave, dos aeropuertos y dos pilotos.");
      }
      
      // Parsear datos del vuelo
      const flightData = parseFlightData(formData.flightDataCsv);
      if (flightData.track.length < 2) {
        throw new Error("Los datos del vuelo no contienen suficientes puntos de seguimiento.");
      }
      
      // Calcular detalles del vuelo
      const trackDetails = calculateTrackDetails(flightData.track);
      
      // Verificar que se haya seleccionado una aeronave y pilotos
      const selectedAircraft = aircrafts.find(a => a.id === formData.aircraftId);
      const pilotInCommand = pilots.find(p => p.id === formData.pilotInCommandId);
      const firstOfficer = pilots.find(p => p.id === formData.firstOfficerId);
      
      if (!selectedAircraft || !pilotInCommand || !firstOfficer) {
        throw new Error("No se pudo encontrar la aeronave o los pilotos seleccionados.");
      }
      
      // Obtener aeropuertos de origen y destino (usando los primeros dos aeropuertos del catálogo como ejemplo)
      const [originAirport, destinationAirport] = airports;
      
      if (!originAirport || !destinationAirport) {
        throw new Error("Se requieren al menos dos aeropuertos para calcular los costos.");
      }
      
      // Calcular costos
      const calculation = calculateFlightCosts(
        formData,
        aircrafts,
        airports,
        pilots,
        globalParams,
        taxes,
        maintenancePrograms
      );
      
      if (!calculation) {
        throw new Error("No se pudo calcular el costo del vuelo. Verifique los datos ingresados.");
      }
      
      setResults(calculation);
      setIsCalculated(true);
    } catch (error) {
      const err = error as Error;
      setError(`Error al calcular los costos: ${err.message}`);
      setResults(null);
      setIsCalculated(false);
    }
  }, [formData, aircrafts, airports, pilots, globalParams, taxes, maintenancePrograms]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'USD',
    });
  };
    
  const selectablePilots = (exclude?: string) => {
    const filteredPilots = exclude 
      ? pilots.filter(p => p.id !== exclude)
      : [...pilots];
      
    return filteredPilots.map(pilot => (
      <option key={pilot.id} value={pilot.id}>
        {pilot.name}
      </option>
    ));
  };

  return (
    <div className="min-h-screen bg-primary-800 text-white font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-0 min-h-screen">
        {/* Main Content */}
        <main className="flex flex-col items-center p-4 xl:p-8 bg-primary-700/50 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4 border border-accent/20">
                <img 
                  src="/images/Logo.gif" 
                  alt="Logo de la empresa" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Análisis de Costos de Vuelo
              </h1>
              <p className="text-gray-400 text-lg">
                Calcule los costos operativos de su vuelo de manera precisa
              </p>
            </header>

            <div className="bg-primary-700/50 rounded-xl p-6 shadow-lg border border-primary-600/50">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="aircraftId" className="block text-sm font-medium text-gray-300 mb-1">
                      Aeronave
                    </label>
                    <select
                      id="aircraftId"
                      name="aircraftId"
                      value={formData.aircraftId}
                      onChange={handleInputChange}
                      className="w-full bg-primary-700 border border-primary-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    >
                      {aircrafts.map(aircraft => (
                        <option key={aircraft.id} value={aircraft.id}>
                          {aircraft.brand} {aircraft.model} ({aircraft.registration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pilotInCommandId" className="block text-sm font-medium text-gray-300 mb-1">
                      Piloto al Mando
                    </label>
                    <select
                      id="pilotInCommandId"
                      name="pilotInCommandId"
                      value={formData.pilotInCommandId}
                      onChange={handleInputChange}
                      className="w-full bg-primary-700 border border-primary-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    >
                      {selectablePilots(formData.firstOfficerId)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="firstOfficerId" className="block text-sm font-medium text-gray-300 mb-1">
                      Primer Oficial
                    </label>
                    <select
                      id="firstOfficerId"
                      name="firstOfficerId"
                      value={formData.firstOfficerId}
                      onChange={handleInputChange}
                      className="w-full bg-primary-700 border border-primary-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    >
                      {selectablePilots(formData.pilotInCommandId)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="flightDataCsv" className="block text-sm font-medium text-gray-300">
                      Datos del Vuelo (CSV)
                    </label>
                    <div className="flex space-x-2">
                      <label className="text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Cargar CSV</span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, flightDataCsv: '' }));
                          setError(null);
                          setResults(null);
                          setIsCalculated(false);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Limpiar</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="flightDataCsv"
                    name="flightDataCsv"
                    value={formData.flightDataCsv}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full bg-primary-700 border border-primary-600 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Pegue aquí los datos del vuelo en formato CSV..."
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Calcular Costos</span>
                  </button>
                </div>
              </form>
            </div>

            {isCalculated && results ? (
              <div className="mt-8 bg-primary-700/50 rounded-xl p-6 shadow-lg border border-primary-600/50">
                <h2 className="text-2xl font-bold text-white mb-4">Resultados del Cálculo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Resumen</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Distancia Total:</span>
                        <span className="text-white">{formatNumber(results.distanceKm, 2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tiempo de Vuelo:</span>
                        <span className="text-white">{formatNumber(results.flightHours, 2)} horas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Combustible Estimado:</span>
                        <span className="text-white">{formatNumber(results.flightHours * results.aircraft.fuelConsumptionLph, 2)} L</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Costos</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Costo de Combustible:</span>
                        <span className="text-white">{formatCurrency(results.fuelCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Costo de Tripulación:</span>
                        <span className="text-white">{formatCurrency(results.crewCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Costo Total:</span>
                        <span className="text-xl font-bold text-accent">{formatCurrency(results.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-accent hover:text-accent-hover text-sm font-medium flex items-center"
                  >
                    Ver desglose detallado
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                <p>{error ? 'Por favor corrija el error.' : 'Pegue los datos del vuelo y haga clic en "Calcular" para ver los resultados.'}</p>
              </div>
            )}
            
            {/* Espacio para el pie de página fijo */}
            <div className="h-16"></div>
          </div>
        </main>
        {/* Sidebar de catálogos */}
        <aside className="bg-primary-700 border-l border-primary-600 overflow-y-auto">
          <Sidebar 
            aircrafts={aircrafts}
            setAircrafts={setAircrafts}
            airports={airports}
            setAirports={setAirports}
            pilots={pilots}
            setPilots={setPilots}
            globalParams={globalParams}
            setGlobalParams={setGlobalParams}
            taxes={taxes}
            setTaxes={setTaxes}
            maintenancePrograms={maintenancePrograms}
            setMaintenancePrograms={setMaintenancePrograms}
          />
        </aside>
      </div>
      
      {/* Pie de página fijo */}
      <footer className="fixed bottom-0 right-0 p-4 text-sm text-gray-400">
        powered by pai-b | Todos los derechos reservados 2025 ©
      </footer>
    </div>
  );
};

export default App;