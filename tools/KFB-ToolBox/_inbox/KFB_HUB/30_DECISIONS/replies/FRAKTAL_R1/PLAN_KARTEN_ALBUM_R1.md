# Plan · Karten-Album und Verteilung · R1 · 04.11.2026 (WS-Verteiler)

Stand: nur Plan. Gebaut wird nach dem Go von WS0, nur die Teile ohne Browser.

## Was schon da ist
- `cardCollection.js` (Schalter `sammel=1`) wählt für einen Platz fest unter den Karten seines Decks, die noch frei sind. Das ist eine harte Regel. Ist das Deck voll, kommt das nächste Deck der Familie dran, danach Fluff. Ein Platz behält seine Karte.
- Die Schwelle für „gesammelt“ steht in `kfb-card-collect.r1.json` als `thr` je Sammelart (relief 0,3). Ich übernehme sie, ohne einen neuen Wert einzuführen.
- `slopAlbum.js` ist das Muster: neu = 1/(1+k·n), Streuung, Plätze gemerkt, eigener Speicherschlüssel.

## Datenformat `kfb.card-album/1`
Schlüssel `kfb.card-album`, Speicher wie save.js (backend), geschrieben gebündelt.
```json
{ "schema": "kfb.card-album/1",
  "karten": { "deck#num": { "erst": 0, "n": 1, "art": "relief", "zone": "zoneKey" } },
  "plaetze": { "siteKey": "deck#num" },
  "portale": { "doorKey": "zoneKey" } }
```
- `sammle(id, { art, zone, anteil })` zählt nur, wenn `anteil ≥ thr(art)`.
- Abfragen für die Kartenkante:
  - `deck(deckId)` → { gesammelt, fehlend[], von }
  - `zone(zoneKey)` → { gesammelt, fehlend[] }
  - `liste()`, also alles, was gesammelt wurde, nach der Zeit des ersten Sammelns sortiert

## Verteilung bevorzugt Fehlendes (Schalter `album=1`)
- Das Deck einer Zone bleibt, wie `cardFor` es wählt. Boden und Look hängen am Deck.
- Die Karte im Deck zieht die Saat gewichtet: Wert = 1/(1+k·n) · (1 − streu + streu · Zufall). Neue Karten zählen voll, gesammelte kommen selten wieder, verboten sind sie nie. k und streu wie beim Slop-Album, als Daten.
- Keine Dopplung: Eine Zone zieht ohne Zurücklegen. Bei „streu“ mit mehreren Karten unter einem Zonenschlüssel kommt keine Karte zweimal vor, solange das Deck genug Karten hat. Offene Nachbarplätze bekommen die Karte eines anderen offenen Platzes nur nachrangig. Das ist die heutige Regel `taken`, jetzt als Abzug statt als Sperre.
- Ein Platz behält seine Karte, so wie heute.

## Portalziele mit Deck-Vorliebe
- `portalZiel` bekommt `e.deck`. Ein Portal in einer Zone oder an deren Rand erbt das Deck dieser Zone; wer `e.deck` setzt, ist der Verteiler.
- Dazu kommen zwei Rückrufe in `welt`:
  - `zonenNah(x, z, r)` → [{ key, deck, x, z, R }]
  - `fehlt(zoneKey)` → Zahl der fehlenden Karten
- Ziel ist die nächste Zone desselben Decks, in der noch etwas fehlt. Die Mindestweite `dist_m` gilt weiter. Gibt es keine solche Zone, gilt die alte Wahl.
- Gleiche Tür, gleiches Ziel: Das Ziel steht unter `portale[doorKey]`. Neu gewählt wird erst, wenn dort nichts mehr fehlt.

## Schnittstellen
- **WS1:** Spielstand und Backend. Ruft `album.sammle` an der vorhandenen Sammelstelle auf und reicht das Album an `createCardCollection({ album })` weiter.
- **Kartenkante:** liest `deck()`, `zone()` und `liste()` für die Ansicht im HUD.
- **WS-Design:** bekommt am Portal `{ deck, zielZone, fehlt }` für das Aussehen.

## Tests (Node)
- `test/unit/cardAlbum.mjs`: Schwelle, Zählung, Deck- und Zonenstand, Speichern und Laden, kaputter Stand.
- `cardCollection.mjs` erweitert: Fehlendes wird über viele Saaten bevorzugt, Gesammeltes kommt selten, aber nicht nie, keine Dopplung je Zone, ohne `album=1` alles wie bisher.
- `portalZiel.mjs` erweitert: Deck-Ziel ist die nächste Zone mit Fehlendem, das Ziel bleibt fest und wechselt erst, wenn die Zone voll ist.

## Offen für WS0
- Ganze Familie gesammelt: Heute gibt es dann Fluff statt Karte. Mit `album=1` gäbe es stattdessen seltene Wiederholungen. Mein Vorschlag: Fluff bleibt, sobald alle Decks der Familie voll sind; vorher seltene Wiederholung.
