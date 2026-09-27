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
