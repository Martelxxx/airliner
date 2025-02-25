// src/Components/MainContent/PassengerSimulator/PassengerSimulator.jsx
import React, { useContext } from 'react';
import { FlightPlannerContext } from '../../MainContent/FlightPlanner/FlightPlannerContext';

const PassengerSimulator = ({ origin, destination, aircraft, paxCount }) => {
  const { passengers } = useContext(FlightPlannerContext);
  const payload = paxCount * 175; // Avg 175 lbs per passenger

  return (
    <div>
      <h1>Passenger Simulator</h1>
      <p>Aircraft: {aircraft}</p>
      <p>Origin: {origin}</p>
      <p>Destination: {destination}</p>
      <p>Passenger Count: {paxCount}</p>
      <p>Total Payload: {payload} lbs</p>
      <h2>Passenger List</h2>
      <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {passengers.map((pax, index) => (
          <li key={index}>
            {pax.name}, Age: {pax.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PassengerSimulator;