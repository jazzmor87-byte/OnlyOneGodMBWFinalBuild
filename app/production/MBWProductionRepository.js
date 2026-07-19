import { getMBWSupabase } from './MBWSupabaseClient';
async function invoke(name, body = {}, headers = {}) {
  const supabase = getMBWSupabase();
  const { data, error } = await supabase.functions.invoke(name, { body, headers });
  if (error) throw error;
  if (data?.ok === false) throw new Error(data.error || `${name.toUpperCase()}_FAILED`);
  return data;
}
async function rpc(name, args = {}) {
  const supabase = getMBWSupabase(); const { data, error } = await supabase.rpc(name, args);
  if (error) throw error; return data;
}
export const MBWProductionRepository = Object.freeze({
  health: async () => {
    const supabase = getMBWSupabase();
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/health`, { headers: { apikey: supabase.supabaseKey } });
    if (!response.ok) throw new Error(`HEALTH_${response.status}`); return response.json();
  },
  ensureSession: async captchaToken => {
    const supabase = getMBWSupabase(); const { data: current } = await supabase.auth.getSession();
    if (current.session) return current.session;
    const { data, error } = await supabase.auth.signInAnonymously({ options: captchaToken ? { captchaToken } : undefined });
    if (error) throw error; return data.session;
  },
  bootstrap: payload => invoke('bootstrap', payload),
  acceptLegal: version => rpc('mbw_accept_legal', { p_legal_version: version, p_privacy: true, p_terms: true, p_consent: true, p_age_18: true }),
  entitlement: async () => {
    const supabase = getMBWSupabase(); const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('AUTH_REQUIRED');
    const { data, error } = await supabase.from('mbw_entitlements').select('*').eq('user_id', user.user.id).maybeSingle();
    if (error) throw error; return data;
  },
  verifyPurchase: (purchaseToken, productId) => invoke('billing-verify', { purchaseToken, productId }),
  sovereignExchange: (password, deviceHash) => invoke('sovereign-exchange', { password }, { 'x-mbw-device-hash': deviceHash || '' }),
  discoverProfiles: (limit = 25, offset = 0) => rpc('mbw_discover_profiles', { p_limit: limit, p_offset: offset }),
  matchAction: (targetId, action) => rpc('mbw_match_action', { p_target: targetId, p_action: action }),
  sendMessage: (matchId, body) => rpc('mbw_send_message', { p_match: matchId, p_body: body }),
  blockUser: targetId => rpc('mbw_block_user', { p_target: targetId }),
  report: (targetType, targetId, reason, detail) => invoke('moderation-report', { targetType, targetId, reason, detail }),
  claimDailyCoins: () => rpc('mbw_claim_daily_coins'),
  nearby: (latitude, longitude, radiusKm = 25) => rpc('mbw_nearby_profiles', { p_lat: latitude, p_lon: longitude, p_radius_km: radiusKm }),
  bookTravel: (hostId, startDate, endDate, guests) => rpc('mbw_create_travel_booking', { p_host: hostId, p_start: startDate, p_end: endDate, p_guests: guests }),
  cancelTravel: (bookingId, reason) => rpc('mbw_cancel_travel_booking', { p_booking: bookingId, p_reason: reason }),
  dataExport: () => invoke('data-export'),
  deleteAccount: confirmation => invoke('account-delete', { confirmation }),
  createLiveToken: (roomName, title) => invoke('live-token', { room_name: roomName, title }),
  listMessages: async matchId => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_messages').select('*').eq('match_id', matchId).is('deleted_at', null).order('created_at');
    if (error) throw error; return data || [];
  },
  subscribeMessages: (matchId, callback) => {
    const supabase = getMBWSupabase();
    const channel = supabase.channel(`mbw-match-${matchId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mbw_messages', filter: `match_id=eq.${matchId}` }, payload => callback(payload.new)).subscribe();
    return () => supabase.removeChannel(channel);
  },

  profile: async () => {
    const supabase = getMBWSupabase();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('AUTH_REQUIRED');
    const { data, error } = await supabase.from('mbw_profiles').select('*').eq('id', user.user.id).single();
    if (error) throw error;
    return data;
  },
  createGame: (gameType, roomSize) => rpc('mbw_create_game', { p_game_type: gameType, p_room_size: roomSize }),
  joinGame: (gameId, seat) => rpc('mbw_join_game', { p_game_id: gameId, p_seat: seat }),
  gameAction: (gameId, revision, action, payload) => invoke('game-action', { gameId, revision, action, payload }),
  gameState: async (gameId) => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_games').select('*,mbw_game_members(*),mbw_game_events(*)').eq('id', gameId).single();
    if (error) throw error;
    return data;
  },
  subscribeGame: (gameId, callback) => {
    const supabase = getMBWSupabase();
    const channel = supabase.channel(`mbw-game-${gameId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mbw_game_events', filter: `game_id=eq.${gameId}` }, payload => callback(payload.new))
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
  coinAccount: async () => {
    const supabase = getMBWSupabase();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('AUTH_REQUIRED');
    const { data, error } = await supabase.from('mbw_coin_accounts').select('*').eq('user_id', user.user.id).single();
    if (error) throw error;
    return data;
  },
  coinVault: async () => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_coin_vault').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  addCoinProof: (record) => rpc('mbw_add_coin_proof', {
    p_image_path: record.imagePath || null,
    p_country: record.country || '',
    p_year: record.year || null,
    p_mint: record.mint || '',
    p_condition: record.condition || '',
    p_identification: record.identification || {},
  }),
  travelHosts: async (mode) => {
    const supabase = getMBWSupabase();
    let query = supabase.from('mbw_travel_hosts').select('*').eq('available', true).eq('identity_verified', true);
    if (mode) query = query.eq('mode', mode);
    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  products: async () => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_products').select('*').eq('active', true).order('title');
    if (error) throw error;
    return data || [];
  },
  orders: async () => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_orders').select('*,mbw_order_items(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  saveKamashastraResult: (payload) => rpc('mbw_save_kamashastra_result', {
    p_attraction: payload.attraction || 'UNSPECIFIED',
    p_compatibility: payload.compatibility || 0,
    p_payload: payload,
  }),
  kamashastraHistory: async () => {
    const supabase = getMBWSupabase();
    const { data, error } = await supabase.from('mbw_kamashastra_results').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  signOut: async () => { const { error } = await getMBWSupabase().auth.signOut(); if (error) throw error; },
});
