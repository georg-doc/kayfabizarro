# SPRINT — KFB 3D World-Assets & Voxel-Worldbuilder

**Living Document. Ein frischer Chat liest DIESE Datei zuerst, dann `HOUSEKEEPING.md`.**
Stand: 2026-07-25 · Quelle: `_handoff/BRIEF_KFB_3D_AssetRepo_v1.md` (Repo, RAW)
Cockpit zum Anschauen: `KFB 3D Asset Repo.dc.html`

---

## 1 Das Ziel in drei Sätzen

Ein **einziger Laufzeit-Index**, in dem drei Asset-Ebenen adressierbar sind und auf Zuruf
zusammengebaut werden können: **Kenney-GLBs** (Streuung, Requisiten), **KFB-Texturen** (das
Material), **Voxel-Konstrukte** (native Architektur aus derselben Box-Sprache wie das Terrain).
Kenney = Streuung, Voxel = Architektur; beide teilen Renderer, Story-Palette und Seed — **eine**
Welt, keine aufgeklebten Requisiten. Am Ende jeder Slice: bootet, ein Beleg-Bild, eine Kurznotiz.

## 2 Arbeitsregeln (hart, auch bei Autonomie)

- **WebGL, three 0.160, ein Renderer/Build.** Kein WebGPU, kein TSL. (Zwei Motoren = unsichtbarer Mund/Textur — teuer gelernt.)
- **Assets nur per RAW-URL** `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/…`, nie `./assets/…`. Nur **GitHub-verfügbare** Assets platzieren; alles andere als „pending upload" listen.
- **Nicht anfassen:** `flight-controller`, `walk-controller`, `card-carrier`, `pet-kinetics`, Pet-Stack. `world-context.js` / `voxel-terrain.js` nur **andocken**, nicht umschreiben. `catalog.json` nur **anreichern**, nie ersetzen.
- **Kein Löschen, kein Verschieben** — das macht nur Georg, einzeln freigegeben.
- **Export-Budget:** keine Datei > 2 MB im Export. `.psd` und `test` nie referenzieren.
- **Selbst-Verifikation statt Zwischenabnahme:** bootet in Chrome **und** Firefox, ohne Konsolenfehler, Index löst per id auf, Variation sichtbar, Konstrukt navigierbar.
- Neue Manifeste in `skills/SOT_REGISTRY.md` eintragen (Repo).

## 3 Die Slice-Leiter

| # | Slice | Status | Definition of Done |
|---|---|---|---|
| **S0** | **App-Asset-Index** (Fundament) | **FERTIG (2026-07-25)** | App löst jedes Asset / jede Textur / jedes Konstrukt per id auf und liefert eine RAW-URL — Resolver im Cockpit ist der Beweis |
| S1 | Texturen anwenden (Variation) | **FERTIG (2026-07-25)** | Eine Zone wirkt sichtbar variiert, nicht gekachelt — Regler `Variation` 1 → 0 ist der A/B-Beweis |
| S2 | Konstrukt-Format + ein Signature-Konstrukt | **NÄCHSTES** | King Tower (oder Zonen-Plateau) liest sich als Teil der Welt **und** ist navigierbar |
| S3 | Flug-Integration | OFFEN | Man fliegt um den King Tower, landet auf einem Plateau |
| S4 | Kenney im Szenario (Graveyard) | OFFEN (Assets stehen) | Begehbare/befliegbare Graveyard-Zone, die designt wirkt |

### S1 — Texturen anwenden · was gebaut ist

**`kfb-box-material.js`** — die Variations-Schicht, wiederverwendbar für Terrain **und** Konstrukte:
`loadKfbTextures()` (edge×3, noise, brick-PBR, water — Adressen aus `kfb-textures.json`),
`makeVariedBoxMaterial()` (MeshStandardMaterial + `onBeforeCompile`, kein zweiter Shader-Pfad),
`makeBoxGeometry()`, `writeVariation()`, `tintFor()`.

Variation pro Instanz, alles über Instanced-Attribute (kein Rebake):

