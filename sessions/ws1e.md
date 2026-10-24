# Übernahmekarte · WS1e („Diegetisches Knet-HUD einbauen“, HUD-Bau)
Stand 25.10.2026 spät · mvp 5e26048 · Format wie `sessions/lead.md` (Status §162, V-713). Schnappschuss; das Logbuch sind die Commit-Texte auf `ws1/hud-clay-r1` und die Merge-Notizen des Leads in `WS1_STATUS.md`.

## 1 · Auftrag und Grenzen
- **Owner von:** HUD-Bau im Spiel: die eine HUD-Hülle (`src/hud/hudShell.js`), die Bausteinlisten Knet-HUD R1 (`src/hud/clayHud.js`, `hud=clay`, Standard seit Georgs Abnahme 22.10.) und HUD 3D R1 (`src/hud/hud3d.js`, `hud=3d`, nur Schalter), der HUD-Wirt `src/HudClay.jsx` (Trefferflächen, Zahnrad-Tafel, Almanac-Fächer, Blase, Kassetten-Knöpfe), der Overlay-Pass `src/hud/hudPass.js`, `DEVUI` als Live-Schalter (`src/debug.js`, V-655), HUD-Tests (`test/hud-clay.mjs`, `test/hud-3d.mjs`, `test/hud-3d-perf.mjs`, `test/hud-3d-shots.mjs`).
- **Nicht Owner von:** HUD-Design (Claude Design, V-694; Georg-Aufträge über den Lead), Inventar/Rucksack (HudR5f-api läuft im HUD unsichtbar mit), Fluff-Zähler und Gesamt-Fluff (`kfb.save`, `orchard.total()`), Ziel/goal und Almanac-Inhalt (M1-Wirt, Lead), Jukebox/Ton (WS-Audio; HUD ruft nur `musicPause/musicSkip/setVolume`), Waffen und Aktionen (Kampf/M1-Wirt; HUD löst die Spieltasten V/B/N/I über hostKeys aus), Modelle (WSB), Ruf-Skala (WS-NPC/V-699).
- Fragen an Georg nur über den Lead.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-hud` (Worktree von `~/kfb-ws1/kfb-planet`). Je Paket ein eigener Zweig von `ws1/mvp-r1`; zuletzt `ws1/hud-3d-p6` @a32693f → gemergt mvp `5e26048`. Vorher: P4 `8620081`, Säule R2 `f8fcac3`, P5 `bd71508`, Säule R3 `d21fbba`. |
| node_modules / privat | Symlinks auf `~/kfb-ws1/kfb-planet-mvp/node_modules` und `~/kfb-ws1/private-assets` (`src/private`, gitignored) |
| Abgeleitete private Datei | `src/private-gen/hud/cassette_a.hud.glb` aus `node scripts/hud/shrink-cassette.mjs` – in jedem neuen Worktree einmal ausführen. |
| Board-Paket HUD 3D R1 | `~/kfb-ws1/hud/KFB HUD 3D R1 Board/KFB_HUD_3D_R1_SESSION_2026-10-24/` (screens 01–12, docs/EINBAU_WS1.md, SPEC_WERTE.md) |
| Neue Module | `src/hud/tempoColumn.js` (Säule), `src/hud/hudL3.js` (Overlays L3: Almanach, Truhe 20, Einstellungen), `src/hud/miniMap.js`, `src/siteHash.js` |

## 3 · Bauen und prüfen
- `npx vite build` vor jedem Browser-Test (Tests laden `dist`), `PW_GPU=1`.
- Einzeln: `node test/contract-static.mjs`, `PW_GPU=1 node test/hud-clay.mjs`, `PW_GPU=1 node test/hud-3d.mjs` (u. a. speedR3, chestL3, chestLidCartoon, almanacFractal, almanacFromFan, settingsL3).
- Bilder (Slot): `node test/hud-3d-shots.mjs` (Abnahme), `node test/hud-3d-tempo.mjs` (Säule, 8 Zustände + Lichthof-Messung + Clip; `ONLY=desk,4_rot`, `GLOW_ONLY=1`), `node test/hud-3d-p5-shots.mjs` (Truhe/Almanach + 3 Clips), `node test/hud-3d-v736.mjs` (zu Fuß mit/ohne, Höhe), `node test/hud-3d-p6-shots.mjs` (Einstellungen, Fluchten + Clip). Ausgabe `test/out/hud-3d/…`, nur lokal (private Modelle).
- Volle Reihe: `zsh test/out/hud-3d/suite.sh` (Slot ~60 min). Bekannte Altfehler drift, c2, c3g; orbit fällt seit mvp cc1481d auch ohne HUD-Änderung (an WS0/C1 gemeldet).
- Regel: keine `//`-Kommentare mitten in Einzeiler (dreimal passiert: figureLight, HudClay-Ternär, hudShell setHint) – vor jedem Commit neue Kommentare prüfen.

## 4 · Laufende Aufträge
- Säule R3 gemergt; wartet auf Georg: Boost A/B, Breite des roten Bands (Lead-Frage), zu Fuß mit/ohne Säule, Höhe über Grund/absolut (V-736).
- Paket 5 gemergt; wartet auf Georg: Almanach A (Zoom, Standard) / B (`alm=page`).
- Paket 6 (Einstellungen L3, Board 08) gemergt: Zahnrad öffnet L3 im 3D-HUD; Knet-HUD behält die alte Tafel. Board-Zeilen ohne Owner (Sprache, HUD-Größe, Zielentfernung) fehlen bewusst.
- Danach laut Board: Flug-Grammatik (Karte/Song/Item), Telefon hoch (`geo('A','phoneP')`) – nur nach Freigabe des Leads.

## 5 · Offen bei Georg / WS0
- Georg: Wahl Boost A/B, Almanach A/B, zu Fuß mit/ohne Säule, Höhe über Grund/absolut.
- Lead/WS0: mehrere Decks im Almanach (Karten-Journal), Worlds-Reiter erst mit Daten, Beute-Vorschaubilder (B28-GLBs), Elan-Telemetrie zu Fuß erst nach Wahl; `controlTheme` (N33), WSB-Fassung der N34-Kassette.

## 6 · Sonderregeln (Verweise)
- Neue Looks nur hinter Schalter (`hud=3d`, `cas=old|new`, `ctl=auto|day|night`, `boost=a|b`, `alm=zoom|page`, Prüf-Schalter `fusstempo=aus`); Standard ändert nur Georg über den Lead.
- HUD zeigt nur Zustand, keine eigene Logik (EINBAU_WS1 §0); Klick = gleiche Wirkung wie die Spieltaste.
- Kein zweiter WebGL-Kontext; Props als gecachte Ansichten, neu nur bei Zustandswechsel.
- DOM-Teile immer wie die Hülle verankern (unten Mitte usw.), sonst Versatz bei Fenstern ≠ 16:9.
- Keine `//`-Kommentare mitten in Einzeiler (dreimal passiert, siehe §3); nur `/* */` oder ans Zeilenende.
- Private/gekaufte Modelle nie in kayfabizarro oder öffentliche Vorschauen; Kenney-Pfeil (CC0) und Poly-Kassette (öffentlich in kayfabizarro media) liegen in `src/assets/hud3d`.
- Kein Merge, kein Push selbst; Merge-Antrag mit Hashes, Tests, Messwerten und Bildpfaden an den Lead.

## 7 · Nächster sinnvoller Schritt
Georgs Wahlen abwarten (Boost, Almanach, Fuß-Säule, Höhe), dann umsetzen; bis dahin nichts Neues (Lead 25.10.).