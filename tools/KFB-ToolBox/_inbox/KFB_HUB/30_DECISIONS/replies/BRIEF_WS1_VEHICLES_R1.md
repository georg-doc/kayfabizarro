# BRIEF · Fahrzeuge im Spiel: 8 Dieselpunk-Racer, Heldenfarbe, Scheinwerfer · R1 · 2026-10-22 · WS0 → WS1 (vierte Sitzung)
**Register:** V-631. Läuft parallel zum MVP auf eigenem Branch `ws1/vehicles-r1`, basiert auf `ws1/mvp-r1`. Eingebaut wird über den Lead.

**Tier 0**
1. **Use what works:**
   - die Racer aus dem Rig-Studio: bisher 6 im Spiel, dazu die 8 neuen Dieselpunk-Racer;
   - Fahrphysik und Auto sind abgenommen (V-251);
   - Joyride-Einstieg (V-534);
   - die Heldenfarbe aus der Probe;
   - das Scheinwerfer-Modul aus der Probe (`port/kfb-headlights.v1.js`).
2. **Ein Licht-Rig (V-385):** Scheinwerfer sind Glas-Glow, Lichtkegel und Bodenlicht über die Lichtpfützen, keine echten Lichter. Farbe aus der Antriebsfarbe.
3. **Leistung:** Scheinwerfer < 0,2 ms je Wagen. Alle 14 Racer wählbar ohne Ruckler beim Laden.

## Block
1. **Racer:**
   - Die 8 Dieselpunk-Racer kommen ins Spiel, mit Karte je Racer: Maße, Räder, Anker.
   - Fahrphysik je Klasse aus den vorhandenen Werten. Kein Neubau.
   - Auswahl im Spiel bzw. an der Startseite.
2. **Heldenfarbe** wie in der Probe. Dazu die Ferne-Aufhellung am echten Spielabstand nachmessen.
3. **Front-Scheinwerfer** (Georg 22.10.):
   - Modul aus der Probe, Anker je Racer halbautomatisch.
   - Abnahme im Rig-Studio, dann ins Spiel.
   - Nachts und in Tunneln sichtbar (passt zur Biom-Fahrt V-619).
4. **Prüfbild:**
   - Kontaktbogen aller 14 Racer (Tag und Nacht, mit Scheinwerfern);
   - 30-s-Fahrclip je neuer Klasse;
   - fps-Tabelle.
5. **Kritiker:** am Ende ein blinder Sub-Agent auf dem Kontaktbogen.

**Grenzen:** Kit-Assets as-is (V-574). Kein Merge. Private Dateien nie öffentlich. **Meldung:** `ws1/audits/VEHICLES_R1.md` + Kurzstatus an WS0.
