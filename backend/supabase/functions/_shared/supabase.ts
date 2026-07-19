import { createClient } from 'npm:@supabase/supabase-js@2.84.0';
export function adminClient() {
  const url = Deno.env.get('SUPABASE_URL'); const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !service) throw new Error('SUPABASE_ADMIN_CONFIG_MISSING');
  return createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function userClient(req: Request) {
  const url = Deno.env.get('SUPABASE_URL'); const anon = Deno.env.get('SUPABASE_ANON_KEY'); const auth = req.headers.get('Authorization') || '';
  if (!url || !anon || !auth.startsWith('Bearer ')) throw new Error('AUTH_REQUIRED');
  return createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false, autoRefreshToken: false } });
}
export async function requireUser(req: Request) {
  const client = userClient(req); const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('AUTH_REQUIRED'); return { client, user: data.user };
}
export async function rateLimit(key: string, limit: number, seconds: number) {
  const admin = adminClient(); const now = new Date();
  const { data } = await admin.from('mbw_rate_limits').select('*').eq('key', key).maybeSingle();
  if (!data || new Date(data.window_started_at).getTime() + seconds * 1000 <= now.getTime()) {
    await admin.from('mbw_rate_limits').upsert({ key, window_started_at: now.toISOString(), count: 1 }); return;
  }
  if (data.count >= limit) throw new Error('RATE_LIMITED');
  await admin.from('mbw_rate_limits').update({ count: data.count + 1 }).eq('key', key);
}
