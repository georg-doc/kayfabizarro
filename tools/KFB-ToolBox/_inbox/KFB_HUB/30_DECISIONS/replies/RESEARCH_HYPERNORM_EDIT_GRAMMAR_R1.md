# RESEARCH · HyperNormalisation Schnitt-Grammatik · R1 · 2026-10-24
Bezug: V-721 (BNWN-Clips), BRIEF_WS0_HYPERNORM_R2 (`kfb-hypernorm`, H13-Engine), Modul `kfb-quote-sequence`.

**Tier 0**
1. Frische entsteht nicht aus mehr Effekten, sondern aus Regeln: Beat-Raster + Clip-Tags + Verbots-Regeln + Überraschungs-Budget.
2. Ein Format für beides: das **Rezept** (JSON). Generativ = Regeln, Engine füllt live. Eingefroren = fertige EDL, Remotion rendert.
3. Live macht Schnitt, Shader-Übergang, Look und Schrift. Remotion macht alles mit Zeit-Verbiegung (Ramp, Stotter, Datamosh, Gilliam-Animation).

---

## 1 · Montage-Grammatik (Bausteine mit Werten)
Grundeinheit ist der Beat, nicht die Sekunde. BPM so wählen, dass ein Beat ganze Frames hat:
- 25 fps: 100 BPM = 15 f, **125 BPM = 12 f**, 150 BPM = 10 f.
- 30 fps: 90 BPM = 20 f, **120 BPM = 15 f**, 150 BPM = 12 f.
- 1/8 = halber Beat, 1/16 = Viertel-Beat (bei 125 BPM @25: 6 f bzw. 3 f).

| Baustein | Was er tut | Wann | Werte (Richtwerte) |
|---|---|---|---|
| Schnitt auf Beat/Takt | Bild atmet mit Musik | Grundmodus | Schnitt 1–2 f **vor** dem Beat (wirkt sonst zu spät). Nicht immer auf die 1: sonst vorhersehbar. Mix aus 1, 3 und Off-Beat (&). |
| J-Cut / L-Cut | Ton führt (J) oder hängt nach (L), Schnitt wird weich | Sprecherin-Clips, Satzübergänge | J: Ton des nächsten Clips 4–12 f früher. L: alter Ton 0,5–1 Beat unter neuem Bild. |
| Match-Cut | Form, Farbe oder Bewegung verbindet zwei Bilder | Kontext-Wechsel (Anchor → Archiv) | Fokuspunkt beider Shots < 10 % Bildbreite auseinander, gleiche Bewegungsrichtung, harter Schnitt oder 2–4 f Blende. |
| Smash-Cut | Ruhe → Lärm, Pointe | Ende eines ruhigen Abschnitts | Vorher 1 Takt Ruhe. Ton 2–6 f vor dem Schnitt auf Stille. Max. 1 pro 8 Takte. |
| Jump-Cut | Gleiche Einstellung, Zeit fehlt, nervös | Sprecherin, Phrasen kürzen | 4–12 f entfernen. Abwechselnd 5–10 % Punch-in, damit es gewollt aussieht. |
| Speed-Ramp | Zeit dehnt sich, dann Ruck | Vor Drop oder Pointe | 100 → 20 → 100 % über 1 Beat (12–15 f). Nur vorgerendert. |
| Freeze-Frame | Bild bleibt stehen, Text kommentiert | Ironie, Curtis-Momente | 1–2 Beats, dazu Entsättigung oder Halftone + flache Caption. |
| Stotter/Repeat | Wort oder Geste klemmt | Anchor-Sätze (Max-Headroom-Effekt) | 2–4 f Schleife × 3–4 auf 1/16. Ping-Pong erlaubt. Max. 1 pro 4 Takte. |
| Split-Screen / PiP | Gleichzeitigkeit, Widerspruch | Anchor sagt A, Archiv zeigt B | 2–3 Felder, Einsatz gestaffelt um je 1/8. Harte KFB-Kanten. Dauer 1–2 Takte. |
| Text-Punch | Ein Wort schlägt aufs Bild | Slogans, Kartentexte | 1 Wort pro Beat oder 1/2 Beat. Mindestens 6 f pro Wort. Lesefluss ≈ 3 Wörter/s. Vollbild-Schrift auf Schwarz: 1 Beat. |
| Datamosh / Glitch | Bild A zerläuft in Bewegung von B | Abschnitts-Wechsel, Störung | 4–10 f. Max. 1 pro 8 Takte. Echtes Datamosh vorgerendert, live nur Näherung. |
| VHS/CRT | Medium wird sichtbar | Dauerbehandlung | Konstant leise. Tracking-Fehler-Burst 3–8 f an Abschnittsgrenzen. |
| Collage (Gilliam) | Ausschnitte als Papier, ruckig | Kommentar, Satire | Animation auf 2er/3er (12 bzw. 8 Bilder/s) bei 25 fps Hintergrund. Weißer Papierrand 2–3 px, harter Schatten. Gelenk-Drehungen, Auftauchen ohne Easing. Absichtlich holprig. |
| Curtis-Kontrapunkt | Archiv + bedrohliche Musik + flache Caption = Bedeutung aus Nebeneinander | Haltung, Ruhe vor dem Sturm | Archiv-Shot lange stehen lassen (4–8 s, auch mehr). Caption hart an, keine Animation, kurze Aussagesätze, 3–5 s. Danach Gegensatz (Pop, Kitsch). Motive kehren wieder. Plötzliche Stille. |

