# Konzept · Deck-Paket als SSOT · R1 · 01.11.2026 (V-1147, setzt V-363 um)
**Ziel:** Je Deck ein vollständiges Paket: geprüfte Kartendaten, Bilder in passenden Größen, eine Bewertung, Tratsch und Songs als Verweis, Marketingtexte, Status. Spiel, Viewer, Almanach und Rollout-Desk lesen dasselbe Paket.

## Stand
- Das PDF führt, die JSONs ziehen nach (V-242, V-696). `main` ist alt; Arbeitsstand ist `data/kfb-deck-analyzer-r1`, Spiel-Stand `ws1/karten-druck-spiel`.
- Sichtung: 130 Decks, 59 am 14.10. gesichtet, 52 MedKayfab nie geprüft, Rest siehe `DECK_ABGLEICH_R1.md`.
- Bewertungen stehen nebeneinander: `grade` 1–3 (Spiel), `rating` 1–5★ (GRADING_R1), Scores im Rollout (Viral, Gesamt, G1-Anteil).
- Bilder: Web-PDF rund 776 px je Karte, Druck-PDF rund 1366 px. Das Spiel rendert heute zur Laufzeit aus dem Web-PDF.

## Aufbau
```
deck.json     Kartentext (Druck), Bewertung, Bildverweise, Motiv-Rechteck, Prüfstand, Altwerte
bilder/       viewer | karte | motiv je Karte, Cover
texte/        Kanäle, Suno, Status (aus dem Desk)
prüfung.json  Prüfer-Ergebnis, Stichproben, Herkunft (PDF, Seite, Viertel, Prüfsumme)
```
Stabile Kennung `cid:<deck>:<nr>`, die das Spiel schon nutzt. Ein Prüfskript sichert: jede Karte hat Text, Bild und Bewertung, nichts verwaist, Zahl wie im PDF.

**Bilder:** `karte` 1366 px, `motiv` rund 700 px. `viewer` nur, wenn der Test es rechtfertigt: lokale Hochrechnung mit dem vorhandenen Topaz Gigapixel, damit Text am Desktop besser lesbar wird. Risiko: erfundene Buchstaben. Darum erst an einem Deck vergleichen; Text bleibt ohnehin im JSON.

**Bewertung:** Inhalt ist `rating` nach GRADING_R1. `grade` wird daraus abgeleitet, sobald die Zuordnung am Pilot geprüft ist. Deck-Scores aus dem Rollout bleiben eigene Werte für Marketing und überschreiben keine Kartenwerte. Widersprüche werden aufgelistet, nicht still gemittelt. Georgs offene Punkte aus dem Deck-Analyzer gehen vorher an ihn.

## Wer und womit
| Schritt | Womit | Kosten |
|---|---|---|
| Backen, Motiv-Vorschlag, Prüfskript | Skript auf dem Mac, kein Modell | nur Rechenzeit |
| Text abgleichen, nur ungeprüfte Decks | Sonnet je Deck, Stichprobe am Bild | Token je Deck messen |
| Bewerten | Sonnet nach GRADING_R1 | wie oben |
| Unstimmigkeiten, Marketing-Feinschliff | stärkeres Modell gezielt | klein halten |
| Marketingtexte | Rollout-Sitzung, nur ausgewählte Decks | wie heute |

**Eigentümer:** die bestehende Sitzung „KFB Deck Rollout“. Sie hat Pipeline, Desk und Render-Werkzeuge. Der Deck-Analyzer-Prozess zieht dorthin. WSA wird nicht gebraucht, weil nichts neu gezeichnet wird. WS1 hängt das Spiel an (`cardImage` liest das Paket, PDF nur als Rückfall, hinter Schalter) nach den Kartenzonen.

## Platz (V-1146)
Pakete liegen auf GitHub oder einem Datei-Host, nicht in der Dropbox. Jeder Lauf holt ein Deck, backt, prüft, lädt hoch und räumt ab; Druck-PDFs werden nur gelesen. Geschätzt rund 800 MB Bilder ohne `viewer`. Host wird im Pilot entschieden: GitHub-Rohdateien reichen vielleicht nicht für tausende Abrufe aus dem Spiel.

## Reihenfolge
1. Schema, Prüfskript, Zweig `data/kfb-decks-ssot` vom Analyzer-Stand.
2. Pilot: die drei Rollout-Decks komplett, Token und Zeit gemessen, Georg prüft im Desk.
3. Warteschlange: alle Decks in Stapeln, zuerst Bilder (billig), dann ungeprüfte Texte, MedKayfab zuletzt. Ein geplanter Lauf arbeitet die Liste ab, je Deck eine Teilsitzung.
4. Spiel-Anschluss und Viewer. Merge nach `main` nur mit Georg.

**Nicht drin:** Automatische Textänderung ohne Protokoll, Marketing für ROT-Decks, Änderungen an den Original-PDFs.
