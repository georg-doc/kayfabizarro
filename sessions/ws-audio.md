# Übernahmekarte · WS-Audio („spielbare Version mit ganzem Ton“)
Stand 24.10.2026 · Format nach `sessions/lead.md` (V-713). Schnappschuss; das Logbuch ist `WS_AUDIO_STATUS.md` auf kayfabizarro `ws-audio/status` (neueste Einträge oben, zuletzt §17).

## 1 · Auftrag und Grenzen
- **Auftrag:** `BRIEF_WS1_AUDIO_PLAYABLE_R1.md` (V-598): ein AudioContext, ein Mixer (Busse Musik/SFX/Atmo/UI, Ducking, Entfernung), ganzer Ton im Spiel. Abnahme durch Georg: „PASS, Feinabstimmung später“ (22.10.).
- **Owner von:**
  - `src/audio/*`: Mixer, Jukebox, Tonbank, Raumklang/Verdeckung, `musicPulse()`.
  - Zuordnung Spiel-Ereignis → Ton (`cueMap.js`), Begrüßungs- und Chatter-Laute.
  - Ton-Skripte `scripts/audio/*`: Index, Lautheit, Kodierung, Ablage, Vorwärmen, Videos.
  - Ton-Ablage auf GitHub (kayfabizarro `assets/kfb-audio-r1`).
- **Nicht Owner von:**
  - Register und Instrument-Zuordnung je Figur (WS0, CHARACTERS_R1).
  - Sprech-Anlässe und Ereignisse (WS-NPC: greet, chatter, groups, fluffer).
  - Kampf-Ereignisse (Kampf R1 / K10).
  - HUD-Kassette (WS1e, nutzt nur `musicPause/musicSkip/setVolume/nowPlaying`).
  - Neue Klänge erzeugen (WS0, ElevenLabs, Suno).
  - Site-Build (Lead, `build-site.mjs`).
- **Grenzen:**
  - Fehlt ein Ton: Liste an WS0, nie selbst synthetisieren.
  - Hit-Stop/Zeit gehört einem Owner (V-567).
  - Hauptthread ≤ 1 ms/Bild für Ton (gemessen 0,1–0,3 ms).
  - Ton erst nach der ersten Eingabe.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | Worktree `~/kfb-ws1/kfb-planet/.claude/worktrees/affectionate-nash-61b1ea`, Zweig `ws-audio/r1` @3076ca1 (in mvp gemergt als f5e80d3) |
| Ton-Ablage (öffentlich) | kayfabizarro Zweig `assets/kfb-audio-r1` @36c5ae419, Pfad `media/kfb-audio/r1/` (569 Dateien, 108 MB). Gepinnt in `scripts/audio/remote.json`. Laden: jsDelivr `gh@commit`, Rückfall raw. |
| Status | kayfabizarro `ws-audio/status`: `WS_AUDIO_STATUS.md` (neuer Abschnitt oben vor dem letzten `## N ·`) |
| Quellen privat | `~/kfb-ws1/private-assets` (assets/private von KFB-Stunt-Car-Race): `40_AUDIO/elevenlabs_r1/<satz>` + `<satz>_lufs/lufs_report.json`, `40_AUDIO/music_catalog_r1.json`, `40_AUDIO/chatterbox_r1/` (Suno-Ernte), `music/` (Originale). Nachziehen über den Lead (eigener fetch bricht ab). |
| Zwischenspeicher | `~/kfb-ws1/.kfb-audio-cache` (Index, WSA, Audio Site, `music-aac128/`), Ablage lokal `~/kfb-ws1/.kfb-audio-publish/r1` |
| WS0 an WS-Audio | Register-Branch `…/30_DECISIONS/replies/WS0_TO_WS1.md` (neu oben) |

## 3 · Bauen und prüfen
- **Index:** `node scripts/audio/prepare.mjs` nach jeder Lieferung (liest Sätze, `_lufs`-Berichte, Katalog). Lokal liefert Vite `/@kfb-audio/` (Plugin `vitePrivateAudio.mjs`).
- **Tests:**
  - `node test/unit/audioMixer.mjs` (in npm test).
  - `PW_GPU=1 node test/audio.mjs`: Browser, alle Wege, Ereignisse nachgestellt.
  - `PW_GPU=1 node test/audio-remote.mjs`: zwei nachgestellte CDN-Hosts und Fehlerkette. Mit `PW_ENGINE=webkit` als Safari; mit `KFB_AUDIO_REMOTE=<jsdelivr>,<raw>` gegen die echten Hosts.
  - Dazu greet, band, chatter (WS-NPC), `contract-static`, `unit/characterRegistry`.