Curtis-Kern in einem Satz: Er lässt Material laufen, statt es zu zerhacken, und erzeugt Sinn durch Nebeneinander von Bild, Musik und nüchternem Text. Für KFB heißt das: **Wechsel zwischen Hacken (Musikvideo) und Halten (Curtis)** ist selbst das wichtigste Gestaltungsmittel.

## 2 · Vielfalt nach Regeln
**2.1 Shot-Tags** (je Clip einmal, halbautomatisch):
- Subjekt/Art: anchor, archiv, karte, slogan, textur.
- Einstellung: CU, MCU, total. Blick: Kamera, seitlich.
- Bewegung: Menge 0–1, Richtung.
- Energie 0–1. Farbe: 2–3 Leitfarben, mittlere Helligkeit.
- Fokuspunkt (x, y) für Eye-Trace und Match-Cuts.
- Text-sichere Zonen (Rechtecke, in denen Schrift nichts verdeckt).
- Sprache: hat Stimme, Satzende ja/nein, Wörter mit Zeitstempeln.
- Kontext (CTX aus H13: POLITICAL, HISTORICAL, COMMERCIAL, ARTISTIC, ABSTRACT), Stimmung.
- Automatisch: Helligkeit, Farbe, Bewegung (Frame-Differenz), Wörter (Transkript). Von Hand: Stimmung, Fokus bei Zweifel.

**2.2 EDL aus dem Beat-Raster** (Ablauf, deterministisch je Seed):
1. Musik → BPM, Takt-Offset, Abschnitte (Intro, Strophe, Refrain, Break) mit Energie.
2. Abschnitt → Dichte (Shots pro Takt): ruhig 0,25–0,5, normal 1, Refrain 2–4.
3. Längen aus einer Muster-Bibliothek ziehen, in Beats:
   - `8-5-3` (= 1 : 0,62 : 0,38, Fibonacci),
   - `4-4-2-2`, `2-1-1-4`, `3-3-2`, `16` (Curtis-Halten).
   - Nie dreimal dieselbe Länge hintereinander.
4. Für jeden Slot Clip wählen: Unähnlichkeit zum Vorgänger (H13 `simScore` weiterverwenden), aber Fokus nah am vorigen Fokus (Eye-Trace).
5. Übergang wählen aus Tag-Paar: passt Form/Farbe → Match. Gleicher Clip-Typ Anchor → Jump oder J-Cut. Kontextbruch → harter Schnitt oder Smash. Abschnittsgrenze → Glitch/Datamosh.
6. Prüfen (siehe Regeln), bei Verstoß neu ziehen. Ausgabe: Rezept mit EDL.

Walter Murchs Rangfolge hilft beim Gewichten: Gefühl vor Geschichte vor Rhythmus vor Eye-Trace. Rhythmus allein trägt nicht.

