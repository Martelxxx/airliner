// src/Components/FlightPlanner/index.jsx
import React, { useContext, useState } from 'react';
import LegDetails from '../../MainContent/FlightPlanner/LegDetails/LegDetails';
import { FlightPlannerContext } from './FlightPlannerContext';
import { calculateDistance, formatFlightTime } from '../../Services/utils';
import airportData from 'airport-data';
import moment from 'moment';

const aircraftSpecs = {
  CRJ700: { paxCapacity: 70, speed: 447, range: 770 },
  'B737-8': { paxCapacity: 189, speed: 460, range: 3500 },
  'B787-8': { paxCapacity: 242, speed: 488, range: 7300 },
  'A350-900': { paxCapacity: 325, speed: 488, range: 8100 },
};

const fuelConsumption = {
  CRJ700: { 49: 2651, 88: 2603, 103: 2577, 381: 3566, 806: 4059, 1442: 5786 },
  'B737-8': { 49: 4248, 88: 3685, 103: 4564, 381: 5405, 806: 6710, 1442: 9549 },
  'B787-8': { 49: 7406, 88: 6424, 103: 7976, 381: 9757, 806: 12098, 1442: 15861 },
  'A350-900': { 49: 8719, 88: 7671, 103: 9299, 381: 11060, 806: 14468, 1442: 19429 },
};

const distances = [49, 88, 103, 381, 806, 1442];
const FUEL_PRICE_PER_KG = 0.80;
const FUEL_RESERVE_FACTOR = 1.235;

const interpolateFuel = (aircraft, distance) => {
  const data = fuelConsumption[aircraft];
  if (distance <= distances[0]) return data[distances[0]];
  if (distance >= distances[distances.length - 1]) return data[distances[distances.length - 1]];

  for (let i = 0; i < distances.length - 1; i++) {
    if (distance >= distances[i] && distance <= distances[i + 1]) {
      const x0 = distances[i];
      const x1 = distances[i + 1];
      const y0 = data[x0];
      const y1 = data[x1];
      return y0 + (y1 - y0) * ((distance - x0) / (x1 - x0));
    }
  }
  return 0;
};

