# KFB Productive Review + Human Gate Policy

Status: **CURRENT BINDING CROSS-PROJECT RULE v1.0**  
Date: 2026-09-27  
Owner: Georg / KFB  
Applies to: ChatGPT Web, Work/WSA, Claude Design, ToolBox, WorldBuilder, Travel, Racer, Combat and all KFB production slices.

## Why this exists

KFB production has repeatedly converted technical evidence into a separate user-facing approval ceremony: measurement tables, ownership matrices, source diagnostics, isolated contract pages or small button demos were published and then presented to Georg as a blocking human gate.

That is an anti-pattern when the artifact does not let Georg meaningfully judge the actual product.

The goal is **usable integrated capability per unit of human and agent time**, not maximum review surfaces.

## Prime rule

**Do not manufacture a human gate.**

Technical evidence belongs in CI, tests, screenshots, Returns and diagnostics.  
Human review is reserved for a decision Georg can actually make from the presented experience.

If Georg cannot tell what he is supposed to judge without reading implementation metadata, the artifact is not a valid human acceptance surface.

## Default production loop

Use this by default:

`brief → implement in the real owner/product surface → owner-native tests → integrate the next usable capability`

Add human review only when a real product decision blocks further work.

Prefer:
- WorldBuilder changes inside the actual editable/playable WorldBuilder;
- ToolBox changes inside the actual ToolBox/Animation workspace;
- Race changes in the actual driveable Racer;
- Travel changes in the actual WorldBuilder/Travel consumer experience;
- Resident changes in the actual Resident scene/performance;
- Combat changes in actual combat/freeplay.

Do not create a separate lab, table, selector or diagnostic page merely because a slice ended.

## What is NOT a human gate by default

These are machine/internal evidence unless Georg explicitly asks to inspect them:

- movement/camera owner tables;
- writer-count or state-transition dashboards;
- numerical measurement tables;
- source/provenance matrices;
- contract-only Ground/Flight/Drive/Water selectors;
- static test counters;
- isolated source-object views after source identity is already established;
- buttons that only prove a state machine can switch;
- Cloudflare publication success itself;
- CI/browser proof of invariants that can be asserted automatically.

They may still be retained as evidence. They must not block productive integration.

## What can justify a human gate

A human gate is appropriate when the next action depends on a subjective or irreversible product choice, for example:

- two materially different visual directions;
- animation feel, timing, weight or readability that automation cannot decide;
- a real playable/freeplay experience whose feel determines the next implementation;
- source/object choice when multiple valid donors exist and intent is ambiguous;
- destructive migration, merge/promotion or replacement of an accepted owner;
- a milestone that Georg explicitly asked to review.

Even then, present the **real integrated product state**, not a proxy, wherever practical.

## Proceed Pass

Georg may close an intermediate gate with a pragmatic **PROCEED PASS**.

A Proceed Pass means:
- the direction is good enough to continue;
- unresolved detail issues remain documented;
- it is not exhaustive feature-by-feature acceptance;
- the team must not reopen the same review before the next productive integration unless a new blocker appears.

Phrases such as “passt soweit”, “weiter”, “das ist okay”, “zügig weitergehen” or equivalent explicit continuation instructions should be treated as a Proceed Pass for the current bounded direction unless Georg says otherwise.

## Stage policy

Cloudflare Stage is a durable milestone/public review surface, not a mandatory end-of-slice ceremony.

Do not publish a diagnostic solely to obtain a human ACCEPT/REJECT.

Use Stage when:
- a meaningful integrated milestone benefits from durable/shared review;
- cross-device/public verification is itself required;
- Georg explicitly asks for a test link.

Diagnostics may remain repository/internal evidence without a Stage card.

## Fidelity rule · no low-fidelity proxy gates

A human review surface is invalid when the proxy is materially worse or less informative than the real receiving product.

Do **not** ask Georg to infer product quality from an isolated review page when any of these are true:
- simplified geometry, grey-box materials, generic lighting or a substitute camera hide the actual product context;
- the proxy reproduces already-known renderer defects such as shadow clipping, shadow banding, light seams or related presentation bugs;
- low frame rate, slow controls or poor interaction make visual/feel judgment unreliable;
- the real WorldBuilder, ToolBox, Racer, Travel, Resident or Combat surface already exists and can carry the change;
- the mechanism is reversible and can safely proceed to integrated evaluation without a separate approval ceremony.

In those cases the isolated artifact may remain **internal engineering evidence**, but it must not become a blocking Georg task.

A human gate must be representative enough that Georg can judge the actual consequential question directly. If the review requires him to mentally extrapolate from a grey proxy, tolerate known rendering bugs, or imagine how it would behave in the real product, use the real product instead.

## LOOK-TORSION-01 application · 2026-09-27

`LOOK-TORSION-01` receives **ARCHITECTURE PASS ONLY**.

Retain:
- cumulative height-dependent geometric torsion;
- anchored base;
- shared roof/body final deformation field;
- role/height-dependent magnitude family.

Do **not** interpret the isolated grey A/B/C page as WorldBuilder visual acceptance, lighting/shadow acceptance or a final torsion calibration. Known shadow/light defects remain open.

Do not create another standalone torsion review page. Carry the proven mechanism into the next clean/current WorldBuilder or world-presentation candidate and judge it there with the real scene, camera and shared shadow/lighting fixes.

This application is a concrete example of the policy: **the mechanism can pass while the proxy review workflow is rejected.**

## WSA / architecture rule

WSA plans and slides must optimize for **flow to usable products**, not a queue of human gates.

In WSA architecture/workflow slides:
- show owner surfaces and integration flow;
- collapse technical QA into automated/internal evidence;
- show only genuinely decision-relevant human review points;
- identify which gates can be removed, combined or converted to machine checks;
- treat standalone review artifacts as exceptions, not the default production unit;
- measure progress by integrated capabilities, not number of proofs, labs, PRs or review pages.

WSA should actively flag a plan as an anti-pattern if it creates a new human gate without a specific human decision.

## Travel decision · 2026-09-27

`TRAVEL-MODES-01` receives a **PROCEED PASS**.

The one-active-writer router and accepted 400 ms Ground→Flight input are sufficient to continue. The contract-only Stage page remains evidence/history, not a blocking acceptance surface.

Do not ask Georg to approve the router table again.

Next Travel/WorldBuilder work should prove mobility in the real WorldBuilder/product experience using source-proven adapters. Drive/Water still require real sources; do not fake them.

## Budget stop

Before creating a review artifact, ask:

1. What exact human decision will this enable?
2. Can the same fact be checked automatically?
3. Can the implementation continue safely without Georg?
4. Is the real owner/product surface already available for the review?

If #1 has no clear answer, do not create a human gate.


## Visible foundation rule · 2026-10-04

A technically integrated scene is not a valid product foundation merely because it boots and uses the correct owner.

Before calling an integrated world/current scene product-ready:
- inspect the actual visible source families;
- distinguish mechanism reuse from visible content reuse;
- reject technical fixtures that leak into the visible product;
- treat a Georg screenshot showing the wrong visual donor as `HUMAN_VISUAL_FAIL` even when browser/runtime tests are green.

This specifically prevents a proven OSM/Hürth building mechanism from becoming the visible KFB Town/world by accident.

The correct response is not a new proxy page.
Fix the real integrated product or preserve the candidate and perform one integrated recovery pass.

