export const MBW_GROUP_2_SECTIONS = Object.freeze([
  'MasterOfLife',
  'Matchmaking',
  'Games',
  'MasterOfGames',
  'MasterOfCoins',
  'TravelLocal',
  'TravelOverseas',
  'Merchandise',
  'Kamashastra',
]);

export const MBW_GROUP_2_RELEASE_CONTRACT = Object.freeze({
  remoteIdentityRequired: true,
  remoteEntitlementRequired: true,
  localPreviewSettlementAllowed: false,
  localFakeMatchAllowed: false,
  localFakeOrderAllowed: false,
  localFakeBookingAllowed: false,
  localFakeRankingAllowed: false,
  cashValueCoins: false,
  withdrawableCoins: false,
  transferableCoins: false,
  redeemableCoins: false,
  realWorldPrizes: false,
  everyScreenReturns: true,
  everyActionProducesState: true,
  everyStateProducesResult: true,
});
