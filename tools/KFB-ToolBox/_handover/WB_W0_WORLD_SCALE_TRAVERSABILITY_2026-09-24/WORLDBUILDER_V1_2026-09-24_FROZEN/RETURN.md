# RETURN · KFB WorldBuilder v1 · Slice 1 · 2026-09-24

> **STATUS: `HUMAN_REJECTED_FOUNDATION` · DO NOT PATCH** (Georg, 24.09.)
> Dieser Stand ist Failure-Evidence, keine Grundlage. Ursachen: `POST_MORTEM.md`. Nächstes Tor: `NEXT_GATE_WB-W0.md`.
> Der Text unten ist der ursprüngliche Übergabetext und bleibt unverändert; seine Aussagen („everything in metres“, „no facets“) sind im Post Mortem §4 eingeordnet.

## File tree
```
WORLDBUILDER_V1_2026-09-24/
├── CHANGELOG.md
├── RETURN.md
├── SOURCE.json
└── code/
    ├── KFB WorldBuilder v1.dc.html   entry page (open this)
    ├── support.js                     DC runtime
    ├── wb1-boot.js                    host · camera · editor · UI · save/load
    ├── wb1-planet.js                  planet · Earth template · sculpt · LOD · sea · look
    ├── wb1-sky.js                     TinySkies wrapper
    ├── wb1-buildings.js               Hürth buildings · 4 views
    ├── wb1-actor.js                   GothGirl · clips · EyeRig · walk
    ├── wd-look.js  wd-macro.js  wd-ink.js       WorldDesign Lab layers (unchanged)
    ├── wd-registry.js  wd-donors.js             registry + owner loaders (unchanged)
    └── textures/derek-rgb-ref.png               Derek RGB palette tile
```
Runtime donors (sculpt, edit-layer, TinySkies, OSM, EyeRig, atlas, registry, Natural Earth) load from their pinned URLs; see SOURCE.json. Multi-file, no bundle.

## What is different in the picture
1. **Orbit:** a smooth round stylised Earth — blue sea sphere, real continents with soft coasts, snow caps at the poles, atmosphere rim. No facets: cube-sphere N=128, merged seams, smooth normals.
2. **One continuous flight:** FLY TO GROUND / ORBIT (or wheel / altitude slider) drives ONE parameter; distance, tilt and camera-up change together, orbit → GothGirl's shoulder with no cut.
3. **Scale:** everything in metres. GothGirl 2.21 m, House 5.9 × 6.5 m, Tree 4.2 m, Hürth buildings at real metres, WB2 terrain with its own numbers (seed 43129 · 2.6 · 3.2 · 0.55). Planet R 400 m.
4. **Sculpt:** RAISE / LOWER brush on the planet (height along the sphere normal), radius on the mouse wheel, strength slider, Undo stroke, Clear sculpt. Near the ground a 0.82 m near-field patch carries the detail (WB2 density).
5. **Objects:** House · Tree · Rock (WB2 boulder Rock_3_E_Color1) · Pebble · Lamp (street_lantern) from the registry shards; click to place, edit-layer menu ✥ ⟳ − + ⬓ ⊹ ✕; ⬓ drops radially onto the planet and stands the object upright.
6. **Sky:** DAY / EVENING / NIGHT (tinyskies presets, 8 lights), RAIN (glass drops + streaks), DAY CYCLE, 4 world moods (hue only, land + sky).
7. **Buildings:** ELASTIC GROTESQUE CLAY (default) · CLEAN · CARTOON · GROTESQUE on 9 real Hürth buildings at Hürth's real position; harmonic palette seed (cologne-palette) or V2 fixed palette.
8. **Walk:** WALK (WASD, Shift = run), camera follows; KayKit Idle_A / Walking_A / Running_A; EyeRig v6 with the approved Rig_Medium default, source eyes removed (verified islands 2+3).
9. **Save:** SAVE → reload page → LOAD SAVE restores sculpt strokes, objects, sky, mood, building view, actor pose; editing continues.
10. **Ground look:** triplanar Derek RGB palette + macro tile + cel shading + KFB ink outline.

## Open points
- **LOD** is two levels (global mesh + near patch), not ZyFou's full chunk LOD. The global mesh (≈4.9 m spacing) shows sculpt detail only coarsely from mid altitude.
- **Buildings:** the three known V2 bugs stay open as instructed (roof lids without overhang, curb wedges, shadow banding). Roads are NOT placed on the sphere yet. Building bases sit at the lowest terrain point of their footprint (uphill side buried).
- **Scale on the Earth template:** at R 400 m, 1° ≈ 7 m — the Hürth block covers roughly Benelux/West Germany. Deliberate toy scale; a larger R needs chunked LOD.
- **Clouds:** `setCloudOpacity` is received but there is no cloud layer yet.
- **Godrays:** factor lowered from 0.06 to 0.025 (named deviation); at full source strength the cone streaks dominated the orbit view.
- **Stars** follow the camera at 85 % of the far plane (the source puts them at radius 80 around the origin).
- **Objects** keep their position when terrain is sculpted under them; ⬓ re-seats them.
- **Mixamo** clips: swap later by clip id (`CLIP_IDS` in wb1-actor.js).
- **Lamp** has no light emission yet (mesh only).
