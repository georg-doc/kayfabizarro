# SPEC · KFB ChatterBox Studio · Komponenten, Responsiv, Timing, Donors

Status: PROPOSAL / Preview-Grammatik. Kein CURRENT_TOOL-Anspruch, keine Runtime-Wahrheit.

## 1 · Leitregel

> Clay shell außen, comic ink innen. Die **Form** trägt Modus und Lautstärke, die **Schrift** nur Betonung `*x*`, Pause `…`, Abbruch `--` (SPEC_lettering §1–3).

Schichten je Blase (unten → oben): Rand-Variante → Papier (15 % Sprecherfarbe) → Halbton-Ecke (Maske) → Ink-Feder `#1f1a14`.

| Variante | Rand | Einsatz |
|---|---|---|
| Clay pur (v0.2) | keine Ink-Linie; Lehmband 9 px + Unterseite 4 px + Lichtkante; Ecken gerundet (r ≤ 14 px); Zipfel spitz, ≈ 2/3 (Fuß 12, Länge 12–23 px) | reiner Knet-Look |
| Clay (Default) | Lehmband 10 px in Sprecherfarbe 40 %, Schatten 1,6/3 px, Lichtkante, stabiles Rauschen (feTurbulence, fester Seed) | KFB-Look |
| Ink | kein Lehm, Drop-Shadow 2/3 px | Kanon v10/v13, Vergleich |
| Slab | dunkle Unterseite 7 px + schmaler Lehm 6 px | nah an Combat-Karten |

### 2 · Konstruktionsmodell (v0.4, gilt)

**Zuordnung vor Geschichte.** Jede Blase sitzt in der Spalte ihres Sprechers (Breite ≤ 1,8 × Abstand zum Nachbarn), mittig über dem Kopfanker, Abstand = Zipfellänge. Kein Platz oben → neben den Kopf, Zipfel aus der Seitenkante. Die neueste Zeile gewinnt ihren Platz; ältere Zeilen, deren Fläche oder Zipfelzone kollidiert, treten ab. Choices weichen allen Blasen und Gesichtern aus.

**Ein Rahmen.** Körper = Silhouette + Wand. Clay: eine Ink-Kontur auf der Silhouette, Wand ohne Linie. Clay pur: keine Kontur. Volumen nur aus massiver Wand (unten rechts, Licht oben links), weichem Kontaktschatten und sanftem Flächenverlauf. Keine Bevel-/Emboss-Filter, keine Zusatzränder.

### 2-alt · Register-Tabelle

| Kind | Form | Tail | Schrift | Z/Zeile · Zeilen | Ink |
|---|---|---|---|---|---|
| speech | jittriges Rechteck ±1,3 px | Pfeil, Fuß 32–68 %, 14–34 px | Shantell 1,0 | 28 · 3 | 2,4 |
| thought | Scallop-Wolke | 3 Punkte, aus Wolkengröße, seitlich versetzt | Shantell 1,0 | 28 · 3 | 2,2 |
| whisper | Rechteck, gestrichelt | Pfeil | Shantell 0,85, Schrift `#5a4f44` | 28 · 3 | 2,0 |
| shout | Kranz (Superellipse n=3, 12–18 Zacken, 2 × 1,45, 1 nach innen) | Zacke zum Kopf | Bangers 1,35 | 21 · 3 | 3,6 |
| caption | Rechteck ohne Tail, ocker | – (Bildrand oben links) | Shantell 0,92 | 34 · 4 | 2,2 |
| kayfabulate | Rechteck, stärkerer Jitter, roter Irish-Grover-Reiter | – | Shantell 1,0 | 34 · 4 | 2,8 |
| choice | Rechteck mit Antwortzeilen ≥ 44 px, Taste in Tonfarbe | Pfeil zum Player | Shantell 0,95 | frei · 2 je Zeile | 2,4 |
| ambient | kleines Rechteck, kein Lehm | kurzer Pfeil ≤ 24 px | Shantell 0,82 | 24 · 2 | 1,6 |

Überlauf: Teilung an der Satzgrenze in zwei Blasen (erste endet `…`, zweite beginnt `…`, §5b); ohne Satzgrenze → „zu lang · kürzen“.

### 2a · Zipfel-Regeln (v0.3)

