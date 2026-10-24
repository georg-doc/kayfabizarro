# RETURN · Resident Atlas × Quilt Workspace-Plan R1 · 2026-10-19

**Ergebnis:** SAVED / PLANNING ONLY. Georgs bereits geplanter Resident-Atlas-Umzug wurde als Bezugspunkt für die UI-Verbesserung genommen; die quellengestützte Quilt-Option liegt als durchführbare, bewusst nicht freigegebene Prüfrichtung in GitHub. **Keine Migration und kein Produkt-Test.**

**Owner:** bestehende **KFB ToolBox / Resident Atlas** Source- und Authoring-Lane.
**Repo:** `georg-doc/kayfabizarro`.
**Branch:** `planning/resident-atlas-quilt-ui-migration-r1-2026-10-19`.
**Base:** `main@c746a9567e0ea20a24b8969fe9130ac0756e7a7e`.
**Draft-PR:** nach Erstellung aktuelle Nummer/Link in GitHub nachsehen; kein Merge/Live.
**Head:** Die tatsächliche finale Branch-/PR-HEAD ist nach dem letzten Dokumentenwrite exakt aus GitHub abzulesen; frühere Checkpoint-SHAs sind nicht der finale Head.

## Inhalt des isolierten Handovers

- `PLAN_R1.md`: echter Atlas S17/S16/ToolBox-P07-Bestand, Zukunfts-Umzug, gepinnter Quilt MIT-Donor, Layout-Presets Focus/Edit/Review, optional Multiview/Popouts, Schutz der vorhandenen Editor- und 3D-Wahrheit, Migrations- und Testkriterien.
- `TEST_REPORT_R1.md`: quellengestützte Herkunft und Testgrenzen, 8/8 plan-interne Text-/Provenance-Checks.
- `CHANGELOG.md`: additive Historie.
- `RETURN.md`: dieses Handover.

## Wesentliche Entscheidungen / Nichtentscheidungen

1. **Resident-Atlas-Umzug ist vom Nutzer genannt, aber Ziel/Host noch nicht als aktuelle Site-/Code-Identität geklärt.** Keine neue Site oder Route erfinden.
2. Quilt ist als **Layout-/Workspace-Donor** vorgemerkt, nicht als übernommene UI, nicht als neues Designsystem und nicht als automatische Drei.js-/React-Migration.
3. Kein Verwerfen der in S17 bereits existierenden Split-Screen-Schale mit `Nur Ansicht`, KFB-Tokens, Studio-Panels und Kamerahandling. P07 3D-Inline-Editor/Snap/Grounding behalten die existierende Ownership.
4. Quilt Three benötigt laut gepinnter Paketdefinition `three@^0.186.0`; S17 importiert `0.184.0`; Version, Renderer, Controls, R3F, Canvas-Lifecycle und GPU-Kosten sind vor Umsetzung zu prüfen.
5. Die ToolBox bleibt **ein Frontdoor-Router** mit Spezialwerkzeugen; eine Atlas-Migration darf keine zweite ToolBox oder neue Parallel-Registry/Runtime erzeugen.

## Evidenz / offener Stand

- Direct GitHub sources reviewed (KFB protocol + ToolBox/Atlas owner, session-cut Return/Handover/Stage, split shell, Site policy; pinned Quilt README/compatibility/pkg/LICENSE).
- Original Planung-Commit `4468be3f1a7df95e3e88eb937d29cc6c3eef7ad7`, Branch+PLAN exakter Readback bestanden.
- Evidence commit `d153a5b5345c80bd7af943a1659ed16b049b7bca`, Branch+TEST_REPORT exakter Readback bestanden.
- Changelog commit `560b6aff97190f6cc96f92a8a2195759659d1a13`, Branch+CHANGELOG exakter Readback bestanden.
- **8/8 wirkliche Redaktions-/Quelltextprüfungen PASS;** Laufzeit-/Browser-/Playwright-/GPU-/3D-Visual-/CI-/Site-/Stage-Tests **0**.
- Keine Source-Objekt-Isolation, kein sichtbares Donor-Design im KFB-Kontext, keine laufende A/B-Vorschau oder human acceptance. Donor-Quelle gelesen bedeutet nicht visuell übernommen.
- Geschützt: `main`, Original Atlas S17/S16/Handover, ToolBox P07, Site/Hub, Editor/Camera/Renderer, Registry, andere Owner.

## Genau ein nächster Gate

**WS0 / ToolBox–Resident-Atlas Owner identifiziert und pinnt für die schon vorgesehene Atlas-Migration den aktuellen editierbaren Atlas-Stand und den bestehenden oder vorgesehenen echten Zielhost/Site-Projektbezug.** Erst danach gesonderte Freigabe für einen **kleinen reversiblen Layout-only A/B** mit derselben echten Atlas-Szene, vorhandenen Inspector und unveränderten KFB-Design-Donors.

**Georg muss jetzt nichts tun.** Kein Stage- oder Site-URL, da eine reine GitHub-Planung.
