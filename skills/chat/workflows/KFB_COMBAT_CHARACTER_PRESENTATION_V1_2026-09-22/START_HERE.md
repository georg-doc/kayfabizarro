# KFB Combat · Character Presentation v1 · Web-only polish slice

Status: **PREPARED · WEB ONLY · LOCAL PREVIEW · NO WORK / NO CLOUDFLARE DEBUG LOOP**
Owner: Combat Arena consumer presentation; existing Player/Gunfight/MobBrain ownership stays intact.

## Why

Current public Combat MVP proves the core loop, but Georg visually reports:

- player and other actors appear to hover above the floor/card;
- gait does not read synchronized to translation;
- normal movement appears too fast / Run-like;
- Shift→Run distinction is not reading correctly;
- 3D contact shadow is not placed/read correctly.

These are **presentation/locomotion-consumer issues**, not reasons to reopen Combat architecture.

## Current source facts

Combat `Player.v2` already contains:
- Shift-owned Run selection: `const laufen = !!s.sprint && !s.aim`;
- separate Walk/Run clip selection;
- measured reference-speed → timeScale mapping;
- live foot-offset correction against `field.floorY()`.

Therefore do not reinvent movement.

The current problem is to prove why the existing mechanisms do not produce the expected visible result.

## Proven motion donor

ToolBox Motion Lab PR #127:
`chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20@7c8cc218ec46dabb20409c9e0b5368afcf5845c6`

Useful measured Rig_Medium facts:
- Walking_A ref ≈ 0.611;
- Running_A ref ≈ 2.480;
- foot contacts measured;
- same-foot phase-sync Walk→Run donor;
- speed→timeScale;
- hysteresis;
- handoff candidate ≈ 1.108;
- Running_B = HOLD.

Motion Lab explicitly does not own consumer movement physics.

## Shadow donor

Do not use a fake painted blob.

Existing Legacy Web Pet donor proves a real Three.js shadow path:
- shadowMap enabled;
- castShadow on actor meshes;
- real receiver using ShadowMaterial;
- directional light with shadow camera.

Reuse the principle only after checking Combat's current renderer/light/ground owners. Do not create a second lighting world if Combat already supplies an appropriate shadow-casting light/receiver.

## CP1-A · diagnostic + smallest repair

One Web chat slice.

### Ground/contact

Measure actual visible skinned actor bottom against the live Arena floor during:
- Idle;
- Walk;
- Run;
- Aim.

Do not tune by eye first.

If current `fussOffset` controller is correct numerically but parent/child transforms invalidate the result, fix that seam.

### Walk / Shift Run

Prove input state visibly:
- W = Walk;
- Shift+W = Run;
- releasing Shift returns to Walk.

No new Sprint clip.

### Foot sync

Reuse measured Rig_Medium profile and phase-sync/hysteresis donor.

Do not change Player movement ownership.

Consumer goal:
translation speed and animation phase should visually agree.

### 3D shadow

Use one shadow owner.

Receiver should sit on the actual live floor/support surface and follow that surface when needed.

Shadow is presentation only; it must not change collision/ground truth.

## Acceptance

Local portable preview only.

Prove with Warrior only; Mage stays HOLD.

Georg checks:
1. feet no longer visibly hover;
2. W clearly walks;
3. Shift+W clearly runs;
4. Walk→Run transition does not visibly double-step/pop;
5. obvious foot sliding is reduced;
6. shadow contacts the same floor under the actor and does not float separately;
7. existing Combat core loop still works.

## Budget stop

If one optional actor or one animation variant misbehaves:
HOLD it.

Do not block CP1-A.

If a result is ambiguous visually, ask Georg before a second tuning pass.

## Delivery

- GitHub branch/head;
- focused tests;
- additive Return/changelog;
- **Portable Preview Pack**;
- no Work;
- no Cloudflare until Georg accepts locally.
