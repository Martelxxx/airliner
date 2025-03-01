// src/Components/AircraftInfo.jsx
import React from 'react';
import crjImage from '../../../assets/crj.png'; // Adjusted path as per your structure
import b737Image from '../../../assets/738.png';
import b787Image from '../../../assets/788.png';
import a350Image from '../../../assets/a350.png';

const aircraftData = [
  {
    name: 'CRJ700',
    image: crjImage,
    paxCapacity: 70,
    speed: 447, // knots
    range: 770, // nm
    fuelConsumption: { 49: 2651, 88: 2603, 103: 2577, 381: 3566, 806: 4059, 1442: 5786 }, // kg
  },
  {
    name: '737-800 (B737-8)',
    image: b737Image,
    paxCapacity: 189,
    speed: 460, // knots
    range: 3500, // nm
    fuelConsumption: { 49: 4248, 88: 3685, 103: 4564, 381: 5405, 806: 6710, 1442: 9549 }, // kg
  },
  {
    name: '787-8 (B787-8)',
    image: b787Image,
    paxCapacity: 242,
    speed: 488, // knots
    range: 7300, // nm
    fuelConsumption: { 49: 7406, 88: 6424, 103: 7976, 381: 9757, 806: 12098, 1442: 15861 }, // kg
  },
  {
    name: 'A350-900',
    image: a350Image,
    paxCapacity: 325,
    speed: 488, // knots
    range: 8100, // nm
    fuelConsumption: { 49: 8719, 88: 7671, 103: 9299, 381: 11060, 806: 14468, 1442: 19429 }, // kg
  },
];

// Calculate fuel burn rates
const calculateFuelBurnRates = (aircraft) => {
  const distances = Object.keys(aircraft.fuelConsumption).map(Number);
  const totalFuel = Object.values(aircraft.fuelConsumption).reduce((sum, fuel) => sum + fuel, 0);
  const totalTimeHours = distances.reduce((sum, dist) => sum + (dist / aircraft.speed), 0);
  
  const kgPerHour = totalFuel / totalTimeHours;
  const lbPerHour = kgPerHour * 2.20462; // 1 kg = 2.20462 lbs
  const galPerHour = kgPerHour / 3.125;   // Approx Jet-A: 6.8 lb/gal, 1 kg ≈ 0.32 gal

  return {
    kgPerHour: Math.round(kgPerHour),
    lbPerHour: Math.round(lbPerHour),
    galPerHour: Math.round(galPerHour),
  };
};

const AircraftInfo = () => {
  return (
    <div className="aircraft-info">
      <h1>Aircraft Fleet Information</h1>
      <p className="intro">Explore detailed specifications of our aircraft fleet.</p>
      <div className="aircraft-list">
        {aircraftData.map((aircraft, index) => {
          const { kgPerHour, lbPerHour, galPerHour } = calculateFuelBurnRates(aircraft);
          return (
            <div key={index} className="aircraft-card">
              <img src={aircraft.image} alt={aircraft.name} className="aircraft-image" />
              <div className="aircraft-details">
                <h2>{aircraft.name}</h2>
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
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .aircraft-info {
          font-family: 'Roboto', Arial, sans-serif;
          padding: 40px;
          max-width: 1280px;
          margin: 0 auto;
          background-color: #f5f7fa;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        h1 {
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 10px;
          text-align: center;
        }
        .intro {
          font-size: 1.2em;
          color: #7f8c8d;
          text-align: center;
          margin-bottom: 40px;
        }
        .aircraft-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 30px;
        }
        .aircraft-card {
          display: flex;
          border: none;
          border-radius: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 450px; /* Increased height for full images */
        }
        .aircraft-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        .aircraft-image {
          width: 250px; /* Wider for better visibility */
          height: auto;
          max-height: 400px; /* Ensure full image fits */
          margin-right: 20px;
          border-radius: 8px;
          object-fit: contain;
          border: 1px solid #e0e0e0;
        }
        .aircraft-details {
          flex: 1;
          padding: 10px 0;
        }
        h2 {
          font-size: 1.8em;
          color: #34495e;
          margin: 0 0 15px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 1.4em;
          color: #2c3e50;
          margin: 20px 0 10px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e6ed;
        }
        .label {
          font-weight: 600;
          color: #7f8c8d;
          font-size: 1.1em;
        }
        .value {
          color: #2c3e50;
          font-size: 1.1em;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AircraftInfo;