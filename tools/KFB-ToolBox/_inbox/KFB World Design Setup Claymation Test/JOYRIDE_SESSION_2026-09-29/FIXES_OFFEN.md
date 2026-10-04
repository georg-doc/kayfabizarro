# Fehlende Fixes · exakt

## F1 · Fassaden wie K1/H0 (Tor FACADE-A/B-01)
1. K1-Standalone (`standalone/KFB Knet-Katalog K1 -standalone-.html`) und J05 nebeneinander; Haus building_A, Kamera 6 m, 30° oben, K1-Licht.
2. K1 `clay-catalog.v5 clayify` unverändert übernehmen: je Mesh `softenGeometry` mit K1-Standard (maxEdge 0,18, 3 Stufen, **maxTris 90 000**), `seedGeometry`, `clay-material.v8` Profil house.
3. K1-Uniforms (Hand 0,5 · Kachel 1,6 · Abdruck 4,5) über ECHTE Skalierung umrechnen (K1-Haus 3,2–3,8 m, T4-Haus messen).
4. Haus als Gruppe platzieren, NICHT in den T4-Mega-Mesh mergen und NICHT biegen, bis Georg das Bild abnimmt.
5. Erst danach Kosten: Vorstufe offline als GLB backen (LIVING_CLAY „OPEN: Vorstufe offline backen“).
Akzeptanz: drei Bilder Quelle | K1 | J05, Dachkante nah, Georg-Urteil.

## F2 · Kontaktnaht Kugel-Kronen
Nicht Schatten-Bias. Fehlende Verdeckung, wo Kugel B unter Kugel A steckt.
Fix: beim Bau jeder Krone je Vertex der unteren Kugel Abstand zur Oberfläche der oberen Kugel messen, AO = smoothstep(0, r·0,35, d) → Vertexfarbe (T4 `tree()`/`blob()`, wie H0 „Kugel in Kugel“). Kosten 0 zur Laufzeit.
Akzeptanz: Nahaufnahme Baum wie Georgs Screenshot 19.40.46, ohne helle Bande.

## F3 · Aufräumen
`screenshots/0?-j0*` sichten; `lab-drive/*.j02…j05` sind FROZEN; `lab-drive/ammo.js` nur Historie.
