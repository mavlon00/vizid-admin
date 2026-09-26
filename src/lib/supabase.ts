import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(
    `Supabase URL is missing or invalid. Received: "${supabaseUrl}". Please check environment variables.`
  );
}

if (!supabaseAnonKey) {
  throw new Error('Supabase anon key is missing. Please check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
