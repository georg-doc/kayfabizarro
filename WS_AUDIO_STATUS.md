# WS_AUDIO_STATUS · Sitzung „WS-Audio“ (spielbare Version mit ganzem Ton)
Auftrag: `BRIEF_WS1_AUDIO_PLAYABLE_R1.md` (V-598). Lead: WS1 „R3F Modul-Host Vertrag“. Empfänger: WS0, Lead.
Neueste Einträge oben. Hier stehen nur Text und Zahlen. Töne, Musik und das Abnahme-Video sind privat und liegen nur lokal.

## 20 · 25.10. · Chatter-Silben TUNE (V-734) umgesetzt · Schritte auf eigenem Bus · in mvp (cc1481d)

**Stand:** `ws-audio/r1` @c6aac4e, gemergt als mvp cc1481d. Abnahme-Video liegt auf `abnahme/ws1` (Lead).

**Silben (Georg: „quieken, tut fast in den Ohren weh“):**
- Keine Silbe über der Lage der Familie (`fitRegister`: höchste Silbe = Clip-Lage), Stimmlage je Figur −5 … 0.
- Hohe Familien eine Oktave tiefer: F04 Okarina, F06 Theremin, F09 Säge, F10 Oboe, F12 Mundharmonika, F13 Melodica.
- Tiefpass 2,4 kHz, Einschwingen 25 ms, Ausklang 50 ms, Pegel 0,25 (−6 dB gegenüber R1). Musik beim Sprechen −7 dB.

**Schritte (Pegel):**
- Bus `steps` unter SFX: −9 dB, beim Sprechen −15 dB, unter Kampf/Explosion weitere −4 dB.
- Darüber laufen Spieler-, NPC- und schwere Schritte sowie `foot.jump`/`foot.land`.
- Das „Stampfen“ im Wechselrede-Video war `foot.land` beim Absetzen der Figur (vorher −6,9 dB, jetzt ≈ −16 dB). NPC-Schritte gab es dort keine.

**Video** (`scripts/audio/record-dom.mjs abnahme`, DOM-Screencast mit Blasen):
- 58 s, Live-Welt mit Site-Hash, echt hingegangen.
- Ort 1 Disco (Talkbox), Ort 2 Orc-Band (Tuba).
- Hinweise: je Ort dieselbe Familie; Wechselrede sparsam (WS-NPC-Deckel 90 s).

**Neu in `stats()`:** `cues` (letzte 60 Bank-Töne mit Pegel/Bus), `stepDb`.

**Tests:** audio-mixer, contract-static, audio-syl, audio; beim Lead zusätzlich talk und chatter: PASS.

## 19 · 24.10. · Chatter-Silben R1 hinter `#chat=syl` (Lead-Auftrag, Georg-GO) · MERGE-ANTRAG e4f3c51

**Stand:** `ws-audio/r1` @e4f3c51 (c286c64 + e4f3c51, auf mvp 192bbb7). Video: `test/out/audio/kfb-audio-silben.mp4` (lokal, 14,7 MB, an Georg geschickt).

**Was es tut:**
- Blasentext → Silben (Vokalgruppen je Wort) → Satzmelodie aus dem Satzzeichen (Ruf-Skala V-712):
  - „?“ steigt, „.“ fällt, „!“ kurz und kräftig, „...?“ zögert vor dem letzten Wort, „?!“ hoch und ungläubig.
  - `*Fett*` wird betont. „…“ allein = leises „hm“.
  - Deckel 4,5 s bzw. 28 Silben, die letzten 3 Silben bleiben immer.
- Je Silbe ein Grain von 0,1–0,2 s, **geschnitten aus den vorhandenen Familien-Clips**: Spitzen der Hüllkurve, einmal dekodiert. Kein neues Material, keine Synthese.
  - Instrument über `pickChatter`: Register → Georgs Wahl V-693 → Gruppe; Disco immer Talkbox.
  - Stimmlage je Figur fest (Seed aus characterId, ±3 Halbtöne), Streuung ±0,7 Halbton je Silbe.
- **Wechselrede:** Ein anderer Sprecher beginnt 0,3–0,5 s nach dem Ende des vorigen. Registerwechsel um 3 Halbtöne, wenn die Lagen näher als 2 liegen. Nie mehr als ein Sprecher zugleich.
- **Laut nur mit Blase:** Bei `chat=syl` schweigen die Ereignis-Laute (greet, chatter, Band, Disco). Jede Sprech-Blase spricht über den Haken in `BubbleHost` (additiv). Musik −7 dB, solange gesprochen wird.
- **Doppel-Schutz:** Dieselbe Zeile spielt nur einmal, solange der erste Aufruf geplant ist oder klingt. Dadurch können WS-NPC (direkt) und der BubbleHost-Haken beide rufen.
- **Bühne:** `bootSpeech()` lädt ohne AudioHost nur die Silben-Clips, ohne Musik und Atmo. Anker → Figur über `setSpeaker('stage-left'|'stage-right', id)` in `Stage.jsx` (additiv).

**Schnittstelle** (mit WS-NPC abgestimmt): `kfbAudio.speak({ text, characterId, group?, pos?, kind: 'call'|'line'|'lore' })` → `{ dur, start, syllables, family }` | null. Dazu `speakPlan(text)` → `{ dur }` ohne Ton. WS-NPC zeigt die Blase um `start` verzögert, Lebenszeit max(start + dur, Lesezeit).

**Video A/B/C** (Bühnen-Dialog mit echten Kartenzeilen, Figur steht, kein Teleport):
- A heute: stumm.
- B Silben ohne Blase: FrizzleBob Posaune 10 Silben, gothgirl Oboe 24 Silben.
- C Silben mit Blase.
- Dann Bewohner-Tratsch in der Welt (`world=probe`, Figur vor der Aufnahme hingestellt) mit tr1-Zeilen und Rufen per Prüfskript:
  - Lorekeeper (Klarinette) erzählt, Bäuerin (Akkordeon) „Boggle...?“.
  - Lorekeeper legt nach, Bäuerin „Bingo!“, Lorekeeper „Humbug?!“.

**Tests:**
- audio-mixer (neu `chatterSyllables`, `chatterGrains`), contract-static, audio und chatter (WS-NPC, gegen frisches dist): PASS.
- **neu `test/audio-syl.mjs`** (Welt und Bühne): PASS.
- Ton 0,08–0,11 ms/Bild, Silben werden beim Aufruf geplant und kosten im Bild nichts.

**Grenzen / offen:**
- Ohne Instrument kein Laut, sichtbar als `fallback` in `stats().chatter`. Betrifft die Spielfigur (Rufe Bingo! …), Skelette und Soldaten bis Kazoo/Trompete da sind, sowie demon_lord außerhalb der Disco.
- **Georgs Urteil zu A/B/C steht aus. Erst danach `chat=syl` als Standard.**

## 18 · 24.10. · Sprech-Anlässe echt im Spiel · Georgs Urteil · Disco-MC Talkbox · MERGE-WUNSCH f6776c4

**Merge-Wunsch an den Lead:** `ws-audio/r1` @f6776c4. Der Lead war per Nachricht nicht erreichbar, deshalb steht der Wunsch hier.
- Georg hat entschieden: **Der Disco-MC FrizzleBob spielt Talkbox wie die Tänzer**, nicht seine Register-Posaune.
- `pickChatter` in `cueMap.js`: In der Disco K12 zählt immer das Gruppen-Instrument, sonst wie bisher Register (mit Instrument) → Georgs Wahl V-693.
- Tests: audio-mixer (neu `pickChatter`) und contract-static PASS. Kurztest auf mvp 2a18e5a: MC Talkbox/staunend.

**Echter Test der WS-NPC-Anlässe** (mvp 4f32c76, Video `kfb-audio-sprech.mp4` nur lokal, an Georg):
- Band: Tuba, Bemerken staunend, Liedende froh mit 2 Sprechern reihum.
- Disco: Talkbox in der Pause, nachdenklich.
- gothgirl: Oboe, staunend.
- Keine Fehler, Ton 0,07 ms/Bild.
- Der gemeinsame 38,4-s-Takt von Band und Disco ist von WS-NPC behoben (Versatz 19,2 s, mvp 2a18e5a).

**Georgs Urteil (24.10.):**
- „Niedlich, aber man hat nicht das Gefühl, dass sie miteinander sprechen – eher musikalisch kreativ orchestriert, durchaus gefällig.“
- Ohne Sprechblasen ist nicht beurteilbar, ob die Sprachmelodien als Stimmen gelesen werden. Für Unbedarfte erschließt es sich noch nicht.
- **Jetzt nicht ausbauen.**

**Einschätzung WS-Audio, für später (Chatterbox, WS0):**
- Die heutigen Familien-Clips sind 0,8-s-Musikphrasen, das Ohr liest sie als Musik.
- Für Sprache braucht es Silben-Grains (0,1–0,2 s) zu Mini-Sätzen mit Satzmelodie: Frage steigt, Aussage fällt.
- Dazu Frage-Antwort mit Pause und Registerwechsel, und vor allem gleichzeitig die Sprechblase (bubbleLayer gibt es schon).
- Danach ein 20-s-Hörtest mit und ohne Blase. Das passt zu `chatter.motif/grains` und zur Suno-Ernte.

**Klick im Video:** Das war ein Fehler der Aufnahme, nicht des Spiels. Jeder Teleport der Figur (alle 6 s) löste `foot.land` aus (C01 Lehm-Fall). Nachgewiesen: 1 Teleport = 1 zusätzliche Wiedergabe. Künftige Aufnahmen sollten nicht teleportieren bzw. ohne Fallhöhe.

**FrizzleBobs Hochspringen** beim Bemerken (WS-NPC-Animation) wirkt laut Georg „ohne Kontext irritierend“. Nur zur Info an WS-NPC, kein Auftrag.

## 17 · 24.10. · UMGESETZT: Ton von GitHub, Musik AAC 128 · Georgs Freigabe im Chat („ja, beides“, 23.10.)

**Stand:** `ws-audio/r1` @76eeb2b (auf aktuellem `ws1/mvp-r1`), Merge-Wunsch an den Lead. Ablage: kayfabizarro, Branch `assets/kfb-audio-r1` @36c5ae419, Pfad `media/kfb-audio/r1/` (569 Dateien + README, 108 MB).

**Größen vorher/nachher**

| | vorher | nachher |
|---|---|---|
| Musik (38 Titel) | 226 MB (MP3 192 / Ogg bis 450 kbit/s) | **88,7 MB** AAC-LC 128 m4a, größte Datei 8,84 MB, Lautheit \|Δ\| ≤ 0,06 LU |
| Ton im Site-Paket | 245 MB | **0 MB**, alles zur Laufzeit von GitHub |

