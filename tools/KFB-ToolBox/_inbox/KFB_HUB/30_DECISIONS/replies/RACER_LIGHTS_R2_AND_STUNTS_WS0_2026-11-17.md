# Für WS0 · Racer Licht R2 und späterer Stunt-Baukasten
17.11.2026 · WSA Racer · Owner georg-doc/KFB-Stunt-Car-Race / racer/vehicle-profiles-r1 · Draft PR134.

## Übernahmefähig als Kandidat
Head00d8f6756b0f78f909288219c9728b23e10f48e3, Implementierungscheckpoint88f79a9ca873b7d0d0ab2597818303d687f51c09.
[Return und Grenzen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/00d8f6756b0f78f909288219c9728b23e10f48e3/docs/vehicle-lights-r2/RETURN.md).
[PR134](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/134).

Bestehender src/look/headlights.js bleibt Owner. `hlt=apex` wählt zwei echte originale Apex-Nachtspots; Main-Standard cone unverändert. Quellanker am Vireo, vorhandene KFB-Frontanker, vorhandenes Glas-Glühen. Im neuen Modus keine alten Kegel/Pools und keine zusätzlichen Geländeproben.0Spot-Schattenkarten; optionaler Unterboden standardmäßig aus. Vireos vorhandenes brake_light bleibt allein beim nativen CarModel. Dieselpunk-Rücklichtanker sind unbestätigt; bitte reale Modellanker/Materialien liefern.

Native Tests: Fahrzeuglicht PASS, Host15AnkersätzePASS, Profilanschluss11/11PASS. Unabhängiger Critic/Guard CONTINUE und eigene native Wiederholung. Reale Racer-Prüfung:4×300Physikschritte, beide Wagen, Tag/Nacht und wiederholter Wechsel, jeweils1Wagenkörper/2Spots,0Fehler/Verletzungen; Vireo-Bremsintensität3.5. Keine eigene Main-Kampfbühnen-Lichtfahrt und keine zertifizierte Geräte-FPS-Abnahme behauptet.

Lokaler Main-Kandidat basiert weiterhin auf dem aufgenommenen ae47752; zuletzt gelesener Stamm b28f132 wurde nicht still eingemischt. Vor Aufnahme aktuelle Änderungen abgleichen. Kein Main-Merge/Live-Promote.

## Private Site und Belege
[Spiel und Werkstatt](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project.html), Version14, Sourcee73f5a14198a2fb7eb1ac838485db9b05d33f1ff, Revision2026-11-17.10. Deploymentappgdep_6afc1b24a61c8191b12f49f113b74683 erfolgreich; exakte Host-Dateien/Spielbundle zurückgeprüft. Audience weiterhin nur Owner.
[Lichtprüfung](https://kfb-racer-open-world.frizzlebob.chatgpt.site/lights.html) · [Rohdaten](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project/lights-r2/site-suite.json) · [Nachtbild](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project/lights-r2/site-diesel-night.png).
Die Fahrprüfung war lokal mit demselben Quellstand; keine authentifizierte Remote-Fahrprüfung.

Messphase2 ist diagnostisch abgeschlossen: [Return5253ecb](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/5253ecbe99969e02bf760fc7ee94891585fae713/docs/racer-measure-r2/RETURN.md). Geometriebytegleich, redundante Höhenabfragen halbiert. Unterschiedliche Fahrspuren und unkontrollierte GPU-Last verhindern eine kausale FPS-/Prozent-Zusage. Große Nachladespitzen weiter offen.

## Georgs spätere Folgearbeit
[Joyride-/Blender-Stunt-Baukasten: Quellen und Vertrag](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/fc558813f4e99a83d985a91de87480548af4822b/docs/racer-roadmap-r2/STUNT_KIT_ASSESSMENT_2026-11-17.md).
Core v0.12 enthält CREST/DIP, KICKER–AIR–LANDING, Bank und 3D-LOOP. K2B hat capture/commit/release als Ausgangspunkt. Patch deaktiviert Radkontakt bei up.y≤0.05; Looping braucht einen begrenzten Kontakt-/Haftadapter statt nur Mesh-Import. Core-Schwerkraft15 ist Konstruktionsmetadata, keine Anweisung die gemeinsame Welt umzustellen. Mehrstöckige Stunts brauchen 3D-Support statt allein heightAt(x,z). Fertige Blender-.blend-Bibliothek noch nicht verifiziert.

Spätere Reihenfolge: Rampe/Kuppe, vollständiger Sprung mit Landefläche, Stunt-Nebenroute, danach Loop. Ein Core, ein Renderer/Welt-/Car-Owner; komplette Sequenz vorladen und bis nach Landung halten. Noch kein Stunt eingebaut.

## Nächster Gate
WS0 prüft den optionalen Main-Lichtmodus und liefert echte Dieselpunk-Rücklichtanker. Autorisierte Hauptgame-Straßenaufnahme, ein Fahrzeugturm, Patch-Flug und bestätigte Fluggegnerquelle bleiben offen. Keine Prioritätsverschiebung durch den ausdrücklich späteren Stunt-Baukasten.
