# Stimmen-Besetzung R1 (15.10.2026, zu V-308)

**Stand:** Vorschlag WS0, Hörprobe ist Georgs. Maschinenlesbar: `replies/voice_casting.r1.json` (Schema `kfb.voice-casting/1`).
**Engine:** Kokoro-82M v1.0 lokal (kokoro-onnx 0.4.7, `~/.kfb-audio-venv`), vorab erzeugt, keine Sprachausgabe zur Laufzeit (V-285).

## Wie viele Stimmen haben wir?
- **28 englische Grundstimmen:** US-Frauen 11 (af_), US-Männer 9 (am_), UK-Frauen 4 (bf_), UK-Männer 4 (bm_). Alle 28 sprechen unsere Testzeile fehlerfrei (Whisper-Abgleich 1,0).
- **Dazu 26 Stimmen anderer Sprachen** (es, fr, hi, it, ja, pt, zh) in derselben Datei. Mit englischem Text sprechen sie verständlich Englisch mit fremdem Timbre (21 von 26 mit Abgleich 1,0, der Rest 0,92–0,97). Reserve für Aliens und Exoten, Klang noch nicht von Georg gehört.
- **Mischstimmen:** Zwei Stimmen gewichtet mischen (z. B. 60 : 40) ergibt eine neue Zwischenstimme. Damit sind beliebig viele eigene Stimmen möglich.
- **Tempo** (0,8–1,2) ist die dritte Achse: gleiche Stimme, anderes Tempo, andere Figur.

**Mischung getestet** (`40_AUDIO/voice_casting_r1/_scripts/audition_r1.json`): In unserer kokoro-onnx-Version funktioniert sie direkt (Stil-Vektor statt Stimmname an `create`). Drei Mischungen, alle verständlich (Abgleich 1,0). Der Grundton liegt jeweils zwischen den Eltern, die Mischung ist also wirklich eine neue Stimme: bm_george 146 Hz + am_onyx 89 Hz → 60 : 40 = 118 Hz; am_michael 125 Hz + am_onyx 89 Hz → 50 : 50 = 107 Hz.

## Regeln der Besetzung
1. Hauptfiguren teilen keine Grundstimme, auch nicht als Mischanteil.
2. Die 9 Stimmen der Hauptfiguren sind reserviert: am_michael, bf_emma, am_onyx, bm_george, bf_isabella, af_bella, am_fenrir, bm_lewis, bm_daniel. Nebenfiguren nutzen sie nicht.
3. Keine zwei Figuren mit gleicher Stimme und gleichem Tempo.
4. Noch frei für neue Figuren: af_jessica, af_nova (rein) und jede neue Mischung.

## Hauptfiguren
| Figur | Stimme | Tempo | Warum |
|---|---|---|---|
| FrizzleBob | am_michael | 1,00 | Georg PASS (V-308); flache Melodie, trockener Stand-up-Ton |
| GothGirl | bf_emma | 0,95 | Georg PASS (V-308); sehr flach, britisch, trocken |
| Lord Hunky | Mischung am_onyx 60 + bm_george 40 | 0,92 | Tiefste Stimme im Set mit britischer Würde: Oberherr, der als Realitäts-Hausmeister gelangweilt durchsagt |
| Lady Dory | Mischung bf_isabella 60 + af_bella 40 | 0,93 | Hell, flach, vornehm, mit der saubersten Klangqualität: ehemalige High Society |
| Orc Brute | Mischung am_fenrir 50 + bm_lewis 50 | 0,85 | Ausdrucksstärkste Männerstimme plus tiefer Grund, langsamer: großer Schläger |
| Georg (Chronist, Loriot) | bm_daniel | 0,95 | Flach, dunkel, gesetzt: Würde ohne Pointe in der Stimme |

## KayKit-Figuren aus dem Eye-Rig-Batch (Medium 27, Large 4)
GothGirl und Orc Brute sind oben besetzt; das Mannequin bleibt stumm (Referenzfigur). Geschlecht der KayKit-Modelle ist angenommen, jede Stimme ist tauschbar.