**2.3 Verbots-Regeln** (mechanisch prüfbar):
- Nie zweimal derselbe Übergang hintereinander. Derselbe Effekt frühestens nach 4 Schnitten wieder.
- Clip-Abklingzeit: 12 Shots. Gleiches Paar Clip + Look: nicht innerhalb 3 Minuten.
- Max. 3 Helligkeitssprünge pro Sekunde (gilt schon in P0, auch Fotosensitivität).
- Mindestens 1 Halte-Shot (≥ 2 Takte) pro 16 Takte.
- Text nie über Gesicht (Text-sichere Zone nutzen).
- Sprecherin: Schnitt nur an Satzende oder Wortgrenze, außer im Stotter-Modus.

**2.4 Überraschungs-Budget:** Pro 8 Takte 3 Punkte.
- Kosten: Smash 1, Freeze 1, Stotter 1, PiP 1, Datamosh 2, Speed-Ramp 2, Vollbild-Text 1.
- Harter Schnitt, J/L, Match, Jump kosten 0.
- Ungenutzte Punkte verfallen. Refrain darf 5 Punkte haben, Intro 1.
- Ergebnis: Effekte kommen selten genug, um zu wirken.

**2.5 Werkzeuge, was davon nutzbar ist:**
- **editly** (Node + ffmpeg): JSON-Spezifikation für Clips, Ebenen, Titel. Übergänge = gl-transitions-Namen. Nutzbar als Vorbild fürs Rezept-Format und für schnelle Offline-Proben.
- **ffmpeg xfade**: Übergang mit `transition`, `duration`, `offset` (z. B. fade, dissolve, pixelize, slices, squeeze, wipes). Billig für Batch-Proben, nicht für die Endfassung.
- **gl-transitions**: offene GLSL-Sammlung, Schema `from`/`to`/`progress`, einzeln lizenziert (meist MIT). Direkt als Three.js-ShaderMaterial verwendbar (z. B. GlitchMemories, GlitchDisplace, pixelize, luma, directional-wipe).
- **Remotion `@remotion/transitions`**: `TransitionSeries` mit Presentation (fade, slide, wipe, flip, clockWipe, iris, zoomBlur, eigene) + Timing (`linearTiming`, `springTiming`). Achtung: Übergänge überlappen und kürzen die Gesamtdauer, also im Beat-Raster einrechnen. Eigene Presentation = React-Komponente mit `progress` → dort gl-transitions-Shader einhängen.
- **MoviePy v2** (Python): Schneiden, Zusammensetzen. Gut für Tag-Analyse und Proben-Skripte (v2 bricht alte Tutorials).
- **librosa `beat_track`**, **Essentia `RhythmExtractor2013`**: Beat-Raster offline, nicht live. **@audio/beat**: Beat-Tracking auch im Browser.
- **CapCut AutoCut, BeatEdit (Premiere)**: setzen nur Marker auf Beats. Lehre: Nicht jeder Beat braucht einen Schnitt.
- **BEAT (arXiv 2605.27067)**: Trailer-Schnitt per Takt-DP. Kernidee übernehmbar: ein Shot darf mehrere Takte halten, energiereich = schnell, ruhig = lang.

## 3 · Live im Browser vs. vorgerendert
**Live (Three.js/WebGL oder Canvas2D):**
- Harter Schnitt, Crossfade und Shader-Übergänge zwischen zwei Video-Texturen (A/B-Deck, gl-transitions).
- Glitch, RGB-Versatz, Pixelierung, Scanlines, Halftone, Papier-Overlay.
- Schrift-Overlays in voller Auflösung, Freeze (Video pausieren).
- Datamosh-Näherung: Ping-Pong-Puffer, letzter Frame wird verschoben, ~10–15 % neues Bild dazu.
- **Luma-Matte-Übergänge**: Graustufen-Video oder -Bild steuert den Mix. Funktioniert überall, im Gegensatz zu Alpha-Video (Safari/Chrome uneins).

