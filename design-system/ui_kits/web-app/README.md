# IMIS web app — UI kit
Desktop dashboard (1440×900 design width). Left sidebar · top bar · content (max 1280) · AI assistant side panel (360).

Screens (click-through in `index.html`): Portfolio (home) · Pipeline (kanban, hover a card → advance stage) · Project detail (click a row in Portfolio) · Scouting trend (filter tags, bookmark) · Bandi e finanziamenti (select a call, "Prepara candidatura" → toast) · Report e KPI. Top bar: theme toggle (light/dark), AI panel toggle, "Nuova idea" dialog. Sidebar: IT/EN switch.

Files: `Shell.jsx` (Sidebar, TopBar, PageHead) · `AIPanel.jsx` · one file per screen · `data.js` (sample Italian data + IT/EN strings).
All primitives come from the DS bundle (`window.DS`). Designed from scratch — there was no existing product UI to copy.
