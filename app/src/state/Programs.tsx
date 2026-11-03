import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import { buildProgramPayload } from '../lib/templates';
import type { InvNode, InvRel } from '../lib/inventory';

export type ProgramRow = { node_id: string; business_id: string; template_key: string | null };
export type ActivityView = { node: InvNode; performers: { rel: InvRel; node: InvNode }[]; uses: { rel: InvRel; node: InvNode }[]; produces: { rel: InvRel; node: InvNode }[] };

type Ctx = {
  loading: boolean;
  programs: ProgramRow[];
  activitiesOf: (programId: string) => ActivityView[];
  createProgram: (t: (k: string) => string, templateKey: string | null, name: string, description: string | null) => Promise<string>;
  addActivity: (programId: string, title: string) => Promise<void>;
};

const ProgCtx = createContext<Ctx | null>(null);

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const { current } = useApp();
  const { nodes, relationships, byId, reload: reloadNodes, saveNode, saveRelationship } = useInventory();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    const { data, error } = await supabase.from('programs').select('node_id, business_id, template_key').eq('business_id', businessId);
    if (error) throw error;
    setPrograms(data as ProgramRow[]);
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
    addActivity: async (programId, title) => {
      const id = await saveNode({ type: 'activity', subtype: 'process', title, description: null });
      const position = (byTo[programId] ?? []).filter((r) => r.type === 'part_of').length + 1;
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
