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

## R4 · Adaptive Resolution + Clay Distance Budget

- Paket-/Owner-Prüfung: **26/26 PASS**.
- Vollständiger lokaler Browserlauf Desktop + schmal: **38/38 PASS**.
- 0 Seiten-/Konsolenfehler, 0 fehlgeschlagene Requests, 0 HTTP-Fehler.
- Kaltstart bis Kontrolle: **3,6–3,8 s** in den drei isolierten Messläufen.
- Idle: **16,7 ms p95**, Pixelratio 0,86, ca. 191.860 Dreiecke.
- Walk: **16,7 ms p95**, Pixelratio 0,65, ca. 184.068 Dreiecke.
- Drive/Offroad: **16,7 ms p95**, Pixelratio 0,65, ca. 168.774 Dreiecke, 4/4 Kontakte.
- In allen drei 8-s-Läufen: **0 Frames über 50 ms**.
- Qualitätswechsel `stable → moving → stable`: 0,86 → 0,65 → 0,86; vier Zustandswechsel insgesamt, kein frameweises Umschalten.
- Entfernte Stadt-Hüllen nutzen ein einfaches raues Material ohne vollständigen Clay-Relief-Shader; nahe Welt, Straßen, Props und nahe Stadt behalten das Relief.

Zusätzlich wurde exakt `https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-drive-interact-m2a/` nach Publication-Head `2e1978821a043cf604c8bc556493cae282a87a86` erneut geprüft: **38/38 PASS** auf Desktop und schmalem Viewport, einschließlich Ground → Drive → Ground → Flight, echter Radkontakte sowie 0 Seiten-, Request- und HTTP-Fehler.

Bewertung: `R4 LOCAL PERFORMANCE PASS · PUBLIC BROWSER PASS · HUMAN FREE-PLAY PENDING`. Die Werte sind vergleichbare lokale Browsermessungen auf derselben R3/R4-Testumgebung, kein allgemeiner Hardware-Benchmark. Das menschliche Spielgefühl bleibt der nächste Produktcheck.

## R5 · Playability repair

- Paket-/Owner-Prüfung: **27/27 PASS**.
- Vollständiger lokaler Browserlauf Desktop + schmal: **38/38 PASS**.
- Gesonderter Spielbarkeitstest: **PASS**, 0 Seiten-/Konsolenfehler.
- Kaltstart bis Kontrolle: **4,05 / 4,09 s** in den beiden Interaktionsläufen.
- Normaler Lauf nach 0,7 s: **1,41 m/s**; Sprint: **2,99 m/s**.
- Fahrzeug im ersten sichtbaren Zustand: **4/4 Kontakte**, **0,003 m** Ground-Gap, 41 Pre-settle-Schritte.
- Offroad-Probe: **12,67 m**, am Ende 4/4 Kontakte, Ground-Gap −0,009 m, kein Fall.
- Isolierte Performance: Idle **33,4 ms**, Walk **16,8 ms**, Drive **16,8 ms** p95; 30-fps-Ziel bestanden.
- Adaptive Qualität: `stable → moving → stable`, kein sichtbares Pumpen im Zustandsprüfer.

Öffentliche Wiederholung auf der festen Route nach Publication-Head `f827839509cf7b517daa98fe3074f49d9510c626`:

- Browser Desktop + schmal: **38/38 PASS**.
- Playability: **PASS**; Walk 1,41 m/s, Sprint 2,99 m/s, Offroad 12,96 m, 4/4 Kontakte.
- Performance: Idle **33,3 ms**, Walk **16,7 ms**, Drive **16,8 ms** p95; Qualitätswechsel stabil.
- 0 Seiten-, Konsolen-, Request- oder HTTP-Fehler.

Bewertung: `R5 PUBLIC PLAYABILITY PASS · FRAME TARGET PASS · HUMAN FREE-PLAY PENDING`. Die automatischen Prüfungen belegen Boden, Eingabe, Zustände und Performance; sie ersetzen nicht Georgs Sichtprüfung von Clip-Taktung und Spielgefühl.
