# README — Export KFB Overworld v12 (2026-08-12)

**Basis:** `KFB Overworld v11.dc.html` (HOUSEKEEPING §4u) · **Stand:** v12, Slices W1–W4 · H1–H4 ·
J1 · B1 · P1. **Geändert gegenüber der Basis: sieben Dateien** (Diff-Liste unten).

Kein Voll-Zip: hier liegt nur, was diese Sitzung gebaut oder angefaßt hat, plus die Module, die das
DC wirklich lädt (**47 von 54** — die sieben ohne Leser sind draußen).

---

## Starten und in 60 Sekunden prüfen

1. `KFB Overworld v12.dc.html` öffnen. Konsole:
   `[asset-source] cdn · https://kayfabizarro.pages.dev/` · `[water] water-v1.0 …` ·
   `[rail-v9b] Kartenspalte steht` · **keine Fehlerzeile**.
2. **Taste C** — Wahl- und Messblatt. Fußzeile:
   `30 gemessen · 28 mit Hieb · 2 Rempler · 5 mit Wurf · 23 mit Porträt`.
3. **Taste J** — Tagebuch: Spielstand exportieren / importieren. Der gewählte Held steht seit
   Schema **2.4.0** im Stand (`hero.unit`, Katalogschlüssel ohne `hero_`-Präfix).
4. Wasser ansehen: das Glitzern liegt **auf** dem Fluid (nicht darunter), trägt die Streufarbe des
   Körpers und hat eine harte Kante. Zahlen: `OW_WATER.probe()`.

---

## Diff gegen v11 — sieben Dateien

| Datei | Was |
|---|---|
| `water-kiss.js` (**neu**, water-v2.1) | eine Streufarbe je Fluid-Körper · Glitzern aus der **Neigung** statt aus der Höhe · harte Kante · gestuftes Morphen (7 und 9 Bilder, gemeinsame Rückkehr nach 63 Schritten) · drei Formen (`kleckse` · `striche` · `schlieren`) · RMS-Neigung als geführte Zahl |
| `terrain-paint.js` (tp-v4.6) | `drawWater` delegiert an `OW_WATER`, behält nur Clip und Ausschnitt |
| `overworld-game-v10.js` | `paintOpt` trägt `fluid` + `nah` · `drawWater` steht **hinter** der Fluid-Schicht · `hero.unit` in `captureJourney`/`applyJourney` |
| `journey.js` (Schema **2.4.0**) | `hero.unit` + Migrator 2.3.0 → 2.4.0 (alte Stände `null` = nie gewählt) |
| `gutter-2d.js` | Tor-Loch raus (`torLoch`/`ringPfadInvers` gelöscht) — die Grabenlinie läuft durch und wird von der Planke überdeckt |
| `card-rail-v9b.js` | Statblatt zeichengleich v11 wiederhergestellt · deckendes Papier · `--pad` 13…22 · Logbuch so hoch wie sein Inhalt |
| `asset-source.js` | `OW_SRC.ow()` — der Runner-Ordner im Repo als Kanal |

**Pfad-Hygiene (v12-P1), erledigt:** Schrift, Kartenrückseiten und Wortmarke laufen über
`kayfabizarro.pages.dev` statt aus dem Ordner daneben. **2,3 MB lokale Binärdateien sind gefallen.**
Der Export wiegt damit nur noch Text.

**Offen:** `overworld-v12/icons-rpg/` (11 SVG, 16 kB) liegt **nicht** im Repo — bis zum Upload
bleibt es die einzige relative Ressource.

---

## Was der nächste Chat zuerst liest

`docs/SLICE_wasser-kiss_2026-08-12.md` — Bauart, Zahlen, **Nähte 67–95**, offene Slices.
`docs/HOUSEKEEPING.md` §4v — Status je Artefakt.
`docs/KONZEPT_statblatt_2026-08-12.md` — das Budget-Modell der Fluffbox (und warum der
Unit-Frame-Umbau zurückgenommen wurde).

**Für v13 vorgemerkt:** die Sprechblasen sind falsch gebaut (Georg 12.8.) — erst messen, was falsch
ist, dann bauen. Betrifft `bubble-ts.js` + `chatter-2d.js`.
