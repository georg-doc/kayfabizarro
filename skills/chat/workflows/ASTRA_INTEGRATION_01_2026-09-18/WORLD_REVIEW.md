# World-Chat · Gegencheck für Astra Integration 01

> **CURRENT r2 · 18.09.2026:** Gegencheck ausgeführt; READY WITH SCOPED CHANGES. Die Befunde WR01–WR07 stehen unten im r2-Abschnitt und sind im aktiven EXECUTION_BRIEF r2 eingearbeitet. Die folgende r1-Anforderung bleibt Historie. EXECUTION NOT STARTED.

**Status:** REVIEW REQUEST · PENDING · kein bereits erteilter Gegencheck.
**Ziel:** den produktiven Integrationsauftrag anhand des aktuellen World-/Travel-Stands schärfen, ohne einen zweiten Gesamtplan oder neue Runtime zu bauen.

## Auftrag an den World-Chat

Lies zuerst dieses Paket: START_HERE, EXECUTION_BRIEF, SOURCE_BASELINES und WORKSPACE_RECOVERY. Prüfe dann tatsächliches aktuelles `georg-doc/KFB-Travel-Globe/main`, relevante offene PRs sowie die von deinem aktuellen World-Return benannten Quellen. Der Snapshot in diesem Paket wurde am 18.09. gegen Travel `33c731c…`, Race `616c151…`, Arena `f6a59ad…` und kayfabizarro `6abb74f…` vorbereitet; neuere echte Befunde ausdrücklich ergänzen.

Du prüfst, nicht implementierst. Keine Reaktivierung von Birthday, keine neuen universellen Schemas, kein Umbau fremder Owner. Nicht bloß zustimmen: benenne die wenigen konkreten Änderungen, die ein kalter Astra-Executor benötigt, um das richtige Produkt statt einer technisch grünen Ersatzlösung zu bauen.

## Prüffragen

| Frage | Benötigte Antwort / Nachweis |
|---|---|
| Ist der World-Cursor aktuell? | Aktuelles HEAD, relevante PRs, jetziger Runtime-/POC-Einstieg, tatsächlich noch offene oder inzwischen erfüllte Ground-/Atlas-/Pilot-Gates. Alte Recovery-Sätze nicht pauschal übernehmen. |
| Ist der konkrete Consumerpfad richtig? | Lorekeeper/Tome/Staff, Hex-Schwelle und Travel-ROAD: korrekter Quellpfad, tatsächlicher Import, persistente Recipe-Felder, Save/Reload. Benenne den real vorhandenen Pfad statt einen neuen zu erfinden. |
| Stimmen Koordinaten und Kontakt? | POC-local/relative Slot ↔ sphärischer Anker, Up/Forward/Einheiten, Normalen, Terrain-/Card-/Road-/Bridge-Support. Kein zweiter Movement-Writer, keine Terrainfüllung unter Brücken. |
| Ist die World-Erfahrung erhalten? | Muss etwas zusätzlich gemeinsam sichtbar/lebendig sein? Sind WORLD/SEQUENCE/LIFE/FEEDBACK ausreichend konkret? Wäre eine neutrale Bühne vor dem Weltbild trotz dieses Briefs noch irrtümlich als Erfolg ausgebbar? |
| Stimmen Resident-/Animation-/ToolBox-Nähte? | Exakte Profile, Props/Hands, Clips und Mixer-/Root-Motion-Policy; welche Herkunft/Kompatibilität ist wirklich geprüft, welche noch offen? Keine Annahme, dass der zentrale UNVERIFIED-Animation-Eintrag alle vorhandenen Lieferungen vollständig beschreibt. |
| Passt Facility + Environment hinein? | Eigenständige Race-Topologie erhalten; spätere gemeinsame Anker/Exclusions und visueller Stil an echtem Anlagenentwurf. Was muss World liefern, ohne Race-Route/Kamera/Kontakt zu übernehmen? |
| Was bedeutet Arena-Anbindung in diesem Lauf? | Bestätige Grenze zwischen Hub-Rückweg, konkretem Datenimport und echtem World↔Arena-Portal. Vorhandene benannte Transition-/Ground-Verträge nennen, keine neue nahtlose Welt versprechen. |
| Ist der Umfang mit einem Work-Lauf sinnvoll? | Größte realistische Quelle-/Contract-/Deployment-Blocker, sinnvoll zusammenhängender erster Release. Integrationstiefe präzisieren, ohne identity-bearing Inhalte in einem bloßen Linkhub verschwinden zu lassen. |

