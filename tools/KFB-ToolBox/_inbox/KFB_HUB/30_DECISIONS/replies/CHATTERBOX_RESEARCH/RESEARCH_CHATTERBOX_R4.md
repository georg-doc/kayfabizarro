# RESEARCH_CHATTERBOX_R4.md  
**Chatterbox-Stimmen · Wahrnehmung, Identität, Adaptivität & Ethik · R4 · 2026-10-22**  
**Grundlage:** `RESEARCH_CHATTERBOX_R1.md`, `R2.md`, `R3.md`, `replies/CHATTERBOX_VOICE_KONZEPT_R1.md` (R1.3).  
**Ziel:** Die restlichen Recherchefelder so aufbereiten, dass sie direkt in das Gesamtkonzept und die WS0-Engine überführt werden können.

## 0 · Kernaussage

R1–R3 liefern die **Klangmaterialien und Grammatiken**. R4 liefert die Ebenen, die entscheiden, ob diese Materialien **wahrgenommen, erinnert, akzeptiert und ethisch verantwortbar** sind:

1. Sound Symbolism — warum ein Klang weich, spitz, freundlich oder bedrohlich wirkt.
2. Voice Uncanny Valley — wann eine Stimme charmant und wann unheimlich wird.
3. Adaptive Audio — wie Stimmen auf Spielzustand und Spieler reagieren.
4. Audio Branding — wie Figuren hörbar wiedererkennbar werden.
5. Soziolinguistik — wie Dialekte, Register und Identität hörbar werden.
6. Interaktive Stimme — Call-and-Response mit dem Spieler.
7. Sprachwahrnehmung — wann Blips als Sprache erlebt werden.
8. Ethik & Kultur — wie ihr Stereotype vermeidet.

---

## 1 · Sound Symbolism & Bouba/Kiki

### Befund

Der Bouba/Kiki-Effekt beschreibt eine systematische Zuordnung: abgerundete Formen werden häufiger mit weichen, stimmhaften Lauten wie „bouba“ assoziiert, spitze Formen mit schärferen Lauten wie „kiki“. Der Effekt wurde in vielen Sprachen und Kulturen repliziert, ist aber nicht absolut universell. [web:117][web:120][web:122]

Für KFB ist das kein Esoterik-Feature, sondern eine **Form-Sprache**: Klangfarbe, Artikulation und Kontur können visuelle Eigenschaften und Persönlichkeit vorhören lassen.

### Regeln

| Klangform | Akustische Merkmale | KFB-Charakter |
|---|---|---|
| Bouba / rund | tiefe bis mittlere Frequenz, legato, weiche Attack, Vokale `o`, `u`, `a` | Moos, Pflanze, Farmer, freundlicher Riese |
| Kiki / spitz | hohe Frequenz, staccato, harte Attack, Frikative `k`, `t`, `s` | Insekt, Roboter, Trickster, Alarm-Wesen |
| Glatt / metallisch | Sinus/FM, wenig Noise, präzise Transients | Uhrwerk, Bürokrat, Tech-Volk |
| Rau / organisch | Noise, Distortion, unregelmäßige Grains | Pilz, Ork, Wildnis, Monster |
| Glitzernd | hohe Sinustöne, schnelle Triller, Hall | Fee, Kristall, Vogel-Bard |

### KFB-Mapping

```ts
soundShape: 'round' | 'spiky' | 'metallic' | 'rough' | 'glittering'
```

Jeder Charakter erhält eine `soundShape`. Sie bestimmt Grain-Auswahl, Filter, Attack, Kontur und bevorzugte Intervalle.

---

## 2 · Voice Uncanny Valley

### Befund

Synthetische Stimmen können Uncanny-Gefühle auslösen, insbesondere wenn sie „fast menschlich, aber leicht falsch“ klingen. Studien zu synthetischen und deviierenden Stimmen zeigen, dass Verzerrungen und pathologische Merkmale die Wahrnehmung von Unheimlichkeit erhöhen können. [web:130] Auch ein Mismatch zwischen Aussehen und Stimme virtueller Charaktere kann die Wahrnehmung negativ beeinflussen. [web:131]

### Die drei Zonen

| Zone | Klangliche Strategie | KFB-Verwendung |
|---|---|---|
| Klar menschlich | echte Stimme, natürliche Prosodie | Erzähler, wichtige Story-Charaktere |
| Klar nicht-menschlich | starke Stilisierung, Instrument, Blips, Formant-Shift | Chatterbox-NPCs, Roboter, Tiere, Pflanzen |
| Uncanny Zone | fast menschlich, aber leicht defekt | bewusst nur für Horror, Geister, kaputte KI |

