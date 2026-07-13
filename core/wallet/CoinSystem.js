const MBW_COIN_STATE = Object.freeze({
  ready: true,
  coins: 0,
  balance: 0,
  tier: "ACE",
  walletReady: true,
});

export const CoinSystem = MBW_COIN_STATE;
export const MBWCoinSystem = MBW_COIN_STATE;
export const coinSystem = MBW_COIN_STATE;
export const getCoins = () => MBW_COIN_STATE.coins;
export const getBalance = () => MBW_COIN_STATE.balance;
export const addCoins = (value = 0) => Number(value) || 0;
export const spendCoins = (value = 0) => Number(value) || 0;
export const useCoinSystem = () => MBW_COIN_STATE;
export default CoinSystem;
