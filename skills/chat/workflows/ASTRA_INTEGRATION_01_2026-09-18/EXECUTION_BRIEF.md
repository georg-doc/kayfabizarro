# KFB Integration 01 · Ausführungsbrief r3

**Status:** ACTIVE CONSOLIDATED BRIEF · WORLD REVIEW COMPLETED · WORLD/TRAVEL/WALK USER SCOPE EXPLICIT · EXECUTION NOT STARTED.
**Ersetzt:** r2, unverändert unter `archive/pre-travel-scope-r2.1/EXECUTION_BRIEF.md`; r1 unter `archive/r1/`. Ein Auftrag, keine konkurrierenden Ergänzungsaufträge.
**Ziel:** zwei gleichrangige nutzbare Produktpfade: **A Race/BOX1** und **B KFB World/Travel→Walk einschließlich Authoring**. WR01–WR07 bleiben eingearbeitet; §0 korrigiert auf Georgs ausdrücklichen Auftrag die vorherige Verengung des World-Scope auf Quellenstart und Lorekeeper-Import. Bestehende humane Gates, Owner und Produktidentitäten bleiben erhalten.
**Auslieferung:** echte ChatGPT-Site UND KFB-Cloudflare gemäß `DELIVERY_CONTRACT.md`; kein githack/Ersatzhost. Fehlende Zielfähigkeit offen ausweisen. r2.1-Delivery-Regeln haben Vorrang vor historischen Preview-Fallbacks.

## 0 · Verbindlicher World / TinySkies / Travel → Walk Kernpfad

### 0.1 Produktumfang, nicht ein zusätzlicher Referenzlink

**B = dieselbe belebte KFB-Welt aus Reise-, Fußgänger- und Authoring-Perspektive.** Terrain/Environment und Movement sind eigene Pflichtnachweise. BOX1 ist nicht das Dach für diesen Strang. Ein Atlas-Prefab auf einer neutralen Fläche, ein Link zum alten Globe oder getrennt gestartete Flight-/Walk-Demos erfüllen B nicht.

Zusammenhängender Nutzungsablauf:

`Hub → tatsächliche Travel-Welt → Flight erkunden → Ort auswählen/annähern → geeigneter Ground-Einstieg → Walk/Run/Turn/Strafe → Jump/Air/LAND → Pfad/Schwelle/Resident erreichen → zurück FLIGHT → BUILD/GOD/PLAY nutzen → Save/Export → Reload/Import → gleiche authored Welt und ausgewiesener Reise-/Moduszustand → Hub`.

Das ist der Produkt-/Integrationsnachweis. Es behauptet weder heute implementiertes Landen/Aussteigen noch eine neue Cinematic-/Mount-Animation. Ausgangspunkt ist die **vorhandene explizite WB0-Modusbrücke**, nicht eine zweite Bewegungslösung. Ein vorhandener UI-Moduswechsel darf zunächst genutzt werden; Lage-/Heading-/Support-/Input-/Kamerafortsetzung muss dabei tatsächlich funktionieren. Eine inszenierte Landung oder der Austausch des Reisevehikels wird nur mit konkreter Quelle/Freigabe hinzugefügt und separat bezeichnet.

### 0.2 Drei zusammenhängende World-Arbeitsteile in Integration 01

| Arbeitsteil | Sichtbares Ergebnis / Mindestnachweis | Was nicht als Erledigung zählt |
|---|---|---|
| World-/Terrain-/Lookbasis | Reale organische sphärische Travel-Welt mit gekrümmtem Horizont, lesbaren Höhen/Flächen, Land-/Wasser-/Küsten-/Strandbezug, Vegetation/Props, Landmarken und kohärentem Himmel/Licht. Vorhandene Terrain-/Water-/Atmosphere-Ports erhalten bzw. konkrete Fehler gezielt reparieren. In Flight und bodennaher Kamera denselben Ort prüfen. | Glatte Ersatzkugel, neutrale Stage, TinySkies-Link oder vier Terrain-Konzeptscreenshots statt ausführbarer Welt. |
| Travel ↔ Walk / Movement | Flight annähern → sicherer Ground-Einstieg → Idle/Walk/Run/Turn/Strafe/Jump/Air/LAND mit sichtbarer Bewegung → Rückkehr in Flight. Position/Heading/Support, Kamera/Orbit, Input/Fokus und FX-/Audio-Lebenszyklus über Moduswechsel erhalten. | Boot zweier Szenen, eingefrorene Pose gleitet weiter, zwei Root-/Kameraschreiber oder Flight-Speedlines am stehenden Fußgänger. |
| Welt authoren und bewohnen | BUILD/PLAY/GOD im selben Weltkontext; Terrainbezug, Objects, ROAD/Spline, lokale BlockBits/Rampenkandidaten, bestehende Atlas-Kompositionen und nichtdestruktive Materialkalibrierung; Save/Reload/Import in der tatsächlich spielbaren Welt. Lorekeeper/Hex/ROAD ist der konkrete erste Ensemble-Nachweis, nicht die ganze Welt. | Palettenimport, bloßes JSON-PARSING oder nur ein hübscher NPC ohne erreichbare World-Platzierung/Restore. |