| Achse | Umsetzung |
|---|---|
| edge-Variante | Instanz landet per `hash32` in einem von drei Buckets → 3 Draw-Calls statt 1 Textur für alle |
| Helligkeit | pro Cube (`aKfb.y`), Regler „Helligkeit-Streuung" |
| Sättigung | pro Cube (`aKfb.z`) |
| Tint | `setColorAt` aus `STORY_PALETTES` über die Höhen-Rampe, minimaler Hue-Jitter |
| Körnung | `noise.png` in **Welt**-Skala (nicht per Face), Stärke per Instanz (`aKfb.w`) |
| Texel-Dichte | `aKfb.x` = Säulenhöhe → Seitenflächen bleiben quadratisch, keine Schlieren |

**`KFB Voxel Zone S1.dc.html`** — die Abnahme-Szene: 30×30-Zone (956 Instanzen, **5 Draw-Calls**,
120 fps), 6 Story-Modi live umschaltbar, Regler für Variation / UV-Streuung / Körnung / Biom-Tint,
Mauer-Patch aus `brick`-PBR **mit Tor-Lücke** (Navigierbarkeit ist ab S2 Bedingung),
Wasserfläche aus dem `water`-Set. Docking: `STORY_PALETTES` + `MODES` aus `terrain/world-context.js`,
Texturen über `asset-index.js` — kein relativer Pfad.

**Look-Korrektur nach Review (2026-07-25, 2. Anlauf).** Der erste Anlauf hat die Variation über
**UV-Spiele** gemacht — Rotation, Offset, Scale pro Instanz — und brick als Foto-PBR pro Box-Fläche
gemappt. Ergebnis: gekippte, verschobene Muster, Schlieren an hohen Säulen, 20 Ziegelreihen pro
Würfel. Georgs Urteil: unbrauchbar (Wasser ausgenommen). Das kanonische Rezept steht in
`voxel-terrain.js` und macht es anders:

```
col *= texture2D(uEdge, uv).rgb          // Textur MULTIPLIKATIV als Kanten-Layer
col *= (brightMin + rand * brightRange)  // Variation aus WERT, nicht aus UV
+ Sättigungs-Jitter + 3-Stop-Story-Ramp
```

Danach umgebaut: **keine UV-Rotation, keine Offsets**, Textur nicht an `material.map` sondern
selbst gesampelt und in Stärke regelbar (Kontrast auf 55 % gedämpft = Papertoy statt Fotomaterial),
Texel-Dichte über die Säulenhöhe kompensiert, Körnung in Welt-Skala. **brick läuft über
Welt-UV (triplanar)** — durchlaufend über die ganze Mauer, immer aufrecht, Ziegel ~0,2 Einheiten
statt Briefmarken-Raster. Merksatz: *in der Box-Sprache variiert man Werte, nicht Orientierungen.*

**Look-Korrektur 3. Anlauf (Streifen / Glitch-Flecken).** Reviewbefund: edge1/2 liefen auf hohen
Säulen als Streifen durch (`repeat.y` angeschnitten), die Farbstufen pro Würfel lasen als Glitch,
brick war zu kleinteilig. Fixes: **ganze** Kachel-Wiederholungen (`floor(h+0.5)`), Helligkeit/Sättigung
aus einem **niederfrequenten Ortsfeld** statt aus Instanz-Zufall (Nachbarn hängen zusammen),
prozedurales Welt-Noise für Flecken (wiederholt nie), **Cel-Bänder** (4 Luminanzstufen) als Regler,
brick-Maßstab von 0,6 auf 0,24 (Ziegel ~0,5 Einheiten), Default `nur edge3` — die getestete Kachel.
Das Textur-Denkmodell dahinter: **`docs/TEXTUR_KONZEPT_voxel.md`**.

**Kurswechsel 4. Anlauf — Material-System statt Textur-Bau (Georgs Einwand, umgesetzt).**
Kleinteilige Foto-Texturen funktionieren auf Entfernung nicht und passen nicht zur Box-Welt.
Jetzt: **sechs prozedurale Basis-Materialien im Shader** (karton · ton · filz · stein · papier · glatt),
alle in Welt-Koordinaten (keine Wiederholung, kein Download), alle unter derselben **Kanten-Fassung
aus edge3** — das ist die visuelle Klammer. Terrassen tragen das Material (Zuordnung aus Ortsfeld +
Höhe), nicht einzelne Würfel. Harte Cel-Stufen ersetzt durch **weiche Wert-Bänder** (Regler).
Die Mauer läuft im selben System (Material `stein`) statt als Foto-Ziegel → liest als Architektur
derselben Welt. Foto-Maps sind auf einen Regler `Foto-Fleck-Layer` (default 0) degradiert.
Denkmodell + nächste Schritte (Licht statt Textur): `docs/TEXTUR_KONZEPT_voxel.md` §5–6.

