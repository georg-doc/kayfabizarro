# KFB Chatterbox · Spec R2 · 2026-10-22 · WS0
> **Nachtrag 22.10. (V-682):** Das `chatter`-Profil je Figur liegt im Charakter-Register `CHARACTERS_R1/characters/<id>/character.json`, nicht in cast.r1.json.
**Status:** maßgebliche Spec für Stimmen, Sprachmelodie und Chatterbox (V-663). Löst das Konzeptpapier als Arbeitsgrundlage ab; das Papier bleibt als Begründung.
**Quellen:**
- `replies/CHATTERBOX_VOICE_KONZEPT_R1.md` (R1.3, KFB-Schichten);
- `replies/CHATTERBOX_RESEARCH/CHATTERBOX_MASTER_CONCEPT.md` (Kopie aus „KFB MusicalChatterbox“) (Perplexity v1.0, 8-Genom-Gerüst);
- `replies/CHATTERBOX_RESEARCH/RESEARCH_CHATTERBOX_R1–R4.md` (Recherche);
- Register V-486, V-492, V-500, V-505, V-508, V-616, V-636, V-640, V-642, V-650.

## 0 · Leitsätze
1. **Stimme ohne Worte:** Bedeutung steht in der Blase (Englisch, V-650), Identität und Gefühl im Klang.
2. **Wenig Material, starke Variation:** Daten und Regeln skalieren, Aufnahmen nur für Klangfarbe.
3. **Motiv statt Zufall:** Jede Figur hat ein Motiv mit 3–7 Ereignissen. Bei Wiederkehr wird es mindestens einmal verwandelt (Bach-Operationen).
4. **Emotion ist eine Schicht, keine neue Stimme. Kontext ändert Parameter, nicht Identität.**
5. **Klar nicht-menschlich und melodiös:** angenehm auch bei langen Reden (§11).
6. **Eine Sprache:** Fluff-o-lect mit Lexikon und Triplet (Fluff-Wort · Glyphe · Bedeutung). Keine erfundenen Einzelsprachen.
7. **Gemeinsame Welt-Tonart:** Alle Stimmen laufen auf der Musik-Uhr im Story-Mode. Mehrere Figuren ergeben ein Ensemble.
8. **Kultur nur abstrahiert und dokumentiert** (§12).

## 1 · Datenschema: acht Genome plus KFB-Felder
Feld `chatter` je Figur in der Besetzungsliste (`cast.r1.json`):

```ts
type ChatterboxCharacter = {
  id: string; seed: number;
  voice: VoiceGenome;          // Klang-Identität
  language: LanguageGenome;    // Fluff-o-lect-Dialekt
  nature: NatureGenome;        // Bio-Phoneme
  music: MusicGenome;          // Motiv, Stil, Operationen
  emotion: EmotionGenome;      // Grundgefühl und Gewichte
  context: ContextGenome;      // Raum, Situation, Story-Mode (zur Laufzeit)
  social: SocialGenome;        // Status, Alter, Beruf, Gruppe
  interaction: InteractionGenome; // Reaktionen, Calls, Beziehung
  output: OutputSpec;          // Viseme, Augen, Glyphen
};
```

### 1.1 Voice Genome (Identität)
```ts
type VoiceGenome = {
  timbre: { warmth: 'warm'|'cold'; core: 'breathy'|'clear'|'nasal'|'metallic'|'odd' };  // Klangwirkung, nicht Bauart
  instrument: string;          // Kandidat aus §3
  register: 'bass'|'tenor'|'alto'|'soprano';
  basePitchHz: number;         // 90–700
  rangeSemitones: number;      // 5–10 Alltag, 12–18 extrem
  eventRate: number;           // 3–7 pro s, 7–9 nur kurz
  tempoCharacter: 'hectic'|'neutral'|'chill';
  vibrato: { rateHz: number; depthCents: number };
  formantShift: number;
  articulation: 'legato'|'staccato'|'patter'|'glide'|'irregular';
  dynamics: 'whisperer'|'normal'|'boomer';
  soundShape: 'round'|'spiky'|'metallic'|'rough'|'glittering';
  fx: string[];                // höchstens 2–3, z. B. 'octave-down+dark-hall' (Demon Lord)
  signature: string;           // Signatur-Ornament bzw. Leitmotiv-ID (V-616)
};
```

