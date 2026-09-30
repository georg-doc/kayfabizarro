# RETURN · Joyride J14 · Reisemodi · 30.09.2026

Status: **DESIGN PROOF · CANDIDATE**. Kein GitHub-Push, kein Cloudflare, keine Stage, keine Owner-Änderung.
Seite: `KFB Joyride J14 · Travel Modes.dc.html` (J13b bleibt eingefroren).

## A · Quellen- und Entscheidungsbuch (8 Zeilen)
| # | Entscheid | Quelle / Pin | Umsetzung J14 |
|---|---|---|---|
| 1 | Fahrphysik K2B | `lab-drive/kfb-drive.k2.js` (gepinnt, Projekt) | `kfb-drive.k2b.js` = k2 + Δ1 Drift-Zeile + Δ2 Rundkurs-Naht (beide wörtlich K3, ohne K3-Kantenhalt). FLOW/FEEL/ASSIST byte-gleich (Skriptvergleich), Diff +11/−5 Zeilen. K2 pur im Panel wählbar. Kein PASS. |
| 2 | Flug = nur K2-Sprung | K2-Flug über Luftstücke (`takeoff/flyStep`) | Zustände AUTO.TAKEOFF → AIRBORNE → LANDING, Kamera chase → fly-chase → chase als Ereignis. Steigen/Sinken **MISSING**, Knopf „Flug · Jump-Kandidat“ lehnt sichtbar ab. |
| 3 | Begehbarkeit DERIVED | Stream-Stücktypen, `td.tunnels`, Deck-Überlagerung | `lab-travel/walkability.j14.js`. Straße/Rampe/Platz ja, Looping/Skydrive/Luft/steil nein. 65,8 % der Samples begehbar. Tunnel = `tunnel:T1_tunnel_in`, Brücke/Unterführung eigene Ebenen; Bodenabfrage s-lokal (±15 m). Core unverändert. |
| 4 | Parken/Wenden P1A | Track Core v0.12 `recipe.pads` (compilePad, Check `pad_level`) | `p1-recipes.js#J14_PADS` + `placePads`: Fahrschul-Pad mit P1/P2 auf den Fahrspuren + Bremslinie; Wendestelle = vorhandener `HAIRPIN_180 plaza_hairpin`, „geführt“. 25 Checks, 0 Fehler, `pad_level` 0,0001 m. Fingerprint 840a0a2e unverändert → `lab-track/data/p1a-j14.stream.json`. |
| 5 | Sprint zeigen, messen | Router: Running_B misst +22,1 % → Router wählt **Running_B × 1,0** | Kandidat laut WSA: Running_B × 1,3 = 4,02 m/s. **UNPROVEN**: Standbein-Rutschen 1,13 m/s (28 %), quer −0,008 m/s. |
| 6 | Leertaste | — | < 0,5 m/s parken/aussteigen, ≥ 0,5 m/s hüpfen (Flanke, kein Halten). HUD zeigt die Aktion. Aussteigen während der Fahrt wird abgelehnt („Erst anhalten · 11,1 m/s“). Keine F-Taste. |
| 7 | Runden-Gate | `p1a.stream.json`, k2b/k2 | Keine J13b-Rundendatei gefunden → neu gefahren: headless K2B 86,38 s, 4139,5 m, 6 Absprünge / 6 Landungen, 0 Rettungen, 0 Bande (K2 pur 86,35 s). Vorschau: volle Runde automatisch, LAP 2 erreicht (HUD-Uhr = Wandzeit bei 12–19 fps). |
| 8 | Clips Router zuerst | KayKit Character Animations 1.1 Rig_Medium @b97b5ac5 · locomotion-profiles.v1 (Blob 3db9fbd482e6) · anim-map.v1 (Blob 7120f80e25e8), PR #294 Branch | ActionFigure @43d39ef9: **23/23 Knochen, kompatibel**, Maßstab 0,7966 (2,32 → 1,85 m). Laufen = Profil-Router, Sitzen = anim-map `DriveIdle → Sit_Chair_Idle` (ADAPTABLE). Kein Motion-v5. |

Ground: `walk-controller.js` @main Blob b49dbb8dde4f (Schnappschuss 2026-09-30T02:35Z, Projektkopie `lab-travel/pinned/`), einziger Ground-Positionsschreiber; nur Parameter (Stufe 0,45 m, Sprung ≈ 0,95 m, Radius 0,35 m) übergeben.

## B–D · Was gebaut ist
- Mode-Leiste oben links: FUSS · AUTO · FLUG (Jump-Kandidat). Kontext-Leertaste unten Mitte. Ablehnung als Sprechblase am Actor/Auto.
- `lab-travel/travel-core.j14.js`: Zustände, Gates, Schnitt (CUT.EXIT 0,35 s / CUT.ENTER 0,3 s, Squash + Puff), Kamera-Übergabe als eigener Zustand (CAM.TO_WALK / CAM.TO_AUTO, 0,7 s), Rollenwahl mit Router-Überblendungen, Fußkontakt/Rutschen am Rig, Spuren 10 Hz.
- `lab-drive/joyride-drive.j09.js` = j08 + wählbare Physik + Einhängepunkte (Eingabefilter, Kamera, Orbit zu Fuß, R gesperrt zu Fuß).
- Panel: drei 20-s-Proben, Runde automatisch, K2B/K2, Spur als JSON-Download, Buch.

