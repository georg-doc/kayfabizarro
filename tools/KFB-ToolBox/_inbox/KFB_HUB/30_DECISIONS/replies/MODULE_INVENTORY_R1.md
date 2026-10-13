# MODULE_INVENTORY_R1 · KFB-Bausteine für den R3F-Slice

Stand 13.10.2026. Nur gelesen; nichts gebaut, nichts geändert. Antwort auf `BRIEF_MODULE_INVENTORY_R1.md`.

**Quellen**
- Repo `georg-doc/kayfabizarro`, `origin/main` = `dccf75ca` (Fetch 13.10. ohne Neues).
- Zusätzlich die Branches `origin/cloudflare-live` und `coworker/kaykit-native-locomotion-baseline-01-2026-10-03` (`dfb6b8a1`).
- Lab `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab`. Es ist kein Git-Repo; angegeben ist deshalb der Git-Blob-Hash der Datei (`git hash-object`).
- Dropbox-Ordner, wo genannt.

**Belege**
- In Node 24.21 mit three **0.186.1** aus dem `node_modules` des Labs.
- Ein PDF-Beleg lief mit macOS PDFKit (Swift).
- Skripte und Ausgabebild liegen in `MODULE_INVENTORY_R1/proofs/` neben dieser Datei.

**Lesart:** `GEPRÜFT` = so in Node ausgeführt. `UNGEPRÜFT` = nicht ausgeführt. Kein Element lief im Browser oder mit WebGL.

---

## (a) Übersicht

| # | Element | Pfad@Commit (Blob) | Einstieg | three | Bewertung | Beleg |
|---|---|---|---|---|---|---|
| 1a | Card Viewer (Kopf ohne UI) | `KFB Comic Card Deck Viewer v4 (WS0)/kfb-viewer.js` @6a8a8a73 (be737f59) | `KayfabizarroViewer.loadDeck(opts)` → `getCardCanvas(cardIdx, px)` → `Promise<HTMLCanvasElement>` | keins | HÜLLE (½ Tag) | Datenweg GEPRÜFT (Karte gerendert); Modulcode UNGEPRÜFT |
| 1b | Kartenbild 2D (Lab nutzt es) | `overworld/overworld-v13_2026-08-12/overworld-v13/card-art-2d.js` @2f2f4aaf (d14b497e); Lab-Patch `public/vendor/ow/card-art-2d.js` (c46cee47) | `OW_ART.quarter({packId,n}, px)` → `{canvas, ar}` | keins | HÜLLE (½ Tag) | UNGEPRÜFT |
| 1c | Karte als 3D-Objekt (Aufsteller) | `KFB Combat Arena/cardbuilder/kfb-card-builder.js` @bcba5653 (1abb6319) | `createCardBuilder({THREE}).makeById(packId, n, {width})` → `{group, dispose}` | injiziert | HÜLLE (½–1 Tag) | UNGEPRÜFT |
| 2 | KFB Clay K2 v10 | `tools/KFB-ToolBox/_inbox/…/kfb-lib/clay/clay-material.v10.js` @1c888c48 (d994a9b6, 16 gleiche Kopien); Lab `src/sky/vendor/lab-clay/` (byte-gleich) + Hülle `src/clay/index.ts` | `makeClayUniforms(THREE, tex)`, `makeClayMaterial(THREE, U, opts)` → `MeshPhysicalMaterial` | injiziert | HÜLLE (½ Tag) | GEPRÜFT (Material + Shader-Injektion als Text); WebGL UNGEPRÜFT |
| 3 | Table Diorama | Dropbox `Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)/kfb-table.v6.js` (d3b6db8d), nicht im Repo | Web Component `<kfb-table>`, keine Modul-API | CDN `three@0.160.0/+esm` | VORLAGE | UNGEPRÜFT |
| 4a | Skydome-Shader | SKY3 `_inbox/KFB Skydome Gates SKY3/…/skydome-shader.js` @90132835 (919ed27b); Lab-Patch (3eac6d5b) | `createSkydome({THREE, radius, variant, mode})` → `{group, update, follow, dispose(scene), …}` | bare + injiziert | HÜLLE (¼ Tag) | GEPRÜFT |
| 4b | Environment Host (TinySkies) | SKY3 `lab-sky/env-host.v3.js` @90132835 (70579123); Lab-Patch (43d6f6bf) + `src/sky/sky.ts` | `createEnvironmentHost({THREE, renderer, scene, camera, lights, radius, fogScale})` | bare + injiziert | HÜLLE (1 Tag) | Import GEPRÜFT; Lauf UNGEPRÜFT |
| 4c | Welt-Rezept, Weltgröße | `travel/wip/travel_globe_wsa/world-builder/world-recipe.js` (Schema `kfb.world-recipe.v0`) | `blankRecipe()`, `loadRecipe()` (localStorage) | injiziert | VORLAGE | UNGEPRÜFT |
| 5 | Seed World (ohne sw-mech) | `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/…/seedworld/` @97c891c0 | `createGen(seed)`, `createWorld({...})`, `createDestruct({...})`, `createWeaponFX({...})` | bare `three` + `three/addons` (gebaut auf CDN 0.170) | HÜLLE (1–2 Tage, ohne Rapier) | GEPRÜFT (Node, ohne Worker) |
| 6a | KayKit-Clips (Rig_Medium) | `media/3D_Assets/KayKit_Adventurers_2.0_FREE/Animations/gltf/Rig_Medium/` @d1fddc21; Lab `public/assets/kaykit/anims/` (byte-gleich) | GLBs | – | PASST (Assets) | GEPRÜFT (Clip-Namen) |
| 6b | LOCO_SET_01 | Dropbox `…/BLENDER MCP/KAYKIT_LOCO_SET_01/` (Handover + Test-GLBs); Code-Spiegel `kfb-hub/stage/combat/runtime/slices/card-hex-ascent/anim.mjs` @e21e4904, nur auf `cloudflare-live` (2c68c36d) | `LOCO`, `locoWeights(speed)`, `class ActorAnimator` | bare | GLB + `loco_set.json`: FEHLT; Tabelle: HÜLLE | `locoWeights` GEPRÜFT |
| 6c | Figuren (67, Lab) | Lab `src/residents/figure-b2.ts` (673a9ec6) + `public/assets/figures-b2/catalog.json` | `buildPlayable(entry, variant)` | bare (npm) | HÜLLE; Augen V-201 FAIL | Katalog gelesen; Lauf UNGEPRÜFT |
| 7a | `chatter-2d.js` | `overworld/overworld/chatter-2d.js` @53d9be37 (fa2941fa) | `window.OW_CHATTER.line(...)` (Textgenerator) | keins | VORLAGE (nicht nutzen) | UNGEPRÜFT |
| 7b | Blase mit Flip-Reveal (V-204 plain) | Lab `src/world/organ/islands-npc.ts` (13ad2738) + `src/chatter/vendor/chatterbox-core.js` (= Repo `_inbox/KFB_CHATTERBOX_STUDIO…_r2/lib/chatterbox/chatterbox-core.js` @30558ae3, f59a8a1a) | `window.KFB_CB`; Blase in `createIslandNpcs` (`say/draw`) | keins (DOM-Overlay) | HÜLLE (½–1 Tag, herauslösen) | Pfade + Triplet GEPRÜFT; Layout und Reveal UNGEPRÜFT |
| 8 | Weitere: Almanach-Fächer, Kontaktschatten, Clay-VFX | Lab `src/hud/almanac.ts`, `src/play/contact-blob.ts`, `src/play/vendor/clay-vfx.v1.js` | siehe §8 | bare (npm) | HÜLLE / PASST / HÜLLE | UNGEPRÜFT |

