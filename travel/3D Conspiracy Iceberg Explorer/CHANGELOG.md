# 3D Conspiracy Iceberg Explorer — additive changelog

History is additive. Earlier entries are not rewritten. A later entry that corrects or
replaces one marks it `SUPERSEDES` and keeps both.

## 2026-07-04 (reconstructed from docs/DOKU.md, docs/cuts/2026-07-04_iceberg-postmortem.md)

### IMPLEMENTATION
v1.x base build: Three.js iceberg scene (`iceberg-scene.js`), 159-entry dataset across
7 tiers / 10 categories / 4 status tags (`iceberg-data.js`), deterministic node picking
with viewport culling, Uncle FrizzleBob narrator UI.

### TESTED RESULT
"Masken-Saga" root-caused after two prior loops: `transform` (rotate/scale) on an
ancestor of an `overflow` scroll container breaks Chrome/Safari repaint on rotated
children. DOM measurement and html-to-image screenshots are blind to this class of bug;
`screenshot_user_view` + ancestor-scan caught it. Binding rule recorded in
`docs/ENGINE.md` / `docs/cuts/`: no transform above a scroller.

## 2026-07-05 (reconstructed from docs/cuts/2026-07-05_session-cut.md)

### IMPLEMENTATION
v1.3 delivered: Schema v2 foundation (`docs/SCHEMA-v2.md`, optional `summary`/`related`/
`image`/`map` fields, backward-compatible), Detail-Card v4, ghost/rabbit-hole recursion,
rich-text pipeline, dice-face absurdity glyphs, Atmo-Engine (`atmo-engine.js`, synth mode
+ optional 7-track mode under `assets/atmo/`, tracks not present → synth mode active),
per-window wobble scatter, reusable `templates/KayfabPaperDoc.template.html`.

### DEFERRED
Map-View (`docs/SPRINT-map-view.md`), theme.js + pack-format v2, 159-entry content
enrichment pass, wobble fine-scatter (`docs/TBD-irregular-outline.md`), 11Labs Atmo
track generation, public content-pack repo.

### UNRESOLVED
Atmo synth balance at tier 6–7 (too tame or too shrill), ghost density ratio, whether to
bundle Atmo MP3s into the standalone build (+~15MB) once generated.

## 2026-09-13

### DECISION
Full-codebase re-home export built at Georg's request, per the KFB chat production
router (`skills/chat/` in `georg-doc/kayfabizarro`) and its `session-export` /
`PRODUCTION_SOP.md` §9 additive-changelog rule. This project is not yet a
`CURRENT_PROJECT_SSOT` entry in `skills/chat/REGISTRY.json` — that registration is a
follow-up for whoever re-homes this, not done here.

### IMPLEMENTATION
Export manifest, agreed with Georg before zipping (session-export step 1 veto window):

- **Included as source-of-truth:** both `.dc.html` deliverables, `atmo-engine.js`,
  `iceberg-data.js`, `iceberg-scene.js`, `support.js`, `templates/`, `assets/`, `fonts/`,
  all of `docs/` incl. `docs/cuts/`, the two `The-Great-Awakening-Map.*` reference
  images, `uploads/Georg Session-Handover Prompt v1.2.md`.
- **Included as build reference (not source):** `Conspiracy Iceberg Explorer.standalone.html`
  (1.34MB, self-contained bundle) — Georg chose to keep it rather than rebuild fresh at
  the new home.
- **Included though generated:** `support.js` — Georg chose to keep the DC runtime as-is
  so the export runs offline unmodified. `docs/ENGINE.md` still marks it "NIE editieren."

### EXCLUDED (named, not deleted — originals remain in the source project)
- 28 QA screenshots under `uploads/Bildschirmfoto *.png` (~28MB total) — acceptance
  evidence, not code.
- `uploads/pasted-1783040534053-0.png` (13.5MB) — single file over the 2MB/file export
  budget.
- `uploads/assets/` (dice/kit/mascot/stamps duplicate tree + `logos/`, `marginalia/`,
  `divider.svg`) — verified via grep: nothing in `.dc.html`/`.js` references
  `uploads/assets/*`; the live tree is `assets/`. The three extras (`logos/`,
  `marginalia/`, `divider.svg`) are not wired into the running build either — flagged
  here as a `PROPOSAL` in case a future session wants to promote them into `assets/`,
  not silently dropped as dead weight.

### OWNER BOUNDARY
This export is an authoring/measurement artifact per `adapters/claude-design.md` — it is
not itself an implementation SSOT. It becomes one only once Georg re-homes it into an
actual repository and either registers it in `skills/chat/REGISTRY.json` or the router
explicitly promotes it.
