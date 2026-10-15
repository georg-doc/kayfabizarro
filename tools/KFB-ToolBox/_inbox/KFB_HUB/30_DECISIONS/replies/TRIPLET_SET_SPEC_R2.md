# Triplet-Set · Vorgabe R2 (15.10.2026) – ganzes Deck als Sprechtext

**Status:** Regel seit V-266 (Georg 15.10.: Monomyth Mayhem und Philosophy PASS); ersetzt V-231 bis V-235.
**Prüfskript:** `replies/triplet_set_check.py <deck.json> <set.csv>` (Exit 0 = alle Kartenzeilen PASS).

## Quelle
- Kartentext = **gedruckte Karte** (V-242) mit Titeln in normaler Schreibweise (V-271): Branch `data/kfb-card-title-case-2026-10-15` @eade4aec (baut auf `data/kfb-card-text-canonical-2026-10-14` @233efd5 auf), `media/kfb/<Deck>.pdf.json`, Felder `cardName`, `power`, `lore`; die Druck-Schreibweise steht in `cardNamePrint`.
- Nie `jsonLegacy`, `artworkPrompt`, `grade`, `gradeReason` oder Marketingtext.
- Karten mit Status OPEN (Text nicht sicher lesbar) bekommen keine Zeile; sie werden im Bericht gelistet.
- **Meta-Karten ohne Spielinhalt** (BLANK, Anleitung/How to Use, Lizenz, QR-Code, Kartenrückseite u. ä.) bekommen keine Zeile (V-266); im Bericht listen.
- **Titel in normaler Groß-/Kleinschreibung** sprechen und schreiben, nie in Versalien (V-271), auch wenn die Karte sie in Versalien druckt.

## Eine Kartenzeile
- **Titel vorn**, verschmolzen mit dem Begriff aus der POWER: „The Ordinary World stasis loop“, „Jean-Jacques Rousseau, Natural Goodness“.
- Danach kurze **Telegramm-Fragmente** aus der Karte. Artikel und Hilfsverben dürfen wegfallen („man born free“, „old self dead“).
- **Nur Wörter der Karte.** Erlaubt sind Grammatik (Endungen, Pronomen, Artikel, „and/but/so“, Satzzeichen), Weglassen und sparsam ein Fluff-o-lect-Wort („un-fluff“), höchstens eines pro Zeile.
- Nicht erlaubt sind neue Verben, Bilder, Ereignisse oder Erklärungen.
- **Mechanik nur, wenn sie ein Bild ist** („hand new cards“). Würfelwerte, Zahlen und Regel-Etiketten fallen weg.
- **Closure:** Die Karte wird nicht erklärt. Eine semantische Lücke ist erlaubt, eine mechanische Ungenauigkeit nicht.
- Sprechbar in einem Atem, etwa 8–20 Wörter, Englisch.

### Goldens (Georg 14.10.)
- [Welcome to] The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home.
- [Remember] Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill.
- [You know] Jean-Jacques Rousseau, Natural Goodness: man born free, everywhere in chains.

## Opener (eigene Schicht)
- Nur aus dem freigegebenen Pool (V-218 KEEP, V-229, dazu Georgs „Welcome to / Remember / You know“). Die Liste steht im Prüfskript (`OPENERS`).
- **Jeder Opener höchstens einmal pro Set** (V-222). Nicht jede Zeile braucht einen; etwa jede zweite bis dritte Zeile, wie im Wrinkle-Rumble-Spender.
- Der Opener muss grammatisch und inhaltlich zur Karte passen: „I once met“ nur vor Personen, „Ever tasted“ nur vor Essbarem, „You played“ nur, wenn die Karte gespielt wird.

## Set-Aufbau (Suno-Sprechtext, ohne Musik aufnehmbar)
1. `[Spoken Word]`
2. Intro: „Welcome to <Decktitel>.“ (nur der Decktitel, kein erfundener Slogan).
3. Alle Kartenzeilen in Kartennummer-Reihenfolge. Nach je etwa 8 Zeilen eine Leerzeile als Atem- bzw. Schnittpause.
4. Outro: „Stay Fluffy!“
- **Eine Zeile = ein Take.** Jede Zeile steht für sich, damit sie einzeln aufgenommen und geschnitten werden kann. Übergänge wie „That attracts …“ gibt es nur als Opener aus dem Pool, keine frei erfundenen Brücken.

## Ausgabe je Deck
- `<deckId>.suno.txt`: der Sprechtext wie oben.
- `<deckId>.takes.csv`: `line_no, kind, card_number, card_title, opener, triplet, spoken_text, start_seconds, end_seconds, sync_status` (`spoken_text` = Opener + Triplet; Zeiten leer, `sync_status` = `UNTIMED_AWAIT_REAL_AUDIO`). Dieselbe Form wie der Wrinkle-Cue-Sheet.
- `<deckId>.check.txt`: Ausgabe des Prüfskripts (muss 0 FAIL zeigen).
- Bericht: Anzahl Zeilen, ausgelassene OPEN-Karten, benutzte Opener.
