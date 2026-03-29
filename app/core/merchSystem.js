import { getCoins, spendCoins } from './coinSystem';

const attireSets = [
  {id:1, name:"Obsidian Elite", price:200, type:"full"},
  {id:2, name:"Golden Sovereign", price:250, type:"full"},
  {id:3, name:"Crimson Night", price:220, type:"full"},
  {id:4, name:"Velvet Shadow", price:240, type:"full"},
  {id:5, name:"Royal Ascend", price:300, type:"full"}
];

const grooming = [
  {id:101, name:"MBW Beard Oil", price:40},
  {id:102, name:"MBW Skin Serum", price:60}
];

const undergarments = [
  {id:201, name:"MBW Premium Brief", price:35},
  {id:202, name:"MBW Luxe Innerwear", price:50}
];

let userOwned = [];
let aceRewardClaimed = false;

export const getMerchData = () => ({
  attireSets,
  grooming,
  undergarments
});

export const buyItem = (item) => {
  const coins = getCoins();
  if(coins < item.price) return "not_enough";

  spendCoins(item.price);
  userOwned.push(item.id);
  return "purchased";
};

export const getDiscount = () => {
  return userOwned.length >= 2 ? 0.1 : 0;
};

export const claimAceReward = () => {
  if(aceRewardClaimed) return "already";
  aceRewardClaimed = true;
  userOwned.push("FREE_ATTIRE");
  return "claimed";
};

export const listUserItem = (name, price) => {
  return { name, price, seller:"user" };
};
