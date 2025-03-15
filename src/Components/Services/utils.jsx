// ../../Services/utils.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  // Debugging statements
  console.log(`Calculating distance between: (${lat1}, ${lon1}) and (${lat2}, ${lon2})`);

  // Ensure inputs are numbers
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);

  // Debugging statements for parsed values
  console.log(`Parsed values - lat1: ${lat1}, lon1: ${lon1}, lat2: ${lat2}, lon2: ${lon2}`);

  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    console.error('Invalid input values for latitude or longitude');
    return NaN;
  }

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c; // Distance in kilometers
  const distanceNm = (distanceKm / 1.852) * 1.06; // Convert to NM and add 6%

  // Debugging statement
  console.log(`Calculated distance (with 6% adjustment): ${distanceNm} NM`);

  return distanceNm;
};

export const formatFlightTime = (flightTime) => {
  const hours = Math.floor(flightTime);
  const minutes = Math.round((flightTime - hours) * 60);
  return `${hours}h ${minutes}m`;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};