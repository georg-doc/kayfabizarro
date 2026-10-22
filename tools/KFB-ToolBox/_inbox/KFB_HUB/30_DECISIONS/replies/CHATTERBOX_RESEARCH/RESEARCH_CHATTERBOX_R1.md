# RESEARCH_CHATTERBOX_R1.md  
**Chatterbox-Stimmen · Recherche R1 · 2026-10-22**  
**Ziel:** belastbare, übertragbare Regeln für WS0 und WS-Audio zur Konstruktion der KFB-Chatterbox-Stimmen.  
**Grundlage:** `replies/CHATTERBOX_VOICE_KONZEPT_R1.md` (R1.3), §0–§23.  
**Status:** Recherche-Entwurf; Hörbeispiel-Zeitstempel sind als *zu verifizieren* markiert, wo sie nicht quellgenau belegt sind.

## 0 · Leseregeln für diese Recherche

Jede Regel folgt dem Muster:

`REGEL → ZAHLENBEREICH → HÖRBEISPIEL → KFB-MAPPING → ENGINE-PARAMETER`

Zentrale Unterscheidung:

- **Identity:** Wer ist die Figur? Instrument, Register, Motiv, Artikulation.
- **State:** Wie fühlt sie sich? Tempo, Kontur, Dynamik, Timbre-Drift.
- **Context:** Wo spricht sie? Raum, Distanz, Kampf, Traum, Shop, Ruine.

Eine Stimme ist damit kein Sample-Set, sondern ein **Voice Genome**:

```ts
type VoiceGenome = {
  id: string;
  family: 'woodwind' | 'brass' | 'string' | 'keyboard' | 'synth' | 'percussion';
  instrument: string;
  role: 'trickster' | 'authority' | 'child' | 'monster' | 'oracle' | 'bureaucrat' | 'hero' | 'ghost';
  motif: number[];              // 3–7 Halbtonschritte relativ zum Grundton
  rhythm: 'legato' | 'staccato' | 'patter' | 'triplet' | 'irregular';
  basePitchHz: number;
  rangeSemitones: number;
  syllableRate: number;         // Silben bzw. Events pro Sekunde
  vibrato: { rateHz: number; depthCents: number };
  formantShift: number;         // -1 .. +1
  fx: string[];
  seed: number;
};
```

---

## 1 · Cartoon Voice Acting: eine Stimme, viele Rollen

### Befund

Cartoon-Sprecher erzeugen Figuren nicht primär über „höher/tiefer“, sondern über die Kombination aus Register, Stimmsitz, Artikulation, Tempo, Rauheit und wiederkehrenden Intonationsfiguren. Bei *The Simpsons* variieren Dan Castellaneta (Homer), Hank Azaria (u. a. Moe, Apu, Chief Wiggum) und Nancy Cartwright (Bart) dieselbe menschliche Stimmbasis durch stark unterschiedliche Stimm- und Sprechparameter.

Hörbeispiele:

- *The Simpsons* – Homer: langsam, nasal, emotional ausbrechend. https://www.youtube.com/watch?v=DX1iplIPJhw — *Zeitstempel zu verifizieren.*
- *The Simpsons* – Bart: heller, schneller, mehr Kopfstimme und provokante Endkonturen. https://www.youtube.com/watch?v=SCQG5Vn6rEM — *Zeitstempel zu verifizieren.*

### Regeln für „ein Instrument spielt mehrere Rollen“

