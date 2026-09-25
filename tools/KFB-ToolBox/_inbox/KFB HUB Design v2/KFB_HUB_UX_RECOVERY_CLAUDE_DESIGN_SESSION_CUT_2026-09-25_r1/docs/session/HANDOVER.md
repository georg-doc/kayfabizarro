# HANDOVER · KFB Hub UX Recovery · Claude Design Session Cut · 2026-09-25

Owner: HUB-CTRL #202 · tools/production_desk · Human: Georg
Status: **CANDIDATE · NO LIVE PROMOTION**
Brief: `tools/production_desk/HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md` @ `ef8dbb07`

## Deliverables in this project

| Datei | Zweck |
|---|---|
| `Hub Donor Proof v2.dc.html` | Exakter Donor `dfaafac0/kfb-hub/index.html`, unverändert, in echten Iframes: 1440, 880, 390 px, Paper + Dark |
| `hub-recovery/donor/kfb-hub-v2-dfaafac.html` | Byte-Kopie des Donors (blob `0de46343`) |
| **`KFB Hub UX Recovery v2.dc.html`** | **Der eine Kandidat für Georg-Review** (Lesbarkeits-Pass nach Georgs Feedback) |
| `KFB Hub UX Recovery v1.dc.html` | Erste Fassung, zu kleinteilig. Nur Referenz. |
| `hub-recovery/embedded-registry-2026-09-25.js` | Eingebauter Fallback: exakte Kopie `registry/production/v1/*` von `bot/production-desk-update` (sourceCommit `74c6fa5c`) |
| `hub-recovery/screenshots/` | Donor + Kandidat in drei Breiten |
| `hub-recovery/CHANGELOG.md`, `SOURCE.md`, `TEST_REPORT.md` | Session-Cut-Belege |

## Donor-Befund (vor dem Entwurf)

- Paper/Dark: `:root[data-theme=paper|dark]`, Papier #e8e2d5/#fffaf0, Tinte #1e1b17, Rot #a03b2b, Grün #356b58, 28-px-Raster, 3-px-Ecken, harter Versatzschatten.
- Heute-Fluss: `#today` als Start, zweispaltiges Aufgabenraster, eine Zeile Text.
- Pocket Inbox: offenes `details`, Notizfeld + Dropzone, IndexedDB `kfb-hub-pocket-inbox-v1/items`.
- Suche: Freitext, `/` fokussiert, `Esc` leert; Filter = Hash-Routen.
- Progressive Disclosure: Historie/Regeln nur über Filter.
- **Defekt im Donor:** `.hero-side>div:first-child{display:none!important}` versteckt `.bookmark` (das einzige Kind). Dark-Umschalter, Stage-, ToolBox- und GitHub-Link sind im akzeptierten Donor unsichtbar. Die „ToolBox-Prominenz“ existiert dort nur als Briefing-Karte.

## Feature-Parität zum Donor

| Donor v2 | Kandidat v2 |
|---|---|
| Paper/Dark, `kfb.hub.theme.v1` | übernommen, gleicher Key; Umschalter jetzt sichtbar (Icon) |
| Papier-Raster im Hintergrund | **entfernt** (Georg, 25.09.) |
| Wortmarke „KFB Hub“ 20 px | 24 px |
| KFB/DocCheck-Fokus | entfällt: Production-Desk-Daten haben keinen DocCheck-Strang |
| Heute als Start | übernommen: Braucht dich · Läuft · Kann starten · Wartet (zu) |
| Pocket Inbox sichtbar | übernommen, gleiche IndexedDB → vorhandene Einträge erscheinen auf derselben Origin |
| Suche `/` + `Esc` | übernommen, sucht über Arbeit, Briefings, Werkzeuge, Archiv, Regeln, Inbox, Entscheidungen |
| Filter-Hash-Routen | 5 Tabs: `#heute #briefings #projekte #entscheidungen #archiv` (Donor-Aliase `#today` usw. funktionieren) |
| Abhaken (`kfb.hub.todo.done.v1`) | ersetzt durch PASS/TUNE/HOLD/DONE/MISSING + Notiz |
| Briefing-Karten (hart kodiert) | v3-Katalog `self_service.json`, strangweise, zugeklappt |
| Stage/Live-Vorschaukacheln (thum.io) | entfällt im ersten Blick; Werkzeuge kommen aus `tools.json` |
| ToolBox-Link | fester Kopfzeilen-Button + WorldBuilder-Button |
| „GitHub ist SSOT“-Fuß | übernommen |

