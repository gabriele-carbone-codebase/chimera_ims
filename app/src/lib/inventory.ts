import type { Role } from './supabase';

export type NodeType = 'person' | 'resource' | 'concept' | 'activity';
export const NODE_TYPES: NodeType[] = ['person', 'resource', 'concept', 'activity'];

// Suggested subtypes per type. Keys are translated in i18n (subtype.<key>).
// idea, project and program are created by their own flows (see the nodes_guard trigger) and are not offered here.
export const SUBTYPES: Record<NodeType, string[]> = {
  person: ['employee', 'customer', 'partner', 'expert', 'team'],
  resource: ['product', 'service', 'budget', 'tool', 'space', 'data', 'equipment', 'incentive'],
  concept: ['framework', 'knowledge', 'culture', 'policy', 'ip'],
  activity: ['process', 'event', 'training'],
};

export type RelType = 'performs' | 'uses' | 'produces' | 'owns' | 'part_of' | 'derived_from' | 'targets' | 'related_to';
export const REL_TYPES: RelType[] = ['related_to', 'performs', 'uses', 'produces', 'owns', 'part_of', 'derived_from', 'targets'];

export type Strength = 'none' | 'weak' | 'strong';
export const STRENGTHS: Strength[] = ['strong', 'weak', 'none'];

export type InvNode = {
  id: string; business_id: string; type: NodeType; subtype: string | null; title: string;
  description: string | null; status: string; created_by: string | null; created_at: string;
};
export type InvRel = {
  id: string; business_id: string; from_node: string; to_node: string; type: RelType; strength: Strength; note: string | null; created_by: string | null;
  position: number | null;
};

/** Subtypes owned by a workflow table (ideas, projects, programs): their type cannot be edited by hand. */
export const isManagedNode = (n: { subtype: string | null }) => n.subtype === 'idea' || n.subtype === 'project' || n.subtype === 'program';

export const canWrite = (role: Role) => role === 'owner' || role === 'innovation_manager' || role === 'contributor';
export const canManageAll = (role: Role) => role === 'owner' || role === 'innovation_manager';
export const canEdit = (role: Role, userId: string | undefined, createdBy: string | null) =>
  canManageAll(role) || (role === 'contributor' && !!userId && createdBy === userId);
