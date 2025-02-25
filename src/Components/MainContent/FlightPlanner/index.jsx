// src/Components/FlightPlanner/index.jsx
import React, { useContext, useState, useEffect } from 'react';
import LegPlanner from '../../MainContent/FlightPlanner/LegPlanner/LegPlanner';
import LegDetails from '../../MainContent/FlightPlanner/LegDetails/LegDetails';
import PassengerSimulator from '../../MainContent/PassengerSimulator/PassengerSimulator';
import PassengerGenerator from '../../MainContent/PassengerSimulator/PassengerGenerator';
import { FlightPlannerContext } from './FlightPlannerContext';
import { calculateDistance } from '../../Services/utils'; // Adjusted path
import airportData from 'airport-data';
import moment from 'moment';

const aircraftSpecs = {
    CRJ700: { paxCapacity: 70, speed: 447 },
    A320: { paxCapacity: 180, speed: 460 },
    B737: { paxCapacity: 189, speed: 460 },
  };
  
  const FlightPlanner = () => {
    const {
      legs, setLegs, origin, setOrigin, destination, setDestination,
      aircraft, setAircraft, departureTime, setDepartureTime,
      flightTime, setFlightTime, arrivalTime, setArrivalTime,
      passengers, setPassengers,
    } = useContext(FlightPlannerContext);
  
    const [localOrigin, setLocalOrigin] = useState('');
    const [localDestination, setLocalDestination] = useState('');
    const [localAircraft, setLocalAircraft] = useState('CRJ700');
    const [localDepartureTime, setLocalDepartureTime] = useState('');
    const [paxCount, setPaxCount] = useState(0);
  
    const calculateFlightTime = async (origin, destination) => {
      const originAirport = airportData.find(airport => airport.icao === origin);
      const destinationAirport = airportData.find(airport => airport.icao === destination);
  
      if (!originAirport || !destinationAirport) {
        throw new Error('Invalid ICAO code');
      }
  
      const distance = calculateDistance(
        originAirport.latitude,
        originAirport.longitude,
        destinationAirport.latitude,
        destinationAirport.longitude
      ); // Distance in km
  
      const speed = aircraftSpecs[localAircraft].speed; // Speed in knots (approx. km/h)
      const flightTime = distance / speed; // Time in hours
      return { flightTime, distance };
    };
  
    const calculateArrivalTime = (departureTime, flightTime) => {
      const departure = moment(departureTime);
      const arrival = departure.clone().add(flightTime, 'hours');
      return arrival.format();
    };
  
    const generatePaxCount = () => {
      const maxCapacity = aircraftSpecs[localAircraft].paxCapacity;
      return Math.floor(Math.random() * maxCapacity * 0.9) + 1; // 1 to 90% capacity
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setOrigin(localOrigin);
      setDestination(localDestination);
      setAircraft(localAircraft);
      setDepartureTime(localDepartureTime);
  
      try {
        const { flightTime, distance } = await calculateFlightTime(localOrigin, localDestination);
        setFlightTime(flightTime);
  
        const arrivalTime = calculateArrivalTime(localDepartureTime, flightTime);
        setArrivalTime(arrivalTime);
  
        const newPaxCount = generatePaxCount();
        setPaxCount(newPaxCount);
  
        const leg = {
          origin: localOrigin,
          destination: localDestination,
          aircraft: localAircraft,
          departureTime: localDepartureTime,
          flightTime,
          arrivalTime,
          distance,
          passengers, // Updated by PassengerGenerator
          paxCount: newPaxCount,
        };
        setLegs([...legs, leg]);
  
        // Reset form
        setLocalOrigin('');
        setLocalDestination('');
        setLocalAircraft('CRJ700');
        setLocalDepartureTime('');
      } catch (error) {
        console.error(error.message);
      }
    };
  
    // Initial passenger count
    useEffect(() => {
      if (!paxCount && localAircraft) {
        setPaxCount(generatePaxCount());
      }
    }, [localAircraft]);
  
    return (
      <div className="flight-planner">
        <h1>Flight Planner</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Origin (ICAO):
              <input type="text" value={localOrigin} onChange={(e) => setLocalOrigin(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Destination (ICAO):
              <input type="text" value={localDestination} onChange={(e) => setLocalDestination(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Aircraft:
              <select value={localAircraft} onChange={(e) => setLocalAircraft(e.target.value)}>
                <option value="CRJ700">CRJ700</option>
                <option value="A320">A320</option>
                <option value="B737">B737</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Departure Time:
              <input type="datetime-local" value={localDepartureTime} onChange={(e) => setLocalDepartureTime(e.target.value)} />
            </label>
          </div>
          <button type="submit">Add Leg</button>
        </form>
        <PassengerGenerator
          origin={origin || localOrigin}
          destination={destination || localDestination}
          paxCount={paxCount}
          setPassengers={setPassengers}
        />
        <div className="flight-planner-content" style={{ display: 'flex', gap: '16px' }}>
          <section className="leg-planner-section" style={{ flex: 1 }}>
            <h2>Plan Your Legs</h2>
            <LegPlanner onAddLeg={handleSubmit} />
          </section>
          <section className="leg-details-section" style={{ flex: 1 }}>
            <h2>Leg Details</h2>
            <LegDetails legs={legs} />
          </section>
          <section className="passenger-simulator-section" style={{ flex: 1 }}>
            <PassengerSimulator
              origin={origin || localOrigin}
              destination={destination || localDestination}
              aircraft={aircraft || localAircraft}
              paxCount={paxCount}
            />
          </section>
        </div>
      </div>
    );
  };
  
  export default FlightPlanner;