1. **Register-Shift:** Verschiebe die Grundtonlage um 4–12 Halbtöne zwischen Rollen; darüber hinaus wird ein Instrument schnell unkenntlich.
2. **Stimmsitz:** Brustnah = schwer/erwachsen; Mittelregister = neutral; kopfstimmig/hell = kindlich, nervös, komisch.
3. **Rauheit:** Addiere Knarrsen, Subharmonics oder Atemrauschen für Alter, Erschöpfung, Bosheit.
4. **Tempo-Differenz:** Schnelle Rollen etwa 5–8 Events/s, träge Rollen 2–3,5 Events/s.
5. **Artikulation:** Überartikuliert = kindlich/befehlend; verschliffen = müde, betrügerisch, lässig.
6. **Kontur-Gewohnheit:** Jede Rolle bekommt 1–2 typische Endungen: steigend, fallend, abrupt, vibrato-schwerfend.
7. **Catchphrase-Grain:** Ein 150–400 ms langer Signature-Sound, der bei Wiedererkennung hilft.
8. **Dynamik-Spanne:** Komische Rollen brauchen größere Lautstärke- und Pitch-Sprünge; ernste Rollen bleiben enger.
9. **Pause-Verhalten:** Nervöse Figuren sprechen in kurzen, unregelmäßigen Gruppen; Autoritäten in langen, metrischen Phrasen.
10. **Instrument-Verfremdung:** Gleiche Klangquelle, aber unterschiedliche Attack, Filter, Vibrato und Effektkette.

### KFB-Mapping

Eine Oboe kann mehrere KFB-Rollen tragen:

- **Nervöser Erfinder:** Oboe, 420–520 Hz, 6–8 Events/s, Staccato, steigende Endungen.
- **Müder Aristokrat:** dieselbe Oboe, 220–300 Hz, 2,5–3,5 Events/s, Legato, fallende Endungen, leichtes Vibrato.
- **Panischer Bote:** Oboe, 500–650 Hz, 7–9 Events/s, unregelmäßige Pausen, hohe Pitch-Sprünge.

---

## 2 · Fantasiesprachen in Spielen

### Befund

Die angenehmsten Fantasiesprachen sind **kurz, vorhersagbar variiert und semantisch abgesichert**. Sie versuchen nicht, Sprache vollständig zu imitieren, sondern erzeugen den Eindruck von Sprache.

| Spiel | System | Kernprinzip |
|---|---|---|
| Animal Crossing | Animalese | Buchstaben-/Silben-Grains mit Pitch-, Tempo- und Stimmungsvariation |
| Animal Crossing | Bebebese | Abstrakte, uniforme Beeps statt verständlicher Phoneme |
| Banjo-Kazooie | Grunt-Blips | Kurze, perkussive Silben, stark an Charakter und Aktion gekoppelt |
| Undertale | Text-Blips | Pro Figur ein charakteristischer, meist sehr kurzer Blip |
| Die Sims | Simlish | Improvisierte, sprachähnliche Phrasen statt Phonem-Mapping |
| Celeste | UI-/Charakter-Blips | Sehr kurze, klar konturierte Events; emotionale Funktion vor Sprachlichkeit |
| Okami | Kreaturen-/Geisterstimmen | Instrumentale, oft verfremdete Stimmen im musikalischen Kontext |
| Kirby | Hohe Silben-Blips | Kindlich, repetitiv, stark rhythmisiert |

Hörbeispiele:

- Animal Crossing – Animalese: https://www.youtube.com/watch?v=8rMkF0rPz4k — *Zeitstempel zu verifizieren.*
- Undertale – charakteristische Text-Blips: https://www.youtube.com/watch?v=1S6J9Xl0Y4M — *Zeitstempel zu verifizieren.*

### Regeln gegen Nervigkeit

1. **Event-Länge:** 80–250 ms pro Silbe/Grain; darunter wirkt es wie UI, darüber wie echte Sprache.
2. **Phrasenlänge:** 3–9 Events pro Äußerung; längere Passagen nur mit Pausen oder melodischen Bögen.
3. **Wiederholung mit Variation:** Gleiche Silbe darf wiederkehren, aber mit mindestens 15–25 % Variation in Pitch, Dauer oder Lautstärke.
4. **Keine Dauer-Loops:** Nach 2–4 Sekunden kontinuierlichem Chatter eine Pause von mindestens 250–800 ms.
5. **Pitch-Range:** Angenehme Charaktere liegen oft bei 5–10 Halbtönen Spannweite; extreme Figuren dürfen 12–18 Halbtöne nutzen, aber seltener.
6. **Silbenrate:** 3–7 Events/s ist der komfortable Kernbereich; über 8 Events/s nur für kurze Erregung.
7. **Mischung:** 70–90 % Sprach-Grains plus 10–30 % instrumentale Blips, Glitches oder Atemgeräusche.
8. **Semantische Absicherung:** Untertitel, Mimik, Animation oder Kontext müssen die Bedeutung tragen.