Keine neue Mikro-MVP-Leiter und kein achtfacher Neubau. Astra darf intern bündeln, soll aber **für jeden dieser drei Teile** Implementierung, Tests, Nutzerurteil und offene Naht ausweisen. Ein fehlendes Pflichtstück lässt Pfad B PARTIAL; Race-Erfolg kompensiert keine fehlende Travel-Welt.

### 0.3 TinySkies-Terrain und World-Identität

Aktueller KFB-Travel-Code bleibt Receiver/SSOT. TinySkies ist benannter Donor/Benchmark: `dannylimanseta/tinyskies`, bestehender Referenzpin `2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`. Dessen `client/src/game/`-Baum ist am Pin erreichbar; Dateibestand ist **keine** neue KFB-Funktions-/Browserabnahme. Vorhandene KFB-Ports zuerst lesen, nicht den kompletten Upstream/Multiplayer-/Server-/Endgamestack übernehmen.

Im tatsächlichen World-/Terrainpfad prüfen: sichtbare Höhenprofile/Hügel/Täler/Berge und für Bodenbewegung geeignete Flächen; Wasserstand/Küste/Strand mit eindeutiger Land-/Wassergrenze; Vegetation, Wind-/Wasserbewegung und Landmarken; kohärente Sky-/Sunset-/DayNight-/Light-/Tint-Antwort. Leuchtturm/Küstenlicht bleibt benannter vorhandener Donor-/Lookprüfpunkt, nicht ein neu erfundenes Birthday-Hero. Pro Feature benennen: im KFB-Host verdrahtet, nur Donor, gezielt repariert oder nicht ausgeführt. Keine pauschale „TinySkies integriert“-Behauptung.

Einheitliche Bodenwahrheit: gebackenes Travel-Netz und dessen Höhenlesung bleiben Grundlage für sichtbares Terrain, Footing, Placement und ROAD; keine nur fürs Bild verschobene Oberfläche mit abweichender Laufhöhe. World-Seed/Terrainkonfiguration/zugehörige Parameter müssen für den getesteten Ort rekonstruierbar sein. Optische Wasserkante ist noch keine Schwimm-/Bootsphysik: bei nicht unterstütztem Ground-Einstieg auf Wasser oder zu steilem Gelände kontrolliert ablehnen/letzten gültigen Ort erhalten, statt unsichtbaren Boden zu erfinden.

Der bewusste KFB-Stilmix bleibt: organisches/prozedurales Umfeld, exakte KayKit/Kenney/andere Repo-Props im Nahbereich, kuratierte Landmarken. Hexplatten optional sichtbar/eingesetzt/weg, nie globaler Terrainersatz. Terrain-/Material-/Lichtkalibrierung reversibel auf Instanzen/Consumerdaten; Originalassets nicht verändern. Vorhandene größere Terrain-/Himmelmodule nicht durch einen neuen Allzweck-Terraingenerator ersetzen.

### 0.4 Movement und Travel→Ground auf vorhandenem Code

Travel `site/world-builder/runtime-mode.js` bewahrt Flight-Methoden und schaltet in Ground auf `ground.update(dt)`; Rückgabe über `ground.toFlightPose()` und `carpet.teleportTo(...)`. Diesen Ist-Pfad verwenden und testen. `carpet.js` bleibt Flight-Owner; WB0 Ground bleibt expliziter kandidatengestützter Modusowner. Der ältere exklusive Carpet-Vertrag wird nicht still überschrieben. Ein Host, ein aktiver Bewegungswriter pro Modus; genau ein Kamerawriter, ein Actor-Mixer/Root-Pfad. Neues Movement nicht aus Race oder Arena als zweites System daneben montieren.

Ground benutzt vorhandene Ground-/Movement-Lab-/Profilquellen: Idle, Walk, Run, Dreh-/Strafe-Antwort, Jump/Air/LAND und Rückkehr zur Locomotion. Root/Heading und Clipcadence stimmen sichtbar überein; echte Rig_Medium/Rig_Large/Legacy-/Mech-Quellen behalten getrennte Profile. Fernando-/Mech-/Monstrosity-Korrekturen bleiben begrenzte aktuelle Regressionen. Ein Bindungszähler allein ist kein Bewegungsnachweis und eine geladene Legacy-Datei kein allgemeiner Kompatibilitätsbeleg.

Bei Ground Flight-Avatar/Carrier-/Trail-/Wake-/Speedlines-/Pointerlook-/Fill-Layer gezielt aus; beim Rückwechsel zuvor gültigen Zustand korrekt wiederherstellen. Gemeinsame Weltatmosphäre nicht versehentlich mit Flight-FX deaktivieren. Flight- und Walk-Kamera brauchen jeweils passende Nähe, Horizont/Up, Obstruktions- und Orbit-/Lookprüfung; die eingefrorene Town-v3-Kamerafehlrichtung nicht reaktivieren.

Test zusammenhängend und bei wiederholten Wechseln: Idle/Bewegung während Umschaltung, gehaltene und außerhalb losgelassene Tasten, Space/LAND, Mouse/Touch/Orbit, Fokus-/Visibilitywechsel, BUILD→PLAY, Save/Reload in beiden Modi. Position/Heading und beabsichtigter Höhenversatz/Footing relativ zur Körpergröße protokollieren; kein überraschender Welt-/Spawnreset, kein Restgas, keine Doppel-Mixer/Listener/Audio-Loops. Welt speichern ist nicht automatisch Spielerpose speichern: tatsächliche bestehende Pose-/Moduspersistenz auflösen, fehlenden Resume-Pfad im Travel-Owner benannt schließen oder konkret als offen melden.

