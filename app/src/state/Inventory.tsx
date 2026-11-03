import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import type { InvNode, InvRel, NodeType, RelType, Strength } from '../lib/inventory';

export type NodeInput = { id?: string; type: NodeType; subtype: string | null; title: string; description: string | null };
export type RelInput = { from: string; to: string; type: RelType; strength: Strength; note?: string | null };

type Ctx = {
  loading: boolean;
  nodes: InvNode[];
  relationships: InvRel[];
  byId: Record<string, InvNode>;
  reload: () => Promise<void>;
  saveNode: (input: NodeInput) => Promise<string>;
  deleteNode: (id: string) => Promise<void>;
  saveRelationship: (input: RelInput) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
};

const InvCtx = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { current, session } = useApp();
  const businessId = current?.business_id ?? null;
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<InvNode[]>([]);
  const [relationships, setRelationships] = useState<InvRel[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) { setNodes([]); setRelationships([]); setLoading(false); return; }
    setLoading(true);
    const [n, r] = await Promise.all([
      supabase.from('nodes').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      supabase.from('relationships').select('*').eq('business_id', businessId),
    ]);
    if (n.error) throw n.error;
    if (r.error) throw r.error;
    setNodes(n.data as InvNode[]);
    setRelationships(r.data as InvRel[]);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { reload().catch(() => setLoading(false)); }, [reload]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const value: Ctx = {
    loading, nodes, relationships, byId, reload,
    saveNode: async (input) => {
      if (!businessId || !session) throw new Error('No business');
      const row = { type: input.type, subtype: input.subtype, title: input.title, description: input.description };
      if (input.id) {
        const { error } = await supabase.from('nodes').update(row).eq('id', input.id);
        if (error) throw error;
        await reload();
        return input.id;
      }
      const { data, error } = await supabase.from('nodes').insert({ ...row, business_id: businessId, created_by: session.user.id }).select('id').single();
      if (error) throw error;
      await reload();
      return data.id as string;
    },
    deleteNode: async (id) => {
      const { error } = await supabase.from('nodes').delete().eq('id', id);
      if (error) throw error;
      await reload();
    },
    saveRelationship: async (input) => {
      if (!businessId || !session) throw new Error('No business');
      const { error } = await supabase.from('relationships').upsert(
        { business_id: businessId, from_node: input.from, to_node: input.to, type: input.type, strength: input.strength, note: input.note ?? null, created_by: session.user.id },
        { onConflict: 'business_id,from_node,to_node,type' },
      );
      if (error) throw error;
      await reload();
    },
    deleteRelationship: async (id) => {
      const { error } = await supabase.from('relationships').delete().eq('id', id);
      if (error) throw error;
      await reload();
    },
  };

  return <InvCtx.Provider value={value}>{children}</InvCtx.Provider>;
}

export function useInventory() {
  const c = useContext(InvCtx);
  if (!c) throw new Error('useInventory outside InventoryProvider');
  return c;
}
