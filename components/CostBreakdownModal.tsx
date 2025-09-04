
import React from 'react';
import { CalculationBreakdown } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { formatNumber } from '../lib/utils';

// TypeScript declarations for global libraries from CDN
declare const html2canvas: any;
declare const jspdf: any;

interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: CalculationBreakdown;
  formatCurrency: (value: number) => string;
}

export const CostBreakdownModal: React.FC<CostBreakdownModalProps> = ({ isOpen, onClose, breakdown, formatCurrency }) => {
  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;

    html2canvas(input, { scale: 2, backgroundColor: '#1e293b' }).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`desglose-costos-${breakdown.originAirport.iata}-${breakdown.destinationAirport.iata}.pdf`);
    });
  };

  const BreakdownRow: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-3 px-4 rounded-md ${isTotal ? 'bg-sky-500/10' : ''}`}>
      <span className={`text-sm ${isTotal ? 'font-bold text-white' : 'text-slate-300'}`}>{label}</span>
      <span className={`text-sm font-mono ${isTotal ? 'font-bold text-white' : 'text-slate-200'}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 relative flex flex-col" onClick={e => e.stopPropagation()}>
        <div id="pdf-content" className="p-8">
          <header className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Desglose de Costos de Vuelo</h2>
            <p className="text-slate-400 text-sm mt-1">
              {breakdown.originAirport.city} ({breakdown.originAirport.iata}) a {breakdown.destinationAirport.city} ({breakdown.destinationAirport.iata})
            </p>
          </header>
          
          <div className="space-y-4">
            {/* Flight Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-slate-700/50 p-3 rounded-lg"><p className="text-xs text-slate-400">Aeronave</p><p className="font-bold text-white text-sm">{`${breakdown.aircraft.brand} ${breakdown.aircraft.model}`}</p></div>
                <div className="bg-slate-700/50 p-3 rounded-lg"><p className="text-xs text-slate-400">Distancia</p><p className="font-bold text-white text-sm">{formatNumber(breakdown.distanceKm, 0)} km</p></div>
                <div className="bg-slate-700/50 p-3 rounded-lg"><p className="text-xs text-slate-400">Tiempo de Vuelo</p><p className="font-bold text-white text-sm">{formatNumber(breakdown.flightHours, 2)} hrs</p></div>
            </div>

            {/* Crew Details */}
             <div className="border-t border-b border-slate-700 py-3 mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs text-slate-400">Piloto al Mando</p>
                        <p className="font-medium text-white text-sm">{breakdown.pilotInCommand.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Primer Oficial</p>
                        <p className="font-medium text-white text-sm">{breakdown.firstOfficer.name}</p>
                    </div>
                </div>
            </div>

            {/* Cost Items */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-sky-400 mb-2 border-b border-slate-600 pb-2">Costos Operativos</h3>
                <BreakdownRow label="Combustible" value={formatCurrency(breakdown.fuelCost)} />
                <BreakdownRow label="Mantenimiento" value={formatCurrency(breakdown.maintenanceCost)} />
                <BreakdownRow label="Tripulación" value={formatCurrency(breakdown.crewCost)} />
                <BreakdownRow label="Costos Fijos Operativos (FOV)" value={formatCurrency(breakdown.fovCost)} />
                
                <h3 className="text-lg font-semibold text-sky-400 mt-4 mb-2 border-b border-slate-600 pb-2">Costos de Ruta y Aeroportuarios</h3>
                <BreakdownRow label="Tasas de Aterrizaje y Manejo" value={formatCurrency(breakdown.landingAndHandlingCost)} />
                <BreakdownRow label="Navegación en Ruta" value={formatCurrency(breakdown.navigationCost)} />

                {breakdown.appliedTaxes.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold text-sky-400 mt-4 mb-2 border-b border-slate-600 pb-2">Impuestos y Cargos</h3>
                        {breakdown.appliedTaxes.map(tax => (
                            <BreakdownRow key={tax.concept} label={tax.concept} value={formatCurrency(tax.cost)} />
                        ))}
                    </>
                )}
            </div>

            <div className="pt-4 border-t-2 border-slate-600 space-y-2">
                <BreakdownRow label="Costo Total" value={formatCurrency(breakdown.totalCost)} isTotal />
                <BreakdownRow label="Costo por Hora" value={formatCurrency(breakdown.costPerHour)} isTotal />
            </div>
          </div>
        </div>
        <footer className="bg-slate-900/50 p-4 flex justify-between items-center rounded-b-2xl border-t border-slate-700">
            <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Descargar PDF
            </button>
            <button onClick={onClose} aria-label="Cerrar modal" className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                <CloseIcon className="w-6 h-6 text-slate-400" />
            </button>
        </footer>
      </div>
    </div>
  );
};