Zusätzlicher Literal-Executor-Check: **Was könnte Astra bei wortwörtlicher Ausführung noch weglassen und trotzdem fälschlich Erfolg behaupten?** Für jeden solchen Fall eine konkrete Briefkorrektur angeben. Die im Router benannten Briefing-Postmortems gelten; kein zusätzlicher kostenintensiver Critic-Schwarm nötig, wenn dieser unabhängige Gegencheck die Perspektiven ausreichend abdeckt.

## Wie du ergänzen sollst

Bestehende r1-Texte und Source-Pins als historischen Snapshot erhalten. Hänge unten einen datierten Abschnitt an; umfangreichere Diffs können als neue `WORLD_REVIEW_r2_<Datum>.md` im selben Auftragsordner liegen und hier verlinkt werden. Ergänze außerdem CHANGELOG.md mit Autorrolle, tatsächlichen Quell-Commits, Art des Befunds und Auswirkung. Kein silent rewrite von Kernauftrag/Ownern, keine Statusänderung zu HUMAN ACCEPTED ohne Georgs konkretes Urteil.

Für jeden Befund:

`ID → Severity → konkrete Quelle/Commit → Ist-Befund → genaue Änderung im Brief → betroffener Owner → muss vor Work-Start entschieden sein?`

Abschluss mit **READY / READY WITH SCOPED CHANGES / BLOCKED**, ausdrücklich **Briefingreife**, nicht Runtime-Abnahme. Fehlende Kernquelle oder Owner-Konflikt ist BLOCKED für die betroffene Naht. Kein globaler Stop für unabhängige, freigegebene lokale Reproduktion.

## Konsolidierung vor Implementierung

WSA/Astra liest die Ergänzungen und trägt im CHANGELOG ein, welche übernommen, abgelehnt oder zur Entscheidung offen sind. Keine zwei konkurrierenden aktiven Aufträge. Bei notwendiger neuer Brieffassung alte Fassung unverändert archivieren beziehungsweise eindeutig als ersetzt kennzeichnen und START_HERE auf genau eine aktive Fassung zeigen lassen.

Routinepräzisierungen dürfen in den freigegebenen Auftrag aufgenommen werden; Änderungen an Scope, Ownern, Produktidentität oder humanen Gates gehen an Georg. Frühere positive Audio-/BOX1-Rückmeldung wird nicht pauschal zurückgesetzt.

## Ready-to-paste Nachricht

> @GitHub Bitte prüfe das Astra-Onboarding **KFB Integration 01** in diesem Ordner gegen deinen aktuellen World-/Travel-Quellstand. Lies WORLD_REVIEW.md und den zugehörigen EXECUTION_BRIEF. Ergänze konkrete Korrekturen, fehlende Quellen/Contracts und echte Gate-Updates additiv in WORLD_REVIEW.md und CHANGELOG.md, jeweils mit Repo/Commit und betroffener Naht. Prüfe insbesondere persistent World Recipe, POC→Travel-Koordinaten, Resident-/Animation-Import, Facility/Environment und die Grenze zur Arena. Kein neuer Gesamtplan, kein Runtime-Write, keine zusätzliche Registry. Abschluss: Briefing READY / READY WITH SCOPED CHANGES / BLOCKED; fehlende menschliche Abnahmen nicht selbst erteilen.

---

## Eingegangene Reviews

Noch keine. Dieser Platzhalter ist ausdrücklich kein Gegencheck-Ergebnis.

