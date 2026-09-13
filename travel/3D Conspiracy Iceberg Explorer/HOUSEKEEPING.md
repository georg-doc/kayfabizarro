# Housekeeping — 3D Conspiracy Iceberg Explorer (re-home export)

Status per artifact. `AKTIV` current · `FROZEN` stable, not actively changing ·
`SUPERSEDED` replaced by a named successor · `DEAD` unreferenced · `ASSET` binary/media.

| Artifact | Status | Note |
|---|---|---|
| `Conspiracy Iceberg Explorer.dc.html` | AKTIV | main DC, template + logic |
| `Schema v2 Reader.dc.html` | AKTIV | schema-v2 live reader/docs |
| `Conspiracy Iceberg Explorer.standalone.html` | FROZEN | build artifact, regenerate rather than hand-edit |
| `atmo-engine.js` | AKTIV | shared, imported by the DC — do not fork per-consumer |
| `iceberg-data.js` | AKTIV | shared dataset |
| `iceberg-scene.js` | AKTIV | shared Three.js scene module |
| `support.js` | FROZEN | generated DC runtime — never hand-edit |
| `templates/KayfabPaperDoc.template.html` | AKTIV | reusable, portable outside this project |
| `assets/**` | ASSET | referenced tree — verified via grep against the live build |
| `fonts/**` | ASSET | Baby Eliot, Fonteys PRO — referenced |
| `docs/**` | AKTIV | doc set + `docs/cuts/` session history |
| `uploads/The-Great-Awakening-Map.*` | ASSET | research reference images |
| `uploads/Georg Session-Handover Prompt v1.2.md` | AKTIV | handover doc |

## Named cleanup candidates (not executed — originals untouched in source project)

- `uploads/Bildschirmfoto *.png` (28 files) — DEAD weight for a codebase export; QA
  evidence, keep in the source project or move to an evidence folder, don't ship as code.
- `uploads/pasted-1783040534053-0.png` (13.5MB) — over budget; if needed, host externally
  and reference by URL instead of embedding.
- `uploads/assets/**` — DEAD duplicate of `assets/**`, confirmed unreferenced by grep. The
  extras (`logos/`, `marginalia/`, `divider.svg`) are also currently unreferenced; either
  promote into `assets/` deliberately or drop.

## Clean-run checklist for the new home

- [ ] Verify `.dc.html` opens and renders standalone against the copied `assets/`/`fonts/`.
- [ ] Decide `uploads/assets/` extras (promote or drop) before the next content pass.
- [ ] If Atmo MP3s (`assets/atmo/tier-1..7.mp3`) get generated, re-check standalone weight
      budget (~+15MB) before bundling.
- [ ] Register in `skills/chat/REGISTRY.json` if this becomes a tracked KFB project node.
