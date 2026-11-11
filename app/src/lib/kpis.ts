import type { InvNode, NodeType } from './inventory';
import type { IdeaRow } from './ideas';
import type { GateReview, ProjectRow } from './projects';

export type KpiMetric = 'ideas_submitted' | 'ideas_approved' | 'projects_active' | 'projects_shipped' | 'inventory_count' | 'idea_score_avg' | 'manual';
export const METRICS: KpiMetric[] = ['ideas_submitted', 'ideas_approved', 'projects_shipped', 'projects_active', 'inventory_count', 'idea_score_avg', 'manual'];
export type KpiPeriod = 'all_time' | 'month' | 'quarter' | 'year';
export const PERIODS: KpiPeriod[] = ['all_time', 'month', 'quarter', 'year'];
export type Direction = 'at_least' | 'at_most';
export type GoalStatus = 'active' | 'achieved' | 'archived';

export type Kpi = {
  id: string; business_id: string; name: string; description: string | null; unit: string | null; metric: KpiMetric;
  scope_type: NodeType | null; scope_subtype: string | null; period: KpiPeriod; created_at: string;
};
export type Snapshot = { id: string; kpi_id: string; snap_date: string; value: number };
export type Goal = {
  id: string; business_id: string; title: string; description: string | null; based_on: NodeType; kpi_id: string | null;
  target_value: number; direction: Direction; start_date: string; due_date: string | null; status: GoalStatus; created_at: string;
};
export type GoalNode = { goal_id: string; node_id: string };

/** The metric that best matches the type a goal is based on (used as the default suggestion). */
export const DEFAULT_METRIC: Record<NodeType, KpiMetric> = { concept: 'ideas_submitted', activity: 'projects_shipped', resource: 'inventory_count', person: 'manual' };

export function periodStart(period: KpiPeriod, now = new Date()): Date | null {
  if (period === 'all_time') return null;
  const y = now.getFullYear(); const m = now.getMonth();
  if (period === 'month') return new Date(y, m, 1);
  if (period === 'quarter') return new Date(y, Math.floor(m / 3) * 3, 1);
  return new Date(y, 0, 1);
}

export type KpiData = {
  nodes: InvNode[]; ideas: IdeaRow[]; projects: ProjectRow[]; reviews: GateReview[];
  ideaScores: number[]; latestManual: number | null;
};

export function computeKpi(kpi: Kpi, d: KpiData, now = new Date()): number {
  const from = periodStart(kpi.period, now);
  const inPeriod = (iso: string | null) => !!iso && (!from || new Date(iso) >= from);
  switch (kpi.metric) {
    case 'ideas_submitted': return d.nodes.filter((n) => n.subtype === 'idea' && inPeriod(n.created_at)).length;
    case 'ideas_approved': return d.ideas.filter((i) => i.status === 'approved' && inPeriod(i.decided_at)).length;
    case 'projects_shipped': return d.reviews.filter((r) => r.decision === 'go' && r.to_stage === 'shipped' && inPeriod(r.decided_at)).length;
    case 'projects_active': return d.projects.filter((p) => p.status === 'active' && p.stage !== 'shipped').length;
    case 'inventory_count':
      return d.nodes.filter((n) => (!kpi.scope_type || n.type === kpi.scope_type) && (!kpi.scope_subtype || n.subtype === kpi.scope_subtype) && inPeriod(n.created_at)).length;
    case 'idea_score_avg': return d.ideaScores.length ? d.ideaScores.reduce((a, b) => a + b, 0) / d.ideaScores.length : 0;
    case 'manual': return d.latestManual ?? 0;
  }
}

export type GoalState = 'achieved' | 'on_track' | 'at_risk' | 'overdue' | 'archived';

export function goalProgress(g: Goal, value: number): number {
  if (g.direction === 'at_least') return g.target_value > 0 ? Math.max(0, Math.min(1, value / g.target_value)) : 1;
  return value <= g.target_value ? 1 : Math.max(0, Math.min(1, g.target_value / value));
}

export function goalState(g: Goal, value: number, now = new Date()): GoalState {
  if (g.status === 'archived') return 'archived';
  if (g.status === 'achieved') return 'achieved';
  const due = g.due_date ? new Date(g.due_date) : null;
  const done = g.direction === 'at_least' ? value >= g.target_value : value <= g.target_value;
  if (g.direction === 'at_least' && done) return 'achieved';
  if (due && now > due) return done ? 'achieved' : 'overdue';
  if (g.direction === 'at_most') return done ? 'on_track' : 'at_risk';
  if (!due) return 'on_track';
  const start = new Date(g.start_date).getTime();
  const total = due.getTime() - start;
  const elapsed = total > 0 ? Math.max(0, Math.min(1, (now.getTime() - start) / total)) : 1;
  return elapsed > 0.1 && goalProgress(g, value) < elapsed - 0.15 ? 'at_risk' : 'on_track';
}

/** Last day (YYYY-MM-DD, local time) of the current month, quarter or year. */
export function periodEnd(period: 'month' | 'quarter' | 'year', now = new Date()): string {
  const y = now.getFullYear(); const m = now.getMonth();
  const d = period === 'month' ? new Date(y, m + 1, 0) : period === 'quarter' ? new Date(y, Math.floor(m / 3) * 3 + 3, 0) : new Date(y, 12, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const isoToday = () => new Date().toISOString().slice(0, 10);
export const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
