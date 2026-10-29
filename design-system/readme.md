# CHIMERA Design System
**CHIMERA — Innovation made simple.** A platform that helps innovation managers, consultants and SME owners run a structured innovation process: collect ideas, move them through a stage-gate funnel, manage a project portfolio, scout technology trends, find matching funding calls (bandi) and report KPIs, assisted by an AI side panel.

## Sources
- GitHub: https://github.com/gabriele-carbone-codebase/chimera_ims (branch `main`). At the time of creation (2026-10-29) it contains only a README ("Innovation made simple"): no UI code, tokens, logo or fonts. **This system was designed from scratch** using the owner's brief: editorial & calm, warm neutrals, gold accent #7A5C1E, serif headings only, left-sidebar nav, light + dark, AI as side panel, 6px radius, balanced density, Italian + English, and a future mobile app. As the repo grows, explore it again and align this system to real code.

## Products
1. **Web app** (primary) — desktop dashboard. `ui_kits/web-app/`
2. **Mobile app** (planned) — companion concept. `ui_kits/mobile-app/`

## Content fundamentals
- **Languages:** Italian is primary (users are Italian SMEs and consultants); every string has an English counterpart. Write IT first, keep EN the same length when possible.
- **Voice:** a calm, competent colleague. Plain and concrete, never hype. No "rivoluziona", "game-changer", exclamation marks.
- **Person:** address the user with informal *tu* in IT ("Cerca progetti", "Descrivi il problema") and *you* in EN. The product speaks in first person only inside the AI assistant ("Ho trovato 2 bandi compatibili").
- **Casing:** sentence case everywhere — buttons, titles, nav ("Nuova idea", "Bandi e finanziamenti"). Overlines are uppercase mono via CSS, not typed in caps.
- **Buttons:** verb first, 1–3 words: "Salva idea", "Prepara candidatura", "Richiedi revisione".
- **Numbers:** Italian formatting in IT (€ 1.420.000, 15,9%, 12 nov). Abbreviate large sums with units ("€ 330 k", "€ 1,4 mln"). Days as "gg".
- **Domain vocabulary:** Idea → Screening → Validazione → Pilota → Scala; TRL; gate review / criteri di uscita; bando, contributo, a sportello, cofinanziamento; UNI/PdR ISO 56002.
- **AI copy:** always cite sources (Tag chips with project IDs or call names) and carry a short disclaimer ("Le risposte dell'IA possono contenere errori. Verifica sempre le fonti.").
- **Emoji:** never. Unicode: only typographic marks (·, —, →, ≥, ’).
- Examples: page sub "5 progetti attivi, 2 bandi compatibili in scadenza e una revisione di fase questa settimana." · empty-ish hint "Annota l'idea adesso, la completi dopo dal desktop."