### 1.2 Language Genome (Fluff-o-lect-Dialekt)
```ts
type LanguageGenome = {
  lexicon: 'fluffolect';       // gemeinsames Lexikon, Kodierung V-505
  detail: 'L1'|'L2';           // L1 ein Ton je Wort (V-508); L2 Silben-Motiv für Nahdialog bzw. Hauptfiguren (Georg-Entscheid offen)
  dialect: { base: string; variantSeed: number; favInterval: number; ornamentVariant: number; intonationBias: number };
  stress: 'initial'|'final'|'penultimate'|'irregular';
  particles: string[];         // wiederkehrende Fluff-Partikel (Catchphrase)
  foreignness: number;         // 0–0,2 vertraut … über 0,6 nur Boss, Ritual, Alien
};
```
- **Lexikon-Motive:** Jedes Lexikon-Wort hat ein festes Motiv, abgeleitet aus dem Fluff-Wort, bei allen Figuren gleich und nur in deren Stimme gefärbt. Dadurch ist die Sprache lernbar (Dekodieren V-500).
- **Dialekt aus Textur-Varianten:** Varianten einer Figur teilen den Grund-Dialekt, mit kleinen festen Abweichungen.

### 1.3 Nature Genome (Bio-Phoneme)
- **Vokal:** Tropfen, weicher Tierlaut, Sinus-Blip.
- **Konsonant:** Holz-Klick, Zweig-Knack, Stein-Tick.
- **Frikativ:** Blätter, Wind, Sporen.
- **Nasal:** Hum.
- **Ausruf:** Vogelruf, Grunzen, Plopp.

Regeln:
- Natur-Grains 20–400 ms aus längeren Clips schneiden.
- Mischung etwa 60 % Natur und 40 % Synthese.
- Natur-Samples nur ±3–7 Halbtöne verschieben, sonst Formant bzw. Filter.
- Übergänge 5–20 ms.

**Ökosysteme passend zu KFB:** Fluff-Wald, Farm, Pilzwald, Bucht bzw. Tiefsee, Ruine, Canyon.

### 1.4 Music Genome (Motiv, Stil, Operationen)
```ts
type MusicGenome = {
  motif: number[];             // 3–7 Halbtonschritte, 0,5–3 s
  style: 'march'|'polka'|'swing'|'baroque'|'blues'|'funk-disco'|'bossa'|'klezmer'|'western'|'surf'|'space'|'gospel'|'house'|'minimal'|'e-funk'|'classical';
  register: 'acoustic'|'electronic'|'crossover';
  operations: ('transpose'|'invert'|'retrograde'|'augment'|'diminish'|'stretto'|'canon'|'fugue')[];
};
```

**Fugen-Grammatik:**

| Operation | KFB-Bedeutung |
|---|---|
| Thema | Leitmotiv |
| Antwort in der Quinte | Zustimmung |
| Umkehrung | Ablehnung (Bongo) |
| Krebs | Blödsinn bzw. Verwirrung |
| Augmentation bzw. Diminution | gechillt bzw. hektisch |
| Engführung | Streit |
| Kanon | Rivalen |
| Modulation | Story-Fortgang |
| Goldberg-Variation | Dialekt |

**Stil als Gruppen-Ebene:** Gleicher Stil antwortet und harmoniert miteinander, fremder Stil klingt fremd. Insel-Grundton (Vorschlag, Georg entscheidet): O-Town Funk/Disco, Bucht Surf, Canyon Western, Farm Polka, Aliens Space, Utopia-Bürokratie Marsch.

