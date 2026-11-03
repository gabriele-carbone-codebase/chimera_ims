import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { driftOf, type Assumption, type AssumptionNode, type AssumptionReview, type AssumptionStatus, type Decision, type Drift, type FieldSettings, type InvestUnit, type Investment, type Monitoring, type Strategy, type StrategyAssumption, type Transition } from '../lib/strategy';

export type AssumptionInput = { statement: string; evidence: string | null; trigger_text: string | null; review_every_days: number; nodeIds: string[] };

type Ctx = {
  loading: boolean;
  field: FieldSettings;
  monitoring: Monitoring[];
  assumptions: Assumption[];
  assumptionNodes: AssumptionNode[];
  assumptionReviews: AssumptionReview[];
  strategies: Strategy[];
  investments: Investment[];
  decisions: Decision[];
  links: StrategyAssumption[];
  transitions: Transition[];
  active: Strategy | null;
  draft: Strategy | null;
  activeDrift: Drift;
  saveField: (estimated: number | null, notes: string | null) => Promise<void>;
  setMonitored: (nodeId: string, on: boolean) => Promise<void>;
  createAssumption: (input: AssumptionInput) => Promise<string>;
  updateAssumption: (id: string, patch: Partial<Pick<Assumption, 'statement' | 'evidence' | 'trigger_text' | 'review_every_days'>>) => Promise<void>;
  reviewAssumption: (id: string, status: AssumptionStatus, note: string | null, riskAccepted: boolean) => Promise<void>;
  deleteAssumption: (id: string) => Promise<void>;
  createDraft: (title: string) => Promise<string>;
  updateStrategy: (id: string, patch: { title?: string; summary?: string | null }) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  activate: (id: string, reason: string | null) => Promise<void>;
  saveInvestments: (strategyId: string, rows: { activity_id: string; amount: number; unit: InvestUnit }[]) => Promise<void>;
  setDecision: (strategyId: string, nodeId: string, assumptionId: string | null) => Promise<void>;
  clearDecision: (strategyId: string, nodeId: string) => Promise<void>;
  linkAssumption: (strategyId: string, assumptionId: string, status: AssumptionStatus) => Promise<void>;
  unlinkAssumption: (strategyId: string, assumptionId: string) => Promise<void>;
};

const StratCtx = createContext<Ctx | null>(null);

