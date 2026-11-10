import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import { useIdeas } from './Ideas';
import { useProjects } from './Projects';
import { computeResult } from '../lib/ideas';
import { computeKpi, goalProgress, goalState, isoToday, type Direction, type Goal, type GoalNode, type GoalState, type Kpi, type KpiMetric, type KpiPeriod, type Snapshot } from '../lib/kpis';
import { canManageAll, type NodeType } from '../lib/inventory';

export type KpiInput = { name: string; description?: string | null; unit?: string | null; metric: KpiMetric; scope_type?: NodeType | null; scope_subtype?: string | null; period: KpiPeriod };
export type GoalInput = {
  title: string; description: string | null; based_on: NodeType; target_value: number; direction: Direction; due_date: string | null;
  kpiId?: string; newKpi?: KpiInput; nodeIds: string[];
};

type Ctx = {
  loading: boolean;
  kpis: Kpi[];
  goals: Goal[];
  goalNodes: GoalNode[];
  snapshots: Snapshot[];
  valueOf: (kpiId: string | null) => number;
  stateOf: (g: Goal) => GoalState;
  progressOf: (g: Goal) => number;
  createKpi: (input: KpiInput) => Promise<string>;
  deleteKpi: (id: string) => Promise<void>;
  recordManual: (kpiId: string, value: number) => Promise<void>;
  createGoal: (input: GoalInput) => Promise<string>;
  setGoalStatus: (id: string, status: Goal['status']) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
};

const GoalsCtx = createContext<Ctx | null>(null);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const { current } = useApp();
  const { nodes } = useInventory();
  const { ideas, ideaCriteria, evaluations } = useIdeas();
  const { projects, reviews } = useProjects();
  const businessId = current?.business_id ?? null;
  const role = current?.role;
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalNodes, setGoalNodes] = useState<GoalNode[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const [k, g, gn, s] = await Promise.all([
      supabase.from('kpis').select('*').eq('business_id', businessId).order('created_at'),
      supabase.from('goals').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      supabase.from('goal_nodes').select('goal_id, node_id').eq('business_id', businessId),
      supabase.from('kpi_snapshots').select('id, kpi_id, snap_date, value').eq('business_id', businessId).order('snap_date'),
    ]);
    for (const x of [k, g, gn, s]) if (x.error) throw x.error;
    setKpis(k.data as Kpi[]);
    setGoals((g.data as Goal[]).map((x) => ({ ...x, target_value: Number(x.target_value) })));
    setGoalNodes(gn.data as GoalNode[]);
    setSnapshots((s.data as Snapshot[]).map((x) => ({ ...x, value: Number(x.value) })));
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);

  const ideaScores = useMemo(() => {
    const out: number[] = [];
    ideas.forEach((i) => {
      const r = computeResult(ideaCriteria.filter((c) => c.idea_id === i.node_id), evaluations.filter((e) => e.idea_id === i.node_id));
      if (r.score != null) out.push(r.score);
    });
    return out;
  }, [ideas, ideaCriteria, evaluations]);

  const latestManualOf = useCallback((kpiId: string) => {
    const list = snapshots.filter((s) => s.kpi_id === kpiId);
    return list.length ? list[list.length - 1].value : null;
  }, [snapshots]);

  const valueByKpi = useMemo(() => {
    const m: Record<string, number> = {};
    kpis.forEach((k) => { m[k.id] = computeKpi(k, { nodes, ideas, projects, reviews, ideaScores, latestManual: latestManualOf(k.id) }); });
    return m;
  }, [kpis, nodes, ideas, projects, reviews, ideaScores, latestManualOf]);

  // Keep a daily history: one snapshot per computed KPI per day, rewritten if the value changed.
  // Only managers write it: other roles do not see every evaluation, so their numbers would differ.
  const written = useRef<Record<string, number>>({});
  useEffect(() => {
    if (loading || !businessId || !role || !canManageAll(role)) return;
    const today = isoToday();
    const rows = kpis.filter((k) => k.metric !== 'manual').flatMap((k) => {
      const v = valueByKpi[k.id];
      const key = `${k.id}:${today}`;
      const todays = snapshots.find((s) => s.kpi_id === k.id && s.snap_date === today);
      if (written.current[key] === v || (todays && todays.value === v)) return [];
      written.current[key] = v;
      return [{ kpi_id: k.id, business_id: businessId, snap_date: today, value: v }];
    });
    if (!rows.length) return;
    supabase.from('kpi_snapshots').upsert(rows, { onConflict: 'kpi_id,snap_date' }).then(({ error }) => { if (!error) reload().catch(() => {}); });
  }, [loading, businessId, role, kpis, valueByKpi, snapshots, reload]);

  const valueOf = (kpiId: string | null) => (kpiId ? valueByKpi[kpiId] ?? 0 : 0);

  const value: Ctx = {
    loading, kpis, goals, goalNodes, snapshots, valueOf,
    stateOf: (g) => goalState(g, valueOf(g.kpi_id)),
    progressOf: (g) => goalProgress(g, valueOf(g.kpi_id)),
    createKpi: async (input) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.from('kpis').insert({ business_id: businessId, ...input }).select('id').single();
      if (error) throw error;
      await reload();
      return data.id as string;
    },
    deleteKpi: async (id) => { const { error } = await supabase.from('kpis').delete().eq('id', id); if (error) throw error; await reload(); },
    recordManual: async (kpiId, v) => {
      if (!businessId) throw new Error('No business');
      const { error } = await supabase.from('kpi_snapshots').upsert({ kpi_id: kpiId, business_id: businessId, snap_date: isoToday(), value: v }, { onConflict: 'kpi_id,snap_date' });
      if (error) throw error;
      await reload();
    },
    createGoal: async (input) => {
      if (!businessId) throw new Error('No business');
      let kpiId = input.kpiId;
      if (!kpiId && input.newKpi) {
        const k = await supabase.from('kpis').insert({ business_id: businessId, ...input.newKpi }).select('id').single();
        if (k.error) throw k.error;
        kpiId = k.data.id as string;
      }
      const { data, error } = await supabase.from('goals').insert({
        business_id: businessId, title: input.title, description: input.description, based_on: input.based_on,
        kpi_id: kpiId ?? null, target_value: input.target_value, direction: input.direction, due_date: input.due_date,
      }).select('id').single();
      if (error) throw error;
      if (input.nodeIds.length) {
        const gn = await supabase.from('goal_nodes').insert(input.nodeIds.map((node_id) => ({ goal_id: data.id, node_id, business_id: businessId })));
        if (gn.error) throw gn.error;
      }
      await reload();
      return data.id as string;
    },
    setGoalStatus: async (id, status) => { const { error } = await supabase.from('goals').update({ status }).eq('id', id); if (error) throw error; await reload(); },
    deleteGoal: async (id) => { const { error } = await supabase.from('goals').delete().eq('id', id); if (error) throw error; await reload(); },
  };

  return <GoalsCtx.Provider value={value}>{children}</GoalsCtx.Provider>;
}

export function useGoals() {
  const c = useContext(GoalsCtx);
  if (!c) throw new Error('useGoals outside GoalsProvider');
  return c;
}
