# KFB ToolBox v1 · Start here

> **CURRENT OVERRIDE · 2026-09-18:** Lies zuerst [`_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`](_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md). Der vollständige Stage-First-v1-Export ist eingetroffen und als Intake geprüft. Die ältere A/B-/Birthday-Routinglogik unten bleibt Herkunft/History, nicht aktueller Ausführungsauftrag. **Birthday 2026 = FAIL / OUTDATED / ARCHIVED HISTORY.**

Status: DECISION / EXECUTION BRIEF · 2026-09-14
Koordination: Georg. ToolBox-Arbeitsbereich: `georg-doc/kayfabizarro/tools/KFB-ToolBox/`.

## Auftrag in einem Satz

Die vorhandenen drei Werkzeuge als benutzbare ToolBox veröffentlichen, mit lesbarer UI, erhaltenen Funktionen, verlustfreiem Config-Austausch und ehrlicher Kennzeichnung von WIP und offenen Prüfungen.

## Kurzer Leseweg

1. Aktuellen GitHub-HEAD, relevante PRs und lokale Änderungen prüfen.
2. Zentralen Router `skills/chat/START_HERE.md` → `REGISTRY.json` → relevante SOP-/Sync-Deltas lesen, nicht sämtliche History.
3. Hier [MASTERPLAN.md](MASTERPLAN.md), [TOOLBOX_MANIFEST.json](TOOLBOX_MANIFEST.json) und [SOURCE_AUDIT](docs/SOURCE_AUDIT.md) lesen.
4. [Aktuellen Arbeitsauftrag](_handover/TOOLBOX_V1_2026-09-14/START_HERE.md), dann SPEC, CONTRACTS und DELIVERABLES.
5. Fonts vor UI-Arbeit; MODULES nur zur gezielten Quellensuche. Export-Onboardings sind Quellen, keine pauschalen neuen Arbeitsaufträge.

## Wichtigster Befund

Das Paket enthält drei Standalone-HTMLs, fünf Dokumente und sechs Config-JSONs. Es enthält keinen separat editierbaren Modulbaum. Dokumentierte Module können eingebettet sein; ihre Existenz als lose Quelldatei hier ist NICHT bewiesen. Für nachhaltige Änderungen zuerst den Original-Modulbaum samt Build-/Exportweg erhalten oder reproduzierbar aus dem Bundle wiedergewinnen. Nicht aus den Beschreibungen neu implementieren.

## Status nicht vermischen

Studio v17 und Rigging v1 sind vom Autor als aktive Werkzeuge geliefert; Lab v2 ist WIP. Eine aktuelle ToolBox-Site, Cross-Tool-Roundtrip, Lab-Graft-Default und finales FrizzleBob-Profil sind hier noch nicht abgenommen. Der zentrale Registry-Status wird erst nach expliziter, belegter Promotion angepasst.

## CURRENT NEXT · Stage-First v1

Aktueller Produktkern: `Actor · Face · Pose · Motion · Voice · Stage` mit dominanter Stage und einer persistenten Navigationsebene. Nächster zusammenhängender Schritt ist **Source-Promotion → GitHub-Asset-Pins → Browser-Candidate → Actor→Face→Pose→Motion→Voice→Stage→Save/Reload/Import Gate**. Kein Redesign und keine Birthday-Reaktivierung.

## Sofort weiter, nicht neu planen

Ein zusammenhängender T1-Slice: Quellen sichern → drei Werkzeuge erreichbar machen → Schrift-/Config-/Graft-Nähte schließen → Browserprüfung → Georg-Abnahme. Routinefehler innerhalb dieses Auftrags selbst beheben. Nur bei Owner-/Vertragswechsel, fehlenden entscheidenden Quellen oder wesentlicher Umfangsänderung gezielt stoppen.

## Abbruchfest arbeiten

Nach jedem sinnvollen Arbeitsschritt den aktuellen Return und CHANGELOG sichern. Vor Sessionende nennen: Branch/Commit, aktiver Einstieg, letzter Test, offene Fehler, nächste Handlung. Ein neuer Chat beginnt hier und am aktuellen Return, nicht beim Gesprächsprotokoll.

## Nachtrag 15.09.2026 · A/B-Wiedereinstieg aus dem Authoring-Workspace

[WS0-Korrekturen und konkreter Startweg](../../skills/chat/masterplan/TOOLBOX_UX_TOWN_BIRTHDAY_2026-09-15.md), Abschnitt 1, qualifizieren den historischen Paketbefund oben. Der bisherige Design-Workspace meldet unter anderem einen gebauten Recherchi und Animation Lab v3; das ist noch kein vollständig übergebener und hier abgenommener ToolBox-Stand. Erst A sichern und unabhängig starten, danach B als einen gemeinsamen UI-Piloten auf denselben Modulen bauen. Der frische Design-Chat arbeitet dafür vorzugsweise im vorhandenen Quellenprojekt; die ToolBox bleibt Empfänger für Integration und Veröffentlichung. Keine Parallelreparatur oder Rückkehr zu widerlegten CSS3D-/Messbank-Annahmen. Die Town-Geburtstags- und Kinoideen aus dem Addendum erweitern diesen Auftrag nicht.