---

## 2026-09-18 · r2 · ausgeführter World-Gegencheck

**Autorrolle:** fortgesetzter Web-/World-Lead, unabhängiger Quellengegencheck des BOX1-Onboardings.
**Urteil:** **READY WITH SCOPED CHANGES** für das Briefing. WR01–WR07 sind in den einzigen aktiven `EXECUTION_BRIEF.md` r2 eingearbeitet. Kein neuer Gesamtplan, kein Runtime-Write, kein Astra-Start und keine humane Abnahme.

### Geprüfte Revisionen / Sanity

| Owner | Aktueller beim Review gelesener main-Pin |
|---|---|
| georg-doc/kayfabizarro | `9493bce02c0e8ca39ca34c741e9a98993422ddad` |
| georg-doc/KFB-Travel-Globe | `33c731c012c573977cccd4f62723b741f0c1e785` |
| georg-doc/KFB-Stunt-Car-Race | `616c151b3b82c06e1e87694e3b83400746fb843b` |
| georg-doc/KFB-Combat-Arena | `f6a59ad15b9ffcf3164b0ab013f223962b63f61f` |

Der vorherige Chat endete vor einer Abschlussantwort; ein technischer Timeout als Ursache ist nicht beweisbar. Gepushte BOX1-/v0.10-/Onboarding-Quellen sind vorhanden. Race `_handover/BOX1_DELIVERY_2026-09-18.md` enthält inzwischen den finalen Nachtrag: breite historische Prüfung 120/120 PASS und gepinnter Public-Preview 29/29 PASS; Cloudflare-Prüfung FAIL schon am Marker, kein dortiger Gameplay-PASS. Diese Nachweise wurden gelesen, nicht erneut ausgeführt. Heutige Abrufversuche von Hub/Cloudflare-Marker/Travel-URL waren in dieser Review-Umgebung nicht möglich; kein neuer Live- oder Browser-PASS. Ein lokaler Raw-GitHub-Downloadversuch scheiterte am DNS; Repository-Lektüre und Writes laufen hier über den autorisierten Connector. Dies ist **nicht** der Capability-Test der späteren Astra-Work-Session.

Die zentrale Lead-/Prioritätsübersicht war am Abbruch noch nicht vollständig fortgeschrieben. Ältere „Box Stop nur vorgeschlagen“-/„Audio erneut anhören“-Sätze sind keine neuen Aufträge; aktuelle Owner-Returns und r2 gelten. Kein Replay datierter Reparatur-/Publish-Workflows.

### WR01 · P1 · tatsächlicher Consumerimport statt Palettenimport

**Quelle:** Travel `33c731c0`, `site/world-builder/wb0.js`, insbesondere UI-Import und `entryFromInstance`/`syncRecipeInstances`; Blob `a6c08f4d70b80440bcbbb7c18ad24adb6e06d25a`. `site/world/README.md`, Blob `da48c50391af41ef396f36a3a5a0ad4f1d289f6e`.

**Ist:** UI sucht rekursiv Assetpfade und ergänzt die Palette. Sie importiert kein vollständiges S6-Ensemble; Gruppen/Handslots/Motion/Hex-Variante sind dadurch nicht umgesetzt. Der Caveman-Prefab-POC konsumiert `tools/resident_atlas/scenes/` und `kfb-resident-scene.v1`, nicht automatisch den S6-Cast; seine `residentPrefabs` sind POC-Kandidaten.

**Briefkorrektur:** aktiver Brief §4 verlangt einen echten Travel-owned Adapter für genau den vorhandenen Pilot und explizite Schema-/Feldunterstützung; bestehende Produzenten getrennt erhalten. Keine Universal-Schemaentwicklung. Ein Asset in der Palette oder eine Vorschau vor neutralem Boden erfüllt den Consumerpfad nicht.

