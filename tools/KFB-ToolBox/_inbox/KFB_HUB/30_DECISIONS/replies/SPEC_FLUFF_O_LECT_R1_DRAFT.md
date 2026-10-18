# SPEC · Fluff-o-lect R1 (ENTWURF) · Melodie, Dekodierung, Sprechblasen-Stufen

Stand: 18.10.2026 · Für: Georg (Creative Lead) · Status: **Entwurf zur Freigabe, noch nicht verbindlich**
Bezug: V-486, V-492, V-497, V-498, V-500, V-501, V-505, V-506 (aktuell gültig: V-506 inkl. R9.1) · Probe `40_AUDIO/kfb_language_r1/probe_r9.html` (R9.2)

**Kennzeichnung**

- **[B]** belegt: in der Quelle, im Register oder im Probe-Code nachgesehen (Fundstelle steht dabei).
- **[E]** Einschätzung oder Folgerung von WS0.
- **Δ** = Vorschlag, der die von Georg freigegebene Melodie oder Dekodierung (V-492, V-497/V-498, V-500, V-506) **ändern** würde. Δ-Punkte sind **keine Regeln**, sondern Entscheidungsvorlagen.

**Quellen-Kürzel**

| Kürzel | Quelle |
|---|---|
| **G-A** | Georgs Google-Doc, Tab „Forschungsbericht: Fluff-Linguistik, (De)Kodierung und Sprachmelodie in Aural-Visual-Interfaces“ |
| **G-B** | Georgs Doc, Tab „RESEARCH_FLUFF_LINGUISTICS_R1“ (Doc-Fassung; **nicht identisch** mit unserer gleichnamigen Datei, siehe §1.2) |
| **G-C** | Georgs Doc, Tab „KFB Fluff-o-lect: Browser-Sprachmelodien — Design R1“ |
| **G-D** | Georgs Doc, Tab „KFB Wortmotive — Kernbegriffe v1“ (Begleittext zur Perplexity-Tabelle) |
| **PX** | Perplexity-Daten `kfb_word_motifs_v1.json` / `.csv` (40 Einträge) |
| **RS** | Unsere Recherche `replies/RESEARCH_FLUFF_LINGUISTICS_R1.md` (WS0, §8–§10) |
| **REG** | Register `build_decisions.py`, Einträge V-486 … V-506 |
| **P9** | Probe R9.2, Funktionen `plan`, `play`, `VOICE`, `SCALES`, `EMO`, `fluffify`, `stageOf`, `fitCoded`, `FLOW`, `IRR_PAST`, `ADJ_Y` |

---

## 1 · Quellen und Status

### 1.1 Lesbarkeit von Georgs Doc

- [B] Das Doc wurde über den Drive-Connector vollständig abgerufen (≈ 247 000 Zeichen, 3 108 Zeilen im Text-Export). Der Abruf war zu groß für eine Direktantwort und wurde als Datei gespeichert und abschnittsweise gelesen.
- [B] Gefundene Tabs (Überschriften erster Ebene, in Reihenfolge):
  1. KFB Modular Storytelling Research: Openers, Fourth-Wall Sockets & Bridge-Free Beats — *alt, übersprungen*
  2. The Architecture of Stand-Up Comedy — *alt, übersprungen*
  3. Opener-Architekturen für absurd Storytelling — *alt, übersprungen*
  4. Algorithmic Strategies — *alt, übersprungen*
  5. Audio Narrative & Custom Dialogue Manual — *alt, übersprungen*
  6. **G-A** Forschungsbericht: Fluff-Linguistik … — *neu, gelesen*
  7. **G-B** RESEARCH_FLUFF_LINGUISTICS_R1 — *neu, gelesen*
  8. **G-C** KFB Fluff-o-lect: Browser-Sprachmelodien — Design R1 — *neu, gelesen*
  9. **G-D** KFB Wortmotive — Kernbegriffe v1 — *neu, gelesen*
- [B] Der letzte Tab endet mit dem Abschnitt „Nächster Schritt“ (3 Punkte). Ein Abbruch ist nicht erkennbar. [E] Ob Bilder, Kommentare oder Vorschläge im Doc stehen, zeigt der Text-Export nicht. Kommentare wurden nicht abgefragt.
- [E] Die vier neuen Tabs sind erkennbar KI-Recherche-Ausgaben: G-A mit „[cite: n]“-Markern, G-B und G-C mit Link-Zitaten, G-D beschreibt die Erzeugung der PX-Dateien („Ich habe … erzeugt: output/kfb_word_motifs_v1.json“). Sie sind also **Input**, keine Entscheidungen von Georg.

### 1.2 Was jede Quelle beiträgt

| Quelle | Beitrag | Belastbarkeit [E] |
|---|---|---|
| **G-A** | Zehn Kernbefunde; konkrete Interpunktions-Werte (Komma +2 HT, Frage +5 HT, Punkt −4 HT); Pflicht zu 2–3 Formantfiltern; exakte Breiten-Isomorphie der Glyphen; Farbcodierung der Stufen; Mund = Hüllkurvenfolger; 4 offene Fragen | Mittel. Viele Aussagen ohne Primärquelle (z. B. Tone.js „< 10 ms, < 50 KB“), einige widersprechen RS (s. §1.3) |
| **G-B** | Zweite Recherche-Fassung mit sauberer Trennung belegt/nicht belegt; Dekodier-Stufen 0–3 als Fortschritt je Card/Deck; Einführungsregeln (≥ 3 Begegnungen je neuem Wort, erste 5–10 Wörter in sicherem Kontext); Glyphen grob statt exakt längengebunden; 10 Fragen | Gut bei Quellenlage; die Stufenlogik ist in sich unscharf |
| **G-C** | Komplettes Klangmodell (Signalfluss, Wortarten-Familien, Prosodie-Tabelle, 6 Stimmen-Archetypen, 8 Emotionen, Mund-Parameter open/wide/round, Datenmodell Word Motif / Resident Voice / Performance Line, Pseudocode `planMelody`, MVP) | Gutes Gerüst. Werte sind ausdrücklich „Beispielwerte, keine Kanon-Töne“ |
| **G-D** | Regeln zu PX: Moll-Pentatonik C-Eb-F-G-Bb ab MIDI 60, 7 Motiv-Formen (tiny/arc/fall/rise/spike/hover/title), Titel-Leitmotive als Startentwürfe, Fluff-Familie „hörbar verwandt“ | Gute Idee; die Daten erfüllen die eigenen Regeln nur teilweise (s. §5) |
| **PX** | 40 Einträge: 8 Funktionswörter, 15 Welt-Begriffe, 6 Meta-Begriffe, 7 Fluff-Formen, 4 Card-Titel. Felder: wordId, canonicalText, wordClass, protected, decodeTier, motifShape, motifMidi, motif, durationsSec, accentIndex, seed | [B] Daten geprüft. Tonumfang nur MIDI 60–70 (eine Oktave). Brauchbar als Startformat, nicht als fertige Tabelle |
| **RS** | Belegte Referenzen (Clangers, Peanuts, Celeste, ToBI, Fujisaki, Gussenhoven, Juslin & Laukka, Sailer & Dörner, Walker, Blambot-Lizenz); Code-Befunde zur Probe; 20 priorisierte Maßnahmen (§8), Vermeiden-Liste (§9), 10 Fragen (§10) | Hoch bei [B]-Aussagen. Einige Code-Befunde sind inzwischen in R9.1/R9.2 erledigt (s. unten) |
| **REG** | Verbindlicher Stand: melodisch statt sprachlich (V-492), tiefere Stimmen, ein Ton je Wort, Ende mit letztem Wort (V-497), Satzmelodie (V-498), R4 PASS + drei Stufen je Wort (V-500), SSOT-Modul kfb-bubbles.v1 (V-501), Tinte/PAPER + Satzfluss lesbar (V-505), Schlumpf-Lexikon + 1–3 Glyphen + strikte Stufenfolge (V-506) | Bindend |
| **P9** | Laufende Referenz-Implementierung (Web Audio roh) | [B] Code gelesen |

**Namensdopplung [B]:** Der Doc-Tab „RESEARCH_FLUFF_LINGUISTICS_R1“ (G-B) und unsere Datei `replies/RESEARCH_FLUFF_LINGUISTICS_R1.md` (RS) haben denselben Namen, sind aber **verschiedene Texte** (andere Gliederung, andere Quellen, andere Fragen). In diesem Spec immer G-B bzw. RS sagen.