---

## (b) Elemente im Einzelnen

### 1 · Card Viewer (Deck-JSON + PDF-Zuschnitt, Querformat)

Es gibt drei brauchbare Wege. Alle nutzen denselben Kartenvertrag aus `media/kfb/index.json` (Blob af276a8b, Commit 572dc2b1):
- Schema `kfb-deck-registry/v2`, 130 Decks.
- `cardMapping`: Seite = `coverOffset + 1 + floor((n−1)/4)`, Quadrant = `(n−1) % 4` in der Reihenfolge TL, TR, BL, BR.

**1a · `kfb-viewer.js` (Deck Viewer v4/v5)**
1. **Pfad:** `KFB Comic Card Deck Viewer v4 (WS0)/kfb-viewer.js` @6a8a8a73 (Blob be737f59).
   - Datenschicht `deckviewer/kfb-corpus.js` @e29da7d8 (b0b214c8).
   - v5: `KFB Deck Viewer v5.dc.html` @e29da7d8.
2. **Einstieg:** `KayfabizarroViewer.loadDeck({source:{url}|ArrayBuffer|File, deckData:{url}|obj, grid?, cover?, readingOrder?})` → `Promise<handle>`. Der Handle hat:
   - `getCardCanvas(cardIdx, pxWidth)` → `Promise<HTMLCanvasElement>`;
   - `getCardData(i)`, `getCoverCanvas()`, `layoutStatus`, `destroy()`.
3. **three:** keins. pdf.js **3.11.174** per CDN als `window.pdfjsLib`, der Worker als Blob.
4. **Abhängigkeiten:**
   - DOM (`document.createElement('canvas')`);
   - Netz: pdf.js-CDN und die PDFs von `raw.githubusercontent.com/…/media/kfb/`;
   - IIFE, setzt das globale `window.KayfabizarroViewer`.
   - `kfb-corpus.js` nutzt zusätzlich IndexedDB (`kfb-deckviewer`) und `CustomEvent` auf `window`.
5. **Bewertung: HÜLLE (≈ ½ Tag).** Die Hülle braucht:
   - ein ES-Modul `getCardImage(deckId, n)`;
   - `deckId` → PDF- und JSON-URL aus der Registry;
   - `cardIdx = n−1`;
   - `cover` explizit aus `coverOffset`. Sonst rät `loadDeck` das Cover über `coverScore` bzw. `coverQA`. 6 Decks haben `coverOffset 0`.
   - pdf.js auf eine Version festlegen (siehe §c).
