import React, { createContext, useState } from 'react';

export const FlightPlannerContext = createContext();

export const FlightPlannerProvider = ({ children }) => {
  const [legs, setLegs] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [aircraft, setAircraft] = useState('CRJ700');
  const [departureTime, setDepartureTime] = useState('');
  const [flightTime, setFlightTime] = useState(0);
  const [arrivalTime, setArrivalTime] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [airportDetails, setAirportDetails] = useState(null);

  return (
    <FlightPlannerContext.Provider
      value={{
        legs, setLegs, origin, setOrigin, destination, setDestination,
        aircraft, setAircraft, departureTime, setDepartureTime,
        flightTime, setFlightTime, arrivalTime, setArrivalTime,
        passengers, setPassengers, airportDetails, setAirportDetails,
      }}
    >
      {children}
    </FlightPlannerContext.Provider>
  );
};