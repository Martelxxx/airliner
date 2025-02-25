// src/Components/MainContent/FlightPlanner/LegDetails/LegDetails.jsx
import React from 'react';
import moment from 'moment';

const LegDetails = ({ legs }) => (
  <div className="load-sheet">
    {legs.length === 0 ? (
      <p>No flights scheduled.</p>
    ) : (
      legs.map((leg, index) => (
        <div key={index} className="leg-section">
          <h3>LEG {index + 1}</h3>
          <div className="leg-details">
            <p><span className="label">Origin:</span> {leg.origin}</p>
            <p><span className="label">Destination:</span> {leg.destination}</p>
            <p><span className="label">Aircraft:</span> {leg.aircraft}</p>
            <p><span className="label">Departure:</span> {moment(leg.departureTime).format('HH:mm')}</p>
            <p><span className="label">ETA:</span> {moment(leg.arrivalTime).format('HH:mm')}</p>
            <p><span className="label">Flight Time:</span> {leg.flightTime}</p>
            <p><span className="label">Block Time:</span> {leg.blockTime}</p>
            <p><span className="label">Passenger Count:</span> {leg.paxCount}</p>
          </div>
          <div className="passenger-list">
            <h4>Passenger Manifest</h4>
            <ul>
              {leg.passengers.map((pax, i) => (
                <li key={i}>{i + 1}. {pax.name}, Age: {pax.age}</li>
              ))}
            </ul>
          </div>
        </div>
      ))
    )}
    <style jsx>{`
      .load-sheet {
        font-family: 'Courier New', Courier, monospace;
        background-color: #fff;
        border: 2px solid #000;
        padding: 15px;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .leg-section {
        border-bottom: 1px dashed #000;
        padding: 10px 0;
      }
      .leg-section:last-child {
        border-bottom: none;
      }
      h3 {
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 10px 0;
        text-align: center;
        background-color: #e0e0e0;
        padding: 5px;
        border: 1px solid #000;
      }
      .leg-details {
        display: grid;
        grid-template-columns: 175px 1fr;
        gap: 5px;
        margin-bottom: 10px;
      }
      .label {
        font-weight: bold;
        text-align: right;
        padding-right: 10px;
      }
      p {
        margin: 0;
        font-size: 14px;
      }
      .passenger-list {
        margin-top: 10px;
      }
      h4 {
        font-size: 14px;
        font-weight: bold;
        margin: 0 0 5px 0;
        border-bottom: 1px solid #000;
      }
      ul {
        list-style: none;
        padding: 0;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 5px;
      }
      li {
        font-size: 12px;
        margin: 2px 0;
      }
    `}</style>
  </div>
);

export default LegDetails;