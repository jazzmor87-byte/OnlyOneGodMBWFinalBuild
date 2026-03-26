
let users = [];

export const addUser = (user) => {
  users.push(user);
};

export const getUsers = () => users;

export const getRandomUser = () => {
  return users[Math.floor(Math.random()*users.length)];
};
