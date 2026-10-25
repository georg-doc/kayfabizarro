# Übernahmekarte · WS-NPC („Bewohner-Leben, Begegnung, Dark Fluffer“)

Stand 25.10.2026 · Format nach `sessions/lead.md` (V-713).

Diese Karte ist ein Schnappschuss. Das Logbuch ist `WS_NPC_STATUS.md` auf kayfabizarro `ws-npc/status` (neueste Abschnitte oben, zuletzt §13 @731cd14); neuere Stände stehen im Lead-Status `WS1_STATUS.md`.

## 1 · Auftrag und Grenzen

**Owner von:**
- **Bewohner:** `src/npc/residentLife.js`, `residentSim.js`, `npcDay.js`.
- **Gedächtnis und Gerücht D2:** `npcMemory.js` auf `kfb.world-save/1`.
- **Begrüßung G-2:** greet-Ereignisse.
- **Gruppen:** `groupLife.js`, `groupPatrol.js` (Skelett-Patrouille, Spielzeugtrupp mit N15-KO, Bot-Arbeitstrupp).
- **Ork-Band:** `bandLife.js`, `bandClock.js`.
- **Geschenk-Enthüllung E3:** `giftReveal.js`, `revealTrack.js`.
- **Dark Fluffer K15:** `darkFluffer.js`, `flufferSim.js`, `flufferSet.js`, `flufferKinds.js`.
- **Sprech-Anlässe:** `chatterCues.js`; Ereignisse in Band, Disco und gothgirl.
- **S3 Begegnungen als Module (Regie R0)** hinter `#scenes` bzw. `#scenes=entwurf` (Lead 25.10., WS0 V-740/V-746; Hauptträger Raster: WS1b): `src/npc/sceneGrid.js` (Platzhalter-Raster), `sceneTypes.js` (Typen, `kfb.scene/1`, Freigabe), `sceneDirector.js` (Regie R0), `sceneHost.js` (Wirt), `residentScene.js` (Bewohner-Begegnung).
- **Wechselrede hinter `#chat=syl`** (Lead 24.10., Georg-GO; Owner des Blasen-Timings): `src/npc/talkDirector.js` (Anlass → Beats → Blase + Laut), `src/bubbleAvoid.js` (Blasen meiden HUD und Figuren). Laute: WS-Audio `speak()`.
- **Karten-Tratsch:** Konzept `docs/ws-npc/KARTEN_TRATSCH_KONZEPT_R1.md`; Stufe 0 headless in `src/npc/tratschSim.js` und `scripts/tratsch/`.
- **Ruf-Grammatik:** Bingo! · Boggle...? · Bongo. · Blödsinn! · Humbug?! (Georg 24.10.). Dazu die Spieler-Zurufe in `poolReader.js` und `choiceLayer.js`.
- **Kit-Knete V-662:** `src/look/clayKit.js`, `kitSkip` in M1World (hinter `#kitclay=1|2`).
- **Register-Anschluss der NPC-Module:** `characterId` über `src/characters/registry.js`.

**Nicht Owner von:**
- Disco-Modul (`discoLife.js`, Lead; darin nur Sprech-Anlässe von WS-NPC).
- Partner- und Bühnenfigur gothgirl (Lead).
- Register und Kanon (WS0).
- Kartentexte, Triplets, Opener-Pool (Deck-Songs, SSOT V-698).
- Ton (WS-Audio).
- Spielstand-Schema `kfb.world-save` (Lead).
- Knet-Kern `kfb-clay` (WS0, Vendor byte-gleich).
- Blender-Assets (WSB).

## 2 · Repo, Zweig, Stand

| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-npc` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws-npc/phase-a`; alles bis @55e2a11 in mvp gemergt (e88689c) |
| Private Assets | `src/private` → `~/kfb-ws1/private-assets` (gitignored, Klon von KFB-Stunt-Car-Race `assets/private`) |
| Status | kayfabizarro `ws-npc/status`: `WS_NPC_STATUS.md` (Plumbing-Commit, kein Arbeitsbaum) |
| Abnahme-Belege | KFB-Stunt-Car-Race `proofs/ws-npc-r1` (privat, eigener Stamm) |
| Tratsch-Daten | `src/data/npc/tratsch/tratsch-data.r1.json` aus kayfabizarro `ws-song/workshop-r1` @a428e091 (tr1, Sperrliste, SSOT-Checks, Opener-Pool, Signatur-Liste) |
| Tratsch-Leseseite | `docs/ws-npc/tratsch/README.md` + Protokolle (Lauf 2; Artefakt „KFB Tratsch-Protokoll“ v3 beim Lead) |
| Video Wechselrede | `scripts/npc/record-talk.mjs` → `test/out/npc/talkrec/kfb-npc-wechselrede.mp4` (privat; CDP-Screencast mit DOM + Mixer-Ton; Figur vor Aufnahmebeginn absetzen, sonst Lande-Ton) |
| Abnahme 25.10. | `scripts/npc/abnahme25.mjs` → `test/out/npc/abnahme-25/` (tr1 drei Figuren, Kit-Knete-Karte); Lead legt sie auf `abnahme/ws1` |
| S3 Bild-Paket 0b | `scripts/npc/s3-0b.mjs` → `test/out/npc/s3-0b/` (Bewohner, Band, Disco je Zufahrt und Spiel-Ring, Platzbedarf im index.json); Hilfen `scripts/npc/_shot.mjs` |
| Kit-Knete-Abnahme | `~/kfb-ws1/research/audits/abnahme/kitclay2/` (Stufen 0/1/2, index.json) |

## 3 · Bauen und prüfen

- **Build:** `npx vite build`. Die Tests laden `dist`. **Nie bauen, während eigene Browser-Tests laufen.** Browser-Tests mit `PW_GPU=1`.
- **Test-Slot:** `~/kfb-ws1/bin/kfb-slot wait|take|drop WS-NPC <min> <was>`. Pflicht für volle Reihen, fps und Aufnahmen. Einzeltests < 3 min ohne Slot.
- **NPC-Tests:**
  - `npm run test:npc` (Unit und Browser)
  - Unit einzeln: `node test/unit/<name>.mjs`, u. a. tratschSim, chatterCues, talkDirector, clayKit, flufferKinds, characterRegistry
  - Wechselrede im Spiel: `PW_GPU=1 node test/talk.mjs` (≈ 80 s, ohne Slot)
  - Szenen: `node test/unit/sceneDirector.mjs`, im Spiel `PW_GPU=1 node test/scenes.mjs` (≈ 3 min)
- **Volle Reihe:** `bash test/npc-suite.sh > test/out/npc/suite_result.txt`.
  - Die Liste steht in `test/npc-suite.txt` (80 Tests: `npm test` plus die NPC-, S5- und D1-Browser-Tests).
  - Je Test eine Zeile `Exit Dauer Datei Ergebnis`; rot zeigt `grep -v "^0 " test/out/npc/suite_result.txt`.
  - Letzter Lauf: 73/75.
- **Tratsch Stufe 0:**
  - `python3 scripts/tratsch/sync-tratsch-data.py [<commit>]`
  - `node scripts/tratsch/stage0.mjs 7 10` → `docs/ws-npc/tratsch/`
- **Bekannte Altfehler:** `test/c2.mjs` (pupilZeroWhenClosed), `test/c3g.mjs` (glowsAtNight/noGlowByDay; auch auf reinem mvp rot).
- **Falle Kamera (Bilder):** Die Folgekamera ignoriert dollyTo/setLookAt; Nahbild per `camera.setViewOffset`, Sichtbarkeit per Pixelmaske (`_shot.mjs visibleShare`), Kamera seitlich versetzen, damit die Spielfigur den Sprecher nicht verdeckt. Die Probe-Welt ist hügelig (Neigung meist 0,27–1,2).
- **Falle Bühne:** Teleports in Tests nie auf die Bühne (0, 0); dort startet der Bühnen-Dialog, friert die Figur ein und sperrt die Wechselrede (`busy`).
- **Falle:** Ein `//`-Kommentar mitten in einer langen Code-Zeile hat mehrfach Code abgeschaltet. Kommentare in eine eigene Zeile setzen; neue Zeilen vor dem Commit prüfen.

