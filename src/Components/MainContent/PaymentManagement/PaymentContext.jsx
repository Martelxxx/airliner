// src/Components/MainContent/PaymentManagement/PaymentContext.jsx
import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000000); // Starting balance: $1,000,000
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    const newBalance = balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    console.log('Before Update - Balance:', balance, 'Transactions:', transactions);
    console.log('Adding Transaction:', transaction, 'New Balance:', newBalance);
    setBalance(newBalance);
    setTransactions(prev => [transaction, ...prev]); // Ensure new array reference
    console.log('After Update - Balance:', newBalance, 'Transactions:', [transaction, ...transactions]);
  };

  return (
    <PaymentContext.Provider value={{ balance, transactions, addTransaction }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);