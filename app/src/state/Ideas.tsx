import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import type { Criterion, Evaluation, IdeaCriterion, IdeaRow, IdeaStatus } from '../lib/ideas';

type Ctx = {
  loading: boolean;
  ideas: IdeaRow[];
  criteria: Criterion[];
  ideaCriteria: IdeaCriterion[];
  evaluations: Evaluation[];
  authors: Record<string, string>;
  submitIdea: (title: string, description: string | null, anonymous: boolean) => Promise<string>;
  addCriterion: (name: string) => Promise<string>;
  startEvaluation: (ideaId: string, picks: { criterionId: string; weight: number }[]) => Promise<void>;
  saveEvaluation: (ideaId: string, scores: Record<string, number>) => Promise<void>;
  decide: (ideaId: string, status: IdeaStatus, note: string | null) => Promise<void>;
};

const IdeasCtx = createContext<Ctx | null>(null);

export function IdeasProvider({ children }: { children: React.ReactNode }) {
  const { current, session } = useApp();
  const { nodes, reload: reloadNodes } = useInventory();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [ideaCriteria, setIdeaCriteria] = useState<IdeaCriterion[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const [i, c, ic, e] = await Promise.all([
      supabase.from('ideas').select('*').eq('business_id', businessId),
      supabase.from('criteria').select('*').eq('business_id', businessId).eq('archived', false).order('created_at'),
      supabase.from('idea_criteria').select('idea_id, criterion_id, weight').eq('business_id', businessId),
      supabase.from('evaluations').select('idea_id, evaluator_id, criterion_id, score, comment').eq('business_id', businessId),
    ]);
    for (const r of [i, c, ic, e]) if (r.error) throw r.error;
    setIdeas(i.data as IdeaRow[]); setCriteria(c.data as Criterion[]); setIdeaCriteria(ic.data as IdeaCriterion[]); setEvaluations(e.data as Evaluation[]);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);

  // Author names for non-anonymous ideas.
  useEffect(() => {
    const anonymousIds = new Set(ideas.filter((x) => x.anonymous).map((x) => x.node_id));
    const ids = [...new Set(nodes.filter((n) => n.subtype === 'idea' && !anonymousIds.has(n.id) && n.created_by).map((n) => n.created_by as string))];
    if (!ids.length) { setAuthors({}); return; }
    supabase.from('profiles').select('id, display_name').in('id', ids).then(({ data }) => {
      setAuthors(Object.fromEntries((data ?? []).map((p) => [p.id as string, (p.display_name as string) ?? ''])));
    });
  }, [nodes, ideas]);

  const value: Ctx = {
    loading, ideas, criteria, ideaCriteria, evaluations, authors,
    submitIdea: async (title, description, anonymous) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.rpc('submit_idea', { bid: businessId, idea_title: title, idea_description: description, is_anonymous: anonymous });
      if (error) throw error;
      await Promise.all([reloadNodes(), reload()]);
      return data as string;
    },
    addCriterion: async (name) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.from('criteria').insert({ business_id: businessId, name, is_default: false }).select('id').single();
      if (error) throw error;
      await reload();
      return data.id as string;
    },
    startEvaluation: async (ideaId, picks) => {
      if (!businessId) throw new Error('No business');
      const keep = picks.map((p) => p.criterionId);
      const del = await supabase.from('idea_criteria').delete().eq('idea_id', ideaId).not('criterion_id', 'in', `(${keep.join(',')})`);
      if (del.error) throw del.error;
      const up = await supabase.from('idea_criteria').upsert(picks.map((p) => ({ idea_id: ideaId, business_id: businessId, criterion_id: p.criterionId, weight: p.weight })), { onConflict: 'idea_id,criterion_id' });
      if (up.error) throw up.error;
      const st = await supabase.from('ideas').update({ status: 'in_evaluation' }).eq('node_id', ideaId);
      if (st.error) throw st.error;
      await reload();
    },
    saveEvaluation: async (ideaId, scores) => {
      if (!businessId || !session) throw new Error('No business');
      const rows = Object.entries(scores).map(([criterion_id, score]) => ({ idea_id: ideaId, business_id: businessId, evaluator_id: session.user.id, criterion_id, score, updated_at: new Date().toISOString() }));
      const { error } = await supabase.from('evaluations').upsert(rows, { onConflict: 'idea_id,evaluator_id,criterion_id' });
      if (error) throw error;
      await reload();
    },
    decide: async (ideaId, status, note) => {
      if (!session) throw new Error('Not signed in');
      const { error } = await supabase.from('ideas').update({ status, decision_note: note, decided_by: session.user.id, decided_at: new Date().toISOString() }).eq('node_id', ideaId);
      if (error) throw error;
      await reload();
    },
  };

  return <IdeasCtx.Provider value={value}>{children}</IdeasCtx.Provider>;
}

export function useIdeas() {
  const c = useContext(IdeasCtx);
  if (!c) throw new Error('useIdeas outside IdeasProvider');
  return c;
}
