import { getCoins } from './coinSystem';

export const getRole = () => {
  const c = getCoins();

  if(c < 50) return "Coin Seeker";
  if(c < 150) return "Coin Keeper";
  if(c < 300) return "Coin Trader";
  return "Master of Coins";
};

export const getKnowledge = () => {
  const role = getRole();

  const knowledgeMap = {
    "Coin Seeker": "Basics of coins and entry strategy",
    "Coin Keeper": "Storage, rarity, and value protection",
    "Coin Trader": "Market timing and trade strategy",
    "Master of Coins": "Economic control and dominance"
  };

  return knowledgeMap[role];
};

export const getSubLevel = () => {
  const c = getCoins();

  if(c < 25) return "Beginner";
  if(c < 75) return "Intermediate";
  if(c < 150) return "Advanced";
  if(c < 300) return "Expert";
  return "Legend";
};
