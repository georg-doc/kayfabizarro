# RETURN · Combat Arena Integration V2

Status: **CI_PASS · PUBLIC_STAGE_BLOCKED · BROWSER/HUMAN_PENDING**

## Exact handoff

- Implementation repository: `georg-doc/KFB-Combat-Arena`
- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- PR: **#5** · draft · open · not merged
- Base: `main@f6a59ad15b9ffcf3164b0ab013f223962b63f61f`
- Validated handoff parent before this metadata-only Return refresh: `95971ff0f817ef9d1280f1f235e10d0b2adc89b8`
- Bounded project Stage route: `/slices/combat-integration-v2/`
- Planned public KFB Stage URL: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`
- Public route status: **NOT PUBLISHED / NOT VERIFIED**

## Implemented outcome

- Current ToolBox `graft-driver` is the CA2 visible player layer.
- `Player.v2` remains the only movement/ground owner.
- `DriverCA2` owns one player `AnimationMixer`; face remains graft-owned.
- Existing Gunfight consumes the graft muzzle anchor when present.
- Exactly two verified KayKit Skeleton adapters are admitted:
  - Skeleton Warrior
  - Skeleton Mage
- `MobBrain` remains spawn/movement/enemy-mixer owner.
- Existing Gunfight, Rewards and RunFlow contracts remain owners of their state.
- Neutral instance/portal fields are carried through the bounded Slice contract only; no World/Travel/Dungeon runtime was changed.

## Evidence

GitHub Actions for validated handoff parent `95971ff0f817ef9d1280f1f235e10d0b2adc89b8`:

- run **35524287323**
- job **106113636457**
- `npm test`: **68/68 PASS**
- CA2-specific: **8/8 PASS**
- portable build: **215 files**
- re-home: **172 preserved runtime files / 66 verified donor files / routes PASS**

Evidence/handoff files:

- `SOURCE.json`
- `ANIMATION_MAP.json`
- `TEST_REPORT.md`
- `STATE_SEQUENCE.md`
- `CHANGELOG.md`
- `FAILURE_RECOVERY_STAGE_PACKAGING.md`

## Browser / screenshot proof

No real-browser state capture or screenshot proof exists in this handoff. The required sequence is written in `STATE_SEQUENCE.md` and remains entirely **PENDING**. Automated ownership/contract tests are not being promoted to visual proof.

## Stage / Hub packaging result

An exact public mirror was investigated using the established `kfb-hub/stage/<project>/runtime/` pattern.

- private runtime scope inspected: **180 blobs**
- exact blobs already reusable in current public `kayfabizarro`: **83**
- blobs requiring transfer: **97**
- hard binary boundary: **20** required blobs
  - **19** local WOFF2 files referenced by the Arena document
  - **1** `assets/vfx/kfb-combat-atlas_4x3.png`

Two independent transfer paths were exhausted. The binaries remain safely present in the private Combat repository and Dropbox recovery mirror, but this chat environment cannot bridge their byte payload into the public Git blob writer. The full WSA/local recovery procedure and exact blob list are in `FAILURE_RECOVERY_STAGE_PACKAGING.md`.

A broken public mirror, replacement font set, VFX fallback, generic UI or second runtime owner was **not** introduced. Because there is no valid direct Cloudflare Combat Stage surface yet, the KFB Hub was not given a fake human-test link.

## Unresolved

- exact public Stage mirror and Hub pointer;
- Cloudflare revision proof;
- browser actor/attachment/mixer lifecycle;
- Skeleton visual lifecycle;
- desktop + narrow viewport proof;
- performance before/after;
- audio proof;
- Georg freeplay/visual gate.

## One next gate

On a binary-capable WSA/local checkout, mirror the exact Combat runtime to `kayfabizarro/kfb-hub/stage/combat/runtime/`, update the Hub Stage card, and verify `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/` before any further combat feature work.
