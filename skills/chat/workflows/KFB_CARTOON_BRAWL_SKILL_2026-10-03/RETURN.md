# KFB Cartoon Brawl Skill · Return

Status: **CONSUMER_PROVEN_DRAFT · FIRST CONSUMER PASS**
Date: 2026-10-03
Workflow: `KFB-CARTOON-BRAWL-SKILL-01`

## Repository / branch / PR

- repository: `georg-doc/kayfabizarro`
- owner: KFB shared skill layer
- branch: `chatgpt-web/kfb-cartoon-brawl-skill-01-2026-10-03`
- Draft PR: **#342**
- validated evidence head: `38e3bed2ef1e60985af3c332cd4362aac9f3fb97`
- verified Recovery checkpoint head: `27e71cd87b10b5523c98ce451728401db102ad2f`
- authoritative closure head: current PR #342 head, pinned again in the final KFB Production Control RETURN after this file is committed
- no merge / no Live promotion

## Outcome

Created a reusable provider-neutral **KFB Cartoon Brawl v1** skill for 3D melee combat and cartoon fight choreography.

The skill covers:

- unarmed, 1H blade, 1H blunt, shield+1H, 2H, polearm/staff and improvised/Brickfish profiles;
- canonical weapon basis / grip;
- 2H off-hand IK;
- full-clip owner self-clearance;
- startup / tracking / active / follow-through / recovery;
- swept contact + per-swing target ledger;
- push/hurt/attack/owner-clearance separation;
- semantic input + buffering / branch / cancel windows;
- in-place / controller / root-motion / bounded-warp ownership;
- normal unsynced hits vs paired takedowns/grapples;
- crowd ticket/role scheduling;
- target reactions, hitstop, VFX/SFX/camera sync;
- Mixamo/KayKit/mocap/library intake audit;
- fixed debug fixtures and LLM execution contract.

## Research

Persisted:

- `RESEARCH_SOURCE_MATRIX.md`
- `RESEARCH_BLOCK_B_WEAPON_TRANSITIONS.md`

Measured:

- **40 unique HTTPS research sources**
- **42 source/evidence rows**
- **17** weapon/transition research sections

The source spine includes official Unreal/Unity/Godot/Blender/Mixamo documentation plus first-party/GDC/practitioner material from Naughty Dog, Sloclap/Sifu, Santa Monica/God of War, Sucker Punch and professional game animators.

## Existing KFB donors reused

No second melee architecture was invented where KFB already had useful facts.

Combat Arena CA2 donor patterns retained:

- real authored 1H attack;
- authored right-hand slot;
- swept contact;
- active-window helper;
- `AttackLedger`;
- non-overlap spacing diagnostic;
- forced-contact diagnostic.

General animation grammar remains:

- `skills/kfb-cartoon-animation_v2.md`

Combat Arena remains its own implementation SSOT.

## Actual tests / evidence

`TEST_EVIDENCE.md`:

- final structured documentation/routing gate: **75 / 75 PASS**
- failed: **0**
- skill size measured: **36,150 chars**
- base animation skill measured: **27,290 chars**

A preliminary smaller harness returned 52/53 only because one literal owner-boundary string differed from the existing wording; the final gate asserts the real owner text plus the new consumer route.

## Browser / screenshot proof

**N/A for this slice.**

The changed product is a shared skill/documentation contract. No visual runtime was implemented, so a screenshot/browser gate would be a low-fidelity proxy rather than product evidence.

## Stage / KFB Hub

- direct Stage URL: **NONE**
- Stage status: **NOT CREATED · NOT REQUIRED**
- KFB Hub action card: **NONE REQUIRED**
- reason: no Georg-facing product decision or playable milestone exists in this documentation slice
- HUB-CTRL / Production Desk remains the generated Hub owner and was not hand-edited

The central router on this candidate branch explicitly records that policy so a future chat does not manufacture a Stage.

## Changed files

Expected final PR file set:

1. `skills/kfb-cartoon-brawl_v1.md`
2. `skills/chat/REGISTRY.json`
3. `skills/chat/START_HERE.md`
4. `skills/chat/CHANGELOG.md`
5. `skills/chat/consumers/combat-web-chat.md`
6. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/START_HERE.md`
7. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md`
8. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RESEARCH_BLOCK_B_WEAPON_TRANSITIONS.md`
9. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/TEST_EVIDENCE.md`
10. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RECOVERY.md`
11. `skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RETURN.md`

The PR changed-file list is re-read after this Return commit before closure is claimed.

## Main / publication state

The router/registry changes are present in Draft PR #342 only.

`main` is **not** claimed updated until that PR is deliberately integrated. No auto-merge is authorized.

## Unresolved / deliberately deferred

- no real Combat consumer has yet executed the skill end-to-end;
- no universal per-actor/per-weapon self-clearance claim;
- no promotion of the existing CA2 Sword candidate;
- no universal Brickfish-only decision;
- no new Combat consequence wiring;
- no public/browser gameplay proof.

## Exactly one next gate

**BRAWL-SKILL-CONSUMER-01**

Use one real Combat Arena melee consumer to validate the skill itself:

1. exact source object / basis;
2. neutral grip;
3. full-clip self-clearance;
4. active/swept hit + explicit miss;
5. per-swing dedupe;
6. one confirmed reaction + impact;
7. clean recovery.

Only after that consumer proof should the skill move from `canonical-draft` toward a stronger accepted/canonical status or expand broadly across weapon families.


## Consumer proof addendum · 2026-10-03

The first real consumer is now complete.

Combat source:

- repo: `georg-doc/KFB-Combat-Arena`
- Draft PR: **#12**
- branch: `chatgpt-web/brawl-skill-consumer-01-sword-2026-10-03`
- closure head: `fb40fac9d108b4719d06d47af394731edd233620`
- final CI: `37130587598 / 111224735535` · **106/106 PASS** · build 236 · re-home 172/66/routes PASS
- browser runtime head: `7ce3c45a1122fb8b4b31daed18259b282e02dadc`
- browser run/job: `37129956150 / 111222921868` · PASS
- artifact: `11276313336`
- no production Sword promotion.

The consumer established that the Sword source is the primary KayKit Rig_Medium CombatMelee pool, not Mixamo, and classified the five native 1H attacks.

Exactly one next productive gate:

**BRAWL-CLUB-BRICKFISH-01**