export function StrategyProvider({ children }: { children: React.ReactNode }) {
  const { current, session } = useApp();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [field, setField] = useState<FieldSettings>({ estimated_total: null, notes: null });
  const [monitoring, setMonitoring] = useState<Monitoring[]>([]);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [assumptionNodes, setAssumptionNodes] = useState<AssumptionNode[]>([]);
  const [assumptionReviews, setAssumptionReviews] = useState<AssumptionReview[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [links, setLinks] = useState<StrategyAssumption[]>([]);
  const [transitions, setTransitions] = useState<Transition[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const q = (table: string) => supabase.from(table).select('*').eq('business_id', businessId);
    const [f, m, a, an, ar, s, i, d, l, t] = await Promise.all([
      supabase.from('field_settings').select('estimated_total, notes').eq('business_id', businessId).maybeSingle(),
      q('node_monitoring'), q('assumptions').order('created_at'), q('assumption_nodes'), q('assumption_reviews').order('reviewed_at', { ascending: false }),
      q('strategies').order('version', { ascending: false }), q('strategy_investments'), q('strategy_decisions'), q('strategy_assumptions'), q('transitions').order('created_at', { ascending: false }),
    ]);
    for (const x of [f, m, a, an, ar, s, i, d, l, t]) if (x.error) throw x.error;
    setField((f.data as FieldSettings) ?? { estimated_total: null, notes: null });
    setMonitoring(m.data as Monitoring[]);
    setAssumptions(a.data as Assumption[]);
    setAssumptionNodes(an.data as AssumptionNode[]);
    setAssumptionReviews(ar.data as AssumptionReview[]);
    setStrategies(s.data as Strategy[]);
    setInvestments((i.data as Investment[]).map((x) => ({ ...x, amount: Number(x.amount) })));
    setDecisions(d.data as Decision[]);
    setLinks(l.data as StrategyAssumption[]);
    setTransitions(t.data as Transition[]);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);

  const active = useMemo(() => strategies.find((s) => s.status === 'active') ?? null, [strategies]);
  const draft = useMemo(() => strategies.find((s) => s.status === 'draft') ?? null, [strategies]);
  const activeDrift = useMemo(() => driftOf(links.filter((l) => l.strategy_id === active?.id), assumptions), [links, assumptions, active]);

  const ok = async (p: PromiseLike<{ error: any }>) => { const { error } = await p; if (error) throw error; await reload(); };
  const need = () => { if (!businessId) throw new Error('No business'); return businessId; };

  const value: Ctx = {
    loading, field, monitoring, assumptions, assumptionNodes, assumptionReviews, strategies, investments, decisions, links, transitions, active, draft, activeDrift,
    saveField: (estimated, notes) => ok(supabase.from('field_settings').upsert({ business_id: need(), estimated_total: estimated, notes, updated_at: new Date().toISOString() })),
    setMonitored: (nodeId, on) => ok(on
      ? supabase.from('node_monitoring').insert({ node_id: nodeId, business_id: need(), owner_id: session?.user.id ?? null })
      : supabase.from('node_monitoring').delete().eq('node_id', nodeId)),
    createAssumption: async (input) => {
      const bid = need();
      const { data, error } = await supabase.from('assumptions').insert({ business_id: bid, statement: input.statement, evidence: input.evidence, trigger_text: input.trigger_text, review_every_days: input.review_every_days, next_review: new Date(Date.now() + input.review_every_days * 86400000).toISOString().slice(0, 10) }).select('id').single();
      if (error) throw error;
      if (input.nodeIds.length) {
        const r = await supabase.from('assumption_nodes').insert(input.nodeIds.map((node_id) => ({ assumption_id: data.id, node_id, business_id: bid })));
        if (r.error) throw r.error;
      }
      await reload();
      return data.id as string;
    },
    updateAssumption: (id, patch) => ok(supabase.from('assumptions').update(patch).eq('id', id)),
    reviewAssumption: (id, status, note, riskAccepted) => ok(supabase.rpc('review_assumption', { aid: id, new_status: status, review_note: note, risk_accepted: riskAccepted })),
    deleteAssumption: (id) => ok(supabase.from('assumptions').delete().eq('id', id)),
    createDraft: async (title) => {
      const { data, error } = await supabase.rpc('create_strategy_draft', { bid: need(), strategy_title: title });
      if (error) throw error;
      await reload();
      return data as string;
    },
    updateStrategy: (id, patch) => ok(supabase.from('strategies').update(patch).eq('id', id)),
    deleteStrategy: (id) => ok(supabase.from('strategies').delete().eq('id', id)),
    activate: (id, reason) => ok(supabase.rpc('activate_strategy', { sid: id, transition_reason: reason })),
    saveInvestments: (strategyId, rows) => ok(supabase.from('strategy_investments').upsert(rows.map((r) => ({ strategy_id: strategyId, business_id: need(), ...r })), { onConflict: 'strategy_id,activity_id' })),
    setDecision: (strategyId, nodeId, assumptionId) => ok(supabase.from('strategy_decisions').upsert({ strategy_id: strategyId, node_id: nodeId, business_id: need(), assumption_id: assumptionId }, { onConflict: 'strategy_id,node_id' })),
    clearDecision: (strategyId, nodeId) => ok(supabase.from('strategy_decisions').delete().eq('strategy_id', strategyId).eq('node_id', nodeId)),
    linkAssumption: (strategyId, assumptionId, status) => ok(supabase.from('strategy_assumptions').upsert({ strategy_id: strategyId, assumption_id: assumptionId, business_id: need(), status_at_link: status }, { onConflict: 'strategy_id,assumption_id' })),
    unlinkAssumption: (strategyId, assumptionId) => ok(supabase.from('strategy_assumptions').delete().eq('strategy_id', strategyId).eq('assumption_id', assumptionId)),
  };

  return <StratCtx.Provider value={value}>{children}</StratCtx.Provider>;
}

export function useStrategy() {
  const c = useContext(StratCtx);
  if (!c) throw new Error('useStrategy outside StrategyProvider');
  return c;
}