**5. Runde — die Fassung wird prozedural, das System ist PNG-frei.** Auch eine einzige Kachel
erzeugt ein Raster. Jetzt rechnet `kfbFrame()` die Fuge (Breite aus Welt-Rauschen, organisches
Ausfransen, **fleckenweises** Auftreten = der Hebel gegen das Raster) und `kfbStripe()` die
streifigen Seitenflächen aus demselben Rauschen — für hohe Strukturen ohne Fugenraster.
Regler: Fugen-Tiefe / Fugen-Breite / Streifen; Fassung umschaltbar prozedural · edge3-PNG · aus.
Geladen wird nur noch `noise.png`. Übertrag auf Kenney-Assets (Colormap + Abnutzungs-Overlay)
ist in `docs/TEXTUR_KONZEPT_voxel.md` §7 skizziert — die Naht für S4.

**Gemessene Abnahme** (framebuffer-Statistik, nicht Augenmaß): lokaler Nachbar-Kontrast
`Variation 1 → 14,6` vs. `Variation 0 → 12,5`; Modus-Wechsel färbt messbar um
(forbidden mean 167/92/108 → comic 155/163/117).

### S0 — App-Asset-Index · Stand im Detail

| Teil | Stand |
|---|---|
| `kfb-textures.json` | **FERTIG** (v0.1.0, 6 Sets, 12 Maps, alle Pfade live geprüft) |
| `asset-repo.json` | **FERTIG** (v0.1.0, 986 platzierbare Assets, 17 live-Packs, 20 pending) |
| `asset-index.js` | **FERTIG** — `loadIndex`, `getAsset`, `getUrl`, `getSet`, `getTexture`, `edgeVariant`, `getBlueprint`, `buildConstruct`, `hash32` |
| `constructs.json` | **FORMAT STEHT**, `blueprints: []` (füllt S2) |

**Anreicherung pro Asset (additiv, nichts ersetzt):** `role` (anchor \| satellite \| scatter \| prop) ·
`biomes[]` (auf `zone-index.json`-ids + neues `graveyard`) · `storyModes[]` · `naturalScale` · `ghUrl` (RAW).

**Rollen-Heuristik v1** (retunebar, steht im Manifest): `structure|vertical → anchor` ·
`wall|door|floor/tile → satellite` · `character|indicator/token → prop` · `nature → scatter` ·
`prop → scatter` (klein) bzw. `satellite` (> 1,5 u). Verteilung: scatter 582 · satellite 276 · prop 102 · anchor 26.

**Quelle statt catalog.json:** `catalog.json` liegt weiterhin nicht im Repo. `CATALOG/INDEX.md`
trägt dieselben Felder (name, size, footprint, anim) und wurde geparst — es fehlen nur `n_meshes`
und `skinned`. Kommt die JSON später, wird sie additiv drübergelegt.

**Pfad-Falle, teuer gelernt:** Katalog-Pack-Namen ≠ GitHub-Pfade. `kenney_pirate-kit` liegt als
`GLB_pirate/`, `kenney_hexagon-kit` als `GLB_hexagon_kit/`, `kenney_cube-pets_1.0` als
`GLB_cube-pets/`, `kenney_mini-characters` als `GLB_mini_chars/`, `kenney_blocky-characters_20` als
`GLB_blocky_chars/`, `kenney_graveyard-kit_5.0` als `GLB_graveyard/`. Die vier genesteten Packs
liegen 1:1 (`kenney_nature-kit/Models/GLTF format/`, `…survival-kit/Models/GLB format/`,
`…fantasy-town-kit_2.0/Models/GLB format/`). Alle sechs Präfixe per Direktabruf verifiziert.
Duplikate wurden dedupliziert (`aliases` im Manifest), Pirate **remapped** statt dedupliziert —
sonst fehlen 72 Assets.

## 4 Verifizierte Asset-Wahrheit (2026-07-25, gegen Live-Tree geprüft)

