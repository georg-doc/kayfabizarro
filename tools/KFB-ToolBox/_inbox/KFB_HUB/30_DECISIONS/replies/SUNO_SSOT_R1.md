# Suno-SSOT · Baukasten und Best Practices · R1 · 2026-10-23 · WS0 (V-689)
**Tier 0:** Eine Stelle für alles, was wir mit Suno machen. Deck-Songs, Jukebox-Instrumentals und die Chatterbox-Ernte lesen ihre Regeln und Bausteine hier. Für Deck-Songs gilt zusätzlich die Song-Spec.

## 1 · Was wo gilt
| Zweck | maßgeblich | Bausteine |
|---|---|---|
| Deck-Songs (Spoken Word über Beat, Karten der Reihe nach) | `SONG_SPEC_R3.md` (R3.3) + `song_gate.py`, Writer's Room (V-361) | STYLE rein musikalisch (V-362), STYLE + LYRICS als eine Hub-Karte |
| Instrumentals für Jukebox und Soundbed | dieses Dokument §3–§4 | Stil-Sätze §5, Katalog `40_AUDIO/music_catalog_r1.json` |
| Ernte für Sprachmelodien (Chatterbox) | dieses Dokument §3–§6, `CHATTERBOX_SPEC_R2.md` | Solo-Prompts §5, `40_AUDIO/chatterbox_r1/harvest_phrases.py` |

## 2 · Grundregeln (aus den Registerentscheiden)
- **STYLE ist rein musikalisch** (V-362): Genre, Produktion, Instrumente, Groove, Tempo, Tonart bzw. Stimmung, genau eine Stimme mit Vortragsweise. Keine Story-Requisiten.
- **STYLE + LYRICS als eine Karte im Hub** zum Kopieren (V-361).
- **Deck-Songs entstehen im Writer's Room**: das Deck verstehen, nicht nach Mustern. Fehlschläge werden nicht mit neuen Meta-Regeln beantwortet.
- Erzeugen macht Georg in Suno. Material landet im privaten Branch, nie öffentlich.

## 3 · Struktur in den LYRICS (Instrumentals)
Erfahrungen aus der Community, keine offizielle Suno-Doku. Tags sind Hinweise, keine Befehle.
- **Custom Mode** an, bei Instrumentals zusätzlich **„Instrumental“**.
- **Je Abschnitt ein Standard-Tag** (`[Intro]`, `[Verse 1]`, `[Interlude]`, `[Break]`, `[Outro]`), darunter **eine Zeile** mit Instrument und Ausdruck, z. B. `[solo cello, unaccompanied, introspective]`.
- **Leerzeilen sind Timing:** eine Leerzeile wirkt als Atempause, zwei als deutlicher Übergang.
- **Soli trennen:** `[Break]` mit `[silence]` darunter zwischen zwei Soloinstrumenten.
- **Sauberes Ende:** `[Outro]`, `[Fade Out]`, `[End]`.
- **Iterieren:** mit der einfachsten Struktur anfangen und nur den Abschnitt ändern, der nicht trägt.
- Syntax und Verhalten können sich mit dem Suno-Modell ändern. Neue Erfahrungen bitte hier nachtragen.

## 4 · Stems
- **Standard-Split** nach Gruppen: Lead/Backing Vocals, Drums, Bass, Guitar, Keyboard, Percussion, Strings, Synth, Other, Brass, Woodwinds. Instrumente einer Gruppe landen im selben Stem.
- **Advanced Split (Beta)** nach Einzelinstrumenten, z. B. Violin, Viola, Cello, French Horn, Trumpet, Trombone, Tuba, Harp sowie Saxophon-Varianten. Ausgangsmaterial ist derselbe Track.
- **Advanced Split richtig nutzen:** Die Instrumente wählt man beim Export selbst aus. Nur Instrumente anfordern, die im Prompt bzw. im Track wirklich spielen. Ein fehlendes Instrument liefert Übersprechen: Im Orchester 2 deckten sich die probeweise angeforderten Saxophon-Stems zu 56–58 % mit der Trompete. Instrumente mit ähnlichem Register können sich ebenfalls überschneiden (Horn und Posaune 62 %), deshalb vor der Verwendung Doppelte entfernen.
- **Immer beide** exportieren und ablegen unter `40_AUDIO/chatterbox_r1/suno_tests/<song>/stems/` bzw. `stems_advanced/`.

