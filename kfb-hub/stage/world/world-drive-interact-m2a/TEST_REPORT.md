# WORLD-DRIVE-INTERACT-M2A · Test Report

Datum: 2026-09-27  
Automatischer Status: `PUBLIC_BROWSER_PASS`  
Produktstatus nach freiem Spieltest: `HUMAN_TUNE · NOT_PLAYABLE`

`browser-proof-m2a.mjs` → **34/34 PASS** über lokale HTTP-Preview und nochmals **34/34 PASS** auf der festen öffentlichen Stage (jeweils 1280 × 820 und 390 × 844).

Geprüft wurden M2A-Quellmarker, Hirnwelt-H0-Knete als sichtbarer Standard, erreichbares Fahrzeug, exakter Race-Donor, E-Einstieg, formale Free-Roam-Ownership, E-Ausstieg, anschließender Flug, kompakte Oberfläche sowie 0 Seiten-, Konsolen-, Request- und HTTP-Fehler.

## Human free-play override

Georgs freier Test hat gezeigt, dass die automatischen Prüfungen zu schmal waren. Der Stand ist aktuell nicht spielbar:

- Bewegung langsam und ruckelig;
- schlechte Ladezeit und unruhiges Frametiming;
- falsche oder falsch getaktete Bewegungsanimationen;
- Fahrzeug nicht korrekt auf Bodenniveau;
- fehlende durchgehende Terrain-Kollision abseits der Straße; Fahrzeug fällt auf Grünflächen und anderen Wegen durch;
- sichtbare Schatten-/Hellkanten-Artefakte an Boulder und Props.

Damit bleibt `PUBLIC_BROWSER_PASS` nur technische Evidence. Er darf nicht als Produkt-PASS oder MVP-Abnahme gelesen werden.

Noch nicht behauptet: spielbares World-MVP, echter Track Core, Water, finales Fahrzeug-/Sitz-/Kameratuning oder Audio/SFX.

## R1 · lokale Browsermessung

- Paket/Owner-Prüfung: **23/23 PASS**.
- Bester Kaltstart bis Kontrolle: **14,2 s** — Ziel ≤ 15 s bestanden.
- Parkendes Fahrzeug: **4/4 Kontakte**, sichtbarer Bodenabstand **0,002–0,003 m**.
- Fahrboden: **716 × 716 m**, aus der echten World-Zone abgeleitet.
- Offroad-Probe: rund **24 m**, am Ende **4/4 Kontakte**, kein Fall.
- Zu-Fuß-Lauf: Frame-Median **57,6 ms**, p95 **84,4 ms**.
- Fahr-Lauf: Frame-Median **62,2 ms**, p95 **89,4 ms**.
- Renderprofil: Pixelratio **1,25**, Terrain **192 statt 384 Segmente**, Bodenkarte **2048 statt 4096 px**, Schattenkarte **2048 statt 4096 px**.
- Renderlast: ca. **1,13 Mio. Dreiecke**; `renderer.render` dominiert mit ca. **46–71 ms/Bild**. Die übrigen gemessenen Runtime-Phasen bleiben jeweils deutlich unter 1 ms.

Bewertung: `R1 PARTIAL`. Kontakt, Fahrzeug-Bodenniveau und Kaltstart sind repariert. Das Frame-Budget von p95 ≤ 33,3 ms ist nicht erreicht. Kein Public-Publish und kein dritter R1-Kandidat.

## R3 · City Shell LOD

- Paket-/Owner-Prüfung: **24/24 PASS**.
- Vollständiger lokaler Browserlauf Desktop + schmal: **34/34 PASS**.
- 0 Seiten-/Konsolenfehler, 0 fehlgeschlagene Requests, 0 HTTP-Fehler.
- Kaltstart der drei isolierten Hauptläufe: **6,0–6,5 s**.
- Sichtbare Dreiecke: ca. **185–198 Tsd.** statt ca. 1,13 Mio.
- Idle: Median **27,8 ms**, p95 **43,3 ms**.
- Walk: Median **26,3 ms**, p95 **42,7 ms**.
- Drive/Offroad: Median **26,4 ms**, p95 **43,9 ms**, 4/4 Kontakte; kein Fall durch den Boden.
- Diagnose ohne Schatten: Walk p95 **41,6 ms**.
- Diagnose ohne Stadt: Walk p95 **39,9 ms**.
- Diagnose Pixelratio 0,6: Walk p95 **26,3 ms** — Ziel bestanden, aber noch keine akzeptierte sichtbare Qualitätsregel.

Bewertung: `R3 PARTIAL · MATERIAL PERFORMANCE GAIN · FRAME TARGET FAIL`. Die Stadt-LOD ist ein tragfähiger technischer Donor, aber noch kein veröffentlichter Kandidat. Der nächste Pass muss die Auflösung und Clay-Relief-Qualität abhängig von Gerät, Bewegung und Distanz staffeln.
