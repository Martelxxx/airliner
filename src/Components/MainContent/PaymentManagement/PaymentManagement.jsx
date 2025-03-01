// src/Components/MainContent/PaymentManagement/PaymentManagement.jsx
import React, { useContext, useState } from 'react';
import { FlightPlannerContext } from '../FlightPlanner/FlightPlannerContext';
import { usePaymentContext } from './PaymentContext';

// Pricing function from FlightLegSummary.jsx
const calculatePricing = (aircraft, distance) => {
  const basePricePerKm = {
    CRJ700: 0.1,
    'B737-8': 0.12,
    'B787-8': 0.15,
    'A350-900': 0.18,
  };

  const basePrice = basePricePerKm[aircraft] * distance;
  return {
    economy: parseFloat((basePrice * 1).toFixed(2)),
    business: parseFloat((basePrice * 2).toFixed(2)),
    firstClass: parseFloat((basePrice * 3).toFixed(2)),
  };
};

const PaymentManagement = () => {
  const { legs } = useContext(FlightPlannerContext);
  const paymentContext = usePaymentContext();
  const [message, setMessage] = useState('');

  if (!paymentContext) {
    return (
      <div className="payment-management">
        <h2>Payment Management</h2>
        <p>Error: Payment context not available. Ensure this component is within PaymentProvider.</p>
      </div>
    );
  }

  const { addTransaction } = paymentContext;

  const processPayments = () => {
    console.log('Processing payments for legs:', legs);
    if (!legs || legs.length === 0) {
      setMessage('No flight legs available to process.');
      console.log('No flight legs available to process.');
      return;
    }

    let totalFuelCost = 0;

    legs.forEach((leg, index) => {
      // Verify leg data
      console.log(`Leg ${index + 1} Data:`, {
        origin: leg.origin,
        destination: leg.destination,
        aircraft: leg.aircraft,
        paxCount: leg.paxCount,
        distance: leg.distance,
        fuelConsumption: leg.fuelConsumption,
      });

      // Fuel Cost
      const fuelCost = (leg.fuelConsumption || 0) * 0.80; // $0.80/kg
      totalFuelCost += fuelCost;
      console.log(`Leg ${index + 1} - Fuel Cost: $${fuelCost.toFixed(2)}`);

      // Ticket Revenue
      const pricing = calculatePricing(leg.aircraft, leg.distance || 0);
      const paxCount = leg.paxCount || 0;
      const paxPerClass = Math.round(paxCount / 3) || 0; // Even split, default to 0 if NaN
      
      // Economy
      const economyRevenue = paxPerClass * pricing.economy;
      console.log(`Leg ${index + 1} - Economy Revenue: $${economyRevenue.toFixed(2)} (${paxPerClass} pax at $${pricing.economy}/pax)`);
      if (economyRevenue > 0) {
        addTransaction({
          id: `ECO-${index}-${Date.now()}`,
          type: 'income',
          amount: economyRevenue,
          description: `Economy ticket sales for Leg ${index + 1}: ${leg.origin} to ${leg.destination}`,
          date: new Date().toISOString(),
        });
      } else {
        console.log(`Leg ${index + 1} - Economy revenue skipped: $${economyRevenue}`);
      }

      // Business
      const businessRevenue = paxPerClass * pricing.business;
      console.log(`Leg ${index + 1} - Business Revenue: $${businessRevenue.toFixed(2)} (${paxPerClass} pax at $${pricing.business}/pax)`);
      if (businessRevenue > 0) {
        addTransaction({
          id: `BUS-${index}-${Date.now()}`,
          type: 'income',
          amount: businessRevenue,
          description: `Business ticket sales for Leg ${index + 1}: ${leg.origin} to ${leg.destination}`,
          date: new Date().toISOString(),
        });
      } else {
        console.log(`Leg ${index + 1} - Business revenue skipped: $${businessRevenue}`);
      }

      // First Class
      const firstClassRevenue = paxPerClass * pricing.firstClass;
      console.log(`Leg ${index + 1} - First Class Revenue: $${firstClassRevenue.toFixed(2)} (${paxPerClass} pax at $${pricing.firstClass}/pax)`);
      if (firstClassRevenue > 0) {
        addTransaction({
          id: `FST-${index}-${Date.now()}`,
          type: 'income',
          amount: firstClassRevenue,
          description: `First Class ticket sales for Leg ${index + 1}: ${leg.origin} to ${leg.destination}`,
          date: new Date().toISOString(),
        });
      } else {
        console.log(`Leg ${index + 1} - First Class revenue skipped: $${firstClassRevenue}`);
      }
    });

    // Add total fuel cost transaction
    if (totalFuelCost > 0) {
      addTransaction({
        id: `FUEL-TOTAL-${Date.now()}`,
        type: 'expense',
        amount: totalFuelCost,
        description: `Total fuel cost for all legs`,
        date: new Date().toISOString(),
      });
      console.log(`Total Fuel Cost: $${totalFuelCost.toFixed(2)}`);
    }

    setMessage('Payments processed successfully!');
    console.log('Payments processed successfully.');
  };

  return (
    <div className="payment-management">
      <h2>Payment Management</h2>
      <button onClick={processPayments}>Process Flight Payments</button>
      {message && <p>{message}</p>}
      <style jsx>{`
        .payment-management {
          padding: 20px;
          text-align: center;
        }
        h2 {
          font-size: 1.8em;
          color: #34495e;
          margin-bottom: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 1.1em;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: #2980b9;
        }
        p {
          margin-top: 10px;
          color: #27ae60;
          font-size: 1.1em;
        }
      `}</style>
    </div>
  );
};

export default PaymentManagement;