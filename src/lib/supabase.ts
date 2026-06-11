import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients (server-side only).
 *
 * Everything is lazy and optional: if the env vars aren't set the factories
 * return `null` and callers fall back to the static `fabricantes.ts` dataset, so
 * the site keeps working before credentials are wired up.
 *
 *  - `getSupabase()`      → anon key. Public reads (RLS-restricted).
 *  - `getSupabaseAdmin()` → service-role key. Server-only writes / seeding.
 *    NEVER import the admin client into client components.
 */

let anon: SupabaseClient | null | undefined;
let admin: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (anon !== undefined) return anon;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  anon =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return anon;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  admin =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return admin;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