### KFB-Mapping

- **Alltags-NPC:** 4–6 Events, 90–180 ms, Pitch-Range 5–8 Halbtöne.
- **Erregter Charakter:** 6–9 Events, 70–140 ms, Pitch-Range 8–14 Halbtöne.
- **Orakel/Geist:** 2–5 Events, 200–450 ms, Legato, Portamento, große Pausen.
- **Roboter-Bürokrat:** metrische 4–8 Events, quantisierte Pitch-Stufen, kaum Vibrato.

---

## 3 · Kreaturen- und Figuren-Stimmdesign

### Befund

Effekte sind keine Dekoration, sondern **dramaturgische Signale**. Tiefe bedeutet Macht oder Gefahr, Hall bedeutet Distanz oder Unwirklichkeit, Ringmodulation bedeutet Entfremdung, Bitcrush bedeutet Digitalität oder Defekt.

### Effekt-Regeln mit Zielwerten

| Figurtyp | Pitch/Formant | Zeit-Effekte | Farbe/Effekte | KFB-Verwendung |
|---|---|---|---|---|
| Ork/Riese | −5 bis −12 Halbtöne; Formant leicht down | kurzer Room, 0,3–0,8 s | sanfte Sättigung, Low-Mid-Boost | Macht, Grobheit, Trägheit |
| Dämon | Sub-Oktave, Formant down | kurzer Dark Hall, 0,8–1,8 s | Ringmod 30–80 Hz, asymmetrische Sättigung | Bedrohung, Verführung, Chaos |
| Geist | Pitch-Drift ±20–60 Cent | Hall 1,5–4 s, Reverse-Reverb | Highpass 300–600 Hz, Chorus leicht | Erinnerung, Traum, Tod |
| Skelett | normal bis leicht hoch | sehr trocken | Bandpass 400 Hz–4 kHz, transiente Klicks | Komik, Alter, Zerbrechlichkeit |
| Alien | Mikrotonal, Formant-Shift | kurzer Metallic-Hall | Ringmod, Portamento, FM | Fremdheit, Intelligenz, Unheimlichkeit |
| Roboter | quantisierte Pitch-Stufen | kein/nur kurzer Hall | Bitcrush, Sample-Rate-Reduktion, Ringmod | Technik, Bürokratie, Defekt |
| Kind/Teenager | +4 bis +12 Halbtöne, helle Formanten | wenig Hall | wenig Vibrato, hohe Variabilität | Unschuld, Übermut, Vulnerabilität |

### Anti-Regeln

- Nicht mehr als 2–3 dominante Effekte pro Stimme.
- Hall über 2,5 s nur für Geister, Träume, Orakel oder große Räume.
- Ringmodulation nur kurz und rhythmisch gesetzt, nicht permanent.
- Bitcrush nur bei digitalen/defekten Charakteren; sonst klingt es schnell generisch.

### KFB-Mapping

Jeder KFB-Charakter bekommt eine **Effekt-Signatur** mit maximal drei aktiven Parametern:

```ts
fx: ['formant:-0.3', 'ringmod:55Hz', 'room:0.6s']
```

---

## 4 · Oper: Stimmfach, Leitmotiv, Ensemble

### Befund

Oper liefert keine direkte Sound-Design-Vorlage, aber eine sehr brauchbare **Rollen-grammatik**: Stimmfach entspricht Charakterklasse, Leitmotiv entspricht Identity Anchor, Rezitativ entspricht funktionaler Dialogsprache, Arie entspricht emotionalem Ausnahmezustand.

Hörbeispiele:

- Mozart, *Die Zauberflöte*: Königin der Nacht als hohe, virtuose Bedrohung; Sarastro als tiefe Autorität. https://www.youtube.com/watch?v=YuBeBjqKSGQ — *Zeitstempel zu verifizieren.*
- Prokofjew, *Peter und der Wolf*: jedes Tier bzw. jede Figur erhält ein eigenes Instrument und Motiv. https://www.youtube.com/watch?v=MfM7Y9Pcdzc — *Zeitstempel zu verifizieren.*

