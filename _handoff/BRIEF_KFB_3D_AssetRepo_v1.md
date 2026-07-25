# BRIEF — KFB 3D World-Assets & Voxel-Worldbuilder (Standalone, autonom)

**Komplettes Standalone-Briefing für einen Claude-Design-Job, der selbstständig durchläuft.** Kein
kleinschrittiges Abnehmen, keine Screenshots-vor-Ausgabe für Georg. Am **Ende** ein bootbares Ergebnis +
Manifeste + **ein** Beleg-Bild pro Slice. Autonomie = eigenständig, **nicht** regellos — Guardrails (§9)
gelten hart. Dieses Dokument ist selbsttragend; alles Referenzierte liegt im Repo oder wird per URL geladen.

---

## 1. Das große Bild — DREI Asset-Ebenen in EINEM App-Index
Das Fundament ist ein **einziger Laufzeit-Index**, in dem alles adressierbar ist und **auf Zuruf**
konfiguriert/zusammengebaut werden kann. Drei Ebenen, klare Rollen:

1. **Kenney-GLBs** — Streuung / Requisiten / Detail (Bäume, Fässer, Kleinkram). Quelle: `catalog.json`
   (2776 Assets, 42 Packs).
2. **KFB-Texturen** — das Material. Liegen kanonisch in **`media/3D_Assets/KFB/`**: `edge1.png`,
   `edge2.png`, `edge3.jpg` (Kanten-Varianten), `brick_diffuse/bump/roughness.jpg` (PBR-Wand),
   `water.jpg` + `waterdudv.jpg` + `waternormals.jpg` (Wasser), `noise.png`, `alphaMap.jpg`,
   `tri_pattern.jpg`. **`edge3.psd` und `test` bleiben draußen** (Quelle/leer).
3. **Voxel-Konstrukte** — native Architektur/Landmarken, gebaut aus **derselben Box-Sprache wie das
   Terrain** + den KFB-Texturen (Mauern, Türme, Plateaus, King Tower, Graveyard-Strukturen). Neu.

**Prinzip:** Kenney = Streuung. Voxel-Konstrukte = Architektur. Beide teilen sich denselben WebGL-
Renderer, dieselbe Story-Palette, denselben Seed → **eine** Welt, keine aufgeklebten Requisiten.

