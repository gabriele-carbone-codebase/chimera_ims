import type { InvNode, InvRel } from './inventory';

export type AssumptionStatus = 'unverified' | 'valid' | 'invalid';
export const ASSUMPTION_STATUSES: AssumptionStatus[] = ['unverified', 'valid', 'invalid'];
export type StrategyStatus = 'draft' | 'active' | 'archived';
export type InvestUnit = 'hours' | 'money' | 'days';
export const UNITS: InvestUnit[] = ['hours', 'money', 'days'];

export type Assumption = {
  id: string; business_id: string; statement: string; status: AssumptionStatus; evidence: string | null; trigger_text: string | null;
  review_every_days: number; next_review: string; last_reviewed_at: string | null; accepted_risk: boolean; created_at: string;
};
export type AssumptionNode = { assumption_id: string; node_id: string };
export type AssumptionReview = { id: string; assumption_id: string; status: AssumptionStatus; note: string | null; reviewed_by: string | null; reviewed_at: string };
export type Strategy = { id: string; business_id: string; version: number; title: string; summary: string | null; status: StrategyStatus; created_at: string; activated_at: string | null };
export type Investment = { strategy_id: string; activity_id: string; amount: number; unit: InvestUnit; effectiveness: number | null };
export type Decision = { strategy_id: string; node_id: string; assumption_id: string | null; note: string | null };
export type StrategyAssumption = { strategy_id: string; assumption_id: string; status_at_link: AssumptionStatus };
export type Transition = { id: string; from_strategy: string | null; to_strategy: string | null; reason: string | null; created_at: string };
export type Monitoring = { node_id: string; owner_id: string | null; review_every_days: number; next_review: string };
export type FieldSettings = { estimated_total: number | null; notes: string | null };

/** Ideas are inflow and programs are containers: neither is decided on in the strategy. */
export const isFieldArtifact = (n: InvNode) => n.subtype !== 'idea' && n.subtype !== 'program';

export type Usage = 'used' | 'not_used' | 'undecided';

/**
 * The innovation system is calculated, never stored: an artifact is used when it is linked to an activity
 * with investment above zero (the activity itself counts as used).
 */
export function usedSet(nodes: InvNode[], relationships: InvRel[], investments: Investment[]): Set<string> {
  const active = new Set(investments.filter((i) => i.amount > 0).map((i) => i.activity_id));
  const used = new Set<string>(active);
  for (const r of relationships) {
    if (r.strength === 'none') continue;
    if (r.type === 'performs' && active.has(r.to_node)) used.add(r.from_node);
    if (r.type === 'uses' && active.has(r.from_node)) used.add(r.to_node);
    if (r.type === 'part_of' && active.has(r.from_node)) used.add(r.to_node);
  }
  return used;
}

export function usageOf(nodeId: string, used: Set<string>, decisions: Decision[]): Usage {
  if (used.has(nodeId)) return 'used';
  return decisions.some((d) => d.node_id === nodeId) ? 'not_used' : 'undecided';
}

export type Drift = { total: number; changed: number; suggest: boolean };
export const DRIFT_THRESHOLD = 0.3;

/** How far the assumptions behind a strategy have moved since it was activated. The manager decides what to do about it. */
export function driftOf(links: StrategyAssumption[], assumptions: Assumption[]): Drift {
  const byId = Object.fromEntries(assumptions.map((a) => [a.id, a]));
  let changed = 0;
  for (const l of links) {
    const a = byId[l.assumption_id];
    if (a && (a.status !== l.status_at_link || (a.status === 'invalid' && !a.accepted_risk))) changed += 1;
  }
  const total = links.length;
  return { total, changed, suggest: total > 0 && changed >= 1 && changed / total >= DRIFT_THRESHOLD };
}

export const isDue = (a: Assumption, today = new Date().toISOString().slice(0, 10)) => a.next_review <= today;
