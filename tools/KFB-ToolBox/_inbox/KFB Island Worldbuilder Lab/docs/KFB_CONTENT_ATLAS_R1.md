# KFB Content-Atlas R1 · was es schon gibt und wofür

Stand: 2026-10-09 · Grundlage sind die drei Inventuren in `docs/content-atlas/`:
- `ATLAS_A_DECKS_KORPUS.md` (Decks, Karten, Bild-Prompts);
- `ATLAS_B_ENGINES_TOOLS.md` (Engines und Werkzeuge);
- `ATLAS_C_ORDNER_VAULT.md` (Ordner, alte Hubs, Doppelungen).

**Regel:** Bevor eine Insel, ein Bewohner, ein Billboard oder ein Streckenabschnitt eine Geschichte bekommt, wird zuerst hier nachgesehen. Geschichten werden aus den vorhandenen Decks und Engines **abgeleitet, nicht erfunden** (§00 Weltlogik).

## 0 · Welche Decks gelten (Georg, 09.10.)

- **Kanon = die bearbeiteten bzw. veröffentlichten Decks auf GitHub:** `georg-doc/kayfabizarro` `main` · `media/kfb/`, 133 Web-PDFs und 132 JSONs (mit Karten, Lore, Power, `artworkPrompt`). Dazu gehören die Insel-Decks `Deck_A_UTOPIA_-_Forget_Utopia`, `Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP` und `Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)`.
- **Fertige Ausgaben je Deck:** `… - ADD.pdf` (Druck, 60+ MB) und `… - ADD web.pdf` (komprimiert, 3–4 MB), jeweils mit JSON.
- **Einige Decks sind schon auf Gumroad** (Ordner `Kayfabizarro Gumroad/`, `MedKayfab Gumroad/` im Korpus).
- **Der Dropbox-Korpus** (`KAYFABIZARRO WORKSPACE/decks/`, 20.837 Karten) ist der **Arbeits- und Variantenbestand**: Steinbruch, nicht Kanon.
- **Marketing-Texte und Social-Media-Rollout** der Decks sind ein eigener Strang (Pipeline bauen bzw. produktionsreif machen), außerhalb der Spiel-Entwicklung.

## 1 · Die drei größten Schätze

| Schatz | Umfang | Ort |
| --- | --- | --- |
| **Karten-Korpus (maschinenlesbar)** | 437 Deck-JSONs, **20.837 Karten**, davon 20.705 mit `artworkPrompt` (Bild-Prompt), dazu Power, Lore, Grade | `~/Dropbox/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/Comic Seminar PDFS/MODIFIED PROTOTYPES (PDFs, uncompressed, v05)/KAYFABIZARRO WORKSPACE/decks/`; bereinigt: `…/KAYFABIZARRO WORKSPACE/export/kayfabizarro-data/` (315 Decks, `index.json`, LLM-Korpus `llm/corpus-01…17.md`) |
| **Mnemosyne's Quill** | Thema → Warburg-Tafel mit 12–15 Fragmenten (Mythos, Ideologie, Wissenschaft, Psychoanalyse, Verschwörung, FrizzleBob-Kommentar), 9 Denkmuster-Tags (Analogie, Polarität, Paradox …), 16 Ausgabeformen (Dialog, 3×3-Comic, Lyrics …) | privates Repo `georg-doc/Mnemosyne-Quill` (Branch `v-3-2-1`); lokale Claude-Variante 2.1 im NIE-Ordner; Cowork-Artefakt ohne API-Key `~/Dropbox/Mac/Documents/Claude/Artifacts/mnemosyne-quill/index.html` |
| **Narrative Intelligence Engine (NIE)** | ~220 Markdown-Module, 4 Layer, 3 Modi, 12 Cluster; Writers' Room OS; 52-Karten-Deck „Narrative Intelligence“ | `~/Dropbox/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS/fractal-almanac/MD NARRATIVE INTELLIGENCE ENGINE/`; privates Repo `georg-doc/fractal-almanac`; Graph `~/Dropbox/CLAUDE/_NIE_GRAPH_VIZ/` · **LOCAL ONLY**, nur kuratierte Auszüge ins öffentliche Repo |

## 2 · Inseln: welches Material wohin

