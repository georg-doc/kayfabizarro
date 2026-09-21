# KFB ToolBox · KayKit Legacy RPG Rigging · Current Router

**Date:** 2026-09-21  
**Status:** LEGACY_BASE_LOCAL_BROWSER_PASS · KLR_KIT_MATRIX_PASS · KLR_EYE_01_TECHNICAL_PASS · VISUAL_REVIEW_NEXT  
**Owner:** KFB ToolBox / Rigging  
**Implementation branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Draft PR:** #155  
**Current branch head:** `0fbf240150fd32274cf93305c8014262b72b860a`

## Legacy base · proven

Source-backed KayKit Dungeon 1.0 candidate:

- 4 static modular bodies: Barbarian, Knight, Mage, Rogue;
- 17 head choices: four defaults, twelve alternate class heads and Skull;
- source body/clothing material inventories;
- five embedded hat/hair/helmet sources;
- 24 tiered weapons across eight families;
- Arrow, three Quivers and Spell Book;
- existing 6-bone / 30-clip `Rig_Legacy` donor;
- Resident Atlas inverse-bind assembly;
- measured rigid-arm held-prop anchor;
- LegacyFaceHost → existing EyeRig v6;
- no source GLTF/GLB mutation and no placeholder geometry.

Exact tested Legacy-base head:

`5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`

Evidence:

- static/source: **29/29 PASS**;
- KLR-SYNC-01: **41/41 PASS** · run `35550320886`;
- full Legacy browser/WebGL: **44/44 PASS** · run `35550320883`;
- 0 failed browser resources;
- 0 page/console errors.

KLR-SYNC-01 permanently resolved the earlier stale actor-switch proof by adding an explicit assembly request/ready token and rejecting stale async completions.

## KLR-KIT-01 · shared Baukasten / randomizer direction

Goal accepted:

One reusable Legacy appearance/assembly layer for:

- Combat Arena monsters/enemies;
- KFB WhackMan player/ghost presentation;
- later KFB games.

Candidate shared schema:

`kfb.legacy-actor-recipe/0.1-candidate`

Pure core rules:

- body/head/headExtras/held-item appearance only;
- exact source revisions;
- caller-owned RNG;
- no `Math.random()`;
- deterministic selection;
- fail-closed source filters;
- no HP, damage, armor, AI, faction, score, lives, spawn or GhostMode fields.

Pure/static evidence on the KLR-KIT candidate:

- **33/33 PASS** static/source;
- **16/16 PASS** ActorRecipe deterministic suite.

## KLR-KIT browser integration · frozen

Frozen exact candidate:

- branch `chatgpt-web/klr-kit-01-failed-2026-09-21`;
- head `e3a06e3451637a8b447192113cab43f3ece84cd8`.

Browser attempt 1:

- run `35550795805`;
- HTTP / READY / randomizer UI / WebGL PASS;
- first seeded recipe timed out before Ready.

Browser attempt 2:

- run `35551084074`;
- initial source isolate settled;
- first isolated recipe failed with:
  `$(...).forEach is not a function`.

Proven root cause:

During the KLR-KIT code-edit operation, JavaScript `String.replace()` replacement-string semantics collapsed the previously working collection helper:

`$$('[data-mode]')`

to:

`$('[data-mode]')`.

This is an integration/edit regression. It is **not** evidence of a bad Legacy asset, bad Rig_Legacy assembly, bad deterministic randomizer, Combat incompatibility or WhackMan incompatibility.

Full recovery:

https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21/tools/KFB-ToolBox/legacy-rpg-rigging/failure-recovery/KLR_KIT_01_FAILURE_RECOVERY_2026-09-21.md

## KLR-KIT-F1 · PASS

Fresh bounded recovery slice:

- branch `chatgpt-web/klr-kit-f1-2026-09-21`;
- base frozen candidate `e3a06e3451637a8b447192113cab43f3ece84cd8`;
- tested head `44d595bc60259f4a74da7043df13582f1b5ccd89`;
- Return: `KLR_KIT_F1_RETURN.md`.

Runtime repair was exactly the proven selector seam:

`$('[data-mode]') → $$('[data-mode]')`

in Tool + Stage mirror.

Evidence:
- **33/33 PASS** static/source;
- **16/16 PASS** ActorRecipe deterministic suite;
- **2/2 PASS** focused selector regression;
- **21/21 PASS** isolated browser/WebGL `gate-16`;
- 0 failed resources;
- 0 page/console errors.

Run:
`35552848730`

Job:
`106190694773`

Artifact:
`10618729208`

Digest:
`sha256:d2983c413b975f3d00bfbfb87564c5b90e16be4a99deb1bcd29369a4cb335c64`

The isolated recipe proved:

`Knight + Rogue Head C + no held item`

with ready token `1:knight:rogue-c`, `RIG_LEGACY`, `ASSEMBLED`, 30 clips and all core parts retained.

KLR-KIT-F1 resolves the selector-regression gate. It does **not** yet prove the full three-seed browser matrix.

## KLR-KIT matrix · PASS

Fresh bounded evidence slice:

