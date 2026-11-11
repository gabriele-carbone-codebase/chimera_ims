import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import { buildProgramPayload } from '../lib/templates';
import type { InvNode, InvRel } from '../lib/inventory';

export type ProgramRow = { node_id: string; business_id: string; template_key: string | null };
export type WorkRow = { node_id: string; business_id: string; status: 'in_progress' | 'done'; answers: Record<string, string>; tags: Record<string, string[]>; started_at: string; completed_at: string | null };
export type ActivityView = { node: InvNode; position: number | null; performers: { rel: InvRel; node: InvNode }[]; uses: { rel: InvRel; node: InvNode }[]; produces: { rel: InvRel; node: InvNode }[] };

type Ctx = {
  loading: boolean;
  programs: ProgramRow[];
  activitiesOf: (programId: string) => ActivityView[];
  createProgram: (t: (k: string) => string, templateKey: string | null, name: string, description: string | null) => Promise<string>;
  addActivity: (programId: string, title: string) => Promise<void>;
  workOf: (activityId: string) => WorkRow | undefined;
  /** Starts the activity if it was not started yet. */
  startWork: (activityId: string) => Promise<void>;
  /** Saves the answers; `done` also marks the activity as completed (or back in progress). */
  saveWork: (activityId: string, answers: Record<string, string>, tags: Record<string, string[]>, done: boolean) => Promise<void>;
};

const ProgCtx = createContext<Ctx | null>(null);

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const { current } = useApp();
  const { nodes, relationships, byId, reload: reloadNodes, saveNode, saveRelationship } = useInventory();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [work, setWork] = useState<Record<string, WorkRow>>({});

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const { data, error } = await supabase.from('programs').select('node_id, business_id, template_key').eq('business_id', businessId);
    if (error) throw error;
    setPrograms(data as ProgramRow[]);
    const w = await supabase.from('activity_work').select('node_id, business_id, status, answers, tags, started_at, completed_at').eq('business_id', businessId);
    if (w.error) throw w.error;
    setWork(Object.fromEntries((w.data as WorkRow[]).map((x) => [x.node_id, x])));
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);
  // A program node deleted from the Inventory should disappear here too.
  useEffect(() => { setPrograms((p) => p.filter((x) => byId[x.node_id])); }, [nodes, byId]);

  const byFrom = useMemo(() => {
    const m: Record<string, InvRel[]> = {};
    relationships.forEach((r) => { (m[r.from_node] ??= []).push(r); });
    return m;
  }, [relationships]);
  const byTo = useMemo(() => {
    const m: Record<string, InvRel[]> = {};
    relationships.forEach((r) => { (m[r.to_node] ??= []).push(r); });
    return m;
  }, [relationships]);

  const value: Ctx = {
    loading, programs,
    activitiesOf: (programId) =>
      (byTo[programId] ?? [])
        .filter((r) => r.type === 'part_of' && byId[r.from_node])
        .sort((a, b) => (a.position ?? 1e6) - (b.position ?? 1e6))
        .map((r) => {
          const id = r.from_node;
          const pick = (rels: InvRel[], other: 'from_node' | 'to_node') => rels.filter((x) => byId[x[other]]).map((x) => ({ rel: x, node: byId[x[other]] }));
          return {
            node: byId[id],
            position: r.position ?? null,
            performers: pick((byTo[id] ?? []).filter((x) => x.type === 'performs'), 'from_node'),
            uses: pick((byFrom[id] ?? []).filter((x) => x.type === 'uses'), 'to_node'),
            produces: pick((byFrom[id] ?? []).filter((x) => x.type === 'produces'), 'to_node'),
          };
        }),
    createProgram: async (t, templateKey, name, description) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.rpc('create_program', { bid: businessId, payload: buildProgramPayload(t, templateKey, name, description) });
      if (error) throw error;
      await Promise.all([reloadNodes(), reload()]);
      return data as string;
    },
    workOf: (activityId) => work[activityId],
    startWork: async (activityId) => {
      if (!businessId || work[activityId]) return;
      const { data, error } = await supabase.from('activity_work').upsert({ node_id: activityId, business_id: businessId }, { onConflict: 'node_id', ignoreDuplicates: true }).select().maybeSingle();
      if (error) throw error;
      if (data) setWork((w) => ({ ...w, [activityId]: data as WorkRow }));
    },
    saveWork: async (activityId, answers, tags, done) => {
      if (!businessId) throw new Error('No business');
      const { data, error } = await supabase.from('activity_work')
        .upsert({ node_id: activityId, business_id: businessId, answers, tags, status: done ? 'done' : 'in_progress' }, { onConflict: 'node_id' }).select().single();
      if (error) throw error;
      setWork((w) => ({ ...w, [activityId]: data as WorkRow }));
    },
    addActivity: async (programId, title) => {
      const id = await saveNode({ type: 'activity', subtype: 'process', title, description: null });
      // highest position + 1 (not a count), so positions never repeat after a delete and each template activity keeps its guide
      const position = Math.max(0, ...(byTo[programId] ?? []).filter((r) => r.type === 'part_of').map((r) => r.position ?? 0)) + 1;
      await saveRelationship({ from: id, to: programId, type: 'part_of', strength: 'strong', position });
    },
  };

  return <ProgCtx.Provider value={value}>{children}</ProgCtx.Provider>;
}

export function usePrograms() {
  const c = useContext(ProgCtx);
  if (!c) throw new Error('usePrograms outside ProgramsProvider');
  return c;
}
