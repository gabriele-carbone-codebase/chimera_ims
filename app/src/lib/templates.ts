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
  partnership_agreements: { type: 'concept', subtype: 'policy' },
  strategy_canvas: { type: 'concept', subtype: 'framework' },
  value_proposition: { type: 'concept', subtype: 'framework' },
  jobs_map: { type: 'concept', subtype: 'knowledge' },
  core_improvements: { type: 'concept', subtype: 'knowledge' },
  emerging_bets: { type: 'concept', subtype: 'knowledge' },
  future_options: { type: 'concept', subtype: 'knowledge' },
  innovation_portfolio: { type: 'concept', subtype: 'framework' },
  business_model: { type: 'concept', subtype: 'framework' },
  value_map: { type: 'concept', subtype: 'framework' },
  contradictions: { type: 'concept', subtype: 'knowledge' },
  scenarios: { type: 'concept', subtype: 'knowledge' },
  function_analysis: { type: 'concept', subtype: 'knowledge' },
  process_design: { type: 'concept', subtype: 'framework' },
  challenge_brief: { type: 'concept', subtype: 'knowledge' },
  crowd_contributions: { type: 'concept', subtype: 'knowledge' },
  crowd: { type: 'person', subtype: 'team' },
};

export type ActivityDef = { id: string; performers: string[]; uses: string[]; produces: string[] };

// Who a methodology suits. Required on every template so the guided picker can rank it.
export type Size = 'micro' | 'small' | 'large';
export type Need = 'structure' | 'ideas' | 'customer' | 'validate';
export type Maturity = 'new' | 'some';
export const SIZES: Size[] = ['micro', 'small', 'large'];
export const NEEDS: Need[] = ['structure', 'ideas', 'customer', 'validate'];
export const MATURITIES: Maturity[] = ['new', 'some'];
export type Fit = { size: Size[]; need: Need[]; maturity: Maturity[] };
export type TemplateDef = { key: string; fit: Fit; activities: ActivityDef[] };

