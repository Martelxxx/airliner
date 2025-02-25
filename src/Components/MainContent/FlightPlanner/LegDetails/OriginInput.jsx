import React from 'react';
const OriginInput = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="origin">Origin:</label>
      <input type="text" id="origin" value={value} onChange={onChange} placeholder="e.g., LHR (London Heathrow)" />
    </div>
  );
};
export default OriginInput;