
import { Aircraft, Airport, GlobalCostParameters, AirportTax, BillingUnit, Pilot, MaintenanceProgram } from './types';

export const INITIAL_AIRCRAFT_CATALOG: Aircraft[] = [
  { 
    id: 'N501RS',
    brand: 'LearJet',
    model: 'LJ31',
    registration: 'N501RS',
    passengers: 8,
    averageSpeedKmh: 780,
    fuelConsumptionLph: 900,
    fovCostPerFh: 200,
    weightTon: 7
  },
  { 
    id: 'XB-KRB',
    brand: 'Piper',
    model: 'Malibu Mirage',
    registration: 'XB-KRB',
    passengers: 5,
    averageSpeedKmh: 400,
    fuelConsumptionLph: 80,
    fovCostPerFh: 50,
    weightTon: 2
  },
  { 
    id: 'XB-SCF',
    brand: 'Bristell',
    model: 'LSA',
    registration: 'XB-SCF',
    passengers: 2,
    averageSpeedKmh: 220,
    fuelConsumptionLph: 20,
    fovCostPerFh: 25,
    weightTon: 0.6
  },
];

export const INITIAL_PILOT_CATALOG: Pilot[] = [
  { id: 'pilot_1', name: 'Cap. Juan Pérez', costPerHour: 150 },
  { id: 'pilot_2', name: 'Cap. Ana García', costPerHour: 160 },
  { id: 'pilot_3', name: 'P.O. Carlos López', costPerHour: 90 },
  { id: 'pilot_4', name: 'P.O. Sofía Torres', costPerHour: 95 },
];

export const INITIAL_MAINTENANCE_CATALOG: MaintenanceProgram[] = [
    { id: 'maint_1', aircraftId: 'N501RS', name: 'Reserva de Motores', cost: 150000, intervalFh: 3600, description: 'Reserva para overhaul de motores.'},
    { id: 'maint_2', aircraftId: 'N501RS', name: 'Inspección Fase A/B/C/D', cost: 25000, intervalFh: 200, description: 'Programa de inspecciones progresivas.'},
    { id: 'maint_3', aircraftId: 'XB-KRB', name: 'Revisión Anual', cost: 5000, intervalFh: 100, description: 'Inspección anual obligatoria.' },
];


