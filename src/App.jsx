// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import Dashboard from './Components/MainContent/Dashboard/Dashboard';
import FlightPlanner from './Components/MainContent/FlightPlanner';
import AircraftInfo from './Components/MainContent/AircraftInfo/AircraftInfo';
import PaymentManagement from './Components/MainContent/PaymentManagement/PaymentManagement';
import PassengerSimulator from './Components/MainContent/PassengerSimulator/PassengerSimulator';
import { FlightPlannerProvider } from './Components/MainContent/FlightPlanner/FlightPlannerContext';
import ETACalculator from './Components/MainContent/FlightPlanner/LegDetails/ETACalculator';
import PaymentDashboard from './Components/MainContent/PaymentManagement/PaymentDashboard';
import { PaymentProvider } from './Components/MainContent/PaymentManagement/PaymentContext';

const App = () => {
  return (
    <FlightPlannerProvider>
      <PaymentProvider> {/* Added PaymentProvider */}
        <Router>
          <div className="app-container">
            <Header />
            <div className="main-layout" style={{ display: 'flex' }}>
              <Navigation />
              <div className="content-area" style={{ flex: 1, padding: '16px' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/flight-planner" element={<FlightPlanner />} />
                  <Route path="/eta-calculator" element={<ETACalculator />} />
                  <Route path="/aircraft-info" element={<AircraftInfo />} />
                  <Route path="/payment-dashboard" element={<PaymentDashboard />} />
                  <Route path="/payment-management" element={<PaymentManagement />} />
                  {/* Note: PassengerSimulator route is missing; add if needed */}
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </PaymentProvider>
    </FlightPlannerProvider>
  );
};

export default App;