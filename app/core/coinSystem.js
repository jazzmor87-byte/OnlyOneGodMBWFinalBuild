import { purchasePack } from './paymentSystem';
let coins = 100;
let listeners = [];

export const subscribeCoins = (cb) => {
  listeners.push(cb);
};

const notify = () => {
  listeners.forEach(cb => cb(coins));
};

export const getCoins = () => coins;

export const earnCoins = (amount) => {
  coins += amount;
  notify();
  return coins;
};

export const spendCoins = (amount) => {
  coins = Math.max(0, coins - amount);
  notify();
  return coins;
};


export const buyCoins = (amount) => {
  coins += amount;
  return coins;
};


export const buyPack = (type) => {
  const pack = purchasePack(type);
  coins += pack.coins;
  return pack;
};
