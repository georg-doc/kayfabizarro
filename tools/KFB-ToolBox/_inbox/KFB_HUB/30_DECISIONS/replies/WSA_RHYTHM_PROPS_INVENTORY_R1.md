# WSA · Rhythmus- und Schildermodelle · Inventur R1 · 11.10.2026

**Text/Zahlen, kein Bau, kein Lab-src, kein Asset-Import, kein Merge.** Auftrag STEERING_REPLY_WSA_C_R1.md / STYLE_GUIDE_3D_R1 v0.2 §6b/§6c, V-175(5)/V-172/V-173. Teil C ist abgenommen; J17-Tag/E50 baut die Lab-Sitzung nach Banden/Flackern hinter URL-Schalter. Die Inventur ändert weder Licht noch BillboardScheduler.

Daten: [rhythm-props.json](rhythm-props.json). Quellen-Reihenfolge KayKit → Tiny Treats → Quaternius → Kenney. **199 bevorzugte, nach Source-Datei und referenzierten Buffer-/Texturhashes entduplizierte Export-Kandidaten:** 196 Höhen aus glTF/GLB-Vertices mit Scene-Node-Transforms; drei OBJ-Komponenten ohne bestätigte Up-Achse haben Y-Spanne und echte Flächenzahl, aber keine behauptete Höhe. 187 mit lokalem CC0-Lizenztext/Archivbeleg, zwölf ungesichert. Unbekannte Lizenz ist kein Freibrief zum Vendoring.

## 1 · Katalog zuerst / Suchraum
Aktueller Canonical-main-Katalog: 7.819 3D-Modelle /124 Packs; Live-bot:7.997 /126. Manifest-/Pack-Index und14 gezielte aktuelle Pack-Shards gelesen; sechs veränderte Live-Packs zusätzlich abgeglichen. Große Bits-/Mystery-Shards per vollständigem Git-Blob gelesen, nachdem der File-Line-Reader gekürzt hatte. Die lokale ältere14.768-Zeilen-Registry diente nur zum Auffinden, nicht als aktueller SSOT.

Vorhandene Inventur-Branches zuerst geprüft: assets/kaykit-patreon-completion-2026-10-10, assets/kaykit-bits-bundle-1-1-2026-10-10, asset-unpack/quaternius-ultimate-nature-2026-10-08. Aktuelle Patreon-Completion hat die gleiche Pack-Index-Version wie main; der ältere Bits-Branch enthält weniger Mystery-Einträge. Asset-Librarian-Matches im JSON sind Discovery-Verweise, keine Behauptung gleicher lokaler Bytes.

Danach komplette lokal gefundene Paketbäume nach Modellnamen durchsucht:87 Paket-/Cache-Scope-Einträge,20.399 Modell-Formatdateien (inklusive Doppelkopien und Engine-Exporten),80 Archiv-Namenslisten; zusätzlich die vom Live-Katalog gemeldete Holiday-Bits-Quelle in Downloads als **private Referenz** mit CRC geprüft. Mystery4/5/6 inklusive beider Series6-Ablagen sind enthalten. Mystery1–3 nicht in den betrachteten lokalen/Registry-Scope-Namen gefunden; keine Aussage über alle historischen Downloads.

[SEARCH_SCOPES.json](WSA_RHYTHM_PROPS_INVENTORY_R1/SEARCH_SCOPES.json) nennt Scope, Suchbegriffe, Modellzahlen und Archiv-Treffer. Namen sind eine Entdeckungssuche; nicht jedes generisch benannte Bauteil ist semantisch erkennbar. Unzuordenbare „factory add“-Kopien wurden nicht als Quaternius ausgegeben. Falschtreffer wie tree_cone und loungeDesign wurden entfernt. Kein zweiter Asset-Katalog-Owner: dies ist ein gebundener Research-Report über Librarian/Originalpakete.

## 2 · Sofort nützliche Kandidaten (unskalierte Modell-Einheiten)

Alle genannten Maße sind Source-Maße, **keine lab-/H-/MC-Zielmaße**. Die Props dürfen nicht pauschal mit Figurenmaß oder1,46 umgerechnet werden. Paket-/Kit-Faktoren und Source-Isolation bleiben beim Empfänger. Höhenprüfung für Kamera/Rhythmus erst nach gewähltem Prop-Scale; kein Clearance-PASS aus dieser Tabelle.

