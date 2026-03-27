import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\nlet trips = [];

export const createTrip = (location) => {
  trips.push({ location, time: Date.now() });
  return { 
  success:true,
  message:"Trip activated",
  trips 
};
};

export const getTrips = () => trips;\n\n/* MBW_SEED_ENTIRE_APP */
export const getTravelMembers = async () => getSectionMembers('Travel');
export const getTravelHosts = async () => getSectionMembers('Travel').filter((u) => u.role === 'MBW');
export const getTravelGuests = async () => getSectionMembers('Travel').filter((u) => u.role === 'USER');
\n