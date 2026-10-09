# Briefing WSA-Work · KFB Deck Library R1 (Deck Viewer v5 + Decks im Asset Librarian)

Stand: 2026-10-09 · von Claude Code (Lab-Steuerung) · Auftraggeber Georg · **ein Work-Job, eigener Branch, PR, kein Merge durch WSA**

## 0 · Worum es geht

Georg braucht schnellen, verlässlichen Zugriff auf die rund 130 KFB-Decks: um Decks und Karten zu finden und um sie Inseln bzw. Welten zuzuordnen (`kfb.island-config/1`, Feld `decks`). Der vorhandene **Deck Viewer v4** hat ein brauchbares Interface, ist aber nicht funktional (nicht alle Seiten eines Decks sichtbar, Karten fehlen).

Ziel ist **eine Deck-Datenschicht mit drei Verbrauchern**:
1. **Deck Viewer v5:** Nachbau von v4, funktional verdrahtet, als Site bzw. Standalone.
2. **Asset Librarian v10+:** neue Asset-Arten **Deck** und **Karte**, neben 3D-Modellen, Sounds, Audio und Texturen; gleiche Suche, Tags, Handoff.
3. **Worldbuilder (Lab), später:** Schnellsuche und Tag-Platzierung im Gott-Modus, Deck einer Insel zuordnen, Karte als Fund bzw. Loot im Terrain setzen. **Nicht Teil dieses Jobs**; der Job liefert nur das Datenformat, das das Lab später liest (§4).

## 1 · Quellen

| Was | Wo |
| --- | --- |
| Viewer v4 (Donor, Claude-Design-Export, Vanilla JS ohne Build) | GitHub `sync/lab-rkit-2026-10-09` → `tools/KFB-ToolBox/_inbox/KFB Deck Viewer v4 (donor)/`; Original Dropbox `CLAUDE/KFB Comic Card Deck Viewer v4 (WS0)/` |
| Einstieg im Donor | `KFB Deck Viewer v4 -standalone src-.dc.html`, Module `deckviewer/*.js` (v.a. `kfb-corpus.js`), `RETURN.md`, `CHANGELOG.md`, `HOUSEKEEPING.md`, `docs/BACKLOG.md` |
| Kanon-Index der Decks | `media/kfb/index.json` (`kfb-deck-registry/v2`, 130 Decks, `packId`, `cardCount`, `pages`, `coverOffset`, `pdf`, `data`, `cardMapping`, `keyMap`, `sets`) |
| Karten-Daten je Deck | `media/kfb/<data>.pdf.json` |
| PDFs | `media/kfb/<pdf>` (web-Fassungen; „ADD“ im Namen = unkomprimierte Druckfassung, **kein** eigenes Deck) |
| Asset-Registry Decks | `registry/assets/v1/decks/` (bisher nur 4 Shards: `embrace_protopia`, `forget_utopia`, `ignore_dystopia`, `sonic_slaughterhouse`) |
| Asset Librarian | `tools/asset_registry/librarian/` (Site `kfb-asset-librarian.frizzlebob.chatgpt.site`, v10 kanonisch) |
| Datenprüfung (Anhang) | `deliveries/DECK_DATA_QA_R1.md` im Lab bzw. auf dem Sync-Branch |

**Eine ID für alles:** `packId` aus `media/kfb/index.json` = `deckId` in `registry/assets/v1/decks/` = `deckId` in der Insel-Konfiguration. Kartenschlüssel bleibt `deckId + cardNumber`.

## 2 · Warum v4 nicht funktioniert (Befund Claude Code)