### Regeln

1. **Stimmfach = Charakterklasse:** hoch/hell/agil für List, Jugend, Gefahr; tief/breit für Macht, Alter, Autorität.
2. **Leitmotiv:** 3–7 Noten bzw. Events; bei jeder Wiederkehr minimal variiert.
3. **Rezitativ:** schnelle, dialogische Sprachmelodie; geringe Tondauer, klare Silben.
4. **Arie:** längere Phrasen, klarere Tonhöhen, stärkere Dynamik, emotionaler Höhepunkt.
5. **Ensemble:** mehrere Stimmen mit unterschiedlichen Rhythmen, aber gemeinsamem harmonischem Ziel.
6. **Instrument-Rolle:** Instrument ist keine feste Bedeutung, sondern eine semantische Konvention, die durch Wiederholung etabliert wird.

### KFB-Mapping

| KFB-Rolle | Opern-Analogie | Instrument-Vorschlag |
|---|---|---|
| Trickster | listige Sopran-/Tenorfigur | Oboe, Klarinette |
| Autorität | Bass-/Bariton-Figur | Tuba, Posaune, Kontrabass |
| Kind | hohe, helle Figur | Celesta, Piccolo, Glockenspiel |
| Monster | tiefe Bedrohung | Tuba, Kontrafagott, distorted Bass |
| Orakel | überirdische Stimme | Theremin, Ondes Martenot, Frauenchor-Synth |
| Bürokrat | metrische, repetitiver Charakter | Marimba, FM-Bleeps, Cembalo |

---

## 5 · Musical: Sprechen, Sprechgesang, Singen

### Befund

Musical ist für KFB vor allem wegen des **kontinuierlichen Übergangs von Sprechen zu Singen** wertvoll. Eine Chatterbox-Stimme sollte nicht permanent „singen“, sondern bei Erregung, Bedeutung oder Ritual in eine melodischere Form kippen.

### Regeln für den Übergang

1. **Sprechen:** freies Timing, Sprachkontur, kurze Events.
2. **Patter/Sprechgesang:** metrisches Raster, aber gesprochene Pitch-Kontur; gut für schnelle, komische Figuren.
3. **Gesang:** Tonhöhen werden auf ein Tonmaterial fixiert; längere Noten, deutlichere Kadenz.
4. **Reprise:** gleiches Motiv, neue Emotion durch Tempo, Modus, Instrument oder Dynamik.
5. **„I want“-Song:** Identifikationsmoment; das Leitmotiv wird erstmals vollständig und melodisch präsentiert.
6. **Ensemble:** mehrere Stimmen teilen sich ein rhythmisches Feld, behalten aber eigene Konturen.

### KFB-Mapping

- **Dialog:** Chatterbox-Rezitativ, 3–7 Events.
- **Erregung:** Übergang zu Patter, Silbenrate +30–60 %.
- **Boss/Story-Moment:** Leitmotiv wird melodisch, länger und harmonisch eingebettet.
- **Gruppen-Szene:** Call-and-Response zwischen 2–4 Voice Genomes.

---

## 6 · Elektronische Musik mit Sprechcharakter

### Befund

Talkbox, Vocoder, TB-303, Theremin und Ondes Martenot zeigen, wie ein Instrument **sprachliche Artikulation suggerieren** kann, ohne Worte zu enthalten. Für KFB ist das der direkteste Weg zu Robotern, Orakeln und technischen Fraktionen.

### Stil-Register

| Technik | Klangliches Prinzip | Typische Werte | KFB-Rolle |
|---|---|---|---|
| Talkbox | Formanten werden über Mund/Röhre geformt | Resonanz peaking, schnelle Formant-Bewegung | cooler E-Funk-Charakter |
| Vocoder | Träger + modulierende Stimme | 8–16 Bands, Slew 5–20 ms | Maschine, Chor, Propaganda |
| TB-303/Acid | Akzent, Slide, Resonanz | Cutoff-Sweep, Resonanz hoch, Slide 20–80 ms | nervöse Technik, Saboteur |
| Portamento-Lead | gleitende Tonhöhe | Glide 30–150 ms | Alien, Orakel, Verführer |
| Ondes Martenot | kontinuierliche Tonhöhe, Vibrato | Vibrato 4–7 Hz, 20–60 Cent | geisterhaft, elegisch |
| Theremin | kontinuierliche Tonhöhe, große Portamenti | Vibrato 5–8 Hz | Fremdes, Übernatürliches |

