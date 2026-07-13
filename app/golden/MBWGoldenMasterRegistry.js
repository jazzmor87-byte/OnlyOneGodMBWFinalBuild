export const MBW_GOLDEN_MASTER_ROUTES = Object.freeze({
  CinematicIntro: { title: 'MBW', icon: '♠️', media: 'VIDEO_ONLY' },
  GateLocked: { title: 'ACCESS', icon: '♠️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/GateLockedScreen.jpg') },
  GateOpen: { title: 'MBW', icon: '♠️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/GateOpenScreen.jpg') },
  PathSelection: { title: 'TWO PATHS', icon: '♠️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/PathSelectionScreen.jpg') },
  SubscriptionSignup: { title: 'ACCESS', icon: '🔐', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SubscriptionSignupScreen.jpg') },
  MainHub: { title: 'MEN BEHIND WALL', icon: '♠️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MainHubScreen.jpg') },
  MasterOfLife: { title: 'MASTER OF LIFE', icon: '👑', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MasterOfLifeScreen.jpg') },
  Matchmaking: { title: 'MATCHMAKING', icon: '❤️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingScreen.jpg') },
  Games: { title: 'MASTER OF GAMES', icon: '🎲', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/GamesScreen.jpg') },
  MasterOfGames: { title: 'GAME VAULT', icon: '🕹️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/GamesOverviewScreen.jpg') },
  MasterOfCoins: { title: 'MASTER OF COINS', icon: '🪙', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MasterOfCoinsScreen.jpg') },
  TravelLocal: { title: 'TRAVEL LOCAL', icon: '🧭', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/TravelLocalScreen.jpg') },
  TravelOverseas: { title: 'TRAVEL OVERSEAS', icon: '✈️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/TravelOverseasScreen.jpg') },
  Merchandise: { title: 'MERCHANDISE', icon: '💎', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MerchandiseScreen.jpg') },
  Kamashastra: { title: 'KAMASHASTRA', icon: '🔥', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/KamashastraScreen.jpg') },
  LiveLounge: { title: 'LIVE LOUNGE', icon: '🎙️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/LiveLoungeScreen.jpg') },
  MensLounge: { title: 'MEN’S LOUNGE', icon: '♠️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeScreen.jpg') },
  Nearby: { title: 'NEARBY', icon: '📍', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/NearbyScreen.jpg') },
  AIPoster: { title: 'AI POSTER', icon: '📸', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterOverviewScreen.jpg') },
  Settings: { title: 'SETTINGS', icon: '⚙️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsActionScreen.jpg') },
  ProfilePoster: { title: 'AI POSTER VAULT', icon: '🖼️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterEntryScreen.jpg') },
  MatchChat: { title: 'MATCH CHAT', icon: '💬', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingLiveScreen.jpg') },
  GameRoom: { title: 'GAME ROOM', icon: '🎮', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/GamesLiveScreen.jpg') },
  TravelBooking: { title: 'TRAVEL BOOKING', icon: '🧳', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/TravelLocalResultScreen.jpg') },
  CommerceReceipt: { title: 'ORDER RECEIPT', icon: '🧾', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/MerchandiseActionScreen.jpg') },
  Privacy: { title: 'PRIVACY', icon: '🛡️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsProofScreen.jpg') },
  Terms: { title: 'TERMS', icon: '⚖️', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsResultScreen.jpg') },
  Safety: { title: 'SAFETY', icon: '🚨', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsVaultScreen.jpg') },
  AccountControl: { title: 'ACCOUNT CONTROL', icon: '🔑', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsStateScreen.jpg') },
  SeedProfile: { title: 'USER SEED', icon: '🌱', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterSeedScreen.jpg') },
  Consent: { title: 'CONSENT', icon: '✅', media: 'POSTER', poster: require('../assets/mbw_clean_shuffled_visual_body_posters/SettingsButtonsScreen.jpg') },
});

export const MBW_MAIN_ROUTES = Object.freeze([
  ['MasterOfLife', '👑'], ['Matchmaking', '❤️'], ['Games', '🎲'], ['MasterOfCoins', '🪙'],
  ['TravelLocal', '🧭'], ['TravelOverseas', '✈️'], ['Merchandise', '💎'], ['Kamashastra', '🔥'],
  ['LiveLounge', '🎙️'], ['MensLounge', '♠️'], ['Nearby', '📍'], ['AIPoster', '📸'], ['Settings', '⚙️'],
]);

export function resolveMBWGoldenRoute(routeName) {
  const route = MBW_GOLDEN_MASTER_ROUTES[routeName];
  if (!route) {
    throw new Error(`MBW_ROUTE_NOT_REGISTERED:${routeName}`);
  }
  return route;
}

export const MBW_GOLDEN_MASTER_ROUTE_COUNT = Object.keys(MBW_GOLDEN_MASTER_ROUTES).length;