1. **Karten-JSONs in drei Formaten.** 117 Decks nutzen `cardNumber/cardName`. 12 Decks weichen ab (`num/name`, nur `name`, keine Karten), z. B. `frizzlebob_s_mission_control`, `ai_kayfabe`, `federal_kayfabe`. v4 liest nur `c.cardNumber`. Bei diesen Decks ergibt die Seitenberechnung `NaN`, und es erscheinen keine Karten.
2. **Seitenzahl kommt aus dem Index statt aus dem PDF.** Bei 6 Decks sagt der Index weniger Seiten, als die Karten brauchen (z. B. `programming_the_whole_child`: 60 Karten, Index 15 Seiten statt 16). Bei 8 Decks ist die Kartenzahl nicht durch 4 teilbar, dann fällt v4 auf die Index-Seiten zurück. Einige Decks haben deutlich mehr Index-Seiten als nötig.
3. Die Liste mit allen 22 auffälligen Decks steht in `DECK_DATA_QA_R1.md`.

## 3 · Auftrag

### 3a · Deck Viewer v5 (Nachbau, funktional)
- **Interface von v4 übernehmen:** sechs Ansichten inkl. Full View, Coverflow, Paper-Theme, Schere bzw. Card-Mode. Danach eine Optimierungsrunde: Suche, Filter, Mobil, klarere Kopfzeile. Georg will das Interface behalten, aber verbessert.
- **Seiten-Wahrheit = PDF:** Blättern zeigt immer **alle** `pdf.numPages` Seiten, unabhängig vom Karten-Mapping. Das Karten-Overlay bzw. der Zuschnitt kommt nur dazu, wenn das Mapping für das Deck geprüft ist. Sonst zeigt der Viewer einen Hinweis „Karten-Zuordnung ungeprüft“ statt falscher Zuschnitte.
- **Ein Lese-Adapter** normalisiert die Karten-JSONs (`num → cardNumber`, `name → cardName`, fehlende Nummern aus der Reihenfolge). Die Quell-JSONs werden in diesem Job **nicht** umgeschrieben (andere Verbraucher: Quill, Triplet-Pool, ChatterBox). Datenkorrekturen kommen als eigene Liste bzw. eigener PR zur Freigabe durch Georg.
- **Deep Links:** `?deck=<deckId>&card=<n>` und `?deck=<deckId>&page=<p>`.
- **Karte kopieren bzw. exportieren** als `kfb.card-ref/1`: `{ deckId, cardNumber, cardName, page, quadrant, pdf, data }`.
- Live von GitHub raw bzw. CDN wie bisher, keine eingebetteten PDF-Bytes.

### 3b · Asset-Registry: alle Decks als Shards
- Generator (data-only, im Stil des vorhandenen Registry-Bots): aus `media/kfb/index.json` plus Karten-JSON je Deck ein Shard in `registry/assets/v1/decks/` für **alle 130 Decks**. Die vier vorhandenen bleiben inhaltlich erhalten.
- Je Deck: `deckId`, Titel, `gameMode` (KFB/MED), `deckType`, `role`, `sets`, `bundleSuggestion`, `cardCount`, gemessene `pdfPages`, `coverOffset` (gemessen oder „ungeprüft“), Repräsentationen (PDF, JSON), Tags, `schemaStatus`, **`gameUse`**.
- **`gameUse`:** `allowed | review | blocked`, Standard `review`. Georg gibt frei. Grund: Decks mit realen Personen, Firmen oder Verschwörungsthemen dürfen nicht ungeprüft in die Spielwelt. Die Three-Futures-Decks und `frizzlebob_s_mission_control` sind von Georg bereits für Inseln gesetzt (`allowed`).
- Im MVP-Bestand fehlt der Shard für `frizzlebob_s_mission_control` (Town-Deck); er entsteht mit diesem Generator.