## Belege (`lab-travel/evidence/`)
`j14-round-gate.lap.json` · `j14-pads.core.json` · `j14-walkability.derived.json` · `j14-profile-set.json` · `j14-clip-selection.json` (inkl. Sitzmaß) · `j14-probe-A|B|C.trace.json` · `j14-probes.summary.json`.
Proben headless (dieselben Dateien, dt 1/60, k2b, Spurhilfe 0,8), **3 × 20 s**:
- A Walk→Auto→Walk: 2 × Aussteigen, 1 × Einsteigen, 1 Ablehnung während der Fahrt, 1 Leertaste = Hüpfen bei Tempo, Parkbeleg P1.
- B Sprung + Sprint: 3 Sprünge / 3 Landungen (Jump_Start → Jump_Idle → Jump_Land), Sprint-Kandidat, rückwärts, seitlich, gehen.
- C Luft + Parken + Wende: Absprung/Landung + Kamera, geführtes Parken in P1, Aus-/Einsteigen, Wendestelle ein/aus.
Rutschen (Median Standbein, m/s · Anteil an Weltgeschwindigkeit): gehen 0,14 (27 %) · laufen 0,55 (22 %) · Sprint-Kand. 1,13 (28 %) · rückwärts 0,38 (66 %) · seitlich 1,43 (54 %, quer −1,06: Strafe-Clip läuft 30° schräg vor) · Jump_Start beim Laufen 2,53 (114 %) · Drehen im Stand (kein Clip) quer −0,95.
Screenshots `screenshots/`: j14-01-start · 01-j14-C (Flug-Kandidat leuchtet) · j14-C2 (geparkt P1) · j14-03-reject-safe-space · 01-j14-A (Schnitt) · 02-j14-A (Fuß neben Auto, „Einsteigen“) · 02/03-j14-B (Sprung, Sprint seitlich) · 01/02-j14-B2 (¾, vorn) · j14-lap-end (LAP 2).

## Offen / UNPROVEN
- **Sitzmaß: passt nicht.** Sedan 1,69 m hoch, ActionFigure sitzend Kopf 1,53 m über der Hüfte → Sitz müsste ≤ 0,12 m hoch sein. Figur im Auto ausgeblendet; kein Auto-PASS.
- Sprint, Strafe, Rückwärts, Drehen im Stand, Sprung aus dem Lauf rutschen messbar → UNPROVEN.
- Schnitt-Pose: T-Pose im Aussteige-Schnitt behoben (Idle ab Schnittbeginn), danach **nicht neu fotografiert**.
- Vorschau 7–19 fps (schwache GPU); auf Georgs Gerät nicht gemessen. Fassaden/Schatten außer Scope, nicht angefasst.
- Parken ist geführt (Spur halten + Bremspunkt), kein freies Einparken.

## Nachtrag · Georg 30.09. · Figuren + Ein-/Aussteigen
- **Taste I** = Ein-/Aussteigen (ersetzt WSA #6), **Leertaste** = immer Hüpfen/Springen. Aussteigen bleibt < 0,5 m/s + begehbar; Einsteigen bis 3,5 m (Mode-Leiste bis 25 m, weiter Sprung).
- **Einsteigen**: Ausholen 0,16 s (Jump_Start) → Bogen aufs Dach (Jump_Idle, Scheitel +1,25 m) → im Dach versinken (5 kleine Puffs, Auto federt) → „plumpst“ unsichtbar in den Sitz (zweiter Federer, 2 Puffs). Schnitt-Kamera folgt dem Sprung.
- **Aussteigen**: Auto staucht → spuckt aus dem Dach (Auto streckt, Puffs, Pop mit Überschwinger, eine Drehung) → Bogen neben die Tür → Jump_Land + Nachfedern + Puff. Choreografie PROCEDURAL, Werte in `travel-core.j14.js#CUT`.
- **Black Knight** (KayKit Mystery S6 @43d39ef9, `BlackKnight.glb`) auf **Rig_Large**: 23/23 Knochen, Ruhelage = Large. Nativ 4,69 m → mit dem ActionFigure-Faktor 3,74 m; Design-Wahl **2,30 m** (`fitH`). Large-Set hat nur Idle/Walk/Run/Dodge/Hit/Death/Flexing: Sprung, Rückwärts, Seitlich **UNMAPPED** (Sprung + Schnitt prozedural, Rückwärts/Seitlich gesperrt mit Hinweis). Sprint = Router-Variante Running_A × 1,3. Rutschen Knight gemessen hoch (Laufen 1,83 m/s, 144 %) → UNPROVEN.
- Figurwahl im Panel (ActionFigure · Medium / Black Knight · Large), Wechsel ohne Neuladen.
- Belege: `lab-travel/evidence/j14-actors.json`, `j14-probe-*.blackknight.trace.json`; Bilder `screenshots/j14-04-enter-sequence.ActionFigure.jpg`, `j14-05-exit-sequence.ActionFigure.jpg`, `j14-06-exit-jump.BlackKnight.jpg`, `j14-07-run.BlackKnight.jpg`.

## Genau eine nächste Aktion
Georg fährt J14 einmal selbst über P1 → P1-Box → Aussteigen → zurück (5 Minuten) und entscheidet am Bild: **Sitzmaß-Weg** (kleinerer Proof-Actor, größeres Fahrzeug oder Figur im Auto ausgeblendet lassen).