### 0.5 KFB-Reiseformen und nachfolgende Orts-/Gameplay-Slices vollständig führen

| Bestandteil des KFB-Travel-Produktumfangs | Aktuelle Behandlung in diesem Integrationslauf |
|---|---|
| Bestehender Flight-/Card-Carrier-Pfad, Karten-/Portal-/World-Atmosphäre | Erhalten und passend zum tatsächlich aktiven Baselineumfang regressionsprüfen. Keine neue vollständige Physik aller in einem Upstream-Katalog genannten Vehikel behaupten. |
| Travel↔Ground, Walk/Run/Jump/LAND und Kamera | Pflicht-Consumer-Nachweis in B, nicht bloß Startlink. Bestehendes Ground-Human-Gate weiterhin respektieren. |
| FrizzleBob Bath Flight, Seat-/DriveActing-/Card-Surf-Varianten | Im Donor-/Returnstatus ausdrücklich führen. Travel-Masterplan bezeichnet Bath Flight aktuell als DEFERRED. Quellen/Profile/Look erhalten, keine automatische PR-Promotion oder Gleichsetzung mit vorhandener Card-Flight-Fahrt. Ownerentscheidung für Aktivierung und gesonderter Nachweis nötig. |
| Orte mit Pfaden, Höhle/Mine/Schloss und Resident-Signature-Props | World-Authoring muss dafür nutzbar bleiben. Lorekeeper ist Importfixture, kein Verbot größerer Ortskompositionen. Frühere Caveman↔King-Castle-Richtung ist Content-Referenz; verworfenes Town-v3 nicht in-place weiterpolieren. Größere Ausstattung nach funktionierender gemeinsamer World-/Movement-/Save-Naht. |
| NPC-/Prop-Interaktion und schmaler Combat-Donor | Bestehende Folgearbeit nach World-/Atlas-Proof. Eingänge/Owner prüfen (`I` und historischer `F`-Alias, nicht neue konkurrierende Interaktion erfinden); keine komplette Quest-/Inventar-/Economy-Vorwegnahme. |
| Dungeon S13.2 / begehbare Innenräume / Instanzen | Quelle erhalten, danach eigener Innenraum-Consumerproof: Eingang→Raum/Korridor→Ausgang, Wand-/Boden-/Stockwerks-/Kameravertrag nachweisen. Nicht aus höchster radialer Supportfläche ableiten. |
| DRIVE, Boot/Wasser, weitere Flug-/Portal-/kosmische Reiseformen | Benannte vorhandene Donor-/Folgeslices behalten; kein stilles Streichen, aber keine pauschale Aktivierung oder Pflicht zum gleichzeitigen Komplettbau in Integration 01. Tatsächlich freigegebene Reihenfolge beim Work-Start lesen. |

Birthday bleibt FAIL/OUTDATED/ARCHIVED, nicht „World-Umfang wiederhergestellt“. „Keine Fahrer-Rigs in BOX1“ gilt Race-spezifisch und ist **kein Verbot vorhandener Travel-Passagier-/Bath-/Seat-Quellen**. Deren eigener Status bleibt erhalten.

### 0.6 Quellenkarte und Erfolgskriterium für World

Direkt geprüft für diese Scopekorrektur: Travel `33c731c012c573977cccd4f62723b741f0c1e785`: `WSA_START.md`, `MASTERPLAN.md`, `AGENTS.md`, `travel/CONTRACT.md`, `docs/DONOR_MATRIX.md`, `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/REUSE_MATRIX.md`, `site/world-builder/runtime-mode.js` sowie aktuelle Site-/Travel-Bäume. Ausgangs-Onboarding r2.1 beim Lesen: kayfabizarro `22884b8cbcd993217abd09550907c920928b6b15`; vor Write neu abgleichen. TinySkies-Pin aus vorhandenem `kayfabizarro/travel/wip/travel_globe_wsa/docs/reference/SOURCE_PATHS.md`, Upstream-Dateibaum am Pin nochmals aufgelöst. Historische Re-home-SSOTs in dieser SOURCE_PATHS-Datei gelten nicht als heutiger Implementierungsowner.

Maßgebliche Travel-Ownerpfade: `travel/globe-v13/globe-poc.js` (Wirt/Seed/Weltparameter), `globe.js` (Netz), `boden-lesung.js` (gebackene Bodenhöhe), `globe-field.js` (ausdrücklicher Fallback), `spherical-math.js`, `carpet.js`, `flight-controls.js`, `camera-rig.js`, `day-night.js`, Sky-/Worldstimmungs-/Lighting-/Audioquellen laut CONTRACT; `travel/terrain-planets-v1/card-carrier.js`; WB0 `ground-controller.js`, `movement-lab.js`, `runtime-mode.js`, `support-surface*.js`, `assembly-a0-surface-adapter.js`, `world-recipe.js` und `wb0.js`. Tatsächliche Hostverdrahtung und benötigte Sidecars lokal prüfen. Nicht behaupten, diese Scope-Lektüre habe sämtliche Module neu gebrowsert oder den Upstream-Transfer neu implementiert.

