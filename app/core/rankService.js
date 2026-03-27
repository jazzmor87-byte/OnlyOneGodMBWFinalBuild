import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\nimport { getAuraLevel } from './auraSystem';

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

};\n\n/* MBW_SEED_ENTIRE_APP */
export const getRankedMembers = async () => getAppRoster();
export const getLeaderboard = async () => getAppRoster();
\n