**Laden:** jsDelivr `gh@36c5ae419…` als erster Host, raw.githubusercontent als Rückfall (`scripts/audio/remote.json`; build-site setzt `VITE_KFB_AUDIO_ROOT`/`_FALLBACK`).
- Jukebox streamt über `<audio>` → MediaElementSource (`crossOrigin='anonymous'`), nie `decodeAudioData` für Musik.
- Der nächste Titel wird ~25 s vor Ende ins freie Deck vorgeladen.
- Fehlerkette: anderer Host → nächster Titel → nach 3 Fehlern Musik aus, das Spiel läuft weiter.
- Vorwärmen: `scripts/audio/warm-cdn.mjs`, alle 569 Dateien 200, TTFB kalt p50 276 ms / p95 640 ms.

**Gemessen gegen die echten Hosts (headless):**

| | Chrome | WebKit (Safari-Engine) |
|---|---|---|
| erster Musik-Ton nach erster Eingabe | 1,1 s | 1,1 s |
| Ton bereit (Atmo, Schritte, Tonbank) | 1,4 s | 3,3 s |
| alle 38 Titel spielbar | 38/38 | 38/38 |
| Fehlerfälle (nachgestellt: erster Host weg, Musik-Datei weg, beide weg) | PASS | PASS |

- **Repo-Grenze jsDelivr:** Einzelabruf aus kayfabizarro geht, auch bei einer kalten Datei (0,8 s, danach 0,05 s). Die 150-MB-Paketgrenze greift laut Recherche nur beim Tarball-Weg.

**Tests:** volle Reihe `npm test` im Slot: 55 PASS bis `c2`. `c2` FAIL ist der bekannte alte Fehler (pupilZeroWhenClosed), danach einzeln: c3, c3s, c3g, r1a, m1-ground, probeWorld, probeWater PASS. `c3b` FAIL (`F.sync is not a function`, Fundstücke-Modul) ist nicht im Ton-Diff, liegt also im mvp-Stand; Hinweis an den Lead. Nach dem mvp-Merge erneut: audio-mixer, characterRegistry, contract-static, audio, audio-remote PASS.
- `drift` braucht `test/out/drift/drift-report.json` (lokale Ausgabe). In frischen Worktrees fehlt sie, dann bricht die Reihe dort ab.

## 16 · 23.10. · KONZEPT: Musik kleiner kodieren, Ton von GitHub statt im Site-Paket · Hörprobe (Auftrag Georg über den Lead)

**Georgs Vorgaben (über den Lead):** „Musik kleiner kodieren: gerne“. Die Site soll leicht sein und alles über GitHub laufen. Die Songs dürfen öffentlich in kayfabizarro, gekaufte Modelle bleiben privat. Die Freigabe gilt nur für die Songs. **Umsetzung erst nach Georgs Okay, Merge über den Lead.**

### Teil 1 · Musik kleiner kodieren

**Ist:** 38 Titel (14 Suno, 24 Cozy), 98 Minuten, 228 MB.
- Suno: MP3 192 kbit/s, 43 MB.
- Cozy: Ogg Vorbis mit sehr hoher Qualität, 205–455 kbit/s, 185 MB.

**Vorschlag: AAC-LC in `.m4a`, 128 kbit/s.** Begründung:
- AAC/MP4 ist Safaris Hausformat, und Chrome dekodiert es (headless gemessen).
- Ogg Vorbis spielt Safari erst in neueren Versionen zuverlässig, der Umstieg beseitigt also auch ein Safari-Risiko.
- Werkzeug: `afconvert` (macOS, Apple-AAC-Encoder, höchste Encoder-Qualität). Cozy wird im Browser zu WAV dekodiert, weil afconvert kein Ogg liest; Abtastrate wie die Quelle.

**Hörprobe** (lokal, 40-s-Ausschnitte ab 0:20; A = Original verlustfrei, B = AAC 128, C = AAC 96). Lautheit BS.1770 über den ganzen Titel:

| Titel | Original | AAC 128 | AAC 96 | Lautheit (Original → 128 / 96) |
|---|---|---|---|---|
| Suno · Endless Forward Motion A (119 s) | 2,65 MB, 187 kbit/s | 1,81 MB | 1,36 MB | −15,44 → −15,49 / −15,51 LUFS |
| Cozy · Chickens In The Meadow (124 s) | 6,16 MB, 417 kbit/s | 1,90 MB | 1,46 MB | −21,61 → −21,62 / −21,63 LUFS |
| Cozy · Gymnopédie No. 1 (133 s, leise Klavier) | 3,45 MB, 218 kbit/s | 1,78 MB | 1,47 MB | −31,04 → −31,04 / −31,05 LUFS |

- **Lautheit bleibt:** Abweichung ≤ 0,07 LU. Die Titel-Ausgleichswerte (`music-gain.json`, Ziel −18 LUFS) gelten weiter; nach der Umkodierung misst `loudness.mjs` gegen.
- **Gesamtgröße:** 228 MB → **≈ 85 MB bei 128 kbit/s** bzw. **≈ 70 MB bei 96 kbit/s** (hochgerechnet aus 98 min). Je Titel ≈ 1,8 MB statt 6 MB.

### Teil 2 · Ton zur Laufzeit von GitHub

**Ablage:** in kayfabizarro, z. B. `media/kfb-audio/music-r1/{suno,cozy}/*.m4a` plus `music-r1.json` (Titel, Länge, Größe, sha256, gainDb, Stichworte). Der Commit wird im Code fest gepinnt, wie die Audio Site (`site-files.json`).
- Hinweis: Die Suno-Jukebox liegt mit Stems schon öffentlich unter `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/` (460 Dateien, 1,36 GB). Die Spiel-Fassung wird trotzdem als kleine eigene Ablage vorgeschlagen.

**Hosts (gemessen 23.10., `curl` mit Range auf eine m4a in kayfabizarro):**

| | raw.githubusercontent | cdn.jsdelivr.net/gh/…@commit |
|---|---|---|
| Range (Streaming) | 206, `accept-ranges: bytes` | 206 |
| CORS | `*` | `*` |
| Content-Type m4a / mp3 / ogg | audio/mp4 / audio/mpeg / audio/ogg | gleich |
| Zwischenspeicher | `max-age=300` (5 min) | `max-age=31536000, immutable` (1 Jahr) |
| erste 128 KB (TTFB) | 0,06–0,41 s | 0,06–0,15 s |
| ganzer Titel 2,1 MB | 0,26 s | 0,24 s |

- **Vorschlag:** jsDelivr mit festem Commit als erster Host (ein Jahr Browser-Cache, unveränderlich). raw.githubusercontent als Rückfall (gleiche Datei, gleicher Commit).
- Grenze bei jsDelivr: höchstens 20 MB je Datei. Der längste Titel (Wiener Wald, 597 s) hat bei 128 kbit/s ≈ 9,5 MB.

**Laden und Fehlerverhalten:**
- Die Jukebox streamt über `HTMLAudio`, die Musik beginnt also vor dem Ende des Downloads. Vorgeladen wird nur der nächste Titel (zweites Deck).
- Fehler oder kein Ton nach 8 s: gleicher Titel vom Rückfall-Host, dann nächster Titel. Nach 3 Fehlern geht die Musik aus, **das Spiel läuft weiter**; sichtbar in `stats().music` (errors, host).
- Ist `music-r1.json` nicht ladbar: Jukebox aus, Effekte unberührt.

**Effekte (≈ 17 MB):** Die Freigabe gilt laut Lead nur für die Songs.
- Vorschlag: Atmo und Schritte (CC0, Audio Site, ohnehin öffentlich gepinnt in kayfabizarro) kommen ebenfalls von GitHub.
- ElevenLabs-Sätze und WSA Racer/Kampf bleiben im Site-Paket, bis Georg entscheidet.
- **Site-Paket Ton: 245 MB → ≈ 17 MB, mit Atmo/Schritten von GitHub ≈ 5–7 MB (Schätzung).**

### Prüfkriterien (Abnahme)
1. Georgs Ohr: B (128) bzw. C (96) gegen A nicht störend schlechter. Danach Wahl 128 oder 96.
2. Lautheit je Titel: |Δ| ≤ 0,2 LU gegen das Original (`loudness.mjs`), Spitze ≤ −1 dBFS nach Ausgleich.
3. Chrome und Safari spielen alle 38 Titel. Chrome headless automatisch. **Safari kann hier nicht automatisch geprüft werden** (keine WebKit-Engine installiert): einmal von Hand auf iPhone/Mac, oder WebKit für Playwright installieren (Download, braucht Georgs Okay).
4. Erster Musik-Ton nach der ersten Eingabe ≤ 1,5 s bei normalem Netz, gemessen headless gegen den echten Host.
5. Zweiter Start: Musik aus dem Browser-Cache, kein erneuter Download (jsDelivr immutable).
6. Fehlertest: Host gesperrt (Playwright-Route) → Rückfall-Host. Beide gesperrt → Spiel läuft, Musik still, kein Seitenfehler.
7. Site-Paket ohne Musik: `site-copy.mjs` kopiert keine Musik mehr; Größe des Ton-Anteils im Bericht.
8. Hauptthread weiter ≤ 1 ms/Bild für Audio (heute 0,1–0,3 ms).

**Offene Fragen an Georg:** (a) 128 oder 96 kbit/s nach der Hörprobe; (b) Freigabe öffentlich nur für die Musik bestätigt — dürfen auch die ElevenLabs-Effekte öffentlich, oder bleiben sie im Site-Paket?

## 15 · 23.10. · Georgs Familien-Wahl (q178) und Begrüßung −7 dB (q179) umgesetzt · V-693

**Stand:** `ws-audio/r1` @4bae98a (auf mvp @7835515 aufgesetzt), Merge-Wunsch an den Lead.

**q179:** Die Begrüßung senkt die Musik jetzt um **−7 dB** (vorher −4 dB). Im Test gemessen: −7.

**q178: neue Sprech-Anlässe.** Bisher „sprach“ nur die Begrüßung. Jetzt spielen auch folgende Anlässe die Familie der Figur:

| Quelle | Anlass → Gefühl |
|---|---|
| Gruppen (`groups.events`) | aggro → aggressiv, awake → genervt, calm → neutral, ko → traurig |
| Dark Fluffer (`fluffer.events`) | windup → aggressiv, healed → froh |