**Pfad-B-Abschluss erfordert eine reale durchgehende Aufnahme/Testspur:** denselben sichtbaren Terrainort anfliegen, Ground wechseln, dort gehen/laufen/springen, einen authored Ort erreichen, Flight wiederaufnehmen und nach World-/Modus-Restore denselben korrekt gespeicherten Zusammenhang vorfinden. Dazu Phase BUILD/PLAY und der begrenzte Ensembleimport aus §4. Eigene World-/Travel-Startkarte und Rückweg im bestehenden Hub; nicht allein BOX1 exponieren. Fehlende Quelle/Gate blockiert die betroffene Umsetzung, löscht aber den Umfang nicht. Kein Gesamt-DONE ohne diesen World-/Movement-Nachweis.

## 1 · Arbeitsraum und alle Lanes

Astra führt einen lokalen Multi-Repo-Workspace unter bestehender WSA-/Web-Lead-Leitung. Claude Design bleibt Authoring-/LookDev-Produzent. GitHub bleibt dauerhafte Wahrheit. Quelle, Contract und Ergebnis verbleiben beim jeweiligen Owner; ein kleiner Lock referenziert nur gemeinsam geprüfte Revisionen. Kein Monorepo-Umzug, keine neue Registry, Universal-Engine, Physikschicht oder parallele Assetbibliothek. Lokal benötigte Assets/Sidecars sind abgeleitete hashgeprüfte Caches ihrer vorhandenen GitHub-Quellen.

| Lane | Verbindlicher Anteil dieses Laufs | Grenze |
|---|---|---|
| BOX1 / Race / Vehicles | Bestehende Site und v0.8-Feel erhalten; vollständige gelieferte Kandidatenliste, WS1-v2-Deformer, Auswahl/Shortlist, Originalvergleich, Countdown, Instrumente, ENV A/B reproduzieren und gezielte Fehler beheben. | Keine neuen Fahrer-Rigs in BOX1; 43 geladene Kandidaten sind nicht 43 individuell fahrgeprüfte Fahrzeuge. |
| Audio / Jukebox | Original-A1 beim Einstieg neu suchen, pinnen, prüfen und über vorhandenes BOX1-Radio integrieren; bestehenden Jukebox-Katalog/Van Metronome erhalten. Travel-Audio bleibt eigener Consumer. | Kein A1-Nachbau aus Prosa; fehlende Originalquelle blockiert nur diese Naht, lässt aber den Audioauftrag unerledigt. |
| World / Travel / Environment | Vollständiger §0-Kernpfad: Terrain/Wasser/Küste/Vegetation/Himmel/Licht, Flight↔Walk und live Authoring/Save im selben Weltzustand. Facility-Dressing bleibt eigener Race-Consumer. | `/world/` ist POC, nicht Travel-Terrain; Flow Loop ist nicht neue Facility; NPC-Import allein erfüllt World nicht. |
| Residents / Animation | Alle vorhandenen Rezepte zugänglich erhalten; ein konkretes S6-Rezept sichtbar animiert, korrekt montiert und reproduzierbar im Receiving-Consumer beweisen. | Rig-Familienname/Bibliotheksbesitz ist kein Binding- oder Laufzeit-PASS. |
| ToolBox / Studio / Rigging | Stage-First-Originalquelle additiv beim ToolBox-Owner promoten, sofern noch ausstehend; echten Authoring/Save/Export/Reload/Import-Ablauf liefern. | Kein Screenshot-Nachbau, kein Demoersatz des Rosters, kein stiller Face-/Pose-/Motion-Ownerwechsel. |
| Locomotion / Arena | Travel-Mode-/Movementpfad gemäß §0 tatsächlich spielen; Arena-Start/Combat/Restart separat reproduzieren und im Hub erreichbar mit Rückweg. | Navigation ist kein Travel↔Arena-Portal; A2 und C1 nicht in einem Tausch verstecken. |
| Librarian / Registries | Bestehende Discovery-/Candidate-Handoffs, konkrete Assets/Dependencies und heutige GitHub-Packs nutzen; Doku-/Deploy-Drift bereinigen. | Keine zweite Taxonomie/Registry und kein automatisches L5. |
| Hub / Recovery | Bestehenden Hub mit tatsächlich getesteten Race- UND World-/Travel-Einstiegen, Quellen, Builds und wenigen offenen Nutzerentscheidungen aktualisieren; alle anderen Projekte erhalten. | Kein Linkdashboard als Ersatz für die Gebrauchspfade; kein globales Grün aus Load-OK. |

Intake-Zählungen 35 ToolBox-Einträge, 21 Resident-Rezepte plus Ensemble und 43 BOX1-Kandidaten beim Work-Start nachzählen. Vollständigen aktuellen Bestand erhalten, nicht auf Testfiguren reduzieren. Legacy-Packs sind inzwischen GitHub-Quellen und Librarian-Kandidaten; sie erweitern nicht automatisch den S6-Cast oder seine geprüften Animationen.

## 2 · Preflight und vorhandene Gates

`SOURCE_BASELINES.json` ist ein historischer r1-Snapshot. Der ausgeführte World-Review prüfte kayfabizarro `9493bce0`, Travel `33c731c0`, Race `616c151b`, Arena `f6a59ad1`; vollständige Pins im Review. HEAD, relevante offene PRs/Branches, Dirty/Unpushed-Arbeit, Originaleingänge und echte Berechtigungen beim Work-Start erneut auflösen. Travel-Einstieg ist `WSA_START.md`; kein erfundenes Root-RECOVERY.

