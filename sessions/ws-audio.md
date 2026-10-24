# Übernahmekarte · WS-Audio („spielbare Version mit ganzem Ton“)
Stand 24.10.2026 abends · Format nach `sessions/lead.md` (V-713). Schnappschuss; das Logbuch ist `WS_AUDIO_STATUS.md` auf kayfabizarro `ws-audio/status` (neueste Einträge oben, zuletzt §19).

## 1 · Auftrag und Grenzen
- **Auftrag:** `BRIEF_WS1_AUDIO_PLAYABLE_R1.md` (V-598): ein AudioContext, ein Mixer (Busse Musik/SFX/Atmo/UI, Ducking, Entfernung), ganzer Ton im Spiel. Abnahme durch Georg: „PASS, Feinabstimmung später“ (22.10.).
- **Owner von:**
  - `src/audio/*`: Mixer, Jukebox, Tonbank, Raumklang/Verdeckung, `musicPulse()`.
  - **Chatter-Silben** (`syllables.js`, `speak()`, Schalter `#chat=syl`): Laute zur Sprechblase. Das Blasen-Timing gehört WS-NPC (Welt) bzw. dem Lead (Bühne).
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
| Arbeitsstand | Worktree `~/kfb-ws1/kfb-planet/.claude/worktrees/affectionate-nash-61b1ea`, Zweig `ws-audio/r1` (Chatter-Silben; Hash siehe Merge-Antrag/Status §19). Davor in mvp: f6776c4 (Disco-MC Talkbox) |
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
  - `PW_GPU=1 node test/audio-syl.mjs`: Chatter-Silben (Welt: Blase → speak, Wechselrede, Doppel-Schutz; Bühne: nur Silben geladen, FrizzleBob/gothgirl sprechen).
  - `test/chatter.mjs` (WS-NPC) lädt `dist` – vorher `npm run build`.
  - `PW_GPU=1 node test/audio-remote.mjs`: zwei nachgestellte CDN-Hosts und Fehlerkette. Mit `PW_ENGINE=webkit` als Safari; mit `KFB_AUDIO_REMOTE=<jsdelivr>,<raw>` gegen die echten Hosts.
  - Dazu greet, band, chatter (WS-NPC), `contract-static`, `unit/characterRegistry`.
- **Neue Musik/Effekte veröffentlichen:**
  1. `PW_GPU=1 node scripts/audio/encode-music.mjs` (AAC 128).
  2. `node scripts/audio/site-copy.mjs --publish`.
  3. Neuer Commit auf `assets/kfb-audio-r1` (`git add --sparse`).
  4. Commit in `remote.json` eintragen.
  5. `node scripts/audio/warm-cdn.mjs`.
  6. `audio-remote` gegen die echten Hosts (Chrome und WebKit).
- **Videos:** `PW_GPU=1 node scripts/audio/record.mjs <profil>` (abnahme, kampf, gruppen, heilen, mvp, neu, gruss, sprech, silben) → `test/out/audio/*.mp4`, nur lokal. Nie während der Aufnahme teleportieren (Lande-Ton `foot.land` = Klick); Figur über `opts.pre` vor dem Start hinstellen. Bühne: `opts.stage`.
- **Slot:** schwere Läufe nur `kfb-slot wait ws-audio <min> <was> && …` (nie mit `;`). Headless, Spiel nur mit Hash (`#m1,harvest,look=terrain3,world=probe`).

## 4 · Laufende Aufträge (Quelle)
- **Chatter-Silben R1** (Lead 24.10., Georg-GO): fertig hinter `#chat=syl`. Georgs Urteil zum Video A/B/C steht aus; erst danach Standard.
  - Schnittstelle: `speak({ text, characterId, group, pos, kind })` → `{ dur, start }` | null. WS-NPC ruft es für die Wechselrede (ws-npc/phase-a, noch nicht gemergt) → danach mit `#chat=syl` gegen die echte Wechselrede testen.
  - Bühne: BubbleHost-Haken + `bootSpeech()` (nur Silben, keine Musik).
- Sprech-Anlässe Band/Disco/gothgirl (ohne chat=syl): getestet, Band Tuba, Disco Talkbox (auch MC FrizzleBob, Georg 24.10.), gothgirl Oboe.
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
  - Chatter-Silben: Wird es als Stimme gelesen (Video A/B/C)? Standard machen oder weiter feilen?
  - Spieler-Rufe (Bingo! …) haben kein Instrument → stumm. Soll die Spielfigur eine Familie bekommen?
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
Georgs Urteil zu den Chatter-Silben einholen (Übergabe 25.10.). Nach dem WS-NPC-Merge die Wechselrede mit `#chat=syl` im Spiel prüfen. Danach die Register-Einträge von WS0 abwarten und die Übergangstabelle entfernen.