- Die bisherigen Gruppen- und Fluffer-Töne bleiben; der Sprechlaut kommt 0,12 s danach.
- Je Gruppe bzw. Figur und Anlass höchstens alle 1,5 s.

**Woher das Instrument kommt:** zuerst das Register (über `characterId` des Ereignisses), sonst Georgs Wahl V-693 als Übergangstabelle `decidedChatter` in `cueMap.js`, bis WS0 sie ins Register einträgt. Ein gesetzter Register-Wert geht immer vor. Sichtbar je Figur in `__kfbAudio.stats().chatter` als `set:<Familie>`, `V-693:<Familie>` oder `fallback`.

| Figur (im Spiel) | Instrument | Quelle | klingt heute |
|---|---|---|---|
| Bots (kayfabrick_bot × 3) | Melodica | Register SPEC | ja, F13 |
| Geist (q_ghost) | Singende Säge | Register | ja, F09 |
| Aliens (q_alien, q_alien_tall) | Theremin | Register | ja, F06 |
| übrige Fluffer-Sorten (q_*) | hohe Okarina | V-693 | ja, F04, etwa eine große Sekunde höher |
| Skelette (skeleton_warrior/rogue/mage) | Kazoo + Klapper-Transient | V-693 | **nein: keine Kazoo-Clips**, bisherige Gruppen-Töne |
| Spielzeugsoldaten (toy_soldier × 6) | gestopfte Trompete | V-693 | **nein: keine Clips**, bisherige Gruppen-Töne |
| gothgirl | Oboe | V-693 | Familie da (F10), aber noch kein Sprech-Anlass im Spiel |
| Orc-Band | Tuba | V-693 | Familie da (F11), aber kein Sprech-Anlass (Band spielt Musik) |
| Disco K12 | Talkbox | V-693 | Familie da (F08), aber kein Sprech-Anlass |

**An WS0:**
1. Bitte V-693 ins Register eintragen (`chatter.instrument`). Danach entfällt die Übergangstabelle; Band und Disco brauchen dafür feste IDs.
2. **Kazoo und gestopfte Trompete:** neue Clips nach Georgs Go (q177), im Raster wie `chatter_families_r1`. Bis dahin spielt WS-Audio **nichts Zusätzliches**, auch keine Trumpet-Phrasen aus der Ernte. Grund: offene Trompete ≠ gestopfte Trompete, und die Phrasen haben kein Gefühls-Raster. Die bisherigen Gruppen-Töne tragen weiter.
3. Den **Klapper-Transient** (Spec §3) für Skelette gibt es als Ton noch nicht. Bitte mit den Kazoo-Clips liefern oder einen vorhandenen Clip nennen.
4. Für gothgirl, Orc-Band und Disco fehlt ein Sprech-Anlass. Das wäre eine Entscheidung für WS-NPC bzw. WS0, z. B. Bemerken des Spielers oder Song-Ende.

**Tests:** audio-mixer (neu: `decidedChatterV693`, Duck −7), characterRegistry, contract-static und audio (headless, neu: `chatterOccasions`) alle PASS. Hauptthread 0,14 ms/Bild, p95 0,3 ms.

## 14 · 23.10. · Melodica eingebaut, Musik-Katalog einlesbar · Antwort auf WS0_TO_WS1 (23.10.)

**Stand:** `ws-audio/r1` @4d3e498 (auf mvp 7f498ca aufgesetzt), Merge-Wunsch an den Lead.

**1 · Familie 13 Melodica** (`chatter_families_r2_melodica`, 13 Clips, Pegel aus dem _lufs-Bericht)
- In `CHATTER_FAMILIES` eingetragen: Melodica → F13_melodica. Gilt für alle Figuren mit Register-Instrument Melodica (Bots, robot_one, robot_two, kayfabrick_bot … laut Snapshot @0050419).
- Säge (q_ghost) und Theremin (q_alien, q_alien_tall) gelten seit SPEC im Register als gesetzt und greifen über die vorhandenen Familien F09/F06.
- **Hinweis:** Hörbar wird das erst, wenn diese Figuren einen Anlass zum „Sprechen“ haben. Heute spricht im Spiel nur die Begrüßung der Bewohner (Bäuerin, Lorekeeper). Bots, Geister und Aliens begrüßen nicht. Ein Anlass dafür (z. B. Sprechblase, Bemerken, Treffer) wäre eine Entscheidung für WS-NPC/WS0.
- farmer_harke: Laut WS0 ist er jetzt Alias von farmer_b (132 Figuren). Der Snapshot in mvp (@0050419) zeigt noch 133 Figuren und farmer_harke ohne chatter; der Lead zieht ihn nach. Im Ton ist dafür nichts zu tun, der Leser löst dann von selbst auf.

**2 · Musik-Katalog** `40_AUDIO/music_catalog_r1.json` (kfb.music-catalog/1), **nur einlesbar, nichts zugeordnet, nichts gespielt**
- `prepare.mjs` übernimmt die Kopfdaten in den Ton-Index:
  - je Song id, BPM, Einsatz, Tonart;
  - je Stem Familie, Phrasen, eigenständige Phrasen (`unique`), Tonart und Manifest-Pfad.
- Saxophon-Stems sind ausgelassen (WS0: Übersprechen).
- Laufzeit: `musicCatalog()` und `harvestPhrases(song, family)`. Die zweite Funktion lädt das Manifest und liefert die eigenständigen Phrasen (ohne `dup_of`) mit url, Grundton, Kontur, Länge, LUFS und Einsatz in Schlägen.
- Geladen wird nur lokal über den Dev-Server (`/@kfb-audio/chatter/…`). Auf der Site liegt die Ernte vorerst nicht (≈ 115 MB WAV, noch keiner Figur zugeordnet).
- Gemessen: 4 Songs (surf 150, efunk 142, orchester 108, orchester2 104 BPM). orchester/adv_clarinet ergibt 93 eigenständige Phrasen, wie bei WS0.
- **Orchester-Zuordnung je Phrase:** Mit dem Advanced Split (ein Stem je Instrument) ist sie nach WS0 erledigt. WS-Audio meldet daher keine eigene Zuordnung nach Tonlage.
- **Offen aus Eintrag 11:** Der Katalog deckt die Suno-Testsongs ab, **nicht die Jukebox-Titel** (14 Suno-Roadtrip, 24 Cozy). Dafür gibt es noch kein BPM, keinen Downbeat und keine Tonart, `musicPulse()` schätzt das Tempo weiter aus den Kicks. Bitte bei Gelegenheit die Jukebox-Titel in denselben Katalog aufnehmen.

**3 · Georgs Entscheidungen (Hub):** q177 neue Familien-Clips, q178 Familien für Skelette, Soldaten, Orc-Band, Disco, gothgirl und Fluffer, q179 Begrüßung unter Musik −4 oder −7 dB. Bis dahin gilt der Rückfall wie gehabt. Kein selbst vergebenes Instrument.

**Tests:** audio-mixer (neu: Melodica, `musicCatalogIndexed`, Pfadschutz für `chatter/`), characterRegistry, contract-static und audio (headless, neu: `musicCatalogReadable`) alle PASS. Hauptthread 0,13 ms/Bild, p95 0,2 ms. Site-Trockenlauf: 569 Dateien, 245,5 MB.

## 13 · 22.10. · Sprachmelodien: Stand, was fehlt, Suno-Ernte · für WS0 (Georg: „schreib das in den Status für WS0“)

**Georg 22.10. nach dem Begrüßungs-Video:** „gefällt mir schon ganz gut … passt für die Atmosphäre“. Anfangs hielt er die Begrüßung für Umgebungsmusik. Möglicher Schritt bei WS-Audio: Musik bei der Begrüßung stärker absenken (heute −4 dB, z. B. −7 dB); noch nicht gemacht, Georg entscheidet. Nächster Schritt laut Georg: Sprachmelodien für die übrigen Figuren ausbauen. Dazu will er mit WS0 Suno-Songs produzieren und aus den Stems Melodien ernten.

**Stand im Spiel** (`ws-audio/r1` → `ws1/mvp-r1`, Lead hat gemergt):
- Begrüßung liest das Instrument **nur** aus dem Register: `chatterOf(residentId)` (Lead-Leser `src/characters/registry.js`, V-682).
- Reihenfolge: Register-Instrument → Bewohner-Stimme `resident_voices_r1` (WS0 geliefert 22.10., 16 Clips) → alter Platzhalter. Werte mit Status todo, PREFILL oder DESIGN zählen als nicht gesetzt (Brief §6). Kein Rückfall „Instrument nach kind“, also kein selbst vergebenes Instrument.
- Sichtbar je Figur in `__kfbAudio.stats().chatter`: `set:<Familie>` | `fallback:resident` | `fallback:placeholder`.
- Klangmaterial: `chatter_families_r1` (12 Familien × 9 Gefühle + 4 Rufe, je 0,8 s, Pegel aus dem _lufs-Bericht). Zuordnung Instrument → Familie in `cueMap.js` (`CHATTER_FAMILIES`).
- Anlass → Gefühl: geheilt → froh, kennt dich → neutral, erste Begegnung → staunend, nach Kampf → ängstlich.
- Im Spiel klingen damit nur die 2 Bewohner: Bäuerin (farmer_b, Akkordeon) und Lorekeeper (Klarinette). Video: lokal `kfb-audio-begruessung.mp4` (privat, nicht im Repo).

**Register heute (Snapshot des Lead, @1e30e4a):**
- chatter gesetzt bei 6 Figuren: farmer_b, lorekeeper, lady_dory, lord_hunky, frizzlebob (gesperrt bis FB_CANON), demon_lord.
  - demon_lord hat nur style („Oktave tiefer, Sättigung, langer dunkler Hall“) und **kein Instrument**, deshalb klingt dort der Platzhalter.
- PREFILL (gilt im Spiel als leer) bei 8: q_ghost Singende Säge, q_alien/q_alien_tall Theremin, Bots/robot_one/robot_two Melodica.
- Alle anderen 120 sind todo, darunter farmer_harke (castId der Bäuerin, ID-Frage liegt beim Lead).

### Was fehlt, in dieser Reihenfolge

1. **Instrumente im Register festlegen** (Georg/WS0), zuerst für Figuren, die im Spiel schon Töne machen: Skelette (Patrouille), Spielzeugsoldaten, Bots, Fluffer-Sorten (K15: ghost, atlantis, utopia mit wechselnden Sorten), Orc-Band, Disco (K12), gothgirl.
   - **Schnellster Gewinn:** PREFILL bestätigen. Für Säge (F09_saw) und Theremin (F06_theremin) gibt es die Clips schon; Geist und Aliens klingen dann sofort.
