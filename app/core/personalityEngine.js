
export const personalityScore = (user, target) => {
  let score = 0;

  const traits = ['energy','social','focus','emotion'];

  traits.forEach(t => {
    const diff = Math.abs(user[t] - target[t]);
    if(diff <= 1) score += 10;
    else if(diff <= 3) score += 5;
  });

  return score;
};
