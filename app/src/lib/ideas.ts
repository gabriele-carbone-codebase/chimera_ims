export type IdeaStatus = 'submitted' | 'in_evaluation' | 'approved' | 'rejected' | 'on_hold';
export const IDEA_STATUSES: IdeaStatus[] = ['submitted', 'in_evaluation', 'approved', 'on_hold', 'rejected'];

export type IdeaRow = {
  node_id: string; business_id: string; anonymous: boolean; status: IdeaStatus;
  decided_by: string | null; decided_at: string | null; decision_note: string | null;
};
export type Criterion = { id: string; business_id: string; key: string | null; name: string | null; description: string | null; is_default: boolean; archived: boolean };
export type IdeaCriterion = { idea_id: string; criterion_id: string; weight: number };
export type Evaluation = { idea_id: string; evaluator_id: string; criterion_id: string; score: number; comment: string | null };

export const SCORES = [1, 2, 3, 4, 5] as const;
export const WEIGHTS = [1, 2, 3, 4, 5] as const;
export const DEFAULT_WEIGHT = 3;

export type Result = { score: number | null; evaluators: number; perCriterion: Record<string, number> };

/** Weighted score of one evaluator: Σ(weight·score) / Σ(weight), over the criteria they scored. */
function evaluatorScore(criteria: IdeaCriterion[], scores: Record<string, number>): number | null {
  let num = 0; let den = 0;
  for (const c of criteria) {
    const s = scores[c.criterion_id];
    if (s != null) { num += c.weight * s; den += c.weight; }
  }
  return den ? num / den : null;
}

/** Average of every evaluator's weighted score, plus the average score per criterion. */
export function computeResult(criteria: IdeaCriterion[], evaluations: Evaluation[]): Result {
  const byEvaluator: Record<string, Record<string, number>> = {};
  const sums: Record<string, { total: number; n: number }> = {};
  for (const e of evaluations) {
    (byEvaluator[e.evaluator_id] ??= {})[e.criterion_id] = e.score;
    const s = (sums[e.criterion_id] ??= { total: 0, n: 0 });
    s.total += e.score; s.n += 1;
  }
  const per = Object.values(byEvaluator).map((sc) => evaluatorScore(criteria, sc)).filter((x): x is number => x != null);
  return {
    score: per.length ? per.reduce((a, b) => a + b, 0) / per.length : null,
    evaluators: per.length,
    perCriterion: Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, v.total / v.n])),
  };
}
