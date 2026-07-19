import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { MBW_PRODUCTION_CONFIG } from './MBWProductionConfig';
let singleton = null;
let appStateSubscription = null;
export function getMBWSupabase() {
  if (singleton) return singleton;
  if (!MBW_PRODUCTION_CONFIG.supabaseUrl || !MBW_PRODUCTION_CONFIG.supabaseKey) throw new Error('MBW_SUPABASE_CONFIGURATION_MISSING');
  singleton = createClient(MBW_PRODUCTION_CONFIG.supabaseUrl, MBW_PRODUCTION_CONFIG.supabaseKey, {
    auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 20 } },
  });
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', state => {
      if (!singleton) return;
      if (state === 'active') singleton.auth.startAutoRefresh(); else singleton.auth.stopAutoRefresh();
    });
  }
  return singleton;
}