**Ein Manifest ist eine Behauptung, der Live-Abruf der Beweis.** Deshalb hier nur Geprüftes.

**KFB-Texturen — `media/3D_Assets/KFB/` · 12 Dateien, alle live:**
edge1.png (16 KB) · edge2.png (14 KB) · edge3.jpg (2,5 KB) · brick_diffuse.jpg (1,09 MB) ·
brick_bump.jpg (804 KB) · brick_roughness.jpg (235 KB) · water.jpg (80 KB) · waterdudv.jpg (178 KB) ·
waternormals.jpg (249 KB) · noise.png (248 KB) · alphaMap.jpg (184 KB) · tri_pattern.jpg (66 KB).
`edge3.psd` und `test` sind draußen (Quelle/leer) — nie referenzieren.

**Kenney-GLB-Packs — stichprobenartig per Direktabruf bestätigt:**

| Pack | Beleg (Direktabruf) | Textur |
|---|---|---|
| `GLB_hexagon_kit/` | `grass-forest.glb` 24 KB | textur-gestrippt (kommt weiß rein, selbst skinnen) |
| `GLB_cube-pets/` | `animal-bunny.glb` 132 KB | `GLB_cube-pets/Textures/colormap.png` ✓ |
| `GLB_graveyard/` | `gravestone-cross` 21 KB · `grave` 25 KB · `coffin` 25 KB · `iron-fence` 39 KB · `fence` 40 KB · `trunk` 27 KB · `crypt` 25 KB · `bench` 16 KB | `GLB_graveyard/Textures/colormap.png` ✓ |
| `GLB_pirate/` | `ship-large` 156 KB · `chest` 25 KB · `barrel` 14 KB | `GLB_pirate/Textures/colormap.png` ✓ |

Nicht gefunden (Namen geraten, existieren so nicht): `GLB_graveyard/pillar.glb`,
`GLB_graveyard/lantern-standing.glb`, `GLB_pirate/tower.glb`. → **Die Dateinamen kommen aus dem
Katalog, nicht aus der Erinnerung.** Genau dafür braucht S4 `catalog.json`.

**PBR-Texturbibliothek — `media/3D_Assets/Textures/<material>/`:** ~99 Material-Ordner im Tree
(README nennt 83 CC0-Materialien, ambientCG + Poly Haven), Schema
`<name>_diffuse.jpg` / `_normal.jpg` (OpenGL) / `_roughness.jpg` / `_ao.jpg`, JPG-1K.
Kontaktbogen: `Textures/_CONTACT_SHEET_imported_v2.png` (3,8 MB — **nur per URL ansehen**, nie einbetten).

**Wichtige Falle (aus `PROJECT_LOG.md`):** der GitHub-Tree listet **keine .glb** (binär).
„0 GLB gefunden" heißt nie „keine da" — immer per Direktabruf oder RAW-URL prüfen.

## 5 Offene Punkte (keine Blocker mehr)

1. **`catalog.json` selbst fehlt weiter** — `INDEX.md` ersetzt es für alles, was der Index braucht;
   `n_meshes`/`skinned` fehlen. Nachpushen, wenn gebraucht.
2. **20 Packs „pending upload"** — stehen mit Status in `asset-repo.json → pending`. Nicht platzieren.
   Nur-lokal: castle, coaster, factory, furniture, prototype, tower-defense, modular-\*, Dice, blocky-chars-Vollkit.
   Gar nicht im Repo: holiday-kit, city-kit commercial/industrial/suburban. Teilmenge auf Git: die fünf Mini-Kits.
3. **`GLB format/`** im Repo-Top-Level ist keinem Katalog-Pack zugeordnet (Mittelalter-/Hex-Terrain) — Identität klären.
4. **Terrain-Runtime liegt nur lokal** (`terrain-v9/`), nicht im Repo. In dieses Projekt als
   `terrain/world-context.js` + `terrain/voxel-terrain.js` **gespiegelt** (nur andocken).
   *Fix langfristig:* Runtime-Module ins Repo, dann per RAW importieren statt spiegeln.

## 6 Datenverträge (Contract-Hygiene: `version` patchen, `updated` = heute, `canonical` nie verlieren)