## 4 · Laufende Aufträge (mit Quelle)

- **S3 Begegnungen (Regie R0):** gemergt (bis e88689c), hinter `#scenes=entwurf`; Freigabe aller Typen „entwurf“.
  - Typen: bewohner, band, disco (MC + 7 Tänzer), patrouille, fluffer (Platz = Baum). MiB-Turm und UFO erst nach V-744.
  - Raster ist ein Platzhalter mit der Schnittstelle `spotOf`/`spotsAround`/`cellOf`; M1-Maße verkleinert (Zelle 48 m, Takt 60–140 m, voraus 25–60 m, Abbau 45 m, Neigung bis 0,6).
  - **Pause** (Lead 25.10.): keine weiteren S3-Typen, bis WS1bs Raster mit Auftrags-Hügeln (V-716) kommt oder Georg entscheidet. Dann auf WS1bs Raster umstellen; erst danach Bilder zu Georg (heute stehen Szenen oft am Hang, die Band findet keinen Platz).
  - Karte je Szene aus dem Signatur-Deck; FrizzleBob und Fluffer `null` bis WS0 (Status §175).
- **Wechselrede `#chat=syl`** (Lead 24.10., Georg-GO): gemergt; Standard bleibt bis Georgs Urteil (Lead fragt Georg, V-746: Silben werden nicht weiter getunt). tr1-Satzbau korrigiert (Satz-Opener nur vor Titel oder Funktionswort, own_clause mit Punkt). Blasen meiden HUD und Figuren per Kandidatensuche. Tratsch ist noch kein Anlass im Spiel (Stufe 1 fehlt). Video: `scripts/npc/record-talk.mjs` (braucht ws-audio/r1: speak, captureStream; WS-Audio übernimmt den Weg als scripts/audio/record-dom.mjs).
- **Tratsch-Lauf 3 mit den Trio-Sets:**
  - Quelle: Lead 24.10., Deck-Songs TR1_INDEX @b2a38438, 14 Decks bzw. 697 Zeilen.
  - Ablauf: sync, Lauf, README. Erst wenn der Lead das Startzeichen gibt.
- **Stufe 1 Tratsch** (Daten im Spiel, Spielstand `/2`): nicht starten, bis Lead und Georg den Fahrplan haben (Lead 24.10.). Bedarf `/2` steht im Konzept §8.
- **Opener:**
  - „You with the card in your hand“ ist gesperrt (Georg).
  - 8 weitere werden gemieden, bis WS0 entscheidet (§31).
  - Satz-Opener und Erwiderungen warten auf Georgs Freigabe (Deck-Songs).
- **Nach dem MVP**, laut Konzept Prozedurale Welt R1.2 (WS1b, Georg-Abnahme 24.10.):
  - Szenen als Fahrplan-Funktionen.
  - Gedächtnis je characterId auch für Nicht-Bewohner, offen für `locusId` (Genius loci).
  - Ruf-Grammatik für Autos und Objekte.
  - V-697 (Spekulation über Fundstücke) als Anlass in Stufe 2.

## 5 · Offen bei Georg / WS0 / Lead

