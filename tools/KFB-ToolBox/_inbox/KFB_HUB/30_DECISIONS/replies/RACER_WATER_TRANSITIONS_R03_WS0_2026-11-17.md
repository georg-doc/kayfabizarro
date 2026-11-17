# Für WS0 · WSA Racer R03 · Wasser-/Flussübergänge · 17.11.2026

**CANDIDATE_TESTED_PENDING_WS0.** Die fehlende Patch-Wasseranbindung und konkrete Lebenszyklusfehler der vorhandenen Hydrologie sind repariert. Keine zweite Physik-, Gelände-, Wasser- oder Combat-Instanz. Bitte als begrenzten Kandidaten prüfen/übernehmen; keine automatische Main-/Live-Freigabe.

- Owner: georg-doc/KFB-Stunt-Car-Race
- Branch: racer/shared-roads-main-r1
- Verifizierter Dokument-/Branch-HEAD: ec555e47473b19b49385a4b846cc80c3960f1c5e
- Getesteter Laufzeit-Code: a3f5d88a42362b378cdd9abd396925af47f1a19c
- Qualifizierter QA-Selektor: 8c7f7276fafeb5e40a97f11fc65846527ea14ac2
- [Draft PR139](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/139)
- [Vollständiger Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ec555e47473b19b49385a4b846cc80c3960f1c5e/docs/water-transitions-r03/RETURN.md)
- [Messwerte und Rohberichte](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ec555e47473b19b49385a4b846cc80c3960f1c5e/docs/water-transitions-r03/evidence/SUMMARY.json)
- [HOST_CONTRACT](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ec555e47473b19b49385a4b846cc80c3960f1c5e/docs/water-transitions-r03/HOST_CONTRACT.md)

## Ergebnis

Beide Originalmodelle Vireo/Crimson auf dem bestehenden Patch-Kern, tatsächlicher water=1-Worker/Shader, Seed20261014: **10/10 Browser-Szenarien bestanden**. Fluss, quellpegelqualifizierter See vorwärts hinein/rückwärts hinaus, laufende Nachladung über Kachel-/Wasserfenstergrenze und Rückkehr. Finale Rückkehr jeweils4Räder/dry,0erfasste Bodenverletzungen/Window- oder Konsolenfehler. Je373reale Straßenproben ohne Wasser. Geprüfte Naht x=-1536: Pegeldifferenz0m; kein Fall an dieser Naht. Aktive Streaming-Arbeit während53/66Grenzmesspunkten.

Spieltakt Spielzeit/Uhr (keine festen Uhr-Wartefahrten):

| Wagen | Fluss | See | Kachelwechsel | Rückkehr |
|---|---:|---:|---:|---:|
| Rennwagen |0,535|0,985|0,557|0,491|
| Dieselpunk |0,693|0,857|0,565|0,499|

Kalter Prüfvorlauf wartet zusätzlich auf tatsächliche Wasserfenster/passende Orte:133,49/107,12Uhrsekunden bei0,149/0,286Takt. **Keine R02-Startlatenz und kein Vergleich identischer Leistungsstrecken.** Lange Vorbereitung und niedriger Takt bleiben offen.

## Änderungen

- src/m2/patchWaterDrive.js, M2Car.jsx: bestehender waterAfter/waterGround-Kern als Impulse am selben Wagenkörper, bestehende M2EVENTS/createWaterFx und Wasser-Kamera-Daten. Dry-Trajektorien beider Profile exakt unverändert im nativen Vergleich.
- hydroEndless.js: ausgeschiedene queued/sampling/waiting-Fenster entfernen, veraltete Antworten ignorieren.
- hydroWater.js: vollständigen sichtbaren Bestand bis Ersatz behalten, erste Flüsse vor wartenden Seerastern, nahe Seen priorisieren, veraltete Jobs abbrechen, Fluss/See/eigene Pegeltexturen genau einmal freigeben; Live/Pending-Überlappung geschützt.
- endlessTerrain.js: ausschließlich read-only Fallmetadaten für Diagnose ergänzt.
- Erzeugte Wasserkerne, Worker, Terrain-Startschutz, Straßen-/Kollider-/Weltbesitzer unverändert.

## Tests und Grenzen

[CI44162938061](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44162938061): **166/166 grün** am Laufzeit-Code a3f5d88a. Native Patch-Wasser12/12 und Streaming8/8 einschließlich Gegenproben. Mehrdatei-Build grün,40,20s. Rohbelege/Screenshots im Return-Verzeichnis. Alter nominaler Rennwagen-Seeort war falsch zugeordnet, ausdrücklich verworfen; Selektor korrigiert und Rennwagen vollständig wiederholt. Kein Runtime-Fix aus dem falschen Ort behauptet.

Kein neuer unabhängiger Critic/Guard-Produkt-PASS, keine GPU-/Zielgerätefreigabe. Andere Seeds, fünf aufeinanderfolgende Nähte, Fälle/Meer und normale Unterwasserkamera nicht neu abgenommen. R02-Start-/Teleportleistung und Einzeldatei-Packaging weiter offen. Main cf20cdd6c302a3c1533f84995f9684cbf6740f67 separat; kein ungetesteter Main-Merge. Private Site16 unverändert; PR134Boost/Licht separat.

## Ein nächster Schritt

WS0 prüft/übernimmt diesen Kandidaten auf die gemeinsame Abnahmefläche, danach R04/S01 Fahrgefühl/Controls. Georg muss nichts vorbereiten.

[Turm-Vorlauf](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ec555e47473b19b49385a4b846cc80c3960f1c5e/docs/water-transitions-r03/TURRET_INTAKE.md) aufgenommen: originales WSB-Bündel assets/wsb-* abwarten, zuerst Crimson. Fahrzeugadapter für Sitz/Zielen/Grenzen/Einfahren/Rückkehr, gemeinsames Kampfsystem für KFB_Muzzle/Schuss/Treffer/VFX/SFX. Kein Platzhaltermodell und keine tatsächliche Lieferung behauptet.
