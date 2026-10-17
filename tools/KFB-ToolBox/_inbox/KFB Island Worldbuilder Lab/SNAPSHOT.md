# KFB Island Worldbuilder Lab · Snapshot 2026-10-09

Stand des lokalen Labs (Vite + three.js r186) aus `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`, synchronisiert von der Claude-Code-Steuer-Sitzung.

- **Start der Doku:** `docs/PROJECT_STATE.md` (Projektstand, neueste Einträge oben) und `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`.
- **Regeln:** `docs/QA_RULEBOOK_*`, `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`, `docs/SCALE_CONTRACT_K2.md`, `docs/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`.
- **Code:** `src/` (Lab, u. a. `src/palettes.ts` mit `ENV_ROLES`, `src/clay/kfb-blend.ts`, `src/clay/kfb-speckle.ts`), Werkzeuge in `tools/`.
- **Bewusst nicht enthalten:**
  - `public/assets/` (Kit-Assets liegen schon auf `main`; gekaufte Unity-Assets wie StreakByte sind nur lokal erlaubt);
  - `donors/` (Claude-Design-Kits);
  - Stil-Referenzbilder Dritter;
  - Renders der gekauften Demo-Szenen;
  - `node_modules`, ZIPs.
- **Lokal starten:** `pnpm install`, dann `pnpm dev` (Port 5192). Ohne `public/assets/` laden Inseln, Figuren und Natur nicht.
