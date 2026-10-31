# CHIMERA — Framework and build plan

Working reference for everything built in this repo. Decisions below were agreed with the product owner; open items are listed at the end.

## 1. Purpose

CHIMERA helps innovation managers and entrepreneurs do two things:

1. **Create, maintain and improve an innovation management system.** Programs, goals and KPIs (KIPIs), plus the strategy layer in section 2.
2. **Harness, develop and build ideas into products and services.** Propose ideas (optionally anonymous), approve them, build them into projects, ship them as products or services.

Constraints:

- Components must be cross-platform (web now, Android and iOS later). React Native with Expo.
- A user belongs to many businesses; a business has many users.
- Fully bilingual (English and Italian), chosen in settings. Every string lives in translation files from day one.
- Complexity adapts to the user's expertise (section 5).

## 2. Framework

| Term | Definition |
|---|---|
| **Artifact** | Any entity in an innovation field that can bring or inspire innovation: people, activities, resources, concepts, incentives, objects, frameworks. Shown to most users as "element"; the word "artifact" is for power users. |
| **Innovation field** | All artifacts in a context. The context is the **business** (cultural aspects live at this level). One field per business. Each known artifact is either *known* or *monitored* (known and has an owner and a review date). The *real* field cannot be listed; the app shows a coverage estimate for the gap. |
| **Innovation system** | The artifacts **used** in the context. An artifact is used when it is linked to an activity with investment above zero. Calculated from the data, never stored. |
| **Innovation strategy** | A versioned document that describes the field and the system and records, for every known artifact, a decision: used, not used or undecided, with its assumption. |
| **Assumption** | A reason for using or not using artifacts. Fields: statement, artifacts concerned, status (valid, unverified, invalid), evidence, trigger (what change would invalidate it), review schedule. |
| **Innovation outcome** | Σ βᵢ·xᵢ over activities. xᵢ is the investment in activity i, in a unit set per activity (hours, money, etc.). βᵢ is the impact per unit invested. This is a simple linear approximation: it ignores synergies, diminishing returns, time lags and fixed costs. |
| **Innovation transition** | A voluntary change that moves one strategy version to the next to reach desired outcomes. |
| **Innovation review** | Scheduled, recurring review of the **assumptions**. A review of the **strategy** is suggested by the app only when assumptions have drifted too far from when the strategy version was written. The innovation manager decides whether to create or revise a strategy. A review can end in "accepted risk" when an invalid assumption is knowingly kept. |
| **Innovation cycle** | The sequence a manager follows: study the field, study the AS IS strategy, system and outcome, plan the TO BE, carry out the transition, then compare predicted and actual outcome. |

Terminology decisions: the "innovation management system" is not a separate object. IMS stays in the product name; the thing the user manages is the **program**. A **goal** is a target on an outcome measure (the TO BE).

## 3. Data model

Every table carries `business_id`; database access rules restrict rows to members of that business.

Entity types (the four categories plus relationships):

- `nodes`: person, resource, concept, activity. Subtypes: idea, project, program, product, budget, incentive, framework, etc. These are the artifacts.
- `relationships`: a first-class entity between two nodes. Fields: type (performs, uses, produces, owns, part of, derived from, targets…), **strength: null, weak or strong**. "Null" is an explicit "assessed, no relationship"; a missing row means "not assessed yet". Relationship strength is stored now and can feed synergy terms in the outcome model later.

Other tables:

| Table | Content |
|---|---|
| `businesses`, `memberships` | Business; user, role and expertise level per business |
| `strategies`, `strategy_decisions` | Strategy versions; used / not used / undecided per artifact with assumption link |
| `assumptions`, `assumption_reviews` | Assumptions, their status history and scheduled reviews |
| `investments` | Per activity and strategy version: amount and unit |
| `effectiveness` | βᵢ per activity (set by hand first, calibrated later) |
| `transitions`, `cycles` | Version-to-version moves; cycle steps and results |
| `goals`, `goal_targets`, `kpis`, `kpi_snapshots` | Goals tied to nodes or node types; KPIs computed from the data, with history |
| `criteria`, `idea_criteria`, `evaluations` | Criteria library; criteria and weights chosen per idea by the innovation manager; evaluator scores |
| `gate_definitions`, `gate_reviews` | Exit criteria per stage transition; gate decisions |
| `templates` | Methodology templates (ISO 56002, Stage-Gate, Design Thinking, Lean Startup, blank) that create nodes and relationships when applied |
| `notifications` | In-app items; push later |
| `academy_progress` | Lessons completed and features unlocked per user |

Idea to product: an idea (concept) becomes a project (activity, *derived from* the idea) and then a product or service (resource, *derived from* the project).

Anonymous ideas are inserted by a database function that never records the signed-in user. There is no follow-up code. The author is genuinely unknown.

## 4. Roles

Permissions, per business: **owner, innovation manager, evaluator, contributor, viewer.** Roles are separate from expertise level.

## 5. Expertise levels

Asked at first sign-in, changeable in settings, stored per business membership:

| Level | Experience |
|---|---|
| Business owner | Guided and simple. Plain words. No field, strategy or assumption screens. Templates, criteria and strategy decisions are filled in automatically. |
| Innovation technician | Execution: ideas, projects, gates, tasks. Works within what is already set up. |
| Innovation specialist | Customizes programs, criteria and templates. |
| Innovation manager | Everything: field, assumptions, strategy versions, transitions, outcome model. Framework terms (including "artifact") are shown. |

Principle: simplicity over customization for owners; customization over simplicity for managers. Power features are unlocked through the Academy.

## 6. Screens (version 1)

1. Sign-in, expertise question, business switcher
2. Home: what needs attention (votes due, gates due, assumptions to review, goals at risk)
3. Inventory: tabs for people, resources, concepts, activities, relationships
4. Ideas: short submit form with anonymous toggle, list, detail, evaluation queue with per-idea weighted criteria
5. Projects: pipeline with gate reviews, move to product or service
6. Programs: pick a template or start blank
7. Goals and KPIs
8. Field, Assumptions and Strategy versions (shown by expertise level)
9. Notifications and settings: language, members and roles, criteria library, notification preferences

## 7. Build order

1. Foundation: Expo project (web first), tokens ported from `design-system/`, translations (EN/IT), Supabase schema and access rules, sign-in, businesses, roles, expertise level.
2. Inventory and the node and relationship engine.
3. Ideas: submit, anonymous option, criteria, evaluation, approval.
4. Projects and gates; products and services.
5. Programs and methodology templates.
6. Goals and KPIs.
7. Field, assumptions (formulate, validate, monitor), strategy versions, reviews.
8. Notifications.
9. Release: web build on Cloudflare (`chimera-ims`).

## 8. Roadmap after version 1

- **Innovation Outcome Optimization (IOO):** simulations and predictions with different investments per activity, so managers can compare outcomes. Version 1 stores investments, units and βᵢ so IOO can be built on top.
- **Relations Network Navigator (RNN):** 2D and 3D visualization of all entities and relationships in an innovation field, with relationship strength.
- **Academy:** lessons on innovation concepts and the advanced functions; completing them unlocks power-user features.
- **AI assistant:** helps decide the used / not used / undecided choice for each known artifact, so small organizations are not overwhelmed. Needs an API key, cost control and a privacy decision.
- Phone apps (Android and iOS), integrations, rewards, offline mode.

## 9. Open items

- Supabase project: to be created by the product owner; share the project URL and the public anon key only.
- Drift threshold that triggers a suggested strategy review (start with a simple count of invalid or changed assumptions; tune later).
- Initial list of artifact subtypes and the methodology template contents (drafted during build steps 2 and 5).
