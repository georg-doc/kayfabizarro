# HANDOVER · WSA · NPC-CARD-SPEC-01 · Resident Card Speculation Scene

Date: 2026-09-24 · From: Claude Design · Status: `CANDIDATE · GEORG VISUAL REVIEW OPEN`

## One sentence
Two real KFB residents (FrizzleBob Driver Graft, GothGirl) find one real KFB Card ("The Doomsday Clock") and read it from two worldviews in a ~26 s beat recipe. Everything runs on existing owners, packaged as one movable scene root with no baseplate.

## Read in this order
1. `docs/NPC-CARD-SPEC-01_RETURN.md`: sources, reused/not reused, owner proof, TUNE list.
2. `npc-card-spec-01/resident-card-speculation.recipe.json`: the recipe.
3. `npc-card-spec-01/resident-scene.mjs`: the mount seam.

## Mount seam (host supplies renderer/scene/camera/persistence/placement)
```js
const s = await mountResidentScene({ THREE, GLTFLoader, parent, camera, overlay /* DOM for bubbles */,
  recipe, getCardCanvas /* (cardSlot) => Promise<canvas> via kfb-viewer loadDeck */, base });
// per frame
s.update(dt, camera, viewW, viewH);
s.restart(variant) · s.play() · s.pause() · s.setReview('scene'|'actor-a'|'actor-b'|'mouths') · s.report() · s.dispose()
s.root  // the one movable vignette root (A, B, card)
```
three 0.160 (+esm via jsDelivr); rigs via jsDelivr @ `5650b6c54d8789b20ea80abe857688173d506d3b`.

## Owners (unchanged donors)
- Mouth: PetMouth v1 (A male via mountGraft · B female, profile params + recipe override)
- Eyes: EyeRig v6 (A via mountGraft · B via mountKayKitEyes + seed)
- Mixer: 1 per actor (A `animation:'host'` on graft.figure · B on gltf.scene); clips = KFB Motion Library Rig_Medium
- Bubbles: Podcast v5 bubble-shaper.v2 `paintBubble` + bubble-shapes.json + ink canon
- Card bitmap: kfb-viewer.js `loadDeck().getCardCanvas()`

## Integration gate (exactly one)
Georg accepts both faces and mouths as the Resident talk look (scene + actor-a + actor-b + mouths, visible tab). **Then** mount `mountResidentScene` into ONE Town/WorldBuilder host at a world transform. The host keeps movement, camera, persistence and journey state.

## Before WSA mounts
- Upload `KFB_Motion_Library_Rig_Medium.glb` to `media/3D_Assets/Animations/KFB_Motion_Library/` (+NOTICE.md per Animation Intake 01 §2). Switch `recipe.motion.library` to its RAW URL (currently a relative local copy).
- Card: in a host without `pdfs/`, point `recipe.card.deck/deckData` at RAW URLs.

## Do not
Add a second mouth/eye/mixer/bubble system, bake eyes into GLBs, or promote the recipe to a global contract before the gate. No Cloudflare publish for iteration.
