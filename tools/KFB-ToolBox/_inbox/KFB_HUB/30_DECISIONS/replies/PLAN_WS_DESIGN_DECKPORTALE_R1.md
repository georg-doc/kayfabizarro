# PLAN · WS-Design · Deck- bzw. Zine-Portale · R1 · 04.11. · an WS0

Gebaut wird erst nach Testlauf 5. Es entsteht kein neues Portal-System: Grundlage ist `src/world/tuerPortal.js`. Dort gibt es schon die Öffnung als Daten, den Waber-Shader, den Durchgang ohne Schnitt und den Sprenkel-Übergang (V-1341). Neu sind nur der Look und die Daten je Deck.

## Daten

**Vom Verteiler (je Tür-Eintrag `e.ziel`):** `{ deck, zielZone, fehlt }`
- `zielZone` ist `{ key, x, z, biom }`.
- `fehlt` ist die Zahl der fehlenden Karten dieses Decks. `0` heißt: das Deck ist vollständig.

**Neu von mir:** die Tabelle `deckPortal.r1.json`, je Deck eine Zeile:
```
{ deck, cover: <Kartennummer oder Bildpfad>, rahmen: <Farbe aus Deck-Palette>, siegel?: <Bildpfad> }
```
- **Cover (nachgesehen 04.11.):** Die Deck-Registry hat kein eigenes Cover-Bild oder Cover-Feld mit Pfad.
  - Das Cover ist Seite 1 des Deck-PDFs. Die Registry markiert es mit `coverScore` bzw. `coverQA` (kayfabizarro `media/kfb/<Deck>.pdf.json`, Stand MEDIA_COMMIT 52adc8f1). Genauso entscheidet der Viewer (`src/vendor/kfb-viewer`, `_resolveLayout`).
  - 119 von 130 Decks haben so ein Cover. Für sie gilt in `deckPortal.r1.json`: `cover: { pdf_seite: 1 }`.
  - Die übrigen 11 Decks bekommen als Rückfall `cover: { karte: 1 }`.
  - Beides ist je Deck eine Zeile, lässt sich also ohne Code ändern. Die Tabelle wird beim Bau aus der Registry erzeugt.
- **Rahmenfarbe:** die Akzentfarbe des Decks. Bisher wird sie fest gesetzt (`farbe` / `#8a5cff`).

## Look

**Rahmen bzw. Schild:**
- Das Deck-Cover sitzt als Schild über der Öffnung.
- Es wird eine flache Karte mit Tuschekante aus dem einen Kartenmodul (q442). Das ist kein Billboard und kein kfbInsert.
- Der Rahmen liegt als Farbsaum um die Öffnungsform, im selben Insert-Pfad wie heute.

**Öffnung:** Darin wabert wie bisher das Ziel.
- Ist die Zielzone schon geladen, zeigt sie ihren HyperNorm-Boden (`deckGround`, Schlüssel Deck|Zone).
- Sonst zeigt sie ein Kartenbild einer fehlenden Karte des Decks. Bisher wählt das ein Hash auf eine beliebige Karte.

**Vollständiges Deck (`fehlt = 0`):**
- Das Schild bekommt einen goldenen Rand plus Siegel, der Funkenkern wird golden.
- Das Ziel ist eine beliebige Zone dieses Decks. Die wählt der Verteiler, ich zeige nur den Zustand.

## Schnittstelle und Schalter

- `zielVon()` in `tuerPortal.js` liest `{ deck, zielZone, fehlt }` statt `{ deck, key, farbe }`. Die alte Form bleibt als Rückfall gültig.
- `deckportale=1`, nur zusammen mit `tueren=1`. Ohne den Schalter bleibt die Tür wie heute.
- **Interaktion:** Ein Portal hat keine Taste, man geht oder fährt hindurch. Bekommt es später einen Hinweis, zeigt der „I“ (`ACTION_KEYS.interact`).

## Beleg (im Slot)

Ein Blatt mit drei Folien, jede aus der Spielkamera von vorn:
1. eine Tür mit offenem Deck,
2. dieselbe Tür beim Durchgehen,
3. eine Tür mit vollständigem Deck.

## Offen

- Nichts mehr: Die Cover-Frage ist geklärt (siehe Daten).
