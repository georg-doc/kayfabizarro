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


## CURRENT ADDITIVE · KayKit Ranged Calibration v1 · 2026-09-20

ToolBox now has the CA2-02 public weapon-calibration candidate for FrizzleBob Driver Graft and GothGirl.

- exact separate gun donor: `Character_Gun.gltf`;
- motion donor: real `Rig_Medium_CombatRanged.glb` with 20 clips enumerated;
- both current actors resolve the same measured `handslotr` grip/muzzle profile within measurement precision;
- single-shot primary release: `0.150 s`; later `0.883 s` rotation peak is not a second projectile;
- fixed Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`;
- public evidence: **55/55 PASS**.

This is measurement/handoff only. Combat target selection, projectile/damage state, Player movement/root/ground, rewards/runflow and audio remain with the Combat Arena owner.