**Vorgerendert (Remotion):**
- Speed-Ramps, Rückwärts, exakte Stotter (Seek im Browser ist langsam und ungenau).
- Echtes Datamosh, Gilliam-Ausschnitt-Animation, Split-Screen-Choreografie, Masken-Collagen.
- Ton-gebundene J/L-Cuts mit Bild.

**Empfohlener Split:**
- Remotion rendert **Module**: 1–2 Takte lang (2–8 s), mit 4–6 sauberen Frames Vor- und Nachlauf (Handles), gleiche BPM, gleiche Auflösung.
- Live-Engine reiht Module + Roh-Clips im Beat-Raster, setzt Übergänge, Look und Schrift. So bleibt jede Runde neu, die teuren Effekte sind fertig.

**Leistung:**
- Pro Szene max. 2 laufende Video-Decoder (A/B), mobil 1. Mehr ruckelt erfahrungsgemäß.
- **Ein gemeinsamer Sender** für alle nahen Tafeln: ein Video-Element, alle Tafeln zeigen dasselbe Programm. Passt auch erzählerisch (überall dieselbe Sendung).
- 480p (854×480) oder 640×360, H.264, 25 fps, GOP 1 s (schnelleres Springen). Niedrige Auflösung ist Absicht, kein Kompromiss.
- `requestVideoFrameCallback`: Textur nur bei neuem Frame hochladen. iOS: `muted` + `playsinline`.
- Budget aus R2 gilt: ≤ 1 ms je Bild für alle Tafeln, nah live mit 15 Bilder/s, fern eingefroren. Video-Upload nur für die nahe Tafel.

## 4 · Look: Lo-Fi-Collage auf harter KFB-Form
Grundregel: **Dreck innen, Kante außen.** Video und Archiv dürfen kaputt sein. KFB-Formen, Rahmen und Schrift bleiben scharf, in voller Auflösung über dem 480p-Bild.

| Preset | Einsatz | Werte |
|---|---|---|
| **P1 Sendeschluss** (CRT) | Anchor, Grundton | Scanlines 2 px Periode, 25–30 % Deckkraft. Chroma-Versatz R/B 1–1,5 px. Vignette 0,3. Rauschen 0,04. Flimmern 2 %. Leichte Wölbung 0,03. |
| **P2 Zeitungsdruck** (Halftone) | Archiv, Freeze | Rasterpunkt 6 px bei 480p, 45°. Zwei Farben (KFB-Tinte + Papier). Papiertextur multiplizieren 0,6. Passer-Versatz 1–2 px. |
| **P3 Ausschnitt** (Gilliam) | Collage, Kommentar | Clip in harte KFB-Form maskiert (Kreis, Pfeil, Tafel). Weißer Papierrand 3 px. Schatten 4 px Versatz, keine Unschärfe. Ausschnitt auf 2ern (12 Bilder/s), Hintergrund 25. |
| **P4 Archiv-Riss** (Curtis) | Halte-Shots | Entsättigung 80 %. Schwarz zudrücken. Korn 0,08. Bildstand-Wackeln 0,5 px. Leichte Tönung. Caption weiß, schlichte Grotesk, hart an. |
| **P5 Störung** (Übergang) | Abschnittswechsel | 6–10 f. Pixelblock 8 → 32 px. RGB-Split 4–12 px. Posterisierung 6 Stufen. Dann harter Schnitt in sauberes Bild. |

Mischregel: pro Shot ein Preset, Wechsel nur am Schnitt. Max. 2 Presets pro Abschnitt.

