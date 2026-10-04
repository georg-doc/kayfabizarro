# WS1 · Cartoon Vehicle Deformer + Motion Lab · aktueller Review-Stand

Stand 18.09.2026. Kuratierter Vehicle-Lab-Slice aus dem Komplett-Export
`KFB Vehicle + Rigging + Animation Lab(3)`.

Dieses Paket enthält die aktuelle Werkbank, die aktiven `lab-v7`-Module, die zugehörige
Dokumentation und ausgewählte Belegbilder. Asset-Bibliotheken, historische Lab-Fassungen und
Upload-Duplikate werden nicht erneut eingecheckt; ihre kanonischen Quellen liegen bereits im Repo.

## Aktueller Funktionsumfang

- 46 Vehicle-Fixtures: 43 aus dem bisherigen Handoff/Registry-Satz plus drei Space-Base-Fahrzeuge.
- Cartoon-Deformer mit Telemetrie-Eingang, Springs und getrennten Presentation-Knoten.
- Schlingern/Fishtail mit Gegenlenkung und nachlaufendem Gegenroll.
- Rückwärtsfahren, Rückwärtskurve, berechnetes Mehrzug-Wenden und Einparken.
- Zwei-Rad-Fahrt frei sowie an einer Bande.
- Fassrolle mit wandernder Drehachse und auf ganze Umdrehungen gerundeter Landung.
- Drei Fahrweisen: Chill Ride, City Parcours und Freeroam.
- Profile für leichte Fahrzeuge, Board/Rider, Heavy, Space Hauler, Trailer und Mech-Kandidaten.

## Einstieg

```
KFB Cartoon Vehicle Deformer Lab.dc.html   aktuelle Werkbank
lab-v7/                                    13 Module und Datendateien
docs/CHANGELOG.md                          vollständige additive Zeitachse
docs/LIVING_VEHICLES.md                    Entscheidungen, Messwerte und offene Punkte
docs/PLAN_vehicle_vfx_flightmode.md        nächster VFX-/Flugmodus-Schnitt
docs/SOURCE_RECEIPT_2026-09-18.md          Herkunft und Importgrenze
belege/                                    ausgewählte Screenshots
```

Die Werkbank benötigt Netz, weil sie Three.js und die gepinnten Modelle aus
`georg-doc/kayfabizarro` lädt.

## Geprüfter Importstand

- Alle `lab-v7/*.js` bestehen die JavaScript-Syntaxprüfung.
- `TEST_SEQUENCES.json` und `deformer-profiles.json` sind gültiges JSON.
- Browser-Kaltstart: Hatchback geladen, vier Räder erkannt, keine Browserwarnungen.
- Rückwärts- und Drei-Zug-Wendemanöver starten und liefern Telemetrie-/Deformer-Signale.

Das ist ein **getesteter Lab-Stand**, noch keine freigegebene globale Fahrphysik. Der jeweilige
Host besitzt Welt, Kollision, Kamera und Fahrzeuglage; das Lab liefert Rigging, Presentation,
Manöver-/Motion-Kandidaten und den Telemetrie-Adapter.

## Vorgeschlagener erster Consumer

Für den Free-Roam-MVP zuerst genau einen regulären KayKit-Character mit EyeRig und ein
repräsentatives Fahrzeug in einem OSM-Testgebiet verbinden:

`zu Fuß → einsteigen → fahren → rückwärts/wenden/einparken → aussteigen → Zustand erhalten`.

Ehrenfeld oder Hürth kann dabei der Terrain-Consumer sein. Combat bleibt außerhalb dieses ersten
Slices. Die weiteren Character-/Rig-Klassen werden anschließend über dieselbe Abnahmematrix
ergänzt, ohne einen zweiten Movement- oder Vehicle-Owner einzuführen.