### Regeln

1. **Keine zufällige Mittellage:** Entweder klar stilisiert oder klar menschlich.
2. **Defekte sichtbar machen:** Roboter dürfen stottern, quantisieren, bitcrushen — aber konsistent.
3. **Geister dürfen schön falsch sein:** Pitch-Drift, Hall, Reverse-Reverb, atonale Endungen.
4. **Kein „fast echter Mensch“ für Comedy:** Das erzeugt schnell Unbehagen statt Humor.
5. **Voice-Appearance-Match:** Pflanzenwesen sollte nicht automatisch eine menschliche Frauenstimme bekommen; besser organische Textur + instrumentale Melodik.

### KFB-Regel

Für 60+ Chatterbox-Charaktere ist die sicherste Zone: **klar nicht-menschlich, aber emotional lesbar.** Die Stimme darf fremd, komisch oder schön sein — aber nicht zufällig halbmenschlich.

---

## 3 · Adaptive Audio: Vertical Layering & Horizontal Resequencing

### Befund

Adaptive Game Audio nutzt vor allem zwei Techniken:

- **Horizontal Resequencing:** vorkomponierte Segmente werden je nach Spielzustand neu angeordnet; Übergänge erfolgen über Crossfades, musikalische Scharniere oder Beat-genaue Schnitte. [web:147][web:149][web:155]
- **Vertical Reorchestration / Vertical Layering:** Instrumental- bzw. Stimm-Layer werden je nach Spielzustand hinzu- oder weggemischt, ohne die Grundstruktur zu verlassen. [web:148][web:150][web:153]

Die meisten modernen Systeme kombinieren beide: Horizontal für große Zustandswechsel, Vertical für feine Intensitätsverläufe. [web:159]

### Für KFB: Context Genome

```ts
type ContextMix = {
  context: 'shop' | 'combat' | 'dream' | 'ruin' | 'ritual' | 'travel';
  dryness: number;       // 0..1
  reverb: number;        // seconds
  tempoScale: number;    // 0.7..1.4
  pitchDrift: number;    // cents
  layerCount: number;    // 1..4
  fx: string[];
};
```

### Regeln

1. **Shop:** trocken, nah, verspielt, 1–2 Layer.
2. **Combat:** schneller, komprimierter, mehr Transients, 2–4 Layer.
3. **Dream:** Hall, Pitch-Drift, langsame Attack, 1–3 Layer.
4. **Ruin:** gefiltert, distant, düster, 1–2 Layer.
5. **Ritual:** chant-artig, langsam, ensemble-fähig, 2–4 Layer.
6. **Travel:** mittel, rhythmisch, motivisch, 2–3 Layer.

### KFB-Mapping

Dieselbe Oboe-Figur kann im Shop 5 Events/s sprechen, im Kampf 7–9 Events/s mit mehr Noise und im Traum 2–3 Events/s mit Hall und Pitch-Drift.

---

## 4 · Audio Branding: Sonic Identity für KFB

### Befund

Audio Branding beschreibt den strategischen Einsatz von Klang zur Identitätsbildung. Sonic Logos sind kurze, wiedererkennbare Klangsequenzen; wirksame Systeme bestehen aus konsistenter Klang-DNA über mehrere Touchpoints, nicht aus einem einzelnen Sound. [web:133][web:139][web:142]

Timbre beeinflusst dabei wahrgenommene Markenpersönlichkeit: Piano wurde eher mit Raffinesse verbunden, Synth-Bass eher mit Rauheit. [web:139] Konsistente, wiedererkennbare Sonic Identities können wahrgenommenen Wert und Kaufabsicht erhöhen. [web:144]

### Für KFB: Audio Signature Kit

Jeder wichtige Charakter bekommt:

```text
1. Signature Motiv: 3–7 Events
2. Catchphrase Grain: 150–400 ms
3. Instrument-Farbe: 1 Hauptinstrument + 1 Modifikator
4. Emotions-Default: neutral, fröhlich, müde, wütend ...
5. Kontur-Gewohnheit: steigend, fallend, abrupt, bogenförmig
6. Wiedererkennungs-Regel: Motiv wird transformiert, nie identisch wiederholt
```

### Regeln

1. **Kürze:** Signaturen 0,3–2,5 s.
2. **Konsistenz:** Gleiches Motiv in Shop, Kampf, Traum und Cutscene.
3. **Variation:** Mindestens 15–25 % Abweichung bei Wiederholung.
4. **Timbre-Code:** Instrument transportiert Persönlichkeit, nicht nur Ästhetik. [web:139]
5. **Kein Logo-Sound für jeden NPC:** Nur 10–20 wichtige Charaktere bekommen ein vollständiges Signature Kit; der Rest nutzt Familien-Motive.