## 5 · JSON-Vorschlag
**(a) Clip-Tag** (erweitert `kfb.hypernorm-clips/1` um ein Feld `tags`):
```json
{
  "id": "bnwn01_014", "file": "clips/bnwn01_014.mp4", "seconds": 7.86, "fps": 25,
  "tags": {
    "kind": "anchor", "framing": "MCU", "gaze": "camera",
    "motion": { "amount": 0.15, "dir": "none" },
    "energy": 0.3, "luma": 0.46, "colors": ["#2b3a55", "#d9c7a0"],
    "focus": [0.5, 0.38],
    "text_safe": [[0.04, 0.72, 0.92, 0.22]],
    "speech": { "voice": true, "sentence_end": true, "tail_silence_s": 0.35,
                "words": [{ "w": "freedom", "t": 2.10, "d": 0.42 }] },
    "ctx": ["POLITICAL"], "mood": "deadpan",
    "usable": [[0.0, 7.5]], "loopable": false
  }
}
```
**(b) Rezept** (Engine und Remotion lesen dasselbe):
```json
{
  "schema": "kfb.hypernorm-recipe/1", "id": "bnwn_test_a", "seed": 4711,
  "mode": "generative",
  "out": { "fps": 25, "size": [854, 480], "aspect": 1.79 },
  "music": { "bpm": 125, "bar": 4, "offset_s": 0.0,
             "sections": [ { "name": "intro", "bars": 4, "energy": 0.2 },
                           { "name": "verse", "bars": 8, "energy": 0.5 },
                           { "name": "chorus", "bars": 8, "energy": 0.9 } ] },
  "pool": { "manifest": "60_VIDEO/hypernorm_bnwn_r1/manifest.json",
            "filter": { "ctx": ["POLITICAL"] } },
  "rhythm": { "patterns": [[8,5,3],[4,4,2,2],[2,1,1,4],[16]], "min_beats": 1, "max_beats": 16 },
  "grammar": {
    "weights": { "cut": 5, "jcut": 3, "match": 2, "jump": 2, "stutter": 1,
                 "freeze": 1, "glitch": 1, "text_punch": 2, "pip": 1 },
    "rules": { "no_repeat_transition": true, "fx_gap_cuts": 4, "clip_cooldown": 12,
               "max_luma_jumps_s": 3, "hold_per_16_bars": 1,
               "surprise_budget": { "per_bars": 8, "points": 3, "chorus": 5, "intro": 1 } }
  },
  "look": { "default": "P1", "by_section": { "chorus": "P5", "verse": "P2" } },
  "text": { "source": "kfb-quote-sequence", "max_words_per_beat": 2, "min_frames_per_word": 6 },
  "edl": [
    { "beat": 0, "beats": 8, "clip": "bnwn01_001", "in_s": 0.0, "speed": 1,
      "trans": { "type": "cut", "pre_f": 1 }, "audio": { "lead_f": 0 },
      "look": "P4", "text": null, "fx": [] },
    { "beat": 8, "beats": 5, "clip": "bnwn01_014", "in_s": 1.2, "speed": 1,
      "trans": { "type": "jcut" }, "audio": { "lead_f": 8 }, "look": "P1",
      "text": { "words": ["FREEDOM"], "at_beat": 1, "zone": 0 }, "fx": [] }
  ]
}
```
- `mode: "generative"`: `edl` leer, Engine füllt live nach Regeln.
- `mode: "frozen"`: `edl` voll, Remotion rendert genau das. Eine live erzeugte EDL lässt sich speichern und einfrieren (gleicher Seed = gleiches Ergebnis).
- Prüfer (`edl_check`): rechnet alle Regeln aus 2.3/2.4 nach. Ohne PASS kein Render.

---

## Empfehlung für KFB
- Kein neues System: Schnitt-Grammatik als Schicht in `kfb-hypernorm` (H13-Logik, `simScore`, CTX). `kfb-quote-sequence` liefert nur die Textreihenfolge.
- Rezept-JSON (5b) als einzige Schnittstelle zwischen Engine und Remotion. Plus `edl_check` als mechanisches Tor.
- BPM an fps binden: 25 fps + 125 BPM (12 f/Beat) als Standard.
- Remotion rendert nur Module mit Zeit-Verbiegung (Stotter, Ramp, Datamosh, Gilliam), 1–2 Takte, mit Handles.
- Live: ein Sender-Video für alle nahen Tafeln, A/B-Deck, 480p, Look-Presets P1–P5 als Shader, Schrift scharf obendrauf.
- Wechsel Hacken ↔ Halten bewusst planen: mindestens ein Curtis-Halte-Shot pro 16 Takte.
- **Erster Test mit den 69 BNWN-Clips:**
  1. Tags automatisch: Helligkeit, Farbe, Bewegung, Transkript mit Wortzeiten. Stimmung und Fokus 10 Minuten von Hand.
  2. Ein Musikbett mit 125 BPM, 60 s (≈ 31 Takte: Intro 4, Strophe 8, Refrain 8, Break 4, Refrain 7).
  3. Zwei Modi: **Sinn** (nur Satzenden, J-Cuts, Halten) und **Collage** (Wortgrenzen, Stotter auf Schlüsselwörter, Text-Punch).
  4. Je Modus 3 Seeds als `frozen`-Rezept in Remotion rendern, dieselben Rezepte live auf einer Probe-Tafel abspielen.
  5. Kontaktbogen (1 Bild pro Shot) + Zählung: verschiedene Übergänge, mittlere Shot-Länge, Wiederholungen. Direkter Vergleich mit dem alten Remotion-Versuch.
  6. Georg urteilt an der Tafel im Spiel, nicht an Zahlen.