2. **Neue Familien-Clips** für gewählte Instrumente ohne Material, im gleichen Raster wie `chatter_families_r1` (9 Gefühle + 4 Rufe, ≥ 0,8 s erzeugen, −16 LUFS, _lufs-Bericht). Bereits vorgeschlagen: **Melodica** (Bots). Weitere Kandidaten aus `CHATTERBOX_SPEC_R2.md` §2: Flöte/Panflöte, Horn, Kazoo, Maultrommel, Trompete, Geige.
3. **Eigene Sprachmelodie je Figur.** Heute klingen zwei Figuren mit demselben Instrument gleich. Gebraucht werden je Figur ein Motiv bzw. eine Signatur und, für Sprechblasen-Dialoge, kurze Grains (Spec §212: 4–8 Vokal-, 3–6 Klick-, 2–4 Emotions-Grains, 1–2 Signatur-Grains je Familie bzw. Figur).

### Suno-Ernte (Georgs Plan): Hinweise von WS-Audio, damit nichts doppelt entsteht

Der Plan passt zur Spec (§208: „1 Farm = 1 Stil + Instrumentfamilie + Emotionsfeld“, `SUNO_SOLO_TESTS_R1.md`, `harvest_phrases.py`, 3–5 Motive und 10–20 Grains je Farm). Bitte darauf aufsetzen statt neu:
- **Solo-Prompts vor Song-Stems.** Stems aus vollen Songs tragen oft Reste anderer Spuren. Stems nur dort nehmen, wo Solo nicht trägt.
- **Je Instrument-Familie ernten, nicht je Figur.** Figuren derselben Familie unterscheiden sich über Motiv und Register (Spec §190: Fagott ↔ Oboe, Tuba ↔ Trompete, Cello ↔ Geige).
- **Je geerntetem Stück mitliefern:** Tonart bzw. Grundton, BPM, Downbeat bzw. Einsatz, LUFS. Damit spielt die Laufzeit Sprachmelodien passend zur laufenden Jukebox; das gehört zur offenen Katalog-Bitte aus Eintrag 11.
- Ablage wie bisher: `assets/private/40_AUDIO/…` mit _lufs-Bericht; Zuordnung Figur → Familie/Motiv nur über das Register (`chatter.family`, `chatter.instrument`, ggf. neues Feld für Motiv/Grains, Entscheidung WS0).

**WS-Audio übernimmt, sobald Material da ist:** den Abspieler, der Grains bzw. Motive zu Sprachmelodien setzt (an Sprechblase und Begrüßung, wenn möglich auf der Musik-Uhr). Vorher baut WS-Audio daran nichts.

**Weitere Neuigkeiten seit Eintrag 12:**
- **K15:** bis zu 3 Dark Fluffer zugleich. Ton aus `fluffer.events()` je seq, am Maul, Zustand geheilt/feindlich je id, Ereignisse über 120 m still; auf mvp nachgetestet, PASS.
- **Knet-HUD (WS1e):** Radio Vor/Zurück/Pause über `musicSkip`/`musicPause`; die Regler sitzen in der Zahnrad-Tafel.

## 12 · 22.10. · Begrüßung der Bewohner (Gerücht D2 / G-2) · BESTELLUNG an WS0: Bewohner-Stimmen

**Georg 22.10. (über den Lead):** Die Begrüßungen bekommen Sprechblase und Stimm-Laut, ohne Wort.
**Stand:** `ws-audio/r1`, lokal; der Lead merged.
- Quelle (WS-NPC): `mods.npc.events()` liefert `greet { reason: cure | fight | known | first, id (farmer_b | lorekeeper), at, t, seq }`.
- Ausgelöst wird beim Bemerken des Spielers, zugleich mit dem Begrüßungs-Clip.
- Der Ton spielt am Kopf der Figur, einmal je `seq`, und senkt die Musik kurz um −4 dB.
- **Platzhalter, bis die Stimmen da sind** (keine Figuren-Instrumente verwechselt): cure/known/first → F10_leitmotif_sting_name (Kalimba, keiner Figur zugeordnet), fight → F08_breath_soft.
- Tests: `audio-mixer` und `audio` PASS.

**Bestellung an WS0** (Satz `resident_voices_r1` in `assets/private/40_AUDIO/elevenlabs_r1/`, mit `_lufs`-Bericht; die Namen sind im Spiel schon verdrahtet und greifen automatisch):
- Stil wie Fluffolect: Jede benannte Figur „spricht“ mit ihrem Solo-Instrument (V-508 / Signatur-Ornament). Die Instrumente der Bewohner bitte von WS0 festlegen, nicht Posaune (FrizzleBob), Okarina (Dory) oder Fagott/Kazoo (Hunky).
- Vorschlag: Bäuerin Farmer B (Theaterdirektorin) → Akkordeon oder Mundharmonika; Lorekeeper → Klarinette oder Holzflöte, tief.
- Je Bewohner 4 Gründe × 2 Varianten (_a/_b), 0,5–1,0 s:

| Datei | Grund | Ausdruck |
|---|---|---|
| V01_farmer_greet_known_a/b · V02_lorekeeper_greet_known_a/b | kennt den Spieler | freundliches „Hm-hm!“, zwei Töne steigend |
| V01_farmer_greet_cure_a/b · V02_lorekeeper_greet_cure_a/b | Spieler hat den Fluffer geheilt | dankbar-froh, kleine Aufwärtsfigur |
| V01_farmer_greet_fight_a/b · V02_lorekeeper_greet_fight_a/b | Spieler hat gekämpft | vorsichtig, kurzes skeptisches Brummen |
| V01_farmer_greet_first_a/b · V02_lorekeeper_greet_first_a/b | erste Begegnung | neugieriges „Hm?“, fragend |

- Prompt-Endung wie in den Sätzen: „…, solo instrument, cartoon clay world, warm and handmade, isolated, no voice, no words, no music bed“.

## 11 · 22.10. · ABGLEICH an WS0: Musik-Messwerte und Visualizer – nichts doppelt bauen

**Georg 22.10.:** „wir hatten für die stems auf der audio site eigentlich schon alles gemessen und auch für die music visualizer vorbereitet … sonst bitte info an WS0 zum abgleich“.

**Was WS-Audio gebaut hat** (alles lokal auf ws-audio/r1 bzw. in ws1/mvp-r1):
- `musicPulse()`: Form nach dem WS0-Entwurf `kfb.audio.presentation-pulse.v1`, mit WS1d für die Boombox-Ringe abgestimmt.
  - Bänder Bass/Mitte/Höhe und Kick kommen aus einem Analyser.
  - **Tempo und Takt-Phase werden aus den Kicks geschätzt.** Echt gemessen bei 60 fps: Suno-Kicks sicher, das Tempo sprang 127↔150 BPM; nachgebessert (gefaltete Abstände). Cozy hat kaum Tempo.
- Lautheit je Musiktitel (BS.1770, eigene Messung, Gegenprobe gegen WS0 ±0,05 LU): `scripts/audio/music-gain.json`.
- Stichworte je Titel (Biom/Tageszeit) für die Jukebox: `scripts/audio/music-tags.json`, eigener Vorschlag.

- Zweite echte Messung nach der Nachbesserung (Slot, 60 fps): Suno „Final Lap Lift A“ 2,5 Kicks/s, Tempo stabil bei 104–106 BPM, Sicherheit schwankt (max. 0,83, zuletzt 0,17); Cozy „Chickens In The Meadow“ ≈ 117 BPM, Sicherheit ≤ 0,58.
  - Ohne Katalog weiß ich nicht, ob das richtig ist. Die Kick-Rate (≈ 150/min) passt auch zu einem Tempo um 150; das ist das übliche Halb-/Doppeltempo-Problem. **Grund mehr für Katalog-BPM.**

**Was ich vorgefunden habe:**
- `tools/KFB-ToolBox/audio/adaptive-music-proof-01/music-clock.mjs` (MusicClock: bpm, beatsPerBar, phraseBars, epoch → beat/bar/phrase, nextBoundary).
- `tools/KFB-ToolBox/audio/runtime/runtime-registry.v1.json`: bpm für 6 Stem-Sätze (70–120 BPM).
- `media/3D_Assets/Sounds/jukebox.json` (main): bpm für 13 andere Songs; aus der Fahrt-Liste nur „Shepards Coaster“ (90).
- Die Audio Site lädt `catalog.snapshot.json` mit bpm/moods je Titel. **Diese Datei liegt nicht im Repo**, und ich komme nicht an sie heran.
- WS0-Entwurf `kfb.audio.presentation-pulse.v1` (planning/world-pulse-…-2026-10-07): Danach richtet sich musicPulse.

**Fragen an WS0:**
1. Gibt es für **music/suno-roadtrip-jukebox-v2 (14 Titel)** und **music/cozy-tunes-classics (24 Titel)** gemessene Werte: bpm, erster Downbeat bzw. Beat-Raster, Stimmungen/Moods, Lautheit? Wo liegen sie? Am besten als Datei im privaten Branch `assets/private`, z. B. `music/<liste>/catalog.json`.
2. Gibt es eine fertige **Music-Visualizer-Schnittstelle** oder Daten dafür (Stems, Bänder, Energie-Kurven je Titel)? Welche Form soll die Welt bekommen, und ist sie gleich `presentation-pulse.v1`?
3. Sollen Stichworte und Lautheit je Titel aus eurem Katalog kommen statt aus meinen Dateien?

**Vorschlag WS-Audio, sobald der Katalog da ist:**
- `musicPulse` stellt den Takt auf **MusicClock mit Katalog-BPM + Downbeat** um. Der Analyser liefert dann nur noch Energie/Bänder und Kick als Bestätigung.
- Tags und Lautheit kommen aus dem Katalog; meine zwei Dateien fallen weg.
- Die Form für die Welt (WS1d, später Gras) bleibt gleich.
- Bis zur Antwort baue ich an Takt, Tags und Lautheit nichts weiter.

## 10 · 22.10. · Optimierung: schneller Start, einheitliche Lautheit, Musik nach Biom, Raumklang

**Georg 22.10.:** „dann gerne 2–5“. Hörpult entfällt, die Audio Site deckt das ab.
**Stand:** `ws-audio/r1` @609cbef, auf `ws1/mvp-r1`; der Lead merged nach.