**Kanon:** Die Insel-Decks A/B/C aus `media/kfb/` auf GitHub (= Hannover-Fassungen) sind gültig, weil Georg die GitHub-Decks als bearbeitet bzw. veröffentlicht setzt. Andere Fassungen sind Varianten bzw. Steinbruch.

| Insel | Kanon-Deck (56 Karten, mit Bild-Prompts) | Quelltext mit Bildsprache und Stimme | Leitfrage |
| --- | --- | --- | --- |
| **Utopia** „Forget Utopia“ | `Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json` | `EXHIBITION HANNOVER/DECK_A_FORGET_UTOPIA v2.md`: Pastell, Mint, Weltausstellungs-Plakat, Visionspapier | „What must be true for this promise to work?“ |
| **Dystopia** „Ignore Dystopia – Anatomy of a Trap“ | `Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json` | `EXHIBITION HANNOVER/DECK_B_IGNORE_DYSTOPIA v2.md`: Kohle, Rost, Schlagzeilen-Wand, Mechanismus-Auditor, keine realen Personen | „Who benefits when people stop acting?“ |
| **Protopia** „Protopia Sketchbook“ | `Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json` | `EXHIBITION HANNOVER/DECK_C_EMBRACE_PROTOPIA v2.md`: Bleistift, Aquarell, Feldnotizen, absichtlich unfertig | „What can be improved today?“ |

- **Gemeinsames Rückgrat:** `EXHIBITION HANNOVER/00_SHARED_SPINE.md`. Es stellt an 14 Positionen allen drei Inseln dieselbe Erzählfrage, je mit Setup, Development, Complication und Resolution. Das ist das **Inselvergleichs-Raster**: dieselbe Station, drei Weltbilder. Damit lassen sich Racetrack-Abschnitte zwischen den Inseln dramaturgisch verbinden, etwa als gleiche Position, drei Antworten.
- **Lieder:** zu jedem Deck ein Song (`_video/Deck_A/B/C_…_song_01_with_captions.mp4`). Kandidaten für das Insel-Radio bzw. Audio-Bett.
- **Unterbau Protopia:** der Strang „Hilfe, ich bin ein Mensch!“ (`PROTOPIA WORKSPACE/_handoff/`), `PROTOPIA_V2_OPUS_BRIEFING.md`.

## 3 · Figuren, Orte, Bauten

| Bedarf | Quelle |
| --- | --- |
| FrizzleBob | Character Bible, Voice-Datei (Korpus-Ordner, siehe Atlas A §5.5) |
| King Kayfabian, Social Calls, Spielregeln für Begegnungen | `_SESSION HANDOFF 2026-06-27/KFB_Rules_EN.md`, `KFB_Spielregeln_DE.md` |
| Bewohner (Lorekeeper, Goth Girl, Clown, Witch) | GitHub `kayfabizarro`: `skills/chat/workflows/RESIDENT_CHAT_ENSEMBLE_01B_2026-10-01/`, `skills/chat/town/LIVING_KFB_TOWN.md` |
| Figurenbau | Character Manifesto (56 Karten), Masters Gods Archetypes, Tragic Flaws, Jung and Shinn |
| **Königsturm, Mauern, Wehrbauten** | Siege-Kompendium (Mauer, Bergfried, Wachturm, Zinne, Rampe, Wiederaufbau), Battle Grounds & Monumental Maps (40 Wahrzeichen-Archetypen) |
| Stadtszenen | Protopia-Seiten „The Small Repair“, „The Work Party“, „The Neighbor“ |
| Orte (nur als Muster) | „Shadows & Spirits of Kayfabe-Places“ (enthält fremde IP, nicht übernehmen) |

**Kanon (Georg, 09.10.):** Im Spiel sind wiederkehrende, reisende Bewohner gewollt, nach Multiversum-Logik als Cast-Serie mit Kostüm je Welt. Die FrizzleBob-Regel der Character Bible gilt für Comics und Decks.

## 4 · Engines für die lebende Welt (wie sie zusammenspielen)