**Owner:** S6/Atlas als Quelle, Travel als Import-/Runtime-Owner. **Vor Work-Start:** Lücke im Brief benennen, jetzt erledigt. Implementierung des Piloten bleibt an seinem vorhandenen Ground-/Atlas-Gate gebunden.

### WR02 · P1 · Save-Roundtrip und Fehleratomarität

**Quelle:** Travel `33c731c0`, `site/world-builder/world-recipe.js`, Blob `080263866129a85d42d26ceee88fdbf2f4614c2e`, und `wb0.js`.

**Ist:** Speicherkey `kfb.world-recipe.wb0.v0`, Schema `kfb.world-recipe.v0`; `normalizeRecipe` setzt das Schema ohne Kompatibilitätsprüfung. Das importierte `importRecipeFile` ist im betrachteten UI nicht der Szenenimport. `syncRecipeInstances` schreibt eine feste Feldauswahl neu. Fehlgeschlagene Instanzen werden beim Restore nur geloggt; ein späterer Save kann die Teilmenge erneut serialisieren. Daraus folgt **keine** garantierte Erhaltung von Ensembleidentität/Attachment/Variant oder fehlgeschlagenen Quellen.

**Briefkorrektur:** §4 verlangt minimale Travel-lokale Feldzuordnung, Source-Pins/Komposition/Anker/Variante/Handslot/Clip/ROAD über neuen Boot erhalten; validieren/stagen vor Accept und Save. Ungültige Schemas, fehlende Sidecars, Cancel, stale Load und kaputter Import müssen letzten gültigen Save und Szene erhalten. Keine Datenmigration allein aus `JSON.parse` ableiten.

**Owner:** Travel Persistenz. **Vor Work-Start:** kein weiterer Produktentscheid nötig; Umsetzung und Tests im Owner. Nicht als existierende Funktion verkaufen.

### WR03 · P1 · sphärischer Rahmen, Maßstab und konkrete Resident-Identität

**Quelle:** Travel `33c731c0`, `world-recipe.js`, `wb0.js`, Pilot-Brief `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/ATLAS_PILOT_01_LOREKEEPER_HEX_THRESHOLD_2026-09-17.md`, Blob `15d29e2846d4e6bd01f46b3961142b6a27388eb7`; kayfabizarro `9493bce0`, `tools/resident_atlas_s6/data/cast.js`, Blob `559a20082bd80915b3c0766ada5445f90e6f6ebd`, ausgewählte Struktur-/Lorekeeper-Befunde.

**Ist:** WB0-Körperhöhe 0.022 Travel-Einheiten; Anker `direction + radialOffset`, Quaternion/Scale separat. `loadAsset` normalisiert einzelne Modelle. S6-Lorekeeper nutzt gemessene lokale Relationen, Rig_Medium/Idle_A und den ausdrücklich vom Identitäts-Handslot abweichenden Staff mit `s=0.65`, axis/aim/grip. Der Cast enthält RegExp-Poseauswahl. Kein vollständiger neu ausgeführter Clip-/Skin-Test in diesem Review.

**Briefkorrektur:** §4 schreibt eine gemessene Ensemble-Skalierung/Tangentenbasis/Heading vor, nicht individuelle Gleichhöhen-Normalisierung aller Teile. Relative Actor-/Lesepultdaten und Staff-Kalibrierung bewahren. Konkreten gebundenen Clip, Root-Motion-/Mixer-/Handslot-Lebenszyklus auflösen; nicht JS-RegExp als automatisch verlustfreies JSON ansehen. Lorekeeper bleibt Pilot, Legacy-Uploads bleiben zusätzliche Kandidatenquellen statt automatischer Cast-Promotion.

**Owner:** Atlas/Animation für Authoring/Kompatibilität, Travel für Weltframe/Receiver. **Vor Work-Start:** kein neues Owner-Modell nötig. Expliziter Ground-Gate bleibt offen laut geprüftem Pilotbrief.

### WR04 · P1 · Support ist noch keine Stockwerksnavigation

