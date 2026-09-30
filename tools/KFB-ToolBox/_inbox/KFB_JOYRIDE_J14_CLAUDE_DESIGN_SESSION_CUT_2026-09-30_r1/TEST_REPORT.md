# TEST_REPORT · J14 · Session Cut 2026-09-30 r1

Nur ausgeführte Tests heißen PASS. Headless = dieselben Dateien in der Sandbox, three 0.160 (esm.sh), dt 1/60 s, ohne Grafik. Vorschau = Claude-Design-Vorschau (schwache GPU).

| # | Test | Wo | Ergebnis | Beleg |
|---|---|---|---|---|
| T1 | K2B vs K2: FLOW/FEEL/ASSIST byte-gleich, Diff nur Δ1/Δ2 (+11/−5 Zeilen) | Skript | **PASS** | RETURN.md Zeile 1 |
| T2 | Runden-Gate P1a automatisch (W+Shift, Spurhilfe 1 / 0,8; K2 pur 1) | headless | **PASS** · K2B 86,38 s / 86,75 s, K2 86,35 s · 6 Absprünge, 6 Landungen, 0 Rettungen, 0 Bande | evidence/j14-round-gate.lap.json |
| T3 | Runden-Gate in der Vorschau (Knopf „Runde“) | Vorschau | **PASS** · LAP 2 erreicht (Uhr = Wandzeit bei 7–19 fps) | evidence/screenshots/j14-lap-end.jpg |
| T4 | Core-Pads kompilieren (compileRecipe A + J14_PADS, runChecks) | headless | **PASS** · 25 Checks, 0 Fehler, pad_level 0,0001 m, Fingerprint 840a0a2e gleich | evidence/j14-pads.core.json |
| T5 | Begehbarkeit ableiten | headless | RUN (DERIVED, kein Soll) · 65,8 % begehbar | evidence/j14-walkability.derived.json |
| T6 | Rig-Kompatibilität ActionFigure ↔ Rig_Medium | headless | **PASS** · 23/23 | evidence/j14-clip-selection.json |
| T7 | Rig-Kompatibilität Black Knight ↔ Rig_Large | headless | **PASS** · 23/23, Ruhelage = Large | evidence/j14-actors.json |
| T8 | Probe A Walk→Auto→Walk (I-Taste, Ablehnung in Fahrt, Leer = Hüpfen), beide Figuren | headless | **PASS** · 2 Aus-, 1 Einstieg, 1 Ablehnung, Parkbeleg P1 | evidence/j14-probe-A*.trace.json |
| T9 | Probe B Sprung/Landung + Sprint-Messung, beide Figuren | headless | **PASS** (Zustände) · Sprint **UNPROVEN** (Rutschen 1,13 m/s) · Knight: Rückwärts/Seitlich abgelehnt (UNMAPPED) | evidence/j14-probe-B*.trace.json |
| T10 | Probe C Luftstück + geführtes Parken + Wendestelle, beide Figuren | headless | **PASS** · Absprung/Landung + Kamera, P1, Wende ein/aus | evidence/j14-probe-C*.trace.json |
| T11 | Proben A/B/C sichtbar, Ein-/Aussteige-Schnitt beide Figuren | Vorschau | **PASS** (Sichtprüfung) | evidence/screenshots/j14-0*.jpg |
| T12 | Secret-Scan (8 Muster) über alle Textdateien | Skript | **PASS** · 0 Treffer | EXPORT_MANIFEST.json |
| T13 | Keine Datei > 2 MB im ZIP | Skript | **PASS** · 2 Dateien geteilt | EXPORT_MANIFEST.json |
| T14 | Clean-Run gegen das entpackte ZIP | headless | **PASS** | unten |
| — | Bildrate auf Georgs Gerät | — | NOT_RUN (Georg: ~10 fps, ruckelig) | — |
| — | Browser-Start aus dem entpackten ZIP | — | NOT_RUN | — |
| — | Sitzmaß Auto-PASS | headless | FAIL · Sedan 1,69 m, Kopf sitzend 1,53 m über Hüfte | evidence/j14-clip-selection.json |

## T14 · Clean-Run (Kandidat entpackt, headless) · **PASS**
- 96 Dateien, keine > 2 MB · CHECKSUMS 95/95 stimmen, keine ungelisteten Dateien
- Teile zusammengesetzt: `p1a-j14.stream.json` und `Fingerprints01_3K.png` SHA-256 = Original
- Laufzeit-Closure ab Entry Point (40 Dateien) vollständig · alle JSON parsen
- 7 Module aus dem ZIP importiert (k2b, walkability, travel-core, headless-probe, walk-controller, locomotion-profiles, anim-map)
- Begehbarkeit aus dem ZIP-Stream: 65,8 %, 2 Pads · Runde K2B aus dem ZIP: 86,38 s, 6/6 Sprünge, 0 Rettungen = Referenz
- Danach nur TEST_REPORT, EXPORT_MANIFEST und CHECKSUMS neu geschrieben; Checksummen des finalen ZIP erneut geprüft.
- Nicht geprüft: Browser-Start aus dem entpackten Ordner (NOT_RUN), Remote-Abhängigkeiten offline (siehe SOURCE.json).
