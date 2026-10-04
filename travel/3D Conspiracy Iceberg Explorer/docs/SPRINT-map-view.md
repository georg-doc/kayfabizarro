# Sprint-Skizze — „Great Awakening Map" als 2D-Navi-Layer
Ziel: alternativer View zum 3D-Iceberg. Gleiche UI-Schale (Narrator-Box, Detail-
Window, Suche/Filter, Cockpit, Touren, Export) — nur der Navigations-Layer wird
getauscht: statt Tauchen im Berg → Pan/Zoom über einer 2D-Verschwörungs-Map.

## ✅ ENTSCHEIDUNGEN (Georg, 2026-07-04) — nicht mehr offen
- **Option B: nativer Nachbau** („FrizzleBob's Great Awakening Chart"). Kein 1:1-Scan.
- **Umfang ~150–250 Nodes**, kuratiert; weitere Nodes & Deep Dives zusätzlich per
  LLM-Calls über dasselbe UI (Chat, rabbit holes, Import/Export) — wie im Iceberg.
- **Engine-Sync ist Pflicht:** EINE Engine für beide Views. Alle jetzigen und künftigen
  Engine-Features (LLM-Chat, Touren, FactCheck, rabbit holes, Bookmarks, Import/Export)
  müssen für Iceberg UND Map gelten und in-sync bleiben — nie view-spezifisch verdrahten.
- **Farbe:** Papier-Creme zuerst (KayfaBizarro-Default). Danach Themes: **rosa** (Hommage
  ans Original) neben **dark**. Theme-Layer von Anfang an so anlegen, dass Umschalten trivial ist.

## Ausgangsmaterial
- `uploads/The-Great-Awakening-Map.jpg` (975×1300, rosa Version)
- `uploads/The-Great-Awakening-Map-Parinya-nd.webp` (850×1114, s/w Version)
- Original: „The Great Awakening Map" von Champ Parinya (2018/2020). Höher
  aufgelöste Versionen existieren (Poster-Auflösung); User kann eine hi-res
  Datei besorgen und in `uploads/` legen — fürs Tracing reichen aber auch die
  vorhandenen, da wir NICHT die Bitmap zoomen wollen (s.u.).

## ⚖️ Grundsatzentscheidung (VOR Sprint 1 klären!)
**Option A — Scan als Hintergrund + klickbare Hotspots.**
Schnell (1 Sprint), aber: fremdes Artwork 1:1 ausgeliefert → Copyright-Risiko
beim Teilen/Publizieren; Bitmap wird beim Zoomen matschig; Suche/Filter können
Nodes nur markieren, nicht neu layouten.

**Option B — Nativer Nachbau als „FrizzleBob's Great Awakening Chart" (empfohlen).**
Wir übernehmen nur die IDEE und die (nicht schutzfähigen) Topics/Themen-Cluster,
bauen das Chart aber als eigenes HTML/SVG-Artefakt im KayfaBizarro-Look
(Papier, Ink, Stempel). Vorteile: randscharf bei jedem Zoom, durchsuchbar,
filterbar, FB kann Nodes kommentieren/stempeln wie im Iceberg, kein
Copyright-Problem (eigene Gestaltung + Satire-Kontext), Map-Nodes können
mit Iceberg-Entries verlinkt werden (gleiche IDs → ein Datensatz, zwei Views).
Der Original-Scan dient nur intern als Referenz fürs Kuratieren.

**OCR:** nicht zur Laufzeit. Einmalig als Kurations-Hilfe (offline/LLM-Vision
über den Scan) → Rohliste der ~500 Begriffe → manuell/LLM-gestützt eindampfen
auf ~150–250 kuratierte Nodes mit Quips/Status/Dice. Danach ist OCR raus.

## Datenmodell (Erweiterung, ein Datensatz für beide Views)
```js
// map-data.js
window.MAP_DATA = {
  regions: [ { id: "solar-flash", label: "Great Solar Flash", cx: 0.52, cy: 0.13, r: 0.10, color: "…" }, … ],
  nodes: [ { id: "great-solar-flash", name: "Great Solar Flash", x: 0.51, y: 0.12,
             region: "solar-flash", icebergId: "…|null", cat: "space", dice: 6,
             status: "debunked", quip: "…" }, … ],
  links: [ ["great-solar-flash", "ascension"], … ]   // gezeichnete Verbindungslinien
};
```
Koordinaten normalisiert (0–1) → unabhängig von Render-Größe.
`icebergId` verknüpft Map-Node ↔ Iceberg-Entry (Detail-Card, Bookmarks,
FactChecks, Touren funktionieren dann in beiden Views identisch).

## Sprints
### Sprint M1 — Kuration & Datensatz (größter Brocken)
- Themen-Cluster des Originals identifizieren (Secret Space Program, Solar Flash,
  Q, Inner Earth, Saturn, Ascension, …) → `regions`
- ~150–250 Nodes kuratieren (OCR/Vision-Rohliste → eindampfen), Quips schreiben,
  Status/Dice vergeben, `icebergId`-Mapping wo vorhanden
- Review-Runde mit User (Export als JSON zum Gegenlesen)

### Sprint M2 — Map-Renderer + View-Switch
- `map-scene.js`: Pan/Zoom-Canvas (CSS-Transform), Papier-BG + Regionen als
  Watercolor-Washes, Nodes als Ink-Labels (Baby Eliot), Links als Hand-Linien (SVG)
- Gleiche Input-Vokabel wie 3D: Drag = pan, Scroll = zoom, W A S D, Klick = Detail
- View-Toggle im Header (iceberg ⇄ map) mit Transitions-Animation
  (Vorschlag: „auftauchen" → Papier entrollt sich)
- Suche/Filter wirken auf Map-Nodes (dimmen/highlighten), Tier-Zahlen-Rail wird
  im Map-View zu Region-Sprungmarken

### Sprint M3 — FB-Integration & Session-Parität
- Touren über Map-Nodes (curated / lucky / custom via Chat), Autopilot schwenkt
  die Kamera über die Karte
- FactCheck / rabbit holes / Bookmarks auf Map-Nodes (rabbit holes platzieren
  neue Nodes in der passenden Region)
- Export/Import um `mapNodes`/`view` erweitern (Format-Version bump auf 2)

## Engine-Refactor-Notiz (vor/während M2)
Damit „eine Engine, zwei Views" real wird, die view-agnostischen Teile der DC-Logic
kapseln (Auswahl, Touren, Filter, Chat/LLM-Direktiven, FactCheck, rabbit holes,
Bookmarks, Import/Export, TTS). View-spezifisch bleibt nur: Szene-Rendering,
Node-Layout/Projektion, Picking, Kamera/Navigation. Der View-Switch tauscht die
Render-/Pick-Schicht, die Feature-Schicht bleibt geteilt. Theme als Token-Set
(Papier-Creme / rosa / dark) an EINER Stelle, beide Views lesen daraus.

## Erledigt
Alle drei ehemals offenen Fragen sind von Georg entschieden (siehe Block oben):
Option B · ~150–250 · Papier-Creme zuerst, dann rosa + dark.