### 1.5 Emotion Genome
Grundgefühl je Figur plus Laufzeit-Zustand. **Neun Emotionen** (zusammengeführt aus R1.3 und der Recherche):

| Emotion | Tempo | Lautheit | Tonhöhe bzw. Skala | Kontur | Artikulation |
|---|---|---|---|---|---|
| neutral | 1,0 | mittel | Grundton | Bogen | normal |
| froh | +10–30 % | mittel bzw. laut | höher, Dur, Sprünge aufwärts | steigend | leicht, staccato |
| traurig | −20–40 % | leise | tiefer, Moll, fallende Sekunden | fallend | weich, legato |
| genervt | +0–10 % | mittel | kleine Sekunden, Tonwiederholung | flach mit Seufzer-Glissando | abgehackt |
| aggressiv | +10–25 % | laut | tiefes Register, Tritonus | abrupt | hart |
| introspektiv | −20–30 % | sehr leise | dorisch, Halteton | schwebend, Pausen | weich |
| ängstlich | unregelmäßig | unruhig | hoch, Halbton-Zittern | springend | gehackt, Vibrato |
| staunend bzw. überrascht | kurz | akzentuiert | Sprung aufwärts | abrupt | perkussiv |
| zärtlich | −10 % | leise | mittel | bogenförmig | weich |

Regeln:
- Höchstens 2–3 Parameter gleichzeitig stark verändern.
- Wechsel mit 150–300 ms Übergang.
- Nach 3–5 Phrasen zurück zum Grundgefühl.

### 1.6 Context Genome (zur Laufzeit)
- **Story-Mode** (V-292) = Welt-Tonart:

| Modus | Tonart |
|---|---|
| Tragic | äolisch |
| Comic | mixolydisch |
| Absurd | Ganzton bzw. chromatisch |
| Heroic | lydisch |
| Mystical | Pentatonik mit Tritonus-Schimmer |
| Forbidden | phrygisch |

- **Situation:** Begrüßung, Gerücht, Handel, Streit, Lied sowie die Arbeitsmodi nach Arendt: **Arbeit** (beschwingtes Arbeitslied, zyklisch), **Herstellen** (Aufbau-Motiv mit Kadenz), **Handeln** (Bühnenstimme bzw. Kayfabe).
- **Raum:**

| Raum | trocken | Hall | Tempo | Ebenen |
|---|---|---|---|---|
| Shop | 0,8–1,0 | 0–0,3 s | 0,9–1,1 | 1–2 |
| Kampf | 0,5–0,8 | 0,2–0,6 s | 1,2–1,4 | 2–4 |
| Traum | 0,2–0,5 | 2–5 s | 0,6–0,8 | 1–3 |
| Ruine | 0,3–0,6 | 1–3 s | 0,7–0,9 | 1–2 |
| Ritual | 0,4–0,7 | 1,5–4 s | 0,6–0,9 | 2–4 |
| Reise | 0,6–0,9 | 0,2–0,8 s | 0,9–1,2 | 2–3 |

- Mischung, Lautheit und Gemurmel macht die Audio-Slice beim Ausspielen.

### 1.7 Social Genome
- Status, Alter, Beruf, Formalität, Gruppe bzw. Fraktion (Deck, Insel, Volk).
- **Status** = Tempo, Tiefe, Pausen. **Beruf** = Klangvokabular und Motiv-Gewohnheit. **Alter** = Vibrato bzw. Wackeln.
- **Stimmfach wie in der Oper:** Weise tief und ruhig, Furien hoch und virtuos, Volksfiguren mit eigenem kleinen Instrument.

### 1.8 Interaction Genome
- **Vier Social Calls** als feste Motive in jeder Stimme (V-292):
  - Bingo = Zustimmung, Kadenz aufwärts aufgelöst;
  - Bongo = Ablehnung, fallende Quarte abgebrochen;
  - Boggle = Verwirrung, Frage ohne Auflösung;
  - Blödsinn = chromatischer Rutsch, „wah-wah“.
