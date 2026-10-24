# Übernahmekarte · WS1e („Diegetisches Knet-HUD einbauen“, HUD-Bau)
Stand 24.10.2026 · Format wie `sessions/lead.md` (Status §162, V-713). Schnappschuss; das Logbuch sind die Commit-Texte auf `ws1/hud-clay-r1` und die Merge-Notizen des Leads in `WS1_STATUS.md`.

## 1 · Auftrag und Grenzen
- **Owner von:** HUD-Bau im Spiel: die eine HUD-Hülle (`src/hud/hudShell.js`), die Bausteinlisten Knet-HUD R1 (`src/hud/clayHud.js`, `hud=clay`, Standard seit Georgs Abnahme 22.10.) und HUD 3D R1 (`src/hud/hud3d.js`, `hud=3d`, nur Schalter), der HUD-Wirt `src/HudClay.jsx` (Trefferflächen, Zahnrad-Tafel, Almanac-Fächer, Blase, Kassetten-Knöpfe), der Overlay-Pass `src/hud/hudPass.js`, `DEVUI` als Live-Schalter (`src/debug.js`, V-655), HUD-Tests (`test/hud-clay.mjs`, `test/hud-3d.mjs`, `test/hud-3d-perf.mjs`, `test/hud-3d-shots.mjs`).
- **Nicht Owner von:** HUD-Design (Claude Design, V-694; Georg-Aufträge über den Lead), Inventar/Rucksack (HudR5f-api läuft im HUD unsichtbar mit), Fluff-Zähler und Gesamt-Fluff (`kfb.save`, `orchard.total()`), Ziel/goal und Almanac-Inhalt (M1-Wirt, Lead), Jukebox/Ton (WS-Audio; HUD ruft nur `musicPause/musicSkip/setVolume`), Waffen und Aktionen (Kampf/M1-Wirt; HUD löst die Spieltasten V/B/N/I über hostKeys aus), Modelle (WSB), Ruf-Skala (WS-NPC/V-699).
- Fragen an Georg nur über den Lead.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-hud` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws1/hud-clay-r1`; zuletzt gemergt: mvp `2e299e1` (= hud @60b8619) |
| node_modules / privat | Symlinks auf `~/kfb-ws1/kfb-planet-mvp/node_modules` und `~/kfb-ws1/private-assets` (`src/private`, gitignored) |
| Abgeleitete private Datei | `src/private-gen/hud/cassette_a.hud.glb` (~40 kB, gitignored) aus `node scripts/hud/shrink-cassette.mjs`. **In jedem neuen Worktree einmal ausführen**, sonst zeigt `hud=3d` die alte Poly-Kassette. Ziel: WSB legt die HUD-Fassung in `assets/private`, dann Pfad in `hud3d.js` (GEN-Glob) umstellen. |
| Board-Paket HUD 3D R1 | `~/kfb-ws1/hud/KFB HUD 3D R1 Board/KFB_HUD_3D_R1_SESSION_2026-10-24/` (README, docs/EINBAU_WS1.md, SPEC_WERTE.md, OFFENE_PUNKTE.md) |
| Private Quellen | N29 (Knet-Props), N32 r2 (Aktionen, Faust = `KFB_HUD_Fist.r2`, Georg 24.10.), N34 (`cassette_a.glb`), N33 (`kfb_hud_readability.r1.json`, `controlTheme` fehlt noch) |

## 3 · Bauen und prüfen
- `npx vite build` vor jedem Browser-Test (Tests laden `dist`), `PW_GPU=1`.
- Einzeln: `node test/contract-static.mjs`, `PW_GPU=1 node test/hud-clay.mjs` (28 Prüfungen), `PW_GPU=1 node test/hud-3d.mjs` (≈ 35 Prüfungen inkl. Telefon quer und 16:10).
- Slot: `~/kfb-ws1/bin/kfb-slot wait WS1e <min> <was>` … `drop WS1e` für hud-3d, Messung, Bilder, volle Reihe. Während eine Reihe läuft: weder `dist` neu bauen noch Testdateien ändern.
- Messung: `node test/hud-3d-perf.mjs` (wood/clay/3d im Wechsel, Desktop + Telefon-Emulator → `test/out/hud-3d/perf.json`). Letzter Stand: HUD 3D Ø 0,08 ms / p95 0,2 ms, +14 Draw Calls, 1 Kontext, 0 Long Tasks.
- Bilder: `node test/hud-3d-shots.mjs` → `test/out/hud-3d/abnahme/` (Live-Stand, look=terrain3, debug,clean; A/B `cas=old`, Nacht `tod=night`).
- Bekannte Altfehler der Reihe: `drift` (braucht `drift-report.json` aus einem früheren Lauf), `c2`, `c3g`; `orbit` gelegentlich ein Ausreißer (Gegenprobe grün).

## 4 · Laufende Aufträge
- HUD 3D Paket 4: Flyouts L2 für Fächer (letzte Karten) und Pfeil (Karte/Zielwahl mit „Return to rest stone“), eine Hülle; danach Overlays L3 (Almanac, Truhe 20, Settings).
- Kassette: Pfad auf die WSB-Fassung umstellen, sobald sie in `assets/private` liegt; `controlTheme` wird automatisch übernommen, sobald der Schlüssel im N33-JSON steht (bis dahin `CTL_FALLBACK`, vorläufig).
- Danach laut Board: Flug-Grammatik für Karte/Song/Item, Telefon quer/hoch (`geo('A','phoneL'|'phoneP')`).

## 5 · Offen bei Georg / WS0
- Georg: Urteil HUD 3D (Spike + Paket 2) im Spiel; Bühnenplakat unter den Kugeln (Layout A); Kassette r5-Farben.
- WS0/WSB: `controlTheme` in N33, N34 r4/r5-Bögen, HUD-Fassung der N34-Kassette nach `assets/private`; Owner für Ziel (Quest/POI) und Almanac (Karten-Journal kfb.world-save/2).

## 6 · Sonderregeln (Verweise)
- Neue Looks nur hinter Schalter (`hud=3d`, `cas=old|new`, `ctl=auto|day|night`); Standard ändert nur Georg über den Lead.
- HUD zeigt nur Zustand, keine eigene Logik (EINBAU_WS1 §0); Klick = gleiche Wirkung wie die Spieltaste.
- Kein zweiter WebGL-Kontext; Props als gecachte Ansichten, neu nur bei Zustandswechsel.
- DOM-Teile immer wie die Hülle verankern (unten Mitte usw.), sonst Versatz bei Fenstern ≠ 16:9.
- Keine `//`-Kommentare mitten in Einzeiler (zweimal passiert: figureLight-Fund, HudClay-Ternär); nur `/* */` oder ans Zeilenende.
- Private/gekaufte Modelle nie in kayfabizarro oder öffentliche Vorschauen; Kenney-Pfeil (CC0) und Poly-Kassette (öffentlich in kayfabizarro media) liegen in `src/assets/hud3d`.
- Kein Merge, kein Push selbst; Merge-Antrag mit Hashes, Tests, Messwerten und Bildpfaden an den Lead.

## 7 · Nächster sinnvoller Schritt
„i“-Taste im 3D-Modus über der Kassette (gebaut, Test läuft), dann Paket 4 Flyouts (Fächer, Pfeil) in einer L2-Hülle.