T1 Kante nach Lage des Ankers: darunter → Unterkante, darüber → Oberkante, auf Höhe → Seitenkante. T2 Fuß = Projektion des Ankers, geklemmt auf 32–68 %. T3 Richtung ≤ 50° zur Kantennormalen. T4 Länge Rede 14–24 px, Clay pur 10–16, Ruf ≤ 26 (Fuß 18 wie Rede), Ambient ≤ 18; Abstand Blase→Kopf = Zipfellänge. Platzierung: über dem Kopf (5 Lagen) → daneben → um belegte Blasen → schmaler umbrechen → erst dann stapeln.

**Licht-/Formregel (global):** Licht oben links. Dicke (Extrusion) und Schlagschatten liegen unten rechts, Fase/Lichtkante oben links — Blasen, Wörter, Choices, Buchstaben-Extrusion. Eine Kontur, keine Doppelränder, keine Rauschfilter.

### 2a-alt · Zipfel-Regeln (v0.2, ersetzt)

R1 Die Blase deckt ihren Anker nie zu (Abstand ≥ Gap → Zipfel ≥ 18 px sichtbar). R2 Kein Platz oben → neben den Kopf, Zipfel aus der Seitenkante. R3 Nie auf den Kopf klemmen. R4 Erst über belegter Blase stapeln, dann seitlich. R5 Alles bleibt in der Bühne. Choice-Blase ohne freien Platz → unten andocken, aber neben dem Player (nie über dem Anker). Zweitrangiger Schutz: keine Blase über fremden Gesichtern, solange es einen freien Kandidaten gibt; Seitenkandidaten auch unter/über belegten Blasen. Ruf-Zipfel hat denselben Fuß wie Rede (18 px, Schultern 55 %). Randlinien mit Miter-Ecken, damit Spitzen spitz bleiben.

### 2b · Gedanken-Spur (v0.2)

Drei getrennte Bläschen, die vom Kopf zur Wolke **wachsen** (klein → groß, 0,4 / 0,64 / 1,0 × R0, R0 = 20 % der Blasenhöhe, 7–13 px), mit Lücke ≥ Randbreite, beginnend außerhalb der Scallop-Wölbung, auf leichtem Bogen. Kreise im selben Drehsinn wie die Wolke (keine Löcher durch nonzero).

## 3 · Interaktive Choices (Monkey-Island-Grammatik)

NPC-Zeile streamt → bedienbare Blase öffnet am Player → Hover hebt die Zeile (−2 px, harter Schatten) → Auswahl stempelt (scale 1,03, Tonfarbe), Rest fällt (Opacity 0,15, +6 px) → nach 320 ms wird die Wahl zur Player-Sprechblase → NPC-Reaktion (Blase und/oder ein Comic-Wort).
Töne: neugierig · höflich · frech · absurd · philosophisch · aggressiv · schweigen/gehen. Tastatur 1–4, Fokus-Ring 3 px. Die bedienbare Blase steht bis zur Auswahl (ANTWORT v2 §2).

## 4 · Comic-Wörter (VFX-Objekte)

| Klasse | Form | Platz | Ein · Halten · Ab (ms) | Farbe | SFX |
|---|---|---|---|---|---|
| Impact | Kranz + Innenstern, Halbton | Kontakt, nie über Gesicht | 110 · 520 · 200 | Gelb auf Rot, rote Extrusion | thump |
| Movement | Speed-Streaks, kein Burst | entlang der Bahn | 120 · 420 · 180 | Mint, grüne Extrusion | whoosh |
| Reaction | Papierwolke + Nachpuff | neben reagierendem Kopf | 140 · 600 · 220 | Pink auf Weiß | boing |
| Reward/Meta | Abzeichen + Strahlen, Bogen-Lettering | Bildfläche oben Mitte | 140 · 650 · 260 | Gold auf Violett | chime |

Regeln (Ref 75/77): ein lesbares Wort zur Zeit, neues Wort schneidet altes (120 ms Fade). Platzkandidaten; Ablehnung bei Überlappung mit Gesicht, Blase, Bühnenrand → Wort entfällt. Äußerer Wrapper = Position, innerer Wrapper = Animation. Seed pro Wort stabil. Impact = einzige Kameraaktion (Stoß 170 ms) + Rückstoß des Getroffenen.

## 5 · Responsiv

| Bühnenbreite | Seitenverhältnis | Grundschrift | Blase max | Rand | Choices |
|---|---|---|---|---|---|
| < 560 px | 1 : 1,12 | 14 px | 72 % | 10 px | Bottom-Sheet, volle Breite |
| 560–899 px | 16 : 10 | 15 px | 50 % | 14 px | Blase am Player |
| ≥ 900 px | 16 : 9 | 16 px | 38 % (Kanon) | 18 px | Blase am Player |

