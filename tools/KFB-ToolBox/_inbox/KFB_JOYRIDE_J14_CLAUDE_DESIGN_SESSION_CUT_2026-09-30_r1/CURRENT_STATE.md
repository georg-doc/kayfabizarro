# CURRENT_STATE · 2026-09-30T03:55Z

| Bereich | Stand | Status |
|---|---|---|
| Fahrphysik | K2B Standard, K2 pur umschaltbar (lädt neu, localStorage `kfb.j14.drive`) | CANDIDATE |
| Flug | K2-Sprung: AUTO.TAKEOFF → AIRBORNE → LANDING, Kamera chase ↔ fly-chase | CANDIDATE · Steigen/Sinken MISSING |
| Begehbarkeit | 65,8 % der Samples; Straße/Rampe/Platz ja; Looping/Skydrive/Luft/steil nein; Tunnel/Brücke eigene Ebenen | DERIVED |
| Parken/Wenden | Core-Pads fs_pad_j14 (P1, P2, Bremslinie) + wende_j14 (plaza_hairpin) | geführt |
| Tasten | I = Ein-/Aussteigen · Leer = Hüpfen/Springen | Georg 30.09. (ersetzt WSA #6) |
| Schnitt | Einsteigen 0,16 + Flug 0,46–0,96 + 0,12 + 0,26 s · Aussteigen 0,16 + 0,62 + 0,34 s | PROCEDURAL |
| Figuren | ActionFigure (Medium) · Black Knight (Large, fitH 2,30 m) | kompatibel · Knight teils UNMAPPED |
| Sprint | Running_B × 1,3 = 4,02 m/s, Rutschen 1,13 m/s (28 %) | UNPROVEN |
| Runde | headless K2B 86,38 s, 6/6 Sprünge, 0 Rettungen · Vorschau LAP 2 erreicht | PASS (Gate 7) |
| Leistung | 7–19 fps Vorschau, ~10 fps bei Georg | offen, global |
| Sitzmaß | passt nicht (Sedan) | offen |

Lokale Schlüssel: `kfb.j14.drive`, `kfb.j14.actor` (localStorage).