6. **Beleg (GEPRÜFT, nur Datenweg):**
   - `node card-proof.mjs forget_utopia 7` → `{"deckId":"forget_utopia","n":7,"name":"The Moving Launch Date","regPages":15,"cardCount":56,"jsonCards":56,"page":3,"quad":2,"quadName":"BL"}`
   - `swift crop.swift "<Lab>/public/decks/Deck_A_UTOPIA_-_Forget_Utopia web H.pdf" 3 2 card_forget_utopia_7.png` → `pdfPages 15 · page 3 pt 745.09×415.64 · crop px (0, 831, 1490, 831)`
   - Das PNG (`proofs/card_forget_utopia_7.png`) zeigt Karte 7 „The Moving Launch Date“ mit POWER- und LORE-Zeile. Der Name stimmt mit dem JSON überein.
   - Der Code von `kfb-viewer.js` selbst lief nicht. Er braucht DOM und Canvas.
   - Registry: 124 Decks mit `coverOffset 1`, 6 mit `0`. Bei 8 Decks ist `ceil(cardCount/4)+coverOffset ≠ pages`; dort fällt der Viewer auf `needs-review` zurück. Die v5-RETURN nennt 23 ungeprüfte Zuordnungen ohne Zuschnitt.

**1b · `card-art-2d.js` (Lab-Almanach nutzt es)**
1. **Pfad:** Repo `overworld/overworld-v13_2026-08-12/overworld-v13/card-art-2d.js` @2f2f4aaf (d14b497e). Lab-Kopie `public/vendor/ow/card-art-2d.js` (c46cee47); der einzige Lab-Patch ist pdf.js lokal statt jsDelivr.
2. **Einstieg:** `window.OW_ART.quarter({packId, n}, px)` → `Promise<{canvas, ar} | null>`, dazu `art()`, `pageOf()`, `meta()`.
3. **three:** keins. pdf.js **4.7.76** als ESM (Lab: `/vendor/pdfjs/pdf.min.mjs`).
4. **Abhängigkeiten:**
   - `window.OW_SRC` (Deck-Basis-URL);
   - `card-grids.json` (gemessenes Raster, nur `forget_utopia` vollständig);
   - DOM-Canvas.
5. **Bewertung: HÜLLE (½ Tag).** Läuft heute im Lab (Almanach, V-043). Das Viertel ist roh, mit Rand.
6. **Beleg:** UNGEPRÜFT.

**1c · `kfb-card-builder.js` (Karte als THREE.Group)**
1. **Pfad:** `KFB Combat Arena/cardbuilder/kfb-card-builder.js` @bcba5653 (1abb6319). Die neueste Fassung (06.09.).
   - Weitere Fassungen: `KFB Boxel Blitz/…` (52139e68); `skills/kfb-card-builder.js` @a4a9438d (88e1fb33); Card Zone Lab v3 (ff604199).
2. **Einstieg:**
   - `createCardBuilder({THREE, params})` → `{pool(), make(card, {width}), makeById(packId, n, o), pageOf(), setParams(), dispose()}`;
   - `make()` liefert `{group, dispose}`. Die Gruppe hat `sheet` und `decal` (Tusche 2 cm davor).
3. **three:** injiziert (`opts.THREE`). pdf.js **4.7.76** per jsDelivr.
4. **Abhängigkeiten:**
   - `kfb-ink-canon.js`, `kfb-card-format.js`;
   - DOM-Canvas, `document.fonts`, `visibilitychange`;
   - Netz: Registry RAW, PDF, pdf.js.
5. **Bewertung: HÜLLE (½–1 Tag).** Am nächsten am Vertrag für „Aufsteller als Textur bzw. Objekt“. Offen: Kartentusche ja oder nein (Frage 3).
6. **Beleg:** UNGEPRÜFT.

### 2 · KFB Clay-Material (K2, v10)
1. **Pfad:**
   - Repo: Blob d994a9b6 in 16 gleichen Kopien unter `tools/KFB-ToolBox/_inbox/`, z. B. `KFB ToolBox Production-06/…/kfb-lib/clay/clay-material.v10.js` @1c888c48.
   - Lab: `src/sky/vendor/lab-clay/clay-material.v10.js`, byte-gleich.
   - Lab-Hülle: `src/clay/index.ts` (13a9a46d) mit `initClay()`, `clayMaterial(cls, src, over)`, `claySeed()`.
2. **Einstieg:**
   - `makeClayUniforms(THREE, reliefTex)` → Uniform-Satz U (40 Uniforms);
   - `makeClayMaterial(THREE, U, {src, color, profile, …})` → `THREE.MeshPhysicalMaterial` mit `onBeforeCompile`;
   - Hilfen: `seedGeometry(THREE, geo, seed)` (Attribut `claySeed`), `makePrintTexture(THREE, url)`;
   - Reliefs: `clay-relief.v2.js` `makeClayRelief({size, seed})`, `clay-relief.v5.js` `makeToolReliefs()`.
