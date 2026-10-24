# Übernahmekarte · WS1-Lead („R3F Modul-Host Vertrag“)
Stand 24.10.2026 · Muster für alle Sitzungen (Status §162). Diese Karte ist ein Schnappschuss; das Logbuch ist `WS1_STATUS.md` (neueste Abschnitte oben).

## 1 · Auftrag und Grenzen
- **Owner von:** MVP-Integration (Zweig `ws1/mvp-r1`), Merges aus den WS1-Teilsitzungen, M1-Wirt (vorläufig Ziel/goal und Almanac), Spielstand `kfb.save` (/1, /2 geplant), Ereignis-Host (geplant), Spiegel, Status an WS0, Abnahme-Seite für Georg.
- **Nicht Owner von:** Register und Kanon (WS0), Kartentexte und Triplets (Deck-Songs, SSOT V-698), Sprech-Anlässe und Ruf-Grammatik (WS-NPC), Ton (WS-Audio), HUD-Bau (WS1e), Fahrzeuge (WS1d), Wasser (WS1c), Biom-Fahrt und Konzept Prozedurale Welt (WS1b), Blender (WSB), Site-Betrieb (WSA).
- Koordiniert: WS1b–e, WS-NPC, WS-Audio, Deck-Songs, Deck-Analyzer (Cross-Session-Nachrichten; Fragen an Georg nur über den Lead).

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-mvp` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws1/mvp-r1` @dd7de55 |
| Spiegel privat | `~/kfb-ws1/stunt-race` → `game/mvp-r1` @6a594f8 (Schnappschuss per commit-tree; Autor aus `git -C ~/kfb-ws1/kfb-planet config user.name/email`) |
| Spiegel öffentlich | kayfabizarro `ws1/mvp-r1` @bad9a17db, Präfix `ws1/kfb-planet/`, vor dem Push `src/private/` = 0 prüfen |
| Status | kayfabizarro `ws1/status`: `WS1_STATUS.md` (Plumbing: Abschnitt vor dem letzten `## N ·` einfügen, Kopfzeilen „neueste Notiz §N“ und „(§N ist der neueste …)“ mitziehen) |
| WS0 an WS1 | kayfabizarro `docs/kfb-decisions-register-2026-10-11`: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WS0_TO_WS1.md` (neu oben) |
| Abnahme-Seite | https://claude.ai/artifact/HVwr3YSWy1MFfSEyLCrFi6 (nur Live-Stand, A/B startet auf NEU) |

## 3 · Bauen und prüfen
- `npm run build` **vor** der Testreihe (die Tests laden `dist`), Browser-Tests mit `PW_GPU=1`.
- Test-Slot: `~/kfb-ws1/bin/kfb-slot take|wait|drop <name> <min> <was>` (GPU geteilt).
- Ganze Reihe: `package.json` → `scripts.test` plus floatingProps, ssotStage, combat, audio, audio-remote, greet, band, chatter, `vehicles-r1 data|start`. Letzter Lauf: 74 PASS.
- **Bekannte Altfehler:** `test/c2.mjs` (pupilZeroWhenClosed), `test/c3g.mjs` (glowsAtNight/noGlowByDay).
- `contract-static`: Eine Datei mit `object3d` + `dispose(` zählt als Modul; mount/dispose deshalb in Modulen halten.

## 4 · Laufende Aufträge
- WS1e HUD 3D Paket 2: Kassette (r2-Gehäuse, Tasten V-707/r5, controlTheme), Truhe größer, Kassette kleiner, Gesamt-Fluff vor den Kugeln mit Squash (Quelle `orchard.total()`/`fluffTotal`). Merge auf Zuruf.
- WS1b Prozedurale Welt R1.4 (V-708-Matrix, Kölner Tasche, V-711-Höhenfeld) → Übergabe an WS0 bis Do 29.10.
- WS-NPC: Ruf-Skala umstellen (tratschSim, poolReader auf V-699).
- Deck-Analyzer: Pilot 3 Decks mit Token-Messung → cards.json aus `data/kfb-deck-analyzer-r1`; danach an WS0.
- Übergabe MVP + Konzept an WS0 (Status §162 §4).

## 5 · Offen bei Georg / WS0
- Georg: tr1-Bühnendialog (`lines=tr1`) als Standard? Urteil HUD 3D Spike; Disco-MC-Instrument; neue Satz-Opener (Song-Chat).
- WS0: Ruf-Skala ins Register; Format der Übernahmekarten; locusId/vehicleId; Deck-Zuordnung; Owner der Gutter-Fahrt.

## 6 · Sonderregeln (Verweise)
- Neue Looks nur hinter einem Schalter, bis Georg sie gesehen hat. Abnahmen nur aus dem Live-Stand.
- Kein Merge nach `main` ohne Georg. Georgs Browser-Tab nicht ohne Frage neu laden. Spiel nie ohne Hash öffnen.
- Gekaufte bzw. private Modelle nie in kayfabizarro oder öffentliche Vorschauen. Songs und Effekte dürfen öffentlich sein.
- Kartentexte nur in der freigegebenen Fassung (V-698–700); PDF führt (Druck schlägt JSON).
- Passwörter und Tokens setzt Georg selbst; nie ins Repo.

## 7 · Nächster sinnvoller Schritt
WS1e-Paket 2 abwarten und mergen; Übernahmekarten der übrigen Sitzungen nach WS0-Entscheid; MVP-Übergabe-Abschnitt mit Schalter-Liste schreiben.
