# CHATTERBOX_MASTER_CONCEPT.md  
**KFB Chatterbox · Gesamtkonzept für prozedurale Charakterstimmen · v1.0 · 2026-10-22**  
**Grundlage:** `RESEARCH_CHATTERBOX_R1.md`, `R2.md`, `R3.md`, `R4.md`, `replies/CHATTERBOX_VOICE_KONZEPT_R1.md` (R1.3).

## 0 · Vision

KFB-Chatterbox ist kein Text-to-Speech-System und kein klassisches Voice Acting. Es ist ein **prozedurales Stimm-Ökosystem**: 60+ Charaktere sprechen durch kurze Grains, instrumentale Motive, Sprachmelodien, Naturtexturen und kontextabhängige Effekte.

Die Stimme transportiert nicht primär Wörter, sondern:

- **Identität:** Wer ist diese Figur?
- **Emotion:** Wie fühlt sie sich?
- **Kultur:** Aus welchem Volk oder Ökosystem stammt sie?
- **Status:** Welche Rolle spielt sie in der Welt?
- **Reaktion:** Wie antwortet sie auf Spieler und Welt?

Verständlichkeit leisten Untertitel, Mimik, Animation, Kontext und Gameplay. Die Chatterbox macht daraus **hörbare Persönlichkeit**.

### Design-Prinzipien

1. **Wenig Material, starke Variation.** Kölner Minimal statt 60 unabhängiger Sound-Designs.
2. **Motiv statt Zufall.** Jeder Charakter hat ein 3–7-Event-Motiv.
3. **Emotion ist ein Layer, keine neue Stimme.**
4. **Kontext verändert die Stimme, ohne die Identität zu zerstören.**
5. **Natur ist Grammatik, nicht nur Kulisse.**
6. **Klangform ist Charakterform.**
7. **Klar nicht-menschlich ist meist besser als fast menschlich.**
8. **Kultur braucht Transformation, Dokumentation und Review.**

---

## 1 · Die acht Genome

Jede KFB-Stimme besteht aus acht kombinierbaren Genomen:

```text
1. Voice Genome       Instrument, Register, Timbre, Artikulation
2. Language Genome    Phonologie, Silben, Prosodie, Partikel
3. Nature Genome      Bio-Phoneme, Ökosystem, Texturen
4. Music Genome       Motiv, Bach-Operationen, Rhythmus
5. Emotion Genome     Tempo, Kontur, Dynamik, Filter
6. Context Genome     Raum, Kampf, Traum, Shop, Ritual
7. Social Genome      Herkunft, Status, Alter, Beruf, Register
8. Interaction Genome Reaktion auf Spieler und andere NPCs
```

### Gesamtschema

```ts
type ChatterboxCharacter = {
  id: string;
  name: string;
  voice: VoiceGenome;
  language: LanguageGenome;
  nature: NatureGenome;
  music: MusicGenome;
  emotion: EmotionGenome;
  context: ContextGenome;
  social: SocialGenome;
  interaction: InteractionGenome;
  seed: number;
};
```

---

## 2 · Voice Genome

### Zweck

Das Voice Genome definiert die **klangliche Identität**: Instrument, Register, Timbre, Artikulation und Effekt-Signatur.

```ts
type VoiceGenome = {
  family: 'woodwind' | 'brass' | 'string' | 'keyboard' | 'synth' | 'percussion' | 'organic';
  instrument: string;
  basePitchHz: number;
  rangeSemitones: number;
  syllableRate: number;
  vibrato: { rateHz: number; depthCents: number };
  formantShift: number;
  articulation: 'legato' | 'staccato' | 'patter' | 'triplet' | 'irregular';
  fx: string[];
  soundShape: 'round' | 'spiky' | 'metallic' | 'rough' | 'glittering';
};
```

### Regeln

- Grundton meist 90–700 Hz.
- Pitch-Range: 5–10 Halbtöne für Alltagsfiguren, 12–18 für extreme Charaktere.
- Silbenrate: 3–7 Events/s komfortabel, 7–9 nur kurz für Erregung.
- Maximal 2–3 dominante Effekte pro Stimme.
- Jede Stimme braucht eine `soundShape`.