| Datei | Version | Rolle |
|---|---|---|
| `kfb-textures.json` | 0.1.0 | benannte Material-Sets + RAW-URLs + Map-Rolle/colorSpace |
| `constructs.json` | 0.1.0 | Blueprint-Format für Voxel-Konstrukte, Blueprints noch leer |
| `asset-repo.json` | 0.1.0 | 986 Assets angereichert (role, biomes, storyModes, naturalScale, ghUrl) + pending + aliases |
| `asset-index.js` | — | Runtime-API über alle drei Ebenen; einzige Stelle, die RAW-URLs baut |
| `zone-index.json` | vorhanden | Zonen/Biome aus dem Hex-Meilenstein — Quelle für `biomes[]` |

## 7 Nicht in diesem Sprint

- **Worldbuilder vX / Zonen-Manifest-Placer** — erst wenn Format + ein Konstrukt + ein Szenario stehen.
- **Asset-Browser-Anbindung** (Marker/Filter, 3D-Vorschau im Panel) — nach S4, braucht den Browser im Repo.
- Editor-UI für Blueprints. Erst Daten, dann Werkzeug.

## 7b Runtime-Learnings dieses Projekts (nicht nochmal reintappen)

1. **`setState(patch, callback)` ruft den Callback hier nicht.** Wer im Callback rendert, rendert nie.
   Muster: Arbeitsstand `this._s = {...this.state, ...patch}` setzen, **sofort** rendern, dann `setState`.