| Priorität / Modell | Paket | Höhe | Dreiecke | Lizenzbeleg | Verwendung / Grenze |
|---|---|---:|---:|---|---|
| KayKit `torch` | Dungeon1.1 FREE, Alias FREE2 |1,041605|216|CC0|Fackel-Körper; kein hoher Pfeiler mit Ketten|
| KayKit `torch_lit` | dto. |1,125793|270|CC0|Flammenvariante vorhanden; Emission/Umgebungslicht getrennt|
| KayKit `torch_mounted` | dto. |1,062467|278|CC0|Wand-/Mount-Variante; keine freistehende Basis erfinden|
| KayKit `streetlight` | Bits Bundle1.1 / City Bits-Verwandtschaft |0,959915|176|CC0|town-Laternenquelle; kleine Modellgröße ist kein K2-Maß|
| KayKit `post_lantern` | Bits Bundle / Halloween |3,300000|568|CC0|Laternenpfahl-Kandidat für town/dirt/trail/stone-mesa|
| Tiny Treats `street_lantern` | Pretty Park1.0 |4,500000|424|CC0|voller Laternenpfahl; numerisch stark, Skalierung/Render noch offen|
| KayKit `arch_gate` | Bits Bundle / Halloween |4,413949|868|CC0|Torbogen, kein bewiesener Fahrbahn-/Kamera-Freiraum|
| KayKit `stopsign` | Mystery4 · Survivalist |2,357408|569|CC0|Schild mit Source-Struktur; Verkehrsrolle nicht aus Fremdinhalt übernehmen|
| KayKit `cone` | Mystery4 · Driver |0,674502|128|CC0|Verkehrskegel, kein Cosmic-Lichtpylon|
| KayKit `Lamp_Workbench` | Mystery5 · Helpers |1,134985|540|CC0|Arbeitslicht, nicht automatisch Straßenpfahl|
| KayKit `Orc_Banner` /Large | Mystery6 · Orc Brute |2,512301 /5,024603|je3.570|CC0|Banner; kein beliebiger neutraler Billboard-Rahmen, Large ist Source-Variante|
| KayKit `lantern` /decorated /mini | Holiday Bits1.0, aktueller Live-Katalog |3,937885 /3,990557 /0,641776|492 /1.451 /286|nicht gefunden im geprüften Archiv|vorhandene Modelle; kein Import freigegeben solange Lizenz nicht belegt|
| Quaternius `Torch_Metal` | Fantasy Props MegaKit Standard |0,648161|970|CC0|Fackelquelle; Metall-Look muss Knetmaterial bekommen|
| Quaternius `Lantern_Wall` | dto. |1,337008|2.822|CC0|Wandlaterne; Montagefunktion bleibt|
| Tiny Treats `wall_sign_large` | Bakery Interior1.1 |1,000000|100|CC0|Wandtafel/Panel, kein12×6-Billboard oder Mast|
| Kenney `sign-highway` | City Kit Roads |0,707375|180|CC0 im Paketarchiv|echter Schilderbrücken-Kandidat, Durchfahrt nicht geprüft|
| Kenney `sign-highway-wide` | dto. |0,707375|144|CC0 im Paketarchiv|breite Variante; Original-Schrift nicht übernehmen|
| Kenney `billboard` | Racing Kit |1,000000|136|CC0 im Paketarchiv|Source-Körper/Rahmen, bestehender Billboard-Owner behält Inhalt|
| Kenney `pylon` | Racing Kit |0,132000|108|CC0 im Paketarchiv|kleiner Verkehrskegel, keine Neon-Pylon-Lösung|

**Die frühere Lab-only-Fackel-Fehlt-Meldung ist damit geschlossen:** vollständiges Dungeon-Pack hat torch/torch_lit/torch_mounted. Fackel-Pfeiler mit Ketten ist dagegen weiterhin nicht durch diesen Fund als fertiges Modell bewiesen.

## 3 · Klassen / Quellenreichweite
- **Fackeln:** sechs Export-Kandidaten, aktuelle Dungeon-Varianten vor Legacy1.0; Quaternius Torch_Metal als spätere Quelle.
- **Laternen/Pfähle:**14 Laternenpfahl- und33 Laterne/Leuchte-Einträge (inklusive Holiday). Manche sind Tisch-/Decken-/Arbeitslicht oder Jack-o-Lantern, ausdrücklich kein Rhythmuspfahl.
- **Banner/Fahnen:**88 Einträge inkl. Farb-/Formvarianten und Mystery. Cloth/Wand-/Handbanner ist kein vollständiger Fahnenmast; Modellgraph/Stand separat prüfen.
- **Wegweiser/Schilder:**18; Objekt-only-Varianten sind Panels, kein kompletter Pfosten. Mystery-stopsign und Tiny Treats-Wandtafel sind echte unterschiedliche Funktionen.
- **Torbögen:**acht mit Teilkomponenten; ganze Bögen nicht mit linker/rechter Hälfte verwechseln. Keine Spannweite/Rig-Freiheit angenommen.
- **Schilderbrücken/Billboards:**drei sign-highway-Kandidaten und vier Racing-Kit-Billboardkörper. Keine vorgefundene KFB-Neon-/Stein-/Holz-Rahmenfamilie automatisch behauptet. Material-/Frame-Anpassung nur durch bestehenden Owner.
- **Leitpfosten:**kein dedizierter Straßen-Leitpfosten im geprüften Modellnamen-/Katalog-Suchraum sicher identifiziert. Nahe Quellen: fence_post/fence_pillar/poles als Pfosten, nicht als weiß-schwarzer Leitpfosten ausgeben.
- **Licht-Pylonen:**kein sicher identifizierter hoher leuchtender Cosmic-Pylon im geprüften Suchraum. Traffic-cones und Roof_Antenna sind keine Funktionsbeweise. Vorhandene Laternen als Material-/Form-Kandidaten, kein neuer Cosmic-Look-Beschluss.
- **Poller:**in diesen Provider-Treffern kein eindeutig benannter bollard. **Bestehender KFB-Bestand zuerst:** RKIT `rkit_poller.parts.glb`, deklarierte Höhe0,85lab, Mittenabstand2,30lab aus RKIT_POLLER_R1/Styleguide. Bereits anderer Owner, kein WSA-Neubau und nicht als neuer KayKit-Fund gezählt.