- Danach erst Archiv-Material und Karten-Texte als zweite und dritte Spur dazumischen.

## Offene Punkte
- R2-Brief sagte „keine Video-Clips“, V-721 bringt die BNWN-Clips. Klären: Video als eigene Spur in `kfb-hypernorm` oder getrennte Tafel-Inhaltsart?
- `surfaceContent.js` ist Canvas2D. Shader-Looks (P1–P5, gl-transitions) brauchen WebGL. Entweder Tafel als Three.js-Rendertarget oder Looks vereinfacht in Canvas2D.
- Musik: Woher kommt das Beat-Raster auf den Tafeln? Spielmusik, eigenes Bett oder nur Sprecherin (dann Raster aus Sprechpausen)?
- Ton: Ist die Anchor-Stimme im Spiel hörbar (räumlich)? Davon hängen J/L-Cuts live ab.
- 1-ms-Budget mit Video-Upload real messen (nahe Tafel, 480p, 15 Bilder/s).
- Wer taggt dauerhaft: Skript bei WS-Media oder Teil der Clip-Pipeline (`manifest.json` → `tags`)?

**Quellen (Auswahl):**
- Curtis: [Hyperallergic-Interview](https://hyperallergic.com/365444/documentary-reporting-has-become-so-rigid-adam-curtis-on-storytelling-today/), [Flow Journal zu Bitter Lake](https://www.flowjournal.org/2015/03/adam-curtis%e2%80%99-bitter-lake/), [Slant](https://www.slantmagazine.com/film/like-halfforgotten-dreams-adam-curtis-and-the-fragments-of-history/), [UCL Baker](https://discovery.ucl.ac.uk/id/eprint/10208427/3/Baker_vc-7-4.pdf).
- Musikvideo: [Adobe Musikvideo-Schnitt](https://www.adobe.com/learn/premiere-pro/web/edit-music-video), [Shot-Länge Videoclip (Doxa 2017)](https://repositorioinstitucional.ceu.es/bitstream/10637/8769/1/Edicion_JPPerez$JRodriguez_Doxa_2017.pdf), [Gilliam Cut-out (Make)](https://makezine.com/article/craft/how-to_cut-out_animation_with/).
- Werkzeuge: [editly](https://mifi.no/blog/editly-slick-declarative-command-line-video-editing/), [gl-transitions](https://npmjs.com/package/gl-transitions), [Remotion Transitions](https://remotion.dev/docs/transitions/transitionseries), [ffmpeg xfade](https://ottverse.com/crossfade-between-videos-ffmpeg-xfade-filter/), [MoviePy](https://moviepy.readthedocs.io), [librosa beat_track](https://librosa.org/doc/main/generated/librosa.beat.beat_track.html), [Essentia Beat](https://essentia.upf.edu/tutorial_rhythm_beatdetection.html), [@audio/beat](https://github.com/audiojs/beat), [BEAT-Paper](https://arxiv.org/pdf/2605.27067).
- Browser: [Codrops Datamosh Three.js](https://tympanus.net/codrops/2026/09/02/breaking-the-frame-building-a-real-time-datamosh-effect-with-three-js/), [three.js VideoTexture](https://threejs.org/docs/pages/VideoTexture.html), [PlayCanvas Mehrfach-Video](https://forum.playcanvas.com/t/solved-several-videos-rendering/4791).
