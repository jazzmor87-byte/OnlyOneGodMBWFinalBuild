export const getOpponentType = () => {
  const types = ["aggressive","calm","strategist","dominant"];
  return types[Math.floor(Math.random()*types.length)];
};

export const getPersonalityChat = (type, mode) => {

  const data = {
    aggressive:{
      hot:["🔥 You're done","🔥 Too slow"],
      cold:["❄️ Expected more","❄️ Improve"]
    },
    calm:{
      hot:["🔥 Steady...","🔥 Focus"],
      cold:["❄️ Well played","❄️ Balanced"]
    },
    strategist:{
      hot:["🔥 Calculated move","🔥 Watch carefully"],
      cold:["❄️ Smart play","❄️ Interesting"]
    },
    dominant:{
      hot:["🔥 I control this","🔥 You follow"],
      cold:["❄️ As expected","❄️ Predictable"]
    }
  };

  const set = data[type][mode];
  return set[Math.floor(Math.random()*set.length)];
};
