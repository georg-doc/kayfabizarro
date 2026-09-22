# C-MVP-A-R1 · finite actor repair and browser recheck

Status: **R1 PARTIAL · ENEMY TRANSFORMS PASS · RELEASE/TARGETING FAIL · CANDIDATE PRESERVED**

## Bounded scope

- Source repository: `georg-doc/KFB-Combat-Arena`
- PR: `#5`
- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- R1 parent head: `2aea7c85f0e1f2ea333a92c5ce98bbcd16bdcfb3`
- No Legacy actor, melee, Spindle, visual polish, new Combat architecture or Gunfight tuning.
- The known failing candidate was not written to `cloudflare-live` or the fixed Combat Stage.

## Root cause and repair

The exact Mage and Warrior GLBs were parsed and every visible Mesh/SkinnedMesh was measured independently. All nine visible parts of each source actor and both complete source bounds were finite. No Mage source mesh is defective.

The actual failure was an incomplete CA2 actor descriptor: both enemies lacked a finite `forwardZ`. Because Mage completed its asynchronous load first, the live rotation step used `undefined`, produced a non-finite rotation/matrix and only then made later world bounds non-finite. Pair separation subsequently used the poisoned radius and contaminated the second actor.

R1 therefore:

- declares the measured `forwardZ: 1` for both exact KayKit source actors;
- measures visible finite source geometry, naming the exact rejected node if a part is invalid;
- explicitly validates raw width/height, target height, scale, scaled radius and scaled height with `Number.isFinite` before applying them;
- admits an actor to the shared group/list only after all checks pass;
- quarantines an invalid live actor before it can enter pair separation or contaminate another actor;
- adds regression tests for finite source scaling, exact poisoned-node rejection and bad-actor isolation.

There is no `NaN -> 1` or other guessed numerical fallback.

## EyeRig/Mouth diagnosis

No face repair was required and no second face owner was added.

The pinned `graft-mount.v1.js` imports and constructs the outer EyeRig and Mouth itself. The two warnings come from the inner legacy `frizzlebob.v4a.js` layer, where those optional modules are absent by design. Browser evidence after `mountGraft()` proves:

- `g.rig`: present;
- `g.mouth`: present;
- Eye actors: 2;
- Eye meshes: 8;
- visible eye meshes at runtime: 8;
- gun attachment: visible.

DriverCA2 now reports that existing graft-owned evidence without forwarding modules or taking face ownership.

## Automated evidence

- Full repository suite: **71 passed / 0 failed / 0 skipped** (previously 68; three focused regressions added).
- CA2 integration checks: **11/11 PASS**.
- Portable build: **217 files**.
- Re-home verification: **172 preserved runtime / 66 verified donor files / routes PASS / public-local paths NONE**.

## Real-browser recheck

Local exact package route:

`http://127.0.0.1:4192/slices/combat-integration-v2/?r1=baseline`

Passed:

- Driver body, existing outer face, two eye actors/eight visible eye meshes and gun are present.
- Idle is admitted; keyboard Walk probes move the player and return to Idle.
- Skeleton Mage and Skeleton Warrior each have finite scale/bounds/transforms and remain finite together.
- Desktop and `390 x 844` narrow viewport render with application errors `0`.
- Audio loads **22/22**, missing `0`, **2,931,032 bytes**, and unmutes after a real gesture.
- Browser console errors: `0`; two pre-existing Three.js sigma clipping warnings remain.
- Runtime reached play in approximately 8 seconds and reported about 70 render calls at desktop size.

Blocked after the repaired transforms:

- A real target click enters `Idle_Gun`, but the existing flow reports `Waffe noch nicht bereit - erneut zielen`.
- Repeated real target clicks produce no recorded release: `schuesse=0`, `treffer=0`, `kills=0`.
- The player returns to `Idle`, so input is released, but real muzzle/projectile/hit cannot be proven.
- Warrior/Mage defeat, hit reaction, respawn attachment check and Rewards/Run-Clear are consequently not provable.

Per the R1 gate this is not repaired here. It becomes one separate C-MVP-A-R2 root-cause slice limited to release/targeting.

## Publication

- Combat candidate: preserved on its bounded branch.
- `cloudflare-live`: unchanged.
- Fixed URL `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`: unchanged.
- `PUBLIC_VERIFIED`: **NO**.

## One next gate

**C-MVP-A-R2 · release/targeting root-cause only.** Start from this R1 head, reproduce the real target click, trace readiness/target/release/muzzle ownership without tuning damage or adding features, and stop after one bounded repair pass.
