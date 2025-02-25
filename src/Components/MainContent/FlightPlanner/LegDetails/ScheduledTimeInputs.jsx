import React from 'react';
const ScheduledTimeInputs = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="sta">Scheduled Time of Arrival (STA):</label>
      <input type="time" id="sta" value={value} onChange={onChange} placeholder="HH:MM" />
    </div>
  );
};
export default ScheduledTimeInputs;