2. **Der Render-Loop darf nicht am Lifecycle hängen.** Die Runtime unmountet zwischendurch; ein
   `stop`-Flag aus `componentWillUnmount` tötet den Loop im ersten Frame (die Szene bleibt als
   Standbild stehen → sieht aus wie „läuft", reagiert aber auf nichts). Muster: Loop prüft
   `canvas.isConnected`, `stop` wird nach den `await`-Fenstern zurückgenommen, Re-Mount wirft ihn wieder an.
3. **Jede Zustandsaenderung muss selbst ein Bild zeichnen.** In gedrosselten/unsichtbaren Iframes
   tickt `requestAnimationFrame` nicht — Attribute/Uniforms zu schreiben und auf den Loop zu hoffen
   heisst: nichts passiert. `set()` ruft darum am Ende explizit `renderer.render()` und liest die
   Draw-Calls direkt aus `renderer.info` (HUD bleibt ehrlich, fps 0 = Loop gedrosselt, nicht kaputt).
4. **Getintete Instanzen brauchen EINE Tint-Quelle.** Der brick-Patch war anfangs auf `Color(1,1,1)`
   gesetzt und wurde von `applyPalette()` nicht erfasst → die Mauer blieb cardboard-farben auf einer
   pinken Zone, also genau das „aufgeklebte Requisit", das der Brief verbietet. Regel: jedes Mesh,
   das in die Welt gehoert, laeuft durch `tintFor()` — Architektur nur mit schwaecherer Staerke.
5. **Seed-Disziplin:** der Seed einer Instanz muss aus einer am Mesh gespeicherten Id kommen
   (`mesh.userData.bi`), nie aus einer Array-Position — leere Buckets verschieben Indizes und die
   Zone wuerfelt beim ersten Reglerzug einen anderen Look (Determinismus ist Guardrail).
6. **WebGL-Canvas + Screenshot:** `preserveDrawingBuffer: true` ist Pflicht für Beleg-Bilder, reicht
   aber nicht immer — der DOM-Re-Render-Screenshot liest den Canvas trotzdem schwarz. Live-Ansicht
   und Framebuffer-Statistik per `gl.readPixels` sind die verlässlichen Belege.
7. **`voxel-terrain.js` zeigt auf einen falschen kanonischen Pfad** (`Textures/edge3.jpg` statt
   `KFB/edge3.jpg`) und fällt still auf die lokale Kopie zurück → im Standalone-Export tot.
   Fix gehört zum Coworker-Zettel (`docs/COWORKER_catalog-fixes.md` §7).

## 8 Changelog (neueste oben)

### 2026-07-25 (4) — Slice 1b: Art-Direction konsolidiert
- Zwei externe Art-Direction-Papiere ausgewertet → `docs/ART_DIRECTION_konsolidiert.md` (übernommen / später / nicht).
- **`kfb-ink-outline.js`**: Screen-Space-Tusche (Sobel über Tiefe + Normalen), Story-Mode-farbig, schwankende Linienstärke. Der Kitt zwischen Voxel, GLB, Pet und Karte.
- Material-System um **Schraffur** (steile Wände) und **Boiling Lines** (Vertex-Wobble, 8 fps) erweitert.
- **`KFB Voxel Zone S2.dc.html`**: eine Zone, zwei Rezepte, verschiebbare Naht — links Bestand (edge3-Kachel wie Travel v9), rechts prozedural. Tusche aus = zwei Rezepte, Tusche an = eine Welt.
- Wasser: Höhenfeld als `DataTexture` → ausgefranste Schaumkante exakt am Ufer.
- S1 auf SUPERSEDED (Referenz), S2 ist die lebende Deliverable.
- **Review-Fix (Farbraum):** ein EffectComposer ohne `OutputPass` schreibt lineare Werte auf den
  sRGB-Canvas — „Tusche an" hätte damit die ganze Bildfarbe verändert statt nur die Konturen und der
  A/B-Vergleich wäre wertlos gewesen. Mit `OutputPass` liefern Composer- und Direktpfad bei
  Linien-Stärke 0 denselben Mittelwert (gemessen 222/194/159 = 222/194/159). Merksatz: **jede
  Post-Kette endet mit OutputPass.** Zweiter Fix: Draw-Calls werden vor den Fullscreen-Passes
  gelesen (`ink.sceneCalls`), sonst zeigt das HUD 1 statt 3.

### 2026-07-25 (3) — Slice 1 abgenommen
- `kfb-box-material.js`: Variations-Schicht (edge-Bucket, UV-Rotation/Scale/Offset, Tint-Jitter, noise-Körnung) über Instanced-Attribute.
- `KFB Voxel Zone S1.dc.html`: Abnahme-Szene, 956 Instanzen / 5 Draw-Calls / 120 fps, 6 Story-Modi, brick-Mauer mit Tor, Wasser.
- A/B numerisch belegt (lokaler Kontrast 14,6 vs. 12,5 bei `Variation 0`).
- Sieben Runtime-/Disziplin-Fallen dokumentiert (§7b) — je einen Anlauf gekostet.
- Review-Fixes: brick-Mauer laeuft jetzt durch `tintFor()` (folgt der Story-Palette), Seed kommt aus `mesh.userData.bi` statt aus der Array-Position, `set()` zeichnet explizit ein Bild.
- `docs/COWORKER_catalog-fixes.md`: acht belegte Katalog-/Pfad-Probleme + fertige Kurzfassung zum Weiterschicken.

### 2026-07-25 (2) — Slice 0 abgenommen
- `CATALOG/` ist im Repo (ohne `catalog.json`) → `INDEX.md` + `github_status.json` in das Projekt gespiegelt und geparst.
- `asset-repo.json` v0.1.0: **986 platzierbare Assets**, 17 live-Packs, 20 pending, 6 Aliases, Rollen-Heuristik v1.
- `asset-index.js`: `loadIndex/getAsset/getUrl/getSet/getTexture/edgeVariant/getBlueprint/buildConstruct`, deterministisch geseedet.
- Cockpit um den **Resolver** erweitert (id rein → RAW-URL raus) = die Abnahme von Slice 0.
- Sechs GitHub-Präfixe per Direktabruf verifiziert; `kenney_pirate-kit` → `GLB_pirate/` remapped (hätte sonst 72 Assets verloren).

### 2026-07-25 (1) — Sprint angelegt, Slice 0 halb
- Brief gelesen, Repo + gemounteter Ordner geprüft, **Asset-Wahrheit belegt** statt behauptet (§4).
- `kfb-textures.json` v0.1.0 geschrieben (12 Texturen, 6 Sets, live geprüft).
- `constructs.json` v0.1.0 (Format steht, leer).
- `terrain/world-context.js` + `terrain/voxel-terrain.js` aus `terrain-v9` gespiegelt (nur Andock-Fläche).
- `HOUSEKEEPING.md` angelegt, Hex-Artefakte auf FROZEN/SUPERSEDED gesetzt, `KFB 3D Asset Repo.dc.html` als Cockpit.
- **Blocker offen:** `catalog.json` + `github_status.json` nicht erreichbar → `asset-repo.json` und S4 warten.
