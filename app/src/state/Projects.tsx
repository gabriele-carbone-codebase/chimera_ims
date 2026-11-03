import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import type { GateChoice, GateCriterion, GateItem, GateReview, ProjectRow, ProjectStage } from '../lib/projects';

type Ctx = {
  loading: boolean;
  projects: ProjectRow[];
  gateCriteria: GateCriterion[];
  items: GateItem[];
  reviews: GateReview[];
  reviewers: Record<string, string>;
  createProject: (title: string, description: string | null, fromIdea?: string) => Promise<string>;
  toggleItem: (projectId: string, criterionId: string, met: boolean) => Promise<void>;
  addGateCriterion: (stage: Exclude<ProjectStage, 'shipped'>, name: string) => Promise<void>;
  review: (projectId: string, choice: GateChoice, note: string | null, shipAs?: 'product' | 'service') => Promise<void>;
  resume: (projectId: string) => Promise<void>;
};

const ProjCtx = createContext<Ctx | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { current, session } = useApp();
  const { reload: reloadNodes, nodes } = useInventory();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [gateCriteria, setGateCriteria] = useState<GateCriterion[]>([]);
  const [items, setItems] = useState<GateItem[]>([]);
  const [reviews, setReviews] = useState<GateReview[]>([]);
  const [reviewers, setReviewers] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const [p, c, i, r] = await Promise.all([
      supabase.from('projects').select('*').eq('business_id', businessId),
      supabase.from('gate_criteria').select('*').eq('business_id', businessId).order('position'),
      supabase.from('project_gate_items').select('project_id, criterion_id').eq('business_id', businessId),
      supabase.from('gate_reviews').select('*').eq('business_id', businessId).order('decided_at', { ascending: false }),
    ]);
    for (const x of [p, c, i, r]) if (x.error) throw x.error;
    setProjects(p.data as ProjectRow[]); setGateCriteria(c.data as GateCriterion[]); setItems(i.data as GateItem[]); setReviews(r.data as GateReview[]);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);

  useEffect(() => {
    const ids = [...new Set(reviews.map((r) => r.decided_by).filter((x): x is string => !!x))];
    if (!ids.length) { setReviewers({}); return; }
    supabase.from('profiles').select('id, display_name').in('id', ids).then(({ data }) => {
      setReviewers(Object.fromEntries((data ?? []).map((p) => [p.id as string, (p.display_name as string) ?? ''])));
    });
  }, [reviews, nodes.length]);

  const both = async () => { await Promise.all([reloadNodes(), reload()]); };

  const value: Ctx = {
    loading, projects, gateCriteria, items, reviews, reviewers,
    createProject: async (title, description, fromIdea) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.rpc('create_project', { bid: businessId, project_title: title, project_description: description, from_idea: fromIdea ?? null });
      if (error) throw error;
      await both();
      return data as string;
    },
    toggleItem: async (projectId, criterionId, met) => {
      if (!businessId || !session) throw new Error('No business');
      const q = met
        ? supabase.from('project_gate_items').insert({ project_id: projectId, business_id: businessId, criterion_id: criterionId, updated_by: session.user.id })
        : supabase.from('project_gate_items').delete().eq('project_id', projectId).eq('criterion_id', criterionId);
      const { error } = await q;
      if (error) throw error;
      await reload();
    },
    addGateCriterion: async (stage, name) => {
      if (!businessId) throw new Error('No business');
      const position = gateCriteria.filter((c) => c.from_stage === stage).length + 1;
      const { error } = await supabase.from('gate_criteria').insert({ business_id: businessId, from_stage: stage, name, position });
      if (error) throw error;
      await reload();
    },
    review: async (projectId, choice, note, shipAs = 'product') => {
      const { error } = await supabase.rpc('review_gate', { pid: projectId, gate_choice: choice, review_note: note, ship_as: shipAs });
      if (error) throw error;
      await both();
    },
    resume: async (projectId) => {
      const { error } = await supabase.rpc('resume_project', { pid: projectId });
      if (error) throw error;
      await reload();
    },
  };

  return <ProjCtx.Provider value={value}>{children}</ProjCtx.Provider>;
}

export function useProjects() {
  const c = useContext(ProjCtx);
  if (!c) throw new Error('useProjects outside ProjectsProvider');
  return c;
}
