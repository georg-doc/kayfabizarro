# CHANGELOG · KFB UFO Tractor Beam Event Lab

## r2 · 2026-10-07 · Beam-Überarbeitung nach Georgs Review
Feedback Georg (Screens 00.24.52 / 00.25.11 / 00.31.19) → Umsetzung:

| Feedback | Ursache | Änderung |
|---|---|---|
| Kreis auf dem Boden vor dem Beam, Bezug zum UFO unklar | LOCK-Ring schrumpfte von 2,4·R auf den Fußabdruck, ohne Verbindung nach oben | LOCK-Ring entfernt. LOCK zeigt jetzt den Emitter unter dem UFO (Glow pulsiert). Die Bodenpfütze erscheint erst, wenn der Beam ≥ 85 % Reichweite hat, sitzt exakt am Beam-Fuß und hat keine harte Kante mehr |
| Beam zylinderförmig statt kegelförmig | Öffnung 1,4 m, Fuß bei Pet nur 1,75 m. Ab 50 % zog sich der Fuß zusätzlich auf die Öffnungsbreite zusammen | Emitter-Radius 0,6 m (`APERTURE` 0,2 → 0,085). Fuß = max(1,25·R + 0,4, rTop + 0,3·Länge). Die Verengung beim Transfer ist entfernt |
| Redundanter innerer Beam | zweiter Shader-Kegel (`beamInner`) | entfernt. Der äußere Kegel hat etwas mehr Grundhelligkeit (`uK` 1 → 1,35) |
| Beam oben ohne Bezug zum UFO, „Lazy Hack“ bei Drehung | Kegel startete an der BBox-Unterkante, immer senkrecht, flache weiße Scheibe als Öffnung | Emitter-Höhe pro Modell per Raycast (13 Strahlen am Öffnungsring), Kegelstart 8 cm im Rumpf. Der Beam übernimmt Neigung und Stauchung des UFO-Rigs. Die Scheibe ist ersetzt durch einen weichen Glow-Sprite plus Punktlicht, das die Rumpfunterseite in Beam-Farbe anstrahlt |
| COMPLETE-VFX sloppy | beiger Torus-„Puff“ um das UFO | Torus entfernt. Der Beam fährt von unten ein, der Emitter blitzt kurz und schließt (exp. Abklingen 0,4 s), dazu die vorhandene Schluck-Stauchung |
| Kenney-Beam doppelt | Das GLB enthält zwei verschachtelte Kegel, transparent mit Rückseiten | nur die äußere Hülle wird gerendert (Breite ≥ 92 % der max. Breite), nur Vorderseiten, unbeleuchtet (`MeshBasicMaterial`) |
| Helle Fläche am rechten Rand (Kenney) | Sonne auf einer Facette des beleuchteten Materials | durch das unbeleuchtete Material behoben |
| „Kamera“ ohne Funktion? | Der Button setzt die Ansicht zurück, das ist aber nur sichtbar, wenn man vorher orbitet. Er stand unter BEAM | umbenannt in „Kamera zurücksetzen“ und verschoben nach ANSICHT |

Belege: `ufo-event-lab/screens/r2/` (8 Screens + Kontaktbogen).
Unverändert: Phasen, Hooks, Event-Namen, Audio-Map, Partikel-Grammatik, CLS-Zahlen außer Beam-Fuß.

## r1 · 2026-10-06 · V1 gebaut
Siehe `RETURN.md` §1–10.