## Visual foundations
- **Mood:** editorial and calm — like a well-made annual report. Black and white as the primary colours, with gold as the only accent. Low chroma; colour carries meaning (stage, status), not decoration.
- **Colour:** page `--paper-50` #FAFAFA, cards `--paper-0` #FFFFFF, sunken/sidebar `--paper-100`. Text in neutral inks (#0A0A0A → #A0A0A0). Primary buttons use `--action` (black in light, white in dark). Accent gold-500 #A07C1A is for active nav icon, focus, highlights and key data series. Semantic: sage (success), amber (warning), brick (danger), slate (info), each with a soft tint background. Funnel stages have their own 5-step muted ramp (`--stage-*`).
- **Dark theme:** `[data-theme="dark"]` remaps all semantic aliases (`--surface-*`, `--text-*`, `--border-*`, `--accent*`). Surfaces go near-black (#0A0A0A), `--action` turns white and the accent lightens to gold-300 #D4B454. Always style with semantic aliases, never raw scales, so both themes work.
- **Type:** Newsreader (serif, 500) for display/h1/h2/h3 and card titles only. Instrument Sans for all body, UI and KPI numbers (tabular-nums). IBM Plex Mono 11px uppercase +0.08em for overlines, IDs (P-024), codes and small numeric labels. Body 14/21 on desktop, 15 on mobile.
- **Spacing:** 2/4/8/12/16/20/24/32/40/56/72. Page padding 28×32; card padding 20 (16 dense); grid gaps 16; inline gaps 8–12.
- **Radii:** 6px default for controls, cards, menus; 4px badges/inner; 10px dialogs and mobile cards; pill for tags and avatars.
- **Cards:** paper-0 fill, 1px `--border-subtle` hairline, `--shadow-1`; interactive cards lift to `--shadow-2` on hover. Optional sunken footer. No coloured left borders, no gradients.
- **Borders:** hairlines do most of the structure (sidebar edge, topbar, table rows). Strong border only on unchecked controls.
- **Shadows:** three neutral, low-opacity levels (rgba of ink-900); `--shadow-3` only for overlays (dialog, toast).
- **Backgrounds:** flat colour. No imagery, patterns, textures or gradients in the app. Charts use flat fills.
- **Motion:** quiet. 120ms for hover colour, 200ms for switches/shadows, 320ms for progress fills; `cubic-bezier(.2,.7,.2,1)`. No bounces, no page transitions beyond instant swap.
- **Hover:** surfaces shift to `--surface-hover` (one step darker paper); primary button shifts one step (black to ink-700, white to #E0E0E0); icons go from secondary to primary ink.
- **Press:** 1px downward translate on buttons; no scale.
- **Focus:** gold border + 3px `--ring-focus` halo.
- **Transparency/blur:** only the dialog scrim (ink at 36%). No glassmorphism.
- **Layout:** fixed left sidebar 240, top bar 56, content max 1280, AI panel 360 docked right (toggle in top bar). Mobile: bottom tab bar, 44px targets.
- **Imagery:** none yet. If photography is introduced, keep it high-contrast, black-and-white or low-saturation.

## Iconography
- **Lucide** line icons (stroke 2, rounded joins) loaded from CDN `unpkg.com/lucide-static@0.454.0/icons/<name>.svg` and rendered via the `Icon` component as a CSS mask, so they take `currentColor`. This is a substitution chosen from scratch — the repo has no icons.
- Sizes: 14 inline meta · 16 default · 18 sidebar · 24 mobile tab bar.
- Key glyphs: layout-dashboard (Portfolio), kanban (Pipeline), folder-kanban (Progetti), radar (Scouting), landmark (Bandi), chart-line (Report), sparkles (**reserved for AI**), lightbulb (ideas), flag (gate review).
- No emoji, no icon fonts, no PNG icons. Don't hand-draw SVGs.

## Brand mark
No logo exists. The wordmark is "CHIMERA" set in Newsreader 500, −0.02em, in `--accent` (see `guidelines/brand-wordmark.html`). Do not invent a symbol.

## Fonts
Google Fonts (loaded in `tokens/fonts.css`): Newsreader, Instrument Sans, IBM Plex Mono. No brand font files were provided — replace when available.

## Components
`components/` (React, exported on the bundle namespace):
- core: Button, IconButton, Icon, Badge, Tag, Avatar, AvatarGroup
- forms: Input, Select, Checkbox, Radio, Switch
- layout: Card, Tabs, Dialog
- feedback: Toast, Tooltip, Progress
- data: StatCard

Intentional additions: everything above is a from-scratch standard set (no source inventory exists). Icon wraps Lucide; StatCard and Progress serve KPI-heavy dashboards; Avatar for project teams.

## Index
- `styles.css` — entry; imports `tokens/*.css` (fonts, colors, typography, spacing, effects, themes, base)
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/<group>/` — components + `.d.ts` + `.prompt.md` + one card per group
- `ui_kits/web-app/` — interactive dashboard (Portfolio, Pipeline, Project detail, Scouting, Bandi, Report, AI panel, New idea dialog)
- `ui_kits/mobile-app/` — mobile concept (Home, Nuova idea, Bandi, Assistente)
- `thumbnail.html`, `SKILL.md`, `github.md`
