// src/Components/Header/index.jsx
import React from 'react';
import Logo from './logo';
import UserMenu from './UserMenu';

const Header = () => (
  <header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f5f5f5' }}>
    <Logo />
    <UserMenu />
  </header>
);

export default Header;