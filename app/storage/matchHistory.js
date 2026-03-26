
let history = [];

export const saveMatch = (data) => {
  history.unshift(data);
  if(history.length > 20) history.pop();
};

export const getMatches = () => history;
