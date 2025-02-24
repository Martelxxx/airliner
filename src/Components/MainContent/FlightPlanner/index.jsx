// src/Components/FlightPlanner/index.jsx
import React from 'react';
import LegPlanner from './LegPlanner/LegPlanner';
import LegDetails from './LegDetails/LegDetails';
// import OriginInput from '../OriginInput'; // Adjust path
// import DestinationSelector from './DestinationSelector'; // Adjust path
// import AircraftSelector from '../AircraftSelector'; // Adjust path
// import ScheduledTimeInputs from '../ScheduledTimeInputs'; // Adjust path

const FlightPlanner = () => {
  return (
    <div className="flight-planner">
      <h1>Flight Planner</h1>
      <div className="flight-planner-content" style={{ display: 'flex', gap: '16px' }}>
        <section className="leg-planner-section" style={{ flex: 1 }}>
          <h2>Plan Your Flight</h2>
          {/* <OriginInput /> */}
          {/* <DestinationSelector />
          <AircraftSelector />
          <ScheduledTimeInputs />
          <LegPlanner /> */}
        </section>
        <section className="leg-details-section" style={{ flex: 1 }}>
          <h2>Flight Leg Details</h2>
          <LegDetails />
        </section>
      </div>
    </div>
  );
};

export default FlightPlanner;