# Dokumentation · KFB Billboard Kaleidoscope H5 bis H13

Stand 30.09.2026. Jede Stufe ist eine Kopie der vorigen; nichts wurde überschrieben.
Datei je Stufe: `KFB Billboard Kaleidoscope H<n>.dc.html` im Projektstamm.

## Stufenleiter

| Stufe | Inhalt | Status |
|---|---|---|
| H4 | Ebenen mit Kamera, Songform, Muster, Typo-Behandlungen, Unähnlichkeits-Auswahl. Material: 33 LoC-Platten | Georg PASS 26.09. |
| H5 | Kopie H4. Neu: Materialzugang LoC-Platten + PD-Manifest (Pin) + Live-Filmclips | berichtet fertig |
| H6 | Echte KFB-Karten über `KFBCorpus` (Deck Viewer v4), Crops `data/h6-card-crops.json`, Exhibition-Trio. Prüfbogen `KFB Card Crop Proof.dc.html` | berichtet fertig |
| H7 | Akten-Grammatik, FOIA-Dokumente | berichtet fertig |
| H8 | Schriften: Hieroglyphen, Keilschrift, Formeln | berichtet fertig |
| H9 | Typo in Bewegung (Wave, Ransom-Brief aus Bildausschnitten, Script, Glyph als Maske). Textgenerator aus Kartentriplets (SHOW IT → SPIN IT → SELL IT; Name, Power, Lore, Mood aus 13 Decks). 64 Pixel-Sprites | berichtet fertig |
| H10 | Übergänge Ripple, Dissolve, Whirl, Pixelate (Ripple/Whirl auch als Nachbearbeitung). Fraktale auf der CPU (Julia, Mandelbrot, Sierpinski). Fehldruck-Looks. Fünf Farbquellen | berichtet fertig |
| H11 | Tweak `palSource`: RANDOM (9 eigene) · STORY · CARDS · BIOME (aus `world-context.js`) · Travel/Joyride. Biome-Zuordnung als Vorschlag, nicht Kanon | berichtet fertig |
| H12 | Endlose Hypno-Spirale/Ringe/Strahlen. 12 physikalische Formeln mit Symbol-Substitution (echt bis auf dokumentierte Ausnahmen). Generierte Moleküle mit erfundenen Namen | berichtet fertig |
| H13 | Live-Musik-Visualizer: 8 Titel aus `disco-playlist-01.json`, Tempokarte gemessen (Beatmessung 01). Bass/Mitten/Höhen/Kicks treiben Kamera, Schrift, Hypno-Tempo, Fraktal-Farbe, Korn, Blitze. Leinwand-Modus (Vollbild) | berichtet fertig, Beleg `collage-engine/evidence/01-h13-jukebox.jpg` |

## Pins (aus dem H13-Quelltext)

| Zweck | Pin |
|---|---|
| Public-Domain-Manifest und Medien (`PD_PIN`), auch Deck Viewer v4 `kfb-corpus.js` | `f3acaaeb98530dd9ffb7d200d61956891e738336` |
| Disco-Playlist, Beatmessung (`DISCO_PIN`) | `a46dbdff150362e7153c143b21fa76ffe8ffb5e4` |
| Audio über jsDelivr | `5f268e806a4f48b68944ce025ee8f1d2837a0590` |
| `world-context.js`, `world-palettes.js` (Travel v25) | `5b523eb85aaf19bdb54707ee016b08003337f974` |
| `clay-material.v10.js` (Joyride) | `e9438c55edd2d75b5787c326db3112ee6682242b` |

Regel: Module über jsDelivr (`cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<pin>/…`), Daten über raw. raw liefert JS und SVG als `text/plain` und keinen CORS-Kopf für Audio.

## Aufbau (H13)

- Canvas 1024×512, Überzeichnung `OV` = 1,7-fach für Kamerafahrt.
- Ebenen: Grund, Mitte, Vordergrund, Text. Materialquellen: LoC-Platten (`tile.loc.gov`), PD-Manifest (`minEdge` 640 px), KFB-Karten (Corpus), FOIA-Akten, Sprites, Fraktale, Hypno, Formeln, Moleküle.
- Auswahl: Unähnlichkeits-Auswahl (aus H4), Songform, Muster-Katalog.
- Persistenz: `localStorage` Schlüssel `kfb-kaleido-h13-v1`.
- Musik: Playlist von raw am `DISCO_PIN`, `bs()` = 60 / BPM des Titels, Takt 1 des Titels = Takt 1 der Songform.
- Tweaks (Props): u. a. `bpm` (80–140, Default 112), `palSource`, Textanteil. Vollständige Liste im `data-props` am Dateiende von H13.
- Info-Zeile im UI weist aus: fps, Akten-, KFB-, Film-Zahlen, Musik- und Leinwandzustand.

## Pool

- Manifest `media/public_domain/manifest.jsonl` auf main: **4 Objekte** (R1). R3 (24–40 Bilder je Thema, max. 400) und R4 (medicine, animals, bookpages, architecture, artifacts) sind Aufträge an den Web-Chat, **Stand offen**.
- Bis dahin: LoC-Platten und Live-Suche (Commons, AIC) tragen das Material.
- Rechte: Schwelle D2 = nur „No known restrictions“. Rechte je LoC-Platte einzeln: Sprint-Slice S1 (`PROVENANCE_LOC_H4.json`), Status in diesem Paket **nicht geprüft** → `OPEN`.

## Testlage

TESTED RESULT (berichtet aus den Sitzungen, in diesem Lauf nicht wiederholt):
- H13 lädt, spielt 8 Titel, Leinwand-Modus öffnet; alle drei Ebenen-Typen erscheinen.
- Collage-Engine-Planer (nur Engine v0, FAILED): 300 Einstellungen ohne Wiederholung, Loop nahtlos. Diese Zahlen gelten **nicht** als Qualitätsbeweis.

NOT_TESTED:
- Bildrate auf GPU und Mittelklasse-Laptop; Mobil.
- Mehrere Billboards gleichzeitig (ein Kontext je Canvas, Browsergrenze etwa 16).
- Läuft H13 auf der 3D-Tafel (Textur-Anbindung): nicht gebaut.
- Audio-Latenz Kick → Bild unter Last.
- Rechte je Platte (S1).
- Clips als Ebene im Dauerbetrieb, Abspann/Namensnennung, WebM-Aufnahme.
- R3/R4-Material in H13 (Manifest hat 4 Objekte).

## Bekannte Probleme

1. Engine v0 (`collage-engine/`) ist FAILED CANDIDATE; nicht weiterbauen, nicht anschließen. Ursachen in `FAIL_2026-09-30.md` (Grundlage neben H4, Würfel über alle Parameter, Werbevokabel-Kombinatorik, Leitplanken messen Lesbarkeit statt Qualität).
2. Manifest-Pfad: 4-KB-Vorschaubild wurde als Held hochgezogen. Behoben durch `minEdge` 640.
3. Georgs Reddit-Referenzen (seit B2b-P1) weiter offen.
4. `github.md` ist sehr lang und enthält Wiederholungen; Kürzung ist ein eigener Housekeeping-Schritt, nicht Teil dieses Pakets.

## Nicht anfassen

`KFB_Billboard_B2b_P1_frozen_2348c06/` (byte-gleich), H1–H4, B2b-Ticker/Lifecycle, veröffentlichte POCs.