3. **three:** injiziert, kein Import, also sicher bei nur einer Instanz.
4. **Abhängigkeiten:**
   - `clay-profiles.v2.js`, `clay-relief.v2/v5.js`;
   - CPU-Reliefs (1024²);
   - Fingerabdruck-Textur `/assets/clay/Fingerprints01_3K.png` (DOM-Canvas in `makePrintTexture`);
   - die Lab-Hülle zusätzlich `organ-cache`.
5. **Bewertung: HÜLLE (½ Tag).** `createMaterial(options)` baut U einmal (Reliefs, Werkzeuge, Print) und setzt die Profilklassen wie `src/clay/index.ts`.
6. **Beleg (GEPRÜFT):** `node clay-proof.mjs`
   ```
   three 186 exports PALETTES,PALETTE_ORDER,PROFILES,TOOL_ORDER,makeClayMaterial,makeClayUniforms,makePrintTexture,seedGeometry,setPalette
   relief 256 262144 83ms
   material MeshPhysicalMaterial true onBeforeCompile function uniforms 40
   onBeforeCompile ok, frag len 23430 has uClay true
   seedGeometry attrs position,normal,uv,claySeed
   ```
   GLSL wurde nicht kompiliert (kein WebGL in Node). Laut Register läuft die Datei im Lab auf r186 (V-053).

### 3 · Table Diorama
1. **Pfad:** Dropbox `~/Dropbox/CLAUDE/Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)/kfb-table.v6.js` (4295 Zeilen, d3b6db8d, Stand 11.09.).
   - Ältere Fassungen unter `Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D TableDiorama KFB v6 fable5/`.
   - **Nicht im Repo.** Das Repo hat nur die 2D-„Story Table“ `KFB Comic Card Deck Viewer v4 (WS0)/KFB Gameplay Stage.dc.html`.
2. **Einstieg:** keine öffentliche API, nur eine Seite. Web Component `<kfb-table>` mit eigenem Renderer, eigener Szene und Kamera (`PerspectiveCamera(42)`); `_buildTable()` ab Zeile 1840.
3. **three:** CDN-ESM `https://cdn.jsdelivr.net/npm/three@0.160.0/+esm` + GLTFLoader 0.160, dynamisch, also eine **zweite three-Instanz**. pdf.js 4.2.67 per CDN.
4. **Abhängigkeiten:**
   - Assets per GitHub-RAW (Rückseite, Wand, Props unter `media/3D_Assets/`);
   - `window.claude.complete` (LLM-Zug);
   - Fonts Irish Grover und Shantell Sans;
   - Tastatur-Listener auf `window`.
5. **Bewertung: VORLAGE.** Als Muster übernehmbar:
   - Bodenmodell `Y = {floor −2.05, tableTop −0.035, matTop 0.001, onMat 0.008}`;
   - Holztisch 11 × 7,5;
   - Schneidematte 8,6 × 5,4;
   - Karten 1,66 × CH bei Seitenverhältnis 0,72;
   - Slots für Actor, 3 Szenen, Quest.
   - **Die Karten liegen flach** (`rotation.x = −π/2`); aufgestellte Karten nicht gefunden (Frage 1).
6. **Beleg:** UNGEPRÜFT.

### 4 · Travel Globe / Tiny-Skies-Welt

**4a · Skydome-Shader (Travel Combat v25)**
1. **Pfad:**
   - Original: `tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js` @90132835 (919ed27b).
   - Lab-Kopie mit einem Patch (Skybox-URL lokal `/sky/skyboxes/`): `src/sky/vendor/travel/…/skydome-shader.js` (3eac6d5b).
2. **Einstieg:** `createSkydome({THREE, radius, variant, mode, worldMix, exposure})` → `{group, follow(camera), update(dt, audio), setVariant, setPalette, setMode, …, dispose(scene)}`.
3. **three:** `import * as THREE from 'three'` (bare); `opts.THREE` hat Vorrang.
4. **Abhängigkeiten:** Statische Varianten laden die Kenney-Skyboxen per TextureLoader. Prozedurale Varianten (S, A, space) brauchen kein Netz.
5. **Bewertung: HÜLLE (¼ Tag).** Zu ergänzen: `object3d = group`, `update` mit `follow(camera)`, `dispose()` ohne `scene`.
6. **Beleg (GEPRÜFT):**
   ```
   skydome group Group meshes 3 api name,group,follow,setVariant,getVariant,setPalette,setMode,setWorldMix,setExposure,exposure,setAutoWaver,setSpiral,setSpiralAmt,setSpiralSpeed,setTint,setBrightness,horizonColor,update,dispose
   update+dispose ok
   ```

**4b · Environment Host (TinySkies-Port)**
1. **Pfad:** SKY3 `lab-sky/env-host.v3.js` @90132835 (70579123).
   - TinySkies-Teile aus `travel/wip/travel_globe_wsa/globe-v13/` @704f6ac0: `day-night.js` f5386acb, `sky-presets.js` 04dd730e, dazu `sky-atmosphere`, `starfield`, `lens-flare`, `rain-overlay`, `weltstimmungen`.
   - Lab: `src/sky/vendor/…` mit LAB PATCH N1 in `day-night.js` (Fog-Hook, 78d1b5ae) und einem Patch in `env-host.v3.js` (43d6f6bf).
   - Lab-Verdrahtung: `src/sky/sky.ts` (13211939), `createSky(opts)`.
