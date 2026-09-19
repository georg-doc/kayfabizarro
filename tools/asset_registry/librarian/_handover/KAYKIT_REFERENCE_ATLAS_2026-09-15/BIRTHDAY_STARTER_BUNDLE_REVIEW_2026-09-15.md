# KFB Asset Librarian · Elisa Birthday Starter Bundle Review

**Date:** 2026-09-15  
**Status:** LIBRARIAN REVIEW / PROPOSAL. No ToolBox or Travel implementation.  
**Source:** `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/` on `main`.

## Scope / owner boundary

- The existing Birthday consumer contract remains authoritative: `tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/START_HERE.md`, `RETURN_BIRTHDAY_CONSUMER.md`, `POST_RETURN_CORRECTIONS_2026-09-15.md`.
- `kfb.asset-handoff.v1` remains candidate-only. It must not become a scene/compatibility owner.
- Travel/Astra owns actual scene composition and runtime validation.
- Animation Lab owns final animation compatibility decisions.
- Heavy/editable visual master stays in Dropbox; flattened visual target(s) may live in GitHub.

## SOURCE FACT · current reference bundle

GitHub folder contains:

- flattened Birthday mockup PNG
- Gemini mockup variant JPEG
- color-sheet JPEG
- reference screenshots
- `kfb-asset-handoff-animation-lab (2).json`
- `kfb-pet-graft-driver (5).json`

Dropbox mirrors the reference/mockup files under:

`/CLAUDE/KFB ToolBox Studio Rig Anim/KFB Elisa B-Day Reference+Mockups`

An editable master also exists separately as:

`/CLAUDE/KFB Stunt Car Race/_inbox/mockup elisa b-day 01.psd`

The PSD is therefore the natural heavy/editable visual source; GitHub PNG/JPEG derivatives are suitable for reference/consumer handoff.

## SOURCE FACT · current asset handoff

`kfb-asset-handoff-animation-lab (2).json`:

- schema `kfb.asset-handoff.v1`
- source commit `891eadf01e218f5fc21387e64cea1fec8332c5b6`
- consumer `animation-lab`
- overall `selectionStatus: candidate-only`
- `suitabilityDecision: owned-by-receiving-consumer`
- consumer allowed kind is `model-3d`

Observed selected groups include:

### Strong scene-core candidates

- `Platformer Game Kit - Dec 2021/Nature/glTF/Cloud_1.gltf`
- `Cloud_2.gltf`
- `Cloud_3.gltf`
- `GothGirl.glb` / player-facing role **Little Miss Messy**
- `GothGirl_Microphone.gltf`
- `GothGirl_MicStand.gltf`
- `GothGirl_Speaker.gltf`
- `GothGirl_Stool.gltf`

### Birthday / party dressing candidates

- Clown collection: balloons, circus podium, hoop, juggling pins
- Santa / Kenney Holiday / Toy Soldier present variants
- Farmer props including carrot / dirt-plot / lettuce
- Driver car

### Optional cast candidates observed in the handoff

- Magical Girl
- Monster Costume / Monster
- Ninja
- Protagonist A/B and other Rig_Medium characters
- Toy Soldier
- Vampire
- Werewolf

These are candidate actors only; their presence in the handoff is not a Birthday-scene decision.

## TESTED RESULT already available outside this handoff

The existing Birthday consumer return already establishes a tested minimal hero casting:

- Uncle FrizzleBob: existing Graft path, PASS
- Little Miss Messy / GothGirl: Rig_Medium, PASS
- Idle_A: 69/69 tracks on both hero figures
- Waving: 69/69 on both, return-to-idle observed
- Cheering: 69/69 on both, return-to-idle observed
- Dance remains P1 / visually unresolved
- Hihi Love-Hope is an inactive existing Cube-Pet slot
- GothGirl Speaker / EyeRig speaker remains P1

Do not replace this tested state machine with the broad asset handoff.

## Main review finding

### PROPOSAL · keep the broad handoff as a discovery pool, not as the final starter scene bundle

The current handoff is useful as an **asset exploration palette**, but it is too broad for a consumer-ready Birthday starter bundle.

