

import { FormData, CalculationBreakdown, Aircraft, Airport, GlobalCostParameters, AirportTax, OperationType, BillingUnit, TaxStatus, AppliedTax, Pilot, MaintenanceProgram, FlightTrackPoint } from '../types';

// Haversine distance function - can be used for segments
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// New function to parse the CSV data from Flightradar24
export function parseFlightData(csvData: string): { track: FlightTrackPoint[], callsign: string | null } {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) return { track: [], callsign: null };

    const header = lines[0].split(',').map(h => h.trim());
    const positionIndex = header.indexOf('Position');
    const timestampIndex = header.indexOf('Timestamp');
    const callsignIndex = header.indexOf('Callsign');

    if (positionIndex === -1 || timestampIndex === -1) {
        throw new Error("El CSV debe contener las columnas 'Timestamp' y 'Position'.");
    }

    let callsign: string | null = null;
    const track: FlightTrackPoint[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line properly handling quoted values
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
        if (values.length <= Math.max(positionIndex, timestampIndex)) continue;

        const timestamp = parseInt(values[timestampIndex], 10);
        const positionStr = values[positionIndex].replace(/"/g, '');
        
        // Handle both formats: "lat,lon" and "lat,lon" (without quotes)
        let lat: number, lon: number;
        
        if (positionStr.includes(',')) {
            // Format: "lat,lon" or lat,lon
            const position = positionStr.split(',');
            if (position.length === 2) {
                lat = parseFloat(position[0].trim());
                lon = parseFloat(position[1].trim());
            } else {
                continue; // Skip invalid position format
            }
        } else {
            // Single value, skip
            continue;
        }

        if (!isNaN(lat) && !isNaN(lon) && !isNaN(timestamp)) {
            track.push({ lat, lon, timestamp });
            if (!callsign && callsignIndex !== -1 && values[callsignIndex]) {
                callsign = values[callsignIndex].replace(/"/g, '').trim();
            }
        }
    }
    return { track, callsign };
}

// New function to calculate total distance and flight hours from the track
export function calculateTrackDetails(track: FlightTrackPoint[]): { distanceKm: number, flightHours: number } {
    if (track.length < 2) return { distanceKm: 0, flightHours: 0 };

    let totalDistanceKm = 0;
    for (let i = 1; i < track.length; i++) {
        const p1 = track[i - 1];
        const p2 = track[i];
        totalDistanceKm += haversineDistance(p1.lat, p1.lon, p2.lat, p2.lon);
    }

    const startTime = track[0].timestamp;
    const endTime = track[track.length - 1].timestamp;
    const durationSeconds = endTime - startTime;
    const flightHours = durationSeconds / 3600;

    return { distanceKm: totalDistanceKm, flightHours };
}

// New function to find the closest airport to a given coordinate
export function findClosestAirport(lat: number, lon: number, airportCatalog: Airport[]): Airport | null {
    if (!airportCatalog || airportCatalog.length === 0) return null;

    let closestAirport: Airport | null = null;
    let minDistance = Infinity;

    for (const airport of airportCatalog) {
        const distance = haversineDistance(lat, lon, airport.lat, airport.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closestAirport = airport;
        }
    }

    return closestAirport;
}


export function calculateFlightCosts(
  formData: FormData, 
  aircraftCatalog: Aircraft[], 
  airportCatalog: Airport[],
  pilotCatalog: Pilot[],
  globalParams: GlobalCostParameters,
  taxCatalog: AirportTax[],
  maintenanceProgramCatalog: MaintenanceProgram[]
): CalculationBreakdown | null {
  const { flightDataCsv, aircraftId, pilotInCommandId, firstOfficerId } = formData;
  
  if (!flightDataCsv.trim()) return null;

  // Step 1: Parse flight data and find aircraft/pilots
  const { track } = parseFlightData(flightDataCsv);
  if (track.length < 2) return null;

  const aircraft = aircraftCatalog.find(ac => ac.id === aircraftId);
  const pilotInCommand = pilotCatalog.find(p => p.id === pilotInCommandId);
  const firstOfficer = pilotCatalog.find(p => p.id === firstOfficerId);

  // Step 2: Determine origin and destination airports
  const originCoord = track[0];
  const destinationCoord = track[track.length - 1];
  const originAirport = findClosestAirport(originCoord.lat, originCoord.lon, airportCatalog);
  const destinationAirport = findClosestAirport(destinationCoord.lat, destinationCoord.lon, airportCatalog);

  if (!aircraft || !originAirport || !destinationAirport || !pilotInCommand || !firstOfficer) {
    // This could happen if parsing is ok but selections are bad or airports not found
    return null;
  }

  // Step 3: Calculate precise distance and time from track
  const { distanceKm, flightHours } = calculateTrackDetails(track);
  if (flightHours <= 0) return null; // Avoid division by zero


  // Step 4: Calculate costs using the precise data (same logic as before)
  const applicableMaintenancePrograms = maintenanceProgramCatalog.filter(
    prog => prog.aircraftId === aircraft.id
  );
  const totalMaintenanceCostPerHour = applicableMaintenancePrograms.reduce((total, prog) => {
    if (prog.intervalFh > 0) {
      return total + (prog.cost / prog.intervalFh);
    }
    return total;
  }, 0);
  const maintenanceCost = flightHours * totalMaintenanceCostPerHour;

  const fuelCost = flightHours * aircraft.fuelConsumptionLph * globalParams.fuelPricePerLiter;
  const crewCost = flightHours * (pilotInCommand.costPerHour + firstOfficer.costPerHour);
  const fovCost = flightHours * aircraft.fovCostPerFh;
  const landingAndHandlingCost = destinationAirport.landingFee + (destinationAirport.handlingFeePerTon * aircraft.weightTon);
  const navigationCost = distanceKm * globalParams.navigationChargePerKm;

  // Tax Calculation
  const isInternational = originAirport.country !== destinationAirport.country;
  const operationType = isInternational ? OperationType.INTERNATIONAL : OperationType.NATIONAL;
  const today = new Date().toISOString().split('T')[0];

  const applicableTaxes = taxCatalog.filter(tax => 
    tax.airportIata === destinationAirport.iata &&
    tax.status === TaxStatus.ACTIVE &&
    tax.effectiveDate <= today &&
    (tax.operationType === operationType || (isInternational && tax.operationType === OperationType.INTERNATIONAL))
  );

  const appliedTaxes: AppliedTax[] = [];
  let totalTaxCost = 0;

  applicableTaxes.forEach(tax => {
    let cost = 0;
    switch (tax.billingUnit) {
      case BillingUnit.PER_PASSENGER:
        cost = tax.baseRate * aircraft.passengers;
        break;
      case BillingUnit.PER_TON:
        cost = tax.baseRate * aircraft.weightTon;
        break;
      case BillingUnit.PER_FLIGHT:
        cost = tax.baseRate;
        break;
    }
    if(cost > 0) {
        appliedTaxes.push({ concept: tax.concept, cost });
        totalTaxCost += cost;
    }
  });

  const totalCost = fuelCost + maintenanceCost + crewCost + fovCost + landingAndHandlingCost + navigationCost + totalTaxCost;
  const costPerHour = flightHours > 0 ? totalCost / flightHours : 0;
  
  return {
    aircraft,
    distanceKm,
    flightHours,
    originAirport,
    destinationAirport,
    pilotInCommand,
    firstOfficer,
    fuelCost,
    maintenanceCost,
    crewCost,
    fovCost,
    landingAndHandlingCost,
    navigationCost,
    taxCost: totalTaxCost,
    appliedTaxes,
    totalCost,
    costPerHour,
  };
}