export const INITIAL_AIRPORT_CATALOG: Airport[] = [
    { iata: 'ACA', oaci: 'MMAA', name: 'Aeropuerto Internacional de Acapulco', city: 'Acapulco', country: 'México', lat: 16.7562917, lon: -99.7480972, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'AGU', oaci: 'MMAS', name: 'Aeropuerto Internacional de Aguascalientes', city: 'Aguascalientes', country: 'México', lat: 21.7010972, lon: -102.3179861, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'HUX', oaci: 'MMBT', name: 'Aeropuerto Internacional de Huatulco', city: 'Bahias de Huatulco', country: 'México', lat: 15.7758611, lon: -96.2598667, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CPE', oaci: 'MMCP', name: 'Aeropuerto Internacional de Campeche', city: 'Campeche', country: 'México', lat: 19.8166694, lon: -90.5001333, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CUN', oaci: 'MMUN', name: 'Aeropuerto Internacional de Cancún', city: 'Cancún', country: 'México', lat: 21.0358611, lon: -86.8759889, landingFee: 1800, handlingFeePerTon: 120 },
    { iata: 'CME', oaci: 'MMCE', name: 'Aeropuerto Internacional de Cd. Del Carmen', city: 'Cd. del Carmen', country: 'México', lat: 18.6512028, lon: -91.7989639, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CJS', oaci: 'MMCS', name: 'Aeropuerto Internacional de Cd. Juarez', city: 'Cd. Juarez', country: 'México', lat: 31.6389583, lon: -106.4263306, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CEN', oaci: 'MMCN', name: 'Aeropuerto Internacional de Cd. Obregón', city: 'Cd. Obregón', country: 'México', lat: 27.392725, lon: -109.8331167, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CVM', oaci: 'MMCV', name: 'Aeropuerto Internacional de Cd. Victoria', city: 'Cd. Victoria', country: 'México', lat: 23.7030639, lon: -98.9562417, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CTM', oaci: 'MMCM', name: 'Aeropuerto Internacional de Chetumal', city: 'Chetumal', country: 'México', lat: 18.5055639, lon: -88.3301972, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CUU', oaci: 'MMCU', name: 'Aeropuerto Internacional de Chihuahua', city: 'Chihuahua', country: 'México', lat: 28.7042778, lon: -105.9645139, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'CUL', oaci: 'MMCL', name: 'Aeropuerto Internacional de Culiacán', city: 'Culiacán', country: 'México', lat: 24.7654778, lon: -107.4747139, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'DGO', oaci: 'MMDO', name: 'Aeropuerto Internacional de Durango', city: 'Durango', country: 'México', lat: 24.1258, lon: -104.5275972, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'ENS', oaci: 'MMES', name: 'Aeropuerto de Ensenada', city: 'Ensenada', country: 'México', lat: 31.7954028, lon: -116.6029556, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'NLU', oaci: 'MMSM', name: 'Aeropuerto Internacional Felipe Ángeles', city: 'Felipe Ángeles', country: 'México', lat: 19.7383222, lon: -99.0217639, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'GDL', oaci: 'MMGL', name: 'Aeropuerto Internacional de Guadalajara', city: 'Guadalajara', country: 'México', lat: 20.5218444, lon: -103.3108417, landingFee: 1500, handlingFeePerTon: 100 },
    { iata: 'GYM', oaci: 'MMGM', name: 'Aeropuerto Internacional de Guaymas', city: 'Guaymas', country: 'México', lat: 27.9703806, lon: -110.9229139, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'HMO', oaci: 'MMHO', name: 'Aeropuerto Internacional de Hermosillo', city: 'Hermosillo', country: 'México', lat: 29.0939611, lon: -111.0513111, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'ZIH', oaci: 'MMZH', name: 'Aeropuerto Internacional de Ixtapa - Zihuatanejo', city: 'Ixtapa-Zihuatanejo', country: 'México', lat: 17.6016778, lon: -101.4611861, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'LAP', oaci: 'MMLP', name: 'Aeropuerto Internacional de la Paz', city: 'La Paz', country: 'México', lat: 24.0735028, lon: -110.3624472, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'BJX', oaci: 'MMLO', name: 'Aeropuerto Internacional de Guanajuato', city: 'León (Bajio)', country: 'México', lat: 20.9926278, lon: -101.4800778, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'LTO', oaci: 'MMLT', name: 'Aeropuerto Internacional de Loreto', city: 'Loreto', country: 'México', lat: 25.9904611, lon: -111.3483889, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'LMM', oaci: 'MMLM', name: 'Aeropuerto Internacional de Los Mochis', city: 'Los Mochis', country: 'México', lat: 25.6857722, lon: -109.082925, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'ZLO', oaci: 'MMZO', name: 'Aeropuerto Internacional de Manzanillo', city: 'Manzanillo', country: 'México', lat: 19.1449667, lon: -104.5593917, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MZT', oaci: 'MMMZ', name: 'Aeropuerto Internacional de Mazatlan', city: 'Mazatlán', country: 'México', lat: 23.1615111, lon: -106.265525, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MID', oaci: 'MMMD', name: 'Aeropuerto Internacional Manuel Crescencio Rejón', city: 'Mérida', country: 'México', lat: 20.9299639, lon: -89.6577389, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MXL', oaci: 'MMML', name: 'Aeropuerto Internacional de Mexicali', city: 'Mexicali', country: 'México', lat: 32.6315444, lon: -115.243575, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MEX', oaci: 'MMMX', name: 'Aeropuerto Internacional de la Ciudad de México', city: 'México', country: 'México', lat: 19.4384, lon: -99.0655111, landingFee: 1500, handlingFeePerTon: 100 },
    { iata: 'MTT', oaci: 'MMMT', name: 'Aeropuerto Internacional de Minatitlan', city: 'Minatitlan', country: 'México', lat: 18.10385, lon: -94.5803861, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'LOV', oaci: 'MMMV', name: 'Aeropuerto Internacional de Monclova', city: 'Monclova', country: 'México', lat: 26.9537972, lon: -101.4712278, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MTY', oaci: 'MMMY', name: 'Aeropuerto Internacional de Monterrey', city: 'Monterrey', country: 'México', lat: 25.7781556, lon: -100.1061889, landingFee: 1200, handlingFeePerTon: 80 },
    { iata: 'NTR', oaci: 'MMAN', name: 'Aeropuerto Internacional de Monterrey del Norte', city: 'Monterrey 2', country: 'México', lat: 25.8646833, lon: -100.2403639, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'MLM', oaci: 'MMMM', name: 'Aeropuerto Internacional de Morelia', city: 'Morelia', country: 'México', lat: 19.8503417, lon: -101.0245167, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'NOG', oaci: 'MMNG', name: 'Aeropuerto Internacional de Nogales', city: 'Nogales', country: 'México', lat: 31.2268139, lon: -110.9770083, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'NLD', oaci: 'MMNL', name: 'Aeropuerto Internacional Quetzalcóatl', city: 'Nuevo Laredo', country: 'México', lat: 27.4429056, lon: -99.5696056, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'OAX', oaci: 'MMOX', name: 'Aeropuerto Internacional de Oaxaca', city: 'Oaxaca', country: 'México', lat: 16.99985, lon: -96.7256361, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'PNG', oaci: 'MMPG', name: 'Aeropuerto Internacional de Piedras Negras', city: 'Piedras Negras', country: 'México', lat: 28.6279028, lon: -100.5351278, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'PAZ', oaci: 'MMPA', name: 'Aeropuerto Internacional El Tajín', city: 'Poza Rica', country: 'México', lat: 20.6021, lon: -97.4610944, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'PBC', oaci: 'MMPB', name: 'Aeropuerto Internacional de Puebla', city: 'Puebla', country: 'México', lat: 19.1583139, lon: -98.3715194, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'PXM', oaci: 'MMPS', name: 'Aeropuerto Internacional de Puerto Escondido', city: 'Puerto Escondido', country: 'México', lat: 15.8769222, lon: -97.0898111, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'PVR', oaci: 'MMPR', name: 'Aeropuerto Internacional de Puerto Vallarta', city: 'Puerto Vallarta', country: 'México', lat: 20.6801389, lon: -105.2522667, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'QRO', oaci: 'MMQT', name: 'Aeropuerto Internacional de Querétaro', city: 'Querétaro', country: 'México', lat: 20.6183306, lon: -100.1852639, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'REX', oaci: 'MMRX', name: 'Aeropuerto Internacional General Lucio Blanco', city: 'Reynosa', country: 'México', lat: 26.0078472, lon: -98.2274806, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'SLW', oaci: 'MMIO', name: 'Aeropuerto Internacional Plan de Guadalupe', city: 'Saltillo', country: 'México', lat: 25.538925, lon: -100.92825, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'SJC', oaci: 'MMSD', name: 'Aeropuerto Internacional de Los Cabos', city: 'San Jose del Cabo', country: 'México', lat: 23.1521306, lon: -109.719625, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'SLP', oaci: 'MMSP', name: 'Aeropuerto Internacionl de San Luis Potosí', city: 'San Luis Potosí', country: 'México', lat: 22.2592806, lon: -100.9339667, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TAM', oaci: 'MMTM', name: 'Aeropuerto Internacional de Tampico', city: 'Tampico', country: 'México', lat: 22.2914667, lon: -97.8661889, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TAP', oaci: 'MMTP', name: 'Aeropuerto Internacional de Tapachula', city: 'Tapachula', country: 'México', lat: 14.7945083, lon: -92.3696917, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TNY', oaci: 'MMEP', name: 'Aeropuerto Internacional Amado Nervo', city: 'Tepic', country: 'México', lat: 21.4188028, lon: -104.842775, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TIJ', oaci: 'MMTJ', name: 'Aeropuerto Internacional de Tijuana', city: 'Tijuana', country: 'México', lat: 32.5409861, lon: -116.9690944, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TLC', oaci: 'MMTO', name: 'Aeropuerto Internacional de Toluca', city: 'Toluca', country: 'México', lat: 19.3371833, lon: -99.5659222, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TRC', oaci: 'MMTC', name: 'Aeropuerto Internacional Francisco Sarabia', city: 'Torreón', country: 'México', lat: 25.5618778, lon: -103.4038972, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TGZ', oaci: 'MMTG', name: 'Aeropuerto Internacional Ángel Albino Corzo', city: 'Tuxtla Gutierrez', country: 'México', lat: 16.5628583, lon: -93.0266639, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'UPN', oaci: 'MMPN', name: 'Aeropuerto Internacional de Uruapan', city: 'Uruapan', country: 'México', lat: 19.3963056, lon: -102.0389083, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'VER', oaci: 'MMVR', name: 'Aeropuerto Internacional de Veracruz', city: 'Veracruz', country: 'México', lat: 19.1386972, lon: -96.1887778, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'VSA', oaci: 'MMVA', name: 'Aeropuerto Internacional de Villahermosa', city: 'Villahermosa', country: 'México', lat: 17.9968056, lon: -92.8180028, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'ZCL', oaci: 'MMZC', name: 'Aeropuerto Internacional de Zacatecas', city: 'Zacatecas', country: 'México', lat: 22.895975, lon: -102.6865778, landingFee: 1300, handlingFeePerTon: 90 },
    { iata: 'TEB', oaci: 'KTEB', name: 'Teterboro Airport', city: 'New Jersey / Nueva York', country: 'USA', lat: 40.8583333, lon: -74.0615306, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'OPF', oaci: 'KOPF', name: 'Miami Opa Locka Executive Airport', city: 'Miami', country: 'USA', lat: 25.9074694, lon: -80.2774167, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'HOU', oaci: 'KHOU', name: 'Houston William P. Hobby Airport', city: 'Houston', country: 'USA', lat: 29.6459139, lon: -95.2768944, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'DAL', oaci: 'KDAL', name: 'Dallas Love Field Airport', city: 'Dallas', country: 'USA', lat: 32.8438333, lon: -96.8484944, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'VNY', oaci: 'KVNY', name: 'Los Angeles Van Nuys Airport', city: 'Los Ángeles', country: 'USA', lat: 34.2096389, lon: -118.4896444, landingFee: 2500, handlingFeePerTon: 150 },
    { iata: 'SCF', oaci: 'KSDL', name: 'Scottsdale Airport', city: 'Arizona', country: 'USA', lat: 33.6204278, lon: -111.9152944, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'BRO', oaci: 'KBRO', name: 'Brownsville South Padre Island International Airport', city: 'Brownsville', country: 'USA', lat: 25.9060361, lon: -97.4328889, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'MFE', oaci: 'KMFE', name: 'McAllen Miller International Airport', city: 'McAllen', country: 'USA', lat: 26.1770583, lon: -98.2391389, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'MYF', oaci: 'KMYF', name: 'San Diego Montgomery Field Airport', city: 'San Diego', country: 'USA', lat: 32.8127472, lon: -117.1414083, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'DVT', oaci: 'KDVT', name: 'Phoenix Deer Valley Airport', city: 'Phoenix', country: 'USA', lat: 33.6854111, lon: -112.0832639, landingFee: 2400, handlingFeePerTon: 140 },
    { iata: 'SAT', oaci: 'KSAT', name: 'San Antonio International Airport', city: 'San Antonio', country: 'USA', lat: 29.5331278, lon: -98.4705444, landingFee: 2400, handlingFeePerTon: 140 }
];


export const INITIAL_GLOBAL_COST_PARAMETERS: GlobalCostParameters = {
    fuelPricePerLiter: 1.5, // USD
    navigationChargePerKm: 0.5 // USD
};

export const INITIAL_TAX_CATALOG: AirportTax[] = [];

export const TAX_CONCEPTS = [
    'Tarifa de Uso de Aeropuerto (TUA)',
    'Servicios a la Navegación en el Espacio Aéreo Mexicano (SENEAM)',
    'Migración (INM)',
    'Aduana',
    'Impuesto al Valor Agregado (IVA)',
    'Otros Cargos',
];

export const BILLING_UNITS = [
    { id: BillingUnit.PER_PASSENGER, name: 'Por Pasajero' },
    { id: BillingUnit.PER_TON, name: 'Por Tonelada' },
    { id: BillingUnit.PER_FLIGHT, name: 'Por Vuelo' },
];