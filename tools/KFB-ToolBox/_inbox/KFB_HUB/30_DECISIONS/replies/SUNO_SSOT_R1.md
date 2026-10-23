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
| Orchester-Charaktere | 108 | B Dur | 261 |
| Orchester 2 | 104 | G Moll | 252 aus Gruppen-Stems, 1197 aus Advanced Split (mit Übersprechen) |

## 7 · Quellen (Community, Stand 23.10.)
- https://jackrighteous.com/en-gb/blogs/guides-using-suno-ai-music-creation/suno-ai-4-5-metatag-tutorial
- https://jackrighteous.com/de-gb/pages/suno-ai-meta-tags-guide
- https://jackrighteous.com/de/blogs/guides-using-suno-ai-music-creation/get-jacked-structure-suno-backing-tracks
- https://alexanderweichart.de/2_Areas/Music/Suno-Instructions
- https://learnprompting.org/blog/guide-suno