const namesByRegion = {
  'North America': {
    firstNames: ['John', 'Jane', 'Michael', 'Emily', 'James', 'Mary', 'Robert', 'Patricia', 'David', 'Linda', /* ... */],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', /* ... */],
    celebrityNames: ['Tom Hanks', 'Beyoncé Knowles', 'LeBron James', 'Oprah Winfrey', 'Brad Pitt', /* ... */],
  },
  Europe: {
    firstNames: ['Hans', 'Sophie', 'Liam', 'Emma', 'Noah', 'Olivia', 'Lucas', 'Mia', 'Elias', 'Charlotte', /* ... */],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', /* ... */],
    celebrityNames: ['David Beckham', 'Adele Adkins', 'Daniel Craig', 'Emma Watson', 'Cristiano Ronaldo', /* ... */],
  },
  Asia: {
    firstNames: ['Wei', 'Mei', 'Hiro', 'Yuki', 'Li', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang', /* ... */],
    lastNames: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim', /* ... */],
    celebrityNames: ['Jackie Chan', 'Priyanka Chopra', 'BTS Jin', 'Deepika Padukone', 'Jet Li', /* ... */],
  },
  Africa: {
    firstNames: ['Kwame', 'Amina', 'Tunde', 'Zara', 'Abdul', 'Fatima', 'Omar', 'Aisha', 'Ali', 'Maryam', /* ... */],
    lastNames: ['Abebe', 'Adebayo', 'Adeniyi', 'Afolabi', 'Agbaje', 'Agyeman', 'Akinyemi', 'Amadi', 'Asante', 'Ayodele', /* ... */],
    celebrityNames: ['Nelson Mandela', 'Burna Boy', 'Sadio Mané', 'Trevor Noah', 'Chimamanda Adichie', /* ... */],
  },
  'South America': {
    firstNames: ['Carlos', 'Maria', 'Juan', 'Ana', 'Luis', 'Carmen', 'Jose', 'Isabel', 'Jorge', 'Luisa', /* ... */],
    lastNames: ['Gomez', 'Rodriguez', 'Martinez', 'Garcia', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', /* ... */],
    celebrityNames: ['Lionel Messi', 'Shakira Mebarak', 'Neymar Jr', 'Sofía Vergara', 'Gabriel García', /* ... */],
  },
  'Middle East': {
    firstNames: ['Ahmed', 'Layla', 'Omar', 'Fatima', 'Youssef', 'Sara', 'Khalid', 'Aisha', 'Hassan', 'Noor', /* ... */],
    lastNames: ['Al-Farsi', 'Hassan', 'Khan', 'Al-Sayed', 'Qasim', 'Nasser', 'Jaber', 'Rahim', 'Moussa', 'Ibrahim', /* ... */],
    celebrityNames: ['Mohamed Salah', 'Amr Diab', 'Nancy Ajram', 'Haifa Wehbe', 'Omar Sharif', /* ... */],
  },
  Oceania: {
    firstNames: ['Jack', 'Sophie', 'Oliver', 'Amelia', 'Noah', 'Charlotte', 'James', 'Isla', 'Ethan', 'Mia', /* ... */],
    lastNames: ['Smith', 'Jones', 'Brown', 'Wilson', 'Taylor', 'Davis', 'Clark', 'Harris', 'Lewis', 'Walker', /* ... */],
    celebrityNames: ['Chris Hemsworth', 'Kylie Minogue', 'Hugh Jackman', 'Nicole Kidman', 'Russell Crowe', /* ... */],
  },
};

const getRegionFromICAO = (icao) => {
  if (!icao || typeof icao !== 'string') return 'North America';
  const prefix = icao[0].toUpperCase();
  switch (prefix) {
    case 'K': case 'C': case 'M': return 'North America';
    case 'E': case 'L': case 'B': case 'U': return 'Europe';
    case 'R': case 'Z': case 'V': case 'P': return 'Asia';
    case 'O': return 'Middle East';
    case 'F': case 'D': case 'H': return 'Africa';
    case 'S': return 'South America';
    case 'N': case 'Y': return 'Oceania';
    default: return 'North America';
  }
};

const generateName = (region) => {
  const firstNames = namesByRegion[region]?.firstNames;
  const lastNames = namesByRegion[region]?.lastNames;
  const celebrityNames = namesByRegion[region]?.celebrityNames;
  if (!firstNames || !lastNames || !celebrityNames) {
    throw new Error(`Region ${region} not found in namesByRegion`);
  }
  if (Math.random() < 0.1) {
    return celebrityNames[Math.floor(Math.random() * celebrityNames.length)];
  }
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generatePassengers = (origin, destination, count) => {
  const originRegion = getRegionFromICAO(origin);
  const destinationRegion = getRegionFromICAO(destination);
  if (!originRegion || !destinationRegion) {
    throw new Error(`Region not found for origin ${origin} or destination ${destination}`);
  }

  const allRegions = Object.keys(namesByRegion);
  const passengers = Array.from({ length: count }, () => {
    const rand = Math.random();
    let region;
    if (rand < 0.77) region = originRegion;
    else if (rand < 0.95) region = destinationRegion;
    else region = allRegions[Math.floor(Math.random() * allRegions.length)];
    const name = generateName(region);
    const age = Math.floor(Math.random() * 60) + 18;
    return { name, age };
  });
  return passengers;
};

const formatTime = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const generateSingleLeg = (
  origin,
  destination,
  departureTime = moment('2025-02-24T06:00'), // Default, overridden by input
  selectedAircraft = null
) => {
  const originAirport = airportData.find(a => a.icao === origin);
  const destAirport = airportData.find(a => a.icao === destination);
  if (!originAirport || !destAirport) {
    console.warn(`Airport not found: ${origin} or ${destination}`);
    return null;
  }

  const distanceNm = calculateDistance(
    parseFloat(originAirport.latitude),
    parseFloat(originAirport.longitude),
    parseFloat(destAirport.latitude),
    parseFloat(destAirport.longitude)
  );

  let aircraftData;
  if (selectedAircraft && aircraftSpecs[selectedAircraft]) {
    aircraftData = aircraftSpecs[selectedAircraft];
    if (distanceNm > aircraftData.range) {
      console.warn(
        `Manually selected aircraft ${selectedAircraft} with range ${aircraftData.range} NM cannot handle ${distanceNm} NM`
      );
      return null;
    }
  } else {
    const suitableAircraft = Object.entries(aircraftSpecs)
      .filter(([_, specs]) => specs.range >= distanceNm)
      .sort(([_, a], [__, b]) => a.range - b.range)[0];

    if (!suitableAircraft) {
      console.warn(`No aircraft can handle ${distanceNm} NM from ${origin} to ${destination}`);
      return null;
    }

    selectedAircraft = suitableAircraft[0];
    aircraftData = suitableAircraft[1];
  }

  const baseFlightTime = distanceNm / aircraftData.speed;
  const flightTime = baseFlightTime * 1.2;
  const blockTime = flightTime + 0.5;
  const arrivalTime = moment(departureTime).add(flightTime, 'hours');
  const paxCount = Math.floor(Math.random() * aircraftData.paxCapacity * 0.9) + 1;
  const passengers = generatePassengers(origin, destination, paxCount);
  const baseFuel = interpolateFuel(selectedAircraft, distanceNm);
  const fuelConsumption = Math.round(baseFuel * FUEL_RESERVE_FACTOR);

  return {
    origin,
    destination,
    aircraft: selectedAircraft,
    departureTime: moment(departureTime).format('YYYY-MM-DDTHH:mm'),
    arrivalTime: arrivalTime.format('YYYY-MM-DDTHH:mm'),
    flightTime: formatTime(flightTime),
    blockTime: formatTime(blockTime),
    distance: distanceNm,
    passengers,
    paxCount,
    fuelConsumption,
  };
};

const SingleLegGenerator = ({ onBack }) => {
  const { setSingleLeg } = useContext(FlightPlannerContext);
  const [originICAO, setOriginICAO] = useState('');
  const [destICAO, setDestICAO] = useState('');
  const [departureTimeInput, setDepartureTimeInput] = useState(''); // New state for departure time
  const [autoSelect, setAutoSelect] = useState(true);
  const [manualAircraft, setManualAircraft] = useState('CRJ700');

  const handleGenerateSingleLeg = () => {
    // Parse departure time or use default
    const parsedDepartureTime = departureTimeInput
      ? moment(departureTimeInput, 'hh:mm A', true).isValid()
        ? moment(`2025-02-24 ${departureTimeInput}`, 'YYYY-MM-DD hh:mm A')
        : (console.warn('Invalid departure time format, using default'), moment('2025-02-24T06:00'))
      : moment('2025-02-24T06:00');

    const aircraft = autoSelect ? null : manualAircraft;
    const leg = generateSingleLeg(originICAO, destICAO, parsedDepartureTime, aircraft);
    if (leg) {
      setSingleLeg(leg);
    }
  };

  return (
    <div className="single-leg-generator">
      <h1>Plan Single Flight Leg</h1>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Origin ICAO:
          <input
            type="text"
            value={originICAO}
            onChange={(e) => setOriginICAO(e.target.value.toUpperCase())}
            style={{ marginLeft: '8px' }}
          />
        </label>
        <label style={{ marginLeft: '16px' }}>
          Destination ICAO:
          <input
            type="text"
            value={destICAO}
            onChange={(e) => setDestICAO(e.target.value.toUpperCase())}
            style={{ marginLeft: '8px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Departure Time (e.g., 06:00 AM):
          <input
            type="text"
            value={departureTimeInput}
            onChange={(e) => setDepartureTimeInput(e.target.value)}
            placeholder="e.g., 06:00 AM"
            style={{ marginLeft: '8px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          <input
            type="checkbox"
            checked={autoSelect}
            onChange={(e) => setAutoSelect(e.target.checked)}
          />
          Auto-select aircraft based on distance
        </label>
        {!autoSelect && (
          <select
            value={manualAircraft}
            onChange={(e) => setManualAircraft(e.target.value)}
            style={{ marginLeft: '8px' }}
          >
            {Object.keys(aircraftSpecs).map((aircraft) => (
              <option key={aircraft} value={aircraft}>
                {aircraft} (Range: {aircraftSpecs[aircraft].range} NM)
              </option>
            ))}
          </select>
        )}
      </div>
      <button onClick={handleGenerateSingleLeg} style={{ marginRight: '8px' }}>
        Generate Single Leg
      </button>
      <button onClick={onBack}>Back to Planner</button>
    </div>
  );
};

const FlightPlanner = () => {
  const { legs, setLegs, setAirportDetails, singleLeg } = useContext(FlightPlannerContext);
  const [startingICAO, setStartingICAO] = useState('');
  const [showSingleLeg, setShowSingleLeg] = useState(false);

  const fetchAirportDetails = (icao) => {
    const airport = airportData.find(a => a.icao === icao);
    if (airport) {
      setAirportDetails({
        name: airport.name,
        longestRunway: airport.runways ? Math.max(...airport.runways.map(r => r.length)) : 'N/A',
      });
    } else {
      setAirportDetails(null);
    }
  };

  const handleICAOChange = (e) => {
    const icao = e.target.value.toUpperCase();
    setStartingICAO(icao);
    fetchAirportDetails(icao);
  };

  const generateSchedule = () => {
    let currentOrigin = startingICAO;
    let currentDepartureTime = moment('2025-02-24T06:00');
    const newLegs = [];
    const maxLegs = 5;
    let attempts = 0;
    const maxAttempts = 50;

    while (newLegs.length < maxLegs && attempts < maxAttempts) {
      const potentialDestinations = airportData.filter(airport => {
        const originAirport = airportData.find(a => a.icao === currentOrigin);
        if (!originAirport) return false;
        const lat1 = parseFloat(originAirport.latitude);
        const lon1 = parseFloat(originAirport.longitude);
        const lat2 = parseFloat(airport.latitude);
        const lon2 = parseFloat(airport.longitude);
        const distanceNm = calculateDistance(lat1, lon1, lat2, lon2);
        console.log(`Potential: ${currentOrigin} to ${airport.icao}, Distance: ${distanceNm} NM, Coords: (${lat1}, ${lon1}) to (${lat2}, ${lon2})`);
        return distanceNm <= aircraftSpecs['A350-900'].range && airport.icao !== currentOrigin;
      });

      if (potentialDestinations.length === 0) {
        attempts++;
        continue;
      }

      const destination = potentialDestinations
        .map(airport => airport.icao)
        .sort(() => Math.random() - 0.5)[0];

      const leg = generateSingleLeg(currentOrigin, destination, currentDepartureTime);
      if (!leg) {
        attempts++;
        continue;
      }

      const groundTimeMinutes = Math.floor(Math.random() * 21) + 40;
      const nextDepartureTime = moment(leg.arrivalTime).add(groundTimeMinutes, 'minutes');

      if (nextDepartureTime.isAfter(moment('2025-02-24T18:00'))) {
        attempts++;
        continue;
      }

      newLegs.push(leg);
      currentOrigin = destination;
      currentDepartureTime = nextDepartureTime;
      attempts = 0;
    }

    newLegs.forEach((leg, index) => {
      const aircraftRange = aircraftSpecs[leg.aircraft].range;
      if (leg.distance > aircraftRange) {
        console.error(
          `Validation failed: Leg ${index + 1} (${leg.origin} to ${leg.destination}) distance ${leg.distance} NM exceeds ${leg.aircraft} range ${aircraftRange} NM`
        );
      }
    });

    console.log('Final legs:', newLegs);
    setLegs(newLegs);
  };

  if (showSingleLeg) {
    return <SingleLegGenerator onBack={() => setShowSingleLeg(false)} />;
  }

  return (
    <div className="flight-planner">
      <h1>Flight Schedule Generator</h1>
      <div>
        <label>
          Starting Airport (ICAO):
          <input type="text" value={startingICAO} onChange={handleICAOChange} />
        </label>
        <button onClick={generateSchedule} style={{ marginLeft: '8px' }}>
          Generate Flight Schedule
        </button>
        <button onClick={() => setShowSingleLeg(true)} style={{ marginLeft: '8px' }}>
          Plan Single Leg
        </button>
      </div>
      <div className="flight-planner-content" style={{ display: 'flex', gap: '16px' }}>
        <section className="load-sheet-section" style={{ flex: 1 }}>
          <h2>Load Sheet</h2>
          <LegDetails legs={legs} />
        </section>
        {singleLeg && (
          <section className="single-leg-summary" style={{ flex: 1 }}>
            <h2>Single Leg Summary</h2>
            <LegDetails legs={[singleLeg]} />
          </section>
        )}
      </div>
    </div>
  );
};

export default FlightPlanner;