Seiten-Breakpoints: < 640 Mobile (Panel unter der Bühne, Ziele 44 px) · 640–1023 Tablet · ≥ 1024 Desktop (Panel rechts 340 px). Schriftboden 11 px.
Kollision: Kandidaten mittig/links/rechts über dem Kopf → über belegter Blase stapeln → seitlich ausweichen → in der Bühne klemmen. Der Zipfel zielt immer auf den Kopfanker, die Blase wird geklemmt.

## 6 · Streaming / TTS-Nähe

Geometrie vor Streaming: Kontur einmal aus dem vollen Text, ungezeigte Zeichen stehen unsichtbar im Satz → kein Reflow, kein Zipfelwandern.

| Preset | Reveal | Zeitbasis |
|---|---|---|
| instant | alles bei 0 | Standzeit = Lesezeit |
| typewriter | Zeichen | 34 cps (v13), +120 Komma, +280 Satzende, +360 Ellipse |
| chunked | Phrase ganz | Phrasen ≤ 5 Wörter oder bis Satzzeichen; Dauer = Silben × 60 000/WPM ÷ 1,5 |
| tts-follow | Wort, 140 ms vor der Stimme | wie chunked, Phrasen ≤ 4, Betonung × 1,25, Chunk + Wort markiert |

Pausen: Komma 170 · Doppelpunkt/Semikolon 240 · Satzende 380 · Ellipse 520 · Abbruch 160 ms. Lesezeit danach: 800 + 42 × n ms, Deckel 5000, Abgang 220, min 1200 (v13 TIME). Browser-Stimme: jede `boundary`-Wortgrenze setzt die Uhr neu (`t0 = now − voiceStart(word)`).

## 7 · Datenverträge (Deskriptoren)

- `kfb.dialogue-presentation.v1`: speaker · bubbleKind · text · emphasis[] · choices[{id,key,tone,text}] · reactionBeat[] · timingProfile · streamMode · anchorMode · layout · `presentationOnly: true`.
- `kfb.comic-word.v1`: event · word · class · inkPreset · placementPreset · motionPreset · duration{enter,hold,exit,total} · priority · rules · sfxCue.
- `kfb.emote-overlay.v1` (optional): symbol · glyph · class · anchor · motion · durationMs (Pottymouth-Schlüssel aus `chatter-2d.js`).

## 8 · Donor-Mapping

| Donor | Dimension übernommen | Nicht übernommen |
|---|---|---|
| `overworld/overworld/bubble-ts.js` | rectPath, Kanon-Zahlen, eine bedienbare Blase, Geometrie vor Streaming | v10-CPS 55, Canon-Feder-Aufruf (leer) |
| `PetStudio/bubble/bubble.v1.js` | Papier-Tönung, tintMix, Farbcode statt Name | three.js-Anker |
| v13 `bubble-layout.js` | KINDS, LIMITS, TIME, parse, ausgeglichener Umbruch, Satzteilung | Canvas-Ink-Ebene (Host-spezifisch) |
| `SPEC_lettering` | drei Zeichen, Betonungsdeckel, Normalisierung | – |
| `ABGLEICH_bubbles` | Kranz-Mittelweg, Denkpunkte, Mindestpolster | Debug-Schalter auf der Bühne |
| `chatter-2d.js` | Ambient-Tonzeilen, Grawlix/Emote-Schlüssel | Quellwahl-Logik (bleibt Inhalt-Owner) |
| Ref 75/77 | Wort-Timing, ein Wort, Platzkandidaten, Transform-Trennung | – |
| Moodboard (Etsy-Sammelblatt) | nur Präsentationsrichtung: Bursts, Wolken, Extrusion, Halbton | keine Formen, Wörter oder Farben 1:1 |
| KayKit Mystery Artworks | Freisteller als Placement-Fixtures | keine neue Character-Produktion |

## 9 · Offen / deferred

1. Gedankenpunkte atmen (v10-S12) — Preview statisch.
2. Flüstern: echte Kanon-Feder statt Dash (Bitte an Ink-Owner, ABGLEICH §5).
3. Kopfanker je Figur aus Rig-Daten statt gesetzter Bruchwerte (ABGLEICH Lücke #3).
4. Live-Lizenz PottyMouth BB offen → Emote-Fallback bleibt Grawlix.
5. Hausform Rechteck vs. Rundform (ABGLEICH Lücke #1) — weiterhin Georgs Entscheidung; Studio zeigt Rechteck.