**Was aus RS schon in P9 erledigt ist [B]:**

- Kontraktionen (doesn't, it's …) stehen in `FLOW` und bleiben lesbar (RS §8 Nr. 2).
- Possessiv wird zu „fluff's“ bzw. „Fluff's“ (RS §8 Nr. 2; V-506 R9.1).
- `fitCoded` seedet Glyphen mit dem bereinigten Wort `h32(clean(core))` (RS §8 Nr. 3). Die alte Hilfsfunktion `glyph()` seedet noch mit Satzzeichen, wird aber nicht mehr aufgerufen.
- Zahlen bleiben lesbar (`stageOf`: `/\d/` → Stufe 2) (RS §8 Nr. 15).

**Was in P9 noch offen ist [B]:**

- `stageOf` nutzt weiterhin `h32(wort)%100` gegen den Regler. Welche Wörter zuerst aufgehen, ist zufällig (RS §8 Nr. 4).
- Jede `?`-Zeile steigt, auch W-Fragen (RS §8 Nr. 1).
- Das Wort-Motiv ist `Math.round(r()*2-1)`, also −1/0/+1 Halbton vor dem Rastern auf die Tonleiter. [E] Nach `snap()` fällt es oft auf denselben Ton. „Gleiches Wort = gleiches Motiv“ ist damit kaum hörbar (RS §8 Nr. 10).
- `EMO.leap` ist definiert, wird aber nirgends gelesen. Ein Regler für den Ausschlag (Heat) fehlt (RS §8 Nr. 8).
- **Neu gefunden:** Die Melodie nutzt `FUNCW` als Funktionswort-Liste, die Blase `FLOW`. Beide Listen unterscheiden sich: „because“, „until“, „when“, Hilfsverben und Kontraktionen sind in der Blase immer lesbar, klingen in der Melodie aber wie betonte Inhaltswörter. [E] Das verletzt den Geist von V-498 (Funktionswörter tief und kurz).
- **Neu gefunden:** Die Wortart rät `fluffify` nur aus Endungen. Beispiele (aus dem Code abgeleitet): „again“ → fluff (statt Adverb), „Rumpelstiltskin:“ → Fluff:, „Aladdin“ → Fluff, „bloodbath.“ → fluff. Für Eigennamen und Komposita gibt es keine Regel.

### 1.3 Widersprüche zwischen den Quellen

| # | Thema | Widerspruch | Fundstellen |
|---|---|---|---|
| W1 | **Tonleiter** | PX/G-D/G-C: eine feste Moll-Pentatonik für alles, Emotion nur über Transposition/Tempo/Dynamik. Register und Probe: Tonleiter **je Stimmung** (calm/excited Dur-Pentatonik, debate Moll-Pentatonik, doubt eigene Skala). G-C legt die Skala zusätzlich **pro Stimme** fest (`"scale"` im Voice-JSON) | V-492 „Tonleiter der Stimmung“; P9 `SCALES`; G-D „Grundprinzip“; G-C §4 |
| W2 | **Töne je Wort** | PX/G-C/G-D: 1–5 bzw. 2–6 Noten je Wort. Register: „ein Ton je Wort aus der Wortlänge“ (R3), Basis des R4-PASS. P9: 1 Ton, bei Inhaltswörtern > 7 Buchstaben 2 Töne | V-497; V-500; P9 `plan` |
| W3 | **Absolute Lage** | PX: absolute MIDI 60–70 (C4–Bb4). Register: R2 war „zu hoch und nervig“, Stimmen wurden tiefer. P9-Grundtöne: Hunky 73,4 Hz, FrizzleBob 110 Hz, Dory 220 Hz, alle unter C4 (261,6 Hz). G-C-Beispiele reichen bis A2/D3, sind also nicht in der PX-Skala | V-497; P9 `VOICE`; G-C §2 |
| W4 | **Unbekannte Wörter** | G-C §8: „generiertes Platzhalter-Motiv, das erst nach Dekodierung zum festen Motiv wird“; ebenso G-C §10 Nr. 7 und G-D. Dagegen G-C §2: „gleiches Motiv, unabhängig davon, ob es als cookie, fluff oder Glyphe dargestellt wird“. Register: „jedes Wort = festes Motiv (Kodierung)“ | V-492; G-C intern widersprüchlich |
| W5 | **Funktionswörter im Klang** | G-D: „TINY = eine kurze, tiefe Note“. PX-Daten: the/a = 63, and = 67, you/until = 70 (Bb4), also mitten bzw. oben im Umfang und höher als der Start von „cookie“ (60) | PX; V-498 „Funktionswörter tief und kurz“ |
| W6 | **Fluff-Familie im Klang** | G-D: Fluff-Formen teilen ein Grundmotiv mit eigener Endung. PX-Daten: fluff [63,65,63], fluffs [65,67,65], fluffed [60,65,70], fluffery [70,65,63] … kein gemeinsames Grundmotiv. [E] Zudem gehört das Motiv nach W4/V-492 zum **Original**wort, nicht zum angezeigten Fluff-Wort | PX; G-D „Fluff-Familie“ |
| W7 | **Drei verschiedene „cookie“-Motive** | G-C: C4-E4-G4 (Dur-Töne, accent 2). G-D-Beispiel: C4-F4-C4 (accentIndex 1). PX-Datei: C4-Bb4-C4 (accentIndex 1) | G-C §2/§7; G-D; PX |
| W8 | **Motiv-Form nach Wortart** | G-D: Form folgt der Wortart. PX: „card“ und „player“ sind NOUN, aber `tiny`; „remain“ ist VERB, aber `fall`; „expectation“ ist NOUN, aber `rise`. [E] Die Form folgt teils der **Bedeutung** (Verlust = fall, Alarm = spike), nicht der Wortart | PX; G-D |
| W9 | **Stufen-Modell** | G-A: 3 Stufen je **Wort** (0 Glyphen, 1 Fluff, 2 Klartext) = Register V-500/V-506. G-B: 4 Stufen 0–3 als **Fortschritt** je Card/Deck; Stufe 0 zeigt Glyphen **und** Fluff-Wörter. PX: `decodeTier` 0–3 **je Wort** (Funktionswörter 0, Meta 1, Welt-Begriffe 2, Fluff-Formen 3, Titel 2). Drei verschiedene Bedeutungen derselben Zahl | V-500; V-506; G-A §6; G-B §6; PX |
| W10 | **Card-Titel** | G-B §4: Titel „bleiben in Stufe 2 zunächst lesbar … The Fluff of Fluffery erst in Stufe 3“ (in sich unklar). PX/G-C: Titel `protected`. RS: Leitmotiv als offene Frage. P9: Titel werden kodiert wie jedes Wort | G-B; PX; RS §10.6; P9 `LINES` |
| W11 | **Funktionswörter beim Dekodieren** | V-500: Funktionswörter „eine Stufe voraus“. V-505(3)/V-506(3): Satzfluss-Wörter „in jeder Stufe lesbar“. G-A, G-B, RS, P9: immer lesbar. → Durch V-506 aufgelöst (immer lesbar) | REG |
| W12 | **Glyphenbreite** | G-A: Glyphen exakt auf Pixelbreite des Wortes. G-B: Länge nur grob, nicht exakt. RS: Breite wegen Layout-Stabilität, nicht wegen Grawlix-Tradition. V-506: 1–3 Glyphen, Breite über Skalierung in Grenzen (0,85–1,35 / 0,85–1,25), also **annähernd** | G-A §5; G-B §5; RS §5; V-506 |
| W13 | **Stufen-Farben** | G-A: Glyphen grau/violett, Fluff „Schlumpf-Blau“, Klartext weiß. Register: alles Tinte #1f1a14 auf PAPER. RS/G-B: kein Farb-only-Signal | G-A §8B; V-505(2); V-506(3) |
| W14 | **Glyphen und Emotion** | RS: Glyphen-**Klasse** nach Emotion (Nittles = Debatte, Jarns = Zweifel, Quimps = Prahlen). G-B: Emotion ändert **nicht** die Wort-Glyphen, nur Größe, Rotation, Wackeln, Farbe | RS §5, §8 Nr. 13; G-B §5 |
| W15 | **Walker-Begriffe** | G-A: Quimps = Sterne/Explosionen, Nittles = Zickzack/Blitze, Jarns = Spiralen. RS (mit Wikipedia/World Wide Words): Quimps = Planeten-/Astro-Symbole, Nittles = Sterne/Sternchen, Grawlix = Gekritzel | G-A §5; RS §5 |
| W16 | **Komposita** | G-A §4: „Das Grundwort (der Kopf) wird durch fluff ersetzt … oder umgekehrt“, Beispiel aber bloodbath → fluffbath (dort bleibt der Kopf „bath“). G-B und RS: fluffbath, Kopf bleibt. V-506: „nichts erfunden“, P9: bloodbath → fluff | G-A; G-B; RS §4.3; V-506 |
| W17 | **Mund-Sync** | G-A: Mundöffnung an Hüllkurvenfolger des Oszillators (Laufzeit-Analyse). G-C/RS: deterministisch aus den geplanten Noten (open/wide/round bzw. Formen A–F) | G-A §7; G-C §6; RS §7 |
| W18 | **Tone.js** | G-C: Tone.js für den Prototyp (Phase 1), später evtl. eigener Kern. G-A: Tone.js-Spalte mit „< 10 ms, < 50 KB“ (ohne Beleg). RS: rohes Web Audio reicht, Tone.js erst für Transport-Sync mit Musik. P9: rohes Web Audio, R4 PASS | G-C §9; G-A §7; RS §7 |
| W19 | **Angst-Prosodie** | G-A-Tabelle: Angst „Tonhöhen-Varianz unregelmäßig“. RS (Juslin & Laukka, sekundär): Angst **geringe** F0-Variabilität. G-C: „zitternd, stockend“ | G-A §3; RS §3.3; G-C §5 |
| W20 | **WoW-Zeitsperren** | G-A: bis zu „6 Tagen und 18 Stunden“ je Knoten, „massive Kritik“. RS: bis 5 d 18 h (Altonian), Spielerrezeption **nicht belegt**. G-B: Rezeption nicht belegt. Für KFB folgenlos, weil alle Quellen Zeitsperren ablehnen | G-A §1; RS §1.1; G-B §1 |
| W21 | **Fragen-Intonation** | G-A, G-C, V-492, V-498, P9: Frage steigt. RS: Nur Ja/Nein-Fragen steigen, W-Fragen fallen im Englischen meist (Hedberg 2010) | RS §3.3; REG |

