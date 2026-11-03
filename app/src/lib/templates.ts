// Methodology templates, expressed in the CHIMERA framework:
// ACTIVITIES (processes) performed by PEOPLE, using RESOURCES, to produce CONCEPTS (or other resources).
// All visible text lives in i18n: tplItem.<id> for items, tpl.<template>.* for the template and its activities.
import type { NodeType } from './inventory';

type ItemDef = { type: NodeType; subtype: string };

export const ITEMS: Record<string, ItemDef> = {
  // people
  top_management: { type: 'person', subtype: 'team' },
  innovation_manager: { type: 'person', subtype: 'employee' },
  innovation_team: { type: 'person', subtype: 'team' },
  employees: { type: 'person', subtype: 'team' },
  project_team: { type: 'person', subtype: 'team' },
  project_owners: { type: 'person', subtype: 'team' },
  gatekeepers: { type: 'person', subtype: 'team' },
  finance: { type: 'person', subtype: 'team' },
  marketing: { type: 'person', subtype: 'team' },
  customers: { type: 'person', subtype: 'customer' },
  design_team: { type: 'person', subtype: 'team' },
  founders: { type: 'person', subtype: 'team' },
  advisors: { type: 'person', subtype: 'expert' },
  // resources
  market_data: { type: 'resource', subtype: 'data' },
  innovation_budget: { type: 'resource', subtype: 'budget' },
  idea_platform: { type: 'resource', subtype: 'tool' },
  kpi_dashboard: { type: 'resource', subtype: 'tool' },
  workshop_space: { type: 'resource', subtype: 'space' },
  prototyping_tools: { type: 'resource', subtype: 'tool' },
  analytics_tool: { type: 'resource', subtype: 'tool' },
  // concepts
  context_analysis: { type: 'concept', subtype: 'knowledge' },
  innovation_vision: { type: 'concept', subtype: 'framework' },
  innovation_strategy: { type: 'concept', subtype: 'framework' },
  innovation_plan: { type: 'concept', subtype: 'framework' },
  opportunity_list: { type: 'concept', subtype: 'knowledge' },
  validated_concepts: { type: 'concept', subtype: 'knowledge' },
  new_solutions: { type: 'concept', subtype: 'knowledge' },
  performance_review: { type: 'concept', subtype: 'knowledge' },
  improvement_actions: { type: 'concept', subtype: 'knowledge' },
  raw_ideas: { type: 'concept', subtype: 'knowledge' },
  preliminary_assessment: { type: 'concept', subtype: 'knowledge' },
  business_case: { type: 'concept', subtype: 'knowledge' },
  working_solution: { type: 'concept', subtype: 'knowledge' },
  validation_results: { type: 'concept', subtype: 'knowledge' },
  launched_offer: { type: 'concept', subtype: 'knowledge' },
  gate_decisions: { type: 'concept', subtype: 'policy' },
  user_insights: { type: 'concept', subtype: 'knowledge' },
  problem_statement: { type: 'concept', subtype: 'knowledge' },
  idea_pool: { type: 'concept', subtype: 'knowledge' },
  prototype: { type: 'concept', subtype: 'knowledge' },
  user_feedback: { type: 'concept', subtype: 'knowledge' },
  assumptions_list: { type: 'concept', subtype: 'knowledge' },
  mvp: { type: 'concept', subtype: 'knowledge' },
  metrics: { type: 'concept', subtype: 'knowledge' },
  pivot_decision: { type: 'concept', subtype: 'policy' },
};

export type ActivityDef = { id: string; performers: string[]; uses: string[]; produces: string[] };
export type TemplateDef = { key: string; activities: ActivityDef[] };

export const TEMPLATES: TemplateDef[] = [
  {
    key: 'iso56002',
    activities: [
      { id: 'context', performers: ['top_management', 'innovation_manager'], uses: ['market_data'], produces: ['context_analysis'] },
      { id: 'strategy', performers: ['top_management', 'innovation_manager'], uses: [], produces: ['innovation_vision', 'innovation_strategy'] },
      { id: 'planning', performers: ['innovation_manager'], uses: ['innovation_budget'], produces: ['innovation_plan'] },
      { id: 'opportunities', performers: ['innovation_team', 'employees'], uses: ['idea_platform'], produces: ['opportunity_list'] },
      { id: 'concepts', performers: ['innovation_team'], uses: ['idea_platform'], produces: ['validated_concepts'] },
      { id: 'solutions', performers: ['innovation_team', 'project_owners'], uses: ['innovation_budget'], produces: ['new_solutions'] },
      { id: 'evaluation', performers: ['innovation_manager', 'top_management'], uses: ['kpi_dashboard'], produces: ['performance_review'] },
      { id: 'improvement', performers: ['innovation_manager'], uses: [], produces: ['improvement_actions'] },
    ],
  },
  {
    key: 'stage_gate',
    activities: [
      { id: 'discovery', performers: ['innovation_team'], uses: ['market_data'], produces: ['raw_ideas'] },
      { id: 'scoping', performers: ['innovation_team'], uses: [], produces: ['preliminary_assessment'] },
      { id: 'business_case', performers: ['innovation_team', 'finance'], uses: ['innovation_budget'], produces: ['business_case'] },
      { id: 'development', performers: ['project_team'], uses: ['innovation_budget'], produces: ['working_solution'] },
      { id: 'testing', performers: ['project_team', 'customers'], uses: [], produces: ['validation_results'] },
      { id: 'launch', performers: ['project_team', 'marketing'], uses: [], produces: ['launched_offer'] },
      { id: 'gate_reviews', performers: ['gatekeepers'], uses: ['kpi_dashboard'], produces: ['gate_decisions'] },
    ],
  },
  {
    key: 'design_thinking',
    activities: [
      { id: 'empathize', performers: ['design_team', 'customers'], uses: [], produces: ['user_insights'] },
      { id: 'define', performers: ['design_team'], uses: [], produces: ['problem_statement'] },
      { id: 'ideate', performers: ['design_team', 'customers'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'prototype', performers: ['design_team'], uses: ['prototyping_tools'], produces: ['prototype'] },
      { id: 'test', performers: ['design_team', 'customers'], uses: [], produces: ['user_feedback'] },
    ],
  },
  {
    key: 'lean_startup',
    activities: [
      { id: 'assumptions', performers: ['founders'], uses: [], produces: ['assumptions_list'] },
      { id: 'build', performers: ['founders'], uses: ['innovation_budget'], produces: ['mvp'] },
      { id: 'measure', performers: ['founders', 'customers'], uses: ['analytics_tool'], produces: ['metrics'] },
      { id: 'learn', performers: ['founders', 'advisors'], uses: [], produces: ['pivot_decision'] },
    ],
  },
];

type T = (key: string) => string;
const item = (t: T, id: string) => ({ title: t(`tplItem.${id}`), type: ITEMS[id].type, subtype: ITEMS[id].subtype });

/** Builds the JSON sent to the create_program database function, with all text translated. */
export function buildProgramPayload(t: T, templateKey: string | null, name: string, description: string | null) {
  const tpl = TEMPLATES.find((x) => x.key === templateKey);
  return {
    name,
    description,
    template: templateKey ?? '',
    activities: (tpl?.activities ?? []).map((a) => ({
      title: t(`tpl.${tpl!.key}.activities.${a.id}.title`),
      description: t(`tpl.${tpl!.key}.activities.${a.id}.description`),
      performers: a.performers.map((i) => item(t, i)),
      uses: a.uses.map((i) => item(t, i)),
      produces: a.produces.map((i) => item(t, i)),
    })),
  };
}