1. **Laden in Stufen und Racer nur bei Bedarf** (Brief-Pflicht Lazy-Load):
   - Stufe 1: Atmo (nur der aktuelle Kontext), zu Fuß die Schritte bzw. im Racer der Motor, Grundstock der Tonbank je Modus.
   - Stufe 2 im Hintergrund: Kampf, Rest der Tonbank, Motor bzw. Schritte des anderen Modus.
   - Der Racer lädt nur die gebrauchten Dateien: zu Fuß 8 statt 38, im Racer 25. Zu Fuß ist er nach 3 s angehalten (0 statt 19 stumme Schleifen).
   - Patches: `kfb-ambience` start lädt zuerst nur den Kontext, `footsteps/audio.mjs` lädt parallel.
   - Gemessen (headless, Last 14): Ton bereit zu Fuß **2,4 s** (vorher ≈ 10 s), im Racer **4,0 s**; alles nach 7–8 s.
2. **Einheitliche Lautheit:**
   - `scripts/audio/loudness.mjs` misst nach BS.1770-4 headless; die Gegenprobe gegen WS0 weicht ±0,05 LU ab.
   - Einzeltöne: Alle 32 Sätze haben inzwischen den WS0-Bericht (−16 LUFS), der Vorrang behält.
   - Musik je Titel auf −18 LUFS: Cozy lag bei −37…−19, Suno bei −16…−12; ausgeglichen bis +12 dB bzw. −2…−5 dB, Spitze ≤ −1 dBFS.
   - Die Werte stehen in `scripts/audio/music-gain.json` (Schlüssel sha1, keine Titel), gelten also auch im Cloudflare-Build.
3. **Musik nach Biom und Tageszeit:**
   - Stichworte je Titel stehen in `music-tags.json` (sha1).
   - Gewichtete Zufallsfolge: Biom +3, Tageszeit +2, Schnee +3, Flug +1; die letzten 3 Titel sind gesperrt.
   - Kontext ist der Atmo-Kontext, also auch die Biom-Fahrt über `ambienceContext`. Kein Wechsel mitten im Lied.
4. **Raumklang:**
   - Hall je Umgebung (offen / Wald / Tal mit Echo) als Faltungshall-Send von SFX und Atmo; die Raumantwort wird gerechnet, es gibt kein neues Klangmaterial.
   - Die Umgebung kommt aus Biom und Geländeform (Anstieg > 6 m in 25 m = Tal).
   - Verdeckung: Gelände über der Sichtlinie → Tiefpass und −3…−7 dB.
- **Tests:**
  - `audio-mixer` PASS: Gewichte, Verteilung, Umgebung, Verdeckung, Kontext-Vorrang.
  - `audio` (Browser) PASS: Tal-Ort gefunden → canyon; Ton hinter einem Hügel gedämpft; Lade-Stufen.
  - `contract-static` PASS.
  - Audio-Takt im Mittel 0,16–0,21 ms/Bild.
- **Offen** (nicht Ton):
  - K10-Arena im Spiel (Lead/WSA);
  - WSA-Manifeste mit den v2/v3-Neuaufnahmen;
  - Wetter der Biom-Fahrt (WS1b schließt an);
  - Ende-Ereignis für L15;
  - Diorama-Orte, Dschungel-Biom;
  - Merge nach main mit Georg.

## 9 · 22.10. · Abnahme durch Georg: PASS (Feinabstimmung später)

**Georg 22.10.:** „das ist soweit PASS mit tune für details später“.
- Grundlage:
  - die Videos Abnahme R1, Kampf, Gruppen, Heilen, Hörprobe mvp-r1 und Neue Töne;
  - Browser-Test `audio` PASS auf ws-audio/r1 @b863c35 (+ Video-Profil `neu`).
- Neu seit Eintrag 8:
  - `ambienceContext` / `ambienceLightning` für die Biom-Fahrt (WS1b, V-619), mit Vorrang vor AudioHost;
  - Wetter- und Tageszeit-Cues (W01–W06);
  - Band-Publikum über `band.positions()` (Fix des Lead).
- Feinabstimmung (Pegel einzelner Töne, Mischung) folgt nach Georgs Ohr.

## 8 · 22.10. · WS0-Lieferungen eingebaut (Combat-AV L1–L13, Neuaufnahmen, NPC-Schritte, schwere Schritte)

**Georg 22.10.:** „mach weiter mit den fehlenden Tönen von WS0“.
**Stand:** `ws-audio/r1` @7c3cdab, auf `ws1/mvp-r1` @44f55f2, lokal; der Lead merged nach.
**Quelle:** assets/private @5ddc156, alle Sätze mit `_lufs`-Bericht (−16 LUFS), den prepare bevorzugt.

| Satz | Eingebaut |
|---|---|
| combat_av_fix_r1 L01–L13 | Abgang Bogen L01, Armbrust L02, Zauber L04 (+X09), Würfel L06. Treffer: Pfeil L03, Zauber L05, Spieler-Bonk L08, Monster-Biss L07 + L08. Neue K10-Ereignisse `kill` → L09, `windup` → L13, `block` → M04 v3. Waffe fällt L10. Rauch L12 + T08. Gatling: Anlauf L11 up → Dreh-Schleife + X02 → Auslauf L11 down |
| combat_av_fix_r1/r2 (Neuaufnahmen v2/v3) | X07 v2 (Bolzen-Einschlag), K03 v2 (Metall), R03 v3 (Racer über Fels), DF04 v3 (Goo-Fleck), DF10 v3 (Augen-Plopp), F08 v3 (Früchte fallen nach Baumtreffer), D05 c durch a/b ersetzt |
| combat_av_fix_r3 | L14 Hüpfer (Spieler und K10 `jump`), L15 Blödsinn-Stinger bereit als `ui.gameOver` (braucht ein Ende-Ereignis) |
| npc_steps_r1 | Bewohner-Schritte Knete N01/N02/N03 je Boden; Skelett N04, Spielzeugsoldat N05, Bot N07. Präsenz-Schleifen: Aufziehschlüssel N06 (solange der Trupp geht), Goo-Gleiten N08 (zwischen den Hüpfern des feindlichen Fluffers). Geheilter Hüpfer N09. Gruppen: Bot-Wut N10 (+C13), Aufstehen N11 (Soldaten/Bots), Skelett-K.o. N12, Soldaten-Pfiff N13 bei Wut, Bot-Piep N14 beim Beruhigen. Publikum an der Band N15 (leise Schleife, ≤ 30 m) |
| heavy_steps_r1 | Large-Rig stampft (H01 Gras, H02 Stein, H03 Sand; H04–H06 bereit), sobald der Schritt-Eintrag `rig: 'large'` trägt |

- **Tests:** `audio-mixer` PASS (alle Platzhalter ersetzt, neue Ereignisse, Gruppen), `audio` (Browser) PASS: 8 neue Kampf-Ereignisse klingen, Biss = 2 Ebenen, Schleifen Aufziehschlüssel und Goo-Gleiten laufen.
- **Site:** `site-copy --dry` ergibt 370 Dateien, 242 MB, keine Datei > 25 MiB.
- **Nicht im Spiel verwendet** (liegt bereit oder gehört anderen):
  - O2_backfire v3: Der WSA-Racer schließt O2 im Manifest aus.
  - C01–C12 v2/v3: Der WSA-Kampf nutzt sein eigenes Manifest; Bitte an WSA, die Neuaufnahmen dort aufzunehmen.
  - W04 v3, A01, A03: kein Wetter bzw. kein Dschungel-Biom.
  - D01 arm_beeps v3: kein Scharf-machen-Ereignis.
  - B11, R03b, R07: keine passende Stelle.
- **Offen bei WS0:** nichts aus meinen Listen. Offen bei anderen:
  - WS-NPC: `rig: 'large'` an den Schritt-Einträgen der Large-Rig-Figuren;
  - Arena: K10-Ereignisse im Spiel inklusive `windup`, `kill`, `block`;
  - Spiel: ein Ende-Ereignis für den Stinger L15.

## 7 · 21.10. · Ton im gemeinsamen Spiel-Branch ws1/mvp-r1 · private MVP-Site · Fluffer 0,8 m

- **Lead 21.10. (V-618, ein Spiel-Branch):** `ws-audio/r1` ist in `ws1/mvp-r1` zusammengeführt; neue Ton-Arbeit setzt dort auf. `ws-audio/r1` steht jetzt auf `ws1/mvp-r1` @44f55f2.
- **Abnahme auf @44f55f2** (eigener Scratch-Worktree):
  - `test:audio` PASS (Einheitstest und Browser).
  - Hörprobe als MP4 an Georg, alles auf world=probe: Fahrt/Flug mit Untergrund, Drift, Boost und Suno; zu Fuß Skelette hit/aggro/ko/awake/calm, Dark Fluffer (0,8 m) spit/impact/drop/healed/burst/fade, Cozy Tunes.
  - Keine Fehler; Audio im Mittel 0,25 ms/Bild, p95 ≤ 0,5.
  - Die NPCs stehen auf dem Probe-Gelände ordentlich.
- **Private MVP-Site:**
  - Georg 21.10. direkt an WS-Audio: „ja, alles darf auf die Site“, also Suno, Cozy Tunes und ElevenLabs auf der passwortgeschützten Site.
  - `AUDIO_ROOT` kommt über `VITE_KFB_AUDIO_ROOT` (Site `/kfb-audio/`).
  - `scripts/audio/site-copy.mjs` läuft nur mit `SITE=1`: 341 Dateien, 242 MB, keine Datei > 25 MiB.
  - Die Audio Site kommt zur Bauzeit von GitHub raw (öffentlich, gepinnt); die WSA-ZIP wird mit Node entpackt.
  - Geprüft mit `build-site.mjs` des Lead und statischer Auslieferung: mode full, alle Module, Musik, Schritte, Wasser; keine 4xx auf `/kfb-audio/`.
  - Der normale Build bleibt ohne private Töne.
- **Dark Fluffer 0,8 m** (WS0 V-616): alle 13 Fluffer-Klänge 4 % höher (`FLUFFER_PITCH`).
- **Befunde an den Lead** (nicht Ton):
  - `contract-static` oneKeyListener: `startCurtain.js` hat einen eigenen keydown-Listener.
  - `build-site.mjs`: `path.join` bei absolutem `KFB_SITE_OUT`.

## 6 · 21.10. · Heil-Video · Schritte und Hüpfer der NPCs · Notiz Fluffer-Größe

- **Heil-Video** (Georg „ja, dreh das Heilen nach“):
  - Ablauf im Bild: windup, spit, impact, taint, drop → Schuss B → healed, burst, fade.
  - MP4 5 MB an Georg, lokale Vorschau-Kombination.
  - Ursache der Fehlschüsse vorher: Taste B zielt in Kamerarichtung, und der Teleport dreht nur die Figur. Das Profil dreht die Kamera jetzt mit (`rotateAzimuthTo`).
