# WSA Integrationsplan R2 · eine spielbare Linie statt paralleler Ersatz-Runtimes
Status: PLAN / nicht integriert · 2026-09-30 · Owner: WSA/Web Lead · Basis: [Recon](./WSA_RECON_R2_2026-09-30.md).

## Kernentscheidung
Das nächste integrierte Spielziel ist **ein** freier, persistenter Bewegungs-Loop in derselben Welt: Ground → echtes Race-Drive → Ground → echtes Travel-Flight → Ground. Nicht aus J14 eine neue Engine bauen. Der Loop erhält anschließend Track Core/Clay/Sky und einen begrenzten Combat-Encounter. Jede Stufe bleibt rücknehmbar und behält genau einen Schreiber pro Bewegung/Schaden/Rendering.

### Verbindlicher Input-Kanon
- **Space** = Jump/Hop. Ein einzelner Space-Druck bleibt in allen Bewegungsmodi die Sprung-/Hop-Aktion.
- **I** = kontextuelles **Interact** für NPC, Car Enter/Exit, Prop und vergleichbare Weltinteraktionen.
- **Nur in Ground-Travel:** ein zweiter Space-Druck als Double-Space wechselt Ground → echtes Travel-Flight (WoW-artig). Das ist ein Travel-Mode-Handoff, **kein** Interact.
- Double-Space darf im Drive-Modus keinen Flight-Wechsel auslösen; dort bleibt Space Hop. Der genaue Double-Tap-Zeitrahmen gehört dem Travel/Input-Owner und wird nicht im Plan hartkodiert.
- Der spätere J14-Design-Abzweig „Space = Enter/Exit“ ist damit nicht kanonisch; dessen 20/20-Probe belegt nur diese temporäre falsche Key-Policy.

## Abhängigkeitsfolge
1. **Lock:** exakte Owner-Heads, Datei-/Blob-Pins, `INTEGRATION_LOCK.json`; geänderte Branches erneut lesen. J14, S15, P06, H13 und R0B als Donors/Candidates markieren.
2. **Ground ↔ Drive:** PR #294-Profil + `walk-controller` bleiben Ground; Race übernimmt Auto-Weltposition/Kontakt. Ein atomarer Mode-Handoff übergibt Transform, Heading, Oberfläche und Kamera; I Enter/Exit, Space Hop. Fehler rollt zurück. Zuerst nur Roundtrip und Reverse/Brake/Steer auf realer Kontaktgeometrie.
3. **Flight:** Travel PR #43/`carpet.js`/`camera-rig.js` übernimmt Flug und Kamera. J14-Jump ist keine Flight-Quelle. Ground↔Flight↔Ground mit Reload/Persistenz und ohne Teleport/Heading-Verlust; der Ground→Flight-Einstieg folgt dem Double-Space-Travel-Contract.
4. **Track/World/Look:** Track Core baut Fahrfläche aus einem Rezept; WFC/Hex liefert Verteilung und Assets, niemals Fahrphysik. K1/H0-Fassaden, K2-Material, T4-Props, TinySkies und geteilter Shadow-Contact kommen als separate Präsentationsmodule nach echten Donor-Isolationen. Sparse A/B gegen dieselbe Route; Performance nur mit gemessenem Frame-Pacing/Draw/Geometry/Startzeit beurteilen. MapLibre bleibt A/B Terrain-/Koordinatendonor, kein stiller World-Swap.
5. **Combat:** Combat-Owner CA2/KayKit ZIP binär prüfen, den unveränderten 60-s-Loop mit HUD und KayKit-Actor auf direkter Stage beweisen. Danach ein Ranged-Encounter als World-Adapter; Melee erst nach Resident/Blender-Paired-Clip-Nachweis.
6. **Persistenz/Abnahme:** erst eine neue direkte `kayfabizarro.pages.dev`-Prüfroute mit verifiziertem Build; kein Merge/Live vor Georgs benanntem Gate.

## Unabhängige, owner-getrennte Produktionsspuren
- **Motion/Resident:** Blender v6/370 + Fight-03-Daten → bestehender Resident S15 Consumer → echte Paar-Choreografie; ToolBox P06 separat regressionsprüfen. Geklärte Yaw-Felder in alle Consumer exportieren; kein zweiter Mixer.
- **Hex:** HEX-CATALOG-BAKE-01 (Registry/S0/S1 → `kfb.hex-tiles/1`) → fünf echte Blender-Bench-Objekte → Claude-Design-Look. 18 Lücken offen markieren, keine improvisierte Vollabdeckung.
- **Emanata/Cartoon Marks:** PR #256 als Donor, ein `semanticEvent → visualRecipe`-Vertrag mit Actor-/Prop-Ankern, Budget und Low-Fallback; Resident, Combat, World als getrennte Consumer. Niemals Schaden/Emotion/Beziehung aus dem VFX ableiten.
- **Billboard/Karten:** realer 12-Karten-Browser-Bake + Site-R3-Upload → B1/B2a konsumiert H456-Rezept und H13/H14-Bilder/Loop, keine Live-PDF-Seiten pro Cut. H13 bleibt Design-Gold, H14 deterministischer Export. Rechte je Bild/Film vor Commit.
- **img2threejs:** A1 Browser-Gate; A2 ein echtes Prop; weitere Karten/Billboards/Gebäude erst nach jeweiliger Quelle-/Kostenprüfung. Offline-Authoring, kein Game-Renderer.

## Stop-/Rollback-Regeln
Ein doppelter Positions-/Physik-/Damage-Owner, ungepinnter Donor, verwechselte Yaw-Konvention, nicht nachweisbarer Browserstand oder eine zweite gleiche Reparatur ohne Fortschritt stoppt den Slice. Kandidat/Tests bleiben erhalten; Timeout = UNKNOWN, zuerst Ref/Receipt prüfen. Minor-Defekte isolieren statt den MVP-Loop zu blockieren. Keine neue Georg-Rückfrage für technische Tabellen; nur ein sichtbarer, echter Produktentscheid.

## Priorität und Kosten
**P0:** Ground↔Drive auf Sol-6 High (WSA). **P1:** Flight-Handoff und spielbarer Track/Clay/Sky-Loop. **Parallel, aber getrennt:** laufende Claude-Design-Jobs erhalten nur Deltas; Web-Chat bacht kleine Site-first Artefakte; Blender korrigiert Messdaten. Astra erst bei einem begrenzten räumlichen Multi-Actor-/Combat-Konflikt nach P0-Beleg. Keine Massendeploys oder hundert Einzelfile-Commits.

Genau ein nächstes WSA-Implementierungs-Gate: `INTEGRATION_LOCK.json` auf frisch verifizierten Heads plus **Ground→Drive→Ground** in einem World-State, mit Single-Writer-Trace und ohne Teleport. Flight/Combat erst danach.
