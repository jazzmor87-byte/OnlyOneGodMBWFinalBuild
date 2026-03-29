let trips = [];

export const createTrip = (location) => {
  trips.push({ location, time: Date.now() });
  return { 
  success:true,
  message:"Trip activated",
  trips 
};
};

export const getTrips = () => trips;