2. **Einstieg:** `createEnvironmentHost({THREE, renderer, scene, camera, lights, radius, fogScale, minutes, travelVariant})` → Host mit `update(dt)`, `setShell('tiny'|'travel'|'spindle')`, `dn`, `aurora`, `rain`, `planets`.
3. **three:** bare `three` und injiziertes `THREE`.
4. **Abhängigkeiten:**
   - **Der Host besitzt `scene.fog`, `scene.background` und das Licht-Rig** (sonst `buildLightRig`). In R3F kollidiert das mit `<fog>`, `<color attach="background">` und den Lichtern.
   - Die Shell `spindle` lädt Deck-PDFs; `planets.v1` lädt Quaternius-GLTF per RAW.
   - `paintRadialSky` braucht DOM-Canvas.
5. **Bewertung: HÜLLE (≈ 1 Tag).** Im Slice muss genau ein Besitzer für Nebel, Hintergrund und Licht feststehen (V-042, V-132).
6. **Beleg (Import GEPRÜFT, Lauf UNGEPRÜFT):**
   ```
   OK lab-sky/env-host.v3.js MOODS,SHELLS,SHELL_LABEL,createEnvironmentHost
   OK travel/globe-v13/sky-presets.js DAY_PRESET,…,getSkyPreset,paintRadialSky
   OK lab-sky/cloud-family.v3.js ARCHETYPES,…,buildFamily,createCloudField,loadDonor,…
   day preset keys skyGradient,fogColor,fogNear,fogFar,hemiSkyColor,…,stars,aurora
   ```

**4c · Weltgröße und Welt-Rezept**
- TinySkies rechnet in Globus-Einheiten mit Radius 5 (`createGlobe`, `radius = 5`).
- Das Lab skaliert so: Host-Radius = 20 × Bühnenradius, begrenzt auf 300–1800; `fogScale` = R/5 (`sky.ts`).
- Das einzige „Welt-Rezept“ im Travel-Globe-Baum ist `world-builder/world-recipe.js`:
  - Schema `kfb.world-recipe.v0`, Status `WB0_IMPLEMENTATION_WIP`;
  - nur localStorage;
  - Felder zones, instances, splines, voxelChunks, portals.
- **Bewertung: VORLAGE.** Ein Daten-Modul „Himmel + Weltgröße“ fehlt (Frage 4). Zum Vergleich der Welt-Vertrag `replies/WORLD_CONTRACT_R1.md` (`kfb.world/1`, Vorschlag).
- **Beleg:** UNGEPRÜFT.

### 5 · Seed World Mech Destruction POC 01 (ohne `sw-mech`)
1. **Pfad:** `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/` @97c891c0.
   - `sw-gen.js` bab1a94a, `sw-mesh.js` b77808f1, `sw-worker.js` 9c92c9a4, `sw-world.js` c541e783;
   - `sw-destruct.js` 29f044b2, `sw-fx.js` 292dab6b;
   - weggelassen: `sw-mech.js` a2008d25, `sw-app.js` 1e15ba20.
   - **Hinweis:** Die Stadt braucht außer `sw-gen`, `sw-destruct` und `sw-fx` auch `sw-mesh`, `sw-world` und `sw-worker`.
2. **Einstieg:**
   - `createGen(seed)` und `compileChunk(gen, cx, cz, lod, damage, hidden)`, beide rein, ohne three;
   - `createWorld({scene, seed, material, budgetMs=4, useWorker=true})` → `{root, update(px, pz), groundAt, raycast, collideSphere, buildingsNear, setDamage, regenerate, dispose(), …}`;
   - `createDestruct({scene, world, material, winGeo, doorGeo})` → `{update(dt, player), bullet, rocket, raycast, collideSphere, reset, snapshot, …}`;
   - `createWeaponFX({scene, camera, groundAt})` → `{meshes, light, begin(dt), …}`;
   - `clayMaterial()`: eigenes, schlichtes Clay mit Triplanar.
   - Vertragsvorschlag `docs/MODULE_CONTRACTS.json` (`kfb.seed-world.module-contracts/0`, „not accepted“).
3. **three:** bare `three` + `three/addons/…` (RoundedBoxGeometry), gebaut gegen CDN **0.170.0** per Importmap.
4. **Abhängigkeiten:**
   - Module Worker über `new URL('./sw-worker.js', import.meta.url)` mit Rückfall auf den Hauptthread;
   - die Clay-Textur kommt per RAW von `30558ae3`;
   - eigene Kollision (Kugel, OBB, Raycast), **keine Rapier-Collider**;
   - die Waffen-Auslöser stecken in `sw-mech` und müssen ersetzt werden.