- **Schritte und Hüpfer** (WS-NPC baut Ereignisse aus dem echten Sohlen-Kontakt; Georg will Schritte im Ton):
  - Gelesen werden `groups.steps()`, `npc.steps()` und `fluffer.hops()`.
  - Je Quelle wird beim ersten Lesen nur gemerkt; entdoppelt über `id|foot|t` bzw. `id|t`; über 35 m still.
  - Bewohner: Audio-Site-Bänke je Boden (Gras `digital_footstep_grass`, Weg `…gravel`, Platz `foley_footstep_concrete`).
  - Skelette `C06` leise, Spielzeugsoldaten `D04` leise, Bots `C08` leise – Platzhalter, siehe Lücken.
  - Fluffer-Hopser `DF07`.
  - Test `audio`: 4 nachgestellte Schritte/Hüpfer klingen, der alte und der ferne nicht, keine Wiederholung – **PASS**.
  - **Echt geprüft** mit ws-npc/phase-a f6e7eed (Spiegel 30fda96) in der Vorschau-Kombination:
    - bei den Skeletten 3,5 Schritte/s, beim Fluffer 5,5/s (Hüpfer + Nachbarn), im Dorf 7,5/s;
    - höchstens 16 Stimmen der Bank, Audio 0,08 ms/Bild (p95 0,2), keine Fehler.
    - Schritte haben den niedrigsten Rang und höchstens 8 zugleich; dadurch fielen 3 von 150 aus. Kampf- und Fluffer-Töne verdrängen sie nie.
- **Lücken für WS0** (Bestandsaufnahme WS-NPC, übernommen):
  1. Schritte der Bewohner in Knete je Boden (Gras, Sand/Weg, Fels);
  2. Skelett-Schritt: kurzes Knochen-Tock, leiser als C06;
  3. Spielzeugsoldat: harter Plastik-Marschtritt, dazu das Ticken des Aufziehschlüssels als leise Schleife beim Gehen;
  4. Bot-Schritt: metallisches Stapfen, kombinierbar mit C08;
  5. Dark Fluffer: Goo-Gleiten/Schmatzen als Schleife zwischen den Hüpfern, dazu ein geheilter Hüpfer (heller, ohne Goo);
  6. Bot-Wut: Zorn-Piepen bzw. Überhitzen;
  7. Aufstehen nach K.o.: Knete-Rappeln;
  8. optional: Publikums- und Pausengeräusche für die Ork-Band.
- **Notiz Georg 21.10. → WS1/WS0:**
  - Die Fluffer sollen 30–40 % kleiner sein, damit sie besser zu den KayKit-Figuren passen. `heightM` 1,1 → ≈ 0,7 m.
  - Georg vergleicht gerade 1,1 / 0,8 / 0,7 m; WS-NPC setzt den Wert nach seiner Wahl.
  - Der Ton zieht mit, die Fluffer-Klänge werden 5–8 % höher.

## 5 · 21.10. · Video Gruppen-Ton (lokale Vorschau-Kombination)

**Georg 21.10.:** „mach ein Video mit dem Gruppen-Ton“.
- **Vorschau-Kombination:** terrain/probe-world + ws-npc/phase-a @4625c6e + ws-audio/r1 als Wegwerf-Ordner im Scratch, ohne Branch, ohne Push. Die Konflikte sind nur dort gelöst; offiziell bleibt die Reihenfolge des Lead.
- **Welt:** M1-Standard (`#m1,harvest,look=terrain3,npc,fluffer,patrol,band`). Die NPC-Orte sind nur dort geprüft (WS-NPC).
- **Ergebnis** (alles aus echten Spiel-Ereignissen über Taste B):
  - Skelette, Bots und Spielzeugsoldaten je hit 1–5, aggro, ko, awake, calm, fluff;
  - Dark Fluffer windup, spit, impact, taint, drop;
  - keine Seiten- oder Modulfehler, Audio 0,16 ms/Bild (p95 0,3), 26 Stimmen.
- **Nicht im Video:** das Heilen des Dark Fluffers (healed + Augen-Plopp + bunter Fluff). Der Schuss traf zweimal nicht; der Adapter ist im Test belegt.
- **Video:** MP4 17 MB an Georg (privat). Profil: `PW_GPU=1 npm run audio:video:gruppen`, nur in der Kombination lauffähig.

## 4 · 21.10. · Gruppen-Ton für die NPC-Gruppen

**Georg 21.10.:** „mach weiter mit dem Gruppen-Ton“. **Stand:** `ws-audio/r1` @6d4c43c, lokal.
**Quelle:** WS-NPC 21.10. Gelesen wird `mods.groups.events()`, ein Ringpuffer mit `{ type, id, n?, at:[x,z], tag?, t, group }`. Er wird alle 0,1 s abgefragt und über `group|type|id|t` bzw. `tag` entdoppelt. Die Ereignisse kommen nur aus der Spielerblase. Bei WS-NPC ist keine Änderung nötig.

| Gruppe | hit (Stufe n hebt an) | aggro | ko | awake | calm | fluff |
|---|---|---|---|---|---|---|
| skeleton_patrol | C06 skeleton_clatter | C06 + M02 club_whoosh (Ausholen) | C06 + C01 body_fall + M08 dizzy_stars | M09 getting_up + C06 leise | C06 leise | E05 fluff_scatter |
| toy_squad | D04 toy_plastic_bounce | X06 holster_draw (Waffe ziehen) | K06 cartoon_bonk + D04 + M08 | M09 | X06 leise (wegstecken) | E05 |
| bot_crew | C08 bot_servo | C13 bot_angry (WSA-Kampf) | C14 bot_collapse (WSA) + M08 | C08 + M09 | C08 leise | E05 |

- **Tests:**
  - `audio-mixer`: alle 18 Kombinationen haben Ton, die Stufe n wirkt, die Schlüssel stimmen – **PASS**.
  - `audio` (Browser): 18 Kombinationen direkt (26 Klänge). Danach der Abfrage-Weg wie bei WS-NPC über ein Prüfmodul `mods.groups`: 3 Ereignisse genau einmal, beim zweiten Lesen keine Wiederholung – **PASS**.
- **Zusammenführung mit WS-NPC** (für den Lead), Probe mit `git merge-tree`, ohne Last:
  - `terrain/probe-world` und `ws-npc/phase-a` stoßen schon untereinander zusammen, in `package.json` und `m1-terrain.js`. WS-NPC enthält probe-world noch nicht.
  - Dazu kommt `M1World.jsx` mit den 3 AudioHost-Zeilen.
  - Alle Teile von WS-Audio sind additiv und klein.
- **Gruppen-Lücken (an WS0, optional):**
  - ein eigenes Skelett-Knochen-Zerfallen für das K.o.;
  - ein Spielzeugsoldaten-Ruf ohne Worte;
  - ein Bot-Piepser ohne Arcade-Ton.
  - Bis dahin klingt es mit den vorhandenen Sätzen.

## 3 · 21.10. · WS0-Lieferung ws_audio_gaps_r1 eingebaut · Kampf-Video

**Georg 21.10.:** „mach ein neues Video mit dem Kampf-Ton“.
**Stand:** `ws-audio/r1` @cf59913 + Video-Profil, lokal.

**Eingebaut** (die 20 Töne von WS0; Pegel aus `ws_audio_gaps_r1_lufs/lufs_report.json`, −16 LUFS, geht vor der Spitzen-Normierung):
| Ton | Anschluss |
|---|---|
| R01–R04 hover_over grass/sand/rock/water | Racer am Boden: Schleife je Untergrund (Hang/Fels/Gras/Talboden wie `terrainDustColor`, Wasser = Fluss nah oder Meer), nach Tempo überblendet, in der Luft aus |
| R05 drift_slide_loop · R06 drift_charge | Drift: Rutschwinkel aus Lage gegen Fahrtrichtung (nur lesend); `driftCharge`-Ereignis aus k2t |
| R07 hover_brake_hiss | Bremsbeginn ab 6 m/s |
| S01 wading_steps | Schritte im Wasser statt Untergrund-Bank |
| K02 bomb_throw | K10 release Bombe |
| K03/K04/K05/K07 impact metal/glass/clay/domino | K10 contact nach `material` |
| K06 debris_tail · K08 leaves_burst | Explosion (Obstgarten und K10) · Baumtreffer am Obstgarten |
| K01 rocket_flight_loop | liegt bereit (`k10.rocketLoop`), sobald die Arena den Raketenflug meldet |
| A02 coastal_birds_loop | am Meer (Biom beach), nicht nachts |
| A01 jungle_night · A03 thunder_dry | liegen bereit; es gibt noch kein Dschungel-Biom bzw. Wetter |

- **Obstgarten V/B/N** läuft jetzt über die Kampf-Tabelle:
  - Faust: Schwung (M01) → Schlagring + Baumschütteln + Laub;
  - Blaster: Abgang in 3 Ebenen → Bolzen-Einschlag nach Flugzeit;
  - Explosion: C08 + Holzsplitter + Laub + Trümmer-Ausklang.
- **Noch offen bei WS0:** Combat-AV L1–L13, u. a. Bogen, Armbrust, Cast, Spieler-Bonk, Kill-Pop.

**Kampf-Video** (an Georg, privat; `PW_GPU=1 npm run audio:video:kampf`):
- MP4 H.264/AAC, 960×540, 20 MB, knapp 2 Minuten.
- Ton in 99,7–100 % der Bilder messbar, keine Seiten- oder Modulfehler.
- Hauptthread im Mittel 0,16–0,21 ms, p95 ≤ 0,4 ms.
- Teil 1, Obstgarten: Schuss und Explosion treffen den Baum. Die Faust trifft im Skript nicht, weil der Abstand zum Baum zu groß ist; zu hören ist dann der Schwung.
- Teil 2, Hörprobe der Arena-Waffen: per Prüfskript ausgelöst, weil die Arena noch nicht im Spiel ist. Das steht so im Bild.
- Teil 3, Fahrt: Racer über Gras/Sand, Drift-Schleife (max. 0,68), Drift-Boost und Bremszischen. Im Testfeld springt der Racer oft über Rampen.

**Tests:** `audio-mixer` PASS, `contract-static` PASS, `audio` (Browser, inkl. Untergrund-Schleifen am Boden) PASS.
**NPC-Anschluss** (WS-NPC 21.10.):
- Gruppen-Ereignisse über `mods.groups.events()`: hit, aggro, ko, awake, calm, fluff für skeleton_patrol, toy_squad und bot_crew.
- Dark Fluffer über `debug().events`. Beides wird per Polling gelesen, bei WS-NPC ist keine Änderung nötig. Den Gruppen-Ton baue ich als Nächstes ein.

