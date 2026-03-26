import { getAuraLevel } from './auraSystem';

export const getTopUsers = async () => {

  const dummy = [
    {name:"Ace_01", base:80},
    {name:"Ace_02", base:75},
    {name:"Ace_03", base:70}
  ];

  const aura = getAuraLevel();

  return dummy.map(u => ({
    ...u,
    score: u.base + aura * 3
  })).sort((a,b)=>b.score-a.score);

};