5. **Bewertung: HÜLLE (1–2 Tage).** Dazu kommen Rapier-Collider für begehbare Chunks, nicht geschätzt (Frage 5). Die eigenen Tests T1–T13 stehen in `docs/TEST_REPORT.md` auf PASS; nicht wiederholt.
6. **Beleg (GEPRÜFT):** `node seedworld-proof.mjs <seedworld>` (Hauptthread, ohne Worker)
   ```
   gen 7 type machiya CHUNK 64
   chunk 0,0 buildings 21 trees 0
   compileChunk lod0 verts 13753 tris 9454 inst { win: 232, door: 21, chim: 12, trunk: 0, crown: 0 } 19ms
   three 186 sw-world CLAY_TEX,MAX_PER_FRAME,RINGS,TREE_STYLE,clayMaterial,createWorld,geomFrom | sw-destruct CAPS,createDestruct,pack2,unpack2 | sw-fx FXCAPS,createWeaponFX
   createWorld ok, root seed-world groundAt(0,0) 3.39
   createDestruct ok, api stats,CAPS,P,demoting,byId,promote,demote,raycast,rayCells,bullet,rocket,collideSphere
   createWeaponFX ok, meshes 5
   ```
   Der Worker-Pfad und das Rendern sind UNGEPRÜFT.

