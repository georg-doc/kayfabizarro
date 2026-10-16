# Stunt-Fahren · Spender-Karte R1 (V-351) · WS0 16.10.2026

Gelesen, nichts geändert. Quelle Stunt-Repo `georg-doc/KFB-Stunt-Car-Race` (lokal `~/Dropbox/CLAUDE/KFB Stunt Car Race/`, main @cc80f4a, neuester Handover v1_50). **Keiner der Stunt-Spender hat eine Georg-Abnahme**; abgenommen sind nur das v0.8-Fahrgefühl, das C0-Stadtfahrgefühl, J17 als Look-Goldstandard (V-010) und k2b als Fahrphysik-Regel (V-032).

## Georgs Regeln (Kern)
- V-351/V-347/V-151/V-150/V-161/V-180; MASTERPLAN.md: Assist arbeitet zonenweise „freie Anfahrt, weiches Einfangen, stabiler Commit, bewusste Freigabe, schnelle Recovery“ (:109); „Kein globales Wandkleben, keine unsichtbare Spline gegen die Eingabe“ (:365); Ride-Assist nur auf markierten Flächen, Hop/Kontaktverlust lösen ab (:363); Deformer ändern nie die physische Kontaktpose (:339); Kamera kopiert den Fahrzeug-Roll nicht blind (:456); Drift bewusst nutzbar, nicht dauerndes Schlittern (:212).
- Handover v1_41: Wallride „Spider-Man-Value“ nur bei Kontakt + markierter Fläche, „kein globaler Magnetmodus“ (:3092); nach Landung nur Normalbewegung begrenzen, Tangentialfahrt bleibt (:3192); Deformer-Mapping Beschleunigung→Stretch, Drift→Lean, Landung→Squash, Crash→asymmetrisch+Wobble (:477-485); „Pull“ heißt Neugier, kein Sog (:4130); Launch-Ramp/Springboard-Karte = Zusatzimpuls (§205ff) ≈ „Push“.

## Spender
| # | Teil | Pfad | Status |
|---|---|---|---|
| 1 | k2b-Fahrphysik + ASSIST (Spur, Knet-Bande, Landehilfe, rescue) | Lab `src/play/vendor/kfb-drive.k2b.js` (WS1 hat k2b) | RULE V-032, nur im Streckenrahmen |
| 2 | v0.8 Fahrgefühl (Q/E-Drift, Boost, Sprung, Bande) | Stunt-Repo `ChatGPT_web/track-lab/site/feel-lab-v08.mjs` + `RACE_FEEL_V08_CONFIG.json`; kayfabizarro `main:kfb-hub/stunt-race/track-lab/` | accepted baseline (v0.9 FAIL) |
| 3 | Rapier-4-Rad-Controller, Drift über Hinterrad-Grip, Rollover-Reset | Stunt-Repo `race/src/physics.js`, `racetrack01/src/physics.js` | Tests PASS, keine Abnahme |
| 4 | Free Roam (Drift, Boost, Reverse-Assist), Stuntfeld-Rampe | `ChatGPT_web/free-roam/site/drive-intent.mjs`; Branch `work/free-roam-s04-03-stuntfield` | Gefühl PENDING |
| 5 | Cartoon-Deformer v2 + Profile (`CAR_CHILL_LIGHT` einziges getestetes) | kayfabizarro main `tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/lab-v7/vehicle-cartoon-deformer.v2.js`, `deformer-profiles.json` | humanAcceptance PENDING (V-103) |
| 6 | Zwei-Rad-Choreografie (`free`/`wallride`) | gleiches lab-v7 `vehicle-twowheel.v1.js` | Werkbank, keine Abnahme |
| 7 | Fassrolle (landet garantiert auf den Rädern) | lab-v7 `vehicle-tumble.v1.js` | nicht abgenommen |
| 8 | Schlingern, Wenden/Einparken | lab-v7 `vehicle-fishtail.v1.js`, `vehicle-manoeuvre.v1.js` | nicht abgenommen |
| 9 | Zonen-Zustände free/capture/commit/release/recover + Assist-Presets | Stunt-Repo `_inbox/KFB_P2_GUIDED_DRIVING_v0_1/` (`assist-profile.json`, `stunt-zone.schema.json`) | 2D-Proposal, QA PASS |
| 10 | Stunt-Module (Loop, Magnet, Skyramp, Bounce-Pads) | RKIT-08/09 Branch `chat/rkit-08-09-stunts-2026-09-25` (PR #41), `*.stunt-module.json` | visuelle Richtung ok, nie in Rapier gefahren |
| 11 | Wandfahrt-Ablauf (Anfahrt → kippen → einfangen → entlang → abspringen/Recovery) | Branch `wsa/osm-city-drive-c1-deformer-2026-09-19`, `ChatGPT_web/osm-city-drive/WALL_RIDE_BACKLOG.md` | nur Backlog |

## Werte (Auszug)
- k2b ASSIST: follow 0.8, align 2.4, alignSteer 0.25, psiMax 0.85, wallReflect 0.4, wallKeep 0.995, flyGravity 13.3, landAim 1.0, landAhead 6, flySteer 0.35, flyMax 8; Landungs-Squash vN/12 (0.3–1.4); J17-Holder-Scale 1+.12·sq / 1−.18·sq / 1+.06·sq.
- FEEL: driftMinSpeed 7.5, driftSteerScale 1.28, driftDampingScale 0.28, driftKickScale 0.035, driftYawGain 1.32, regripSeconds 0.34, regripDampingScale 1.85; Boost ×1.55 bis 48.5; Sprung 7.8 / g 19; maxForward 41; Bande bounceBase 4.6, retention 0.985.
- P2 `chill`: capture lateralK .65 yawK .75 maxForce .95; commit 1.05/1.15/1.35; recover 1.35/1.4/1.7 Zieltempo 9; releaseSeconds .8; abort bei Lenkung > .82 für .32 s.
- Deformer CAR_CHILL_LIGHT: squash .03, stretch .03, lateral .02, pitch 4°, roll 5°, driftYaw 8°, impact .07, landing .09, Feder 3 Hz, Dämpfung .55.
- Zwei-Rad: TIP_SAFETY .92, WALL_LEAN .45, holdMs 1400.
- Kamera (Masterplan): FOV 60° +12 Tempo +6 Boost, max 78°, Vorausblick 0,35 s.

## Lücken (nie gebaut)
Wandfahrt als Physik; Push/Pull-Zonen als Kraftzonen (nächste Daten: MAG-Haftung, Launch-Ramp-Karte, P2 capture/commit); **Anti-Roll-Stabilisierung** (alle Spender setzen nur nach dem Umkippen zurück); Deformer-Kopplung an Gebäude-Kollision; Loop in Rapier; Recovery-Schwellen in Zonen.

## WS0-Plan
1. M2-Fahrprobe (V-347): Drift Q/E, enger Wendekreis, kein Überschlag, Label – zuerst.
2. Recherche Cartoon-Racer (V-352, Web-Chat) abwarten.
3. Dann Auftrag M3 „Assisted Stunt“: Assist-Stapel in dieser Reihenfolge – Anti-Roll + Landung in Fahrtrichtung + Anti-Stuck (neu, Recherche) → Deformer v2 `CAR_CHILL_LIGHT` an Tempo/Drift/Landung/Kollision → P2-Zonenzustände auf markierten Flächen (Rampe = Push/Launch, Wand = Ride-Surface) → Zwei-Rad/Fassrolle/Schlingern als Präsentationsschicht, ausgelöst von Sprung bzw. als Loot.