export const TEMPLATES: TemplateDef[] = [
  {
    key: 'iso56002',
    fit: { size: ['small', 'large'], need: ['structure'], maturity: ['some'] },
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
    fit: { size: ['small', 'large'], need: ['ideas'], maturity: ['some'] },
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
    fit: { size: ['micro', 'small', 'large'], need: ['customer'], maturity: ['new', 'some'] },
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
    fit: { size: ['micro', 'small'], need: ['validate'], maturity: ['new'] },
    activities: [
      { id: 'assumptions', performers: ['founders'], uses: [], produces: ['assumptions_list'] },
      { id: 'build', performers: ['founders'], uses: ['innovation_budget'], produces: ['mvp'] },
      { id: 'measure', performers: ['founders', 'customers'], uses: ['analytics_tool'], produces: ['metrics'] },
      { id: 'learn', performers: ['founders', 'advisors'], uses: [], produces: ['pivot_decision'] },
    ],
  },
  {
    key: 'double_diamond',
    fit: { size: ['micro', 'small', 'large'], need: ['customer'], maturity: ['new', 'some'] },
    activities: [
      { id: 'discover', performers: ['design_team', 'customers'], uses: ['market_data'], produces: ['user_insights'] },
      { id: 'define', performers: ['design_team'], uses: [], produces: ['problem_statement'] },
      { id: 'develop', performers: ['design_team', 'customers'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'deliver', performers: ['design_team', 'project_team'], uses: ['prototyping_tools'], produces: ['working_solution'] },
    ],
  },
  {
    key: 'design_sprint',
    fit: { size: ['micro', 'small'], need: ['validate', 'customer'], maturity: ['new', 'some'] },
    activities: [
      { id: 'understand', performers: ['design_team', 'advisors'], uses: ['market_data'], produces: ['problem_statement'] },
      { id: 'sketch', performers: ['design_team'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'decide', performers: ['design_team', 'top_management'], uses: [], produces: ['gate_decisions'] },
      { id: 'prototype', performers: ['design_team'], uses: ['prototyping_tools'], produces: ['prototype'] },
      { id: 'test', performers: ['design_team', 'customers'], uses: [], produces: ['user_feedback'] },
    ],
  },
  {
    key: 'open_innovation',
    fit: { size: ['small', 'large'], need: ['ideas', 'structure'], maturity: ['some'] },
    activities: [
      { id: 'scouting', performers: ['innovation_team'], uses: ['market_data'], produces: ['opportunity_list'] },
      { id: 'partnering', performers: ['innovation_manager', 'advisors'], uses: [], produces: ['partnership_agreements'] },
      { id: 'cocreate', performers: ['innovation_team', 'advisors'], uses: ['workshop_space'], produces: ['new_solutions'] },
      { id: 'integrate', performers: ['project_team'], uses: ['innovation_budget'], produces: ['launched_offer'] },
    ],
  },
  {
    key: 'blue_ocean',
    fit: { size: ['small', 'large'], need: ['customer', 'structure'], maturity: ['some'] },
    activities: [
      { id: 'canvas', performers: ['innovation_team'], uses: ['market_data'], produces: ['strategy_canvas'] },
      { id: 'four_actions', performers: ['innovation_team', 'top_management'], uses: ['workshop_space'], produces: ['value_proposition'] },
      { id: 'validate', performers: ['innovation_team', 'customers'], uses: [], produces: ['validation_results'] },
      { id: 'rollout', performers: ['project_team', 'marketing'], uses: ['innovation_budget'], produces: ['launched_offer'] },
    ],
  },
  {
    key: 'jobs_to_be_done',
    fit: { size: ['micro', 'small', 'large'], need: ['customer'], maturity: ['some'] },
    activities: [
      { id: 'interview', performers: ['design_team', 'customers'], uses: [], produces: ['user_insights'] },
      { id: 'map_jobs', performers: ['design_team'], uses: [], produces: ['jobs_map'] },
      { id: 'find_gaps', performers: ['innovation_team'], uses: ['analytics_tool'], produces: ['opportunity_list'] },
      { id: 'design_offer', performers: ['design_team', 'project_team'], uses: ['prototyping_tools'], produces: ['prototype'] },
      { id: 'check', performers: ['design_team', 'customers'], uses: [], produces: ['user_feedback'] },
    ],
  },
  {
    key: 'three_horizons',
    fit: { size: ['small', 'large'], need: ['structure'], maturity: ['some'] },
    activities: [
      { id: 'horizon1', performers: ['innovation_manager', 'employees'], uses: ['kpi_dashboard'], produces: ['core_improvements'] },
      { id: 'horizon2', performers: ['innovation_team'], uses: ['innovation_budget'], produces: ['emerging_bets'] },
      { id: 'horizon3', performers: ['innovation_team', 'advisors'], uses: ['market_data'], produces: ['future_options'] },
      { id: 'balance', performers: ['top_management', 'innovation_manager'], uses: ['innovation_budget'], produces: ['innovation_portfolio'] },
    ],
  },
  {
    key: 'business_model_generation',
    fit: { size: ['micro', 'small', 'large'], need: ['validate'], maturity: ['new', 'some'] },
    activities: [
      { id: 'mobilize', performers: ['innovation_team'], uses: ['workshop_space'], produces: ['problem_statement'] },
      { id: 'understand', performers: ['innovation_team', 'customers'], uses: ['market_data'], produces: ['user_insights'] },
      { id: 'design', performers: ['innovation_team'], uses: ['workshop_space'], produces: ['business_model'] },
      { id: 'implement', performers: ['project_team'], uses: ['innovation_budget'], produces: ['launched_offer'] },
      { id: 'manage', performers: ['innovation_manager'], uses: ['kpi_dashboard'], produces: ['metrics'] },
    ],
  },
  {
    key: 'value_proposition_design',
    fit: { size: ['micro', 'small', 'large'], need: ['customer'], maturity: ['new', 'some'] },
    activities: [
      { id: 'customer_profile', performers: ['design_team', 'customers'], uses: [], produces: ['user_insights'] },
      { id: 'value_map', performers: ['design_team'], uses: ['workshop_space'], produces: ['value_map'] },
      { id: 'fit', performers: ['design_team', 'innovation_team'], uses: [], produces: ['assumptions_list'] },
      { id: 'test', performers: ['design_team', 'customers'], uses: [], produces: ['validation_results'] },
    ],
  },
  {
    key: 'customer_development',
    fit: { size: ['micro', 'small'], need: ['validate'], maturity: ['new'] },
    activities: [
      { id: 'discovery', performers: ['founders', 'customers'], uses: [], produces: ['assumptions_list'] },
      { id: 'validation', performers: ['founders', 'customers'], uses: ['prototyping_tools'], produces: ['validation_results'] },
      { id: 'creation', performers: ['founders', 'marketing'], uses: ['innovation_budget'], produces: ['metrics'] },
      { id: 'company_building', performers: ['founders'], uses: [], produces: ['pivot_decision'] },
    ],
  },
  {
    key: 'triz',
    fit: { size: ['small', 'large'], need: ['ideas'], maturity: ['some'] },
    activities: [
      { id: 'define', performers: ['innovation_team'], uses: [], produces: ['problem_statement'] },
      { id: 'contradiction', performers: ['innovation_team'], uses: [], produces: ['contradictions'] },
      { id: 'principles', performers: ['innovation_team', 'advisors'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'evaluate', performers: ['innovation_team'], uses: [], produces: ['validated_concepts'] },
    ],
  },
  {
    key: 'systematic_inventive_thinking',
    fit: { size: ['micro', 'small'], need: ['ideas'], maturity: ['new', 'some'] },
    activities: [
      { id: 'closed_world', performers: ['innovation_team'], uses: [], produces: ['problem_statement'] },
      { id: 'tools', performers: ['innovation_team'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'evaluate', performers: ['innovation_team', 'customers'], uses: [], produces: ['validated_concepts'] },
    ],
  },
  {
    key: 'creative_problem_solving',
    fit: { size: ['micro', 'small', 'large'], need: ['ideas'], maturity: ['new', 'some'] },
    activities: [
      { id: 'clarify', performers: ['innovation_team'], uses: [], produces: ['problem_statement'] },
      { id: 'ideate', performers: ['innovation_team', 'employees'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'develop', performers: ['innovation_team'], uses: [], produces: ['validated_concepts'] },
      { id: 'implement', performers: ['project_owners'], uses: ['innovation_budget'], produces: ['innovation_plan'] },
    ],
  },
  {
    key: 'scenario_planning',
    fit: { size: ['small', 'large'], need: ['structure'], maturity: ['some'] },
    activities: [
      { id: 'scope', performers: ['top_management', 'innovation_manager'], uses: [], produces: ['problem_statement'] },
      { id: 'drivers', performers: ['innovation_team', 'advisors'], uses: ['market_data'], produces: ['context_analysis'] },
      { id: 'build', performers: ['innovation_team'], uses: ['workshop_space'], produces: ['scenarios'] },
      { id: 'implications', performers: ['top_management', 'innovation_manager'], uses: [], produces: ['innovation_strategy'] },
      { id: 'monitor', performers: ['innovation_manager'], uses: ['kpi_dashboard'], produces: ['improvement_actions'] },
    ],
  },
  {
    key: 'value_engineering',
    fit: { size: ['small', 'large'], need: ['structure'], maturity: ['some'] },
    activities: [
      { id: 'information', performers: ['project_team', 'finance'], uses: ['market_data'], produces: ['context_analysis'] },
      { id: 'function', performers: ['project_team'], uses: [], produces: ['function_analysis'] },
      { id: 'creativity', performers: ['project_team', 'employees'], uses: ['workshop_space'], produces: ['idea_pool'] },
      { id: 'evaluation', performers: ['project_team', 'finance'], uses: [], produces: ['validated_concepts'] },
      { id: 'proposal', performers: ['project_owners'], uses: ['innovation_budget'], produces: ['improvement_actions'] },
    ],
  },
  {
    key: 'design_for_six_sigma',
    fit: { size: ['large'], need: ['structure'], maturity: ['some'] },
    activities: [
      { id: 'define', performers: ['project_team', 'innovation_manager'], uses: [], produces: ['problem_statement'] },
      { id: 'measure', performers: ['project_team', 'customers'], uses: ['analytics_tool'], produces: ['metrics'] },
      { id: 'analyze', performers: ['project_team'], uses: ['analytics_tool'], produces: ['idea_pool'] },
      { id: 'design', performers: ['project_team'], uses: ['prototyping_tools'], produces: ['process_design'] },
      { id: 'verify', performers: ['project_team', 'customers'], uses: [], produces: ['validation_results'] },
    ],
  },
  {
    key: 'crowdsourcing',
    fit: { size: ['small', 'large'], need: ['ideas'], maturity: ['some'] },
    activities: [
      { id: 'challenge', performers: ['innovation_team'], uses: [], produces: ['challenge_brief'] },
      { id: 'launch', performers: ['innovation_team', 'marketing'], uses: ['idea_platform'], produces: ['crowd_contributions'] },
      { id: 'select', performers: ['innovation_team', 'gatekeepers'], uses: [], produces: ['validated_concepts'] },
      { id: 'reward', performers: ['innovation_manager', 'project_owners'], uses: ['innovation_budget'], produces: ['new_solutions'] },
    ],
  },
  {
    key: 'human_centered_design',
    fit: { size: ['micro', 'small', 'large'], need: ['customer'], maturity: ['new'] },
    activities: [
      { id: 'hear', performers: ['design_team', 'customers'], uses: [], produces: ['user_insights'] },
      { id: 'create', performers: ['design_team', 'customers'], uses: ['workshop_space', 'prototyping_tools'], produces: ['prototype'] },
      { id: 'deliver', performers: ['design_team', 'project_team'], uses: ['innovation_budget'], produces: ['launched_offer'] },
    ],
  },
];

export type Answers = { size: Size; need: Need; maturity: Maturity };

/** Ranks methodologies for the answers and returns the best keys: one for micro businesses, up to two otherwise. */
export function recommend(a: Answers): string[] {
  const scored = TEMPLATES
    .map((tpl) => ({ key: tpl.key, score: (tpl.fit.need.includes(a.need) ? 3 : 0) + (tpl.fit.size.includes(a.size) ? 2 : 0) + (tpl.fit.maturity.includes(a.maturity) ? 1 : 0) }))
    .filter((x) => x.score >= 3) // the need must match
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, a.size === 'micro' ? 1 : 2).map((x) => x.key);
}

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
