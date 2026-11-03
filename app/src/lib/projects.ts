export type ProjectStage = 'define' | 'build' | 'test' | 'shipped';
export const STAGES: ProjectStage[] = ['define', 'build', 'test', 'shipped'];
export type ProjectStatus = 'active' | 'on_hold' | 'stopped';
export type GateChoice = 'go' | 'hold' | 'stop';

export type ProjectRow = {
  node_id: string; business_id: string; stage: ProjectStage; status: ProjectStatus; source_idea_id: string | null; product_id: string | null;
};
export type GateCriterion = { id: string; business_id: string; from_stage: Exclude<ProjectStage, 'shipped'>; key: string | null; name: string | null; position: number };
export type GateItem = { project_id: string; criterion_id: string };
export type GateReview = {
  id: string; project_id: string; from_stage: ProjectStage; to_stage: ProjectStage | null; decision: GateChoice; note: string | null; decided_by: string | null; decided_at: string;
};

export const nextStage = (s: ProjectStage): ProjectStage | null => (s === 'define' ? 'build' : s === 'build' ? 'test' : s === 'test' ? 'shipped' : null);