**Quelle:** Travel `33c731c0`, `site/world-builder/support-surface.js` Blob `49a095a5b9be2ce867f4b05165587a3e38598465`, `assembly-a0-surface-adapter.js` Blob `c2a5481e5eea4098940ae692fed8004c67fe280b`.

**Ist:** radialer Resolver wählt die höchste geometrisch geeignete Oberfläche über Terrain im Probevolumen; A0-Priorität ist Tie-Break, nicht ein erreichbares Stockwerk. Registrierung prüft das registrierte Objekt auf Sichtbarkeit, nicht einen vollständigen Handoff-/Navigationsvertrag. `applyRecipe` entfernt vorherige Registrierungen vor Auflösung der neuen Geometrie. Damit sind atomarer Variantwechsel und No-Phantom-Support nicht pauschal bewiesen.

**Briefkorrektur:** §4 fordert expliziten Remove/Disable-Nachweis für NO_VISIBLE_HEX, unveränderte Ground-/Flight-Owner und kontrollierte Validierung vor produktivem Replace. Kein globales Highest-Surface-Verfahren für spätere Unterführung/Dungeon als bewiesen übernehmen. Niedrige Pilot-Schwelle zuerst, komplexe Mehrhöhen-/Wand-/Portalnavigation später.

**Owner:** Travel Support/A0-Consumer. **Vor Work-Start:** Abgrenzung im Brief erledigt; kein neues Shared-A0-Feld nötig.

### WR05 · P1 / Facility-Transfer BLOCKED · v0.10 hat reale Geometriegegenbeispiele

**Quelle:** Race `616c151b`, `ChatGPT_web/track-lab/v010-topology/V010_TOPOLOGY_BLOCKOUT.json` Blob `e08c223c213d262b5649c566263207a54400db61` und `app.mjs` Blob `f2cdde89af5734d906f0f221e9039d3fe9bb53dd`.

**Ist:** begriffliche Trennung MAIN/PIT/SPLIT/MERGE/OVERPASS vorhanden. Der Audit prüft Endpunkte/Indexverschiedenheit/Mittellinienhöhe, nicht reale Fahrkorridorfreiheit. Beide Stützen sind nur 1.45521375 Einheiten von der unteren Mittellinie entfernt, innerhalb der halben Fahrbahnbreite 3.75; selbst ihr Radius bis 0.9 passt vollständig in diesen Korridor. Das Servicegebäude schneidet die untere Strecke, etwa am Mittellinienpunkt `[-8,0,-2]`. Am zentralen Crossing ergibt Deckunterseite minus untere Fahrbahnoberkante 4.60 statt der als Clearance gelabelten Mittellinien-Differenz 5.

**Testart:** lokale analytische Rechnung aus manuell übernommenen, vorher im Connector gelesenen Quellwerten. [Rechenbeleg](evidence/v010-source-geometry-review.json). Kein neuer Browser- oder Physics-PASS. Der historische Smoke-PASS wird nicht gelöscht, aber sein Geltungsbereich korrigiert. Auch die frühere Web-Lead-Rückgabe war hier zu weitgehend.

**Briefkorrektur:** §5 verlangt Reparatur **desselben** Race-Kandidaten plus echten Volumen-/Korridor-/Clearance-Test vor erneuter humaner Topologievorlage und Fahrintegration. Environment konsumiert erst geprüfte Frames/Exclusions. Keine zweite Strecke bauen; keine Pflicht für Georg, diese technischen Fehler selbst zu finden. BOX1 v0.8 bleibt unverändert.

**Owner:** Race Topologie/Kontakt, Environment nur Placement-/Exclusion-Zuarbeit. **Vor Work-Start:** kein globaler Stop; Facility-Drive bleibt gezielt blockiert bis Reparatur und bestehender Human-Gate. Reproduktion und andere freigegebene Nähte dürfen weiter.

### WR06 · P1 · public Preview, Cloudflare und Ursprungswechsel unterscheiden

