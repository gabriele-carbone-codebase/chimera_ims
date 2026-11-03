import type { Role } from './supabase';

export type NodeType = 'person' | 'resource' | 'concept' | 'activity';
export const NODE_TYPES: NodeType[] = ['person', 'resource', 'concept', 'activity'];

// Suggested subtypes per type. Keys are translated in i18n (subtype.<key>).
export const SUBTYPES: Record<NodeType, string[]> = {
  person: ['employee', 'customer', 'partner', 'expert', 'team'],
  resource: ['product', 'service', 'budget', 'tool', 'space', 'data', 'equipment', 'incentive'],
  concept: ['framework', 'knowledge', 'culture', 'policy', 'ip'],
  activity: ['process', 'project', 'program', 'event', 'training'],
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
};

export const canWrite = (role: Role) => role === 'owner' || role === 'innovation_manager' || role === 'contributor';
export const canManageAll = (role: Role) => role === 'owner' || role === 'innovation_manager';
export const canEdit = (role: Role, userId: string | undefined, createdBy: string | null) =>
  canManageAll(role) || (role === 'contributor' && !!userId && createdBy === userId);
