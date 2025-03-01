// src/Components/AircraftInfo.jsx
import React, { useState } from 'react';
import crjImage from '../../../assets/crj.png';
import b737Image from '../../../assets/738.png';
import b787Image from '../../../assets/788.png';
import a350Image from '../../../assets/a350.png';

const aircraftData = [
  {
    name: 'CRJ700',
    image: crjImage,
    paxCapacity: 70,
    speed: 447,
    range: 770,
    fuelConsumption: { 49: 2651, 88: 2603, 103: 2577, 381: 3566, 806: 4059, 1442: 5786 },
    oew: 19000,
    minCG: 15,
    maxCG: 25,
  },
  {
    name: '737-800 (B737-8)',
    image: b737Image,
    paxCapacity: 189,
    speed: 460,
    range: 3500,
    fuelConsumption: { 49: 4248, 88: 3685, 103: 4564, 381: 5405, 806: 6710, 1442: 9549 },
    oew: 41000,
    minCG: 13,
    maxCG: 25,
  },
  {
    name: '787-8 (B787-8)',
    image: b787Image,
    paxCapacity: 242,
    speed: 488,
    range: 7300,
    fuelConsumption: { 49: 7406, 88: 6424, 103: 7976, 381: 9757, 806: 12098, 1442: 15861 },
    oew: 119000,
    minCG: 10,
    maxCG: 30,
  },
  {
    name: 'A350-900',
    image: a350Image,
    paxCapacity: 325,
    speed: 488,
    range: 8100,
    fuelConsumption: { 49: 8719, 88: 7671, 103: 9299, 381: 11060, 806: 14468, 1442: 19429 },
    oew: 142000,
    minCG: 12,
    maxCG: 28,
  },
];

// Calculate fuel burn rates
const calculateFuelBurnRates = (aircraft) => {
  const distances = Object.keys(aircraft.fuelConsumption).map(Number);
  const totalFuel = Object.values(aircraft.fuelConsumption).reduce((sum, fuel) => sum + fuel, 0);
  const totalTimeHours = distances.reduce((sum, dist) => sum + (dist / aircraft.speed), 0);
  
  const kgPerHour = totalFuel / totalTimeHours;
  const lbPerHour = kgPerHour * 2.20462;
  const galPerHour = kgPerHour / 3.125;

  return {
    kgPerHour: Math.round(kgPerHour),
    lbPerHour: Math.round(lbPerHour),
    galPerHour: Math.round(galPerHour),
  };
};

// Calculate CG in %MAC
const calculateCG = (aircraft, paxCount, fuelWeight) => {
  const name = aircraft.name;
  let oewArm, paxArm, fuelArm, minArm, maxArm;

  switch (name) {
    case 'CRJ700':
      oewArm = 10; paxArm = 12; fuelArm = 11;
      minArm = 10; maxArm = 12;
      break;
    case '737-800 (B737-8)':
      oewArm = 15; paxArm = 18; fuelArm = 16;
      minArm = 15; maxArm = 18;
      break;
    case '787-8 (B787-8)':
      oewArm = 20; paxArm = 24; fuelArm = 22;
      minArm = 20; maxArm = 24;
      break;
    case 'A350-900':
      oewArm = 25; paxArm = 30; fuelArm = 27;
      minArm = 25; maxArm = 30;
      break;
    default:
      return 'N/A';
  }

  const oew = aircraft.oew;
  const paxWeight = paxCount * 84;
  const luggageWeight = paxCount * 44;
  const palletCount = Math.floor(paxCount / 20);
  const palletWeight = palletCount * 100;
  const payloadWeight = paxWeight + luggageWeight + palletWeight;

  const totalMoment = (oew * oewArm) + (payloadWeight * paxArm) + (fuelWeight * fuelArm);
  const totalWeight = oew + payloadWeight + fuelWeight;
  const cgDistance = totalMoment / totalWeight;

  const cgPercentMac = aircraft.minCG + ((cgDistance - minArm) / (maxArm - minArm)) * (aircraft.maxCG - aircraft.minCG);
  return Math.max(aircraft.minCG, Math.min(aircraft.maxCG, cgPercentMac)).toFixed(1);
};

// Trim calculation function with aircraft-specific formulas
const calculateTrim = (aircraft, weight, cg, flaps) => {
  const name = aircraft.name;
  let trim;
  switch (name) {
    case 'CRJ700':
      trim = 25 - cg;
      break;
    case '737-800 (B737-8)':
      trim = 0.767 * (25 - cg);
      break;
    case '787-8 (B787-8)':
      trim = 15 - (cg / 2);
      break;
    case 'A350-900':
      trim = 17.5 - 0.625 * cg;
      break;
    default:
      trim = null;
  }
  return trim ? trim.toFixed(1) : 'N/A';
};