- **Neue Musik/Effekte veröffentlichen:**
  1. `PW_GPU=1 node scripts/audio/encode-music.mjs` (AAC 128).
  2. `node scripts/audio/site-copy.mjs --publish`.
  3. Neuer Commit auf `assets/kfb-audio-r1` (`git add --sparse`).
  4. Commit in `remote.json` eintragen.
  5. `node scripts/audio/warm-cdn.mjs`.
  6. `audio-remote` gegen die echten Hosts (Chrome und WebKit).
- **Videos:** `PW_GPU=1 node scripts/audio/record.mjs <profil>` (abnahme, kampf, gruppen, heilen, mvp, neu, gruss) → `test/out/audio/*.mp4`, nur lokal.
- **Slot:** schwere Läufe nur `kfb-slot wait ws-audio <min> <was> && …` (nie mit `;`). Headless, Spiel nur mit Hash (`#m1,harvest,look=terrain3,world=probe`).

## 4 · Laufende Aufträge (Quelle)
- **Ton an den echten Sprech-Anlässen testen**, sobald WS-NPC (ws-npc/phase-a) in mvp ist. Quelle: Lead 24.10.
  - Erwartet: Band Tuba, Disco Talkbox, MC Posaune, gothgirl Oboe.
  - Lesen ist fertig: `mods.band/disco.events()`, type `chatter`.
- **Übergangstabelle `decidedChatter`** (`cueMap.js`, Georgs Wahl q178, V-693) entfernen, sobald WS0 die Instrumente ins Register einträgt (§155).
- **`musicPulse` auf Katalog-Tempo umstellen**, sobald WS0 die 38 Jukebox-Titel in `music_catalog_r1.json` aufnimmt (§155, Status 11/14). Bis dahin schätzt der Puls das Tempo aus den Kicks.
- **Kazoo und gestopfte Trompete:** Clips einbinden, sobald WS0 sie nach Georgs Go liefert (q177). Bis dahin klingen Skelette und Soldaten nur mit den bisherigen Gruppen-Tönen. Ebenso der Klapper-Transient für Skelette.
- **Später, nur auf Zuruf:**
  - `musicQueue()` für das HUD-Flyout (WS1e Paket 4).
  - Sprachmelodie aus der Suno-Ernte (`harvestPhrases`; Register-Felder `chatter.motif/grains`, WS0).
  - Georgs neuer Song mit Elektro-Stems (Hinweis Lead).
  - V-715 Mindspace (binaurale Töne, Schumann-Thema, eigener Mixer): nur Backlog.

## 5 · Offen bei Georg / WS0
- **Georg:**
  - Disco-MC FrizzleBob: Register-Posaune behalten oder Talkbox wie die Tänzer?
  - Go an WS0 für Kazoo/Trompete (q177).
  - Feinabstimmung nach Gehör (Audio Site).
- **WS0:**
  - V-693 ins Register (inkl. feste IDs für Band und Disco).
  - Jukebox-Titel im Katalog.
  - demon_lord ohne Instrument (nur style).
  - Lücke: Dark Fluffer bzw. übrige Fluffer-Sorten ohne Register-Instrument.

## 6 · Sonderregeln (Verweise)
- **Öffentlich erlaubt:** Musik und Effekte dürfen öffentlich in kayfabizarro (Georg 23.10., im WS-Audio-Chat bestätigt: „ja, beides“). Gekaufte bzw. private Modelle nie.
- **Instrumente nur aus dem Register:** Reihenfolge Register (mit Instrument) → Georgs Wahl V-693 → Bewohner-Stimme → Platzhalter. Werte mit Status todo, PREFILL oder DESIGN gelten als leer (V-682 §6). Nie selbst ein Instrument vergeben (Lead/WS0 bestätigt).
- **Keine Lizenz- oder Herkunftsprüfungen** (Georg 21.10.); Creator-Credits bleiben. Racer-GLBs sind CC0.
- **Musik nie dekodieren:** immer `<audio>` → MediaElementSource mit `crossOrigin='anonymous'`, nie `decodeAudioData` (Recherche MUSIK_AUSLIEFERUNG_R1).
- **Commit-Hashes** in Meldungen nur aus echter git-Ausgabe. Merge nach mvp über den Lead, nach main nur mit Georg.

## 7 · Nächster sinnvoller Schritt
Nach dem WS-NPC-Merge den Ton an den echten Anlässen testen. Dabei kurzes Video mit Band, Disco und gothgirl für Georg, sofern er das will. Danach die Register-Einträge von WS0 abwarten und die Übergangstabelle entfernen.
