# KFB Gate Proportionality + Token Budget Protocol

Status: **CURRENT BINDING CROSS-PROJECT RULE v1.0**  
Date: 2026-09-22  
Owner: Georg / KFB  
Applies to: ChatGPT Web, Work/WSA, Claude Design, ToolBox, Game Dev Studio and all KFB production slices.

## Why this exists

KFB has repeatedly lost large amounts of chat/work budget to detail work that was incorrectly promoted to a blocking gate.

Two explicit failure classes triggered this rule:

1. long repeated repair work caused by measuring / interpreting the wrong axis when a short human clarification would have resolved the ambiguity;
2. a Combat MVP path blocked by one problematic actor even though that actor was not required to prove the core playable loop.

These are process failures, not merely implementation bugs.

## Prime rule

**Gate severity must be proportional to product impact.**

A detail may block a slice only when failure of that detail prevents the named outcome from being meaningfully tested or accepted.

Do not promote a local defect into a project blocker merely because it is measurable.

## Classify every discovered issue before repairing it

Every new issue must be placed in exactly one class:

### CORE_BLOCKER

The named outcome cannot work without it.

Examples:
- player cannot move in a movement MVP;
- no projectile release in a ranged Combat MVP;
- world does not boot;
- save/reload loses the authored world when persistence is the gate.

Action:
repair or stop the slice.

### ACCEPTANCE_BLOCKER

The system runs, but the exact human gate cannot be honestly evaluated.

Examples:
- requested source object is visibly wrong;
- camera hides the object being reviewed;
- required comparison cannot be seen.

Action:
repair only enough to restore the named gate.

### MINOR / QUARANTINABLE

One asset, actor, animation, decoration or optional subsystem is wrong, but the core outcome can be tested without it.

Examples:
- one enemy model has a bad transform while another proven enemy can carry the combat loop;
- one prop attachment is wrong in an otherwise usable scene;
- one optional sky/environment preset is broken.

Action:
**quarantine / disable / defer it. Do not block the MVP.**

### COSMETIC / DEFERRED

Does not affect the current functional or human acceptance gate.

Action:
record and continue.

## Human clarification beats speculative iteration

If a user can resolve an ambiguity cheaply, ask before spending multiple turns measuring or repairing.

Mandatory clarification trigger:

- axis/orientation ambiguity;
- which visual donor/object is intended;
- which of several plausible source parts is correct;
- whether a defect is actually important to the current product goal;
- whether an optional actor/asset may be skipped for the MVP.

Do not spend multiple repair passes answering a question Georg can resolve in one sentence or screenshot.

## One-pass diagnosis budget

Before entering repair work:

1. name the exact gate;
2. classify the issue;
3. state why it blocks that gate;
4. identify the smallest diagnostic that can falsify the current hypothesis.

For MINOR / QUARANTINABLE issues:
- maximum one diagnostic pass;
- then quarantine/defer unless Georg explicitly promotes it.

For CORE_BLOCKER / ACCEPTANCE_BLOCKER:
- one focused diagnosis;
- one bounded repair pass;
- second repair pass only if the first produced measurable progress and the root cause remains credible.

No open-ended “keep tuning until it works.”

## MVP rule

**An MVP proves the core loop with the smallest valid asset set.**

It does not prove that every actor, weapon, prop, animation, biome or environment preset already works.

When one optional asset fails:
- use the smallest already-proven substitute from the same intended class when that does not invalidate the gate;
- otherwise disable that asset and continue;
- record the defect separately.

Example:
A ranged Combat MVP may use one proven enemy to prove:
`aim → release → hit → kill → reward → run clear`.

A broken second enemy must not block that gate.

## No-detail-hostage rule

A slice must never become hostage to:
- one actor;
- one attachment;
- one animation;
- one axis;
- one shader preset;
- one decorative asset;
- one optional environment element;
unless that exact item is the named human acceptance target.

## Escalation check before spending more budget

Before a second turn/pass on the same defect, answer:

1. Is this still required for the named outcome?
2. Can it be bypassed without falsifying the result?
3. Can Georg answer the uncertainty faster than another diagnostic pass?
4. Is the next pass testing a new root-cause hypothesis, or just another parameter variation?
5. What is the explicit stop condition?

If #1 is no → defer.  
If #2 is yes → quarantine and continue.  
If #3 is yes → ask Georg.  
If #4 is “parameter variation” → stop.  
If #5 is missing → do not start the pass.

## Work / WSA budget discipline

Use Work for:
- cross-repo integration;
- real browser / cloud-computer proof;
- packaging and deployment;
- selected hard runtime seams.

Do not use Work for:
- prolonged asset diagnosis;
- repeated axis tuning;
- visual trial-and-error;
- source census;
- optional actor repair;
- questions a small Web slice or Georg can resolve.

If Work discovers a non-core defect:
1. classify;
2. preserve evidence;
3. remove it from the critical path;
4. hand it to a cheaper bounded slice if still useful.

## Claude Design discipline

Claude Design must not spend its long-session context repeatedly repairing one source ambiguity.

After one failed placement/composition pass:
- show the real source object in isolation;
- verify axis/pivot/support;
- ask Georg if intent is ambiguous.

After two failed repair passes:
- stop and export failure recovery.

## Gate wording requirement

Every slice must state:

- **Core outcome**
- **Critical blockers**
- **Quarantinable issues**
- **Human questions**
- **Budget stop**

If this classification is absent, the slice is not ready to consume significant Work/Claude budget.

## Global examples

### Wrong axis
Bad:
measure/tune for many turns because an assumed axis appears wrong.

Correct:
after first contradictory result, inspect source axes and ask Georg which orientation is intended when ambiguity remains.

### Combat actor
Bad:
block the entire ranged MVP because Skeleton Mage is broken.

Correct:
mark Mage `HOLD`, use one proven enemy, and test the full ranged loop. Repair Mage later.

### Shader
Bad:
block a World Authoring proof because one optional water shader is visually weak.

Correct:
keep water-look as a separate human gate and continue proving world persistence/topology with a neutral water representation if the shader itself is not the named gate.

## Stop rule

A technically interesting defect is not automatically worth solving now.

The question is always:

> **Does this defect prevent the user from evaluating or using the thing we are trying to prove in this slice?**

If not, do not let it consume the slice.