## 2 · 21.10. · Kampf-Tabelle aus Combat-AV R1 im K10-Adapter

**Lead 21.10.:** Die Cue-Tabelle aus `research/audits/COMBAT_AV_R1.md` (VFX/SFX-Sitzung, Prototyp `ws1/combat-av-r1` @d408688) geht als Daten in `kfbAudio.k10`, ohne zweite Engine.
**Georg 21.10.:** „mach weiter mit der Kampf-Tabelle“.
**Stand:** `ws-audio/r1` @2c0272f, lokal.

- **Abgang je Waffe** (`WEAPON_LAUNCH`/`LAUNCH` in `src/audio/cueMap.js`):
  - gilt für die 13 Arena-Figuren, Zuordnung wie `_launchCue()`;
  - Ebenen Anschlag, Körper und Ausklang mit denselben Dateien, Pegeln, Versätzen und Tonhöhen wie der Prototyp r2.

| Waffe | Anschlag | Körper / Ausklang |
|---|---|---|
| Pistole | C05 a/b | X09_a +60 ms ×0,23 |
| Blaster | X01 a/b | C05_c +10 ms ×0,48 · X09_a +70 ms ×0,23 |
| Gewehr, Soldat r3d | C05 c/a, Tonhöhe ×0,85 | X09_a +60 ms ×0,27 |
| Gatling | C05 a/b/c ×0,42, Tonhöhe ×1,25, höchstens 9/s | dazu Schleife X02 (loopKeep), endet 180 ms nach dem letzten Schuss |
| Armbrust (Platzhalter L2) | M01_b ×0,86, Tonhöhe ×1,3 | T03_a +20 ms ×0,57 |
| Bogen (Platzhalter L1) | T03_b ×0,95, Tonhöhe ×1,15 | – |
| Zauberstab, Stab, Skelettstab, raise (Platzhalter L4) | X03 a/b ×0,67 | X09 +90 ms ×0,27 |
| Klinge | M01 a/b | Schwung immer vor dem Treffer (Regel R5) |
| Wurf, Rauchbombe | T03_a | Rauchbombe beim Aufschlag T08 (statt des fehlenden `impact.kinetic.air`) |

- **Gegner:** Der Wurf ist ein C04-Whoosh statt der Arcade-Kanone, Pegel ×0,4 (≈ −8 dB, Regel R3).
- **confirm.hit** gibt es nur bei eigenen Treffern auf Gegner, nicht bei eigenem Schaden und nicht bei der Rauchbombe.
- **Bisher stumm, jetzt mit Ton:** weaponDrop → I05; jump/land → C02/C01.
- **Weiter stumm** (Lücke): Kill/Schädel L9; Spieler-Treffer L8, bis dahin C01 punch_light leise.
- **Einsatz:** Die Bank plant 5 ms nach dem Aufruf (Regel R2 ≤ 20 ms; die Ausgabelatenz des Geräts ist nicht mitgemessen).
- **Tests:**
  - `audio-mixer`: Zuordnung aller 13 Waffen, Ebenen, Gegner −8 dB, confirm, Gatling, Rauch – **PASS**.
  - `audio` (Browser): jede Waffe spielt ihre Ebenen (Blaster 3, Pistole 2 …), Gegner 1, Klinge mit Schwung, Rauch, 12 Gatling-Schüsse mit Schleife, Bank danach ≤ 24 Stimmen – **PASS**.
- **Offen** (aus Combat-AV, nicht WS-Audio):
  - Ankündigung der Gegner, Lücke L13 Ausholen;
  - Motor-Ducking −4 dB bei schweren Treffern;
  - Lautheits-Normierung −16 LUFS durch WS0. Der Bericht hält fest, dass die Laufzeit-Normierung mit ±12 dB die Spanne von 30 LU nicht abdeckt.
- **Volle Reihe auf @2c0272f:** 33 von 48 grün, rot ist nichts.
  - g4 lief in der Kette einmal in ein Bildschirmfoto-Timeout (Last 22–24); allein ist g4 **PASS**.
  - Die übrigen 14 (g4preview … probeWater) sind auf Wunsch des Lead angehalten, damit er die Maschine bekommt. Sie folgen einzeln.
- **Anschluss im Spiel:** Die Arena-Module müssen ihre Ereignisse an `kfbAudio.k10({ type, weapon, side, target, energy, explosive, material, confirmed, position })` geben. Sobald K10 im Spiel ist, ist das eine Zeile beim Besitzer.

## 1 · 21.10. · Tier 0 steht lokal: ein Ton-Pfad, ganzer Ton auf dem Probe-Gelände

**Stand:**
- Branch `ws-audio/r1` im lokalen Repo `kfb-planet`; seit Eintrag 7 auf `ws1/mvp-r1` (gemeinsamer Spiel-Branch).
- Nicht gepusht und nicht nach main gemergt. Push erst nach WS0-Go, Merge nur mit Georg.
- Georg hat das 2-Minuten-Video mit Ton bekommen, auch als Handy-Fassung (MP4 H.264/AAC, 960×540, 17,7 MB). Die Abnahme durch sein Ohr steht noch aus.

**Volle Fassung lokal starten (ein Befehl):**
```
cd ~/kfb-ws1/kfb-planet/.claude/worktrees/affectionate-nash-61b1ea && npm run ton
```
- Öffnet `#m1,harvest,look=terrain3,world=probe` (zu Fuß).
- `npm run ton:fahrt` öffnet dasselbe mit `,car,fly` (Fahrt und Flug).
- Der Ton wird nach der ersten Taste oder dem ersten Klick hörbar.
- Unten links liegt der Knopf ♪ mit je einem Regler für Gesamt, Musik, Effekte, Atmo und UI, dazu „Ton aus“.

### Was läuft
- **Ein Ton-Pfad** (`src/audio/kfbAudio.js`):
  - genau ein AudioContext;
  - Busse Musik, SFX, Atmo und UI → Master → Sicherheitsbegrenzer → Ausgang;
  - Ducking: Musik −7 dB unter lauten SFX (Kampf, Crash, Explosion), −9 dB im Dialog, −2 dB beim Boost; die Atmo senkt sich unter Musik und Kampf selbst (kfb-ambience.v1);
  - Entfernungsdämpfung mit inverse-Abstand plus Tiefpass;
  - der Hörer sitzt an der Figur bzw. am Racer und schaut in Kamerarichtung.
- **WSA-Laufzeit-Pakete zuerst und 1:1 übernommen.** Quelle ist Audio Site 0.7.6, `kayfabizarro@945518d3`, `tools/KFB-Audio-Site/dist`; die Töne kommen aus `WSA_AUDIO_FLIGHT_CRASH_R1`.
  - Racer: Motor-Gitter L1–L5 mit Gängen und Schubabschaltung (V-378), Flug in den Arten jet, turbine und antigrav, Wind nach Tempo.
  - Kampf: C01–C18.
  - Atmo kfb-ambience.v1 (V-458, CC0).
  - Schritte (Foley- und Digital-Bänke).
  - Zwei kleine Patches, im Dateikopf vermerkt: die Atmo bekommt `moveWaterEmitters` (Quellen gleiten mit dem Hörer, statt neu zu starten); die Schritte bekommen `assetBaseUrl` und `surfaces`.
- **Tonbank** für die übrigen ElevenLabs-Sätze:
  - je Clip normalisiert (`normalize_report.json`);
  - Varianten im Wechsel, ±3 % Tonhöhe;
  - Pool mit 24 Stimmen.
- **Jukebox:**
  - Suno-Jukebox bei Fahrt und Flug, Cozy Tunes zu Fuß (V-129);
  - Zufallsfolge ohne direkte Wiederholung, 3 s Überblendung;
  - Wechsel erst nach 2,5 s im neuen Modus;
  - gestreamt, nicht dekodiert.
- **Laden:**
  - Der Ton lädt 2 s nach dem Weltstart still im Hintergrund.
  - Hörbar wird er erst nach der ersten Eingabe (Browser-Regel).
  - Zonenweises Lazy-Load gibt es noch nicht: Racer, Kampf, Atmo, Schritte und Bank laden einmal komplett (≈ 18 MB). Die Musik wird gestreamt.
- **Anschluss** (`src/audio/AudioHost.jsx`, liest nur, verändert keinen Spielzustand):
  - Modus: zu Fuß, Fahrt oder Flug;
  - Tempo, Gas, Drehzahl und Gang (vehicleRig);
  - Gangphase → Schritte, Untergrund Stein (Platz), Sand, nasser Lehm (am Fluss) oder Gras;
  - `M2EVENTS`: Abheben, Landen, Aufprall, Boost, Drift-Boost, Zwei-Rad, Trick, Respawn;
  - Obstgarten V/B/N, mit Treffer aus `HARVEST_STATE.last`;
  - Fluff gesammelt, Fundsache aufgehoben (UI);
  - Wasser des Probe-Geländes: der nächste Fluss, Fall und Meerpunkt positional; Biom-Teppich meadow/pond/beach nach Nähe zu Bergsee bzw. Meer.
- **Private Töne nie öffentlich:**
  - Sie kommen nur über den lokalen Vite-Server (`/@kfb-audio/`, `scripts/audio/vitePrivateAudio.mjs`).
  - Im Build (`dist`) steckt keine Tondatei.
  - Ohne den lokalen Server, also in dist und in der Vorschau, klingt das Spiel wie bisher: Motor und Saugarm über die öffentlichen Dateien, jetzt über den SFX-Bus.
  - Im Repo liegt keine Tondatei; das prüft `test/unit/audioMixer.mjs`.
- **Geändert in fremdem Code**, jeweils additiv und klein:
  - `M1World.jsx`: 3 Zeilen, AudioHost eingehängt;
  - `m1-terrain.js`: `hydro()` lesend;
  - `engineAudio.js` und `suckAudio.js`: Ausgang auf den SFX-Bus; in der vollen Fassung übernimmt der Racer den Motor;
  - `vite.config.js`: Ton-Server und `test/out` vom Beobachten ausgenommen.

