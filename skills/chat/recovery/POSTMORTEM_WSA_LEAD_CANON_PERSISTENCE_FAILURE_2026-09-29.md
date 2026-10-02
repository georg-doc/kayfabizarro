# Postmortem · WSA Lead Canon Persistence Failure · 2026-09-29

**Status:** `WSA LEAD FAIL · ARCHIVED INCIDENT + CURRENT LESSONS LEARNED`  
**Scope:** persistence, canon promotion and fresh-chat recoverability after accepted KFB visual/runtime findings  
**Audience:** WSA / Work Lead, ChatGPT Web Lead, Claude Design handoff authors, future fresh chats  
**Runtime impact:** no runtime is changed by this postmortem

## 1 · Incident in one sentence

The WSA Lead allowed technically proven and partly Georg-accepted shadow/contact and clay-façade solutions to remain scattered across session-cut / Inbox files and a branch-local brief instead of promoting them into stable routed canon, so later Claude Design / fresh-chat work could search GitHub correctly and still conclude that the solution/specification was missing.

This is a **Lead persistence / routing failure**, not primarily a downstream design failure.

## 2 · User-observed failure

Georg reported on 2026-09-29 that Claude Design again behaved as if two already solved/accepted areas were not persisted:

- the recurring shadow/clipping/contact defect where bright areas appear where the object should be in shadow, especially at props, wall feet, roofs/overhangs and other contact seams;
- the clay / Knetgummi building-façade deformation direction from the H0 / Knetwelt and WorldBuilder line.

The important fact is not that GitHub contained zero evidence. It contained substantial evidence.

The failure was that the evidence was not promoted and routed strongly enough for a cold consumer to recover it deterministically.

## 3 · What GitHub actually contained

### 3.1 · Shadow/contact solution existed

The full actor/prop recipe existed at:

`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r2/docs/LESSONS_SHADOWS.md`

It already contained:
- fitted shadow frustum;
- light-space texel snapping;
- texel-relative `normalBias`;
- small ordinary `bias`;
- thin-overlay caster exclusion;
- explicit warning not to blanket-exclude `DoubleSide`;
- `PCFSoftShadowMap` direction;
- visual regression checks.

WB-D2 independently contained the world/building-scale contact correction:

`tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/CHANGELOG.md` v0.10.

World Integration r2 further preserved:
- the replacement of literal `normalBias = 0.9` by the texel-relative `shadowFollow` direction;
- global façade behavior;
- `FACE_NORMALS`;
- host/support behavior.

### 3.2 · Façade / deformation specification existed

The complete prepared S5 Building / Façade Clay Adapter existed at:

- branch: `georg-doc-patch-2`;
- checked head: `3232a1070686896833d6b7942fcd631b9fa8cda6`;
- `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27/START_HERE.md`;
- `BRIEF_CLAUDE_DESIGN_BUILDING_FACADE_CLAY_ADAPTER_S5.md`.

It already required:
- real OSM + KayKit + Kenney building sources;
- unchanged source objects shown in isolation before adaptation;
- H0 / Elastic reuse before rebuild;
- preserved OSM footprint/height/identity;
- preserved kit anchors/connectors;
- no Track-Core takeover;
- no second city generator;
- no generic replacement buildings.

### 3.3 · Accepted/newer clay baseline existed

The K2 handover from 2026-09-28 is explicitly `ACCEPTED AS BASE` and establishes for new stages:
- `clay-material.v10`;
- `clay-relief.v4`;
- `clay-toolmix.v1`;
- shared profiles where applicable.

It also explicitly keeps accepted H0 on its frozen v8 line.

### 3.4 · LOOK-TORSION result existed

Current policy already records Georg's `ARCHITECTURE PASS ONLY`:
- cumulative height-dependent geometric torsion;
- anchored base;
- shared roof/body final deformation field;
- role/height-dependent magnitude family.

It explicitly does **not** accept the isolated proxy's lighting/shadows/material calibration or one universal final angle.

## 4 · The concrete persistence failures

### FAIL A · A stable path was referenced but did not exist

Several project files referred to a stable ToolBox location:

`tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`

Before recovery PR #290, that file was **NOT_FOUND on main**.

The recipe existed only in session-cut directories.

That means the project simultaneously communicated:
- “this is the shared lesson”;
- while failing to place it at the shared path consumers were told to read.

This is a direct Lead closure failure.

### FAIL B · Accepted implementation knowledge stayed inside `_inbox`

