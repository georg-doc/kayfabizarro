# Übernahmekarte · WS-NPC („Bewohner-Leben, Begegnung, Dark Fluffer“)

Stand 24.10.2026 · Format nach `sessions/lead.md` (V-713).

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
| Arbeitsstand | `~/kfb-ws1/kfb-planet-npc` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws-npc/phase-a` @a9bb3d1, in mvp gemergt (9db8cfe) |
| Private Assets | `src/private` → `~/kfb-ws1/private-assets` (gitignored, Klon von KFB-Stunt-Car-Race `assets/private`) |
| Status | kayfabizarro `ws-npc/status`: `WS_NPC_STATUS.md` (Plumbing-Commit, kein Arbeitsbaum) |
| Abnahme-Belege | KFB-Stunt-Car-Race `proofs/ws-npc-r1` (privat, eigener Stamm) |
| Tratsch-Daten | `src/data/npc/tratsch/tratsch-data.r1.json` aus kayfabizarro `ws-song/workshop-r1` @a428e091 (tr1, Sperrliste, SSOT-Checks, Opener-Pool, Signatur-Liste) |
| Tratsch-Leseseite | `docs/ws-npc/tratsch/README.md` + Protokolle (Lauf 2; Artefakt „KFB Tratsch-Protokoll“ v3 beim Lead) |
| Kit-Knete-Abnahme | `~/kfb-ws1/research/audits/abnahme/kitclay2/` (Stufen 0/1/2, index.json) |

## 3 · Bauen und prüfen

- **Build:** `npx vite build`. Die Tests laden `dist`. **Nie bauen, während eigene Browser-Tests laufen.** Browser-Tests mit `PW_GPU=1`.
- **Test-Slot:** `~/kfb-ws1/bin/kfb-slot wait|take|drop WS-NPC <min> <was>`. Pflicht für volle Reihen, fps und Aufnahmen. Einzeltests < 3 min ohne Slot.
- **NPC-Tests:**
  - `npm run test:npc` (Unit und Browser)
  - Unit einzeln: `node test/unit/<name>.mjs`, u. a. tratschSim, chatterCues, clayKit, flufferKinds, characterRegistry
- **Volle Reihe:** `bash test/npc-suite.sh > test/out/npc/suite_result.txt`.
  - Die Liste steht in `test/npc-suite.txt` (75 Tests: `npm test` plus die NPC-, S5- und D1-Browser-Tests).
  - Je Test eine Zeile `Exit Dauer Datei Ergebnis`; rot zeigt `grep -v "^0 " test/out/npc/suite_result.txt`.
  - Letzter Lauf: 73/75.
- **Tratsch Stufe 0:**
  - `python3 scripts/tratsch/sync-tratsch-data.py [<commit>]`
  - `node scripts/tratsch/stage0.mjs 7 10` → `docs/ws-npc/tratsch/`
- **Bekannte Altfehler:** `test/c2.mjs` (pupilZeroWhenClosed), `test/c3g.mjs` (glowsAtNight/noGlowByDay; auch auf reinem mvp rot).
- **Falle:** Ein `//`-Kommentar mitten in einer langen Code-Zeile hat mehrfach Code abgeschaltet. Kommentare in eine eigene Zeile setzen; neue Zeilen vor dem Commit prüfen.

## 4 · Laufende Aufträge (mit Quelle)

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
- Disco-MC-Instrument: Posaune oder Talkbox?
- Doppelbesetzung G2/G3/G5 (Konzept Prozedurale Welt).

**WS0:**
- Signatur-Liste ins Register. Kayfabrick-Bots ohne Deck; `the_uruk_rumble` hat 0 Karten.
- Band- und Disco-IDs fest machen (§155).
- `farmer_b` gegen `farmer_harke` (Identität).
- `q_ghost_healed`: Variante oder eye-goo-Schalter?
- Gimmick- bzw. Rollen-Feld im Register.
- Kursiv im Blasen-Kern.

**Lead:** Schema `kfb.world-save/2` (Kartenwissen mit Kette, gelöscht, gehört).

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

Auf das Startzeichen des Leads warten: Tratsch-Lauf 3 mit den Trio-Decks oder den Fahrplan für Stufe 1.

Der Lauf 3 geht so:
1. `sync-tratsch-data.py <commit>` mit dem Trio-Stand ab @b2a38438.
2. `stage0.mjs` laufen lassen.
3. README mit T1–T15 neu schreiben.

Die Protokolle im Repo stammen noch aus Lauf 2. Der Code ist inzwischen weiter (Bongo. als weiches Nein, Opener-Sperren).
