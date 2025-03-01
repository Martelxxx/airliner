// src/Components/TransactionList.jsx
import React from 'react';
import { usePaymentContext } from './PaymentContext';

const TransactionList = () => {
  const { transactions } = usePaymentContext();

  return (
    <div className="transaction-list">
      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}</td>
                <td className={txn.type === 'income' ? 'income' : 'expense'}>
                  ${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>{txn.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        .transaction-list {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h3 {
          font-size: 1.4em;
          color: #34495e;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #e0e6ed;
        }
        th {
          font-weight: 600;
          color: #7f8c8d;
        }
        .income {
          color: #27ae60;
        }
        .expense {
          color: #c0392b;
        }
        p {
          color: #7f8c8d;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default TransactionList;