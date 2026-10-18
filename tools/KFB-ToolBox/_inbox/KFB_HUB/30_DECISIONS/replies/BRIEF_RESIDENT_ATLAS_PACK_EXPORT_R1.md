# Brief · Claude Design project "KFB_Resident_Atlas" · export to scene packs `kfb.scene-pack/1` R1 · V-465 · 18.10.2026

**Context:** your scenelets (orc band, disco, graveyard, fight sandbox, duel, sci-fi outpost, clown island …) should become usable in the game as **packs**. Georg places them in the world builder's God mode via the Asset Library at monument/diorama anchors. The pack format is defined in `KFB_HUB/30_DECISIONS/replies/SPEC_SCENE_PACK_R1.md` (on GitHub: register branch `docs/kfb-decisions-register-2026-10-11`, path `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SPEC_SCENE_PACK_R1.md`). **Read it word for word first.**

**Tier 0:**
1. Build **one export function** in the Atlas studio (next to the existing recipe store/export in `lib/studio.js`): scenelet → `kfb.scene-pack/1` JSON. No new tool. Authoring stays with you.
2. **First pack: orc band "The KayfaBizarros"** (`resident-band-module-01.json` + `band-module.js`). Convert the existing anchors `support`/`front`/`footprint`, the 4 roles, the song clock (`beatPos`) and the clip/pose assignment one-to-one.
3. **No raw GLB paths for figures:** each actor refers to a **figure card** (`figures/<id>.figure.json` + variant).
   - If a card is missing (orc leader, guitarist, drummer, trumpeter), list it under `missingFigureCards[]`. WS0 creates them.
   - The drummer stays marked "parked" (`status: "parked"`), but goes into the pack.

**Block, mandatory fields per pack:**
- `anchors`: support, front, footprint (polygon), clearance, entry[], audience[], camera[], ground.
- `actors[]`: role, figure + variant, slot relative to support. Figures are never scaled (V-060); adapt the pack to the figure sizes, and note any differences.
- `props[]`: catalog entry + transform + mount (e.g. `handslot.r`) + licence.
- `timeline`: one time base.
  - Band: `kfb.performance/1` of the song (mix seconds/beats/bars). The song "Rubbish Groove" at 100 BPM, phase 0.465, pinned.
  - `cues[]` per actor: `clipId` from the motion catalog (**pinned commit**, not `georg-doc-patch-3`) + timeScale + beatPhase + loop. Generated poses only as `gen` + fit rules.
- `rules`: host owns collision; wander radius; relevance/sleep.
- `licence[]` per dependency: licence, redistribute, visibility (public/private/build-only), attribution.
  - Note: KayKit is CC0 according to the licence file (decision pending with Georg, q35).
  - Mixamo-derived clips: "licence unresolved", **private**.
- `preview`: thumbnail + 10 s clip.

**Second step (after the band):** export the disco, graveyard and duel the same way. Mark their open points honestly (beat values set instead of measured, placeholders), don't paper over them.

**Delivery:**
- GitHub branch `packs/resident-atlas-export-<date>`:
  - `packs/<id>/<id>.scene-pack.json`;
  - preview files;
  - `RETURN.md` with mapping old format → pack field per scenelet, gaps, `missingFigureCards[]`.
- Also commit the **RA17 session state itself with a SHA** for the first time; the S17 cut has never had a Git SHA.
- No main merge without Georg.

**Gate R1:**
- the band pack validates against the spec fields;
- every actor has a figure card or is listed;
- every clip has a pinned `clipId`;
- licence complete.
