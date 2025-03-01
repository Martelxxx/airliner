// src/Components/TransactionForm.jsx
import React, { useState } from 'react';
import { usePaymentContext } from './PaymentContext';

const TransactionForm = () => {
  const { addTransaction } = usePaymentContext();
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const transaction = {
      id: `${type}-${Date.now()}`,
      type,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
    };

    addTransaction(transaction);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="transaction-form">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500.00"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Maintenance Cost"
          />
        </div>
        <button type="submit">Add Transaction</button>
      </form>
      <style jsx>{`
        .transaction-form {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 20px auto;
        }
        h3 {
          font-size: 1.4em;
          color: #34495e;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          font-weight: 600;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        input, select {
          width: 100%;
          padding: 8px;
          font-size: 1em;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          width: 100%;
          padding: 10px;
          font-size: 1.1em;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: #219653;
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;