## 4 · Lizenz, Knete-Eignung und Integrität
Pro Fund: Paket, relativer Dateiname, SHA256, tatsächlicher Lizenztext-/Archivbeleg, Polygon-/Dreieckswerte, Modellhöhe, Skin-Kandidaten, Knete-Fit und Source-Aliase im JSON. Lizenz nicht aus Anbietername abgeleitet. **187 explizite CC0-Belege; zwölf ungesichert** (u. a. Holiday-Laternen, alter Orc-Banner und einzelne alte Kenney-Kopien). UNVERIFIED bleibt BLOCKED_LICENSE_NOT_PROVEN für spätere Aufnahme. Kein Lizenz-Ausnahme-Go von Georg benötigt oder angenommen, weil hier nichts vendort wird.

Knete-Fit lautet konservativ **mit Material-Tausch** für die stilisierten Source-Kandidaten: kein Fund hat in diesem Auftrag eine neue KFB-Render-Abnahme. Das ist eine Daten-/Familien-Einschätzung, kein Beweis, dass Materialwechsel allein bei jeder Form genügt. Scharfe Kanten, falsch montierte Leuchten und unpassende Verkehrsfunktion bleiben Empfangsprüfung. Skins sind Eignungs-Kandidaten, keine Platzierungsregeln oder umgeschaltete Source-Paletten.

`game-dev` ist hier nicht verfügbar; einmal festgestellt, repository-native Checks verwendet. Es gibt keinen Game-Dev-Paket-Receipt/geschlossenen gesamten Supply-Chain-Roster. Nachgewiesen sind gewählte Descriptor-/Buffer-/Texturhashes und konkrete Lizenztexte; **kein Package-Admit, Engine-Import oder GPU-/Art-PASS**. Die Skill-Admit-/Launch-Schritte sind nicht Gegenstand dieses Recherche-Auftrags. Referenz-Extraktion Holiday nur in privatem Workspace, kein Spielprojekt.

## 5 · Messmethode / Übergabe
GLB-JSON/BIN bzw. glTF mit lokalen Buffern: tatsächliche POSITION-Vertices, Scene-Node-Matrizen/Quaternion/TRS, Default-Szene. Höhe=maxY−minY nach Node-Transforms, keine Animation/Morph/Skin-Verformung. Dreiecke aus tatsächlicher Index-/Vertexzahl je Primitive und Instanz; glTF-Original-Ngons unbekannt. Externe URI außerhalb Paketroot/Netzwerk nicht geladen. OBJ-Flächen zusätzlich gezählt, Up-Achse ungeklärt: Y-Spanne ist nicht als Höhe ausgegeben. JSON-Null ist unbekannt, nie Nullhöhe.

[VALIDATION.json](WSA_RHYTHM_PROPS_INVENTORY_R1/VALIDATION.json) prüft Schema, IDs, Source-/Abhängigkeits-Hashes, Bounds, positive Werte, Lizenzbelege und private/public-Grenze. [SOURCE_EVIDENCE.json](WSA_RHYTHM_PROPS_INVENTORY_R1/SOURCE_EVIDENCE.json) enthält nur Datei-/Hash-/Lizenzmetadaten, keine Modelle oder Bilder. Archiv nur privat.

**Nächster Gate:** Steuerung wählt Source-Kandidaten (vorzugsweise vollständige CC0-belegte KayKit/Tiny-Treats-Props); Lab isoliert sie in eigener Vorlagen-Zeile und prüft tatsächliche K2-Höhe/Fuß-/Kamera-/Frame-Freiheit. Rhythmus-/Tempo-Abstände und Billboard-Inhalt bleiben bei Styleguide, Track-Ankern und vorhandenem Scheduler; keine eigenen Abstände, Geometrie, zweite Kamera oder eigener Renderer aus dieser Inventur.
