# RETURN · Combat Arena Integration V2

Status: **C-MVP-A-R2 LOCAL BROWSER PASS · WARRIOR CORE LOOP PASS · MAGE HOLD · PUBLICATION PENDING**

## Exact handoff

- Implementation repository: `georg-doc/KFB-Combat-Arena`
- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- PR: **#5** · draft · open · not merged
- Base: `main@f6a59ad15b9ffcf3164b0ab013f223962b63f61f`
- Validated R2 implementation head before this metadata-only Return refresh: `f6ccdcbcca9fde9a234794c8583dbec9b685b4cf`
- Bounded project Stage route: `/slices/combat-integration-v2/`
- Planned public KFB Stage URL: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`
- Public route status: **NOT PUBLISHED / NOT VERIFIED**

## Implemented outcome

- Current ToolBox `graft-driver` is the CA2 visible player layer.
- `Player.v2` remains the only movement/ground owner.
- `DriverCA2` owns one player `AnimationMixer`; face remains graft-owned.
- Existing Gunfight consumes the graft muzzle anchor when present.
- Both verified KayKit Skeleton adapters remain catalogued. The current MVP runtime admits only Skeleton Warrior; Skeleton Mage is `HOLD · C_MVP_MAGE_ADAPTER`.
- `MobBrain` remains spawn/movement/enemy-mixer owner.
- Existing Gunfight, Rewards and RunFlow contracts remain owners of their state.
- Neutral instance/portal fields are carried through the bounded Slice contract only; no World/Travel/Dungeon runtime was changed.

## Evidence

GitHub Actions for validated R2 implementation `f6ccdcbcca9fde9a234794c8583dbec9b685b4cf`:

- run **35766345655**
- job **106876741414**
- repository suite: **74/74 PASS**
- portable build: **218 files**
- re-home: **172 preserved runtime files / 66 verified donor files / routes PASS**

Evidence/handoff files:

- `SOURCE.json`
- `ANIMATION_MAP.json`
- `TEST_REPORT.md`
- `STATE_SEQUENCE.md`
- `CHANGELOG.md`
- `FAILURE_RECOVERY_STAGE_PACKAGING.md`

## Browser proof

R1 proved the actor/face/audio/viewport baseline. R2 then used real pointer input against the exact local package and proved release, three Warrior hits, kill, reward, clear and next-card respawn. Exact counters and marker timing are recorded in `C_MVP_A_R2_CORE_LOOP_2026-09-22.md`. Public Cloudflare proof remains pending until this exact revision is deployed.

## Stage / Hub packaging result

The earlier binary-transfer boundary is resolved on the dedicated candidate branch; the existing exact package was preserved while the browser repair ran. R2 now produces an exact **218-file** package. It is not called public or live until that revision is copied to the protected publication branch and the fixed Cloudflare route is opened successfully.

No broken mirror, replacement font set, VFX fallback, generic UI or second runtime owner was introduced.

## Unresolved

- exact R2 public Stage revision and Hub marker;
- Cloudflare revision proof;
- performance before/after;
- Georg freeplay/visual gate.

## R2 browser outcome

The bounded R2 pass found the release stop at the real graft barrel alignment (`0.9788-0.9793` against `0.985`). Gunfight now consumes the donor's measured barrel axis and turns the body by the live weapon yaw instead of weakening the release gate. Semantic picking falls back to the same finite visible body bounds used by combat when a skinned mesh does not answer triangle raycast.

The local exact package records **5 shots / 3 hits / 1 Warrior kill / 1 reward die / 1 Pop**, then visible `Card cleared`; `Next card` returns phase to `play`, player HP to `100`, and spawns one fresh Warrior at HP `3`. See `C_MVP_A_R2_CORE_LOOP_2026-09-22.md`.

Exactly one next gate: **publish the exact R2 package to the protected Combat Stage, verify the fixed Cloudflare URL, then Georg freeplay.** No Legacy, melee, Mage work or Spindle.
