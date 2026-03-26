import { spendCoins, earnCoins } from './coinSystem';
let listings = [];

export const createListing = (user, amount, price) => {
  listings.push({ user, amount, price });
  return listings;
};

export const getListings = () => listings;

export const buyListing = (index) => {
  const item = listings[index];
  listings.splice(index,1);
  spendCoins(item.price);
earnCoins(item.amount);
return item;
};
