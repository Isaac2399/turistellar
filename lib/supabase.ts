/**
 * Supabase client stub. Install `@supabase/supabase-js` and call
 * `createClient(url, anonKey)` here when this persistence option is selected.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};