- branch `chatgpt-web/klr-kit-matrix-2026-09-21`;
- F1 base `eedf34805bc869fedd8e94ecec9e914d2ea12d59`;
- tested matrix head `8197d8f1b6e1becc550b9eeb6d766b455a0b33ab`;
- Return: `KLR_KIT_MATRIX_RETURN.md`.

No runtime code changed in this slice.

Evidence:
- **33/33 PASS** static/source;
- **16/16 PASS** ActorRecipe deterministic suite;
- **2/2 PASS** selector regression;
- **35/35 PASS** browser/WebGL matrix;
- 0 failed resources;
- 0 page/console errors.

Run:
`35660231145`

Job:
`106533462704`

Artifact:
`10667035972`

Digest:
`sha256:fb050fb44ceea245bfc1db1b243b47e2b2b811659b0e8d719616fecbcd09f625`

Browser sequence:

`gate-16 → gate-75 → gate-33 → repeat gate-16`

This proves:
- alternate and default heads;
- headExtras ON/OFF;
- real held weapon slot;
- exact recipe/UI identity;
- same-seed recipe/key reconstruction;
- three distinct starting recipe keys.

The shared Legacy appearance Baukasten / Character+Monster randomizer core is now technically proven as a ToolBox candidate. Consumer integration remains separate.


## Consumer boundaries

### Combat Arena

Current receiving evidence:

- implementation PR #5 · head `954f2db7484dc566e468e5ce89b0d95940d97537`;
- CA2-04 PR #7 · head `6df5d4cd3b5e17bacb32438beac528a37c943bb0`.

Combat retains:

- MobBrain;
- spawn/movement;
- enemy mixer lifecycle;
- targeting;
- hit/contact;
- damage/HP/death;
- drops/rewards.

ToolBox may later supply only the Legacy appearance recipe + assembled actor.

### KFB WhackMan

No GitHub implementation owner is currently pinned.

Current Dropbox input:

`/CLAUDE/KFB WhackMan/KFB WhackMan - Perplexity.md`

This is concept/research input only.

ToolBox must not create WhackMan Maze, PlayerMotor, Ghost AI, score, pickups or power-up ownership.

## KLR-EYE-01 · TECHNICAL PASS

Draft PR:
`#162 · feat(toolbox): Rig_Legacy EyeRig batch 17/17`

Branch:
`chatgpt-web/legacy-eye-batch-17-2026-09-21`

Current branch head:
`7b1b52a60d64c9dc710514a59d1a7365f8a168e7`

Authoritative persisted-profile tested head:
`91cca48809fb8a86c8ea7a8326eb6637fa89a066`

Result:

- **17/17 persisted Legacy head profiles**;
- **16 MEASURED_CANDIDATE**;
- **1 HUMAN_REQUIRED: Skull**;
- EyeRig v6 remains eye runtime owner;
- EyeOval remains shape helper;
- existing `kfb.eye-profile/0.1-candidate` + `kfb.eye-profile-batch/0.2-candidate` reused;
- source GLTF/GLB unchanged;
- no shared Rig_Legacy class default invented.

Automatic source-first generation:

- run `35661858046`;
- job `106538705766`;
- **24/24 static PASS**;
- **247/247 browser/WebGL PASS**;
- 17/17 exact source isolate → assemble → measure/classify → EyeRig v6 mount;
- 0 failed resources;
- 0 page/console errors;
- artifact `10667124760`;
- digest `sha256:e95731117565bef97ef917d47bb2ff3529b64d01227223642db53ea401973f26`.

Persisted-profile reconstruction:

- run `35662264764`;
- job `106539992446`;
- **30/30 static/profile PASS**;
- **215/215 browser/WebGL PASS**;
- 17/17 saved profiles reloaded/remounted;
- exact saved actor/source/anchor/status/face-color identity;
- EyeRig eyeFrame present 17/17;
- 0 failed resources;
- 0 page/console errors;
- artifact `10667790643`;
- digest `sha256:e7a8b41d8172c621aef3c1250d95c2e938db58cac761b83459fbe026cf8d8ba1`.

Full Return:

`tools/KFB-ToolBox/eye-rig-batch/docs/RIG_LEGACY_EYE_BATCH_2026-09-21.md`

Cloudflare publication branch now contains the complete Legacy review-lane file set under:

`/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`

Public `pages.dev` runtime verification from this chat environment is still pending because DNS/Web fetch is unavailable here. Do not convert repository publication evidence into Georg visual approval.


## Stage status

Intended route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/`

**NOT PUBLIC_VERIFIED. Do not use it as a human test link yet.**

Do not publish the frozen KLR-KIT integration candidate.

## Exactly one next gate

**KLR-EYE-VIS-01 · 17-head human visual review**

Direct intended review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`

Review all 17 heads in Front + 3/4:

- approve / adjust / reject per profile;
- verify EyeRig placement separately from source-eye cleanup;
- Skull must receive manual placement or remain unsupported;
- only accepted/adjusted profiles become Combat-ready.

Combat ranged/melee integration starts only after this visual profile gate.