## Daten-Owner-Nahtstellen

1. **Registry lesen:** `raw.githubusercontent.com/georg-doc/kayfabizarro/{bot/production-desk-update → main}/registry/production/v1/{manifest,lanes,briefings,reviews,standards,wsa,tools,problems,self_service}.json`. Gleiche Quellen und Reihenfolge wie `desk.template.html`.
2. **Reload:** liest zuerst nur `manifest.json`; gleiche `contentHash` + `checkedAt` → „Keine Änderung“, sonst alle Dateien. Zustände: lädt / aktualisiert (n Änderungen) / keine Änderung / nicht erreichbar (letzter Stand bleibt).
3. **Fallback:** `window.KFB_HUB_EMBEDDED` (entspricht `<script id="embedded-registry">` im Template; `render_desk.py` müsste den Kandidaten später genauso befüllen).
4. **Buckets:** `lane.bucket` LOOK_AT/RUNNING/CAN_START/WAITING unverändert. `freshness: CLOSED` fällt raus.
5. **Statuschips:** aus Titel/Text abgeleitet (PROCEED PASS, CI PASS, abgelehnt → TUNE, Kandidat). **Nahtstelle offen:** besser wäre ein explizites Feld `lane.state` in `config.json`.
6. **Projekte:** Zuordnung Lane → Projekt ist im Kandidaten fest verdrahtet (`PROJECTS`). **Nahtstelle offen:** gehört als `lane.project` in `config.json`.
7. **Entscheidungen:** `localStorage kfb.hub.decisions.v1`, Schema `kfb.hub-decision/1` (itemId · decision · note · decidedAt · sourceRevision + itemTitle, item, sync). Export als Sync-Paket (Zwischenablage, mit `@GitHub`-Kopf) oder JSON-Datei. Kein Schreibzugriff, kein Backend.
8. **„Geändert“:** `localStorage kfb.hub.seen.v1` (Signatur je Lane). Ohne Eintrag: Heads der letzten 24 h.
9. **Pocket Inbox:** IndexedDB `kfb-hub-pocket-inbox-v1`, Store `items` (Donor-Schema).

## Offene Fragen an Georg

1. WorldBuilder-Button zeigt auf `world-builder-p1-review` (einziger WorldBuilder-Eintrag in `tools.json`). World Integration-01 (PR #190) hat keine Prüfseite. Welche Adresse soll der Button öffnen?
2. Sollen `lane.state` und `lane.project` als Felder in `config.json` kommen, damit der Hub nichts aus Titeln ableitet?
3. Entscheidungen: reicht das Sync-Paket als Übergabe in den HUB-CTRL-Chat, oder soll die spätere Bridge eine Datei im Repo erwarten (z. B. `registry/production/v1/decisions/…`)?
4. Stage/Live-Vorschaukacheln aus dem Donor: zurückholen (z. B. im Tab Projekte) oder weglassen?

## Resident-Overlay (v2.1, Design-Probe)
- Datei `hub-recovery/resident-overlay.v1.js`, geladen per dynamischem Import beim Einschalten. Kein Laden, solange aus.
- Owner-Nahtstelle: Actor-Montage gehört ToolBox/Animation Lab (`graft-mount.v1.js`, KayKit-Rigs). Das Overlay ist nur Consumer und liest gepinnte Quellen.
- Nächster Ausbau (nicht gebaut): Resident-Atlas-Szenen als Paket laden, mehrere Actors platzieren, Clip-Wahl statt Zufall.

## Nächstes Gate (genau eins)

**GEORG HUMAN REVIEW · HUB UX RECOVERY CANDIDATE** (`KFB Hub UX Recovery v2.dc.html`)
