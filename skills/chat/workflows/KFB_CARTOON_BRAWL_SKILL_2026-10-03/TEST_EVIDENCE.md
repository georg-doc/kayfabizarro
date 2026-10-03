# KFB Cartoon Brawl Skill · Test / Evidence

Status: PASS
Date: 2026-10-03
Workflow: KFB-CARTOON-BRAWL-SKILL-01
Branch: `chatgpt-web/kfb-cartoon-brawl-skill-01-2026-10-03`

## Final structured gate

**75 / 75 PASS · 0 FAIL**

The gate was executed against the exact branch files, not against chat copies.

Measured inputs:

- `skills/kfb-cartoon-brawl_v1.md`: **36,150 chars**
- base motion canon `skills/kfb-cartoon-animation_v2.md`: **27,290 chars**
- research source matrix: **42 evidence rows**
- unique HTTPS research sources captured in the matrix: **40**
- Research Block B: **17 sections**

## Gate groups

### Skill identity / dependency

PASS:

- frontmatter name/version/status/owner;
- `canonical-draft` preserved;
- base `kfb-cartoon-animation_v2.md` dependency;
- both research documents linked.

### Required melee architecture

PASS:

- Attack contract / lifecycle;
- ownership boundary;
- `MeleeAttackSpec`;
- `WeaponProfile`;
- `AttackInstance` / per-swing target ledger;
- timeline-vs-confirmed-contact separation;
- swept-contact rule;
- root-motion / bounded motion-warp ownership;
- input buffer / branch / cancel grammar;
- transition quality rules.

### Weapon coverage

PASS:

- unarmed;
- 1H blade;
- 1H blunt;
- shield + 1H;
- 2H;
- polearm/staff;
- improvised / Brickfish class.

### Choreography / reaction / presentation

PASS:

- ordinary unsynced vs paired choreography;
- crowd ticket/role scheduler;
- fight choreography grammar;
- cartoon impact;
- VFX sync;
- SFX sync;
- camera;
- environmental interaction.

### Debug / proof contract

PASS:

- attachment fixture;
- self-clearance fixture;
- spacing fixture;
- forced-contact fixture;
- miss fixture;
- combo fixture;
- crowd fixture;
- paired fixture;
- motion-library candidate scorecard;
- failure taxonomy;
- LLM execution contract;
- final quality gate.

### Routing / ownership

PASS:

- registry entry exists at `skills/kfb-cartoon-brawl_v1.md`;
- registry state is `CURRENT_REFERENCE / canonical-draft`;
- registry retains `kfb-cartoon-animation` dependency;
- Combat Arena registered as consumer;
- central router contains the 2026-10-03 Brawl route;
- router records **no public Stage / no Hub action card** for this documentation milestone;
- Combat consumer loads the new skill for melee work;
- Combat consumer still states: `Combat remains its own implementation SSOT`;
- slice brief protects Combat runtime from modification.

## Pre-final harness result

Before the Combat-consumer route was updated, a smaller structural pass returned **52 / 53**. The only failing check looked for one literal owner-boundary phrase that did not match the already-existing wording in `combat-web-chat.md`; it did not identify a skill/runtime defect.

The final gate asserts the actual owner text plus the new Brawl routing and passes **75 / 75**.

## What this proves

This proves the documentation/contract candidate is internally routed and structurally complete enough for a real consumer trial.

It does **not** prove:

- a new Combat runtime;
- visual weapon clearance on every KFB actor;
- any particular Mixamo/KayKit clip;
- a public deployment;
- human gameplay acceptance.

Those require a receiving-project slice.

## Stage / browser evidence

**NOT APPLICABLE for this milestone.**

No standalone Stage was created because the slice produces a shared implementation skill, not a Georg-facing playable product decision. Creating a proxy review page would contradict the current Productive Review policy.

## Exactly one next gate

**BRAWL-SKILL-CONSUMER-01**

Apply `skills/kfb-cartoon-brawl_v1.md` to one real Combat Arena melee consumer and record whether the skill is sufficient to prove:

1. source object / weapon basis;
2. neutral grip;
3. full-clip self-clearance;
4. active/swept contact and miss;
5. per-swing dedupe;
6. one confirmed reaction + impact;
7. recovery.

Prefer the already-preserved CA2 Sword lane when its current Combat gate permits it; a Brickfish-only implementation is a valid alternative only when deliberately chosen as the bounded consumer.