## 2. Was schon existiert — anreichern/andocken, NICHT neu bauen
- `CATALOG/catalog.json` (2776 Assets: `name,pack,path,category,subcategory,animations,size,footprint_xz,
  preview,scores`) · `CATALOG/github_status.json` + `GH_PACKMAP` (welche Packs live auf GitHub, welcher
  Pfad — **nur GitHub-verfügbare platzieren**, Rest „pending upload").
- `world-context.js` — `makeWorldContext({cardTriplet, storyMode, seeds})` → `{biome, storyMode, accent,
  palette, params, audio, anchors, seed}`.
- `voxel-terrain.js` — Chunk-Baking, `groundHeightAt(x,z)`, `surfaceInfo`, `setWorldContext`.
- `asset-browser.html` — Katalog-Browser (grün/grau, Zwei-Spuren-URLs).
- WebGL, three 0.160 (wie Pet + Terrain + Reise).

---

## 3. Slice-Reihenfolge (die Sprint-Leiter)
Kleinste bootbare Scheibe zuerst, jederzeit bootbar. **In dieser Reihenfolge:**

### Slice 0 — Der App-Asset-Index (das Fundament, ZUERST)
Alle drei Ebenen im Laufzeit-Kontext verfügbar + auf Zuruf konfigurierbar. Baue:
- **`asset-repo.json`** — `catalog.json` **angereichert** (nicht ersetzt): pro Kenney-Asset zusätzlich
  `biomes[]`, `storyModes[]`, `role` (anchor/satellite/scatter/prop), `naturalScale`, `ghUrl` (RAW).
- **`kfb-textures.json`** — die KFB-Texturen aus `media/3D_Assets/KFB/` als benannte Material-Sets
  (`edge` = [edge1,edge2,edge3], `brick` = diffuse+bump+roughness, `water` = water+dudv+normals,
  `noise`, `alpha`, `tri`), je mit RAW-URL.
- **`constructs.json`** — Voxel-Konstrukt-**Blueprints** (siehe Slice 2), zunächst leer/erste Einträge.
- **Runtime-API** `asset-index.js`: `getAsset(id)`, `getSet(theme|biome)`, `getTexture(name)`,
  `buildConstruct(blueprintId, {anchor, rotation, palette})`. So werden **Mauern/Türme/Stücke aus
  verschiedenen Sets auf Zuruf zusammengebaut**.
- **Abnahme:** die App kann jedes Asset/Textur/Konstrukt per id auflösen und eine RAW-URL liefern.

### Slice 1 — Texturen anwenden
Die KFB-Texturen auf Terrain-Boxen **und** (Vorbereitung) Konstrukte legen: `brick`-PBR als Wand-Material,
`edge1/2/3` als Kanten-Look, `water`-Set für Wasserzonen. **Variation gegen Monotonie (der Kernpunkt):**
- edge-Variante **per Instanz/Fläche zufällig** aus [edge1,edge2,edge3] wählen,
- **Tint** aus der Story-Mode-Palette der Zone,
- **UV-Rotation/Scale/Offset** + `noise.png`-Dither per Instanz-Seed.
Eine kleine Textur-Menge × 6 Story-Farben × Instanz-Variation = viel Look aus wenig. **Abnahme:** eine
Zone wirkt sichtbar variiert, nicht gekachelt.

### Slice 2 — Voxel-Konstrukt-Format + ein Beispiel in-context
- **Blueprint-Format** (Daten, kein Code): ein kleines 3D-Gitter aus Zellen → `{box, colorRole,
  texture(edge|brick), variationSeed}`, platzier-/rotierbar an einem Welt-Anker, gebacken im selben
  Instancing wie das Terrain (gleicher Shader/Palette/Fog).
- **Ein signature Konstrukt** bauen — **King Tower** (Zentrum) **oder** eine Zonen-Plateau — in der
  echten Terrain-Szene, mit den KFB-Texturen. **Navigierbarkeit ist Bedingung:** freie An-/Abflug-Bahnen,
  King Tower umrundbar, Plateaus mit klarer Auffahrt. **Abnahme:** liest sich als Teil der Welt.

### Slice 3 — Flug-Integration
Die Konstrukte/Zonen im Reise-Modus anfliegbar; `flight-controller`/`walk-controller` unverändert reusen,
Höhe über `groundHeightAt(x,z)` inkl. der Konstrukt-Oberflächen. **Abnahme:** man fliegt um den King Tower,
landet auf einem Plateau.

### Slice 4 — Kenney im Szenario (Graveyard)
Erster echter Anwendungsfall: Kenney-Graveyard-Assets über das Streu-System (Biom + Rezept + Seed) in
eine **Graveyard-Zone** setzen — Anker + Trabanten, Cluster, freie Bahnen, story-mode-farbig, mit
Voxel-Konstrukt-Mauern aus Slice 2. **Abnahme:** eine begehbare/befliegbare Graveyard-Zone, designt.

---

## 4. Streu-Logik (gilt ab Slice 4, Modul `asset-scatter.js`)
Aus dem WorldContext einer Zone (`biome, storyMode, seed`): wählt Asset-Set (Biom→Rezept), Dichte und
**Platzier-Regeln** — **nicht** gleichverteilt: Anker + Trabanten, Cluster, Dichte-Verläufe, freie Ränder.
Instanziert (ein Draw-Call je Typ), Streu-Punkte per **Raycast auf das echte facettierte Mesh** (nicht die
glatte Formel, sonst schweben Stämme). Karten-Injektion: bestimmte Karten setzen feste Landmarken an ihren
Wegpunkten. Deterministisch per Seed (gleiche Karte → gleiche Welt).

## 5. Asset-Browser-Anbindung
- Marker/Filter für `biome`, `storyMode`, `role`, `decalReady`, **Set** (kenney/kfb-texture/construct)
  neben grün/grau.
- **Detailansicht: 3D-Vorschau** (machbar) — kleiner three.js-GLB-Viewer im Panel (WebGL 0.160, GLB via
  RAW-URL, OrbitControls, RoomEnvironment, lazy; `preview`-Bild als Fallback), optional mit Decal/Textur-
  an-aus.

## 6. Perspektive (nicht dieser Sprint): Worldbuilder vX
Später wird aus `constructs.json` + einem **Zonen-Manifest** (Plateau-Form + Palette + Konstrukte +
Streu-Rezept + Karten-Injektionen + Wasser-Flag) ein KISS-Placer. Dann ist jede Welt nur ein Manifest:
DocCheck-Voxel-Hospital, Wasser mit Pirateninsel, Käse-Mond-Basis. **Editor/Placer erst, wenn Format +
ein Konstrukt + ein Szenario stehen.** Nicht in diesem Sprint bauen.

## 7. Kanonische Pfade
- KFB-Texturen: `media/3D_Assets/KFB/` (RAW-URL). edge1/2/3, brick_*, water*, noise, alpha, tri.
- Kenney: `media/3D_Assets/` (Packs laut `GH_PACKMAP`; nur live-verfügbare platzieren).
- Manifeste (`asset-repo.json`, `kfb-textures.json`, `constructs.json`) → in `SOT_REGISTRY.md` eintragen.

## 8. Nicht anfassen
`flight-controller`, `walk-controller`, `card-carrier`, `pet-kinetics`, Pet-Stack; `world-context.js`/
`voxel-terrain.js`-Interna (v3-Gehirn) nur andocken, nicht umschreiben; `catalog.json` nur anreichern.

## 9. Guardrails (hart, trotz Autonomie)
- **WebGL, three 0.160, ein Renderer/Build.** Kein WebGPU/TSL.
- **Assets über RAW-URL** (`raw.githubusercontent.com/georg-doc/kayfabizarro`), nie `./assets/`. Nur
  GitHub-verfügbare Assets platzieren; lokale als „pending upload" listen.
- **IP:** nur öffentliche KFB-Assets, keine med-privaten Inhalte.
- **Kein Datei-Löschen/-Verschieben** (macht nur Georg). Produzierte Manifeste in `SOT_REGISTRY.md`.
- **Export-Budget:** keine Datei > 2 MB im Export; Schweres per RAW-URL. `.psd`/`test` nie referenzieren.

## 10. Selbst-Verifikation (statt Zwischen-Abnahmen)
Pro Slice selbst prüfen und erst dann liefern: bootet ohne Konsolenfehler in **Chrome UND Firefox**;
Index löst Assets/Texturen/Konstrukte per id auf; Textur-Variation sichtbar (nicht gekachelt); Konstrukt
liest sich als Teil der Welt und ist navigierbar; Graveyard-Zone wirkt designt. Am Ende **ein** Beleg-Bild
pro Slice + eine Kurz-Notiz (was gebaut, welche Assets „pending upload").
