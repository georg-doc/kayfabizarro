# Für WS0 · erster Wagenruf auf gestreamtem Gelände repariert ·17.11.2026

Die zuvor offene Startlücke des Profil-Kandidaten ist auf dem geprüften Kampfbühnen-Pfad geschlossen. Beide Wagen warten beim ersten Ruf auf den echten Terrainkörper und landen ohne zweiten Ruf/Reset. Bitte den kombinierten Kandidaten im bestehenden PR134 prüfen; der separate Audio-CI-Konflikt bleibt offen. Georg muss keine Dateien zusammensuchen.

Repository `georg-doc/KFB-Stunt-Car-Race`, Branch `racer/vehicle-profiles-r1`, finaler HEAD **`0ac9bfd102f41967906a5efb77d512175bc81a21`**. Aktueller Stamm `fbe7f57395d31aca59765b01a62666629c599cf9` ist in den Kandidaten aufgenommen. Stamm unverändert, kein Merge/Live/Site-Publish.

[PR134](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/134) · [Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/0ac9bfd102f41967906a5efb77d512175bc81a21/docs/terrain-start-r1/RETURN.md) · [Guard](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/0ac9bfd102f41967906a5efb77d512175bc81a21/docs/terrain-start-r1/GUARD.md) · [Quellstand](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/0ac9bfd102f41967906a5efb77d512175bc81a21/docs/terrain-start-r1/SOURCE_LOCK.json) · [Tests und Bilder](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/0ac9bfd102f41967906a5efb77d512175bc81a21/test/evidence/terrain-start-r1).

## Reparatur und Anschlüsse

Der feste Ruf-Timer ist kein Bereitschaftsnachweis. EndlessDrive bleibt einziger Terrain-Colliderstream und bestätigt seine tatsächlich installierten Rapierkörper/Blattrevisionen. `supportLeafAt` schließt alte/gewechselte Blätter aus. `TERRAIN_SUPPORT` ist ein Leseanschluss dieses Hosts: Mitte plus vier gedrehte Radpunkte, nur eigener Terrainkörper, gültige Normale, zwei gleiche Revisionen. Erst dann erzeugt M2Car seinen einen bestehenden Wagen. Eine abgesackte Startabsicht wird vor der Erzeugung über die echte Unterstützung gesetzt. Anfrage-/Providerwechsel und Abbruch räumen identitätsgesichert auf; keine verspätete Freigabe, kein Ersatzboden, kein neuer Physikschritt.

Dateien: `src/m2/terrainStart.js`, `TerrainCarStart` in M2Car, `src/world/terrainSupport.js`, EndlessDrive und der kleine Read-Adapter in endlessTerrain. Vorhandener PatchCar/HF/ST, Handling, Kamera und Input bleiben erhalten. Andere Bodenbesitzer wie bewusst ausgeschnittene Plattformen/Brücken benötigen eine explizite Supportpolicy; fehlender Boden wird nicht nach Timeout als vorhanden ausgegeben.

## Nachweis

- Unabhängige native Bereitschaftstests **11/11PASS**: fehlende/verzögerte/veraltete Unterstützung, Löcher/Teilunterstützung, Fremdkörper/Sensor/Dynamik, ungültige Revisionen, Cancel/rascher Wechsel, Nicht-Endlos-Passthrough. Beide realen Profile:180Warte-Schritte ohne Wagen, danach genau ein Körper, gleiche Körperidentität, Weiterfahrt ohne Reset.
- Vier echte frische Weltstart-Rufe auf der Kampfbühne **4/4PASS**, beide Profile zweimal:185/187/186/96Prüfungen bisFreigabe, jeweils1Ruf/1Summon/0Reset/1Body/4Radkontakte/errors[]. Die letzten beiden Fälle laufen mit der finalen Revisionstoken-Prüfung. JS-/Rapierwelt und lokaler Testspielstand frisch; HTTP-Cache nicht geleert. Zusätzlicher Saved-Position-Neustart separat, nicht in den vier Fällen.
- Bisherige portable Profilprüfung **11/11PASS**; Flags/Hostvertrag/WhitespacePASS. Split-Build4978Module/1m19sPASS (vor der danach separat nativ+Browser geprüften Tokenvalidierung).
- [CI44025839446](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44025839446) auf Quellen-/Teststand`820062b600592c6cf2535b8277e28d587195ed52`: **154/155PASS**, neue Startprüfung und ProfilePASS. EinzigerFAIL `audioMixer:noAudioInRepo`, bestehender Basisfehler. Keine CI-Ausnahme; Gesamt-CI bleibtrot. Abschlusscommit enthält nur Doku/Metadaten.

## Nachfolgende Integration und Erweiterungen

[Priorisierte Empfehlungen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/0ac9bfd102f41967906a5efb77d512175bc81a21/docs/terrain-start-r1/NEXT_STEPS.md): zunächst Profile+Startreparatur, Straßenmodul und zentrale Untergrund-/Boden-VFX-Anschlüsse aufnehmen. Claude-toy/gummi-Reaktion ist weiterhin eine Owner-Entscheidung (derzeit lossApplied0), Badewanne ein weiteres Datenprofil. Performance erst an reproduzierbarer Fahrt/Kampf messen.

Flug: Elan/racerFlight existiert am **K2B**-Weg; der neue **PatchCar** meldet nochfly:false. Für Dieselpunk daher vorhandene Fluglogik an denselben Rapier-Wagen anschließen und Start/Landung/Geländeübergänge prüfen. Keine zweite Positions-/Kameralogik.

Fahrzeugtürme: sinnvoller nächster Prototyp wäre ein drehbarer Blaster auf Crimson plus drei Würfelziele. **WS0** verantwortet gemeinsame Combat-/Travel-/Audioverträge und Aufnahme; **Racer hier** Fahrzeugadapter und spielbare Kampfbühnenproben; **Blender** KFB-Modell/Material/LOD, Befestigungspivot und Mündungsanker. Vorhandene CombatTargets-/Waffen-/VFX-/SFX-Besitzer wiederverwenden. Dann bewegte Dummies hinzufügen. Die Fußgänger-Armsperre im Auto nicht pauschal entfernen. Kein Turm/Flug in diesem Reparaturslice gebaut; Patch-Spendermodell erst nach konkreter Quelle/Lizenz und isolierter Ansicht.

**Ein nächster Schritt:** WS0-Review des kombinierten Kandidaten und bestehende Audio-Sperre beim Audio-Owner klären, anschließend Aufnahmeentscheidung. Kein automatischer Merge.