---

## 2 · Konkordanz-Tabelle

Spalten: Georgs Doc (G-A … G-D) · Perplexity-Daten (PX) · unsere Recherche (RS) · Probe/Register (P9/REG) · **Vorschlag** (R1-Nr. aus §3, Δ = Änderungsvorschlag).

| Thema | Georgs Doc | Perplexity (PX) | Unsere Recherche (RS) | Probe R9.2 / Register | Vorschlag |
|---|---|---|---|---|---|
| **Tonleiter** | G-A Frage 1: Skala je Stimmung oder fest? G-C: Pentatonik/modal, Skala im Voice-JSON. G-D: Moll-Pentatonik | `scale: minorPentatonic` global, baseMidi 60 | Keine eigene Skalen-Empfehlung; Melodie in Tonart des Soundtracks rastern (Journey) | V-492/V-498: Tonleiter der Stimmung. P9: calm/excited Dur-Pentatonik, debate Moll-Pentatonik, doubt [0,2,3,7,8,12] | Skala bleibt je Stimmung (R1-07). Motive werden als **Skalenstufen** gespeichert, nicht als MIDI, damit sie auf jede Stimmungs-Skala passen (R1-21). Feste Moll-Pentatonik = Δ7, nicht empfohlen |
| **Motiv je Wort** | G-A §8A.3, G-C §2: festes Motiv; G-C 2–6 Noten, 70–220 ms; G-D 1–5 Noten | 1 Note (tiny), 3 Noten (arc/fall/rise/spike/hover), 5 Noten (title) | Leitmotive (3–4 Töne) für Karten- und Figurennamen, sonst leises Motiv (§8 Nr. 10) | V-497: 1 Ton je Wort. P9: 1 Ton (2 bei > 7 Buchstaben), Motiv ±1 HT | Festes Motiv je Lemma bleibt (R1-03). Mehrton-Motive für alle Inhaltswörter = **Δ1** (A/B-Test). Leitmotive für Titel = **Δ2** |
| **Wortklassen** | G-C: Nomen Bogen, Verb Bewegung, Adjektiv Biegung, Adverb schnell, Funktionswort tief, Eigenname/Titel Leitmotiv | wordClass FUNCTION/NOUN/ADJ/VERB/ADV/CARD_TITLE; Form teils semantisch (W8) | Drei Klassen wie Celeste: Durchgang, Betonung, Satzende | P9: `FUNCW` (Melodie) ≠ `FLOW` (Blase) | **Eine** Wortklassen-Quelle für Blase und Melodie (R1-09). Form-Familien nach G-C als Default, semantische Ausnahme nur autoriert (R1-22) |
| **Akzente** | G-C: Inhaltswort länger, lauter, höher; wichtiges Card-Wort transponiert + verlängert | `accentIndex` je Motiv | Downstep: spätere Akzente kleiner (§8 Nr. 6) | V-498: Akzent auf Inhaltswörtern. P9: accent −1,5 (Funktion) / +1 / +2,5 (≥ 6 Buchstaben) | Bleibt wie P9 (R1-05). Downstep = Δ12 (klein) |
| **Deklination** | G-A: Fujisaki, kontinuierliche Absenkung; G-C: globale Fallkontur | – | Fujisaki-Addition statt linearer Interpolation (§8 Nr. 7) | V-498: je Teilsatz, Anfang höher. P9: linear `start → end` je Teilsatz | Bleibt (R1-05). Fujisaki-Addition = Δ12 |
| **Grenztöne** | G-A: Komma +2, Frage +5, Punkt −4 HT. G-C: Komma Anstieg + 80–180 ms Pause, Punkt Fall + 180–400 ms | – | ToBI-Tabelle: `.` L-L%, `?` H-H%, `,` L-H%, `!` früher Gipfel (§8 Nr. 6) | V-498 dto. P9: Frage Ende base+5, Komma base+2, Punkt ≤ base−1; Pause 0,12 s (Komma) / 0,24 s (Satz) ÷ Tempo | Bleibt wie P9 (R1-05). [B] P9 erfüllt G-A-Werte für Komma und Frage schon |
| **Fragen** | Alle: Frage steigt | – | W-Fragen fallen (§8 Nr. 1) | V-492/V-498: Frage steigend | **Δ5**: W-Fragen fallen |
| **Stimmen/Instrumente** | G-C: 6 Archetypen (Erzähler, Alarmist, Konstrukt, Kindlich, Prophet, Heckler); Voice-JSON mit Oszillatoren, Formant, Envelope, Vibrato, Effekten. G-A: 2–3 Biquad-Formanten Pflicht | – | Je Resident Grundtonlage, Oszillator, Formantfarbe; Formanten pro Note leicht bewegen (Celeste, §8 Nr. 11) | V-492 → V-497: FrizzleBob Horn, Dory Flöte, Hunky Tuba. P9 `VOICE`: Triangle 110 Hz / Sine 220 Hz / Triangle 73,4 Hz; 2 parallele Bandpässe + Dry → Lowpass; Vibrato-LFO; FrizzleBob Wah 0,35; Dory Atem-Rauschen | P9-Stimmen bleiben (R1-01). Voice-JSON nach G-C als Datenformat für neue Residents (§4). Archetypen als Vorlage, nicht als Ersatz. Formantbewegung = Δ11 |
| **Emotion** | G-A: Juslin-Tabelle. G-C: 8 Emotionen mit Tempo/Lage/Dynamik/Kontur/Effekt; MVP 4 (neutral, ängstlich, fröhlich, düster) | – | Drei Regler: Lage, Ausschlag (Heat), Rahmen; Preset „nervös“ fehlt (§8 Nr. 8–9) | V-492: Gefühl über Tempo/Lage/Tonleiter. P9 `EMO`: calm, excited, debate, doubt; `leap` ungenutzt | 4 P9-Presets bleiben. Zusatz-Preset „nervös“ und Heat → Ausschlag (R1-08, additiv). Emotion nie über die Motiv-Identität (R1-07) |
| **Heat** | – | – | Heat steuert Ausschlag, nicht nur Tempo | V-486: Emotion/Debatten-Hitze über Tempo, Tonhöhe, Lautstärke. P9: kein Heat | Heat 0..1 skaliert Ausschlag (Akzent-Hub) und Tempo (R1-08) |
| **Card-Titel** | G-B: lesbar bzw. teilweise verflufft (unklar). G-C: eigenes längeres Leitmotiv. G-D: 4 Titel-Motive als Startentwürfe, manuell veredeln | `CARD_TITLE`, protected true, Form title, 5 Noten, ≈ 0,72 s, decodeTier 2 | Leitmotiv als hörbares Sammelziel (Frage 6) | P9: Titel werden kodiert (z. B. „Rumpelstiltskin:“ → Glyphe/Fluff) | **Δ2**: Titel geschützt (immer lesbar) + Leitmotiv, von Georg nach Gehör freigegeben |
| **Dekodier-Stufen** | G-A: 3 Stufen je Wort. G-B: 4 Fortschrittsstufen 0–3 | decodeTier 0–3 je Wort | Gemischte Zeile (Klartext-Inseln) als Kern | V-500/V-506: je Wort Glyphe → Fluff → Klartext, strikt geordnet | Stufe je Wort bleibt (R1-11). PX `decodeTier` wird zu `unlockTrack` umgedeutet (§4.2) |
| **Freischaltung** | G-A: nur Aktivität, keine Timer; Deck → Song. G-B: ≥ 3 Begegnungen je neuem Wort, erste 5–10 Wörter sicher, Journal/Album | decodeTier als Hinweis | Zähler je Lemma: 2–3 Begegnungen → Fluff, Kartenbesitz → Klartext; 3er-Bündel; Deck → Song (§8 Nr. 4–5) | V-486: Deck vollständig → Song. V-500: Begegnungen bzw. Karten. P9: Hash-Regler (Simulation) | Lemma-Zähler + Kartenbesitz + 3er-Bündel + Deck → Song (R1-14 … R1-16). Geltungsbereich = Frage 7 |
| **Fluff-Lexikon** | G-A/G-B: 7 Formen, Funktionswörter geschützt | 7 Fluff-Formen als eigene Motiv-Einträge | 7 Formen + fluffier/fluffiest + fluff's; kein „fluffer“ | V-506: 7 Formen; R9.1: unregelmäßige Vergangenheit → fluffed, -y → fluffy, Possessiv → fluff's | V-506 bleibt (R1-10). Komparativ fluffier/fluffiest = Lexikon-Erweiterung, Δ4b (klein). Wortart aus Lexikon statt nur Endung (R1-22) |
| **Eigennamen** | G-C: geschütztes Leitmotiv | – | offene Frage (immer lesbar / Fluffington / Glyphen bis Kartenbesitz) | P9: werden verflufft | **Δ3**: Eigennamen immer lesbar |
| **Komposita** | G-A: widersprüchlich (W16). G-B: fluffbath | – | Nord-Regel fluffbath, Ausnahme zu V-506 | V-506: nichts erfunden. P9: bloodbath → fluff | **Δ4**: fluffbath nur über autorierten Lexikon-Eintrag, keine automatische Zerlegung |
| **Zahlen** | – | – | Zahlen und Kartennummern immer lesbar | P9: Ziffern → Stufe 2 | Bleibt (R1-12). Zahlwörter („five thousand“) werden wie Ziffern behandelt (R1-12, neu, kein Konflikt) |
| **Glyphen: Lizenz** | G-A: „PottyMouth-Stil“ | – | Blambot-Embedding kostet; PottyMouth BB „Freeware, Non-Commercial“; eigener SVG-Satz ~24 Pfade | V-500: Lizenz offen für Georg. Slice-A-Brief: Platzhalter-Glyphen bauen. P9: PottyMouth eingebettet (nur Probe) | Kein PottyMouth im Spiel-Build (R1-19). Entscheidung = Frage 8 |
| **Glyphen: eigener Satz, Emotion** | G-A: Grawlix/Jarns/Quimps/Nittles. G-B: Emotion nur über Transform | – | Glyphen-Klasse nach Emotion | V-506: 1–3 je Wort, Seed je Wort | Gleiches Wort = gleiche Glyphen in jeder Emotion (R1-18). Emotion nur über Transform. Emotionsklassen = Δ10 |
| **Typografie: Breite** | G-A: exakte Pixelbreite | – | Breite wegen Layout-Stabilität | V-506: Skalierung 0,85–1,35 / Breite 0,85–1,25. P9 `fitCoded` | Bleibt (R1-17). Fluff-Wörter haben heute keine Breitenbindung → Umbruch beim Stufenwechsel möglich, Δ9 |
| **Typografie: Zeilenabstand** | – | – | – | V-506 R9.1: einheitlich, Glyphen nur per Transform. P9: Basis 1,6 × Textgröße | Bleibt (R1-17) |
| **Typografie: Farbe** | G-A: Farbcodierung je Stufe | – | kein Farb-only-Signal | V-505(2)/V-506(3): Tinte #1f1a14 auf PAPER #f8ecd0 + 15 % Figurenfarbe | Bleibt (R1-17). G-A-Farbcodierung abgelehnt |
| **Barrierefreiheit** | G-A: Schalter direkt Klartext, evtl. visuelle Tonhöhenkontur. G-B: DOM-Text, Kontrast, Reduce-Motion, Plain-Text-Ansicht | – | aria-label, Assist „Immer Klartext“, Dyslexie-Test der Fluff-Stufe | – (nicht im Register) | R1-20 (additiv). Assist-Details = Frage 9 |
| **Mund-Cues** | G-A: Hüllkurvenfolger. G-C: open/wide/round je Note; Frage = Mund bleibt offen | – | Aus `marks`: Öffnung = Hüllkurve, Form = Formantfarbe; Formen A–F (Rhubarb) | V-486: Cues auf Ereignis-Zeitleiste (V-389). V-497: WS1 integriert Mund-Rig. P9: `marks` {t, wi, dur} | Deterministisch aus dem Plan, Parameter open/wide/round (R1-23) |
| **Datenformat** | G-C: Word Motif, Resident Voice, Performance Line | Motiv-JSON (s. §4.2) | – | – | `kfb.fluffolect/1` (§4) |
| **Browser-Technik** | G-C: Web Audio Kern, Tone.js für Prototyp. G-A: Tone.js-Tabelle ohne Beleg | – | Rohes Web Audio reicht | P9: rohes Web Audio, ein Oszillator-Strang je Zeile, `setTargetAtTime` | Rohes Web Audio bleibt (R1-24). Tone.js nur bei Bedarf Transport-Sync |
| **Performance** | G-C: Master-Bus mit Kompressor/Limiter, Reverb-Send | – | < 10 ms Start geschätzt | P9: 60 ms Vorlauf, Knoten je Zeile neu, `stop()` am Ende | Budget §3 R1-25 [E, nicht gemessen] |
| **Lokalisierung** | G-A: nur Klartext übersetzen, Melodie passt sich an. G-A Frage 2: dt. Komposita, POS-Tagger? | – | dt. Lexikon flausch/flauscht/geflauscht/flauschend/flauschig/Flauscherei; oder Blase bleibt englisch | – | Schema sprachfähig (Feld `locale`), Entscheidung = Frage 10 |