### Kölner Linie

Die Kölner Referenz ist historisch gut belegt: Das WDR-Studio für elektronische Musik entstand 1951 in Köln und arbeitete mit Sinusgeneratoren, Filtern, Klangerzeugung und Tonbandtechnik. Holger Czukay und Irmin Schmidt studierten bei Karlheinz Stockhausen, bevor sie 1968 Can gründeten. [web:43]

**„Ken“ ist im Brief als CAN aufzulösen** — nicht als einzelne Person, sondern als Band bzw. als Kölner Krautrock-/Elektronik-Kontext um Holger Czukay und Irmin Schmidt.

Praktische Prinzipien aus Köln:

- **WDR/Stockhausen:** Klang als bearbeitbares Material; Filter, Sinustöne, Tonband-Manipulation, räumliche Bewegung.
- **Can/Holger Czukay:** Repetition, Found Sound, Radio-/Sprachfragmente, Groove als Organisationsprinzip.
- **Kölner Minimal-Techno:** Reduktion, Mikrovariation, trockene Räume, präzise Wiederholung.

### KFB-Mapping

Für 60+ Stimmen ist Kölner Minimal ein starkes Designgesetz: **wenig Material, hohe Identität durch Variation.** Jeder Charakter erhält ein kleines Motiv und 2–3 veränderbare Parameter; nicht 60 unterschiedliche Effektketten.

---

## 7 · Bach, Fuge und GEB als Engine-Regelwerk

### Befund

Bachs Kanons und Fugen sind für KFB deshalb wertvoll, weil sie Wiedererkennung durch **Transformation statt Wiederholung** erzeugen. Hofstadters *Gödel, Escher, Bach* nutzt genau diese Prinzipien — Kanon, Fuge, Umkehrung, Krebs, Augmentation und Selbstbezüglichkeit — als Modell für rekursive Strukturen und „Strange Loops“. [web:46][web:48]

Ein Kanon besteht aus transformierten Kopien eines Themas, die zeitlich, in der Tonhöhe, im Tempo oder durch Umkehrung/Krebs verschoben werden; Fugen arbeiten ähnlich, aber freier mit Thema, Antwort und Kontrasubjekt. [web:48][web:52]

### Motiv-Operationen

```text
Motiv M = [0, 4, 7, 5, 2]     // Halbtonschritte relativ zum Grundton

Transposition:  M + n
Umkehrung:      M -> [-m for m in M]
Krebs:          M reversed
Krebsumkehrung: reverse(invert(M))
Augmentation:   Dauer x 2
Diminution:     Dauer x 0.5
Engführung:     Einsatzabstand < Motivdauer
Modulation:     Grundton + n Halbtöne an Phrasengrenze
Kanon:          zweite Stimme = transformiertes M mit Delay
Fuge:           Thema + Antwort + Kontrasubjekt
```

### Engine-Regeln

1. Jeder Charakter erhält ein **3–7-Event-Motiv**.
2. Bei Wiederkehr wird das Motiv transformiert, nicht identisch wiederholt.
3. Mindestens eine der Operationen: Transposition, Umkehrung, Krebs, Augmentation, Diminution.
4. Bei Gruppen: zwei Stimmen dürfen im Kanon laufen, eine dritte erhält ein rhythmisch kontrastierendes Kontrasubjekt.
5. Modulation nur an Phrasen- oder Szenengrenzen, nicht mitten im kurzen Chatter.
6. „Strange Loop“: Ein sich ständig anhebendes Motiv kann nach mehreren Modulationen wieder am Ausgangspunkt landen — Bachs *Canon per Tonos* moduliert über sechs Schritte zurück zum Ausgangspunkt. [web:48]

