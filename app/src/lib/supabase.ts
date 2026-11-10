import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example)');
}

export const supabase = createClient(url, key, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

/** Display names for a set of user ids (only profiles the caller may see). */
export async function fetchNames(ids: string[]): Promise<Record<string, string>> {
  const { data } = await supabase.from('profiles').select('id, display_name').in('id', ids);
  return Object.fromEntries((data ?? []).map((p) => [p.id as string, (p.display_name as string) ?? '']));
}

export type Role = 'owner' | 'innovation_manager' | 'evaluator' | 'contributor' | 'viewer';
export type Level = 'business_owner' | 'technician' | 'specialist' | 'manager';