---

## 5 · Soziolinguistik: Dialekt, Register, Identität

### Befund

Soziolinguistik untersucht Sprache im sozialen Kontext: Dialekt, Register, Stil, soziale Identität, Alter, Region, Klasse und Situation beeinflussen, wie gesprochen wird. [web:134][web:140] Dialekt markiert vor allem regionale bzw. soziale Herkunft, Register markiert situationale bzw. berufliche Rollen. [web:134][web:140]

### Für KFB: Social Voice Layer

```ts
type SocialVoiceLayer = {
  region: 'north' | 'south' | 'underground' | 'sky' | 'coast';
  status: 'low' | 'middle' | 'high';
  age: 'child' | 'young' | 'adult' | 'old';
  profession: 'farmer' | 'engineer' | 'doctor' | 'merchant' | 'artist';
  formality: 'casual' | 'neutral' | 'formal';
};
```

### Regeln

1. **Dialekt = Phonologie-Drift:** gleiche Sprachfamilie, andere Grain-Auswahl und Betonung.
2. **Register = Timing und Artikulation:** formell = langsamer, präziser, weniger Pitch-Sprünge; informell = schneller, verschliffener.
3. **Status = Register und Raum:** hohe Statusfiguren sprechen langsamer, tiefer, mit mehr Pause; niedrige Statusfiguren schneller, höher, mit mehr Unterbrechungen.
4. **Beruf = Klang-Vokabular:** Arzt bekommt präzise, klare Konturen; Ingenieur metrische Klicks; Künstler geschwätzige Melodik.
5. **Kein Akzent als Witz:** Akzent darf Identität markieren, aber nicht die einzige Charakterisierung sein.

### KFB-Mapping

**Rostvolk-Bürokrat:** metrisch, formal, tiefer, wenig Pitch-Variation.  
**Rostvolk-Straßenkind:** schnell, hoch, unregelmäßig, viele Klicks und Abbrüche.  
Beide teilen Phonologie und Instrument-Familie, unterscheiden sich aber in Register, Tempo und Kontur.

---

## 6 · Interaktive Stimme: Call-and-Response mit dem Spieler

### Befund

Adaptive Musik reagiert auf Spielzustände und Spieleraktionen durch Layer, Übergänge und motivische Entwicklung. [web:147][web:150][web:157] Für KFB kann das über die reine Reaktion hinausgehen: Die Stimme des Spielers bzw. seiner Aktion wird zum **musikalischen Input**.

### Interaktions-Modi

1. **Echo:** NPC wiederholt den Spieler-Blip nach 200–600 ms.
2. **Transposition:** Antwort liegt +3, +5 oder −4 Halbtöne über dem Input.
3. **Umkehrung:** NPC antwortet mit invertierter Kontur.
4. **Rhythmus-Imitation:** NPC übernimmt das Timing, ändert aber Pitch.
5. **Kontrasubjekt:** NPC antwortet mit rhythmisch kontrastierendem Motiv.
6. **Emotional Mirror:** NPC spiegelt Tempo und Lautstärke, verschiebt aber die Emotion.

### KFB-Mapping

```text
Spieler sammelt Item → kurzer Spieler-Blip
NPC antwortet nach 350 ms mit transponiertem Motiv
bei Erfolg: +5 Halbtöne, heller
bei Misserfolg: −4 Halbtöne, gedämpfter
```

Das macht Dialog hörbar **spielerabhängig**, ohne Sprachsynthese in Echtzeit zu benötigen.

---

## 7 · Sprachwahrnehmung: Wann wird Blip zu Sprache?

### Befund

Sprachwahrnehmung entsteht nicht nur durch Phoneme, sondern durch Gruppierung, Rhythmus, Betonung, Pausen und kontextuelle Erwartung. Phonotaktik beschreibt, welche Lautfolgen in einer Sprache als natürlich bzw. möglich gelten.

### Regeln für „Chatterbox klingt nach Sprache“

1. **Gruppierung:** 2–4 Events bilden eine Silben- bzw. Wort-Einheit.
2. **Pausen:** 150–600 ms zwischen Phrasen; ohne Pausen klingt es wie UI-Sound.
3. **Betonung:** mindestens ein Akzent-Event pro Phrase.
4. **Wiederholung:** Wiederkehrende Partikel erzeugen Sprach-Feeling.
5. **Kontur:** steigend/fallend/abrupt markiert Satztyp.
6. **Reaktion:** Die Stimme muss auf Spieler, Umgebung oder anderen NPC reagieren.