Ground=8 behält seinen konkreten Human-Gate: Fernando vorwärts; Mech W→Space bei gehaltenem W→LAND; Monstrosity W/Shift+W; LMB-Klick/Orbit; RMB-Look; Card-Ground ohne Regression. Der Pilot-Brief ist noch `RUNTIME IMPLEMENTATION DEFERRED UNTIL GROUND=8 HUMAN GATE`. Keine spätere Freigabe allein aus einer grünen CI ableiten. Bestehende Atlas-Browser-QA nicht als erledigt ausgeben. Travel PR #8 ist offene Birthday-Fehlhistorie, kein Integrationsauftrag; andere offene Drafts nicht beiläufig mergen.

Bis zu erforderlichen Freigaben sind lokale Reproduktion, vorhandene technische Regression und begrenzte Daten-/Portabilitätsvorbereitung auf getrenntem Kandidaten erlaubt. Kein gesperrter Folge-Consumer oder Production-Promotion als akzeptiert ausgeben. Fehlende Freigabe konkret ausweisen, unabhängige Arbeit fortsetzen. Kein allgemeiner neuer Abnahmemarathon. Insbesondere vorhandene World-/Flight-/Ground-Basis reproduzieren und prüfen, nicht wegen des Atlas-Gates den gesamten Travel-Strang überspringen.

## 3 · Pfad A: auswählen → fahren → hören → wiederfinden

`Hub → BOX1 → Box Stop → Fahrzeug/Profil → Test Lap → 3/2/1/GO → Fahrt + Environment + Audio → Originalvergleich → Shortlist → Reload → gleiche Auswahl → Hub`.

**WORLD/LIFE:** akzeptierte v0.8-Route, vorhandenes Facility-/Surreal-Dressing, originale Fahrzeugquelle, unversperrter Fahrblick. Deformer liest normalisierte Race-Telemetrie; Original und neuer Visual-Response nicht doppeln. Kontakt, Bewegung, Kamera und Fortschritt bleiben Race-owned. Instrumente reagieren begrenzt und beruhigen sich. Keine neuen Fahrer-Skelett-Rigs; source-interne statische Figuren korrekt benennen.

**SEQUENCE/FEEDBACK:** sofortiges Ladefeedback; Host bereit vor Box Stop; Auswahl erst nach vollständigem Modell-/Profil-Laden committen. Cancel und Ladefehler erhalten gültige Fahrt; Retry anbieten. Countdown erst bei Bereitschaft, Input bis GO gesperrt. Fokus/Press/Busy/Erfolg/Fehler sichtbar. Keine Geistereingaben nach Modal-/Session-/Fokuswechsel.

**Audio:** Georgs Klangfreigabe gilt. Original-A1 einschließlich Provenance/Tests sichern und prüfen; neue Branch-/Inbox-Eingänge nicht übersehen. Kein Ersatz-A1. Adaptive Score und bestehende Jukebox sind alternative Musikquellen an einem Musikbus, mit einem Audio-Lebenszyklus; kurzzeitiger Crossfade erlaubt, kein Dauer-Doppelplayback. Vehicle/Drift/Re-Grip/Boost/Landing/Rail/Ambience bleiben von Musik unabhängig. Music Off ist nicht Master Mute. Kompaktes bestehendes Radio, kein vollständiger Lab-Mixer in der Fahrt. Play-Nutzergeste, Pause/Visibility/Resume, Fahrzeugwechsel und Node-/Loop-Bereinigung prüfen. Bei fehlender A1-Quelle Jukebox weiter nutzbar liefern; Pfad A nicht als vollständige Audiointegration bezeichnen.

**Publikation:** historische BOX1-Quell-/Preview-Prüfungen und der spätere echte Cloudflare-29/29-PASS aus r2.1 sind an deren jeweilige Revision gebunden. Der alte Marker-Fehlversuch bleibt Historie. Beim neuen Release verwendeten Ursprung, Source-Marker und ausgelieferte Bytes frisch prüfen. Es gilt DELIVERY_CONTRACT: ChatGPT-Site UND KFB-Cloudflare, kein githack/Ersatzhost. Ursprünge teilen LocalStorage nicht automatisch; Shortlist-Export existiert, Import/Migration nicht voraussetzen. Vor Originwechsel Wiederherstellung/Migrationsentscheidung sichern, nie Speicher pauschal löschen.

## 4 · Pfad B Teilnachweis: S6-Ensemble → echter Travel-Consumer

Dieser Abschnitt konkretisiert den Authoring-Teil des **gesamten World-/Travel-/Walk-Pfads aus §0**; er ersetzt nicht Terrain/Flight/Movement.

`Hub → Librarian/Atlas → bestehendes Resident-/Prop-Rezept → tatsächlich unterstützte ToolBox/Animation-Nähte → Export → Travel-Zielvalidierung → Platzierung → Save → neuer Boot/Reload → PLAY: sehen und erreichen → Hub`.

