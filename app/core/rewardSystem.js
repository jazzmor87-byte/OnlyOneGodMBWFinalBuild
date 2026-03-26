import { spendCoins } from './coinSystem';
let rewards = [
  { id:1, name:"Exclusive Badge", cost:50 },
  { id:2, name:"Priority Match Boost", cost:100 },
  { id:3, name:"Travel Unlock", cost:150 }
];

export const getRewards = () => rewards;

export const redeemReward = (id, coins) => {
  const r = rewards.find(x=>x.id===id);
  if(r && coins >= r.cost){
    spendCoins(r.cost);
return { success:true, item:r.name };
  }
  return { success:false };
};
