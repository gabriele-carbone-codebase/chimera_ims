import type { Level } from './supabase';

/** Business owners get the simplest UI; specialists and managers get the strategy layer. */
export const isSimple = (level?: Level | null) => level === 'business_owner';
export const isAdvanced = (level?: Level | null) => level === 'specialist' || level === 'manager';