---

## 3 · Vorgeschlagene verbindliche Regeln R1

### 3.1 Regeln (im Einklang mit dem Register)

Diese Punkte fassen nur zusammen, was das Register schon festlegt oder ohne Konflikt ergänzt.

**Melodie**

- **R1-01** Kein TTS, keine Silben, keine Fantasie-Wörter im Audio. Jede Figur spielt ihre Zeile als **eine** durchgehende Melodie auf ihrem Instrument, mit Glissando und ohne harte Schnitte. Stimmen: FrizzleBob Horn, Dory Flöte, Hunky Tuba. — *V-492, V-497; G-C; RS §9.6*
- **R1-02** Bedeutung steht immer in der Sprechblase. Audio und Glyphen sind nie der einzige Kanal. Ohne Ton bleibt alles verständlich. — *V-486; G-A Nr. 10; G-B §9.1; G-C §10; RS §9.4*
- **R1-03** **Gleiches Lemma = gleiches Motiv**, in jeder Dekodierstufe und jeder Emotion. Schlüssel ist das Lemma des **Originalworts**, nicht das angezeigte Fluff-Wort. Unbekannte Wörter bekommen **kein** Platzhalter-Motiv (G-C §8 abgelehnt). — *V-492; G-C §2; W4, W6*
- **R1-04** Deterministisch: gleicher Text + Figur + Emotion + Heat ergibt identische Noten. Seeds kommen aus dem Lemma-Hash; der Planer nutzt kein `Math.random` (das Atem-Rauschen in `play` darf zufällig bleiben, es ist Klangtextur). — *G-C §8; P9 `h32`/`rng`*
- **R1-05** Satzmelodie nach V-498: Deklination je Teilsatz, Akzent auf Inhaltswörtern, Funktionswörter tief und kurz, Weiterführungs-Hebung vor Komma, Punkt fallend, Frage steigend, Ausruf mit frühem Gipfel. Töne auf die Tonleiter der Stimmung gerastert. Referenzwerte = P9 (Frage +5 HT, Komma +2 HT). — *V-498; G-A §8A.2; G-C §3; P9 `plan`*
- **R1-06** Die Melodie endet genau mit dem letzten Wort. Wort-Hervorhebung, Mund-Cues und Audio kommen aus derselben Notenliste (`marks`). — *V-497; P9 `play`*
- **R1-07** Emotion ändert nur die Ausführung (Tempo, Lage, Dynamik, Legato, Ausschlag und die Tonleiter laut V-492), nie die Intervall-Kontur eines Motivs. Ein bekanntes Wort bleibt in jeder Stimmung erkennbar. — *V-492; G-C §5; G-D*
- **R1-08** *(additiv)* Heat 0..1 skaliert den Akzent-Ausschlag und leicht das Tempo (`EMO.leap` wird endlich genutzt). Zusätzliches Preset „nervös“: hoch, schnell, **enge** Ausschläge, leichtes Tremolo. — *V-486 (Debatten-Hitze); RS §8 Nr. 8–9; G-C §5 „ängstlich“. Klangabnahme durch Georg nötig, die vier bestehenden Presets bleiben unverändert*

