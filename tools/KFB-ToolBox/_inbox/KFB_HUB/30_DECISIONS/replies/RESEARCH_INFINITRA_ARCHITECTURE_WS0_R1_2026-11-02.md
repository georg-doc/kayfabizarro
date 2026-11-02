# INFINITRA → KFB · deterministische Welt, Geometry Networks, LOD und Sparse World Changes · WS0 Research R1
Stand 2026-11-02 · Typ: **RESEARCH / ARCHITEKTUR-DONOR / KEIN IMPLEMENTIERUNGSAUFTRAG**
Empfänger: **WS0**, bestehende aktive KFB-Endloswelt. Produktiver Integrationsstamm: privates Repo `georg-doc/KFB-Stunt-Car-Race`, `game/integration-r2`, am 02.11. lesend `d66ef79ad93afe921a61a6a41f39790d9b505b93`. Vor späterer Ausführung erneut lesen. **Nicht** mit dem historischen R4-STOP `kayfabizarro#348` verwechseln; das laufende prozedurale MVP ist nicht gestoppt.

## 1 · Evidenzstatus / Originalquellen
- Georg übergab den ausführlichen INFINITRA-Entwicklerpost am 02.11.2026 (ca. 119k Engine/Server + 89k Tests, 2.300 Definition-Graph-Steps, 16³ Voxel-Blocks, bounded Geometry Networks, persistent items, Unity/C#, IL2CPP vs .NET, Carver Sphere). Diese Zahlen sind **Autorenaussagen**, nicht von uns validierte Benchmarks oder Tests.
- Primärquellen: https://www.infinitra.xyz/ · https://www.infinitra.xyz/docs/dev/PROGRESS.html · https://github.com/richardbogad/INFINITRA · Videos https://youtu.be/_q_Wmsdp2ng und https://youtu.be/LjluoZq5hhY
- GitHub `richardbogad/INFINITRA` README gelesen (blob SHA `d2247cf2d97e2df556727601f5c9dde0db812b1c`), Lizenz `LICENSE.md` (blob `dc91da0de15e3237ed0edfeb3ee6436e6760ab9b`). Das README beschreibt eine mathematische Weltdefinition, komplexe Innenräume, aus Distanz adaptiv ausgewertete Welt, unveränderte Orte bei Näherung, lokale Änderungsdaten, Klang/Reverb, Offline- und Shared-Mode. Zum Zeitpunkt des Abrufs zeigte GitHub keine Releases; Download/Tests nicht durchgeführt. Der Quellumfang und der konkrete Entwicklungsstand sind nicht unabhängig beweisbar.
- **Lizenz-/Wiederverwendungsgrenze:** `LICENSE.md`: MIT nur für explizit als offen markierte Codesegmente, **NICHT** `Infinitra.Client.dll`, `Infinitra.Shared.dll`, Gesamtservice oder Assets. Kern-Engine ist proprietär; deshalb KONZEPT-DONOR, kein Copy/Port der Runtime. Quelle/Versionsstand erneut prüfen, wenn nötig.

## 2 · Was technisch interessant ist (KEEP/ADAPT/HOLD)
| Prinzip des Posts | An KFB anschließbar | Kandidat / Grenze |
|---|---|---|
| Positions- und Seed-basierter reiner World-Query | `kfb-place`/WorldGen, derzeit 64-m-Zellen, deterministische Placements | **ADAPT**: Erzeugung darf nicht von Besuchs-/Anfrage-Reihenfolge abhängen; vorhandenen Code zuerst auf deterministische pure Funktionen prüfen |
| Geometry Networks in festen Weltfenstern | Straßen, Brücken, Flüsse, Wanderwege, Stadt-/Parzellenbereiche | **ADAPT**: feste Weltanker + Netzwerk-ID, nicht Kameraposition; Gebietsgrenzen und sequentielle/nebenläufige Aufrufe müssen gleiche Verbindungen ergeben. Bestehenden Street/Track/Hydro-Owner behalten |
| Sparse Change Overlay statt Welt-Mesh speichern | bestehende `world-save/2`, Gebäudezerstörung, Reparatur, eingesammelte Karten/Fluff, Bewohner-/Objektzustand | **HOHER WERT**: Weltdefinition + `generatorVersion` + stabile IDs + Änderungsevents, Save/Reload/Reset; keine zweite Save-Implementierung |
| LOD verfeinert, ohne Ort/Art/Rotation/Größe zu ändern | bestehender THREE/R3F BatchedMesh/Instancing/Geometry-LOD, Research-LOD vom 30.10. | **ADAPT**: stabile Objekt-IDs/Placement über LOD und Streaming, Material- und Shadow-LOD separat; keine neue Voxel-Engine |
| Coarse SDF + Marching Cubes, Box-Greedy, 16³ LOD-Bricks | Höhlen, Unterseiten, schneidbare lokale Geometrie | **RESEARCH ONLY**: prüfen, ob bestehende Surface-/Destruction-Owner mit sehr lokal begrenzten SDFs profitieren; kein Main-World-Voxel-Pivot |
| Lokale Höhlenschnitte/Carver Sphere | Cartoon-Zerstörung + NPC-Flucht + Reparatur + Fluff | **DESIGN-DONOR**: zeitlich begrenzter Schnitt im INFINITRA-Post ist kein Beweis persistenter Zerstörung; KFB-Semantik wird unabhängig definiert |
| Serverautoritativer Zustand, double/cross-platform checks | späterer Multiplayer/Sharing | **HOLD**: nicht für Browser-MVP bauen. Double Precision allein garantiert keine deterministische Gleichheit; Vergleich braucht Testvektoren, quantisierte Algorithmen und klare Math-/RNG-Kontrakte |
| Globale Definition hot-swap | zukünftige Weltvarianten | **HOLD**: Migration versionierter Orts-IDs und gespeichertem Overlay erst klären; keine unangekündigte Neuplatzierung nach Generatorwechsel |

### Technische Konflikte mit dem aktuellen KFB-Owner
- Keine Neudefinition der KFB-Welt als Voxel-Raster, kein zweiter Terrain-, Straßen-, Audio-, Physics- oder World-State-Owner.
- Story/Place Composition bleibt **intent-first**: Story → Terrain → Siedlung/Funktionen → Wege → Bewohneraktivitäten. Eine makellos deterministische, aber sinnlose Straße wäre weiterhin ein Fehler.
- Das bestehende WS0/WS1-Spiel ist aktiv, nicht R4-STOP; Ziel ist **ein überprüfbarer Technikeinsatz im laufenden Spiel**, nicht eine alternative Engine.
- Existierender Plan `skills/chat/masterplan/KFB_PROCEDURAL_TERRAIN_WFC_OSM_LANDMARK_NPC_COMPOSITION_R1_2026-10-24.md` und der Research-LOD-Brief `replies/RESEARCH_THREEJS_LOD_PROC_WORLD_WS0_R1_2026-10-30.md` dürfen nicht durch Parallelplanung verdrängt werden.
- Aktuelles WS0 Register `WS0_STATE.md` (Stand 31.10., V-1077) macht `game/integration-r2` zum Stamm; keine alte „bis Sonntag“ Sperre neu erfinden. WS0 entscheidet konkrete Integrationszuordnung und Freigabe.

## 3 · Kleinster reproduzierbarer INFINITRA-inspirierter KFB-Test (nur vorschlagen)
**Fixture:** ein Seed, eine existierende 64-m-Zellen-Region mit Straße/Weg, mindestens einer Fluss-/Geländenaht, mindestens einem veränderbaren WorldObject und einem über LOD sichtbaren Prop; dieselbe Welt bei `world=endless`.
1. **Abfrage-Reihenfolge:** dieselben 3×3 Zellen als A→B, B→A und pseudozufällige Reihenfolge laden; prüfe WorldObject-ID, Art, Pose, Status, Zell-IDs, Route-/Wasser-Verbindung; eine abweichende Abfrage = FAIL.
2. **Netzwerkgrenze:** Straße und Fluss über mehrere Fenster unabhängig rekonstruieren, Endpunkte/Anker und Höhenkontakte vergleichen; keine offene Brücke oder Sackgasse ohne Ziel.
3. **LOD-Stabilität:** Ground/Drive/Flight, nahe→fern→nahe, ein und derselbe Seed/FOV. Ort und Identität jedes persistenten Props unverändert; nur Darstellung wechselt. Quelle/Gestaltungs-Golden sichtbar erhalten.
4. **Sparse Mutations/Save:** einen freigegebenen Zustand ändern (z.B. bereits vorhandene eingesammelte Karte oder reversibler Prop), wegfahren, Chunk evicten, neu laden, Save→frischer Start, gleiche Änderung unverfälscht. Andere unberührte Regionen erzeugen ohne neue persistierte Meshes. Destruction/Repair nur wenn aktueller Owner den Status bereits unterstützt; sonst **HOLD**, nicht Platzhalter vortäuschen.
5. **Generator-Revision:** nur isolierte Datenmigration-/ID-Studie; derzeit keine Produktions-Generator-Hot-Swap-Funktion als bewiesen ausgeben.
6. **Performance:** Zustandsspeicher, Compile-/Cache-Zeit, Frame p50/p95, Welt+Schatten+HUD, GPU falls messbar; Fokus/ruhiger Rechner. Keine neue 60-FPS-Behauptung.

**Negative Goldens:** identische Assets springen bei LOD, Hash hängt vom Chunk-Besuchsweg ab, persistente ID wird beim Regenerieren neu vergeben, gespeicherte Mutation erscheint in einem falschen Seed, gespeicherter Speicher enthält Weltmesh statt Ausnahmezustand, Fluss-/Straßennaht widerspricht sich.

## 4 · Gameplay vor Engine
INFINITRA-Autor nennt selbst „engine works; game not found“. KFB hat bereits konkrete Spielansätze: gelebte und veränderbare Orte, Residents/Mannequins, Propagandagebäude, Goo/Fluff, Karten, Reparatur. Ein wiederholbarer Ort mit Folgen ist produktiver als 1 Lichtjahr adressierbare Welt. Beispiel **nur als Fixture/Concept**: beschädigtes Gebäude → freigesetzte Residents → Reaktion/Flucht → gespeicherter Schaden → Wiederbesuch/Reparatur. Keine automatische Aufnahme in MVP-Required-Matrix oder Implementierung neuer Combat-/NPC-Logik durch diesen Donor.

## 5 · WS0-Handoff und nächster Gate
**WS0 liest zuerst** `WS0_STATE.md`, Register, aktuelle private `game/integration-r2`-/WS1-Heads, und den bestehenden Architektur-/Performance-Spike V-1042/V-1043. INFINITRA nur als **RESEARCH-KANDIDAT** einsortieren; eine erstrebenswerte Basis ist eine deterministische-Identitäts-und-Sparse-Save-Probe aus vorhandenen Modulen.
**Ein nächster Gate für den gemeinsamen Donor-Slice:** `WS0_EXISTING_WORLD_ASSET_DONOR_TRIAGE` — zusammen mit Polyfork an bestehenden messbaren World-/Asset-Nähten prüfen, anschließend KEEP/ADAPT/HOLD ohne neue Runtime. Keine zusätzlichen Georg-Fragen, keine neue V-Nummer ohne WS0-Entscheid.