## 5 · Bausteine (Prompts)
Alle mit STYLE und LYRICS in `replies/SUNO_SSOT_PROMPTS/SUNO_SOLO_TESTS_R1.md` (Marsch, Surf, E-Funk) und `SUNO_SOLO_TESTS_R2.md` (Orchester-Charaktere, Northern Soul, R&B, Orchester 2). Arbeitskopien in `40_AUDIO/chatterbox_r1/`.
- **Orchester-Charaktere** (wie Peter und der Wolf): jedes Instrument allein mit eigenem Thema und eigener Stimmung.
- **Orchester 2:** Streicher und Blech einzeln, Abschnitte mit Pausen nach §3.
- **Soul, Northern Soul, R&B, Surf, E-Funk, Marsch:** Soloinstrumente im Wechsel, Ruf und Antwort.
- **KFB-Crossover (Cut-up/Remix):** zwei Genres, die absurd unpassend und trotzdem tanzbar zusammengehen, z. B. Deephouse mit Trap brasileiro (V-701, Golden `SUNO_SSOT_PROMPTS/BBBW01_DEEPHOUSE_TRAP_BRASILEIRO.md`): Sprache und Vortrag der Stimme, Tempo, zwei, drei Klangquellen mit Produktionsbegriff, eine Besonderheit (Whistle-Register).
- **Frequenz- und Spannungsbetten (V-718):** S1 bis S7 für Mindspace-Räume, S8 bis S12 für Spannungsbetten (Hub b191 bis b202, Quelle `replies/RESEARCH_BINAURAL_SHEPARD_SPATIAL_R1.md`). Suno liefert nur das musikalische Bett, die exakte Frequenzschicht kommt aus Datei bzw. Offline-Render. Tempo-Regel: Hz × 60 = BPM.
- **Mind- und Soundscapes (V-779):** Georgs Golden-Fassungen S2/S3/S8 und die Räume S13–S15 in `SUNO_SSOT_PROMPTS/SUNO_MINDSCAPES_R1.md`; Tempo als Gefühl, keine Pflicht.
- **Weltmusik im Kurzprompt-Verfahren (V-1280, Georg 03.11.):** Ins Style-Feld nur Region plus „instrumental, upbeat, psychedelic“. Suno erweitert das selbst zu markanten Betten mit Soli (afrikanisch, chinesisch, mexikanisch erprobt). Die erweiterte Fassung landet im Katalogfeld `prompt`. Weitere Regionen: Hub b297.
- **Insel-Grundton** (Chatterbox V-678): O-Town Funk/Disco, Bucht Surf, Canyon Western, Farm Polka, Aliens Space, Utopia-Bürokratie Marsch.

## 6 · Ernte und Ergebnisse
- **Werkzeug:** `harvest_phrases.py <stem> <out> <familie> <stil> --bpm <BPM> --offset <s>` schneidet einstimmige Phrasen. Je Phrase schreibt es Grundton, Kontur, Klarheit, LUFS und Einsatz in Schlägen, je Stem die geschätzte Tonart.
- **Katalog:** `40_AUDIO/music_catalog_r1.json` mit BPM, Versatz, Tonart und Manifesten je Song.
- **Lehren:**
  - Ergiebig ist nur, was allein eine Melodie spielt. Holzbläser im Orchester-Charakterstück lagen bei 47 % einstimmig, Gitarre bzw. Synth bei 18–30 %.
  - Akkord-Instrumente wie Clavinet und Orgel liefern kaum Phrasen, Bass ebenfalls nicht.
  - Solo-Prompts gehen vor Stems aus vollen Songs.
  - Geerntet wird je Instrument-Familie, nicht je Figur.
  - Tonlage nur um etwa ±5 Halbtöne verschieben. Tiefe und hohe Stimmen kommen über Instrumentenpaare: Fagott und Oboe, Tuba und Trompete, Cello und Geige.