Nicht jeder Export muss durch jede App. Der konkrete erste Ensemble-Consumer bleibt **Lorekeeper + Tome/Lesepult + Staff, sieben echte Hex-Zellen und Travel-eigener ROAD-Ansatz** nach dem bestehenden Ground-Gate. Maßgeblicher Projektbrief: `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/ATLAS_PILOT_01_LOREKEEPER_HEX_THRESHOLD_2026-09-17.md` im Travel-Repo. Keine Schloss-/Minen-/Dungeon-Ersetzung dieses Fixtures; deren gesonderte Orts-/Folgeslices bleiben gemäß §0 erhalten.

### Tatsächliche Ausgangslücke: kein fertiger Ensembleimport

Travel `site/world-builder/wb0.js` liest beim UI-Import rekursiv `path`/`ghUrl`/`rawPinned` und ergänzt die Palette. Das instanziiert noch keine S6-Szene, Handslots oder Varianten. `world-recipe.js` besitzt zwar `importRecipeFile`, dieses ist im betrachteten UI nicht der aufgerufene Szenen-Restore. `normalizeRecipe` überschreibt die Schemaangabe; das ist kein Kompatibilitätsvalidator.

Alte `tools/resident_atlas/scenes/`-Rezepte (`kfb-resident-scene.v1`) und S6 `tools/resident_atlas_s6/data/cast.js` sind verschiedene Produzenten. Der Caveman-Prefab-POC konsumiert ersteres und exportiert eigene `residentPrefabs`-Kandidaten. Er ist kein bereits funktionierender Lorekeeper-/S6-Importer. Beide bestehenden Atlas-Einstiege erhalten; nur die benötigte konkrete Datennaht im zuständigen Consumer schließen, keinen universellen Schema-Konverter entwerfen.

### Roundtrip-Vertrag aus der Quelle schließen

Existierender Travel-Speicher: `kfb.world-recipe.wb0.v0`, Schema `kfb.world-recipe.v0`. Instanzen speichern `id`, `assetId`, `source.{url,path,pin}`, `surface.{direction,radialOffset}`, Quaternion, Scale und Calibration. ROAD liegt in `splines`. `syncRecipeInstances()` rekonstruiert Einträge aus einer festen Feldauswahl: zusätzliche Ensemble-/Variant-/Attachment-Daten sind nicht automatisch erhalten. Nach fehlgeschlagenem Restore nicht das erfolgreiche Teilergebnis als ganze Welt erneut speichern und damit fehlende Instanzen verlieren.

Vor Umsetzung im Travel-Owner die minimale Roundtrip-Erweiterung bzw. vorhandene passende Naht bestimmen. Erhalten müssen bleiben: Quellrezeptidentität/Revision, ursprüngliche relative Komposition, Parent/Handslot und Kalibrierung, stabiler sphärischer Anker, Variante, konkrete Hex-Supportregistrierungen, aufgelöste Motion-/Clipidentität und Travel-ROAD. Unbekannte Pflichtfelder, inkompatible Version oder unaufgelöste Assets sichtbar ablehnen/benennen; nicht still als leere Welt normalisieren.

Staging → Validierung aller benötigten Quellen/Sidecars → explizites Accept → Commit. Cancel, fehlerhafte Datei, fehlendes BIN/Texture/Modell und veralteter asynchroner Load erhalten die letzte gültige Szene **und** deren Save. Atomare Restore-/Revert-Eigenschaft am Gesamtablauf prüfen, nicht aus JSON-Erfolg ableiten.

### Sphärischer Bezug und Größen

Kein `poc-local`-XYZ als produktive Weltkoordinate speichern. WB0 verwendet `surfaceAnchorFromWorld` / `worldFromSurfaceAnchor`, radiale Normalen und eine Körperhöhe von **0.022 Travel-Einheiten**; dies ist kein Metermaß. Eine gemessene einheitliche Ensemble-Skalierung plus lokaler Tangentenrahmen/Heading überträgt die Quelle; nicht Actor, Stab und Lesepult jeweils auf dieselbe Zielhöhe normalisieren. Parent/Child-Richtung, Up/Forward, Quaternion, Radiusreferenz und Offsets auch nach Reload prüfen. Ein Anchor alleine beweist noch keinen solchen kompletten Import.

### Identität, Leben und Support

S6-Lorekeeper-Rezept unverändert als Quelle: Actor `[0.75,0]`, Y-Drehung `-18°`; Lesepult `[-0.95,0.15]`, `24°`; Staff `s=0.65` an `handslot.r`, mit vorhandener Ausnahme-Kalibrierung `axis/aim/grip`. Kein Handbuch als Lesepult-Ersatz und keine pauschale Identitätstransformation für den bewusst kalibrierten Stab. `Rig_Medium` / `Idle_A` als Ausgangspunkt, konkrete Clipdatei/Revision/Binding/Root-Motion-Policy beim tatsächlichen Empfänger nachweisen. Ein sichtbarer Idle-/Motion-Ablauf sowie Start/Stop/Rest/Wechsel mit einem Mixer; bloßer Zähler oder Standbild genügt nicht. RegExp-Poseauswahl aus JS nicht blind als verlustfreies JSON ausgeben.

