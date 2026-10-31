import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Level, type Role } from '../lib/supabase';
import i18n, { type Language } from '../i18n';

export type Membership = { business_id: string; role: Role; expertise_level: Level | null; business: { id: string; name: string } };
export type Profile = { id: string; display_name: string | null; language: Language };

type Ctx = {
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  memberships: Membership[];
  current: Membership | null;
  selectBusiness: (id: string) => Promise<void>;
  createBusiness: (name: string) => Promise<void>;
  setExpertise: (level: Level) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  signOut: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);
const CURRENT_KEY = 'chimera.currentBusiness';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const load = useCallback(async (s: Session | null) => {
    if (!s) { setProfile(null); setMemberships([]); return; }
    const [p, m] = await Promise.all([
      supabase.from('profiles').select('id, display_name, language').eq('id', s.user.id).maybeSingle(),
      supabase.from('memberships').select('business_id, role, expertise_level, business:businesses(id, name)').eq('user_id', s.user.id).order('created_at'),
    ]);
    if (p.data) { setProfile(p.data as Profile); await i18n.changeLanguage(p.data.language); }
    const rows = (m.data ?? []) as unknown as Membership[];
    setMemberships(rows);
    const saved = await AsyncStorage.getItem(CURRENT_KEY);
    setCurrentId((prev) => prev && rows.some((r) => r.business_id === prev) ? prev : rows.find((r) => r.business_id === saved)?.business_id ?? rows[0]?.business_id ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => { setSession(data.session); await load(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); load(s); });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const current = useMemo(() => memberships.find((m) => m.business_id === currentId) ?? null, [memberships, currentId]);

  const value: Ctx = {
    ready, session, profile, memberships, current,
    selectBusiness: async (id) => { setCurrentId(id); await AsyncStorage.setItem(CURRENT_KEY, id); },
    createBusiness: async (name) => {
      const { data, error } = await supabase.rpc('create_business', { business_name: name });
      if (error) throw error;
      await AsyncStorage.setItem(CURRENT_KEY, data as string);
      setCurrentId(data as string);
      await load(session);
    },
    setExpertise: async (level) => {
      if (!current) return;
      const { error } = await supabase.rpc('set_expertise', { bid: current.business_id, level });
      if (error) throw error;
      await load(session);
    },
    setLanguage: async (lang) => {
      await i18n.changeLanguage(lang);
      if (session) await supabase.from('profiles').update({ language: lang }).eq('id', session.user.id);
      setProfile((p) => (p ? { ...p, language: lang } : p));
    },
    signOut: async () => { await supabase.auth.signOut(); },
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
