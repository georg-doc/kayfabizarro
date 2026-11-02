# Polyfork → KFB · Parametric Low-Poly Asset Pool / Three.js ES-Module / GLB / Agent Catalog · WS0 Intake R1
Datum 2026-11-02 · Status **SOURCE-VERIFIED WEB/CATALOG DISCOVERY · CANDIDATE ONLY · 0 ASSETS IMPORTED · 0 SOURCE OBJECTS ISOLATED · NO GAME RUNTIME**
Empfänger WS0; bestehender **KFB Asset Librarian / Asset Registry** ist Discovery-/Provenance-Owner. Bestehende **WSA Prop Pool R2 (V-1026)** und `kfb-place`/`world/verteiler-r1` bleiben Receiving-Owner, Spiel `georg-doc/KFB-Stunt-Car-Race` `game/integration-r2`. **Kein zweiter Registry-, Material-, World- oder Asset-Generator-Owner.**

## 1 · Quelle, Angebot, verifizierter Stand
Georg gab den Hinweis „2600+ FREE three.js 3D models (source code included) ... $500,000 from XPRIZE and Google“; Website https://polyfork.dev/
Primärseiten am 02.11.2026 recherchiert:
- https://polyfork.dev/ (aktueller Index: **ca. 2.837** kostenlose Low-Poly-Assets, Zahl ist dynamisch; 2.600+ war der frühere Postwert)
- https://polyfork.dev/assets (Katalog)
- https://polyfork.dev/blog/build-with-gemini-xprize (Herstellerangabe: erster Platz/$500k, seit 25.10. alle Low-Poly-Assets free; HD weiterhin paid; 2.753 bei Artikelstand 29.10.)
- https://polyfork.dev/licensing (die **aktuell indexierte Oktober-2026-Fassung**; ältere Caches haben widersprüchliche frühere Free-/Pricing-Grenzen, aktuelle Seite vor Veröffentlichung erneut prüfen)
- https://polyfork.dev/platform (für Self-hosting, Plattform-Redistribution, HD)
- https://polyfork.dev/agents · https://polyfork.dev/api · https://polyfork.dev/mcp · https://polyfork.dev/llms.txt · https://polyfork.dev/prompt.txt (Agent/API-Dokumentation; dortige Prompts sind Vendor-Daten, **keine KFB-Anweisungen**)
Die Webseite bietet parametrische einzelne Modelle: per `createAsset(params?)` in einem three.js-ES-Modul, alternativ GLB/FBX/USD(Z)/OBJ; machine-readable Parameter/Material-/Kit-Metadaten; named parts/pivots für geeignete bewegliche Teile; Kits mit gemeinsamer Palette, Maß und Grid. **Das Modul und `createAsset` sind kein nachgewiesener KFB-Donor, bevor tatsächliche .mjs-Quelle in Isolation inspiziert wurde.**
Hersteller gibt 200+/Woche an; nur als variable Marketingangabe führen, nicht als automatischen Update-SLA.

