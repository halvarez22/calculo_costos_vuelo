
import React, { useState } from 'react';
import { Aircraft, Airport, GlobalCostParameters, ManagerView, AirportTax, Pilot, MaintenanceProgram } from '../types';
import { AircraftManager } from './managers/AircraftManager';
import { AirportManager } from './managers/AirportManager';
import { GlobalSettingsManager } from './managers/GlobalSettingsManager';
import { TaxManager } from './managers/TaxManager';
import { PilotManager } from './managers/PilotManager';
import { MaintenanceManager } from './managers/MaintenanceManager';
import { PlaneIcon } from './icons/PlaneIcon';
import { CogIcon } from './icons/CogIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { WrenchIcon } from './icons/WrenchIcon';

interface SidebarProps {
  aircrafts: Aircraft[];
  setAircrafts: React.Dispatch<React.SetStateAction<Aircraft[]>>;
  airports: Airport[];
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
  pilots: Pilot[];
  setPilots: React.Dispatch<React.SetStateAction<Pilot[]>>;
  globalParams: GlobalCostParameters;
  setGlobalParams: React.Dispatch<React.SetStateAction<GlobalCostParameters>>;
  taxes: AirportTax[];
  setTaxes: React.Dispatch<React.SetStateAction<AirportTax[]>>;
  maintenancePrograms: MaintenanceProgram[];
  setMaintenancePrograms: React.Dispatch<React.SetStateAction<MaintenanceProgram[]>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  aircrafts, setAircrafts, airports, setAirports, pilots, setPilots, globalParams, setGlobalParams, taxes, setTaxes, maintenancePrograms, setMaintenancePrograms
}) => {
  const [activeView, setActiveView] = useState<ManagerView>('aircraft');

  const NavButton: React.FC<{ view: ManagerView; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex-1 flex flex-col items-center justify-center p-3 text-xs font-medium border-b-2 transition-colors ${
        activeView === view
          ? 'text-sky-400 border-sky-400'
          : 'text-slate-400 border-transparent hover:bg-slate-700/50'
      }`}
      aria-current={activeView === view}
    >
      {children}
      <span className="mt-1">{label}</span>
    </button>
  );

  return (
    <aside className="bg-slate-900 border-l border-slate-700 flex flex-col h-screen overflow-y-auto">
      <header className="p-4 text-center border-b border-slate-700 bg-slate-900/80 sticky top-0 backdrop-blur-sm z-10">
        <h2 className="text-xl font-bold text-white">Gestión de Catálogos</h2>
        <p className="text-sm text-slate-400">Administre los datos de la aplicación.</p>
      </header>

      <nav className="flex justify-around border-b border-slate-700 sticky top-[89px] bg-slate-900/80 backdrop-blur-sm z-10">
        <NavButton view="aircraft" label="Aeronaves">
            <PlaneIcon className="w-5 h-5" />
        </NavButton>
         <NavButton view="pilots" label="Pilotos">
            <UserGroupIcon className="w-5 h-5" />
        </NavButton>
         <NavButton view="maintenance" label="Mantto.">
            <WrenchIcon className="w-5 h-5" />
        </NavButton>
        <NavButton view="airports" label="Aeropuertos">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
        </NavButton>
         <NavButton view="taxes" label="Impuestos">
            <DocumentTextIcon className="w-5 h-5" />
        </NavButton>
        <NavButton view="globals" label="Ajustes">
            <CogIcon className="w-5 h-5" />
        </NavButton>
      </nav>

      <div className="p-4 flex-grow">
        {activeView === 'aircraft' && <AircraftManager aircrafts={aircrafts} setAircrafts={setAircrafts} />}
        {activeView === 'pilots' && <PilotManager pilots={pilots} setPilots={setPilots} />}
        {activeView === 'maintenance' && <MaintenanceManager maintenancePrograms={maintenancePrograms} setMaintenancePrograms={setMaintenancePrograms} aircrafts={aircrafts} />}
        {activeView === 'airports' && <AirportManager airports={airports} setAirports={setAirports} />}
        {activeView === 'taxes' && <TaxManager taxes={taxes} setTaxes={setTaxes} airports={airports} />}
        {activeView === 'globals' && <GlobalSettingsManager globalParams={globalParams} setGlobalParams={setGlobalParams} />}
      </div>
    </aside>
  );
};