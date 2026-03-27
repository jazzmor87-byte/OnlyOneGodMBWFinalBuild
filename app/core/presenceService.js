import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\nlet onlineUsers = [];

export const userOnline = (name) => {
  if(!onlineUsers.includes(name)) onlineUsers.push(name);
};

export const userOffline = (name) => {
  onlineUsers = onlineUsers.filter(u => u !== name);
};

export const getOnlineUsers = () => onlineUsers;\n\n/* MBW_SEED_ENTIRE_APP */
export const getLiveUsers = async () => getOnlineSeedUsers();
export const getOnlineMembers = async () => getOnlineSeedUsers();
export const getPresenceRoster = async () => getAppRoster();
\n