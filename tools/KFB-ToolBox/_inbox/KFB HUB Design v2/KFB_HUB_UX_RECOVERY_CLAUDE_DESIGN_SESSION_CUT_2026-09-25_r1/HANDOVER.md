# HANDOVER · KFB Hub UX Recovery · Session Cut 2026-09-25 r1

## A · User intent
Georg will den Hub wieder als schnelles tägliches Produktions-Cockpit: in Sekunden sehen, was ihn braucht, was läuft, was starten kann, was sich geändert hat. Akzeptierte Hub-UI-v2-Sprache (Paper/Dark, Heute, Pocket Inbox) zurück, aktuelle Production-Desk-Daten behalten. Entscheidungen PASS/TUNE/HOLD/DONE/MISSING sichtbar erfassen, ehrlich lokal. Gut lesbar, keine schwarzen Blockbuttons, kein Karo-Raster, Standardaktionen als Icons, Ecken leicht gerundet. Dazu als Prototyp ein zuschaltbarer KFB-Actor über dem Hub.

## B · Current result
- Kandidat v2: Kopfzeile (Tabs Heute/Briefings/Projekte/Entscheidungen/Archiv, ToolBox + WorldBuilder, Resident-Schalter + Actor-Dropdown, Paper/Dark), Frische-Leiste mit exaktem Stand, Quelle und Reload-Feedback, Suche, Pocket Inbox, Heute (Braucht dich / Läuft / Kann starten / Wartet zugeklappt), Briefings strangweise zugeklappt aus dem v3-Katalog, Projekte, Entscheidungen mit Sync-Paket, Archiv getrennt.
- Resident-Overlay v1.1: FrizzleBob · Driver Graft (Standard), GothGirl, Black Knight. Klick = zufälliger Clip → zurück in Idle. Ziehen = verschieben. Echter Schlagschatten.

## C · What changed this session
Siehe `CHANGELOG.md` (append-only, oben neueste): Donor-Beleg, v1, v2 Lesbarkeit, v2.1 Ecken + Overlay, v2 eingecheckt + Overlay v1.1.

## D · Source / owners / donors
| Quelle | Rolle | Pin | Status |
|---|---|---|---|
| `kfb-hub/index.html` | Visueller/UX-Donor | dfaafac070747f9543b5eb5a635e2aaa74e57b83 | USED (Grammatik, Inbox-IndexedDB-Schema, Theme-Key) |
| `tools/production_desk/desk/desk.template.html` | Daten-/Reload-Logik | ef8dbb07 | USED (Quellen, Reihenfolge, Copy-Brief) |
| `tools/production_desk/config.json` | Lane-Wahrheit | ef8dbb07 | USED über Registry |
| `registry/production/v1/*` | Laufzeitdaten | bot/production-desk-update (beweglich) → main | USED live; Fallback-Kopie sourceCommit 74c6fa5c |
| v3-Katalog (`self_service.json`) | Briefings | über Registry | USED |
| `kaykit-motion-lab-v1/lab.mjs` | Actor-Rezepte | cloudflare-live; Assets PIN bdaea0648f27c0f16e0a737bfba237eb54dd4cbb | USED (Rezept 1:1) |
| `frizzlegraft-v1/graft-mount.v1.js` + `contracts/kfb-pet-graft-driver.v4.json` | FrizzleBob-Montage | bdaea064 via jsDelivr | USED |
| KayKit Rig_Medium/Rig_Large General + MovementBasic | Clips | bdaea064 via raw | USED |
| v3 Desk-Shell | abgelehnte Oberfläche | ef8dbb07 | NOT_USED (nur Daten) |
| Resident Atlas Szenen | Szenenpakete | — | NOT_USED · DEFERRED |

## E · Protected boundaries
Nicht neu bauen oder übernehmen: Production-Desk-Builder/Registry/Status-Wahrheit, v3-Katalog, Projekt-Owner, KFB-Stage-Publikation, Actor/Face/Eye/Mouth (graft reader), Motion Library, Animations-Owner. Das Overlay ist reiner Consumer. Entscheidungen sind lokal und werden erst über HUB-CTRL ingestiert.

## F · Current controls / workflow
- Tabs = Hash-Routen `#heute #briefings #projekte #entscheidungen #archiv` (Donor-Aliase `#today` usw.).
- `/` fokussiert Suche, `Esc` leert.
- Neu laden: lädt / aktualisiert (n Änderungen) / keine Änderung / nicht erreichbar. Polling 75 s.
- „n geändert“ filtert Heute; „Als gesehen markieren“ setzt die Referenz.
- Entscheidung: Häkchen-Icon an der Zeile oder Buttons an „Braucht dich“ → Notiz → Speichern (Enter). Sync-Paket kopieren / JSON exportieren.
- Pocket Inbox: Text/Link speichern, Datei ablegen, Handoff-Markdown.
- Resident: Personen-Icon an/aus, Dropdown Actor, Klick auf Figur, Ziehen.

## G · Working / tested
Siehe `TEST_REPORT.md`. Beobachtet in der Claude-Design-Vorschau: Live-Registry-Laden, Reload-Zustände (aktualisiert, keine Änderung), Layout 1440/880/390, Paper/Dark, FrizzleBob-Laden, Clip-Wechsel per Prüfgriff, echter Schatten, oberste Ebene.

## H · Open / tune / blocked
- `OPEN` WorldBuilder-Button-Ziel (zeigt auf `world-builder-p1-review`; World Integration-01 hat keine Prüfseite).
- `OPEN` `lane.state` und `lane.project` als Felder in `config.json` statt Ableitung aus Titeln bzw. fester Zuordnung im Kandidaten.
- `OPEN` Ingest-Weg für `kfb.hub-decision/1` (Chat-Paket vs. Repo-Datei).
- `OPEN` Stage/Live-Vorschaukacheln aus dem Donor zurückholen oder weglassen.
- `DEFERRED` Resident-Atlas-Szenen als Paket, mehrere Actors, Clip-Auswahl statt Zufall.
- `TUNE` Schatten-Deckkraft/Lichtwinkel nach Georgs Blick.
- `NOT_RUN` GothGirl/Black Knight im Overlay, echtes Maus-Ziehen, Datei-Drop.

## I · Rejected / superseded directions
- v3 Desk-Shell (TUNE/abgelehnt): Statuswand, Pocket Inbox fehlte, Reload ohne Feedback.
- Kandidat v1: zu kleinteilig, 12–13 px, schwarze gefüllte Buttons, Karo-Raster.
- Overlay v1.0: 220×300-Canvas schnitt Clips ab, Kreis-Schatten.
- Donor-Defekt (nicht übernehmen): `.hero-side>div:first-child{display:none!important}` versteckt die Kopfzeilen-Links.

## J · Next gate
**GEORG HUMAN REVIEW · HUB UX RECOVERY CANDIDATE v2**