**Quelle:** Race `616c151b`, `_handover/BOX1_DELIVERY_2026-09-18.md`, Blob `cd05abc595690002440dd7340e21cd89d932677d`.

**Ist:** gepinnter Preview `94ba1cd…` 29/29 PASS; Cloudflare-Preflight FAIL am Marker. Kein bewiesener Import/Migrationspfad der lokalen Shortlist zwischen Ursprüngen. Neuabruf in dieser Review-Umgebung nicht erfolgreich; kein neuer Live-Stand behauptet.

**Briefkorrektur:** §§3/8 binden PASS an konkrete URL/Origin/Revision, erhalten funktionierenden Preview und verlangen echte Marker-/Byte-/Browserprüfung des Zieldeployments. Source-Commit, Mirror, Workflow SUCCESS und Live-Spiel getrennt ausweisen. Keine datierten Reparatur-/Publish-Schleifen wiederholen; bei Tree-/Manifeständerung nicht mit einem alten Artefakt überschreiben. Ein Originwechsel braucht erhaltenen Export und tatsächlich nachgewiesene Wiederherstellung/Migrationsentscheidung, kein `localStorage.clear()`.

**Owner:** jeweiliger Runtime-Owner + bestehender Public-Mirror-/Hub-Publishweg. **Vor Work-Start:** Capability-/Deploymentprüfung dort ausführen; keine Freigabe aus diesem Review.

### WR07 · P1 · Arena-Navigation ist keine World-Transition

**Quelle:** Arena main beim Review `f6a59ad1`; `_handover/C0_REENTRY/OWNER_MAP.md` ist ausdrücklich historischer Source-Audit von `bd01a150…`. Travel `world-recipe.js`/`wb0.js` haben `portals: []`, das belegt kein ausführbares Arena-Portal.

**Ist:** Arena-Player/Host/Gunfight/Rewards/Runflow haben getrennte Root-/Boden-/Kamera-/Schuss-/Lootzuständigkeiten und konkrete C1/A2-Abhängigkeiten. Der alte Owner-Audit ist Referenz, keine neue Runtime-Prüfung. Travel Ground/Flight-Brücke ist nicht gleich Cross-App-/Cross-Origin-Transition.

**Briefkorrektur:** §6 bestätigt Arena-Start/Regression/Hub-Rückweg für Integration 01; Datenimport nur mit belegtem Contract/Freigabe. Kein Portal, gemeinsames Save oder Actor-Graft aus einer Verlinkung ableiten. Muzzle-/Release-/Foot-/Root-/Mixergrenzen bei späterem Tausch separat behandeln; C1/A2 nicht verknüpft überschreiben.

**Owner:** Arena/Travel jeweils unverändert. **Vor Work-Start:** keine neue Entscheidung für Navigation; weitere Runtime-Integration bleibt eigener nachgewiesener Scope.

### Konsolidierungsentscheidung / aktueller Cursor

**Übernommen:** WR01–WR07 als konkrete Präzisierungen im aktiven r2; kein Punkt verworfen, kein zusätzlicher Universalvertrag. r1 START_HERE und EXECUTION_BRIEF sowie das gesamte r1-Paket unter `archive/r1/` byte-identisch archiviert. WORLD_REVIEW/CHANGELOG behalten ihre Originaltexte und neue datierte Einträge. `SOURCE_BASELINES.json` bleibt klar bezeichnete r1-Quellenaufnahme, nicht aktueller Lock; Work-Start aktualisiert echte Pins.

**Briefing READY WITH SCOPED CHANGES; Änderungen eingearbeitet.** A1-Quelltransfer, Ground-/Atlas-Gates, Facility-Reparatur/Topologie-Gate und tatsächlicher Work-Capability-/Publishnachweis bleiben offene Ausführungsbedingungen. Kein Astra-Lauf gestartet. Nächste Aktion: im einen freigegebenen Work-Lauf echten Capability-/Quellenpreflight durchführen und r2 innerhalb der bestehenden Gates abarbeiten; keine weitere Gesamtplanung nötig.
