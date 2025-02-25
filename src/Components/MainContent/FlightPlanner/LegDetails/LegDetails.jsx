import React from 'react';
import { formatFlightTime, formatTime } from '../../../../Components/Services/utils';

const LegDetails = ({ legs = [] }) => {
  return (
    <div>
      <h2>Leg Details</h2>
      {legs.length === 0 ? (
        <p>No legs available</p>
      ) : (
        legs.map((leg, index) => (
          <div key={index}>
            <h3>Leg {index + 1}</h3>
            <p>Origin: {leg.origin}</p>
            <p>Destination: {leg.destination}</p>
            <p>Aircraft: {leg.aircraft}</p>
            <p>Departure Time: {formatTime(leg.departureTime)}</p>
            <p>Flight Time: {formatFlightTime(leg.flightTime)}</p>
            <p>Arrival Time: {formatTime(leg.arrivalTime)}</p>
            <p>Distance: {leg.distance.toFixed(2)} km</p>
            <h4>Passengers</h4>
            <ul>
              {leg.passengers.map((pax, i) => (
                <li key={i}>{pax.name}, Age: {pax.age}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default LegDetails;