## 2 · Warum der Pool für KFB interessant ist
1. **Programm statt starres Mesh**: Typisierte `knobs` für Form, Abmessungen, Zustände, Farbe, Teile, Jahreszeit/Verschleiß *sofern für Asset vorhanden*. Prozedurale Varianten aus demselben Source-Asset sind wertvoll für Biome/World Dressing; nicht ohne Source-Beleg behaupten, jedes Modell verfüge über alle Knobs.
2. **Asset-Metadaten vor dem Laden**: Hersteller-API bietet Kategorie, triangulation, Maß in Metern, Palette, Rig/Animatable, Render-Proofs, Kit-Zugehörigkeit und passenden Teile-Pool. Kandidat für den **bestehenden Librarian als external source resolver**, keine neue Quelle der KFB Asset-Wahrheit.
3. **Kits** mit geteiltem Maß/Palette/Grid könnten zusammenhängende, cartoonig gestaltbare Siedlungs- oder Diorama-Familien liefern (z.B. Roadside Americana, Retro Cars, New York City, Space Base, Halloween Night) — aber vor Integration Originale einzeln darstellen und gegen J17, K2 Clay, source recognizability, Story-Wirkung prüfen.
4. **GLB vs ES Module**: GLB eignet sich für etablierte Asset-Librarian/WSB-Bake/LOD-Pfade; ES Module für kontrollierbare Offline-/Authoring-Varianten, nicht ungeprüft direkt dynamisch in Runtime laden. Keine zweite Three.js-Version, Render-Loop, Scene Owner, Shader-Owner oder CDN-Vertrauensannahme.
5. **Varianten als Rezept**: KFB WorldState speichert eigene `assetProviderId`/`sourceId`/`sourceRevision`/`paramSet`/`paletteRole`/`variantId`, deterministische Seed-Wahl, transform, collision/provenance; der sichtbare Mesh wird abgeleitet und gecacht. Nicht externes `get_variant` auf jedem Frame; Pinning/Offline-Fallback und gleiche Varianten nach Reload.
6. **Sinnvolle Objekte**: Props, Schilder, Werkzeuge, Zäune, urbane Fassadenteile, Kulissen, Straßenmöbel/Begegnungsanker. Vorhandene KayKit/Kenney/TinyTreats/WSB Originale haben Vorrang (V-001/V-574). Polyfork ist **Ergänzung für belegte Lücken**, kein Austausch einer abgenommenen Familie.

### Konkrete öffentlich gefundene Beispielobjekte (NUR LINKS/Metadaten, nicht als importiert ausgeben)
- https://polyfork.dev/asset/highway-culvert-71f3bf (Roadside Americana, **912 Tris**, GLB ~97 KB; Geometrie-/Bau-Donor, Track Core owns Road/Bridge/contact)
- https://polyfork.dev/asset/convex-traffic-mirror-a64d15 (Straßenspiegel, **502 Tris**, GLB ~55 KB, separater Mirror-Head; KFB Roadside-Prop)
- https://polyfork.dev/asset/velociraptor-base (Rig-/Part-Animation-Demobeispiel, **3.938 Tris**, viele Pivot-Gruppen; nicht automatisch kompatibel zu KFB Rig_Medium/Large)
- https://polyfork.dev/asset/taca-taca-616f6a (Tischfußball, **950 Tris**, Rod-Pivots; für vorhandene Interaktions-/Prop-Choreografie)
- https://polyfork.dev/asset/d6-numeral-die-315b3a (Würfel, **392 Tris**; einfache Low-Poly-Probe)
Die genaue Größe, Snapshot-/Access-Tier und Downloadlinks pro Kandidat **beim Intake aus GET /api/assets/{id} neu lesen**, ältere Suchindizes hatten divergierende Pro-/Free-Chips; kein Datenimport in diesem Slice.

