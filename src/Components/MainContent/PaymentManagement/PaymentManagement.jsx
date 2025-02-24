// src/Components/MainContent/PaymentManagement/PaymentManagement.jsx
import React from 'react';
import TransactionList from './TransactionList';
import PaymentDashboard from './PaymentDashboard';
import TransactionForm from './TransactionForm';

const PaymentManagement = () => {
  return (
    <div>
      <h1>Payment Management</h1>
      <PaymentDashboard />
      <TransactionList />
      <TransactionForm />
    </div>
  );
};

export default PaymentManagement;