### KFB-Mapping

```text
Charakter: Oboe-Trickster
Motiv:      [0, 4, 7, 5]
Dialog 1:   [0, 4, 7, 5]
Dialog 2:   [0, 4, 7, 5] transponiert +3
Dialog 3:   Umkehrung: [0, -4, -7, -5]
Dialog 4:   Krebs: [5, 7, 4, 0]
Gruppe:     Motiv + Kanon-Antwort nach 250 ms
```

---

## 8 · Emotion und Musik

### Befund

Die belastbarste Grundlage ist Juslin & Laukka (2003): Die Meta-Analyse vergleicht 104 Studien zur vokalen und 41 Studien zur musikalischen Emotionsausdrucks und findet konsistente emotionsspezifische Muster in Tempo, Intensität, Timbre/Hochfrequenzenergie und Pitch. [web:32][web:44]

Emotionszuordnungen sind **probabilistisch, nicht deterministisch**. Die Engine sollte deshalb Gewichte, nicht harte Wahrheiten verwenden.

### Korrigierte Emotions-Matrix

| Emotion | Tempo | Lautstärke | Pitch-Lage | Kontur | Artikulation |
|---|---|---|---|---|---|
| Freude | schnell, +10–30 % | mittel bis laut | mittel bis hoch | steigend, weit | leicht, präzise |
| Trauer | langsam, −20–40 % | leise bis mittel | tief | fallend, eng | weich, legato |
| Wut | schnell | laut | mittel bis tief | abrupt, unregelmäßig | hart, staccato |
| Angst | unregelmäßig schnell | unruhig | hoch, instabil | zitternd, springend | kurz, gehackt |
| Zärtlichkeit | langsam bis mittel | leise | mittel | sanft bogenförmig | weich, legato |
| Stolz | mittel bis langsam | laut | tief bis mittel | breit, fallend | getragen |
| Langeweile | langsam | leise | flach | repetitiv | verschliffen |
| Überraschung | sehr kurz | akzentuiert | Sprung nach oben | abrupt | perkussiv |

### Engine-Formel

```ts
emotionWeights = {
  joy:      { tempo: +0.25, pitch: +0.30, contour: 'rising',  articulation: 'light' },
  sadness:  { tempo: -0.30, pitch: -0.25, contour: 'falling', articulation: 'soft' },
  anger:    { tempo: +0.20, pitch: -0.10, contour: 'abrupt',  articulation: 'hard' },
  fear:     { tempo: +0.35, pitch: +0.20, contour: 'erratic', articulation: 'chopped' }
};
```

---

## 9 · Suno für Solo-Passagen

### Befund

Suno kann Songs in Stems zerlegen; Advanced Stem Separation bietet laut Anbieter präzisere Trennung und mehrere Separations-Modi. [web:33][web:34] Gleichzeitig warnt Suno, dass dichte Mixe Stimmen und Instrumente frequenzmäßig überlappen können; die Trennqualität hängt von Komplexität und Mixing des Originals ab. [web:36][web:41]

Die Pilot-Ernte mit 5–15 % einstimmigem Material ist daher plausibel. **Suno sollte als Motiv- und Arrangement-Ideenquelle dienen, nicht als primärer Lieferant für saubere Solo-Instrumente.**

### Prompt-Muster

```text
solo oboe, short playful motif, 4 bars, 92 bpm,
sparse arrangement, no drums, no chords,
call and response with silence,
dry close mic, cartoon character voice-like phrasing,
no vocals, no reverb tail
```

Varianten:

```text
solo trombone, slow gruff motif, 2 bars, 70 bpm,
portamento, sparse, no drums, no chords,
call and response with silence, dry close mic
```

```text
solo theremin, eerie gliding phrase, 4 bars, 60 bpm,
long portamento, sparse arrangement, no drums,
no chords, dry close mic, alien oracle character
```

### Ernte-Regeln

