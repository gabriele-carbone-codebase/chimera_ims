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
- **Linear regression model:** a dedicated section for the model behind the innovation outcome (outcome = Σ βᵢ·xᵢ). It shows the weight (β, the impact per unit invested) of every activity next to its current investment (x), how each weight was set (estimated by hand at first, calibrated from history later), how well the model explains past outcomes, and where it is only an approximation (no synergies, diminishing returns or time lags). It is the shared foundation for IOO, NBC and SNA.
- **Single Node Analysis (SNA):** a view to analyze the impact on the innovation outcome of each single activity, person, relationship, object or resource, with rankings by impact. For any entity it shows how much the predicted outcome would change if it were increased, decreased, added or removed, and links to the regression model and to NBC.
- **Next Best Change (NBC):** tells the user which single change would have the highest predicted impact on the outcomes, using a four-direction framework: which entity to **increase**, **decrease**, **add** or **remove**. It ranks candidate changes by predicted impact on the innovation outcome (building on the outcome model of IOO: investments, effectiveness values and, later, the inter-company predictions) and explains the reasoning, so the innovation manager can accept it as a draft strategy change or dismiss it.
- **Relations Network Navigator (RNN):** 2D and 3D visualization of all entities and relationships in an innovation field, with relationship strength.
- **Documents:** build standard and custom innovation management documents (for example the innovation strategy, the innovation policy, program plans, gate review reports). Standard documents are templates filled in automatically from the data already in CHIMERA (field, system, assumptions, goals, programs, outcomes); custom documents let the user define their own structure. Documents are versioned, exportable (PDF, Word) and available in English and Italian. Documents can also be produced **for a specific audience**: employees, the business owner, other innovation managers, suppliers, clients, partners, shareholders and so on. The same underlying data is presented with the content, level of detail and tone that suits each stakeholder (for example a short engagement brief for employees, a performance and investment summary for shareholders, a collaboration outline for partners and suppliers), and sensitive items such as anonymous ideas or internal scores are excluded from external audiences.
- **The innovation interview:** a guided interview that a user or an innovation manager can lead to set up the program and gather the information CHIMERA needs (the business, its people, resources, concepts and activities, goals, roles, assumptions and strategy). It can be run alone or by the innovation manager with other people in the business, answers can be given by typing, and later by voice or by uploading documents, and the interview turns the answers into entities, relationships, goals and assumptions that the user reviews before they are saved. It is the structured front door that the vocal and document-based configuration and rapid strategy setup build on.
- **Innovation checkup:** a recurring, scheduled section where CHIMERA guides the user through a short review, asking whether anything has changed in the assumptions, goals, entities (people, resources, concepts, activities), relationships and so on, and updating the data as they answer. It can include a small learning part where the user picks one of three suggested articles about innovation. The checkup is configured at the end of the initial setup (how often, and who takes part) and then repeats on schedule, with reminders through notifications. It complements the scheduled assumption reviews already built, covering the whole innovation field in one guided pass.
- **Academy:** lessons on innovation concepts and the advanced functions; completing them unlocks power-user features.
- **Vocal and document-based configuration:** set up entities, goals and roles through a guided interview where the user speaks or writes the information. Existing documents (strategies, reports, org charts, previous plans) can be uploaded to give the interview context, and CHIMERA proposes the entities, relationships, goals and roles for the user to confirm. Needs speech-to-text, document reading and an AI model; the user always reviews what is created.
- **MCP server:** CHIMERA exposes its data and actions through a Model Context Protocol server, so other chatbots and AI agents can read from it and send it instructions (for example "add this idea", "what goals are at risk?"), and CHIMERA can in turn call other agents. Access is per business, uses the same roles and permissions as human users, and every action is logged.
- **Inter-company AI:** predictions for a single organization that combine two sources: its own history (intra-organization) and data from other companies (inter-organization), using similarity criteria (size, sector, goals, resources, maturity) and the historical impact of similar choices. Other companies' data is only used in anonymized, aggregated form and only with consent; it never exposes another company's identity or records.
- **Rapid strategy setup:** a way to set up a strategy with no typing, using only multiple-choice questions and drag and drop (for example dragging activities into used and not used, ranking priorities, choosing assumptions from suggestions). Meant for small businesses and quick starts.
- **IHN (Innovation Help Network):** CHIMERA suggests similar businesses based on goals, weaknesses and resources (for example one company's weakness matches another's strength). If both sides want, they can contact each other to create open innovation strategies together. Participation is opt-in, shows only what each company chooses to share, and contact requires mutual agreement.
- **AI assistant:** helps decide the used / not used / undecided choice for each known artifact, so small organizations are not overwhelmed. Needs an API key, cost control and a privacy decision.
- Phone apps (Android and iOS), integrations, rewards, offline mode.

## 9. Open items

- Supabase project: to be created by the product owner; share the project URL and the public anon key only.
- Drift threshold that triggers a suggested strategy review (start with a simple count of invalid or changed assumptions; tune later).
- Initial list of artifact subtypes and the methodology template contents (drafted during build steps 2 and 5).