### 3c · Asset Librarian: Arten „Deck“ und „Karte“
- Neue Arten in `asset-types.js` bzw. Browse-Filter: **Deck** (Cover-Vorschau, Kartenzahl, Tags, `gameUse`) und **Karte** (Name, Power, Lore, Grade, Deck, Zuschnitt-Vorschau).
- Suche über Deck-Titel, Kartennamen, Lore und Tags. Filter nach `gameMode`, `deckType`, `set`, `gameUse`.
- Vorschau per pdf.js im Browser auf Abruf. **Keine 7.000 vorgerenderten Karten-Bilder ins Repo**: Cloudflare hat ein Limit von 20.000 Dateien, und der Sync-Branch hängt schon daran. Höchstens 130 Cover-Thumbnails, wenn nötig.
- **Handoff** wie bei den anderen Assets: „Deck zuordnen“ liefert `{ deckId, role }`, „Karte wählen“ liefert `kfb.card-ref/1`. Ziel ist das Lab (Insel-Konfiguration bzw. später Loot-Punkt).
- Aus dem Librarian ein Link „im Deck Viewer öffnen“ (Deep Link aus 3a), kein zweiter Viewer im Librarian.

## 4 · Vertrag für das Lab (wird später gelesen, hier nur liefern)

```json
{ "schema": "kfb.card-ref/1", "deckId": "embrace_protopia", "cardNumber": 7,
  "cardName": "…", "page": 3, "quadrant": 2,
  "pdf": "Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1) web H.pdf", "data": "Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json" }
```
Insel-Seite (`kfb.island-config/1`): `"decks": [{ "deckId": "frizzlebob_s_mission_control", "role": "primary" }]`. Karten im Spiel liegen nie als Kopie im Rucksack; Sammlung und Herkunft gehören später in den Spielstand (Masterplan §6b).

## 5 · Abnahme (vom Job selbst zu belegen)

1. **130 von 130 Decks** öffnen im Viewer; für jedes Deck gilt: angezeigte Seiten = `pdf.numPages`. Als Tabelle im Test-Report.
2. **Stichprobe Zuschnitt** (Screenshot je Deck, Karte 1 und letzte Karte): die drei Three-Futures-Decks, `frizzlebob_s_mission_control`, die 6 Decks mit zu wenigen Index-Seiten, mindestens 4 der 12 Schema-Abweichler.
3. Für jedes Deck eine Datenprüf-Tabelle: gemessene PDF-Seiten, Index-Seiten, Kartenzahl Index und JSON, Schema, gemessener Versatz, Status.
4. Deep Link und `kfb.card-ref/1`-Export funktionieren (Beispiel im Report).
5. Asset Librarian: Arten Deck und Karte sichtbar, Suche findet eine Karte über ein Lore-Wort, Handoff-JSON entspricht §4.
6. Mobil (375 px) und Desktop, ohne Konsolenfehler.
7. Keine Änderung an den Quell-JSONs bzw. PDFs in `media/kfb/`.

## 6 · Regeln

- Neuer Branch, PR an Georg, **kein Merge durch WSA**, `main` nicht direkt anfassen.
- **Branch von `main` abzweigen, nicht vom Sync-Branch.** Den Donor vom Sync-Branch nur lesen bzw. nach `tools/` kopieren. So hängt dieser Job nicht am Cloudflare-Gate des Sync-Branches (25.702 Dateien).
- Keine lizenzierten bzw. gekauften Assets und keine privaten Quellen ins öffentliche Repo.
- Decks bleiben öffentlich, wie sie in `media/kfb/` liegen; Marketing-Pipeline und Gumroad sind nicht Teil des Jobs.
- Erst die Cloudflare-Hürde des Sync-Branches lösen (`.assetsignore` für `tools/KFB-ToolBox/_inbox/**` oder Tarif klären), falls der Librarian-Deploy davon betroffen ist.
- Georg nie bitten, Git-Werkzeuge oder GitHub Desktop zu benutzen.

## 7 · Rückgabe

`RETURN.md` mit Branch, Commit, PR-Link, Test-Report (Tabellen aus §5), offenen Datenkorrekturen (Liste je Deck) und Site-URL(s). Kopie bzw. Hinweis in `KFB_HUB/00_INBOX/wsa-work/`.
