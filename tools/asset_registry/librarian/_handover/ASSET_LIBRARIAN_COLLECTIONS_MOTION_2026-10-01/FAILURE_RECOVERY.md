# Asset Librarian · Collections + Motion Preview · Failure Recovery

Status: **FROZEN PARTIAL CANDIDATE · CORE SALVAGEABLE · MOTION SCRUB STOPPED**
Date: 2026-10-01

## Product outcome that worked

The existing Asset Librarian was extended without creating a second Registry or animation owner.

Verified before the failing scrub gate:

- **KayKit is a real source-family filter**, not text injected into the search box.
- visible **Family → Pack → Collection** browsing consumes existing Registry pack facts.
- **Tiny Treats** resolves as a family with **8 packs** in the tested Live Registry.
- **Bubbly Bathroom → Assets** returns **86** exact collection candidates.
- existing v1–v1.7 browser/WebGL regressions remain PASS.
- Motions can be selected in the existing Motions library and previewed on the real **KayKit Driver Host** through the existing Three.js / AnimationMixer binding path.
- motion source → actor binding reaches the visible preview and reports bound tracks.
- the first transport repair proved **speed** and **pause** state before the test advanced to scrub.

Animation Lab / ToolBox remains the owner of final animation compatibility and authoring.

## Failed optional extension

New transport controls attempted:
- Play / Pause
- Speed
- Loop
- Scrub

The blocking defect is **Scrub only**.

Observed:
- initial browser run reached animated actor preview, then timed out on combined transport assertion;
- repair pass 1 separated semantic/UI state and advanced through Speed + Pause, then timed out on `motion scrub`;
- repair pass 2 retained an explicit manual scrub position, but the same `motion scrub` gate timed out again.

No third repair.

## Evidence

### Baseline / implementation run
- Browser run: `36846330576`
- failure: `Timeout motion transport: false`
- evidence artifact: `11153642894`
- artifact digest: `sha256:1bc99212a9f5ce162de2e7766cce54cf0b164df9e73ce12f6105ec41bfcd4e7a`

### Repair pass 1
- Browser run: `36847139747`
- improvement: Speed + Pause passed; failure narrowed to `Timeout motion scrub: false`
- evidence artifact: `11154495981`
- artifact digest: `sha256:8a0ee542281aa31de6cb877215992de53a9e39822d6d7c82b4f45acf5d9e32f2`

### Repair pass 2 · stop condition
- Browser run: `36847711079`
- failure remains: `Timeout motion scrub: false`
- evidence artifact: `11154745686`
- artifact digest: `sha256:ef8b0d5ce243b207f6bf1f5725198fa379be8a64faf87ed5fbd07865c4082427`

All three runs kept the existing v1–v1.7 browser regressions green. The corresponding Asset Registry refresh jobs also passed.

## Frozen source

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/asset-librarian-collections-motion-preview-2026-10-01`  
Draft PR: **#304**  
Frozen implementation head: `545853924c4c177b6e26af588020b7a59307bb71`

Do not repair the scrubber again on this branch.

## Proven cause vs hypothesis

**Proven**
- asset discovery, collections, actor load, motion load and track binding are not the blocker;
- failure occurs only after the test has reached transport control;
- after repair pass 1, Speed and Pause succeed and Scrub does not satisfy the expected UI/semantic state.

**Unknown**
- exact Three.js action-time / browser-range synchronization responsible for Scrub.

Do not convert the unknown cause into a new animation architecture.

## Salvage map

Keep:
- `browse-families.js`;
- Family / Pack / Collection browse UI;
- family-aware search filtering;
- KayKit shortcut repair;
- Motion preview actor selector;
- existing `playExternalClip()` binding preview;
- all existing Registry / Selection / Town / Rig / Motion owner boundaries.

Quarantine:
- new transport bar and transport-state additions;
- v1.8 scrub implementation.

## Exactly one next gate

**ASSET-LIBRARIAN-COLLECTIONS-MOTION-SALVAGE-01**

Fresh branch from current main. Port only the green product core:

1. Family → Pack → Collection browse;
2. KayKit shortcut as family filter;
3. Motion → real preview actor → existing animated clip playback + binding report;
4. **no new scrub/speed/loop transport**.

Gate: existing v1–v1.7 regressions + reduced v1.8 Chrome/WebGL smoke ending at successful `tracks bound`, zero console/runtime errors.

That delivers a useful Librarian for WorldBuilder without spending more budget on an authoring control that already belongs more naturally in Animation Lab / ToolBox.
