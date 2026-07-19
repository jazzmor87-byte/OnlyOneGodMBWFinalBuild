import { handleOptions, json } from '../_shared/http.ts';
import { requireUser, rateLimit } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { client, user } = await requireUser(req);
    await rateLimit(`game:${user.id}`, 180, 3600);

    const body = await req.json();
    const { data, error } = await client.rpc('mbw_commit_game_action', {
      p_game_id: body.gameId,
      p_revision: body.revision,
      p_action: body.action,
      p_payload: body.payload || {},
    });

    if (error) throw error;
    return json({ ok: true, game: data });
  } catch (error) {
    return json({ ok: false, error: String(error?.message || error) }, 400);
  }
});