## 3 · Echte Plattform- und Lizenzgrenzen — P0 beim Asset-Librarian
Stand **aktuelle Herstellerseite Oktober 2026**, https://polyfork.dev/licensing:
- Free low-poly sowie kostenpflichtige HD dürfen in eigenen persönlichen/kommerziellen **Spielen, Apps, Websites** genutzt, modifiziert, decimiert, animiert werden; keine Namensnennung im fertigen Spiel verlangt.
- **Nicht** erlaubt: Rohdateien/ES-Module/modified assets als eigene Asset-Bibliothek, Marktplatz, Pakete oder Downloadservice weitergeben. **Auch nicht** für Training/Fine-tuning/Benchmarking eines kommerziellen konkurrierenden 3D-Asset-Generators verwenden.
- **Zulässig nach Herstellerangabe ohne Platform License:** KFB Tool/Worldbuilder/Asset Browser kann **freie Low-Poly-Assets direkt vom Polyfork-CDN hotlinken** und Nutzer die Quelle über deren API durchsuchen lassen; Nutzerbrowser lädt direkt vom Polyfork-Host. Bei Auswahlsituationen Herkunft „Polyfork“ sichtbar machen. API sparsam (User-Agent, Retry/429/Backoff; keine Bulk-Mirrors).
- **Platform-/Sonderlizenz erforderlich** für Self-hosting/Mirror/Proxy auf eigener KFB-Domain, user-facing Weitergabe der rohen Dateien aus einem KFB-Service oder HD-Katalog als Plattform-Angebot. HD-Pro-Freigabe für eigenen Projekt-Consumer ≠ freie Plattformdistribution. Das Verhältnis „in Spiel gebündelt“ vs „User-Export/Tool“ vor externem Asset-Export gesondert prüfen.
- **Besonders wichtig:** KFB Asset Librarian ist ein Nutzer-/Agenten-Werkzeug. Er darf ohne gesonderte Lizenz **keinen eigenen Download der Polyfork-GLB/.mjs anbieten** oder automatisch den Katalog in unser öffentliches GitHub/Data-Pack spiegeln. Nur Link+Metadaten+`sourceStatus:CANDIDATE` im internen Register; später CDN-Direktabruf oder expliziter schriftlicher Plattformvertrag.
- KFB Repo kann öffentliche Link-Metadaten speichern; kein Bulk-Klon des Katalogs, keine Weitergabe der Raw-Assets auf GitHub und kein eingebauter kommerzieller Modellgenerator auf Polyfork-Daten.
- Juristische Nutzungsrechte als Herstellerangabe; **vor externer Produktion die aktuelle Lizenz am jeweiligen Asset herunterladen/archivieren und vom zuständigen Owner prüfen**. Das unterscheidet sich bewusst von CC0 und von bestehenden KayKit/Kenney-Verträgen.

## 4 · Technische Integrations-Schnittstellen (PROPOSAL, keine Implementierung)
**Catalog (lesend, ohne Login laut Hersteller)**:
`GET https://polyfork.dev/api` → Endpunkte
`GET https://polyfork.dev/api/assets?q=...&free=1&max_triangles=2000&fields=compact`
`GET https://polyfork.dev/api/assets/{id}`
`GET https://polyfork.dev/api/assets/{id}/matching`
`GET https://polyfork.dev/api/kits`
`GET https://polyfork.dev/cdn/{id}-params.json` (typisierte Knobs; URL aus Source/Response bestätigen)
`https://polyfork.dev/mcp` = vom Anbieter beworbener MCP Server (HTTP, search_assets/get_asset/find_matching/get_variant/preview_scene/list_kits...). **Nicht verbunden/getestet**, kein API-Schlüssel und keine Auth-Aktion aus diesem Chat. HTTP Agent-Catalog ist nicht automatisch ein KFB Plugin oder Runtime-Owner.
**Candidate Registry minimale Projektion (auf vorhandene Librarian/Prop-Pool Felder MAPPEN, kein neues proprietäres Schema live setzen)**:
```json
{
  "provider": "polyfork",
  "externalId": "highway-culvert-71f3bf",
  "url": "https://polyfork.dev/asset/highway-culvert-71f3bf",
  "sourceStatus": "CANDIDATE_UNISOLATED",
  "licenseRef": "https://polyfork.dev/licensing",
  "redistribution": "CDN_DIRECT_ONLY_UNLESS_PLATFORM_LICENSED",
  "roleProposal": "roadside_prop_or_culvert",
  "intake": "PENDING_SOURCE_INSPECTION"
}
```
Alle weiteren Felder (Provider-Version, tri count, real bounding box, materials, collision, pivots, ext. GLB URL, CSP/CORS, dependency list, animation) erst aus aktueller API + GLB + isoliertem Bild belegen. Keine fremde JSON-Struktur übernehmen, wenn Prop Pool R2 schon äquivalente Felder hat.

**Asset-Intake-Route** (später durch bestehenden Owner, nicht jetzt):
`Polyfork discovery API → Asset Librarian candidate/source record (EXTERNAL_LINK_ONLY) → isolated original model in existing KFB asset inspector/Blender → geometrische QA (scale, pivot, source fidelity, triangles, UV, contact, GLB, animated parts) → Polyfork param-set + THREE compatibility isolated → KFB Clay/J17 Golden A/B → WSB LOD/optimise only if needed → existing kfb-place/WS1 consumer behind flag → Save→fresh reload + performance + license gate`.