## CURRENT ADDITIVE ALIGNMENT · 2D Animation Studio

For cross-render eye/face work also read:

`docs/2D_ANIMATION_STUDIO_BRIDGE.md`

and

`_handover/2D_ANIMATION_STUDIO_ALIGNMENT_2026-09-18/START_HERE.md`

This alignment is additive to Stage-First. It does not replace the current Stage-First intake/promotion override, does not redesign ToolBox, and does not promote the older Animation Lab node.


## CURRENT ADDITIVE · KayKit Motion Lab v1 · 2026-09-20

ToolBox now has a public-verified Motion authoring candidate for three real KayKit/KFB actors:

- FrizzleBob · Driver Graft · Rig_Medium;
- GothGirl · Rig_Medium;
- Black Knight · Rig_Large.

Handoff:
`_handover/KAYKIT_MOTION_LAB_2026-09-20/START_HERE.md`

Draft PR: **#127**

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/`

Evidence: **87/87 public browser PASS**.

This is additive to Stage-First and does not promote Animation Lab to a separate CURRENT_TOOL. ToolBox owns motion/profile authoring; consumers retain movement, physics and gameplay state. Medium and Large remain separate rig-profile families.

Current gate: Georg reviews the three actors' Idle → Walk → Run / phase-sync result and the Medium-vs-Large motion feel. Attachments remain proposals until their own visible gate.


## CURRENT ADDITIVE · Tileable Macro Seam Lab · 2026-09-22

The visible wall seam has a public-verified seam-only candidate.

Handoff:
`_handover/TILEABLE_MACRO_SEAM_2026-09-22/RETURN.md`

Draft PR: **#173**

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/tileable-macro-seam-lab/`

Evidence:
- local browser **17/17 PASS**;
- public Cloudflare browser **17/17 PASS**;
- 0 failed resources;
- 0 page/console errors;
- Hub and ToolBox public link proof PASS.

Proven cause: the old RGB brush image was not tileable; `RepeatWrapping` repeated mismatched edge pixels. The new generator authors the texture periodically/toroidally. Measured edge discontinuity drops from average **14.242 → 1.375**.

Current gate: Georg compares `Old repeat` versus `Tileable macro` in the wall seam close-up. This does not unfreeze the separate Hybrid v2 Black Knight compile-census issue and does not promote OSM/Race consumers.


## CURRENT ADDITIVE · Hybrid Surface v2 / KFB 3D style · 2026-09-22

The public real-asset Hybrid Surface predecessor remains a ToolBox material-compatibility proof; Georg's review is now persisted as the next bounded gate.

Handoff:
`_handover/HYBRID_SURFACE_V2_2026-09-22/START_HERE.md`

Cross-project visual standard:
`../../skills/chat/masterplan/KFB_3D_STYLE_SURFACE_SCALE_2026-09-22.md`

Next changes are narrowly: stronger clay/grain materiality, seam reduction, preserve source roughness/specular character instead of globally matting every material, and head-size-based mixed-rig scaling. After that visual gate, the same standard proceeds to a real OSM/Race environment slice; ToolBox does not take World/OSM/Race ownership.


## CURRENT ADDITIVE · ToolBox Home v2 · 2026-09-21

ToolBox has one prominent Stage router at:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/`

The router adopts the Georg-accepted KFB Hub Paper/Dark v2 presentation. It does not become an asset/runtime owner. Preview policy is strict: exact public route = preview; missing/blocked route = source/status card only.

Current router refresh: 7 public preview routes, 5 missing/blocked routes, 7 source/integration gates. The new router revision still requires its own public verification. See `kfb-hub/stage/toolbox/ROUTE_AUDIT.json`.

## CURRENT ADDITIVE · Fluid / Card / Voxel intake + Theatre Curtain routing · 2026-09-21

The verified 23-file intake under `_inbox/KFB ToolBox Bench v1 - KFB Voxel Card Zone Lab 2 - Hex Assets Worldbuilding/kfb-toolbox-v1/` is now routed through a source-first consolidation brief. It is not a promoted tool set. Fluid/Beam/Seeds have supplied Bench evidence; CardStack and Voxel remain gated by real owner/runtime proofs.

Theatre Curtain v1 is now listed as an existing public ToolBox donor for transitions. Its planned Core v2 wrapper does not move renderer, camera, gameplay, loading, audio or persistence ownership from receiving games.

Briefs:
- `../../skills/chat/workflows/KFB_TOOLBOX_FLUID_CARD_VOXEL_CONSOLIDATION_V1_2026-09-21/START_HERE.md`
- `../../skills/chat/workflows/KFB_THEATRE_CURTAIN_CORE_V2_2026-09-21/START_HERE.md`
- `../../skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/START_HERE.md`