### Beispiele

| Charakter | Instrument | Pitch | Rate | Shape |
|---|---|---:|---:|---|
| Nervöser Erfinder | Oboe | 420–520 Hz | 6–8/s | spiky |
| Träger Bär-Mech | Tuba | 90–150 Hz | 2–3,5/s | round |
| Moos-Spross | Glass Flute | 240–320 Hz | 3–5/s | round |
| Rost-Krieger | Distorted Tuba | 100–170 Hz | 3–5/s | rough |
| Sonar-Wächter | FM-Ping / Theremin | 300–800 Hz | 4–7/s | metallic |

---

## 3 · Language Genome

### Zweck

Das Language Genome definiert, **wie** eine Stimme sprachlich organisiert ist: Phoneme, Silben, Betonung, Wortlänge, Prosodie und wiederkehrende Partikel.

```ts
type LanguageGenome = {
  phonemes: string[];
  syllablePatterns: string[];
  stress: 'initial' | 'final' | 'penultimate' | 'irregular';
  wordLength: [number, number];
  prosody: 'legato' | 'staccato' | 'chant' | 'patter' | 'gliding';
  particleSuffixes: string[];
  foreignness: number; // 0..1
};
```

### Regeln

- 8–14 Kern-Phoneme pro Volk.
- Silbenmuster: `CV` freundlich, `CVC` neutral, `CCVC`/Cluster hart oder fremd.
- Wortlänge: 1–3 Silben prägnant, 3–5 erzählerisch, über 5 ritualhaft.
- Fremdheits-Budget: 0–20 % vertraut, 20–40 % leicht fremd, 40–60 % deutlich fremd, über 60 % nur für Boss/Ritual/Alien.
- Klicks sind Konsonanten-Events: 10–60 ms, mit Vokal-Grain kombiniert.

### Beispiel: Rostvolk

```ts
{
  phonemes: ['a','o','u','k','g','r','z','x'],
  syllablePatterns: ['CV','CVC','CCV'],
  stress: 'initial',
  wordLength: [1,3],
  prosody: 'staccato',
  particleSuffixes: ['-ak','-urz'],
  foreignness: 0.45
}
```

---

## 4 · Nature Genome

### Zweck

Das Nature Genome übersetzt Naturklänge in **Bio-Phoneme**: organische Konsonanten, Vokale, Interjektionen und Raum-Charakter.

```ts
type NatureGenome = {
  ecosystem: 'forest' | 'farm' | 'deep-sea' | 'insect' | 'swamp' | 'mountain' | 'ruin';
  sources: string[];
  bioPhonemes: {
    vowels: string[];
    consonants: string[];
    interjections: string[];
  };
  textureAmount: number; // 0..1
  roomCharacter: 'dry' | 'wooden' | 'metallic' | 'watery' | 'cavernous';
};
```

### Bio-Phonem-Map

| Funktion | Naturquelle |
|---|---|
| Vokal | Wassertropfen, weicher Tierlaut, Sinus-Blip |
| Konsonant | Holz-Click, Zweig-Knack, Stein-Tick |
| Frikativ | Blätter, Wind, Zischen, Sporen |
| Nasal | weicher Hum, gedämpfter Brummklang |
| Interjektion | Vogelruf, Tiergrunz, Plopp |

### Regeln

- Natur-Grains auf 20–400 ms kürzen.
- 60 % Natur-Grain + 40 % Synthese ist meist ideal.
- Pitch-Shift bei organischen Samples nur ±3–7 Halbtöne.
- Formant-/Filter-Shift ist oft natürlicher als starke Playback-Rate-Änderung.
- Crossfades von 5–20 ms vermeiden Klicks.

---

## 5 · Music Genome

### Zweck

Das Music Genome erzeugt Wiedererkennung durch **Bach-Operationen**: Motive werden transformiert, nicht identisch wiederholt.

