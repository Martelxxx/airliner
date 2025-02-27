// src/Components/FlightLegSummary.jsx
import React, { useContext } from 'react';
import { FlightPlannerContext } from '../../MainContent/FlightPlanner/FlightPlannerContext';
import { formatTime, formatFlightTime } from '../../Services/utils';
import moment from 'moment';
import airportData from 'airport-data';

const FUEL_PRICE_PER_KG = 0.80; // $0.80/kg, adjustable

const calculatePricing = (aircraft, distance) => {
  const basePricePerKm = {
    CRJ700: 0.1,
    'B737-8': 0.12,
    'B787-8': 0.15,
    'A350-900': 0.18,
  };

  const basePrice = basePricePerKm[aircraft] * distance;
  return {
    economy: (basePrice * 1).toFixed(2),
    business: (basePrice * 2).toFixed(2),
    firstClass: (basePrice * 3).toFixed(2),
  };
};

const getMealService = (distance) => {
  if (distance < 500) return 'Snack';
  if (distance < 1500) return 'Light Meal';
  return 'Full Meal';
};

const getRandomTerminalAndGate = () => {
  const terminals = ['A', 'B', 'C', 'D', 'E'];
  const gates = Array.from({ length: 30 }, (_, i) => i + 1);
  const terminal = terminals[Math.floor(Math.random() * terminals.length)];
  const gate = gates[Math.floor(Math.random() * gates.length)];
  return { terminal, gate };
};

const FlightLegSummary = () => {
  const { legs, airportDetails } = useContext(FlightPlannerContext);

  // Function to get airport name, city, and country from ICAO
  const getAirportInfo = (icao) => {
    const airport = airportData.find(a => a.icao === icao);
    return {
      name: airport ? airport.name : 'Unknown Airport',
      city: airport ? airport.city : 'Unknown City',
      country: airport ? airport.country : 'Unknown Country',
    };
  };

  return (
    <div className="flight-leg-summary">
      <h2>Flight Leg Summary</h2>
      
      {legs.length === 0 ? (
        <p>No legs available</p>
      ) : (
        legs.map((leg, index) => {
          const nextLeg = legs[index + 1];
          const layoverTime = nextLeg ? moment(nextLeg.departureTime).diff(moment(leg.arrivalTime), 'hours', true) : 0;
          const pricing = calculatePricing(leg.aircraft, Math.round(leg.distance));
          const mealService = getMealService(Math.round(leg.distance));
          const departureTerminalGate = getRandomTerminalAndGate();
          const arrivalTerminalGate = getRandomTerminalAndGate();
          const checkInTime = moment(leg.departureTime).subtract(2, 'hours').format('hh:mm A');
          const boardingTime = moment(leg.departureTime).subtract(45, 'minutes').format('hh:mm A');

          const originInfo = getAirportInfo(leg.origin);
          const destinationInfo = getAirportInfo(leg.destination);
          const fuelCost = (leg.fuelConsumption * FUEL_PRICE_PER_KG).toFixed(2);

          return (
            <div key={index} className="leg-itinerary">
              <h3>Leg {index + 1}</h3>
              <div className="itinerary-columns">
                <div className="column">
                  <p><strong>Aircraft:</strong> {leg.aircraft}</p>
                  <p><strong>Check-in Time:</strong> {checkInTime}</p>
                  <p><strong>Boarding Time:</strong> {boardingTime}</p>
                  <p><strong>Departure Terminal/Gate:</strong> {departureTerminalGate.terminal}/{departureTerminalGate.gate}</p>
                  <p><strong>Arrival Terminal/Gate:</strong> {arrivalTerminalGate.terminal}/{arrivalTerminalGate.gate}</p>
                </div>
                <div className="column">
                  <p><strong>Meal Service:</strong> {mealService}</p>
                  <p><strong>Scheduled Departure Time:</strong> {formatTime(leg.departureTime)}</p>
                  <p><strong>Scheduled Time of Arrival (STA):</strong> {formatTime(leg.arrivalTime)}</p>
                  <p><strong>Origin:</strong> {leg.origin} ({originInfo.name}, {originInfo.city}, {originInfo.country})</p>
                  <p><strong>Destination:</strong> {leg.destination} ({destinationInfo.name}, {destinationInfo.city}, {destinationInfo.country})</p>
                </div>
                <div className="column">
                  {nextLeg && <p><strong>Layover Time:</strong> {formatFlightTime(layoverTime)}</p>}
                  <p><strong>Distance:</strong> {Math.round(leg.distance)} km</p>
                  <p><strong>Fuel Required:</strong> {leg.fuelConsumption} kg</p>
                  <p><strong>Fuel Cost:</strong> ${fuelCost}</p>
                  <div className="pricing">
                    <p><strong>Economy:</strong> ${pricing.economy}</p>
                    <p><strong>Business:</strong> ${pricing.business}</p>
                    <p><strong>First Class:</strong> ${pricing.firstClass}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <style jsx>{`
        .flight-leg-summary {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .leg-itinerary {
          border: 2px solid #333;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .leg-itinerary h3 {
          margin-top: 0;
          font-size: 1.2em;
          border-bottom: 1px solid #ccc;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .itinerary-columns {
          display: flex;
          justify-content: space-between;
        }
        .column {
          flex: 1;
          padding: 0 10px;
        }
        .leg-itinerary p {
          margin: 8px 0;
          font-size: 0.9em;
        }
        .pricing {
          margin-top: 12px;
        }
        .pricing p {
          margin: 4px 0;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default FlightLegSummary;