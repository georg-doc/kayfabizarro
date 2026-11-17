# WSA Racer an WS0 · Hecklicht und RKIT0.16.10
17.11.2026 · begrenzter Kandidat, keine Hub-Karte/Live-Promotion erforderlich: Produktadresse und Routing unverändert.

## Ergebnis und geprüfter Stand
Repository georg-doc/KFB-Stunt-Car-Race, Zweig racer/vehicle-profiles-r1, Draft [PR134](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/134), verifizierter HEAD 9531ecfdcb66913de2ee6ae553b2aaa34e42cd27.
[Hecklicht-Return mit Tests/Dateien](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/9531ecfdcb66913de2ee6ae553b2aaa34e42cd27/docs/rear-lights-r1/RETURN.md) · [Core-Return und HOST-Anschluss](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/9531ecfdcb66913de2ee6ae553b2aaa34e42cd27/docs/track-core-intake-r1/RETURN.md).

Private [Racer-Site](https://kfb-racer-open-world.frizzlebob.chatgpt.site), Version15, Quelle8225e171c78de6b69aa957fe134abf2cdd48d0ab, Deployment appgdep_6afc2b5b3c148191a1d537cfc9768c60 succeeded. Owner-only unverändert; exakter Host liefert Revision2026-11-17.11 und identische Spiel-/Hecklicht-Bundles. [Werkstatt](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project.html), [Original-Heckmontage](https://kfb-racer-open-world.frizzlebob.chatgpt.site/rear-lights.html), [Fahrprüfung](https://kfb-racer-open-world.frizzlebob.chatgpt.site/brake-lights.html).

## Hecklicht
Crimson-Original einzeln angesehen: zwei sichtbare Lampen, keine separaten Original-Material-/Metadatenanker.84vermessene vorhandene Quellflächen bekommen eigene rote/emissive Schicht, originaler GLB/Mesh/Material/Textur bleiben unverändert. Neu zugewiesene Bremsfunktion ausdrücklich Adaptation. Ein Zusatzdraw, keine neue Lichtquelle/Schattenkarte. Schlusslicht Tag/Nacht; Vorwärts-/Rückwärtsbremsen/Handbremse; Rückwärtsgas allein bleibt ohne Bremslicht. Funktioniert bei Frontlicht aus. Vireo-Owner bleibt allein;13weitere KFB-Hecks noch unvermessene Fälle.
Anschlüsse: src/look/rearLampSurfacesR1.js, src/data/vehicles/rear-lamp-surfaces.r1.json, vorhandene headlights.js/M2Car.jsx/racerRig.js. Quelle/Hash und vermessene Punkte im Return/SOURCE_LOCK.

## Track-Baukasten
Zuerst aktuelle HANDOVER_WSA_RACER gelesen, RKIT-Head e173b733227930bc706bccd792018888c8fa9984.39trackcore-Dateien unverändert in src/vendor/track-core-0.16.10; Coreblob ec1400981b1bba5e426da38fd880633a49e80d27. CORE_VERSION0.16, Releasepin0.16.10. Vollständige Dateiliste in SOURCE_LOCK. RKIT bleibt Owner, Änderungen über WS0. Keine Lieferdatei repariert.
Racer verwendet neue Kopie über bestehende Adapter. Main enthält nur Bibliotheksvorrat, keine Main-Straßen-/Terrainaufnahme. Straßen-Core0.12 im Racer nur noch Regressionstest-Fixture.
Neuer verfügbarer Baukasten: LEVEL_RAMP/BERM_CURVE, korrigierte Deckgore/U-Turns, Spiral-/Kamera-Abstandschecks. Kein neuer Stunt eingebaut. Blender-Quellen sind Stadtmauer-/Rand-/Bogen-Builder/Teiletabellen, kein fertiges .blend-Stuntpaket.

## Tatsächliche Tests
- Native Heckflächen8PASS; Main-Host cone/apex PASS; Profile11/11PASS. Main Split-Build4985Module PASS, Site134Module PASS.
- Main echte Kampfbühnenfahrten Rennwagen/Dieselpunk je600Schritte: gültiger Start,1Wagenkörper,0Verstöße/0Appfehler, Bremslicht bei Front an/aus.
- Racer nach Core-Aktivierung3×600: CrimsonTag/VireoNacht/CrimsonNacht,0Verstöße/Fehler,1Körper/2Spots ohne Schatten, Endzustand0.16.10. Rohdaten im Hecklicht-Return.
- Eigene tatsächliche Racer-Rezepte gegen explizit gepinnten0.12-Core:16284Samples,280gleiche Geometriearrays,2646Surface-/Cut-Fill-Abfragen PASS.14bestehende Straßen-Hostfälle PASS mit neuem Core.
- Lieferant12Suiten:11exit0, test-v015exit1 ausschließlich alte0.15-Versionsassertion. Vollständige unveränderte Logs im Core-Return; keine Alles-grün-Behauptung.
- Read-only Critic/Guard CONTINUE. Browserbelege vom Builder erzeugt und unabhängig gelesen; keine eigene Critic-Browserfahrt oder zertifizierte Geräteperformance.

## Naht und nächste Schritte
Main-Testfixture wartet das frische Dokument, report.called und vorhandene Positionswiederherstellung ab; einmaliger Bühnenruf über bestehenden M2.setKind. Keine Produktions-Spawnänderung und kein neuer Kaltstartbeleg. Frühe Bühnenruf-/Save-Restore-Reihenfolge separat beobachten. Lokale Testbasis ae47752, zuletzt Stamm4a1e2b1c gelesen; kein stiller Rebase/Merge.

Nächster Gate: WS0 nimmt die zusätzlichen Lichtdeltas am aktuellen Stamm auf und bindet das gemeinsame Straßen-/Geländemodul an endlessTerrain an (ein Linien-/Surface-Owner, bündige Schneise, Randobjekte ausschließlich kfb-curb). Racer-Aufnahme ist kein Beleg für Main-Aufnahme.
RKIT erhält echte Fahrzeugmaße: [vollständige Profildaten](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/9531ecfdcb66913de2ee6ae553b2aaa34e42cd27/docs/track-core-intake-r1/evidence/RKIT_PROFILE_DIMENSIONS.json): Vireo sichtbar2.072×1.383435×4.128m, Physik1.786×0.915160×3.8592m; Crimson sichtbar2.913487×1.780260×5.180205m, Physik2.300442×1.070695×4.773925m, Scale0.616381042. Fahrer/Zubehör noch keine geprüfte Durchfahrtshülle.

Weitere offene Arbeit bleibt im Living State: andere Heckmodelle vermessen; bestehende gemeinsame Bodeneffekt-Ebene/Badewannenprofil; autorisierter modularer Turm und Patch-Flug; bestätigte Fluggegnerquelle noch ausstehend. Stunts später: Rampe/Übergang → Kicker–AIR–Landung anhand tatsächlicher Ballistik → Steilkurve → Loop mit Kontakt/Haftung. Core-Konstruktionswerte sind keine Fahrzeugphysikvorgabe. Kein Mensch-Look-/Sound-PASS behauptet.