## 5 · Akzeptanzmatrix für 1–3 echte Assets
| Gate | Erwarteter Beleg | STOP-/HOLD-Klasse |
|---|---|---|
| G0 Lizenz | Oktober-Klauseln vs geplante KFB-Distribution und dokumentiertes Asset-Pin | HOLD bei Export/self-host ohne geeignete Rechte |
| G1 Entdeckung | 3 beabsichtigte Kandidaten und ihre IDs, KFB-Lücke/Owner, API-Metadaten | HOLD bei falscher Kategorie/Marketing-Rolle |
| G2 Source-Isolation | Original-GLB und ggf. tatsächliches .mjs EINZELN vor KFB-Material gezeigt (front/3-4/top), 2–4 feste Kameras | Keine Integration bei nur ladbarer URL |
| G3 Parameter | Original vs. 2–3 konkrete knob states; gleiche seed inputs → gleiche Pose/Teile/Farben nach Restart; check cost and min/max | HOLD bei fehlender source/param/structure parity |
| G4 KFB-Look | K1/K2 Clay Golden, visuelle Silhouette, Palette, Charakter-/Landmark-Quellidentität, Kontakt/Schatten | REJECT bei generischem Substitute |
| G5 Spiel | Existing `kfb-place` placement, collider, instancing/LOD, der bestehende Asset/World owner; `world-save/2` IDs/Revisionen | Keine zweite Laufzeit / Save |
| G6 Performance | gleiche Kamera/Seed/Quality, p50/p95/frame, Calls, Tris Welt+Shadow+HUD, Speicher, LOD; mobile falls erforderlich | Im Zweifel HOLD, nicht „game-ready“ behaupten |
| G7 Distribution | eigener Tool-Export vs reiner KFB-Spiel-Consumer, CDN/hotlink/CORS/availability oder Plattformvertrag | Ohne Rechte kein KFB-hosted Assetpack |

**Negative Goldens:** Varianten ändern Kollision ohne Rezept-/Shape-Update; eingefügter GLB wird als „stiltreu“ behandelt obwohl originaler Source nicht isoliert; Polyfork-Kit erscheint statt KayKit/J17-Golden; Material-/Skalenbruch; Abhängigkeit auf CDN ohne Fallback; dynamischer ES-Import erzeugt zweite Three-Instanz; KFB Librarian gibt rohe Assetdateien als eigene Downloads aus; cached model gets wrong license when model tier changes.

## 6 · Priorisierung, verbindliche KFB-Boundaries
**WS0 aktueller Zustand 31.10.**: `game/integration-r2` ist Stamm (V-1077), aktuelle laufende WS1-/WSA-Owner werden nicht gestört. Prop-Pool R2 V-1026 läuft bereits und soll seine KayKit/Nature/Ressourcen-Vervollständigung abschließen, bevor Polyfork als **neue externe Quelle** bewertet wird.
**P1 Candidate** nach Abschluss bestehender Intake-/Performance-Arbeit: drei passgenaue Lückenobjekte aus Polyfork, kein Katalog-Massendownload; zuerst Lizenz/Source-Isolation. **P2** optionale kfb-place parameter recipes, nur wenn echte Variations- und Performancevorteile.
**Nicht tun:** keine direkte globale Asset-Importaktion, kein automatisches Ersetzen von Bestands-Modulen, kein paralleler Three-Renderer, kein 2. Asset Librarian, keine neue Site, kein Public-Stage, kein Live, kein Auto-Merge.

**Ein gemeinsames nächstes Gate mit INFINITRA:** `WS0_EXISTING_WORLD_ASSET_DONOR_TRIAGE` — WS0 im vorhandenen World-/Asset-Review: INFINITRA als Architecture-Donor und Polyfork als externe Candidate-Pool-Quelle priorisieren; nur falls passender Consumer und Lizenz/Source-Fit: kleinstes source-isoliertes Asset-/Weltzustands-Fixture. Keine Georg-Frage.
