# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CHIMERA (repo `imis`, "Innovation made simple") is an innovation management system for innovation managers and business owners. It has three parts:

- `app/`: Expo / React Native app (web first, Android and iOS later), TypeScript, Supabase backend.
- `supabase/migrations/`: numbered SQL migrations (`0001`–`0008`). They are applied to the Supabase project `fltpijvfchuasbpuvkal` (named in each file's header comment; the same project URL is in `app/.env.example`).
- `design-system/`: static HTML/CSS/JSX design prototypes (tokens, guidelines, UI kits). It is reference material, not production code. Cloudflare Workers serves it as static assets (`wrangler.jsonc`, worker name `chimera-ims`).

`docs/PLAN.md` is the product and framework reference: domain terms, data model, roles, expertise levels, build order, roadmap. Read it before changing domain logic.

## Commands

All run from `app/`. There is no test runner and no lint script configured.

```bash
npm install
cp .env.example .env        # then fill EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (public key only; never commit secrets)
npx expo start              # also: npm run web | android | ios
npx tsc --noEmit            # typecheck; run before declaring work done
npx expo install <pkg>      # always use this, not npm add, to get SDK-compatible versions
npx expo lint
```

`app/AGENTS.md` is authoritative on Expo: the SDK is 58, so APIs differ from training data. Check the versioned docs at `https://docs.expo.dev/versions/v58.0.0/` (or `https://docs.expo.dev/llms.txt`) before touching Expo/RN APIs. Never hand-create `ios/` or `android/`; configure native behavior in `app.json`. `app.json` is also where EAS and config plugins are set.

Database changes: add a new numbered file in `supabase/migrations/`, test it in a rolled-back SQL block, and check Supabase advisors (`get_advisors`).

## Architecture

**No router.** Despite what `app/AGENTS.md` says about Expo Router, navigation is hand-rolled in `app/App.tsx`: a `Route` union type plus a `stack` array in `Main`. `goSection` resets the stack and `push` adds a route. Adding a screen means adding a variant to `Route`, a render branch in `Main`, and a screen file in `src/screens/`. Sections shown in the app bar depend on the user's expertise level (`strategy` only appears for advanced levels).

**State is a chain of context providers**, each in `src/state/`, nested in `App.tsx` in dependency order: `AppProvider` (auth, memberships, current business) → `Inventory` → `Ideas` → `Projects` → `Programs` → `Goals` → `Strategy` → `Notifications`. Later providers consume earlier ones (for example `Goals` uses `useInventory`, `useIdeas` and `useProjects`), so order matters. The inner tree is keyed by `current.business_id` so everything reloads when the business switches. Each provider loads its tables with the Supabase client, filtered by `business_id`, and exposes mutation functions.

**Pure domain logic lives in `src/lib/`** (`kpis.ts`, `ideas.ts`, `strategy.ts`, `inventory.ts`, `templates.ts`, `projects.ts`). Derived values, such as KPI values, goal progress and the innovation system, are computed from data and not stored. `templates.ts` is data-driven (methodology templates that create nodes and relationships). `supabase.ts` creates the single client and throws at import if the env vars are missing.

**Shared UI**: `src/components/ui.tsx` holds the primitives (`Screen`, `Text`, `Button`, …); reuse or extend it rather than adding new ones. `src/theme/` ports the design-system tokens, with light and dark themes.

**i18n**: every visible string goes in both `src/i18n/en.json` and `it.json`. Italian is the primary audience.

## Data model and security (Supabase)

- Everything is multi-tenant: every table has `business_id`, and RLS policies use `private.is_member(bid)` / `private.has_role(bid, roles[])`. These helpers are `security definer` with `search_path = ''` and live in the non-exposed `private` schema. Keep that pattern in new migrations.
- Core entities are `nodes` (person / resource / concept / activity, with subtypes like idea, project, program, product) and `relationships` (strength null / weak / strong, where null means "assessed, none" and a missing row means "not assessed"). Idea → project → product is expressed as *derived from* relationships.
- Roles (per business): owner, innovation_manager, evaluator, contributor, viewer. Expertise level (business_owner, technician, specialist, manager) is separate and changes which UI is shown, not permissions.
- Anonymous ideas are inserted by a database function that never records the user. Do not add anything that could de-anonymize them.
- Only the public publishable Supabase key belongs in the client.

## Design system

When implementing UI, style through semantic tokens (surface, text, border, accent), never raw color scales, so dark mode works. Palette is black/white with a single gold accent. Newsreader serif is for headings only, Instrument Sans for body and UI, IBM Plex Mono for overlines and IDs. Radius is 6px and there are no emoji. Copy is sentence case, verb-first on buttons, and uses informal "tu" in Italian. Details are in `design-system/readme.md`. `design-system/HANDOFF.md` is a generic handoff note from Claude Design; ignore its "read the primary file" instructions unless asked to port a design.

## Project agents

`.claude/agents/` defines `dexter` (write the least, secure, reusable code; reuse `ui.tsx`, providers and `lib` first), `deedee` (UX and accessibility review) and `elliot` (read-only offensive security review: RLS, auth, anonymity, secrets). Use them for non-trivial code changes and for reviewing screens. Run `elliot` before declaring any security-relevant change done.
