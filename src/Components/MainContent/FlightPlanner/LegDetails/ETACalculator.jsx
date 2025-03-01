// src/Components/ETACalculator.jsx
import React, { useState, useContext } from 'react';
import moment from 'moment';
import { FlightPlannerContext } from '../FlightPlannerContext'; // Adjust path if needed
import { formatTime } from '../../../Services/utils';

const aircraftSpecs = {
  CRJ700: { speed: 447 },      // Speed in knots
  'B737-8': { speed: 460 },
  'B787-8': { speed: 488 },
  'A350-900': { speed: 488 },
};

const TAXI_TIME_MINUTES = 48; // 48 minutes for taxiing, added to ETA only

const ETACalculator = () => {
  const { legs } = useContext(FlightPlannerContext);
  const [selectedLeg, setSelectedLeg] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [distance35, setDistance35] = useState('');
  const [distance70, setDistance70] = useState('');
  const [totalDistance, setTotalDistance] = useState('');
  const [sta, setSta] = useState('');

  // Handle leg selection
  const handleLegChange = (e) => {
    const legIndex = e.target.value;
    setSelectedLeg(legIndex);
    if (legIndex !== '') {
      const leg = legs[legIndex];
      setDepartureTime(moment(leg.departureTime).format('hh:mm A'));
      setSta(moment(leg.arrivalTime).format('hh:mm A')); // STA unchanged
      setTotalDistance(Math.round(leg.distance).toString()); // Round to remove decimals
    } else {
      setDepartureTime('');
      setSta('');
      setTotalDistance('');
    }
    setDistance35('');
    setDistance70('');
  };

  // Calculate expected times and distances at 35% and 70%
  const calculateExpected = () => {
    if (!departureTime || !sta || !totalDistance) {
      return { expectedTime35: '', expectedTime70: '', expectedDistance35: '', expectedDistance70: '', flightTime: '' };
    }

    const depMoment = moment(departureTime, 'hh:mm A');
    const staMoment = moment(sta, 'hh:mm A');
    const flightTimeMinutes = staMoment.diff(depMoment, 'minutes');
    const flightTimeHours = flightTimeMinutes / 60;
    const hours = Math.floor(flightTimeHours);
    const minutes = Math.round((flightTimeHours - hours) * 60);

    const timeAt35Percent = flightTimeMinutes * 0.35;
    const timeAt70Percent = flightTimeMinutes * 0.70;

    return {
      expectedTime35: depMoment.clone().add(timeAt35Percent, 'minutes').format('hh:mm A'),
      expectedTime70: depMoment.clone().add(timeAt70Percent, 'minutes').format('hh:mm A'),
      expectedDistance35: Math.round(totalDistance * 0.65).toString(), // No decimals
      expectedDistance70: Math.round(totalDistance * 0.30).toString(), // No decimals
      flightTime: `${hours}h ${minutes}m`,
    };
  };

  const { expectedTime35, expectedTime70, expectedDistance35, expectedDistance70, flightTime } = calculateExpected();

  const calculateETA = () => {
    if (!departureTime || !distance35 || !sta || selectedLeg === '') {
      return { eta35: '', eta70: '', adjustedETA: '', etaLabel: '' };
    }

    const depMoment = moment(departureTime, 'hh:mm A');
    const staMoment = moment(sta, 'hh:mm A');
    const flightTimeMinutes = staMoment.diff(depMoment, 'minutes');

    const timeAt35Percent = flightTimeMinutes * 0.35;
    const remainingTime35 = flightTimeMinutes - timeAt35Percent;

    const percentBehind35 = (distance35 / expectedDistance35) * 100;
    const adjustedRemaining35 = (remainingTime35 * percentBehind35) / 100 / 2;

    let eta35Moment = depMoment.clone().add(timeAt35Percent + adjustedRemaining35, 'minutes');
    let eta70Moment = null;
    let adjustedETAMoment;

    if (distance70) {
      const timeAt70Percent = flightTimeMinutes * 0.70;
      const remainingTime70 = flightTimeMinutes - timeAt70Percent;
      const percentBehind70 = (distance70 / expectedDistance70) * 100;
      const adjustedRemaining70 = (remainingTime70 * percentBehind70) / 100 / 2;
      eta70Moment = depMoment.clone().add(timeAt70Percent + adjustedRemaining70, 'minutes');
      const avgEtaMinutes = (eta35Moment.diff(depMoment, 'minutes') + eta70Moment.diff(depMoment, 'minutes')) / 2;
      adjustedETAMoment = depMoment.clone().add(avgEtaMinutes, 'minutes');
    } else {
      adjustedETAMoment = eta35Moment; // Use only 35% if 70% is empty
    }

    // Add taxi time to adjusted ETA only
    adjustedETAMoment.add(TAXI_TIME_MINUTES, 'minutes');
    eta35Moment.add(TAXI_TIME_MINUTES, 'minutes');
    if (eta70Moment) eta70Moment.add(TAXI_TIME_MINUTES, 'minutes');

    // Determine ETA label
    const etaDiff = adjustedETAMoment.diff(staMoment, 'minutes');
    let etaLabel = 'On Time';
    if (etaDiff < -5) etaLabel = 'Early'; // More than 5 min early
    else if (etaDiff > 5) etaLabel = 'Late'; // More than 5 min late

    return {
      eta35: eta35Moment.format('hh:mm A'),
      eta70: distance70 && eta70Moment ? eta70Moment.format('hh:mm A') : '',
      adjustedETA: adjustedETAMoment.format('hh:mm A'),
      etaLabel,
    };
  };

  const { eta35, eta70, adjustedETA, etaLabel } = calculateETA();

  return (
    <div className="eta-calculator">
      <h2>ETA Calculator</h2>
      <div className="input-group">
        <label>
          Select Flight Leg:
          <select value={selectedLeg} onChange={handleLegChange}>
            <option value="">Select a leg</option>
            {legs.map((leg, index) => (
              <option key={index} value={index}>
                Leg {index + 1}: {leg.origin} to {leg.destination}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="input-group">
        <label>
          Scheduled Departure Time:
          <input
            type="text"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            placeholder="e.g., 10:00 AM"
            disabled={selectedLeg !== ''}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Total Trip Distance (nm):
          <input
            type="number"
            value={totalDistance}
            onChange={(e) => setTotalDistance(Math.round(e.target.value).toString())} // Ensure no decimals
            placeholder="e.g., 600"
            step="1" // Restrict to integers
            disabled={selectedLeg !== ''}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Distance Remaining at 35% of Trip (nm):
          <input
            type="number"
            value={distance35}
            onChange={(e) => setDistance35(e.target.value)}
            placeholder="e.g., 475"
          />
        </label>
        {expectedTime35 && expectedDistance35 && (
          <p>Expected at 35%: {expectedTime35} - {expectedDistance35} nm</p>
        )}
      </div>
      <div className="input-group">
        <label>
          Distance Remaining at 70% of Trip (nm):
          <input
            type="number"
            value={distance70}
            onChange={(e) => setDistance70(e.target.value)}
            placeholder="e.g., 180"
          />
        </label>
        {expectedTime70 && expectedDistance70 && (
          <p>Expected at 70%: {expectedTime70} - {expectedDistance70} nm</p>
        )}
      </div>
      <div className="results">
        <p><strong>Scheduled Time of Arrival (STA):</strong> {sta}</p>
        <p><strong>Flight Time:</strong> {flightTime || 'N/A'}</p>
        <p><strong>Calculated ETA:</strong> {adjustedETA ? `${adjustedETA} (${etaLabel})` : 'N/A'}</p>
        {eta35 && (
          <p><em>ETA at 35%:</em> {eta35}</p>
        )}
        {eta70 && (
          <p><em>ETA at 70%:</em> {eta70}</p>
        )}
      </div>
      <style jsx>{`
        .eta-calculator {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .input-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        input, select {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        input:disabled {
          background-color: #f0f0f0;
        }
        .results {
          margin-top: 20px;
        }
        p {
          margin: 8px 0;
          font-size: 16px;
        }
        em {
          font-style: italic;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default ETACalculator;