- **Reaktion auf den Spieler:** Echo (200–600 ms), Transposition (+5 bei Erfolg, −4 bei Misserfolg), Umkehrung, Rhythmus-Imitation, Kontrasubjekt, emotionaler Spiegel.
- **Beziehung als Harmonie:** befreundet Terzen bzw. Sexten, uneins Sekunden bzw. Tritonus, verliebt Einklang, Rivalen Kanon.
- **Rezitativ und Arie:** normale Zeilen sprechnah, Höhepunkte melodisch.

### 1.9 Output
Ein Ereignis-Strom treibt alles gleichzeitig:
- Note und Ton;
- Mund (Visem-light: zu, offen, rund, breit am `KFB_Mouth`);
- Augen, Brauen und Lider (Emotion, Augen-Rig v6);
- Glyphen-Enthüllung in der Blase.

## 2 · Klangfarben-Matrix (Kandidaten, nach Wirkung sortiert)
| Kern \ Wärme | warm | kalt |
|---|---|---|
| hauchig | Flöte, Okarina (Dory), Panflöte | Glasflöte |
| klar | Klarinette (Lorekeeper), Horn | Oboe, Geige im Flageolett |
| nasal | Saxophon, Akkordeon (Farmer B), Mundharmonika, Talkbox | gestopfte Trompete, Vocoder |
| metallisch | Posaune mit Dämpfer (FB), Tuba | Trompete, Melodica (Bots) |
| schräg bzw. unheimlich | Kazoo, Fagott (Hunky), Maultrommel, TB-303 | Theremin (Aliens), Singende Säge (Geister), Ondes Martenot |

- **Register** als zweite Dimension: Fagott ↔ Oboe, Tuba ↔ Trompete, Cello ↔ Geige.
- **Gestufte Instrumente** (Marimba, Spieluhr, Zupfer) nur als Rhythmus bzw. Ensemble, nicht als Sprechstimme.

## 3 · Voice-FX-Vorlagen (Beispiele)
| Figur | FX |
|---|---|
| Demon Lord | Oktave tiefer, Sättigung, langer dunkler Hall |
| Skelette | höher, hohl (Bandpass), kurzer Gruft-Hall, Klapper-Transient |
| Magic Girls | Formant hoch, heller, schnelleres Vibrato |
| Geister | Säge bzw. Theremin, Chorus, Echo |
| Aliens | leichte Ringmodulation, Gleiten |
| Bots | Melodica, Bitcrush nur im Transient (kein Chiptune, V-616) |
| FrizzleBob | warm, nah, trocken (Stand-up) |

## 4 · Asset-Pipeline
| Quelle | Wofür | Regeln |
|---|---|---|
| **ElevenLabs** (Sound Effects) | emotionale Gesten je Familie (9 Emotionen und 4 Calls), Signatur-Laute, Bio-Phoneme | **immer ≥ 0,8 s erzeugen und lokal schneiden** (kürzer kommt fast stumm zurück); keine Leise-Wörter im Prompt; ein Ereignis je Prompt; `no words, no speech, no reverb`; danach −16 LUFS |
| **Suno** | Motiv-Farm und Soundbed | 1 Farm = 1 Stil + Instrumentfamilie + Emotionsfeld; Solo-Prompts (`chatterbox_r1/SUNO_SOLO_TESTS_R1.md`); Ernte mit `harvest_phrases.py`; Ziel 3–5 Motive und 10–20 Grains je Farm; Vocal-Stem nur als Textur |
| **Vorhandenes** | Basis | Fluff-o-lect-Set, `resident_voices_r1`, Social Calls (ChatterBox Siren/Roger, V-640), Spiel-Sounds für Bio-Phoneme |

**Grain-Längen:** Mikro 5–30 ms, kurz 30–120 ms, mittel 120–400 ms, lang 0,4–2 s.
**Je Familie bzw. Figur:** 4–8 Vokal-, 3–6 Klick-, 2–4 Emotions-Grains, 1–2 Signatur- bzw. Natur-Grains.