**Georg:**
- Kit-Knete: Stufe 0, 1 oder 2? (Abnahme kitclay2, K3 nah 1,46 knapp unter 1,5)
- Wechselrede `#chat=syl` (Video A/B/C): Standard machen? Dazu:
  - Begrüßung „first“ zeigt mit chat=syl eine Ruf-Blase (**Boggle...?**); bisher galt noBubble für first (G-2).
  - Kartenzeilen in der Wechselrede: ohne tr1 „Have you heard of **Titel**?“ und die bereinigte Lore. tr1-Entwürfe nur mit `lines=tr1`. tr1 hier freigeben?
  - Disco-MC: ruhig bis zum ersten Ruf, danach tanzt er (statt Hochspringen ohne Kontext).
- Doppelbesetzung G2/G3/G5 (Konzept Prozedurale Welt).

**WS0:**
- Signatur-Deck für FrizzleBob (Disco-MC, Spielfigur) und für die Dark Fluffer: (a) gemeinsam, (b) je Sorte, (c) keine Karte (Status §175).
- Signatur-Liste ins Register. Kayfabrick-Bots ohne Deck; `the_uruk_rumble` hat 0 Karten.
- Band- und Disco-IDs fest machen (§155).
- `farmer_b` gegen `farmer_harke` (Identität).
- `q_ghost_healed`: Variante oder eye-goo-Schalter?
- Gimmick- bzw. Rollen-Feld im Register.
- Kursiv im Blasen-Kern.

**Lead:** Schema `kfb.world-save/2` (Kartenwissen mit Kette, gelöscht, gehört; S3-Protokoll je Szene liegt bereit, `sceneHost.log()`). Antwort von Georg: Wechselrede als Standard (V-746).

**WS1b:** Raster für S3 (Auftrags-Hügel, Reserve-Ring) und Einbindung; Antwort auf die Aufteilung steht aus.

## 6 · Sonderregeln (Verweise)

- **Assets und Darstellung:**
  - Kit-Clips as-is.
  - Keine eigenen Licht-, Schatten- oder Material-Lösungen; Kanon-Werkzeuge nutzen.
  - Neue Looks nur hinter Schalter.
- **Private Kauf-Assets** nie nach kayfabizarro oder in öffentliche Vorschauen. Abnahmebilder privat (`proofs/ws-npc-r1`, research/audits).
- **Bilder:** Abnahmen und Bilder headless mit `look=terrain3`, kein sichtbarer Browser.
- **Sprechblasen:**
  - Nur ausgegebene Zeilen (S5b).
  - Triplets nur in abgenommener Fassung; Entwürfe nur hinter Vorschalter.
  - Gesperrte Karten nie (SSOT S12).
  - Kein erzeugter Text.
  - Satzbild V-699.
- **Ablauf:**
  - Vor jedem Commit `ListAgents`.
  - In zsh beim Push `${C}:refs/…` schreiben, nie `$C:refs`; vorher prüfen, dass `C` gesetzt ist. Ein leerer Quell-Ref löscht den Zielzweig.
  - Kein Merge nach main bzw. auf Lead-Zweige; der Lead merged.
  - Pushes nur mit Georgs Bestätigung.
  - Fragen an Georg über den Lead.
- **Zahlen und Texte:** keine erfundenen Zahlen oder Texte. Platzhalter als solche markieren, z. B. Band-Lied 16 Takte, MiB-N = 2 im Vergleichslauf.

## 7 · Nächster sinnvoller Schritt

S3: auf WS1bs Raster umstellen, sobald es da ist (gleiche Schnittstelle wie `sceneGrid`), dann Bilder der Szenen im Spiel für Georg. Daneben Georgs Urteil zu `#chat=syl` abwarten. Sonst auf das Startzeichen des Leads warten: Tratsch-Lauf 3 mit den Trio-Decks oder den Fahrplan für Stufe 1.

Der Lauf 3 geht so:
1. `sync-tratsch-data.py <commit>` mit dem Trio-Stand ab @b2a38438.
2. `stage0.mjs` laufen lassen.
3. README mit T1–T15 neu schreiben.

Die Protokolle im Repo stammen noch aus Lauf 2. Der Code ist inzwischen weiter (Bongo. als weiches Nein, Opener-Sperren).
