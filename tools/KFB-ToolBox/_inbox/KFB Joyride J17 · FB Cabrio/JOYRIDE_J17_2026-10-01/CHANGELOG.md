# CHANGELOG · J17 (additiv zu J16 r2)

2026-10-01 · FB-CABRIO-JOYRIDE-01

## Neu
- `KFB Joyride J17 · FB Cabrio.dc.html`: J16 plus Cabrio als Standardauto und FrizzleBob als Standardfigur. Ledger-Zeile 9 CABRIO zeigt die Live-Messwerte, die Spur als JSON enthält `seat`.
- `lab-travel/cabrio-seat.j17.js`: die Seat-Schicht (Cabrio-Vorbereitung, Sitz, Arm-IK, Lenkrad, Lehne, Bounce, Body Roll, Hop, Ohrenwind, Gesichtstakt, Kollisionsmessung).
- `lab-travel/travel-modes.j17.js`: j14 plus FB, Seat-Schicht, `late`-Hook und Hop-Kamera.
- `lab-travel/travel-core.j17.js`: j14 plus ein Einhängepunkt `host.hop`.
- `lab-travel/headless-probe.j17.js`: j14 plus Figur `frizzlebob` (Pin @93abbf22, Maßstab A).
- `lab-drive/joyride-drive.j10.js`: j09 plus `extraVehicles` (URL, fester Maßstab, Drehung, prep, Glas bleibt, Lenkrad ist kein Rad), `api.carId` / `api.car` und `TV.late` nach dem Auto-Transform.
- `lab-travel/pinned/`: face-mount.v1, clay-lids.v1, ear-base.v1, ear-dangle.v1 (ToolBox P06 r2 @main, mit Kopfzeile).
- `lab-travel/fb-car-01/`: VEHICLE_SEAT_CONTRACT.json, POSES.json, fb_car_seated.png (Kopien FB_CAR_01) und `VEHICLE_SEAT_CONTRACT.j17-patch.json`.
- `media/3D_Assets/FB/FB_TEMPLATE_LOOK_v5b.glb`: lokale Kopie. Geladen wird aber die Datei @93abbf22 per jsDelivr.
- Evidence: `lab-track/evidence/j17-seat-evidence.json` und `j17-round-gate.cabrio.json`.

## Unverändert
- k2b/k2, J09-Kamera, T4-Look, Fassaden, Schatten, Track Core v0.12, Stream p1b.v2, Tunnel TC1.
- J16 und J15 bleiben, wie sie sind.