**Lexikon und Stufen**

- **R1-09** **Eine** Wortklassen-Quelle für Blase **und** Melodie: Was in der Blase als Satzfluss-Wort immer lesbar ist (`FLOW`), klingt auch als Funktionswort (tief, kurz). `FUNCW` entfällt. — *V-498; V-505(3); Code-Befund §1.2*
- **R1-10** Fluff-Stufe = festes Schlumpf-Lexikon: fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery, dazu fluff's (Possessiv). Nichts auffüllen, nichts erfinden, kein „fluffer“. Großschreibung und Satzzeichen bleiben erhalten. — *V-506 inkl. R9.1; RS §4.3, §9.3*
- **R1-11** Stufe je Wort, strikt geordnet: Glyphe → Fluff → Klartext. Satzfluss-Wörter in jeder Stufe lesbar. — *V-506 R9.1; V-505(3)*
- **R1-12** Ziffern **und** Zahlwörter (one … twelve, hundred, thousand, million) bleiben in jeder Stufe lesbar. — *P9 (Ziffern); RS §8 Nr. 15; Zahlwörter neu, kein Konflikt*
- **R1-13** Die Wortart kommt aus dem Lexikon-Eintrag (`pos`). Die Endungs-Heuristik von `fluffify` ist nur Fallback für Wörter ohne Eintrag und wird im Build-Bericht als „geraten“ markiert. — *Code-Befund §1.2 („again“ → fluff); G-A Frage 2*

**Freischaltung**

- **R1-14** Kein Fortschritt über Echtzeit-Timer. Nur Aktivität zählt: Begegnungen, Karten, Bündel. — *G-A Nr. 3; G-B §6; RS §9.6; V-500*
- **R1-15** Stufe je Lemma aus Zählern statt Zufalls-Hash. Defaults: Glyphe bis zur 2. Begegnung; ab der 3. Begegnung Fluff; Klartext bei Besitz einer Karte, die das Lemma enthält, **oder** durch Bündel (je 3 Karten eines Decks wird eine Wortgruppe Klartext). Werte sind Startwerte für den Playtest. — *V-500; RS §8 Nr. 4–5 (Spracherwerb, Obra Dinn, Sennaar); G-B §6 (≥ 3 Begegnungen). Kein Konflikt: Der Hash in P9 ist nur Simulation*
- **R1-16** Deck vollständig → alle Lemmata des Decks Klartext + der echte Song spielt. — *V-486; G-A §8D.2; G-B §6; RS §8 Nr. 5*

**Blase und Glyphen**

- **R1-17** Typografie wie V-506: 1–3 Glyphen nach Wortlänge (≤ 3 / ≤ 6 / länger), Breite über Skalierung 0,85–1,35 (Größe) und 0,85–1,25 (Breite), nur per Transform, Zeilenabstand einheitlich. Alles Tinte #1f1a14 auf PAPER #f8ecd0 + 15 % Figurenfarbe. **Keine** Farbcodierung der Stufen; Stufen unterscheiden sich über die Form. — *V-505(2), V-506; P9 `fitCoded`; G-A §8B.2 abgelehnt*
- **R1-18** Gleiches Lemma = gleiche Glyphenfolge, in jeder Zeile und jeder Emotion. Seed = bereinigtes Lemma. Emotion wirkt nur über Transform (Größe, Neigung, Wackeln), nicht über andere Zeichen. — *P9 `fitCoded`; G-A §5; G-B §5; RS §5 (Wiedererkennbarkeit)*
- **R1-19** Kein PottyMouth BB im Spiel-Build ohne Embedding-Lizenz. Bis zur Entscheidung nutzt kfb-bubbles.v1 einen Platzhalter-Glyphensatz. — *V-500; RS §5 (Blambot-Lizenz [B]); BRIEF_WSA_SLICES_R1 Slice A*
- **R1-20** *(additiv)* Barrierefreiheit von Anfang an: Klartext liegt immer im DOM (`aria-label` je kodiertem Wort, z. B. „verschlüsseltes Wort“ bzw. Klartext im Assist-Modus); Assist-Schalter „Immer Klartext“; Reduce-Motion schaltet Wackeln/Hüpfen ab; kein Signal nur über Farbe oder nur über Ton. — *G-A §6; G-B §6, §9.8; RS §6.3, §8 Nr. 18. Details = Frage 9*

**Daten und Technik**

- **R1-21** Motive werden als **Skalenstufen relativ zum Stimm-Grundton** gespeichert (`degrees`), nicht als absolute MIDI. So passen sie auf jede Stimmungs-Skala (V-492) und jede Stimmlage (V-497). PX-MIDI wird beim Import umgerechnet. — *W1, W3; §4.2*
- **R1-22** Motiv-Form (tiny/arc/fall/rise/spike/hover/title) folgt per Default der Wortart nach G-C. Eine semantische Form (z. B. fall für „damage“) ist erlaubt, muss aber im Eintrag als `shapeSource: "authored"` stehen. — *G-C §2; G-D; W8*
- **R1-23** Mund-Cues deterministisch aus dem Plan: je Note `t`, `dur`, `open` (aus Lautstärke/Akzent), `wide` (hohe Note), `round` (tiefe Note); Pause = Mund zu bzw. leicht offen; Fragende = Mund bleibt offen. Keine Laufzeit-Analyse (kein Hüllkurvenfolger). Cues gehen als Ereignisse auf die Zeitleiste (V-389). — *V-486; V-497; G-C §6; RS §7, §8 Nr. 12; G-A §7 abgelehnt (W17)*
- **R1-24** Engine = rohes Web Audio wie P9 (ein Oszillator-Strang je Sprecher, Formant-Bandpässe, `setTargetAtTime`). Tone.js ist keine Pflicht; es wird erst geprüft, wenn die Melodie im Takt der Level-Musik laufen soll (Transport). — *P9; RS §7; G-C §9 (Phase-1-Empfehlung abgelehnt, W18)*
- **R1-25** *(Richtwerte [E], nicht gemessen)* Höchstens 2 gleichzeitige Sprecher-Stränge; Planung einer Zeile im Hauptthread < 1 ms; 60 ms Vorlauf (wie P9); Knoten nach Zeilenende stoppen und freigeben; AudioContext erst nach Nutzer-Geste (`resume`, wie P9); Master-Limiter vor dem Ausgang, damit zwei Stimmen plus Musik nicht übersteuern (G-C §1).