```ts
type MusicGenome = {
  motif: number[]; // 3–7 Halbtonschritte
  rhythm: 'legato' | 'staccato' | 'patter' | 'triplet' | 'irregular';
  operations: ('transpose' | 'invert' | 'retrograde' | 'augment' | 'diminish' | 'canon' | 'fugue')[];
  callResponse: boolean;
  seed: number;
};
```

### Operationen

```text
Motiv M = [0, 4, 7, 5]

Transposition:  M + n
Umkehrung:      M -> [-m for m in M]
Krebs:          M reversed
Augmentation:   Dauer x 2
Diminution:     Dauer x 0.5
Engführung:     Einsatzabstand < Motivlänge
Kanon:          zweite Stimme = transformiertes M mit Delay
Fuge:           Thema + Antwort + Kontrasubjekt
```

### Regeln

- Jeder Charakter: 3–7-Event-Motiv.
- Bei Wiederkehr mindestens eine Transformation.
- Modulation nur an Phrasen- oder Szenengrenzen.
- Call-and-Response zwischen NPC und Spieler oder zwischen zwei NPCs.
- Motivlänge in der Chatterbox: 0,5–3 s.

---

## 6 · Emotion Genome

### Zweck

Das Emotion Genome übersetzt Gefühl in hörbare Parameter: Tempo, Kontur, Dynamik, Artikulation, Filter und Timbre-Drift.

```ts
type EmotionGenome = {
  default: 'neutral' | 'joy' | 'sadness' | 'anger' | 'fear' | 'tenderness' | 'boredom' | 'surprise';
  weights: Record<string, {
    tempo: number;
    pitch: number;
    loudness: number;
    contour: 'rising' | 'falling' | 'abrupt' | 'erratic' | 'flat';
    articulation: 'light' | 'soft' | 'hard' | 'chopped';
  }>;
};
```

### Emotions-Matrix

| Emotion | Tempo | Lautstärke | Pitch | Kontur | Artikulation |
|---|---|---|---|---|---|
| Freude | +10–30 % | mittel/laut | höher | steigend | leicht |
| Trauer | −20–40 % | leise/mittel | tiefer | fallend | weich |
| Wut | +10–25 % | laut | mittel/tief | abrupt | hart |
| Angst | unregelmäßig | unruhig | hoch/instabil | springend | gehackt |
| Zärtlichkeit | langsam/mittel | leise | mittel | bogenförmig | weich |
| Langeweile | langsam | leise | flach | repetitiv | verschliffen |
| Überraschung | sehr kurz | akzentuiert | Sprung nach oben | abrupt | perkussiv |

### Regeln

- Emotion ist probabilistisch, nicht deterministisch.
- Maximal 2–3 Parameter gleichzeitig stark verändern.
- Emotionswechsel brauchen mindestens 150–300 ms Übergang.
- Kein permanenter Extremzustand; nach 3–5 Phrasen zurück zum Default.

---

## 7 · Context Genome

### Zweck

Das Context Genome bestimmt, **wo und wann** eine Stimme spricht: Raum, Distanz, Kampf, Traum, Ritual oder Reise.

```ts
type ContextGenome = {
  current: 'shop' | 'combat' | 'dream' | 'ruin' | 'ritual' | 'travel';
  dryness: number;
  reverb: number;
  tempoScale: number;
  pitchDrift: number;
  layerCount: number;
  fx: string[];
};
```

### Kontext-Regeln

| Kontext | Dryness | Reverb | Tempo | Layer |
|---|---:|---:|---:|---:|
| Shop | 0,8–1,0 | 0–0,3 s | 0,9–1,1 | 1–2 |
| Combat | 0,5–0,8 | 0,2–0,6 s | 1,2–1,4 | 2–4 |
| Dream | 0,2–0,5 | 2–5 s | 0,6–0,8 | 1–3 |
| Ruin | 0,3–0,6 | 1–3 s | 0,7–0,9 | 1–2 |
| Ritual | 0,4–0,7 | 1,5–4 s | 0,6–0,9 | 2–4 |
| Travel | 0,6–0,9 | 0,2–0,8 s | 0,9–1,2 | 2–3 |

### Regeln

