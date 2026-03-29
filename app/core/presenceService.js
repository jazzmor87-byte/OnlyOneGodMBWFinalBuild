let onlineUsers = [];

export const userOnline = (name) => {
  if(!onlineUsers.includes(name)) onlineUsers.push(name);
};

export const userOffline = (name) => {
  onlineUsers = onlineUsers.filter(u => u !== name);
};

export const getOnlineUsers = () => onlineUsers;