const AircraftInfo = () => {
  const [trimData, setTrimData] = useState(
    aircraftData.map(() => ({
      paxCount: '', fuelWeight: '',
      weight: '', cg: '', flaps: '', trim: null
    }))
  );

  const handleInputChange = (index, field, value) => {
    const newTrimData = [...trimData];
    newTrimData[index][field] = value;

    const paxCount = parseFloat(newTrimData[index].paxCount) || 0;
    const fuelWeight = parseFloat(newTrimData[index].fuelWeight) || 0;
    const oew = aircraftData[index].oew;

    if (paxCount >= 0 && fuelWeight >= 0) {
      const paxWeight = paxCount * 84;
      const luggageWeight = paxCount * 44;
      const palletCount = Math.floor(paxCount / 20);
      const palletWeight = palletCount * 100;
      const payloadWeight = paxWeight + luggageWeight + palletWeight;
      newTrimData[index].weight = (oew + payloadWeight + fuelWeight).toString();
      newTrimData[index].cg = calculateCG(aircraftData[index], paxCount, fuelWeight);
    }

    if (newTrimData[index].weight && newTrimData[index].cg && newTrimData[index].flaps) {
      newTrimData[index].trim = calculateTrim(
        aircraftData[index],
        parseFloat(newTrimData[index].weight),
        parseFloat(newTrimData[index].cg),
        parseFloat(newTrimData[index].flaps)
      );
    } else {
      newTrimData[index].trim = null;
    }

    setTrimData(newTrimData);
  };

  return (
    <div className="aircraft-info">
      <h1>Aircraft Fleet Information</h1>
      <p className="intro">Explore detailed specifications of our aircraft fleet.</p>
      <div className="aircraft-list">
        {aircraftData.map((aircraft, index) => {
          const { kgPerHour, lbPerHour, galPerHour } = calculateFuelBurnRates(aircraft);
          return (
            <div key={index} className="aircraft-card">
              <div className="aircraft-details">
                <h2>{aircraft.name}</h2>
                <img src={aircraft.image} alt={aircraft.name} className="aircraft-image" />
                <div className="detail-row">
                  <span className="label">Passenger Capacity:</span>
                  <span className="value">{aircraft.paxCapacity}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Cruising Speed:</span>
                  <span className="value">{aircraft.speed} knots</span>
                </div>
                <div className="detail-row">
                  <span className="label">Range:</span>
                  <span className="value">{aircraft.range} nm</span>
                </div>
                <h3>Fuel Consumption Rates</h3>
                <div className="detail-row">
                  <span className="label">kg/h:</span>
                  <span className="value">{kgPerHour}</span>
                </div>
                <div className="detail-row">
                  <span className="label">lb/h:</span>
                  <span className="value">{lbPerHour}</span>
                </div>
                <div className="detail-row">
                  <span className="label">GPH:</span>
                  <span className="value">{galPerHour}</span>
                </div>
                <div className="trim-calc">
                  <h3>Takeoff Trim Calculator</h3>
                  <div className="trim-row">
                    <label>OEW (kg):</label>
                    <span className="trim-value">{aircraft.oew} kg</span>
                  </div>
                  <div className="trim-row">
                    <label>Number of Pax:</label>
                    <input
                      type="number"
                      value={trimData[index].paxCount}
                      onChange={(e) => handleInputChange(index, 'paxCount', e.target.value)}
                      placeholder="Enter pax count"
                      min="0"
                      max={aircraft.paxCapacity}
                    />
                  </div>
                  <div className="trim-row">
                    <label>Fuel Weight (kg):</label>
                    <input
                      type="number"
                      value={trimData[index].fuelWeight}
                      onChange={(e) => handleInputChange(index, 'fuelWeight', e.target.value)}
                      placeholder="Enter fuel weight"
                      min="0"
                    />
                  </div>
                  <div className="trim-row">
                    <label>Takeoff Weight (kg):</label>
                    <span className="trim-value">
                      {trimData[index].weight ? `${trimData[index].weight} kg` : 'N/A'}
                    </span>
                  </div>
                  <div className="trim-row">
                    <label>CG (%MAC):</label>
                    <span className="trim-value">
                      {trimData[index].cg ? `${trimData[index].cg} %` : 'N/A'}
                    </span>
                  </div>
                  <div className="trim-row">
                    <label>Flap Setting (degrees):</label>
                    <input
                      type="number"
                      value={trimData[index].flaps}
                      onChange={(e) => handleInputChange(index, 'flaps', e.target.value)}
                      placeholder="Enter flaps"
                      min="0"
                    />
                  </div>
                  <div className="trim-row">
                    <label>Trim Setting:</label>
                    <span className="trim-value">
                      {trimData[index].trim !== null ? `${trimData[index].trim} units` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .aircraft-info {
          font-family: 'Roboto', Arial, sans-serif;
          padding: 2rem;
          max-width: 1200px;
          margin: 2rem auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 2rem;
          color: #1a2b49;
          margin: 0 0 0.5rem;
          text-align: center;
          font-weight: 500;
        }

        .intro {
          font-size: 1rem;
          color: #64748b;
          text-align: center;
          margin-bottom: 2rem;
        }

        .aircraft-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .aircraft-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-height: 700px; /* Increased for vertical layout */
        }

        .aircraft-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .aircraft-image {
          width: 100%;
          max-height: 300px;
          height: auto;
          object-fit: contain;
          border-radius: 6px;
          margin: 1rem 0;
          border: 1px solid #e2e8f0;
        }

        .aircraft-details {
          display: flex;
          flex-direction: column;
        }

        h2 {
          font-size: 1.5rem;
          color: #1a2b49;
          margin: 0 0 0.5rem;
          font-weight: 600;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.25rem;
          text-align: center;
        }

        h3 {
          font-size: 1.25rem;
          color: #1a2b49;
          margin: 1.5rem 0 1rem;
          font-weight: 500;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }

        .value {
          font-size: 1rem;
          color: #1a2b49;
          font-weight: 400;
        }

        .trim-calc {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .trim-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem 0;
        }

        .trim-row label {
          font-size: 0.95rem;
          color: #475569;
          font-weight: 500;
        }

        .trim-row input {
          width: 100%;
          padding: 0.5rem;
          font-size: 0.95rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          background: #ffffff;
          color: #1a2b49;
          transition: border-color 0.2s ease;
        }

        .trim-row input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .trim-value {
          font-size: 0.95rem;
          color: #1a2b49;
          font-weight: 400;
          padding: 0.5rem;
          background: #e2e8f0;
          border-radius: 4px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default AircraftInfo;