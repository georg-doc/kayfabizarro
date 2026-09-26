# H4 · Kaleidoskop-Engine · Konzept und Aufbau

Stand 2026-09-26. Datei: `KFB Billboard Kaleidoscope H4.dc.html` (Design Component, eine Datei, ~90 KB).
Status: **PASS (Georg, 2026-09-26)**. Konzept-Prototyp, 2D-Fläche, kein Stage/Public/Live.

## Idee

Hypernormalisation funktioniert wie ein Video: Schnitt, Rhythmus, Montage. H3 teilte die Tafel in Felder; H4 legt **Ebenen hintereinander** und führt **eine Kamera** hindurch. Der Schnitt folgt einer **Songform**. Jede Einstellung wird aus mehreren Achsen gewürfelt, und aus K Kandidaten gewinnt der, der den letzten Einstellungen am wenigsten ähnelt.

## Fläche

- Canvas 1024 × 512 (Tafel 2:1, 4,20 × 2,10 m). Overscan für Kamerafahrten: 1,7-fach (`OV`).
- Canvas 2D, kein WebGL, kein Post-Stack (B2b-Regel, bis D1).

## Zeit: Songform

- Takt aus `bpm` (Prop, Standard 112). Ein Zyklus = eine von **4 Formen** (`FORMS`), Wiederholung der letzten Form gesperrt.
- Abschnitte: **INTRO · VERSE · BUILD · DROP · BREAK · OUTRO**, je mit Energie `e` (0,12 bis 1), Einstellungslängen in Schlägen, eigenen Gewichten für Übergang, Basis, Typo und Kamera (`SECTIONS`).
- Beispiel Form 0: INTRO 2 · VERSE 4 · BUILD 2 · DROP 4 · BREAK 2 · VERSE 4 · DROP 4 · OUTRO 2 (Takte).
- Timeline unter dem Player: Abschnitt, Energiekurve, Einstellungen, Typo; klickbar zum Springen.

## Raum: Ebenen einer Einstellung

| Achse | Werte |
|---|---|
| Basis (`BASE_W`) | PLATE · KALEIDO · SLITSCAN · MIRROR · DROSTE · PATTERN · FIELD · LED |
| Mittelebene (`MID_W`) | NONE · BLEND · LUMA_KEY · SPRITES · STRIPS · BLOB |
| Typo (`TYPE_W`, 11 + NONE) | GIANT_CROP · KNOCKOUT · ECHO · SCATTER · MIXED · VERTICAL · TEXTURE · WIDTH_MORPH · OUTLINE_SWEEP · CHARFLIP · ARC |
| Kamera (`CAM_W`) | PUSH_IN · PULL_OUT · TRUCK · CRANE · ROLL · DUTCH_PUSH · SNAP · FLOAT · ORBIT · DOLLY_ZOOM |
| Übergang | CUT · CROSS · WHIP · ZOOM_THROUGH · SLIT · TYPE_WIPE · KALEIDO · GLITCH · FLASH |
| Muster (`PAT_W`) | MOIRE · RAYS · TRUCHET · DOTWAVE · STRIPES · FLOW · SQUARES · LISSAJOUS · CHECKER · SPIRAL |
| Palette (`PALS`) | NOTICE · ACID · COBALT · MINT · UKIYO · NOIR · ROSE · OXIDE · VOID |
| Grade (Bildbasen) | u. a. DUO · DUOA · THRESH · HALFTONE |

Kamera: 2,5D über drei Tiefenebenen (Basis, Mitte, Typo) mit Parallaxe.

## Auswahl: Unähnlichkeit

- Pro Einstellung werden **K Kandidaten** geplant (Prop `candidates`, Standard 10).
- `simScore()`: Übereinstimmung je Achse mit den letzten 16 Einstellungen, gewichtet (`DIMW`), abklingend mit 0,82^n; gleiche Basis + Mitte + Typo zählt +6 extra.
- Gewinner = kleinster Wert. Dazu Sperrlisten: letzte 10 Platten, letzte 14 Texte, gleiche Basis/Schrift wie davor stark abgewertet.
- Live-Anzeige: „Similarity to last 16“, „Distinct so far“ (Signaturen, Kombinationen, Typo, Schriften), fps, geladene Platten.

## Kontext

`CTX` verschiebt alle Gewichte in eine Richtung: KALEIDOSCOPE (neutral) · POLITICAL · HISTORICAL · ARTISTIC · COMMERCIAL · ABSTRACT. Kontext und Seed liegen in `localStorage['kfb-kaleido-h4-v1']`.

## Typografie

- 16 Schnitte aus Google Fonts (Archivo mit wdth-Achse, Bodoni Moda, Big Shoulders Display, Six Caps, Cinzel, UnifrakturMaguntia, IM Fell English, Silkscreen, Monoton, Instrument Serif, IBM Plex Mono, Bungee Shade, Rubik Mono One). Nicht im Export, geladen per `fonts.googleapis.com`.
- Stimmen: slogan · signal · latin · poem. Jede Schrift hat Gewichte je Stimme (`FONTS[k].v`), damit Latein nicht in Pixel-Schrift und Teletext nicht in Fraktur landet.
- Textbänke: Slogans nach Kategorie (political, commercial, scientific, artistic, historical), lateinische und englische Zitate, Signal-Texte (Teletext-Ton). Max. Länge je Typo-Behandlung (`TMAX`).
- CHARFLIP flackert Buchstaben durch 12 Schnitte; WIDTH_MORPH ändert die Breite auf dem Schlag.

## Material

33 Platten der Library of Congress über `tile.loc.gov` (Fotos 8, Stiche 2, Plakate 12, Holzschnitte 7, Zeichnungen 4). Liste: `PROVENANCE_LOC_H4.json`. Pixel-Sprites (EYE, SMILE, HOUSE, BOLT, 12×12) als eigene Ebene. Keine GitHub-Bilder.

## Entfernt gegenüber H3

Umrandete Kreise, wiederkehrende Rahmen, sichtbare Konstruktionsgeometrie, Quadranten-Layout.

## Seite

Bildschirme: Kopf · Player · Stichprobe (12 Einstellungen eines Zyklus, Seed + 7777, bei 65 % der Dauer gerendert) · Bibliothek · Befund.

## Props (Tweaks)

`bpm` 80–140 · `candidates` 1–16 · `grain` 0–1.

## Technische Hinweise

- Bilder mit `crossOrigin='anonymous'`; Grades und Luma-Key lesen Pixel (`getImageData`). Das braucht CORS-Header von `tile.loc.gov`; in der Claude-Design-Preview liefen sie. Fällt ein Bild aus, fliegt es aus dem Pool (Zähler „x/33 plates“).
- Schleife: `requestAnimationFrame` plus `setTimeout`-Rückfall (120 ms), damit ein Hintergrund-Tab nicht stehen bleibt.
- Fehler im Frame werden einmal im Player angezeigt statt still zu scheitern.
