# H15 Mindscape · Doku

## Was es ist
H15 ist eine Kopie von H14 (Hypernorm-Engine mit Static Bake). Sie zeigt die laufende 2D-Engine-Fläche als Innenwand einer begehbaren 360°-Sphäre. Inhalt entsteht nur aus Pools, Gewichten und Seed. Es gibt keine kuratierten Bilder und keine generierten Bilder. H14 bleibt unverändert.

## Schichten (von außen nach innen)
| Schicht | Radius | Quelle | Mischung |
|---|---|---|---|
| Wand | 10 | Engine-Fläche `faceEl` 1024×512, live | deckend, Band ±55°, Pole auf 12 % |
| Schale A | 6,5 | Engine-Fläche von vor 0,26 s | Luma-Key ab 0,42, α 0,62 + 0,25·Kick |
| Schale B | 4,2 | Nachbild-Akkumulation von A (α 0,55) | Luma-Key ab 0,55, α 0,45 + 0,35·Kick |
| Gedichtband | 3,3 | `PoemBand` in Canvas 2048×256 | transparent, ±20° um den Äquator |

Ein Renderer (three.js 0.160.0, ESM über jsDelivr), eine Kugelgeometrie für alle drei Hüllen, Takt aus dem bestehenden `tick()`.

## Abbildung Fläche → Kugel (Shader `MS_FS`, Stand M3)
- Waagrecht: zweimal gekachelt, Übergang als periodischer Versatz-Überblender (siehe `RETURN_M3_NAHT.md`), Wellung über die Breite, Randeinzug 1,2 %.
- Senkrecht: `v = mir(0,5 + lat/1,92)`, Falte bei ±55°, dort Versatzprobe eingemischt; das Band blendet ab |lat| ≈ 0,88 aus.
- `uOff` je Schale: Versatz mit Seed-Geschwindigkeit plus Bass.

## Kamera
- Ziehen: Gier und Neigung mit Nachlauf, Neigung auf ±1,25 begrenzt.
- Autopilot: Gierrate `0,07·(0,4 + Energie)·(1 + 1,5·Mitten)`, Neigung als langsame Sinuswelle, Drift im Inneren ±1,6 (Parallaxe zu den Schalen), leichtes Rollen nach Energie.
- FOV `78 + 6·Kick − 8·Energie`.
- Doppelklick oder „Immersiv“: Vollbild.

## Schnitte
Je Einstellung (`_msKey`) legt `hash(seed, cycle, shot, 151)` fest:
- Schalengeschwindigkeit;
- Neigung;
- bei Energie > 0,66 oder mit 25 % Wahrscheinlichkeit einen Sprung der Schalenversätze.

## Audio (`soundbed.js`)
Ein AudioContext, derselbe wie die Jukebox, alles über den Engine-Analyser.
- Binaural: Träger 140–240 Hz (Seed), rechts + Δ. Δ je Sektion: INTRO 4, VERSE 6, BUILD 7,83, DROP 10, BREAK 3, OUTRO 2,5 Hz.
- Drone auf dem halben Träger (Grundton, Quinte, Oktave), Tiefpass nach Energie.
- Schellack-Luft (Rauschen und Knistern).
- Puls auf jedem Engine-Schlag. Takt 1 betont, Hi-Hat ab Energie 0,6, in BREAK still.
- Schellack-Titel aus `pd_audio/manifest.json`: über `archive.org/metadata/<id>` die MP3 ermitteln, streamen, Tempo 0,88–1,06, Hall 1,6 s bei 24 kHz, Wechsel alle 45–95 s.
- Die Analysemerkmale (Bass, Mitten, Höhen, Kick) treiben dieselben Ebenen wie in H13, in 3D zusätzlich FOV, Schalen, Gierrate und Gedichtband.

## Gedichte (`poems.js`)
- Werke aus `poetic_occult_archive_seed.json`: nur Rechtestatus H oder E, keine Auszugs-Titel mit „:“. Das sind 22 Werke.
- Wortlaut live von Wikisource (en, dann de). Der Autor auf der Seite muss zum Werk passen.
- Zwei Wiederholungen (8 s, 20 s), höchstens zwei Abfragen gleichzeitig.
- Stand: 7 gefunden, 15 echte Fehlanzeigen.
- Zitate: 320 aus `quote_index_full.json` (PUBLIC_DOMAIN_CONFIRMED, unter 140 Zeichen).
- Satz:
  - Zeile für Zeile im Takt, Haltedauer nach Wortzahl (2,6 Wörter/s), BREAK ×2, DROP ×0,6;
  - Behandlungen TYPE, HARD, SPREAD, SCATTER;
  - Schrift nach Engine-Gewicht `poem`, Farbe aus der laufenden Palette;
  - bis 3 Nachbilder;
  - Herkunftszeile mit URL nach jedem Werk.

## Bildpool
Die Engine-Pools aus H5–H14 (LoC, PD-Manifest, KFB-Karten, Commons-Filme), dazu:
- Alte Karten: Commons, 12 feste Begriffe, nur PD/CC0, höchstens 20, Art `engraving`.
- WS0-Pool: 481 Bilder aus `hypernorm_r3/pd_pool/`. Art und Kontext kommen aus `gruppe`.
- Summe in der Preview: 672.
- Bake: `BAKE_SRC` lässt nur loc/pd/kfb zu. Karten und WS0 bleiben draußen.

## Persistenz
`localStorage` unter `kfb-kaleido-h15-v1` (Seed, Schalter).

## Konstanten (Kopf des Logikteils)
`MS_R = [10, 6.5, 4.2]` · `MS_FOV = 78` · `MS_DRIFT = 1.6` · `MS_AUTO = .07` · `MS_BAND_R = 3.3` · `MAP_MAX = 20` · `THREE_URL` · `PD_PIN = f3acaaeb…`

## Leistung (gemessen, Preview-Fenster)
| Zustand | fps |
|---|---|
| M1, ohne Audio | 45–74 |
| M2, ohne Soundbed | 42 |
| M2, mit Soundbed, vorher | 18–22 |
| M2, mit Soundbed, Hall gekürzt | 27–36 |
| Fork-Prüfer im DROP | 6–11 (vermutlich Aufnahme-Last, nicht bestätigt) |
| M3, Naht-Shader | NOT_TESTED |
