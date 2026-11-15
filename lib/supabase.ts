import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseSecretKey || supabasePublicKey)
);

export const isSupabasePrivilegedConfigured = Boolean(
  supabaseUrl && supabaseSecretKey
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublicKey || supabaseSecretKey)
  : null;

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;
  // A privileged admin client MUST have the service role secret key to bypass RLS on admin tables
  if (!supabaseUrl || !supabaseSecretKey) return null;
  cachedAdminClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cachedAdminClient;
}
