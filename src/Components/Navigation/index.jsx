// src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navigation" style={{ padding: '16px', background: '#f0f0f0' }}>
      <ul className="navigation-links" style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0' }}>
        <li style={{ marginBottom: '8px' }}>
          <NavLink exact="true" to="/" className={({ isActive }) => (isActive ? 'active' : '')} style={{ textDecoration: 'none', color: '#333' }}>
            Dashboard
          </NavLink>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <NavLink to="/flight-planner" className={({ isActive }) => (isActive ? 'active' : '')} style={{ textDecoration: 'none', color: '#333' }}>
            Flight Planner
          </NavLink>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <NavLink to="/aircraft-info" className={({ isActive }) => (isActive ? 'active' : '')} style={{ textDecoration: 'none', color: '#333' }}>
            Aircraft Info
          </NavLink>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <NavLink to="/payment-management" className={({ isActive }) => (isActive ? 'active' : '')} style={{ textDecoration: 'none', color: '#333' }}>
            Payment Management
          </NavLink>
        </li>
        <li>
          <NavLink to="/passenger-simulator" className={({ isActive }) => (isActive ? 'active' : '')} style={{ textDecoration: 'none', color: '#333' }}>
            Passenger Simulator
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
