// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import Dashboard from './Components/MainContent/Dashboard/Dashboard';
import FlightPlanner from './Components/MainContent/FlightPlanner/index.jsx';
import AircraftInfo from './Components/MainContent/AircraftInfo/AircraftInfo';
import PaymentManagement from './Components/MainContent/PaymentManagement/PaymentManagement';
import PassengerSimulator from './Components/MainContent/PassengerSimulator';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-layout" style={{ display: 'flex' }}>
          <Navigation />
          <div className="content-area" style={{ flex: 1, padding: '16px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/flight-planner" element={<FlightPlanner />} />
              <Route path="/aircraft-info" element={<AircraftInfo />} />
              <Route path="/payment-management" element={<PaymentManagement />} />
              <Route path="/passenger-simulator" element={<PassengerSimulator />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;