Inbox/session exports are valid evidence and recovery inputs, but they are deliberately not the durable SSOT merely because they exist.

The shadow recipe, WB-D2 contact fix and relevant façade evidence remained discoverable only by knowing:
- the exact session name;
- the exact nested path;
- or the historical conversation that produced it.

A fresh chat should not need that.

**Rule violated:** crash-safe continuation must allow recovery from GitHub alone without transcript reconstruction.

### FAIL C · A current prepared brief remained branch-local without main routing

S5 is complete on `georg-doc-patch-2` but absent on `main`.

A main-only GitHub search therefore legitimately returns no S5 file.

The problem is not that branches are forbidden. The problem is that the Lead did not leave a stable main-router pointer saying:

> current façade adapter source = branch X @ exact pin Y.

Branch-local current truth without a main routing pointer is operationally close to missing truth for cold consumers.

### FAIL D · Version precedence was not maintained

S5 was written on 27.09 and still names an older H0 material path.

K2 was accepted on 28.09 and makes `clay-material.v10` the new-stage baseline.

No stable precedence entry connected those two facts.

Thus a literal consumer could:
1. correctly find S5;
2. correctly follow its donor list;
3. correctly regress to an older material path.

This is not downstream disobedience. It is incomplete canon maintenance.

### FAIL E · Open issue wording regressed “known solution” into “investigate from scratch”

Issue #247 correctly recorded the global shadow/contact defect, but its original wording said to investigate bias, normalBias, near/far, contact seams and clipping without saying clearly that:
- the core recipe had already been proven;
- WB-D2 had already measured the large-bias failure;
- World r2 had already recorded the `0.9` regression;
- the remaining work was integration/regression proof.

This turned a known-solution integration task back into a research task.

### FAIL F · Acceptance did not trigger canon-promotion closure

Positive/accepted results existed:
- Georg's positive WB-D2 shadow/look feedback;
- World-r2 Proceed/Tune continuation;
- K2 `ACCEPTED AS BASE`;
- LOOK-TORSION architecture acceptance.

But acceptance closure did not include a mandatory question:

> What durable stable path will the next unrelated chat read to inherit this accepted result?

The Lead closed technical/design gates without closing knowledge persistence.

## 5 · Root cause

The WSA Lead treated **persistence as “the files exist somewhere on GitHub”** instead of **“the current consumer can deterministically recover the accepted rule from the standard router.”**

That distinction is the core incident.

The project had strong rules for:
- branch/head verification;
- Return/Recovery;
- evidence status;
- owner boundaries;
- stop-after-two-repairs;
- public Stage truth.

But canon promotion after acceptance was not enforced with the same rigor.

The result was a form of **semantic data loss without byte loss**:
- the bytes survived;
- the operational knowledge did not survive cleanly.

## 6 · Why this was especially expensive

This failure causes repeated cost in multiple downstream chats:

1. a new agent searches main;
2. stable docs are missing;
3. it treats the problem as open/source-required;
4. it re-investigates or creates a local variant;
5. the old rendering defect returns;
6. Georg has to explain that the problem was already solved/accepted;
7. another recovery/audit pass is spent reconstructing history.

This is precisely the class of failure that GitHub-first crash-safe continuation is supposed to prevent.

## 7 · What is **not** the lesson

Do **not** conclude:
- “copy every session file into canon”;
- “merge every branch immediately”;
- “one global renderer must own every scene”;
- “freeze all clay modules onto one version”;
- “never use `_inbox`”;
- “Claude Design should search harder.”

Those would create new problems.

The correct lesson is about **routing and precedence**, not duplication.

## 8 · New hard rule · Acceptance-to-canon closure

Whenever Georg accepts, proceeds with, or explicitly retains a reusable technical/design rule, the Lead must close the gate with all of these:

1. **Stable home**  
   Name the durable owner path for the reusable rule.

2. **Current source pin**  
   If the actual source remains on another branch/PR, route to its exact branch + head.

3. **Precedence**  
   State whether later accepted work supersedes any version-specific part.

4. **Consumer scope**  
   State which consumers must inherit the rule and which owners remain local.

5. **Fresh-chat proof**  
   From the standard `START_HERE`, verify that a cold search can find the rule without knowing the old session name.

Acceptance without those five items is **not persistence-complete**.

## 9 · New hard rule · Session cuts are evidence, not the final front door

A reusable rule may originate in a session cut.

It may remain there as historical evidence.

