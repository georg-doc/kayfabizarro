# CHANGELOG · J14 · 2026-09-30

## Neu
- `KFB Joyride J14 · Travel Modes.dc.html` (Kopie von J13b; J13b unverändert eingefroren): Mode-Leiste FUSS/AUTO/FLUG, Aktionsleiste I/LEER, Ablehnungs-Sprechblase, Burger-Panel mit Proben/Runde/Spur/Figur/Physik und 8-Zeilen-Buch.
- `lab-drive/kfb-drive.k2b.js` = k2 + Δ1 Drift-Zeile + Δ2 Rundkurs-Naht (FLOW/FEEL/ASSIST byte-gleich).
- `lab-drive/joyride-drive.j09.js` = j08 + wählbare Physik + Einhängepunkte (Eingabe, Nachlauf, Kamera, Orbit/Zoom zu Fuß, Schattenfokus, R zu Fuß gesperrt, placeCar/syncChase).
- `lab-travel/walkability.j14.js` (DERIVED), `travel-core.j14.js` (Zustände/Gates/Schnitt/Messung/Proben), `travel-modes.j14.js` (Browser: Figuren, Pads, Kamera, Puffs), `headless-probe.j14.js` (Rig laden, Profile, Proben ohne Grafik).
- `lab-travel/pinned/`: walk-controller.js (main, Blob b49dbb8dde4f), locomotion-profiles.v1.js (Blob 3db9fbd482e6), anim-map.v1.js (Blob 7120f80e25e8).
- `lab-track/data/p1a-j14.stream.json` = p1a + Core-Pads; `lab-track/parcours/p1-recipes.js` + `J14_PADS`/`placePads`.

## Geändert in der Session
- Space-Regel → Taste I für Ein-/Aussteigen (Georg).
- Schnitt „Pop“ → Sprung aufs Dach / Ausspucken mit Puffs und Doppel-Federer (Georg).
- Black Knight (Rig_Large) als zweite Testfigur (Georg).
- Fixes: T-Pose im Schnitt, Bordstein galt als Sprung, Probe-Bremse schoss bei 20 fps in den Rückwärtsgang, Autopilot-Tasten nach Fensterwechsel.

## Unverändert
Track Core, track-look.v5, M2, Übergangsatlas, j08/J13b, k2, k3, Kameras im Auto, HUD C-3, Fassaden, Schatten.