Gleicher Anker, gleiche Komposition und gleicher ROAD für `VISIBLE_HEX`, `SEATED_HEX`, `NO_VISIBLE_HEX`. Sieben reale GitHub-Meshes. SEATED ist Instanzversatz, keine Terrainverformung. NO_VISIBLE entfernt/deaktiviert die Supportregistrierung ausdrücklich; ein verborgenes Elternobjekt ist kein ausreichender Nachweis. Travel-eigenen `assembly-a0-surface-adapter.js` / Resolver nutzen, keine zweite Kontaktwelt.

Der derzeitige Resolver wählt radial die höchste geeignete Oberfläche über Terrain im begrenzten Probevolumen. Er ist **keine** nachgewiesene Stockwerk-/Unterführungsnavigation oder Wandkollision. A0-Metadaten ersetzen keine Erreichbarkeit. Pilot mit flacher Schwelle beweisen; Dungeon und echte Multilevel-/Bridge-Navigation nicht damit als erledigt deklarieren.

**Abnahme je Variante:** alle benötigten Quellen geladen; originale Relative/Attachments erhalten; Source/Variant/Anchor/ROAD über Export/Import/neuen Boot erhalten; im tatsächlichen Travel-Terrain im PLAY zu Fuß erreichbar; keine Phantomplattform oder sichtbarer Sprung; kein Ground/Flight-/Kamera-/Mixer-Regress. Keine neutrale Bühne vor dem Weltbild als Consumer-PASS. Menschliches Urteil wählt gegebenenfalls eine oder mehrere Stilvarianten; nicht vorwegnehmen. Interaction/Combat und Dungeon folgen erst ihren bestehenden späteren Gates.

## 5 · Facility: vorhandenen Kandidaten korrigieren, keine zweite Strecke

Die Race-Dateien `ChatGPT_web/track-lab/v010-topology/V010_TOPOLOGY_BLOCKOUT.json` und `app.mjs` enthalten getrennte MAIN/PIT/SPLIT/MERGE/OVERPASS-Begriffe. Ihr alter Static/Browser-Smoke-PASS ist real, aber geometrisch unzureichend:

- Stützen bei XZ `[-6,0]` und `[6,0]` liegen nur **1.4552** von der unteren Mittellinie entfernt, innerhalb deren halber Breite **3.75**, selbst mit maximalem Stützenradius **0.9**.
- Servicegebäude-AABB X `[-15,15]`, Z `[-9,-1]` schneidet den unteren Fahrkorridor; beispielsweise liegt dessen Mittellinienpunkt `[-8,0,-2]` darin.
- Die beschrifteten 5 Einheiten sind Mittellinienabstand; Deck-/Fahrbahndicken `.46/.34` ergeben am zentralen Kreuzungspunkt nur **4.60** freie Höhe, nicht 5.

Quelle, Rechnung und Geltungsbereich in `evidence/v010-source-geometry-review.json`. Kein neuer Browser-/Fahrtest dieses Reviews.

Race korrigiert den **bestehenden** Kandidaten und erweitert seine Geometrieprüfung um reale Korridor-/Gebäude-/Stützen-/Deckvolumen, Übergänge und freie Höhe. World/Environment liefert Ausschlussräume/Placementbefunde, übernimmt weder Race-Route noch Kontakt. Erst korrigierte Topologie visuell vorlegen, bestehende menschliche Freigabe erhalten, dann akzeptiertes v0.8-Fahren anbinden. Kein alter v0.9-Patch, keine neue allgemeine Graphengine, kein A0-Ausbau auf Verdacht.

Der öffentliche BOX1-Flow-Loop bleibt währenddessen unangetastet. Service-/Pit-Entry/Exit-/Stall-/Start-/Bridge-Frames stammen aus Race. Bestehendes Environment an diese geprüften Frames anpassen; Dressing OFF lässt Kontakt/Route unverändert. Unterfahrt nicht mit Terrain auffüllen. Facility/Surreal teilen später dieselbe freigegebene Topologie. Der hereinfallende Box-Stop-Button konsumiert den echten Pit-Entry und öffnet denselben Overlay-Code. Echte Stuntrampe/Absprung/Landung/Bypass bleiben spätere ausdrückliche Arbeit, nicht die Brückenauffahrt.

## 6 · Arena und Animation: konkrete Grenzen

Arena in eigenem Repo starten, bestehenden Combat-/Restartablauf prüfen und mit Hub-Rückweg führen. Das ist `NAVIGATION INTEGRATED`, kein neues Travel↔Arena-Portal. Referenzen: Arena `WSA_START.md` und `_handover/C0_REENTRY/OWNER_MAP.md`; letzterer ist ein historischer Source-Audit, vor Eingriff aktuelles Wiring prüfen. Player schreibt Root/Bewegung, Host Boden/Input/Kamera, Gunfight Abgang/Hit/Kill, Rewards Loot, Runflow Rundenstatus. Ground/Flight-Umschaltung in Travel `runtime-mode.js` ist kein Cross-App-Portalvertrag. Ein `portals: []`-Array beweist keinen Transition-Lebenszyklus.

Kein C1-Graft oder A2-Kartenmodultausch ohne dessen konkrete Quelle/Freigabe. Muzzle-/Release-/Foot-Policy, Clipentscheidung, Root-Motion, alter Mixer/Face-/Pointer-Tick und Destruktion ausdrücklich auflösen, nicht daneben montieren. Bestehende Actor-/Motion-Übergabe nur bei passendem geprüften Contract ergänzen. Nicht alles neu schreiben, nur weil das zentrale Animation-Node noch UNVERIFIED nennt.

