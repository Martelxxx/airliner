import React from 'react';
const DestinationSelector = ({ value, onChange }) => {
  const destinations = ['LHR (London Heathrow)', 'CAI (Cairo)', 'DXB (Dubai)'];
  return (
    <div>
      <label htmlFor="destination">Destination:</label>
      <select id="destination" value={value} onChange={onChange}>
        <option value="">Select Destination</option>
        {destinations.map((dest) => (
          <option key={dest} value={dest}>{dest}</option>
        ))}
      </select>
    </div>
  );
};
export default DestinationSelector;