```
Thema (Insel, Ort, Karte)  →  Mnemosyne's Quill: Warburg-Tafel (gegensätzliche Weltsichten, Denkmuster-Tags)
        →  Triplet-Pool (subject · connector · reframe · relation · tags), Abnahme in der Triplet Review Stage
        →  ChatterBox (Bewohner sprechen, deterministisch, kurz) + Voice Layer
        →  Billboards (Quotes, Hypernormalization-Loops) · Academy (Lektionen) · Golden Journey (Kurierkarten)
NIE = Qualitäts- und Kanonquelle für Persönlichkeiten, Konflikte und Insel-Weltlogik; CritEngine = Archetypen-Konflikte
```

| Engine | Stand | Ort |
| --- | --- | --- |
| ChatterBox + Studio v2 | Spec v9, Studio 05.10. | `~/Dropbox/CLAUDE/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/` |
| Triplet-Pool + Resident-Chatter-Adapter | Kandidat 04.10. (PR #305/#310) | Studio-Ordner `lib/triplet-stage/donor/`, Repo `kayfabizarro` |
| Golden Journey (14 Beats über 4 Inseln) | v0.1 | Repo `kayfabizarro` `…/GOLDEN_JOURNEY_MVP_2026-10-04.md` |
| Lean Memory / NPC-Social-Memory | nur Architektur | Repo `kayfabizarro` `…/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` |
| Hunky & Dory Engine / Alien Lens | Juni 2026, Muster für Mehrsprecher-Dialog mit Gedächtnis | `~/Dropbox/CLAUDE/gvw/AI_Hunky&Dory/`, `~/Dropbox/CLAUDE/hunky-dory/` |
| RDDS Mono Kit (Warburg-Mapper) | v1.3 | `gvw/VaultGvW/meta/prompts/…monokit_v1_en.md` |
| Mnemosyne Artefact Dice | Regel-Add-on | ein Weltobjekt mit sechs Lesarten, spielbare Form der Quill-Idee |
| CritEngine | seit Mai 2026 | `~/Dropbox/CLAUDE/CritEngine/` |

**Gold-Beispiel (Georg):** Eine Quill-Tafel zum Thema „Gold“ (Zentralbank · Midas · Alchemie) wird zu drei Bewohner-Stimmen auf drei Inseln. Utopia verkauft Gold als Zukunftsversprechen, Dystopia als Angstwährung, Protopia als Werkstoff, den man repariert und teilt. Dazu kommt ein Billboard je Insel mit dem passenden Zitat.

## 5 · Vorsicht

- Ein Teil der Decks behandelt **reale Personen, Unternehmen oder Verschwörungsnarrative**. Nichts davon ungeprüft in die Spielwelt übernehmen; für die Inseln gelten die Hannover-Decks. Die Dystopia-Stimme sagt ausdrücklich „keine realen Personen“.
- **Fremde IP** (Pop-Kultur-Orte, Comic-Künstler-Deck) nur als Muster nutzen.
- **NIE, Quill und Fractal Almanac** liegen in privaten Repos bzw. sind LOCAL ONLY; ins öffentliche Repo kommen nur kuratierte Auszüge.
- **Zählungen** im Korpus widersprechen sich (101 bis 437 Decks, wegen Varianten). Kanonische Liste ist am ehesten `export/kayfabizarro-data/index.json`.

## 6 · Ordner und Hubs (Kurzfassung von Atlas C)

- **Alte Hubs:**
  - Generation 1: Vault `~/Dropbox/CLAUDE/gvw/VaultGvW/` (Lanes, Inbox, Entscheidungen, `hub/projects.json`, Dashboard; Stand Mai/Juli);
  - Generation 2: `_COWORKER_HUB/` (August);
  - Generation 3: Router und Production Desk auf GitHub (September).

  Seit Oktober gibt es keinen gemeinsamen Index mehr; faktisch steuert `PROJECT_STATE.md`.
- **Online-Hub `gvw-hub.pages.dev`** ist öffentlich und zeigt lokale Dropbox-Pfade. Georg entscheidet: abschalten oder schützen.
- **Doppelungen:** 89 ZIPs (609 MB) in `~/Dropbox/CLAUDE/`, 67 davon neben gleichnamigen entpackten Ordnern. Aufräumen nur nach Georgs Freigabe.
- **Neuer Hub:** `~/Dropbox/CLAUDE/KFB_HUB/` (Gerüst angelegt). Er übernimmt die Mechanik des Vaults: zeigen statt kopieren, ein Schreiber je Datei, Inbox je Quelle.