## 7 · Werkzeuge, UI und Regressionsumfang

Stage-First aus echter Quelle, additiv und rollbackfähig im ToolBox-Owner; originale Inboxen unverändert. Actor/Face/Pose/Motion/Voice/Talk/Bubbles/Stage, Resource Picker mit Preview/Accept/Revert, Props transformieren, Speichern/Reload/Export/Import und vollständiges Roster erhalten. Ein zusammenhängender Authoring-Roundtrip ist erforderlich. Unterstützte Nähte nutzen; fehlende nicht durch eine neue Demo-Konfiguration verdecken.

BOX1/Atlas behalten KFB-Atlas-Familie, kein DocCheck-Mantel. ToolBox behält seine eigene Stage-First-Hierarchie; kein erzwungenes BOX1-Dark-Theme über alle Apps. Historische Paper/Light- versus spätere Stage-First-Entscheidungen in ihrem Ownerkontext klären. DocCheck-/Town-/andere Hub-Einträge nicht streichen; medizinische Bilder nicht einfärben. Neue UI-/Spieltexte Englisch, Produktionskommunikation Deutsch.

Desktop, etwa 832 px Split-Screen und schmaler Touch-Kontext prüfen; Stage/Fahrt dominant, kein zusammengedrückter Dreifachinspektor. Vorhandene Suchfilter dürfen Einträge einklappen, nicht löschen. Die Three-Versionen verschiedener Hosts müssen nicht vereinheitlicht werden: zwischen Apps unterstützte Daten, keine Renderer-/Mixer-/Controllerinstanzen transportieren.

## 8 · Ausführung, Recovery und Abschluss

`WORKSPACE_RECOVERY.md` und `DELIVERY_CONTRACT.md` bleiben verbindlich: echte Work-Sessionrechte/Netzwerk/WebGL/Audiozugriff sowie native Site-/KFB-Deployfähigkeit zuerst testen; lokale Sources selektiv beziehen; keine Secrets veröffentlichen; fremde Dirty/Unpushed-Arbeit schützen; dedizierte reviewbare Branches, keine Force-Pushes oder pauschalen Alt-PR-Merges. Ein aktiver Executor, kein neuer bezahlter Dienst oder Critic-Schwarm. Interne Baufolge autonom; keine Mikrofreigabe für jeden normalen Fix.

Quellen/Tests früh pushen. Vor Sessiongrenze kurzen RUN_STATE und bestehenden Owner-Return aktualisieren. Multi-Repo-Release nicht atomar: je Owner prüfen, dann genau diese getestete Commitmenge im kleinen Integrations-Lock referenzieren. Rollback zur vorherigen getesteten Kombination, nicht fremdes main zurücksetzen. In zweitem sauberem Ordner aus **gepushten** Quellen/Lock starten und Konfiguration wiederherstellen; keine implizite lokale Abhängigkeit. Keine garantierte Dauer-Session oder Hintergrundüberwachung behaupten.

Vorhandene Scripts/CI/Deploywege verwenden, keine Datei-für-Datei-Connector-/Einmal-Workflow-Kette. Nach identischem Infrastrukturfehler Ursache eingrenzen statt neue Deployschleifen. Zusammengehöriger Release einmal konsistent publizieren, Marker/Bytes/tatsächlichen Browser prüfen. Nur öffentliche Appdateien/kuratierte Metadaten; keine privaten Vollquellen, signierten Transport-URLs oder sensitiven Logs.

Abschluss umfasst alle acht Lanes und beide gleichrangigen Pfade: **A Race/BOX1 und B vollständiger World/Travel→Walk-Loop samt Authoring** oder präzise offene Teilstrecken. Mindestens ein echter neuer Producer→Consumer-Nachweis ist notwendig, aber **allein nicht hinreichend**, um den World-/Movement-Kern aus §0 oder die übrigen bestätigten Pfadteile zu überspringen. Owner-Commits/PRs, Source-/Contract-/Assetpins, Tests/Returns/Screenshots und kurze reale Bewegungs-/Ablaufcaptures, beide Site-Ziele, Hub/Backlink und Recovery-Test mitliefern. Kalter Start, fehlende Quelle, kaputter Import, Revert, Reload sowie mindestens 20 sinnvolle Navigations-/Mount-/Moduszyklen auf Input-/Audio-/Mixer-Leaks prüfen. Nicht ausgeführte Tests bleiben NOT_TESTED; keine simulierten Zahlen oder physische Geräteabnahme aus Chromium-Emulation.

Pro Lane: SOURCE LOCATED / LOCAL BOOT TESTED / NAVIGATION INTEGRATED / DATA-ROUNDTRIP TESTED / RUNTIME-CONSUMER TESTED / PUBLIC DEPLOYED / HUMAN ACCEPTED / OPEN. Diese Felder ersetzen kein A0-Maturity-System. Historical PASS bleibt an seiner Revision/Prüfmethode. Fehlende A1-Quelle, humane Gate, World-/Movement-Kern oder echter Consumernachweis bedeuten PARTIAL / BLOCKED für den bestätigten Gesamtumfang, niemals pauschal DONE. Briefingreife und erfolgreiche Implementierung sind getrennt.
