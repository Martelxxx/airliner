// src/Components/MainContent/PaymentManagement/PaymentDashboard.jsx
import React from 'react';
import { usePaymentContext } from './PaymentContext';
import TransactionList from './TransactionList';

const PaymentDashboard = () => {
  const context = usePaymentContext();
  
  if (!context) {
    return (
      <div className="payment-dashboard">
        <h1>Payment Dashboard</h1>
        <p>Error: Payment context not available. Ensure this component is within PaymentProvider.</p>
      </div>
    );
  }

  const { balance, transactions } = context;
  console.log('PaymentDashboard Context:', { balance, transactions }); // Debug log

  return (
    <div className="payment-dashboard">
      <h1>Payment Dashboard</h1>
      <div className="balance-section">
        <h2>Current Balance</h2>
        <p className="balance">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="summary-section">
        <h3>Transaction Summary</h3>
        <p>Total Transactions: {transactions.length}</p>
        <p>Income: ${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US')}</p>
        <p>Expenses: ${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US')}</p>
      </div>
      <TransactionList />
      <style jsx>{`
        .payment-dashboard {
          font-family: 'Roboto', Arial, sans-serif;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #f5f7fa;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        h1 {
          font-size: 2.5em;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 20px;
        }
        .balance-section {
          text-align: center;
          margin-bottom: 30px;
        }
        .balance {
          font-size: 2em;
          color: #27ae60;
          font-weight: bold;
        }
        .summary-section {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        h3 {
          font-size: 1.4em;
          color: #34495e;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.1em;
          color: #7f8c8d;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default PaymentDashboard;