| Song | BPM | Tonart (geschätzt) | Phrasen |
|---|---|---|---|
| Surf und Rockabilly | 150 | C Dur bzw. A Moll | 60 |
| E-Funk mit Talkbox | 142 | G Moll | 119 |
| Orchester-Charaktere | 108 | B Dur | 261 aus Gruppen-Stems, 1039 aus Advanced Split (553 eigenständig) |
| Orchester 2 | 104 | G Moll | 252 aus Gruppen-Stems, 1197 aus Advanced Split (557 eigenständig, Saxophone = Übersprechen) |
| Reptilian Surfer (Surf-Noir, 02.11.) | 129 | A Moll | 208 eigenständig (247 roh; Brass 92, Bariton-Sax 99, Tremolo-Gitarre 17) |
| Sax and Trumpet Call (Northern Soul, 02.11.) | 117,5 | B Dur | 179 eigenständig (200 roh; Tenorsax 121, Trompete 49, Lead-Stem 7) |
| Tender Bends (R&B, 02.11.) | 84 | F Dur | 428 eigenständig (623 roh; Altsax 156, gedämpfte Trompete 153, Gitarre 43, Rhodes 42, Synth 26) |
| S16 Café Absurde, zweiter Take (02.11.) | 103,4 | D Dur (Prompt D Moll) | 226 eigenständig (265 roh; Klarinette 85, Kornett 63, Gitarre 49) |
| Porch Roll (Bluegrass, 03.11.) | 128,9 | G Dur | 66 eigenständig (66 roh; Fiddle im Advanced-Violin-Stem 29, Banjo im Gitarren-Stem 31; Scruggs-Rollen zu schnell für den Schnitt) |
| Glossy Melancholy (80er Art-Pop, 03.11.) | 105,6 | G Dur | 336 eigenständig (386 roh; Oboe/Altsax Woodwinds 177, Brass 81, Gitarre 30, Synth-Lead 12) |
| Hijaz Spring Reverb (Kairo-Psychedelic, 03.11.) | 106,4 | A Moll (Hijaz, Vierteltöne) | 284 eigenständig (311 roh; Gitarre 140, Nay 75, Brass 32, Synth 14) |
| Kühle Wiederholung (Motorik, 03.11.) | 133,3 | G Dur | 175 eigenständig (192 roh; Flöte 97, Brass 42, Minimoog 29) |
| Freylekhs Dance (Klezmer, 03.11.) | 104,2 (kein Anziehen messbar) | G Moll (Freygish, Konfidenz 0,56) | 275 eigenständig (277 roh; Klarinette 238, Brass 18, Geige 17) |
| Sunset Spiral (Afrikanische Psychedelic, 03.11., Kurzprompt) | 137,0 | B Moll | 40 eigenständig (42 roh; Gitarre 33, Synth 5) |
| Psychedelic Lanterns (Chinesische Psychedelic, 03.11., Kurzprompt) | 139,0 | B Moll (Pentatonik, E Moll 0,70 im Synth) | 164 eigenständig (192 roh; Gitarre/Guzheng 82, Synth 30, Brass 25, Woodwinds 10) |
| Agua de Mar A (Mexikanischer Psychedelic-Rock, 03.11., Kurzprompt) | 129,6 | E Moll | 101 eigenständig (116 roh; Brass 46, Gitarre 37, Synth 7) |
| Kitsune no Majo (Japanische Psychedelic, instrumental, 03.11., Kurzprompt) | 134 | G Dur | 270 eigenständig (295 roh; guitar 108, brass 49, woodwinds 42, lead_vocals 28) |
| Chicha de Maíz (Peruanische Chicha, Psychedelic, instrumental, 03.11., Kurzprompt) | 105 | G Moll | 151 eigenständig (170 roh; guitar 113, synth 17, woodwinds 13, brass 8) |
| Warm Room Pulse (03.11.) | 85,8 | D Moll | 300 eigenständig (318 roh; guitar 145, woodwinds 123, keyboard 15, strings 7) |
| Mysterious Horizons (03.11.) | 98,4 | A Moll | 142 eigenständig (151 roh; guitar 115, backing_vocals 13, brass 4, synth 4) |
| 1-6 Spooky Cartoon Groove (11.11.) | 130,6 | A Moll | 118 eigenständig (129 roh; lead_vocals 68, brass 28, guitar 7, keyboard 6) |
| 5-6 Dark Carnival Waltz (11.11.) | 101,2 | G Dur | 88 eigenständig (96 roh; lead_vocals 44, woodwinds 17, guitar 7, synth 7) |
| 4-6 Creeping Boogaloo (12.11.) | 127,2 | A Moll | 148 eigenständig (173 roh; brass 30, strings 25, lead_vocals 20, backing_vocals 18) |
| 6-6 Eerie Funk Minor (12.11.) | 127,1 | D Dur | 111 eigenständig (115 roh; synth 32, backing_vocals 23, brass 22, lead_vocals 14) |
| 2-6 Toy Soldiers March (12.11.) | 87,5 | D# Dur | 55 eigenständig (55 roh; keyboard 45, strings 7, brass 1, guitar 1) |
| 3-6 The Gilded Cage (12.11.) | 135,9 | G Moll | 76 eigenständig (80 roh; guitar 32, lead_vocals 23, backing_vocals 19, strings 1) |
| Shadow Office Shuffle (Suno solo, Style aus Hub, 13.11.) | 104,4 | G# Dur | 78 eigenständig (84 roh; keine tragende Familie) |
| Sand Under the Throne (Suno solo, Style aus Hub, 13.11.) | 90,6 | E Dur | 152 eigenständig (168 roh; keine tragende Familie) |
| Waltz for a Tragic Flaw (Suno solo, Style aus Hub, 13.11.) | 89,4 | D Moll | 323 eigenständig (348 roh; keine tragende Familie) |
| Small Mammal Sunshine (Suno solo, Style aus Hub, 13.11.) | 104,8 | G Moll | 422 eigenständig (585 roh; keine tragende Familie) |
| Brain Gym Bebop (Suno solo, Style aus Hub, 13.11.) | 129,7 | G Moll | 149 eigenständig (189 roh; keine tragende Familie) |
| River Meets the Sky (14.11.) | 137 | G Dur | 179 eigenständig (193 roh; guitar 113, woodwinds 20, backing_vocals 18, synth 13) |
| Forbidden Ice (14.11.) | 115,9 | C Moll | 377 eigenständig (496 roh; keyboard 127, synth 112, guitar 55, woodwinds 49) |
| Cuban Psychedelia (14.11.) | 125,7 | G Moll | 139 eigenständig (154 roh; guitar 98, brass 18, synth 8, keyboard 7) |
| Garden of Night Blooms (13.11.) | 84,6 | E Moll | 182 eigenständig (188 roh; guitar 59, strings 38, brass 34, woodwinds 34) |
| Dusty Highway Dreams (13.11.) | 131,9 | E Moll | 21 eigenständig (21 roh; guitar 20, woodwinds 1) |
| Siegfried's Motorik (14.11.) | 99 | B Moll | 41 eigenständig (50 roh; synth 16, guitar 12, strings 11, keyboard 2) |
| Eerie Minor Groove (13.11.) | 128 | C Moll | 109 eigenständig (111 roh; lead_vocals 74, brass 16, synth 15, guitar 4) |
| Brain Gym Hard Bop (13.11.) | 128,2 | C Moll | 130 eigenständig (159 roh; woodwinds 78, brass 36, guitar 6, keyboard 4) |
| Bouncy Breakbeat (13.11.) | 123,6 | G Moll | 294 eigenständig (395 roh; woodwinds 184, brass 76, guitar 22, keyboard 10) |
| Xenolith Arpeggios (14.11.) | 138,9 | G Moll | 188 eigenständig (192 roh; guitar 62, backing_vocals 36, brass 20, lead_vocals 20) |
| Neptune's Rebellion (14.11.) | 139,1 | G Moll | 30 eigenständig (31 roh; brass 19, strings 9, woodwinds 2) |
| Reverberating Honkytonk (14.11.) | 115,5 | B Moll | 90 eigenständig (91 roh; guitar 75, brass 6, woodwinds 5, strings 2) |
| Synth Blob Beat (14.11.) | 120,7 | C Moll | 3 eigenständig (3 roh; guitar 2, synth 1) |
| Psychedelic Groove Gun (14.11.) | 128,6 | E Moll | 14 eigenständig (14 roh; brass 10, synth 2, woodwinds 2) |