| Figur | Stimme | Tempo | Warum |
|---|---|---|---|
| Clown | am_puck | 1,10 | hellste, cartoonigste Männerstimme |
| Toy Soldier | am_eric | 1,08 | höchste Männerstimme, zackig |
| Farmer A | am_adam | 0,95 | bodenständig |
| Farmer B | af_kore | 0,98 | warm, lebhaft |
| Caveman | am_santa | 0,88 | rau-gemütlich |
| Lorekeeper | bm_fable | 0,92 | britischer Erzähler |
| Witch | bf_alice | 1,02 | hoch, beweglich, britisch |
| Avian | af_sky | 1,12 | leicht und schnell |
| Skeleton Warrior | am_echo 70 + am_adam 30 | 0,95 | Skelett-Familie teilt den hohlen am_echo-Kern |
| Skeleton Rogue | am_echo 50 + am_puck 50 | 1,05 | Kern plus Frechheit |
| Skeleton Mage | bm_fable 60 + am_echo 40 | 0,90 | Kern, britisch-gelehrt |
| Skeleton Minion | am_echo | 1,15 | reiner Kern, eilig |
| Ultra Turbo Hero Man | am_liam | 1,05 | junger, eifriger Held |
| Cleric | af_aoede | 0,95 | ruhig, dunkel |
| Animatronic | af_alloy 50 + am_liam 50 | 1,00 | Frau/Mann 50 : 50 klingt leicht unwirklich |
| Animatronic Creepy | af_nicole 50 + am_santa 50 | 0,88 | hauchig plus rau, langsam |
| Action Figure | am_liam 60 + am_eric 40 | 1,10 | Werbespot-Held |
| Magical Girl | af_heart | 1,08 | beste Klangqualität, hell und warm |
| Monster | am_adam 60 + am_santa 40 | 0,92 | mittlere Stimme mit rauem Anteil |
| Ninja | af_nicole | 1,00 | flachste Stimme, gehaucht |
| Protagonist A | af_sarah | 1,00 | klar, neutral |
| Protagonist B | am_adam 50 + am_liam 50 | 1,00 | neutral, jung |
| Werewolf | am_puck 60 + am_santa 40 | 0,95 | hell mit rauem Unterton |
| Driver | af_river | 1,08 | flach, kühl, zügig |
| Vampire | bm_fable 60 + bf_lily 40 | 0,88 | britisch-theatralisch, androgyn |
| Monstrosity (Large) | am_santa 70 + am_echo 30 | 0,82 | rau und hohl, am langsamsten |
| Black Knight (Large) | am_adam 50 + bm_fable 50 | 0,90 | gemessen, wie unter dem Helm |
| Demon Lord (Large) | am_santa 50 + bm_fable 50 | 0,85 | rau plus britische Herrschaft |

## Hörproben: eine Golden-Zeile je Figur
`40_AUDIO/voice_casting_r1/besetzung_r1_<NN>_<figureId>__<Stimme>.wav` (+ gleichnamige .mp3), Liste in `index.csv`.
- 34 Figuren gerendert, **34 PASS**: Länge 3,9–8,8 s, Spitze −2 dBFS, 0 übersteuerte Samples, Whisper-Abgleich 0,95–1,0.
- Zeilen stammen wörtlich aus TRIPLET_SETS_R2 (Quelle je Zeile in index.csv). Für Lord Hunky und Lady Dory gibt es noch keine Kartenzeile; dort stehen zwei neutrale Testzeilen von WS0 (kein Kartentext, nicht für Produktion):
  - Lord Hunky: „This is Lord Hunky. Your reality is scheduled for cleaning. Please keep your hands inside the universe.“
  - Lady Dory: „Lady Dory here, darling. I have seen better parties at the end of the world, and I hosted most of them.“

## Kokoro-Decktest: help_i_am_a_human
- Quelle: `TRIPLET_SETS_R2/help_i_am_a_human.takes.csv` (spoken_text), 58 Zeilen: Intro, 56 Karten, Outro.
- Intro und Outro FrizzleBob (am_michael 1,00), Karten im Wechsel GothGirl (bf_emma 0,95, ungerade Karten) und FrizzleBob (gerade Karten), 0,5 s Pause zwischen den Zeilen.
- **Ergebnis:** 58 von 58 Zeilen gerendert, **keine Zeile fehlgeschlagen**. Gesamtlänge **5:22 min (322 s)**. Spitze −2 dBFS, 0 übersteuerte Samples, Whisper-Abgleich ≥ 0,918.
- Aussprache, die Whisper hört (für eine spätere Lautschrift-Korrektur, kein Fehler im Render):
  - „Jean-Jacques Rousseau“ → amerikanisch („Gene Jack Rousso“, Zeile 11, FrizzleBob; bf_emma sagt es richtig);
  - „Blödsinn“ → „Blurdson“ (Zeile 54);
  - „Kayfabizarro“ → „que fa bizarro“ (Zeile 55);
  - Intro „Hilfe, ich bin ein Mensch!“ englisch eingefärbt („Hilf ich bin einmensch“).
- Dateien in `40_AUDIO/kokoro_deck_test_r1/`:
  - `help_i_am_a_human__kokoro_r1.mp3` (zusammengesetzt, 160 kbit/s) und `.wav`;
  - `help_i_am_a_human__kokoro_r1.timing.csv` (Start/Ende je Zeile in Sekunden, Figur, Stimme, Prüfwerte);
  - `lines/` mit 58 Einzeldateien `help_i_am_a_human__kokoro_r1__<Zeile>_<Art>_<Karte>_<Figur>_<Stimme>.wav`.
- Für die nächsten Decks: `_scripts/kdt_render.py` mit anderer deckId laufen lassen (SUNO_NEXT_DECKS_R1.md).

## Skripte (wiederverwenden, nichts neu bauen)
Alle nutzen `voice_test_r1/_scripts/vt_common.py` (Normalisierung, Whisper-Abgleich, WAV-Schreiben):
- `40_AUDIO/voice_casting_r1/_scripts/vc_audition.py`: misst alle 54 Stimmen und testet die Mischung;
- `vc_cast.py`: schreibt `voice_casting.r1.json` und prüft die Regeln;
- `vc_render.py`: rendert die Golden-Zeilen aus der JSON;
- `40_AUDIO/kokoro_deck_test_r1/_scripts/kdt_render.py`: Decktest.
