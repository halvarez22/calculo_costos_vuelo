

export interface Airport {
  iata: string;
  oaci: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  landingFee: number;
  handlingFeePerTon: number;
}

export interface Pilot {
  id: string;
  name: string;
  costPerHour: number;
}

export interface MaintenanceProgram {
  id: string;
  aircraftId: string; // Registration
  name: string;
  cost: number;
  intervalFh: number; // Interval in Flight Hours
  description?: string;
}

export interface Aircraft {
  id: string; // Matrícula/Registration, debe ser único
  brand: string;
  model: string;
  registration: string;
  passengers: number;
  averageSpeedKmh: number;
  fuelConsumptionLph: number; // Liters per hour
  fovCostPerFh: number; // Fixed Operating Venues prorated per flight hour
  weightTon: number;
}

export enum OperationType {
  NATIONAL = 'Nacional',
  INTERNATIONAL = 'Internacional',
}

export enum BillingUnit {
  PER_PASSENGER = 'Por Pasajero',
  PER_TON = 'Por Tonelada',
  PER_FLIGHT = 'Por Vuelo',
}

export enum TaxStatus {
    ACTIVE = 'Activo',
    INACTIVE = 'Inactivo',
}

export interface AirportTax {
    id: string;
    airportIata: string;
    concept: string;
    operationType: OperationType;
    baseRate: number;
    criticalHourRate: number;
    billingUnit: BillingUnit;
    effectiveDate: string; // YYYY-MM-DD
    status: TaxStatus;
    description?: string;
    notes?: string;
}

export interface AppliedTax {
    concept: string;
    cost: number;
}

export interface FlightTrackPoint {
  lat: number;
  lon: number;
  timestamp: number;
}

export interface CalculationBreakdown {
  // Inputs
  aircraft: Aircraft;
  distanceKm: number;
  flightHours: number;
  originAirport: Airport;
  destinationAirport: Airport;
  pilotInCommand: Pilot;
  firstOfficer: Pilot;
  // Calculated Costs
  fuelCost: number;
  maintenanceCost: number;
  crewCost: number;
  fovCost: number;
  landingAndHandlingCost: number;
  navigationCost: number;
  taxCost: number;
  appliedTaxes: AppliedTax[];
  // Totals
  totalCost: number;
  costPerHour: number;
}

export interface FormData {
  aircraftId: string;
  pilotInCommandId: string;
  firstOfficerId: string;
  flightDataCsv: string;
}

export interface GlobalCostParameters {
  fuelPricePerLiter: number;
  navigationChargePerKm: number;
}

export type ManagerView = 'aircraft' | 'airports' | 'globals' | 'taxes' | 'pilots' | 'maintenance';