## 5 · Laufzeit (WS-Audio)
`speak(character, text, state, context)`:
1. Text → Fluff-Wörter (Lexikon) → Ereignisse (L1 bzw. L2).
2. Motiv bzw. Lexikon-Motiv → Bach-Operationen je Situation und Beziehung.
3. Emotion und Story-Mode → Skala, Tempo, Kontur.
4. Grains wählen (Familie, Dialekt, Seed) → planen auf der Musik-Uhr.
5. FX und Raum.
6. Ausgabe-Ereignisse für Mund, Augen und Glyphen.

**Grundlage** ist die vorhandene Melodie-Sprache (`40_AUDIO/kfb_language_r1`, probe_r10), kein Neubau.

## 6 · Anti-Nerv-Regeln
1. Höchstens 6–9 Ereignisse je Äußerung, Pausen 150–600 ms zwischen Phrasen.
2. Silben-Grains 80–250 ms, Klicks 10–60 ms, höchstens 1–3 Klicks je Phrase.
3. Keine Dauerschleife über 2–4 s, mindestens 15–25 % Variation bei Wiederholung.
4. Keine stechenden Höhen (Dauer-Energie über etwa 3 kHz begrenzen), weiche Einsätze.
5. Konsonant zum Soundbed bzw. Story-Mode, Dissonanz nur kurz als Emotion.
6. Lange Reden werden Zeile für Zeile kürzer und leiser. Höchstens 2–3 Stimmen gleichzeitig hörbar.
7. Hall über 2,5 s nur für Geister, Traum, Ritual, Tiefsee.
8. **Hörtest:** 3 Minuten Dauer-Dialog je Familie.

## 7 · Ethik und Kultur
- Keine realen Ethnien, Sprachen, Akzente oder religiösen bzw. rituellen Klangcodes als Abkürzung.
- Für jede Gruppe dokumentieren: Inspiration, Abwandlung, Zielwirkung.
- Interne Prüfung auf Stereotype, früh mit verschiedenen Hörern testen.

## 8 · Erfolgskriterien
1. Wer spricht, ist nach 2–3 Äußerungen erkennbar.
2. Das Gefühl ist nach 5–10 Äußerungen erkennbar.
3. Nach 20+ Wiederholungen nervt es nicht.
4. Reagiert plausibel im Kontext.
5. Funktioniert ohne Sprachverständnis (Blase, Mimik).
6. Motive sind wiedererkennbar, nie monoton.
7. Ensemble klingt im Story-Mode zusammen.

## 9 · Bauplan und Zuständigkeit
| Phase | Inhalt | Wer |
|---|---|---|
| 1 Engine | Schema, Grain-Loader, Planung auf der Musik-Uhr, Bach-Operationen, Emotion und Story-Mode, Ausgabe-Ereignisse, aus probe_r10 | WS-Audio |
| 2 Casting | Bereich im Sound-Studio (V-390): Figur wählen, Genome einstellen, Testzeile, Seeds, Profil speichern | WS-Audio bzw. WSA |
| 3 Material | Suno-Testsongs ernten → Motiv-Farmen; ElevenLabs-Gesten je Familie (Bandbreiten-Test, Budget bis 10.000 Credits, nur mit Georgs Go); Bio-Phoneme aus vorhandenen Sounds | WS0 |
| 4 Spiel | Begrüßungen, Gerüchte, Calls, Spieler-Reaktionen, NPC-Gespräche, Ensemble-Szenen | WS-NPC, WS1 |
| Profile | Chatter-Profile für die ersten 15 Figuren aus den Dramatis Personae, dann alle | WS0 |

## 10 · Offen für Georg
1. L2 (Silben-Motiv im Nahdialog) als Erweiterung von V-508: ja?
2. Stile und ihre Zuordnung zu Inseln?
3. Beziehung als Harmonie: ja?
4. Startfamilien für den Bandbreiten-Test (aus §2)?