**Advanced Split, Ergebnis 23.10.:** Flute, Oboe, Clarinet, Trumpet und Violin tragen (rund 50 % einstimmig). Tuba, Cello und Harp liefern fast nichts, French Horn und Trombone wenig. Beim E-Funk bringt Advanced Split nichts (Synth Voice 7, Synth Bass 0 Phrasen); ein Ersatz-Instrument, das nicht spielt (Clarinet statt Clavinet), liefert nur Übersprechen. Doppelte entfernt `40_AUDIO/chatterbox_r1/dedupe_harvest.py <song_dir>`: gleicher Einsatz unter 0,05 s und Grundton unter 5 Hz in zwei Stems, die klarere Phrase bleibt.

## 7 · Quellen (Community, Stand 23.10.)
- https://jackrighteous.com/en-gb/blogs/guides-using-suno-ai-music-creation/suno-ai-4-5-metatag-tutorial
- https://jackrighteous.com/de-gb/pages/suno-ai-meta-tags-guide
- https://jackrighteous.com/de/blogs/guides-using-suno-ai-music-creation/get-jacked-structure-suno-backing-tracks
- https://alexanderweichart.de/2_Areas/Music/Suno-Instructions
- https://learnprompting.org/blog/guide-suno

## 8 · ElevenLabs-Weg (V-719, V-724, Stand 24.10.)
- **Reihenfolge:** Suno nur für drei Betten (S2 Atem-Bett, S8 Dystopie-Drone, S3 Erd-Resonanz). Alles andere zuerst über ElevenLabs.
- **Werkzeuge:** `40_AUDIO/elevenlabs_r1/sfx_gen.py <set.json>` (Klänge, Schleife möglich), `music_gen.py <set.json>` (Eleven Music, music_v2_5, instrumental), danach `lufs_set.py <set> [ziel]`.
- **Sätze 24.10.:** Orakel-Familien F14–F19 (84 Clips, −16 LUFS), Musik-Probe M1/M2 (je 60 s, −18 LUFS), Mindspace-Schichten KS1–KS6 Klangschalen und NA1–NA4 Natur (je 20 s Schleife, −20 LUFS).
- **S2 Atem-Bett:** klingt richtig, mit 4 Stems aber zu dünn. Streicher fast stumm, das Keyboard trägt alles. Darum Schichten statt eines Tracks (V-724): Fundament aus Suno S2b mit mehr Instrumentenfamilien, darüber ElevenLabs-Schichten, gemischt im einen Mixer von WS-Audio.
- **Fantasie-Stimmen:** HeyGen-Proben von Georg (Skripte `replies/HEYGEN_POC_SKRIPTE_R1.md`), Talkbox-Vergleich durch WS0, Entscheidung q180.
