# CHANGELOG · KFB Theatre Curtain Recovery (Issue #372)

Additiv. Neue Einträge oben, bestehende nie umschreiben.

## 2026-10-07 · r3 · Georg-Review: PASS ("top!")
- Gold-Leiste am Proszenium endet jetzt im Sockel (vorher doppelter Absatz an der Ecke); Sockel 0.8 × 0.38.
- Faltenwurf gerundet statt Faltwand: Cloth-Raster 65 × 49 pro Panel, Pin alle 8 Spalten, 12 % Stoffzugabe, Pin-Tiefe 60 %, Raffung 0.72.
- Saumgewicht: unterste 10 % der Reihen mit bis zu 2,6-facher Gravitation, am stärksten an der Innenkante → runde, hängende Enden.
- Rampenlicht-Kugelreihe entfernt; warmes Frontlicht bleibt (Fixtures später als echte 3D-Modelle).
- Fix: Compute-Stage lag bei 9 Storage-Buffern (Limit 8) → Cloth verschwand. tie + hem in einen vec2-Buffer gepackt.
- Evidence neu: cand-01…07, r3-hem-corner-open.

## 2026-10-07 · r2 · Georg-Review: TUNE
- Bewegung: Smootherstep 2,6 s (schlich ins Ende) ersetzt durch Momentum-Drive `MOTION` (Zug-Rampe, Laufgeschwindigkeit, harter Anschlag, 25 % Rückfedern, ζ 0.42 auf / 0.5 zu); ≈ 1,2 s Weg. Cloth-Dämpfung 0.986 → 0.992, Saum schwingt nach.
- Sockel bündig mit der Öffnung (ragte 7 cm hinein, Saumecken stachen davor heraus).

## 2026-10-07 · r1 · Erstabgabe
- Donor v2 (blob db96d54b) unverändert isoliert über `donor-probe.html` (fester 1/60-s-Takt, 2D-Mirror), 6 Frames.
- Fail-Analyse: Panels gleiten statt raffen, untere 25 % nie gerendert, Opacity 0.85, koplanare Panels, keine Bühne.
- Kandidat `candidate/kfb-curtain-core.js`: Donor-Kernel unverändert, getunt (Raffung, Pinch-Pleats, alle Reihen, opak + Layer, Gewicht), Material A/B/C/P (P gewählt), Proszenium, Pelmet, Schiene, Boden, Fußlicht.
- Ein Modul, drei Nutzungen (Loading, Character Select, In-Game-Reveal), sieben Zustände, Host-Fakten-Gate.
- Quarantäne: Tieback (verheddert sich ohne Self-Collision), Impact r0 (zu stark, behoben).
- Fix: Float-Akkumulation ließ `opening` nie `open_rest` erreichen.
