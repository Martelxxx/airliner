import React from 'react';
const AircraftSelector = ({ value, onChange }) => {
  const aircraftOptions = ['CRJ700', '737-800', '787-8', 'A350-900'];
  return (
    <div>
      <label htmlFor="aircraft">Aircraft:</label>
      <select id="aircraft" value={value} onChange={onChange}>
        <option value="">Select Aircraft</option>
        {aircraftOptions.map((aircraft) => (
          <option key={aircraft} value={aircraft}>{aircraft}</option>
        ))}
      </select>
    </div>
  );
};
export default AircraftSelector;