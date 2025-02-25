// src/Components/MainContent/FlightPlanner/LegPlanner/LegPlanner.jsx
import React, { useState, useEffect } from 'react';
import OriginInput from '../LegDetails/OriginInput';
import DestinationSelector from '../LegDetails/DestinationSelector';
import AircraftSelector from '../LegDetails/AircraftSelector';
import ScheduledTimeInputs from '../LegDetails/ScheduledTimeInputs';

const aircraftSpecs = {
  CRJ700: { speed: 447, range: 1430, paxCapacity: 70 },
  '737-800': { speed: 460, range: 2935, paxCapacity: 189 },
  '787-8': { speed: 488, range: 7310, paxCapacity: 242 },
  'A350-900': { speed: 488, range: 8100, paxCapacity: 325 },
};

// Distance lookup (nm); expand or replace with API later
const distanceTable = {
  'LHR (London Heathrow)-CAI (Cairo)': 2190,
  'LHR (London Heathrow)-DXB (Dubai)': 2960,
  'CAI (Cairo)-DXB (Dubai)': 1490,
  'CAI (Cairo)-LHR (London Heathrow)': 2190,
  'DXB (Dubai)-LHR (London Heathrow)': 2960,
  'DXB (Dubai)-CAI (Cairo)': 1490,
};

const LegPlanner = ({ onAddLeg }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [aircraft, setAircraft] = useState('CRJ700');
  const [departureTime, setDepartureTime] = useState(''); // Renamed from sta to clarify
  const [sta, setSta] = useState(''); // STA = ETA + 30 min
  const [offBlock, setOffBlock] = useState('');
  const [arrival, setArrival] = useState(''); // ATA
  const [currentSpeed, setCurrentSpeed] = useState(''); // Renamed from speed
  const [distanceLeft, setDistanceLeft] = useState('');
  const [windSpeed, setWindSpeed] = useState(''); // New: Wind speed (knots)
  const [windDirection, setWindDirection] = useState(''); // New: Wind direction (degrees)
  const [eta, setEta] = useState('');

  const calculateBlockTime = (distance) => {
    const speed = aircraftSpecs[aircraft].speed; // knots
    return (distance / speed) * 60; // minutes
  };

  const calculateETA = (distance, departure) => {
    const blockTime = calculateBlockTime(distance); // minutes
    const [hours, minutes] = departure.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0, 0);
    const etaDate = new Date(departureDate.getTime() + blockTime * 60000);
    return etaDate;
  };

  const calculateSTA = (etaDate) => {
    const staDate = new Date(etaDate.getTime() + 30 * 60000); // ETA + 30 min
    return staDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateATA = () => {
    if (currentSpeed && distanceLeft && windSpeed && windDirection) {
      // Convert wind direction to radians
      const windRad = (windDirection * Math.PI) / 180;
      // Assume aircraft heading is directly toward destination (simplified)
      // Effective ground speed = airspeed + wind component in flight direction
      const windComponent = windSpeed * Math.cos(windRad); // Simplified; assumes tailwind/headwind
      const groundSpeed = Number(currentSpeed) + windComponent; // knots
      const timeLeft = (distanceLeft / groundSpeed) * 60; // minutes
      const now = new Date();
      const ataDate = new Date(now.getTime() + timeLeft * 60000);
      setArrival(ataDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    if (origin && destination && aircraft && departureTime) {
      const routeKey = `${origin}-${destination}`;
      const distance = distanceTable[routeKey] || 500; // Fallback distance
      const etaDate = calculateETA(distance, departureTime);
      setEta(etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSta(calculateSTA(etaDate));
    } else {
      setEta('');
      setSta('');
    }
  }, [origin, destination, aircraft, departureTime]);

  const handleSubmit = () => {
    const routeKey = `${origin}-${destination}`;
    const distance = distanceTable[routeKey] || 500;
    const blockTime = calculateBlockTime(distance);
    const leg = {
      origin,
      destination,
      aircraft,
      blockTime,
      departureTime, // Previously sta
      sta,           // Now ETA + 30 min
      offBlock,
      arrival,       // ATA
      eta,
      distance,
    };
    onAddLeg(leg);
    // Reset form
    setOrigin('');
    setDestination('');
    setAircraft('CRJ700');
    setDepartureTime('');
    setSta('');
    setOffBlock('');
    setArrival('');
    setCurrentSpeed('');
    setDistanceLeft('');
    setWindSpeed('');
    setWindDirection('');
    setEta('');
  };

  return (
    <div>
      <OriginInput value={origin} onChange={(e) => setOrigin(e.target.value)} />
      <DestinationSelector value={destination} onChange={(e) => setDestination(e.target.value)} />
      <AircraftSelector value={aircraft} onChange={(e) => setAircraft(e.target.value)} />
      <ScheduledTimeInputs
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
        label="Departure Time"
      /> {/* Updated label */}
      <input
        type="text"
        placeholder="Actual Off-Block Time"
        value={offBlock}
        onChange={(e) => setOffBlock(e.target.value)}
      />
      <input
        type="number"
        placeholder="Current Airspeed (knots)"
        value={currentSpeed}
        onChange={(e) => setCurrentSpeed(e.target.value)}
      />
      <input
        type="number"
        placeholder="Distance Remaining (nm)"
        value={distanceLeft}
        onChange={(e) => setDistanceLeft(e.target.value)}
      />
      <input
        type="number"
        placeholder="Wind Speed (knots)"
        value={windSpeed}
        onChange={(e) => setWindSpeed(e.target.value)}
      />
      <input
        type="number"
        placeholder="Wind Direction (degrees)"
        value={windDirection}
        onChange={(e) => setWindDirection(e.target.value)}
      />
      <button onClick={calculateATA}>Calculate ATA</button>
      <button onClick={handleSubmit}>Add Leg</button>
      {eta && <p>Estimated Arrival Time (ETA): {eta}</p>}
      {sta && <p>Scheduled Arrival Time (STA): {sta}</p>}
      {arrival && <p>Actual Arrival Time (ATA): {arrival}</p>}
    </div>
  );
};

export default LegPlanner;