- Kontext verändert Parameter, nicht die Charakter-Identität.
- Maximal 4 Layer gleichzeitig.
- Übergänge mindestens 200–500 ms, besser beat- oder phrase-synchron.
- Kein permanenter Hall über 3 s außer in Traum, Ritual oder Tiefsee.

---

## 8 · Social Genome

### Zweck

Das Social Genome macht Völker und Figuren **sozial hörbar**: Herkunft, Status, Alter, Beruf und Formalität.

```ts
type SocialGenome = {
  region: 'north' | 'south' | 'underground' | 'sky' | 'coast';
  status: 'low' | 'middle' | 'high';
  age: 'child' | 'young' | 'adult' | 'old';
  profession: 'farmer' | 'engineer' | 'doctor' | 'merchant' | 'artist' | 'guard';
  formality: 'casual' | 'neutral' | 'formal';
};
```

### Regeln

- Dialekt = Phonologie-Drift innerhalb einer Sprachfamilie.
- Register = Timing, Artikulation, Pitch-Variation.
- Status = Tempo, Tiefe, Pausen, Raum.
- Beruf = Klang-Vokabular und Motiv-Gewohnheit.
- Akzent darf Identität markieren, aber nie die einzige Charakterisierung sein.

### Beispiel

**Rostvolk-Bürokrat:** metrisch, formal, tiefer, wenig Pitch-Variation.  
**Rostvolk-Straßenkind:** schnell, hoch, unregelmäßig, viele Klicks und Abbrüche.

---

## 9 · Interaction Genome

### Zweck

Das Interaction Genome macht die Chatterbox **spielabhängig**: Sie reagiert auf Spieleraktionen, Items, Erfolg, Misserfolg und andere NPCs.

```ts
type InteractionGenome = {
  echo: boolean;
  transposeResponse: number; // Halbtöne
  invertResponse: boolean;
  rhythmImitation: boolean;
  emotionalMirror: boolean;
  responseDelayMs: number;
};
```

### Reaktions-Modi

1. **Echo:** Spieler-Blip nach 200–600 ms wiederholt.
2. **Transposition:** +3, +5 oder −4 Halbtöne.
3. **Umkehrung:** invertierte Kontur.
4. **Rhythmus-Imitation:** gleiches Timing, andere Pitch.
5. **Kontrasubjekt:** rhythmisch kontrastierende Antwort.
6. **Emotional Mirror:** Tempo/Lautstärke gespiegelt, Emotion verschoben.

### Beispiel

```text
Spieler sammelt Item → kurzer Spieler-Blip
NPC antwortet nach 350 ms
Erfolg: +5 Halbtöne, heller
Misserfolg: −4 Halbtöne, gedämpfter
```

---

## 10 · Asset-Pipeline

### 10.1 Grain-Bank

Pro Charakter bzw. Sprachfamilie:

```text
4–8 Vokal-Grains
3–6 Konsonanten-/Klick-Grains
2–4 Emotions-Blips
1–2 Signature-Sounds
1–2 Natur-Texturen
```

Grain-Längen:

```text
Micro-Grain: 5–30 ms
Short Grain: 30–120 ms
Medium Grain: 120–400 ms
Long Grain: 0,4–2 s
```

### 10.2 ElevenLabs

- Offline im Build-Prozess generieren.
- Pro Prompt nur ein Event.
- Dauer explizit angeben: 60–400 ms.
- `no words, no speech`, `no reverb` für spätere Verarbeitung.
- Pro Charakter 8–16 Grains.

### 10.3 Suno

Suno ist eine **Motiv-Farm**, kein Stimmen-Lieferant.

```text
1 Farm = 1 Volk + 1 Instrumentfamilie + 1 Emotionsfeld
```

- Erst 1–2 kurze Test-Runs.
- Bei guter Ausbeute: 3–4-Minuten-Motiv-Farm.
- Stems trennen: Instrument, Vocal-Textur, Percussion/Clicks.
- Vocal-Stem nur als Textur, nicht als Hauptstimme.
- Ziel: 3–5 Motive und 10–20 Grain-Kandidaten pro Farm.

### 10.4 Web Audio Runtime