### 3.2 Δ-Vorschläge: würden Freigegebenes ändern (nur mit Georgs Zustimmung)

| Δ | Vorschlag | Was er ändert | Quelle | Empfehlung |
|---|---|---|---|---|
| **Δ1** | Inhaltswörter bekommen 2–3-Ton-Motive (PX-Formen arc/fall/rise/spike/hover), Funktionswörter 1 Ton | **V-497** („ein Ton je Wort“) und den Klang des **R4-PASS (V-500)** | PX, G-C, G-D | Nicht blind übernehmen. In Probe R10 als Umschalter „1 Ton (R4) / 2–3 Töne“ hörbar machen; Georg entscheidet nach Gehör (Frage 1) |
| **Δ2** | Card-Titel geschützt: immer lesbar + eigenes 4–5-Ton-Leitmotiv | **V-500** (heute werden Titel wie jedes Wort kodiert) und Melodie (V-497) | PX, G-C, G-D, RS §8 Nr. 10 | Ja (Frage 3). Leitmotive einzeln von Georg abnehmen |
| **Δ3** | Eigennamen (Figuren, Karten-Figuren, reale Forscher) immer lesbar | **V-506**-Praxis (heute → fluff/Glyphe) | G-B §4, RS §10.1 | Ja (Frage 4) |
| **Δ4** | Komposita nach Nord-Regel: bloodbath → fluffbath, nur für Einträge mit `compound` im Lexikon | **V-506** („nichts erfunden“) | G-B, RS §4.3 | Ja, aber nur autoriert (Frage 5) |
| **Δ4b** | Komparativ/Superlativ fluffier/fluffiest | **V-506** (7 feste Formen) | RS §4.3 | Klein; mit Δ4 entscheiden. Ohne Zustimmung → „fluffy“ |
| **Δ5** | W-Fragen (who/what/why/how/which/where/when am Satzanfang) fallen, Ja/Nein-Fragen steigen | **V-492/V-498** („Frage steigend“) | RS §3.3 (Hedberg 2010) | Ja (Frage 6) |
| **Δ7** | Eine feste Moll-Pentatonik für alle Stimmungen | **V-492** (Tonleiter der Stimmung) | PX, G-D | Nein. Stattdessen R1-21 (Skalenstufen) (Frage 2) |
| **Δ9** | Fluff-Wort-Slot reserviert die Breite max(Original, Fluff), damit die Zeile beim Stufenwechsel nicht umbricht | Optik von **V-506** (Fluff-Wörter heute ohne Breitenbindung) | G-A §5/§8B.1, RS §5 | Nur nötig, wenn Stufen **sichtbar live** wechseln (Aufdeck-Animation). Erst in kfb-bubbles.v1-Demo prüfen |
| **Δ10** | Glyphen-Klassen nach Emotion (Nittles/Jarns/Quimps) | Glyphen-Identität aus **V-506** (gleiches Wort = gleiche Glyphen) | RS §5 | Nein für R1; Emotion nur per Transform (R1-18). Später ggf. Glyphensatz **je Figur** (Undertale-Prinzip) |
| **Δ11** | Formanten pro Note leicht bewegen (Vokalfarbe aus Motiv, nicht aus Buchstaben) | Klangfarbe des **R4-PASS** | RS §8 Nr. 11 (Celeste) | Als A/B in R10; Gefahr „zu sprachähnlich“ (RS §9.11) |
| **Δ12** | Fujisaki-Addition (Phrasen- + Akzent-Kommando) und Downstep statt linearer Interpolation | Kontur des **R4-PASS** (V-498 bleibt inhaltlich erfüllt) | RS §8 Nr. 6–7 | Als A/B in R10, niedrige Priorität |

---

## 4 · Datenvertrag-Vorschlag `kfb.fluffolect/1`

Grundsätze [E]:

- Eine Datei je Sprache für Lexikon + Motive (`kfb.fluffolect/1`), eine Datei je Figur für die Stimme (`kfb.fluffolect.voice/1`), ein Spielstand-Block je Spieler (`kfb.fluffolect.state/1`).
- Lemma-ID ist der einzige Schlüssel zwischen Blase, Melodie, Glyphen und Fortschritt.
- PX-Felder bleiben erhalten, wo sie passen; Abweichungen sind unten begründet.

### 4.1 Lexikon-Eintrag

| Feld | Typ | Pflicht | Bedeutung |
|---|---|---|---|
| `lemmaId` | string | ja | z. B. `lex:cookie`. Stabil über alle Builds |
| `locale` | string | ja | `en` (später ggf. `de`) |
| `forms` | string[] | ja | Oberflächenformen, die auf dieses Lemma zeigen (`cookie`, `cookies`, `cookie's`) |
| `pos` | enum | ja | `NOUN` · `VERB` · `ADJ` · `ADV` · `ABSTRACT` · `FUNC` · `NUM` · `NAME` · `TITLE` |
| `flow` | bool | ja | Satzfluss-Wort (R1-09): immer lesbar **und** Funktionswort-Klang |
| `protected` | null \| enum | ja | `null` · `FLOW` · `NUMBER` · `NAME` (Δ3) · `CARD_TITLE` (Δ2) |
| `fluff` | object | nein | Abbildung Form → Fluff-Wort, nur wenn die Regel aus `pos` nicht reicht (z. B. `{"told":"fluffed"}`). Werte nur aus dem festen Lexikon (R1-10) |
| `compound` | object | nein | Nur mit Δ4: `{"modifier":"blood","head":"bath","fluff":"fluffbath"}` |
| `unlockTrack` | enum | ja | `always` · `encounter` · `card` · `deck` (ersetzt PX `decodeTier`, s. 4.2) |
| `cards` | string[] | nein | Karten-IDs, die das Lemma enthalten (Build-Index, für R1-15) |
| `posSource` | enum | ja | `lexicon` · `guessed` (R1-13) |

### 4.2 Motiv-Eintrag (kompatibel zu PX)

| PX-Feld | In `kfb.fluffolect/1` | Begründung |
|---|---|---|
| `wordId` (`word:cookie`) | **bleibt** als `wordId`, zeigt auf `lemmaId` (`word:` ⇄ `lex:` per Präfix) | Import ohne Umbau |
| `canonicalText` | bleibt | – |
| `wordClass` | bleibt, Werte wie `pos` (PX `FUNCTION` → `FUNC`) | Eine Wortklassen-Quelle (R1-09) |
| `protected` | bleibt (bool), Grund steht im Lexikon | – |
| `decodeTier` 0–3 | wird zu `unlockTrack`: 0 → `always`, 1 → `encounter`, 2 → `card`, 3 → `deck` | [E] Deutung der PX-Werte (PX dokumentiert sie nicht). PX gibt den Fluff-Formen Tier 3, das ist sinnlos, weil Fluff-Wörter Ersatz sind (W6) → beim Import verworfen |
| `motifShape` | bleibt, klein geschrieben (`arc` …), plus `shapeSource` `class` \| `authored` | R1-22; G-D schreibt groß, PX klein |
| `motifMidi`, `motif` | **ersetzt** durch `degrees` (Skalenstufen-Offsets ab Stimm-Grundton, ganzzahlig); `previewMidi` optional für Hörproben | R1-21; W1, W3 |
| `durationsSec` | bleibt als **Nominalwert bei Tempo 1,0**; der Planer skaliert mit Emotion, Rolle und Wortlänge (V-497) | Timing muss zum Text passen (V-497) |
| `accentIndex` | bleibt | – |
| `seed` | bleibt (String), Quelle: SHA-256 des `lemmaId` | Reproduzierbar (G-D) |
| – | **neu** `leitmotif: true` für Titel/Namen (Δ2/Δ3) | Planer transponiert Leitmotive nicht mit dem Satz-Akzent, nur mit der Deklination |