### Zuordnung Ereignis → Datei
| Ereignis (Spiel) | Besitzer | Datei(en) |
|---|---|---|
| Fahrt: Motor nach Drehzahl/Last | WSA-Racer | L1_idle · L2_low · L3_mid · L4_high · L5_overrun (Gitter, Gänge 1–4 aus vehicleRig 1–5) |
| Fahrt: Schalten | WSA-Racer | O1_upshift · O4_downshift_blip · O2b/O2c backfire |
| Fahrt: Gas weg bei hoher Drehzahl | WSA-Racer | crackle-1…4 |
| Boost, Drift-Boost | WSA-Racer | O5_boost (Boden) · P04_boost_ignite_a/b (Flug) |
| Abheben (takeoff, launch, fly) | WSA-Racer | F4_takeoff |
| Flug Racer | WSA-Racer | P01_jet_thrust (Düse) · P02_turbine_fan (Lüfter) · P05_antigrav_hum (Schweben) + P03_exhaust_rumble + F3_wind_rush_loop |
| Schwebeflug zu Fuß | WSA-Racer | P05_antigrav_hum + P02 + F3_wind_rush_loop nach Tempo |
| Landung hart / weich, Flug-Landung | Bank | debris_crash_r1 K03_belly_landing / D06_dust_settle / D05_fluff_land |
| Aufprall hart / weich, Anstupsen | Bank | debris_crash_r1 K01_car_crunch / K06_cartoon_bonk |
| Zwei-Rad | Bank | debris_crash_r1 K02_wing_scrape |
| Trick (Fassrolle) | Bank | throwables_r1 T03_throw_whoosh |
| Respawn | Bank | beam_ufo_r2 B14_teleport_in |
| Schritte | WSA-Schritte | digital-grass · foley-concrete (Platz) · sand · wet-clay (am Fluss) · foley-gravel (steil) |
| Sprung / Landung zu Fuß | Bank | creatures_r1 C02_cloth_rustle / C01_clay_body_fall |
| V Faust (Treffer / leer) | WSA-Kampf | C03 brass_knuckles + C12 tree_shake / C04 swing_whoosh |
| B Schuss | WSA-Kampf + Bank | C05_blaster_primary + blaster_r1 X07_bolt_impact_clay (Einschlag nach Flugzeit) |
| N Explosion (Treffer / leer) | WSA-Kampf / Bank | C08_explosion_small + C15_wood_splinter / throwables_r1 T05_cartoon_explosion |
| K10 fire | WSA-Kampf | C05 blaster · C06 rocket_launch (je Waffe) |
| K10 cast / release | Bank | throwables_r1 T03_throw_whoosh / T11_brickfish_throw (Bombe: + T02_bomb_fuse_sizzle) |
| K10 Kontakt | WSA-Kampf / Bank | C01/C02 punch, C03 knuckles, C08/C09 bei explosive, C10 hit_confirm / X07_bolt_impact_clay |
| K10 weaponDrop | Bank | interactions_r1 I05_tool_drop |
| Saugarm charge / plop / swallow | suckAudio (wie bisher) | fluff_suction_r1 S01+S02 / S03–S05 / S06 |
| Dark Fluffer windup · spit · impact · taint | Bank | dark_fluffer_r1 DF01 · DF02 · DF03 · DF04 |
| Dark Fluffer drop (Fluff-Fall) | Bank | DF05_tainted_fluff_thud + DF06_tainted_fluff_sink |
| Dark Fluffer healed | Bank | DF09_heal_transform + DF10_eyes_pop_white (Augen-Plopp) + DF11_healed_happy_squeak |
| Dark Fluffer burst (bunter Fluff) · fade | Bank | DF12_colorful_fluff_release · DF14_patch_cleanse |
| Fluff gesammelt / Fundsache | Bank (UI-Bus) | reward_r1b R06b_fluff_collect / R01b_card_pickup |
| Atmo-Teppich | WSA-Atmo | meadow-1/2 (Tag) · wind-1/2 (Nacht) · pond-1/2 (am Bergsee) · Brandung wave-1…4 (am Meer) |
| Tierstimmen | WSA-Atmo | bird · chirp · cricket · frog (Zufall nach Tageszeit `tod=`) |
| Wasser positional | WSA-Atmo | river-long (Fluss) · waterfall (Fall) · wave-1…4 (Meer) |
| Farm an den Obstgärten | Bank (Atmo-Bus) | farm_r1 F01_farm_morning_atmos (Schleife, positional, nicht nachts) |
| Musik Fahrt/Flug · zu Fuß | Jukebox | music/suno-roadtrip-jukebox-v2 · music/cozy-tunes-classics |

### Was fehlt
**Töne (Bitte an WS0, nichts selbst synthetisiert):**
1. ~~Untergrund-Ton der Racer~~ geliefert (ws_audio_gaps_r1, Eintrag 3): Rollen/Schweben über Gras, Sand, Fels und Wasser-Gischt, je eine Schleife. Die Racer schweben, der Brief verlangt aber „Reifen je Untergrund“.
2. ~~Drift~~ geliefert: Rutschen bzw. Schleifen als Schleife, dazu Drift-Laden (`driftCharge`).
3. ~~Bremsen~~ geliefert: eine spielbare Schwebe-Bremse bzw. ein Luftzischen. `S2_brake_downshifts` ist nur Referenz. Hörbar ist bisher nur das Runterschalten.
4. ~~Schritte im Wasser~~ geliefert (S01).
5. Kampf: Combat-AV-Lücken L1–L13 (Prompts im Bericht COMBAT_AV_R1, u. a. Bogen, Armbrust, Cast, Spieler-Bonk, Kill-Pop, Gatling-Anlauf, Gegner-Ausholen) und die Liste der WSA aus `combat/WS0_GAPS.json` (12 Wünsche, u. a. Block, Raketen-Flug als Schleife, Bombenwurf, Metall, Glas, Lehm-Aufprall, Trümmer-Ausklang, Einzel-Domino, Laub, Obstfall).
6. Atmo: die Liste der WSA aus `ambience/WS0_REQUESTS.md` (Dschungel-Nacht, Küstenvögel, Donner trocken).

**Spiel-Anschlüsse (keine Töne, die Töne liegen bereit):**
- **Wetter:** Das Spiel hat keinen Wetterzustand. Regen, Gewitter und weather_time W04–W06 werden gekoppelt, sobald es einen gibt. Die Tageszeit ist angeschlossen (`tod=`).
- **Dioramen** (atmos_dioramas A01–A07): Auf dem Probe-Gelände gibt es noch keine Diorama-Orte.
- **Bewohner-Tätigkeiten** (farm, alchemy, creatures positional): Die Bewohner kommen mit WS-NPC.
- **Dark Fluffer:** Der Adapter ist fertig und getestet. Er liest die Ereignisse des Moduls über `mods.fluffer.debug().events`, sobald WS-NPC Phase C mit diesem Branch zusammenkommt; auf `terrain/probe-world` gibt es den Fluffer noch nicht.
- **K10:** Der Adapter `kfbAudio.k10(e)` ist fertig und getestet. In diesem Repo gibt es noch keine Arena-Module, die die Ereignisse senden. Hit-Stop und Zeit bleiben beim einen Besitzer (V-567); hier entsteht kein eigener.
- **Lazy-Load je Zone:** fehlt noch, siehe oben.
- **Schwebeflug zu Fuß:** Im Video ist kein Abheben zu Fuß zu sehen (Doppel-Leertaste im Testskript griff nicht). Der Wechsel Cozy → Suno beim Abheben ist im Browsertest belegt.

### Messwerte (headless Chromium mit GPU, 1280×720, lokaler Server)
**Hauptthread für den Ton** (je Takt, gemessen in `frame()`):
- Mittel 0,17–0,22 ms;
- p95 0,2–0,4 ms;
- einzelne Spitzen 2,4–5,6 ms, beim Anlegen neuer Wasser- bzw. Farm-Quellen;
- Ziel ≤ 1 ms je Bild ist eingehalten (Mittel und p95).

**Stimmen gleichzeitig:**
- Fahrt 22–34;
- zu Fuß 27–32, im Kampf bis 41;
- davon 19 Racer-Schleifen, die zu Fuß stumm laufen;
- Grenzen: Bank 24, Kampf 24, Atmo 24, Racer 16 Einzeltöne.

**Ladezeit:**
- Index 0,4–0,8 s;
- Musik hörbar ≤ 1 s nach der ersten Eingabe;
- Racer, Kampf, Atmo und Schritte 3,5–5,6 s, wenn der Cache warm ist, und bis 16 s, wenn sie parallel zum ersten Laden der Welt kommen;
- Bank (68 Clips) 0,5–1,7 s.

**Ausgangspegel** (RMS am Master): Fahrt ≈ −29 dBFS, zu Fuß ≈ −41 dBFS (Cozy leiser; Regler im Panel).

**Video:**
- 2 × 60 s;
- Ton in 99,9 % bzw. 99,7 % der Bilder messbar;
- 83 Schritte zu Fuß;
- 22 Fahrzeug-Ereignisse;
- keine Seitenfehler, keine Modulfehler.

### Prüfungen
- `test/unit/audioMixer.mjs` (in `npm test`): **PASS**. Geprüft werden Busse, Ducking, Regler, Musikliste je Modus mit Nachlauf, Zufallsfolge, Varianten, Entfernung, Stimmen-Pool, Zuordnung vollständig, alle 7 Dark-Fluffer-Ereignisse, die 5 K10-Ereignisse, Wasser-Ortung, Untergrund, Pfad-Schutz des Ton-Servers, keine Tondatei im Repo, jede Bank-Zeile findet echte Dateien.
- `test/audio.mjs` (Browser, `PW_GPU=1 npm run test:audio`): **PASS**. Geprüft werden: still vor der Eingabe, ein AudioContext, alle Module, Cozy zu Fuß, Schritte, Atmo + Wasser, Kampf, die Adapter K10 und Fluffer, Ducking, Stimmen-Grenze, Suno bei Fahrt, Gänge und Drehzahl, ≤ 1 ms.
- `npm test` (volle Reihe):
  - Auf @73d7790 brach die Reihe an `contract-static: debugOnlyKfbGlobals` ab. Ursache war `window.__RIVA` im Basis-Branch, nicht WS-Audio.
  - Nach dem Rebase auf @ba94c9d ist `contract-static` **PASS**, `audio-mixer` ist **PASS**.
  - Einzeln **PASS** (nur ein Test zur Zeit, Lead-Wunsch): deps, host, s0, s1, s5a, s5b, preview. s5a fiel einmal unter Last 40–80 durch und läuft allein grün.
  - Die volle Reihe kommt, sobald WS-NPC mit seiner Reihe fertig ist.
- Abnahme-Video: `PW_GPU=1 npm run audio:video`, Ausgabe nur lokal in `test/out/audio/`.
