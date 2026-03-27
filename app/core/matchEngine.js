import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\n
import { updateAura } from './auraSystem';
import { getRole } from './coinHierarchy'; } from './auraSystem';
import { getTier } from './premiumSystem'; } from './auraSystem';
import { earnCoins } from './coinSystem';, getAuraLevel } from './auraSystem';
let lastMatch = null;

import { personalityScore } from './personalityEngine';

export const calculateMatch = (user, target) => {
  let score = 0;

const userP = { energy:7, social:6, focus:8, emotion:5 };
const targetP = { energy:6, social:7, focus:7, emotion:6 };

score += personalityScore(userP, targetP);


  // AGE MATCH
  if(Math.abs(user.age - target.age) <= 3) score += 20;
  else if(Math.abs(user.age - target.age) <= 7) score += 10;

  // TYPE MATCH
  if(user.type === target.type) score += 25;

  // LOCATION MATCH
  if(user.location === target.location) score += 15;

  // VIBE MATCH
  if(user.vibe === target.vibe) score += 20;

  // RANDOM BOOST (natural feel)
  score += Math.floor(Math.random()*20);

  const aura = updateAura('match');
score += aura * 2;
const aura = getAuraLevel();
score += aura * 5;
const tier = getTier();
if(tier === "VIP") score += 5;
if(tier === "ELITE") score += 10;
const role = getRole();
if(role === "Coin Trader") score += 5;
if(role === "Master of Coins") score += 10;
score = Math.min(score, 99);

  // anti-repeat
  if(score === lastMatch) score -= 3;

  lastMatch = score;

  earnCoins(5);
return score;
};\n\n/* MBW_SEED_ENTIRE_APP */
export const getCandidatePool = async () => getSeedUsers();
export const getMatches = async () => getSeedUsers().slice(0, 8).map((u, i) => ({ ...u, chemistry: 98 - (i * 3) }));
export const getSuggestedMembers = async () => getSeedUsers().slice(0, 6);
\n