Umrechnung PX → `degrees` [B: Skala aus G-D]: Moll-Pentatonik ab C4 = MIDI 60, 63, 65, 67, 70 → Stufen 0, 1, 2, 3, 4. Beispiel „cookie“ [60, 70, 60] → `degrees` [0, 4, 0]. Auf der calm-Skala von P9 ([0,2,4,7,9,…] Halbtöne) klingt das als Grundton – Sexte – Grundton, auf debate als Grundton – kleine Septime – Grundton.

### 4.3 Stimme (`kfb.fluffolect.voice/1`)

Felder nach G-C §4/§7, ergänzt um die P9-Parameter: `voiceId`, `baseHz` (P9 `base`), `wave`, `formants` [{`hz`, `q`, `gain`}] (P9 f1/f2), `lowpassHz`, `vibrato` {`rateHz`, `depth`}, `wah`, `breath`, `envelope` {attack, decay, sustain, release}, `color` (Blasenfarbe), `mouth` {Skalierung open/wide/round}. **Kein** `scale`-Feld in der Stimme: Die Skala kommt aus der Emotion (V-492, W1).

### 4.4 Card-Titel

`titleId`, `cardId`, `deckId`, `text`, `tokens` (Lemma-IDs), `protected: "CARD_TITLE"`, `leitmotif` {`degrees`, `durationsSec`, `accentIndex`, `approvedBy`: null | „Georg <Datum>“}. Titel-Leitmotive aus PX sind Startentwürfe (G-D) und gelten erst nach Georgs Abnahme.

### 4.5 Dekodier-Zustand je Spieler (`kfb.fluffolect.state/1`)

| Feld | Bedeutung |
|---|---|
| `schema`, `playerId`, `locale`, `updatedAt` | Kopf |
| `scope` | `global` · `deck` (Frage 7) |
| `lemmas` | `{lemmaId: {enc, owned, stage, via[]}}` · `enc` = Begegnungen, `owned` = Karte mit dem Lemma im Besitz, `stage` = 0/1/2 (Cache, aus Zählern **ableitbar**), `via` = letzte Quellen (Karten-/Szenen-IDs, max. 5) |
| `decks` | `{deckId: {cardsOwned, bundlesDone, complete, songUnlocked}}` |
| `assist` | `{alwaysPlain, reduceMotion, audioOff}` |

Ableitung (deterministisch, R1-15): `stage = flow||protected ? 2 : (owned || bundleCovers || deckComplete) ? 2 : enc >= 3 ? 1 : 0`. Die Anzeige nutzt `assist.alwaysPlain ? 2 : stage`. Der Fortschritt zählt im Assist-Modus normal weiter.

### 4.6 JSON-Beispiel

```json
{
  "schema": "kfb.fluffolect/1",
  "locale": "en",
  "scaleModel": "degreesOfEmotionScale",
  "lexicon": [
    { "lemmaId": "lex:cookie", "locale": "en", "forms": ["cookie", "cookies", "cookie's"],
      "pos": "NOUN", "flow": false, "protected": null, "unlockTrack": "card",
      "cards": ["card:cookie-of-causality"], "posSource": "lexicon" },
    { "lemmaId": "lex:because", "locale": "en", "forms": ["because"],
      "pos": "FUNC", "flow": true, "protected": "FLOW", "unlockTrack": "always", "posSource": "lexicon" },
    { "lemmaId": "lex:bloodbath", "locale": "en", "forms": ["bloodbath"],
      "pos": "NOUN", "flow": false, "protected": null, "unlockTrack": "card",
      "compound": { "modifier": "blood", "head": "bath", "fluff": "fluffbath" },
      "posSource": "lexicon" }
  ],
  "motifs": [
    { "wordId": "word:cookie", "canonicalText": "cookie", "wordClass": "NOUN", "protected": false,
      "unlockTrack": "card", "motifShape": "arc", "shapeSource": "class",
      "degrees": [0, 4, 0], "previewMidi": [60, 70, 60], "durationsSec": [0.11, 0.11, 0.16],
      "accentIndex": 1, "seed": "sha256:lex:cookie" },
    { "wordId": "word:because", "canonicalText": "because", "wordClass": "FUNC", "protected": true,
      "unlockTrack": "always", "motifShape": "tiny", "shapeSource": "class",
      "degrees": [0], "durationsSec": [0.09], "accentIndex": 0, "seed": "sha256:lex:because" }
  ],
  "titles": [
    { "titleId": "title:cookie-of-causality", "cardId": "card:cookie-of-causality", "deckId": "deck:example",
      "text": "The Cookie of Causality", "tokens": ["lex:the", "lex:cookie", "lex:of", "lex:causality"],
      "protected": "CARD_TITLE",
      "leitmotif": { "degrees": [0, 0, 2, 1, 0], "durationsSec": [0.14, 0.12, 0.12, 0.12, 0.22],
                     "accentIndex": 2, "approvedBy": null } }
  ]
}
```

```json
{
  "schema": "kfb.fluffolect.state/1",
  "playerId": "local", "locale": "en", "scope": "global", "updatedAt": "2026-10-18T20:00:00Z",
  "lemmas": {
    "lex:cookie":    { "enc": 3, "owned": false, "stage": 1, "via": ["scene:ship-banter-02"] },
    "lex:causality": { "enc": 1, "owned": false, "stage": 0, "via": ["scene:ship-banter-02"] }
  },
  "decks": { "deck:example": { "cardsOwned": 4, "bundlesDone": 1, "complete": false, "songUnlocked": false } },
  "assist": { "alwaysPlain": false, "reduceMotion": false, "audioOff": false }
}
```

Hinweise zum Beispiel: `deck:example` und die Szenen-ID sind Platzhalter. Die Titel-`degrees` sind aus PX umgerechnet (MIDI 60, 60, 65, 63, 60 → 0, 0, 2, 1, 0) und noch nicht abgenommen.

---

## 5 · Lücken und Risiken

**Unbewiesen**

1. **Lernbarkeit fester Wortmotive ist nicht belegt.** G-B §0 Nr. 6 und RS §9.10 sagen das übereinstimmend. Silbo und Trommelsprachen zeigen reduzierte Tonhöhen-Kommunikation, aber nicht, dass beliebige Motiv-Systeme wiedererkannt werden. Erfolgskriterium aus G-C §10 übernehmen: Wort nach 3–5 Wiederholungen wiedererkannt? Playtest nötig.
2. **Tone.js-Werte in G-A** („< 10 ms Latenz, < 50 KB“) haben keine Quelle. Nicht verwenden.

**Daten**

3. **PX ist nicht in sich stimmig:** Funktionswörter nicht tief (W5), Fluff-Familie nicht verwandt (W6), drei verschiedene „cookie“-Motive (W7), Form folgt nicht immer der Wortart (W8), Tonumfang nur eine Oktave (MIDI 60–70). Nur 40 Lemmata; ein Deck braucht deutlich mehr. → PX nur als Startformat und Hörprobe nutzen.
4. **Wortart-Heuristik:** `fluffify` rät nach Endungen. Ohne Lexikon-Einträge entstehen falsche Formen („again“ → fluff). Jede Karte braucht einen Lexikon-Lauf im Build (R1-13); ein POS-Tagger im Build ist möglich, aber nicht geprüft.
5. **Zwei Funktionswort-Listen** (`FLOW`/`FUNCW`) in P9 → Melodie und Blase widersprechen sich (R1-09 behebt das).

**Layout und Lesbarkeit**

6. **Umbruch beim Stufenwechsel:** Fluff-Wörter haben keine Breitenbindung (V-506 verbietet Auffüllen). Bei Live-Aufdecken kann die Blase springen (Δ9).
7. **Dyslexie:** Viele ähnliche Wortbilder (fluff/fluffs/fluffy) nebeneinander sind wahrscheinlich schwerer als Glyphen (RS §6.3). Test mit Assist-Modus.
8. **Lese-Ermüdung bei langen Zeilen:** RS §10.10 schlägt vor, die Melodie nach dem ersten Teilsatz leiser zu machen (Hollow-Knight-Prinzip). Nicht entschieden.

**Klang**

