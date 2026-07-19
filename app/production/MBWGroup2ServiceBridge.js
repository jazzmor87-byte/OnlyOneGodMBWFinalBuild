import { MBWProductionRepository } from './MBWProductionRepository';

export const MBWGroup2ServiceBridge = Object.freeze({
  masterOfLife: Object.freeze({
    profile: () => MBWProductionRepository.profile(),
    entitlement: () => MBWProductionRepository.entitlement(),
  }),
  matchmaking: Object.freeze({
    discover: (limit = 25, offset = 0) => MBWProductionRepository.discoverProfiles(limit, offset),
    act: (targetId, action) => MBWProductionRepository.matchAction(targetId, action),
    send: (matchId, body) => MBWProductionRepository.sendMessage(matchId, body),
    messages: (matchId) => MBWProductionRepository.listMessages(matchId),
    subscribe: (matchId, callback) => MBWProductionRepository.subscribeMessages(matchId, callback),
    block: (targetId) => MBWProductionRepository.blockUser(targetId),
    report: (targetId, reason, detail) => MBWProductionRepository.report('PROFILE', targetId, reason, detail),
  }),
  games: Object.freeze({
    create: (gameType, roomSize) => MBWProductionRepository.createGame(gameType, roomSize),
    join: (gameId, seat) => MBWProductionRepository.joinGame(gameId, seat),
    action: (gameId, revision, action, payload) => MBWProductionRepository.gameAction(gameId, revision, action, payload),
    state: (gameId) => MBWProductionRepository.gameState(gameId),
    subscribe: (gameId, callback) => MBWProductionRepository.subscribeGame(gameId, callback),
  }),
  coins: Object.freeze({
    claimDaily: () => MBWProductionRepository.claimDailyCoins(),
    account: () => MBWProductionRepository.coinAccount(),
    vault: () => MBWProductionRepository.coinVault(),
    addProof: (record) => MBWProductionRepository.addCoinProof(record),
  }),
  travel: Object.freeze({
    hosts: (mode) => MBWProductionRepository.travelHosts(mode),
    nearby: (latitude, longitude, radiusKm = 25) => MBWProductionRepository.nearby(latitude, longitude, radiusKm),
    book: (hostId, startDate, endDate, guests) => MBWProductionRepository.bookTravel(hostId, startDate, endDate, guests),
    cancel: (bookingId, reason) => MBWProductionRepository.cancelTravel(bookingId, reason),
  }),
  merchandise: Object.freeze({
    products: () => MBWProductionRepository.products(),
    createOrder: (items, shipping) => MBWProductionRepository.createOrder(items, shipping),
    orders: () => MBWProductionRepository.orders(),
  }),
  kamashastra: Object.freeze({
    saveResult: (payload) => MBWProductionRepository.saveKamashastraResult(payload),
    history: () => MBWProductionRepository.kamashastraHistory(),
  }),
});