### Anti-Regel

Ein gleichmäßiger Beep-Loop wird nie als Sprache wahrgenommen — er bleibt Soundeffekt. Erst durch **Phrasen, Pausen und emotionale Kontur** entsteht Chatter.

---

## 8 · Ethik, Kultur & Repräsentation

### Befund

Sound Design kann kulturelle Stereotype verstärken, wenn kulturell spezifische Klänge ohne Kontext oder Recherche eingesetzt werden. Empfehlungen aus der Sound-Design-Praxis betonen kulturelle Recherche, Beratung durch Expert:innen und Tests mit diversen Gruppen. [web:161]

### Regeln für KFB

1. **Keine realen Ethnien als Klang-Shortcut:** Klicksprachen, Pentatonik, „Stammes“-Perkussion oder Akzente sind keine Charakterisierungs-Kürzel.
2. **Abstraktion statt Imitation:** Inspiriert euch von Struktur und Wahrnehmung, nicht von konkreten kulturellen Codes.
3. **Dokumentation:** Für jedes Volk festhalten, welche realen Referenzen genutzt wurden und wie sie transformiert wurden.
4. **Interne Review:** Mindestens eine Person ohne Projekt-Blindheit hört Stimmen auf Stereotype und unangenehme Assoziationen.
5. **Spieler-Feedback:** Früh Tests mit unterschiedlichen Hörerinnen und Hörern.

---

## 9 · Gesamtkonzept: Wie R1–R4 zusammenspielen

```text
R1  Cartoon + Fantasiesprachen + Oper + Musical + Elektronik + Bach + Emotion + Suno
R2  Sprachtheorie + Conlangs + Phonologie + Suno-Farming
R3  Natur + Bioakustik + Klicks + Granular + Web Audio
R4  Wahrnehmung + Identität + Adaptivität + Ethik
```

### Die acht Genome

```text
1. Voice Genome      Wer ist die Figur?
2. Language Genome   Welche Phonologie und Prosodie?
3. Nature Genome     Welche organischen Texturen?
4. Music Genome      Welche Motiv-Operationen?
5. Emotion Genome    Wie fühlt sich die Äußerung an?
6. Context Genome    Wo und wann spricht die Figur?
7. Social Genome     Welche Herkunft, Rolle, Register?
8. Interaction Genome Wie reagiert sie auf den Spieler?
```

### Beispiel: „Moos-Spross“

```text
Voice:     weiche Flöte, 260 Hz, Legato
Language:  CV/CVV, penultimate stress, weiche Vokale
Nature:    Blätter, Wassertropfen, Holz-Click
Music:     Motiv [0,4,7,9], Kanon mit sich selbst
Emotion:   neugierig, zärtlich
Context:   Wald = trocken/nah, Traum = Hall/Pitch-Drift
Social:    jung, niedriger Status, informell
Interaction: antwortet auf Spieler-Blip mit +5 Halbtönen
```

---

## 10 · P0 / P1 / P2 für R4

### P0

1. `soundShape` pro Charakter.
2. Uncanny-Regeln: klar menschlich vs. klar nicht-menschlich.
3. Context Genome mit sechs Grundkontexten.
4. Audio Signature Kit für 10–20 Hauptcharaktere.

### P1

1. Social Voice Layer.
2. Call-and-Response mit Spieler-Input.
3. Adaptive Layer-Steuerung.
4. Ethik-Checkliste für Völker und Stimmen.

### P2

1. Automatische Motiv-Erkennung aus Spieleraktionen.
2. Prozedurale Dialekt-Generierung.
3. Emotionale Spiegelung in Echtzeit.
4. Klangbasierte Beziehungssysteme zwischen NPCs.

---

## 11 · Wichtigste Designgesetze

1. **Klangform ist Charakterform.**
2. **Nicht-menschlich ist sicherer als fast-menschlich.**
3. **Kontext verändert Stimme, ohne Identität zu zerstören.**
4. **Wiedererkennung entsteht durch Motiv + Timbre + Kontur.**
5. **Dialekt und Register machen Völker sozial hörbar.**
6. **Spieler-Input kann musikalischer Dialogpartner sein.**
7. **Sprache entsteht durch Gruppierung, Pausen und Reaktion — nicht durch Beeps allein.**
8. **Kulturelle Referenzen brauchen Transformation, Dokumentation und Review.**