Reasons:

1. It includes records that the declared consumer does not allow, e.g. GothGirl artwork / contents images and repeated texture records marked `consumerKindAllowed:false`.
2. It includes `GothGirl_Source.blend` with unresolved dependency / rig parsing state; this is authoring source, not runtime starter content.
3. It mixes three different purposes:
   - hero cast / signature props
   - scene dressing
   - optional alternate actors
4. It includes many near-duplicate present variants and party props that should be choices, not all required payload.
5. FrizzleBob is not naturally represented by the Registry asset handoff because he is consumed through the existing Graft owner/config path.
6. Hihi Love-Hope and the tested Birthday motion-state contract are also not represented by this asset-only file.

Therefore a scene starter should **reference** the existing `kfb.asset-handoff.v1`, not overload it.

## PROPOSAL · three-layer starter structure

### Layer A · `CORE` — required to reproduce the slice

1. visual target: flattened `mockup elisa b-day 01.png`
2. Uncle FrizzleBob: current selected Graft profile/config + stable fallback from existing Birthday return
3. Little Miss Messy: exact `GothGirl.glb`
4. tested hero state casting: `Idle_A`, `Waving`, `Cheering`, return to `Idle_A`
5. Hihi Love-Hope: existing inactive Cube-Pet slot / `Coming Soon...`
6. only the environment primitives actually required by the mockup, likely chosen from the Cloud candidates after visual check

### Layer B · `SIGNATURE / SCENE DRESSING` — curated optional set

Good first candidates:

- GothGirl microphone
- GothGirl mic stand
- GothGirl speaker
- GothGirl stool
- a deliberately small present set (2–4 shapes, not every variant)
- one balloon family / color choice
- circus podium **or** hoop if the visual target genuinely needs it
- Driver car only if it has a defined scene role

Each item should receive a simple scene role such as `hero-prop`, `foreground-dressing`, `background-dressing`, `interactive-candidate`, or `P1`.

### Layer C · `ALT CAST / DISCOVERY` — not required by the starter

Magical Girl, Monster, Ninja, Protagonists, Toy Soldier, Vampire, Werewolf etc. should remain available through Librarian discovery but not travel as required starter assets unless Georg explicitly casts them into the scene.

## PROPOSAL · tiny Birthday scene manifest sidecar

Do **not** change `kfb.asset-handoff.v1`.

Add a small consumer-side document later, e.g. `kfb.birthday-scene-starter.v1`, whose job is only to bind existing sources to Birthday roles:

```json
{
  "schema": "kfb.birthday-scene-starter.v1",
  "status": "candidate-only",
  "visualTarget": "tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/mockup elisa b-day 01.png",
  "actors": {
    "uncleFrizzleBob": {"source": "existing-graft-owner", "profile": "candidate-with-tested-fallback"},
    "littleMissMessy": {"assetId": ".../GothGirl.glb", "testedStateSet": "birthday-return-2026-09-15"},
    "hihiLoveHope": {"source": "existing-cube-pet-cat", "state": "coming-soon"}
  },
  "coreAssets": [],
  "dressingCandidates": [],
  "p1": []
}
```

This sidecar would not declare animation, attachment, scale or scene compatibility. It would only preserve **intent and selection** across chats/consumers.

## Current classification

- **DECISION already existing:** Birthday P0 = Uncle FrizzleBob + Little Miss Messy active, Hihi inactive, stable Idle/Focus/Select/Rest.
- **TESTED RESULT:** hero Rig_Medium state casting from existing Birthday return.
- **SOURCE FACT:** current broad handoff contains a rich set of relevant character/prop/environment candidates.
- **INFERENCE:** the broad handoff appears to have been assembled as a visual/scene palette rather than a minimal runtime payload.
- **PROPOSAL:** retain it as discovery pool and derive a much smaller scene starter sidecar.
- **UNRESOLVED:** exact scene role of each party prop / alternate actor; exact cloud subset; final FrizzleBob candidate visual smoke; Pixel-level comparison of flattened mockup against runtime staging.