1. Generiere kurz: 2, 4 oder 8 Takte.
2. Verlange ausdrücklich `solo`, `no drums`, `no chords`, `sparse arrangement`.
3. Suche nach **2–8 Sekunden klaren Motivs**, nicht nach ganzen Soli.
4. Kuratiere manuell; akzeptiere nur Grains mit klarer Attack, stabilem Ton und wenig Bleed.
5. Schneide Grains auf 80–600 ms für Chatter, 0,5–3 s für Leitmotiv-Clips.

---

## 10 · Prozedurale und generative Game-Ansätze

### Befund

Die stärksten Game-Systeme trennen **Sprachsignal** von **Bedeutung**. Der Spieler versteht die Bedeutung durch Text, Mimik, Animation und Kontext; die Stimme liefert Identität, Emotion und Rhythmus.

Audio-Middleware wie Wwise und FMOD unterstützt genau diese Arbeitsweise: Audio-Assets liegen in Random-/Multi-Sound-Containern, erhalten automatische Pitch- und Volume-Variation und werden kontextabhängig durch DSP-Ketten verändert. [web:59]

### Übertragbare Muster

1. **Grain-Pool statt Linear-Audio:** pro Phonem/Silbe 2–5 Varianten.
2. **Seed-basierte Variation:** gleicher Text erzeugt ähnliche, aber nicht identische Äußerungen.
3. **Emotion als Parameter-Layer:** Tempo, Pitch-Range, Kontur und Filter ändern sich mit State.
4. **Context-DSP:** derselbe Charakter klingt im Shop trocken, im Kampf komprimiert, im Traum verhallt.
5. **Motiv-Wiederverwendung:** Bach-Operationen statt zufälliger Blips.
6. **Call-and-Response:** NPC antwortet mit transponiertem oder invertiertem Motiv des Spielers/anderen NPCs.
7. **Ermüdungs-Budget:** max. 6–9 Events pro Äußerung, Pausen erzwingen, Wiederholung begrenzen.

### KFB-Engine-Vorschlag

```ts
speak(character, text, state, context) {
  const genome = getGenome(character);
  const events = toEvents(text, genome);
  const motif = transformMotif(genome.motif, state, context);
  const melody = applyEmotion(motif, state);
  const grains = selectGrains(genome, events);
  scheduleGrains(grains, melody, context);
}
```

---

## 11 · Priorisierung für WS0

### P0 — sofort bauen

1. Voice Genome JSON-Schema.
2. Grain-Pool mit Vokalen, Konsonanten, Silben und Emotions-Blips.
3. Web-Audio-Engine: Grain-Scheduling, Pitch, Gain-Envelope, Filter, Vibrato.
4. Bach-Motiv-Operationen: Transposition, Umkehrung, Krebs, Augmentation, Diminution.
5. Emotions-Layer nach Juslin/Laukka-Prinzip.

### P1 — nächste Iteration

1. Cartoon-Modulationsregeln für Instrument-Rollen.
2. Context-DSP: Shop, Kampf, Traum, Ruine.
3. Call-and-Response zwischen Charakteren.
4. Suno-Motiv-Ernte und manuelle Kuratierung.

### P2 — später

1. Vocoder-, Talkbox- und Formant-Synthese für Spezialfiguren.
2. Mehrstimmige Ensemble-Nummern.
3. Automatische Emotionserkennung aus Dialogtext.
4. Vollständig generative ElevenLabs-Grain-Pipeline.

---

## 12 · Wichtigste Designgesetze für KFB

1. **Wenig Material, starke Variation.** Kölner Minimal statt 60 unabhängiger Sound-Designs.
2. **Motiv statt Zufall.** Jeder Charakter hat ein 3–7-Event-Motiv.
3. **Emotion ist ein Layer, keine neue Stimme.**
4. **Effekte brauchen dramaturgische Bedeutung.**
5. **Kürze schützt vor Nervigkeit.**
6. **Semantik lebt im Text, Kontext und Untertitel — nicht in der Sprachverständlichkeit.**
7. **Ein Instrument kann viele Rollen spielen**, wenn Register, Artikulation, Rhythmus und Kontur variieren.
8. **Bach liefert die Grammatik, Cartoon Acting die Charakterisierung, Fantasiesprachen die Skalierung.**