But once the rule becomes cross-session reusable, the Lead must:
- promote the rule itself to a stable owner doc; or
- create a stable router pointing to the pinned source.

Do not require future consumers to search nested timestamped exports.

## 10 · New hard rule · Branch-local current truth needs a main pointer

A current brief/owner may legitimately remain unmerged.

In that case main must contain a routing statement with:
- repo;
- branch;
- exact head;
- path;
- status;
- precedence.

A branch without a main pointer is not sufficiently discoverable for a multi-chat production system.

## 11 · New hard rule · Version advances require dependency review

When an accepted shared module advances materially — for example H0/v8 → K2/v10 for new stages — the Lead must search current routed briefs for stale version pins.

The outcome can be:
- update;
- explicit legacy freeze;
- compatibility note;
- or superseding router.

Silently leaving the old version in a current brief is FAIL.

## 12 · New hard rule · Known-solution issues must say “integrate”, not “rediscover”

If a bug has a proven recipe, the issue must distinguish:

- **KNOWN RECIPE**
- **UNRESOLVED INTEGRATION**
- **UNRESOLVED REGRESSION**
- **UNKNOWN CAUSE**

Do not phrase all four as “investigate”.

For #247 the correct current state is:
- known recipe;
- unresolved shared-owner consumption;
- unresolved integrated regression proof.

## 13 · Fresh-chat acceptance test

For reusable cross-chat knowledge, add a cheap documentation test:

> Starting from `skills/chat/START_HERE.md` and searching only current routed sources, can a fresh agent answer:
> 1. what is the current rule?
> 2. where is its source?
> 3. what version wins?
> 4. what is still open?
> 5. what must not be rebuilt?

If any answer requires the old transcript, the handoff is not complete.

## 14 · Recovery performed

Recovery slice:
`SHARED-SHADOW-CLAY-CANON-01`

Draft PR:
`#290 · SHARED-SHADOW-CLAY-CANON-01 · canonical routing repair`

The repair:
- creates the missing stable shared shadow/contact doc;
- creates a stable clay-building/façade router;
- pins S5's branch-local source;
- records the K2 v10 precedence correction;
- retains H0's frozen accepted version;
- preserves LOOK-TORSION's architecture-only status;
- distinguishes R0A visual-donor status from runtime ownership;
- updates issue #247 from source-research wording to known-recipe integration wording;
- proves source resolution with the slice test report.

No runtime was changed.

## 15 · Classification

**Primary failure owner:** WSA Lead / coordination layer.  
**Failure class:** persistence + routing + precedence.  
**Not primarily:** Claude Design implementation quality.  
**Severity:** LARGE process failure because it reopens solved work across multiple consumers and forces Georg to repeat prior decisions.  
**Runtime status:** unchanged by the postmortem.

## 15A · 2026-09-29 second confirmation · exact K1/H0 visual source was not routed

Later the same day Georg had to re-supply the complete K1 + H0 Claymation codebase because Claude Design reported it had no usable façade/style references.

New source arrival:
`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/`
at `main@440709df3f1cbc9651a97c446e4321caef7e8a38`.

This strengthens the original diagnosis:

- the missing knowledge was not merely a few numeric settings;
- the exact K1/H0 house preprocessing path, source screenshots, `clay-soften.v1`, façade identity and tree construction grammar were not available through the standard routed front door;
- downstream Design could therefore load a later clay/world candidate and still legally reconstruct the wrong style;
- the R0A candidate itself proved the danger: it bent raw building donor geometry and added clay surface treatment, while the recovered K1/H0 source requires per-house clay softening/preprocessing before later bend;
- its overlapping tree crowns also exposed a source-specific foliage shadow topology that a generic global shadow fix could not solve.

Recovery now routes the exact package through:
- `tools/KFB-ToolBox/docs/CLAYMATION_K1_H0_REFERENCE.md`;
- `skills/chat/START_HERE.md`;
- `skills/chat/adapters/claude-design.md`;
- `skills/chat/REGISTRY.json`.

**Additional lesson:** a stable high-level “clay style” brief is insufficient when the accepted look depends on executable source grammar. The front door must point to the actual code + screenshots, not just prose describing the look.

## 16 · Reißleine

Before closing any accepted reusable KFB result, ask:

> **Kann ein frischer Chat die abgenommene Regel von START_HERE aus finden — inklusive Pin, Vorrang und offenem Rest — ohne den alten Chat zu kennen?**

If not, the WSA Lead gate is still open.
