import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from './AppState';
import { useInventory } from './Inventory';
import { useIdeas } from './Ideas';
import { useProjects } from './Projects';
import { useGoals } from './Goals';
import { useStrategy } from './Strategy';
import { isDue } from '../lib/strategy';

export type Target =
  | { type: 'idea'; id: string }
  | { type: 'project'; id: string }
  | { type: 'goal'; id: string }
  | { type: 'assumption'; id: string }
  | { type: 'strategy'; id: string };

export type Attention = {
  key: string;
  kind: 'vote_needed' | 'idea_waiting' | 'gate_due' | 'goal_at_risk' | 'assumption_due' | 'strategy_review';
  params: Record<string, string | number>;
  target: Target;
};

type Ctx = { items: Attention[]; count: number; dismiss: (key: string) => Promise<void>; dismissAll: () => Promise<void> };
const NotifCtx = createContext<Ctx | null>(null);

/**
 * "Attention items" are derived from the data already loaded: votes needed, ideas waiting for evaluation,
 * gate decisions due, goals at risk, assumption reviews due and strategy reviews suggested.
 * Only the dismissed (read) keys are stored, per user. Pushing them to phones will need a server-side job later.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { current, session } = useApp();
  const { byId } = useInventory();
  const { ideas, ideaCriteria, evaluations } = useIdeas();
  const { projects, gateCriteria, items: gateItems } = useProjects();
  const { goals, stateOf } = useGoals();
  const { assumptions, active, activeDrift } = useStrategy();
  const businessId = current?.business_id ?? null;
  const role = current?.role;
  const userId = session?.user.id;
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!businessId || !userId) return;
    supabase.from('notification_dismissals').select('key').eq('business_id', businessId).eq('user_id', userId)
      .then(({ data }) => setDismissed(new Set((data ?? []).map((r) => r.key as string))));
  }, [businessId, userId]);

  const all = useMemo<Attention[]>(() => {
    if (!role || !userId) return [];
    const out: Attention[] = [];
    const manager = role === 'owner' || role === 'innovation_manager';
    const evaluator = manager || role === 'evaluator';
    const title = (id: string) => byId[id]?.title ?? '';

    ideas.forEach((i) => {
      if (!byId[i.node_id]) return;
      if (i.status === 'in_evaluation' && evaluator && ideaCriteria.some((c) => c.idea_id === i.node_id) && !evaluations.some((e) => e.idea_id === i.node_id && e.evaluator_id === userId)) {
        out.push({ key: `vote:${i.node_id}`, kind: 'vote_needed', params: { title: title(i.node_id) }, target: { type: 'idea', id: i.node_id } });
      }
      if (i.status === 'submitted' && manager) {
        out.push({ key: `idea:${i.node_id}`, kind: 'idea_waiting', params: { title: title(i.node_id) }, target: { type: 'idea', id: i.node_id } });
      }
    });

    if (manager) {
      projects.forEach((p) => {
        if (p.status !== 'active' || p.stage === 'shipped' || !byId[p.node_id]) return;
        const need = gateCriteria.filter((c) => c.from_stage === p.stage);
        if (need.length > 0 && need.every((c) => gateItems.some((i) => i.project_id === p.node_id && i.criterion_id === c.id))) {
          out.push({ key: `gate:${p.node_id}:${p.stage}`, kind: 'gate_due', params: { title: title(p.node_id) }, target: { type: 'project', id: p.node_id } });
        }
      });
      goals.forEach((g) => {
        const st = stateOf(g);
        if (st === 'at_risk' || st === 'overdue') out.push({ key: `goal:${g.id}:${st}`, kind: 'goal_at_risk', params: { title: g.title }, target: { type: 'goal', id: g.id } });
      });
      assumptions.filter((a) => isDue(a)).forEach((a) => {
        out.push({ key: `assumption:${a.id}:${a.next_review}`, kind: 'assumption_due', params: { title: a.statement }, target: { type: 'assumption', id: a.id } });
      });
      if (active && activeDrift.suggest) {
        out.push({ key: `drift:${active.id}:${activeDrift.changed}`, kind: 'strategy_review', params: { changed: activeDrift.changed, total: activeDrift.total }, target: { type: 'strategy', id: active.id } });
      }
    }
    return out;
  }, [role, userId, ideas, ideaCriteria, evaluations, projects, gateCriteria, gateItems, goals, stateOf, assumptions, active, activeDrift, byId]);

  const items = useMemo(() => all.filter((a) => !dismissed.has(a.key)), [all, dismissed]);

  const dismiss = useCallback(async (key: string) => {
    if (!businessId || !userId) return;
    setDismissed((d) => new Set(d).add(key));
    await supabase.from('notification_dismissals').upsert({ user_id: userId, business_id: businessId, key }, { onConflict: 'user_id,business_id,key' });
  }, [businessId, userId]);

  const dismissAll = useCallback(async () => {
    if (!businessId || !userId || !items.length) return;
    setDismissed((d) => new Set([...d, ...items.map((i) => i.key)]));
    await supabase.from('notification_dismissals').upsert(items.map((i) => ({ user_id: userId, business_id: businessId, key: i.key })), { onConflict: 'user_id,business_id,key' });
  }, [businessId, userId, items]);

  return <NotifCtx.Provider value={{ items, count: items.length, dismiss, dismissAll }}>{children}</NotifCtx.Provider>;
}

export function useNotifications() {
  const c = useContext(NotifCtx);
  if (!c) throw new Error('useNotifications outside NotificationsProvider');
  return c;
}
