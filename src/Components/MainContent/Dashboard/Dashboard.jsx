// src/Components/Dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import OverviewPanel from './OverviewPanel';
import FlightLegSummary from './FlightLegSummary';
import DestinationUnlockStatus from './DestinationUnlockStatus';

const Dashboard = () => {
  console.log('Dashboard rendered');
  return (
    <div>
      <h1>Dashboard</h1>
      <p>View the dashboard.</p>
      <OverviewPanel />
      <FlightLegSummary />
      <DestinationUnlockStatus />
      <div>
        <Link to="/eta-calculator"><button>Calculate ETA</button></Link>
        <Link to="/aircraft-info"><button>Aircraft Info</button></Link>
        <Link to="/payment-dashboard"><button>Payment Dashboard</button></Link>
        <Link to="/payment-management"><button>Payment Management</button></Link>
      </div>
    </div>
  );
};

export default Dashboard;