```ts
speak(character, text, state, context) {
  const genome = getGenome(character);
  const events = toEvents(text, genome.language);
  const motif = transformMotif(genome.music, state, context);
  const melody = applyEmotion(motif, genome.emotion, state);
  const grains = selectGrains(genome, events, context);
  scheduleGrains(grains, melody, context);
}
```

---

## 11 · Anti-Nerviness-Regeln

1. Maximal 6–9 Events pro Äußerung.
2. Grain-Länge 80–250 ms für Silben, 10–60 ms für Klicks.
3. Pausen 150–600 ms zwischen Phrasen.
4. Kein Dauer-Loop über 2–4 Sekunden.
5. Mindestens 15–25 % Variation bei Wiederholung.
6. Maximal 2–3 dominante Effekte.
7. Klick-Dichte: 1–3 pro Phrase.
8. Hall über 2,5 s nur für Geister, Traum, Ritual, Tiefsee.
9. Emotionale Extreme nur kurz.
10. Untertitel, Mimik oder Animation sichern die Bedeutung.

---

## 12 · Ethik & Kultur

1. Keine realen Ethnien, Sprachen oder Akzente als Charakter-Shortcut.
2. Klicksprachen, Pentatonik, „Stammes“-Perkussion: nur als abstrahierte, transformierte Struktur.
3. Für jedes Volk dokumentieren: inspirierende Referenzen, Transformation, Zielwirkung.
4. Interne Review auf Stereotype und unangenehme Assoziationen.
5. Früh Tests mit unterschiedlichen Hörerinnen und Hörern.
6. Keine religiösen oder rituellen Klangcodes ohne klare fiktionale Distanz.

---

## 13 · WS0 Build Plan

### Phase 1 — Core Engine

1. `ChatterboxCharacter` JSON-Schema.
2. Grain-Bank-Loader.
3. Web-Audio-Engine: Grain-Scheduling, Pitch, Gain, Filter, Vibrato.
4. Motiv-Transformationen: Transposition, Umkehrung, Krebs, Augmentation, Diminution.
5. Emotions-Layer.
6. Context-Layer.

### Phase 2 — Voice Lab

1. Charakter-Auswahl.
2. Slider für Pitch, Rate, Range, Vibrato, Formant, FX.
3. Testtext-Eingabe.
4. Seed-Varianten.
5. Audio-Preview und Export.
6. JSON-Speicherung.

### Phase 3 — Asset Farming

1. ElevenLabs-Grain-Pipeline.
2. Suno-Motiv-Farm-Templates.
3. Stem-Ernte und manuelle Kuratierung.
4. Natur-Sample-Bibliothek.
5. Qualitätsfilter für Grains.

### Phase 4 — World Integration

1. Context-Steuerung durch Gameplay.
2. Call-and-Response mit Spieler.
3. NPC-zu-NPC-Dialoge.
4. Adaptive Layer.
5. Untertitel- und Reaktionssystem.

---

## 14 · Erfolgskriterien

Eine KFB-Chatterbox ist erfolgreich, wenn:

1. Man nach 2–3 Äußerungen erkennt, **wer** spricht.
2. Man nach 5–10 Äußerungen erkennt, **wie** sich die Figur fühlt.
3. Die Stimme nach 20+ Wiederholungen nicht nervt.
4. Die Stimme im Kontext plausibel reagiert.
5. Die Bedeutung auch ohne Sprachverständnis funktioniert.
6. Die Stimme klar nicht-menschlich oder bewusst unheimlich ist.
7. Die Motive wiedererkennbar, aber nie monoton sind.
8. Die Produktion mit 60 Suno-Credits/Monat skalierbar bleibt.

---

## 15 · Nächste Schritte

1. `ChatterboxCharacter` JSON-Schema finalisieren.
2. 12 Voice Archetypes definieren.
3. 8–12 KFB-Sprachfamilien festlegen.
4. Erste 10 Charaktere im Voice Lab bauen.
5. Erste 3 Suno-Motiv-Farmen planen.
6. Erste Natur-Grain-Bank aus bestehenden Game-Sounds ableiten.
7. WS0-Engine-Prototyp in Web Audio bauen.
