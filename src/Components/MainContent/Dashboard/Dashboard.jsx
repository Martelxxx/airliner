// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import OverviewPanel from './OverviewPanel';
import FlightLegSummary from './FlightLegSummary';
import DestinationUnlockStatus from './DestinationUnlockStatus';

const Dashboard = () => {
  console.log('Dashboard rendered'); // Debug log to check if this keeps firing
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>View the dashboard.</p>
      <div>
        <Link to="/eta-calculator">
          <button>Calculate ETA</button>
        </Link>
      </div>
      <OverviewPanel />
      <FlightLegSummary />
      <DestinationUnlockStatus />
      
    </div>
  );
};

export default Dashboard;