### 6 · KayKit-Figuren + LOCO_SET_01
1. **Pfad:**
   - **Clips:** Repo `media/3D_Assets/KayKit_Adventurers_2.0_FREE/Animations/gltf/Rig_Medium/` @d1fddc21: `Rig_Medium_MovementBasic.glb` 98e965e8, `Rig_Medium_General.glb` 5d16cb68. Lab-Kopien unter `public/assets/kaykit/anims/` byte-gleich.
   - **LOCO_SET_01:** `~/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/KAYKIT_LOCO_SET_01/`:
     - `HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`;
     - Test-GLBs `KAYKIT_LOCO_RAMP_01_Mannequin_Medium.glb`, `KAYKIT_LOCO_WEAPONS_0{1,2}_…glb` (je ein gebackener Clip);
     - Videos und Skripte.
     - Branch `coworker/kaykit-native-locomotion-baseline-01-2026-10-03` (`dfb6b8a1`, PR #344, nicht gemergt).
   - **Code-Spiegel der Tabelle:** `kfb-hub/stage/combat/runtime/slices/card-hex-ascent/anim.mjs`, **nur auf `origin/cloudflare-live`** @e21e4904 (2c68c36d).
   - **Figuren:** Lab `src/residents/figure-b2.ts` (673a9ec6) und `public/assets/figures-b2/catalog.json` (67 Figuren: Medium 55, Large 9, Legacy 3).
2. **Einstieg:**
   - `anim.mjs`: `LOCO` (walk `Walking_B` 0,98 m/s T 1,067; run `Running_A` 3,303 T 0,8 lfd 0,0833; sprint `Running_B` 5,255 T 0,8 lfd 0,125), `locoWeights(speed)`, `new ActorAnimator(root, clips, {weapon, weaponKind})` mit `.update(dt, speed)`;
   - Lab: `loadFigureCatalog()`, `rigClips('Medium'|'Large')`, `buildPlayable(entry, variant)` → PlayableFigure.
3. **three:** bare (`anim.mjs`; `figure-b2.ts` mit `three/examples/jsm/...`).
4. **Abhängigkeiten:**
   - GLBs;
   - figure-b2: Clay-Klasse `figure`, Augen-Rigs (`anchored-eyes.v1.js`, `batch-eyes.v1.js`), `FIG_SCALE`.
5. **Bewertung:**
   - **Assets: PASST.**
   - **Kanonisches `KFB_KAYKIT_LOCO_SET_01_Rig_*.glb` + `loco_set.json`: FEHLT.** Im Handover §6 nur vorgeschlagen, nirgends gefunden.
   - **Clip-Zuordnung: HÜLLE.**
   - **Figuren: HÜLLE.** Achtung V-201 (FAIL 13.10.): Augen falsch.
   - Vorschlag für die Zuordnung zu ecctrl, nicht entschieden:

     | ecctrl-Zustand | Clip |
     |---|---|
     | idle | `Idle_A` |
     | walk | `Walking_B` |
     | run | `Running_A` |
     | jumpStart | `Jump_Start` |
     | jumpIdle | `Jump_Idle` |
     | jumpLand | `Jump_Land` |
     | fall | `Jump_Idle` (kein Fall-Clip vorhanden) |
     | action1–4 | `Interact`, `PickUp`, `Throw`, `Use_Item` |

   - **Konflikt:** ecctrl blendet Zustände über. LOCO_SET verlangt dagegen eine phasengleiche Mischung nach Geschwindigkeit (Handover §3, Regeln 1–5). Mit dem ecctrl-Standard wird die Abnahme nach §6 nicht erreicht (Frage 2).
   - Rig_Large hat nur `Walking_A`, `Running_A`, Idle, Hit, Death; es fehlen Sprint und Sprünge.
   - Das Mannequin hat **keine** `handslot`-Knoten.
6. **Beleg (GEPRÜFT):** `node kaykit-proof.mjs <anim.mjs>`
   ```
   Rig_Medium_General.glb 15 clips / Rig_Medium_MovementBasic.glb 11 clips / Rig_Medium_MovementAdvanced.glb 13 clips
   Idle_A General · Walking_B, Running_A, Running_B, Jump_Start, Jump_Idle, Jump_Land, Walking_A, Walking_C MovementBasic
   jump clips: Jump_Full_Long,Jump_Full_Short,Jump_Idle,Jump_Land,Jump_Start
   Mannequin_Medium nodes 28 skins 1 joints 21 handslot? false
   locoWeights 0 {"idle":1,…} · 0.5 {"idle":0.49,"walk":0.51} · 2 {"walk":0.56,"run":0.44} · 4 {"run":0.64,"sprint":0.36} · 6 {"sprint":1}
   ```
   `ActorAnimator` wurde nicht ausgeführt (UNGEPRÜFT).

### 7 · ChatterBox-Darstellung

**7a · `chatter-2d.js`**
1. **Pfad:** `overworld/overworld/chatter-2d.js` @53d9be37 (fa2941fa); gleiche Fassungen in v12 und v13 (58178076).
2. **Einstieg:** `window.OW_CHATTER.line(g, m, kind, rnd)`, dazu `emote()` und `setFeed()`.
3. **three:** keins.
4. **Abhängigkeiten:** `window.OW_IDENT`, eine Fraktions-Phrasenbank, die Schrift PottyMouth BB (Lizenz nicht geklärt).
5. **Bewertung: VORLAGE, nicht nutzen.** Die Datei **zeichnet keine Blase**, sondern erzeugt freie Sätze. Das widerspricht der Regel „Dialog nur aus dem ChatterBox-Triplet-Pool“.
6. **Beleg:** UNGEPRÜFT.

**7b · Blase mit Flip-Reveal, V-204 plain**
1. **Pfad:**
   - Lab `src/world/organ/islands-npc.ts` (13ad2738, 13.10.): `say()`, `layoutTri()`, `draw()` (Zeilen 71–107);
   - Formen und Layout: `src/chatter/vendor/chatterbox-core.js`, byte-gleich mit Repo `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/lib/chatterbox/chatterbox-core.js` @30558ae3 (f59a8a1a);
   - Triplets: `resident-chatter-adapter.v0.1.mjs` (bc3cf519, auch im Repo-`_inbox`) und `resident-chat-ensemble-data.mjs`.
2. **Einstieg:**
   - `window.KFB_CB` mit `roundRectPath`, `thoughtPath`, `thinkDots`, `clayFront`, `layout`, `schedule`, …;
   - `prepareResidentTurn({...})` → `{kind:'turn', semantic:{subject, connector, rereframe}}`;
   - **die Blase selbst hat keine öffentliche API**, sie steckt in `createIslandNpcs(...)`.
   - V-204 ist umgesetzt: `roundRectPath` + `clayFront`, ohne Tusche und ohne Rim-Wände, ein `drop-shadow`.
   - Flip je Teil: `rotateX(−86°) → 0°`, 300 ms, Versatz 520 ms.
3. **three:** keins in der Blase; nur die Projektion über den Kopf nutzt three.
4. **Abhängigkeiten:** DOM-Overlay (`position:fixed`, SVG, Web Animations API), Google Font Shantell Sans per Netz, IIFE `window.KFB_CB`.
5. **Bewertung: HÜLLE (½–1 Tag).** `say/draw/layoutTri` als `createBubbleLayer({host})` mit `show(anchorScreenXY, parts[], kind)` und `update(dt)` herauslösen. Für Auswahl-Zeilen gibt es noch keine Form (Frage 6).
6. **Beleg (teils GEPRÜFT):** `node chatter-proof.mjs`
   ```
   KFB_CB cbs-core-0.1 keys 35
   roundRectPath M48.0 34.0 L240.0 34.0 L243.6 34.5 … len 450
   clayFront layers [{"d":"M0 0 Z","fill":"url(#kfbFaceShade)"}]
   layout ERR (needs DOM canvas): document is not defined
   prepareResidentTurn turn lorekeeper.provenance.02 {"subject":"Same story","connector":"different witness","reframe":"different fact",…}
   ```
   Layout, Reveal und Aussehen: UNGEPRÜFT.

### 8 · Weitere Elemente (alle UNGEPRÜFT)
- **Almanach-Fächer** (Lab `src/hud/almanac.ts`, cbef1bf1): `createAlmanac({host, palette, list, top})` → `{refresh, openOverlay, openCard, close, probe}`.
  - Grund: Der Slice braucht einen Kartenfächer im UI; dieser ist bestätigt (V-043, V-089).
  - DOM und HUD R3 (`kfb-hud.js`); nutzt `OW_ART` und `KFBCorpus`.
  - HÜLLE.
- **Kontaktschatten** (Lab `src/play/contact-blob.ts`, 0182ccbd): `contactBlob(sx, sz, opacity)` → `THREE.Mesh`.
  - Grund: Regel V-203 Bodenkontakt.
  - Bare `three`, Canvas-Textur.
  - PASST (es fehlt nur `dispose`).
- **Clay-VFX** (Lab `src/play/vendor/clay-vfx.v1.js`, 4aa7bb3b): `makeClayVFX(root, PP, {camera})`.
  - Grund: Knet-Partikel für Treffer und Schutt passen zur Seed World statt `sw-fx`-Leuchtspuren.
  - HÜLLE.
- **Licht-Besitzer** (Lab `src/world/light.ts` `makeWorldLight(scene, renderer, init)`).
  - Grund: Der Himmel-Host erwartet ein Rig.
  - VORLAGE: In R3F muss klar sein, wer das Licht besitzt.

---

## (c) three.js: nur eine Instanz

| Modul | Import | Version gebaut / geprüft |
|---|---|---|
| Lab gesamt | npm `three@^0.186.1` (installiert 0.186.1), bare | 0.186.1 |
| Clay v10, clay-relief, clay-profiles | kein Import, `THREE` als Parameter | Node-Beleg 0.186 |
| card-builder 1c | kein Import, `{THREE}` injiziert | – |
| skydome-shader, env-host v3 | bare `three` + optional injiziertes `THREE` | SKY3 gebaut für r184, Lab r186 |
| Travel Globe v13 Module | meist injiziert (`initSphericalMath(THREE)`); Seite per Importmap CDN `three@0.160.0` | 0.160 |
| Seed World | bare `three` + `three/addons/...` | gebaut 0.170 (CDN-Importmap), Node 0.186 |
| anim.mjs, figure-b2, contact-blob, clay-vfx, almanac | bare `three` (figure-b2: `three/examples/jsm/...`) | 0.186 (Lab) |
| kfb-table v6 | **CDN-ESM `three@0.160.0/+esm` dynamisch** | 0.160, **zweite Instanz** |
| kfb-viewer, card-art-2d, chatterbox-core, chatter-2d | kein three | – |

**Konflikte und Hinweise**
1. Ein Bundler (Vite) löst bare `three` und `three/addons` auf dieselbe Instanz auf. Für die Seed World ändert sich nur `three/addons` zu `three/examples/jsm`; mit npm 0.186 geht beides.
2. **kfb-table v6 lädt ein eigenes three von jsDelivr.** Nicht einhängen, nur als Muster nutzen.
3. **pdf.js gibt es in drei Versionen:** 3.11.174 als `window.pdfjsLib` (kfb-viewer, kfb-corpus), 4.7.76 als ESM (card-art-2d, card-builder) und 4.2.67 (Table v6). Alle schreiben `GlobalWorkerOptions` global; im Slice braucht es genau eine Version.
4. **Shader-Injektion** per `onBeforeCompile` und `#include`-Ersatz (Clay v10, Seed-World-Clay): Die Ersetzung als Text ist auf 0.186 belegt. Ob das GLSL der Seed World auf 0.186 kompiliert, ist UNGEPRÜFT. Clay v10 läuft laut Register im Lab auf r186.
5. **Planet-Spike:** Seine three-Version (R3F, Rapier, ecctrl 2.x) ist unbekannt, das Zip lag nicht vor. Ist sie < 0.170, ist die Seed World ungeprüft (Frage 4).

---

## (d) Offene Fragen an Georg
1. **Table Diorama:** Nur `kfb-table.v6` (11.09.) wurde gefunden, und dort liegen die Karten **flach** auf der Matte. Welcher Bau hat „aufgestellte Karten“? Oder entsteht das neu, nach dem Muster aus v6?
2. **Lauf-Animation:**
   - Gilt die LOCO_SET-Regel (phasengleiche Mischung nach Geschwindigkeit, Abnahme laut Handover §6), oder reichen die Überblendungen von ecctrl?
   - Soll Coworker das kanonische `KFB_KAYKIT_LOCO_SET_01_Rig_Medium.glb` + `loco_set.json` jetzt liefern? Beides fehlt.
3. **Karten-Aufsteller:**
   - Mit der kanonischen Kartentusche aus `kfb-card-builder` oder als Bild ohne Tusche (wie V-204 bei Blasen)?
   - Beim Zuschnitt `fit` oder `cover`?
4. **Himmel und Weltgröße:**
   - Welche Himmelsschale gilt für die erste große Welt: `tiny` (Verlauf), `travel` (Skydome) oder `spindle`?
   - Wie groß soll die Welt in Metern sein?
   - Welche three-Version hat der Planet-Spike?
5. **Lügen-Stadt:**
   - Muss sie mit ecctrl und Rapier begehbar sein (Trimesh je Chunk), oder reicht die eigene Kollision der Seed World für Schüsse und Trümmer?
   - Was löst die Zerstörung aus, wenn `sw-mech` wegfällt?
6. **Auswahl-Zeilen:**
   - Dieselbe V-204-Blase mit Flip-Reveal wie bei den NPCs, oder eine eigene Form für die Spieler-Wahl (z. B. drei Blasen nebeneinander)?
   - Shantell Sans per Google Fonts oder lokal?

---

Erstellt von der Steuer-Sitzung (Claude Code) per Inventur-Agent, abgelegt im Register-Branch `docs/kfb-decisions-register-2026-10-11` unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/`. Im Lab, im Repo und in KFB_HUB wurde nichts geändert. Ein `git show` hat im lokalen Klon einmal das automatische `git gc` angestoßen; es gab keinen Commit und keine Inhaltsänderung.
