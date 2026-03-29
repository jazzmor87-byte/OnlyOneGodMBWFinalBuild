import { earnCoins } from './coinSystem';
let challenges = [
  { id:1, text:"Earn 20 coins", reward:10, done:false },
  { id:2, text:"Complete 3 matches", reward:15, done:false },
  { id:3, text:"Use travel once", reward:20, done:false }
];

export const getChallenges = () => challenges;

export const completeChallenge = (id) => {
  const c = challenges.find(x=>x.id===id);
  if(c && !c.done){
    c.done = true;
    earnCoins(c.reward);
return c.reward;
  }
  return 0;
};