9. **Mehrton-Motive vs. Timing:** Drei Töne in 0,30–0,45 s je Inhaltswort (PX-Dauern: spike 0,30 s, arc 0,38 s, fall 0,45 s) können wieder „nervig“ oder hektisch wirken (V-497). Nur per A/B entscheiden.
10. **Absolute Lage:** PX auf MIDI 60 würde Hunky und FrizzleBob um 1–2 Oktaven anheben. R1-21 verhindert das.
11. **Zwei Sprecher gleichzeitig** (Banter-Überlappung) plus Musik: Übersteuerung ohne Limiter; Mobil-Browser starten Audio erst nach Geste.

**Recht und Lokalisierung**

12. **Glyphen-Lizenz** offen (V-500). P9 bettet PottyMouth ein; das darf nicht in Spiel-Builds wandern.
13. **Lokalisierung:** „Gleiches Wort = gleiches Motiv“ hängt am englischen Lemma. Eine deutsche Blase braucht entweder eigene Motive oder eine Zuordnung über Konzept-IDs. Deutsche Komposita (Kriegsschiff) machen Δ4 aufwendiger.
14. **„fluffer“** ist doppeldeutig (RS §4.3). Agens-Nomen auf -er immer → „fluff“.

---

## 6 · Fragen an Georg (max. 10)

1. **Töne je Wort**
   - (a) bleibt 1 Ton je Wort wie R4;
   - (b) 2–3 Töne für Inhaltswörter (Perplexity);
   - (c) 1 Ton je Wort, **nur** Card-Titel und Namen bekommen Leitmotive.
   - **Empfehlung: (c)**, dazu (b) als Umschalter in R10 zum Anhören.
2. **Tonleiter**
   - (a) je Stimmung wie heute (V-492);
   - (b) eine feste Moll-Pentatonik für alles (Perplexity);
   - (c) je Figur eine eigene Skala, Stimmung nur über Tempo und Lage.
   - **Empfehlung: (a)**, Motive als Skalenstufen gespeichert.
3. **Card-Titel**
   - (a) immer lesbar + eigenes Leitmotiv;
   - (b) kodiert wie jedes Wort (heute);
   - (c) lesbar ab der ersten Begegnung.
   - **Empfehlung: (a).**
4. **Eigennamen** (Rumpelstiltskin, BlackRock, Aladdin, Figuren, reale Forscher)
   - (a) immer lesbar;
   - (b) Glyphen bis Kartenbesitz, dann Klartext (nie Fluff);
   - (c) eigene Fluff-Form („Fluffington“).
   - **Empfehlung: (a).**
5. **Komposita**
   - (a) ganzes Wort → „fluff“ (heute, V-506);
   - (b) Nord-Regel „fluffbath“, nur für Wörter mit Lexikon-Eintrag;
   - (c) Süd-Regel „bloodfluff“.
   - **Empfehlung: (b).**
6. **Fragen-Melodie**
   - (a) jede Frage steigt (heute);
   - (b) W-Fragen fallen, Ja/Nein-Fragen steigen.
   - **Empfehlung: (b).**
7. **Geltung der Freischaltung**
   - (a) global je Spielerprofil (eine „Weltsprache“);
   - (b) je Deck getrennt;
   - (c) Wörter global, Song je Deck.
   - **Empfehlung: (c)**, mit Startwerten 3 Begegnungen → Fluff, Kartenbesitz oder 3er-Bündel → Klartext.
8. **Glyphen**
   - (a) PottyMouth-Embedding-Lizenz bei Blambot kaufen;
   - (b) eigener neutraler SVG-Satz (~24 Pfade im Stil);
   - (c) eigener Satz mit Emotionsklassen (Spiralen, Sterne, Blitze);
   - (d) eigener Satz je Figur.
   - **Empfehlung: (b)**, Emotion nur über Transform; (d) später möglich.
9. **Assist-Modus „Immer Klartext“**
   - (a) zeigt nur Klartext, Fortschritt und Songs laufen normal weiter (Deck nötig);
   - (b) schaltet zusätzlich alle Songs frei;
   - (c) kein Assist-Modus.
   - **Empfehlung: (a).**
10. **Sprache der Blase**
    - (a) bleibt englisch;
    - (b) deutsches Fluff-Lexikon (flausch, flauscht, geflauscht, flauschend, flauschig, Flauscherei) mit Motiven über Konzept-IDs;
    - (c) eigene Motive je Sprache.
    - **Empfehlung: (a)** für jetzt; das Schema ist mit `locale` für (b) vorbereitet.

---

## 7 · Umsetzungs-Slices

### WS0 · Probe R10 (Klang und Regeln, gleiche Artifact-URL)

Nur nach Georgs Antworten auf Fragen 1, 2, 3, 6; bis dahin nur die konfliktfreien Punkte.

1. **Konfliktfrei:** eine Wortklassen-Liste für Blase und Melodie (R1-09); Zahlwörter lesbar (R1-12); Heat-Regler + Preset „nervös“ (R1-08, Georg hört ab); `marks` um `open/wide/round` erweitern und als JSON exportieren (R1-23).
2. **Freischalt-Simulator** statt Hash-Regler: Eingaben „Begegnungen je Wort“, „Karten im Besitz“, „Bündel“ → Stufe nach R1-15. Der Prozent-Regler bleibt nur als Debug-Option.
3. **Import-Skript** PX → `kfb.fluffolect/1` (MIDI → `degrees`, `decodeTier` → `unlockTrack`, Fluff-Formen verworfen). PX-Dateien sind nur Daten; nichts davon wird ausgeführt.
4. **A/B-Umschalter** für Δ1 (1 Ton / 2–3 Töne), Δ11 (Formantbewegung), Δ12 (Fujisaki/Downstep); Leitmotive der 4 PX-Titel (Δ2) zum Anhören; W-Fragen-Regel (Δ5) als Schalter.
5. **Gate:**
   - Determinismus-Test (gleiche Eingabe → gleicher Noten-Hash);
   - letzte Note endet mit dem letzten Wort;
   - P9-Presets klingen unverändert, wenn alle Δ-Schalter aus sind;
   - Hub-Karte für Georg.

### WSA · Slice A `kfb-bubbles.v1` (Blase, kein Audio)

1. Stufen-Hook nach R1-11/R1-17/R1-18 aus P9 portieren (`fluffify`, `fitCoded`, `FLOW`), **nicht** `stageOf`: Die Stufe kommt als Eingabe von außen. Vorgeschlagene Schnittstelle: Token `{surface, lemmaId, stage, protected}` → gerendertes Wort.
2. Lexikon aus `kfb.fluffolect/1` lesen (Wortart, Schutz, Komposita); Endungs-Heuristik nur als Fallback mit Markierung (R1-13).
3. Platzhalter-Glyphensatz statt PottyMouth (R1-19); Seed = bereinigtes Lemma.
4. Barrierefreiheit (R1-20): `aria-label`, Assist „Immer Klartext“, Reduce-Motion.
5. Demo-Seite: alle drei Stufen, geschützte Titel/Namen (falls Δ2/Δ3 freigegeben), Stufenwechsel live, um Δ9 (Umbruch) zu beurteilen.
6. Gate: Byte-Abgleich wie im Slice-A-Brief; Tinte/PAPER-Werte unverändert; Zeilenhöhe über alle Stufen gleich.

### WS1 · Spiel-Laufzeit (nach PASS von R10 und Slice A)

1. **Dekodier-Zustand** `kfb.fluffolect.state/1` im Spielstand; Ereignisse: Begegnung (Zeile gezeigt), Karte erhalten, Bündel fertig, Deck komplett → Song frei (R1-14 … R1-16).
2. **Audio-Modul** aus P9 (`plan`/`play`) als Laufzeit-Modul mit Lookahead-Scheduler, Master-Limiter, max. 2 Sprecher (R1-24, R1-25); Stimmen aus `kfb.fluffolect.voice/1`.
3. **Mund-Cues** auf die Ereignis-Zeitleiste (V-389) und an das Mund-Rig der Figur (V-497, R1-23).
4. **Blase** über kfb-bubbles.v1 (V-501), Stufe aus dem Zustand, Assist-Schalter im Optionsmenü.
5. **Mischung** mit Level-Musik (Ducking); Tone.js nur prüfen, wenn die Melodie im Takt der Musik laufen soll (R1-24).
6. Gate: Bühnen-Probe mit Figur, Mund-Rig und Blase im Hub; Messung von Planungszeit und Knotenanzahl gegen R1-25.
