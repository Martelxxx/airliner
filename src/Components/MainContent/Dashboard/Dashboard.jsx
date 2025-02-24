// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import OverviewPanel from './OverviewPanel';
import FlightLegSummary from './FlightLegSummary';
import DestinationUnlockStatus from './DestinationUnlockStatus';

const Dashboard = () => {
  console.log('Dashboard rendered'); // Debug log to check if this keeps firing
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>View the dashboard.</p>
      <OverviewPanel />
      <FlightLegSummary />
      <DestinationUnlockStatus />
    </div>
  );
};

export default Dashboard;