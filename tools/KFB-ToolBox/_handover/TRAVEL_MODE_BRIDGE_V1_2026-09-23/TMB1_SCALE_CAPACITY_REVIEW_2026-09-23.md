# KFB Travel Mode Bridge v1 · TMB-1E Scale / Capacity Review · 2026-09-23

**Status:** PREPARED REVIEW SLICE · NO RUNTIME IMPLEMENTATION YET  
**Owner:** `georg-doc/KFB-Travel-Globe`  
**Coordination / Review owner:** `georg-doc/kayfabizarro`  
**Base Travel candidate:** Draft PR #36 · `chatgpt-web/travel-mode-bridge-tmb1-surf-2026-09-23@88382c111acf32f6b934c15ce7b6b1f6d4d15283`  
**Base Stage candidate:** Draft PR #184 · `chatgpt-web/travel-tmb1-surf-stage-2026-09-23@017906a2f201fcf4ee21deceec4fba1e632e4a6e`

## Why this slice exists

Georg accepted the current CardCarrier direction and its ground/contact behavior as basically correct.

Current human feedback:

- the animated KFB card is good and should remain unchanged for this comparison;
- card thickness may read slightly heavy, but **do not change it in this slice**;
- the current ActionFigure rider reads too small relative to the card;
- test the rider at roughly `1.8×–2.0×` the current rider size;
- keep / refine a clear Surf / Ride pose rather than returning to a neutral standing pose;
- a later Studio v17 Surf pose may be a stronger pose donor, but Studio v17 is **reference only here** unless an exact source is verified;
- compare flight-mobile capacity with the three already source-backed Orc figures on one card:
  - Legacy Warband Orc A on one side;
  - Orc Brute / Rig_Large in the center;
  - Legacy Warband Orc B on the other side;
- the earlier “Large Rick” wording is resolved as **Large Rig**, not as a separate fourth/XL character source;
- the goal is to judge **character ↔ card proportion and plausible passenger capacity**, not to build party-flight gameplay.

This is still TMB-1 visual/product calibration. It does not authorize TMB-2 Ground↔Flight transition work.

---

# Five-line slice contract

**Goal:** produce two isolated browser review comparisons that make rider scale and card passenger capacity visually decidable.  
**Owner:** existing Travel / CardCarrier owner only.  
**Source:** exact TMB-1D Surf candidate + pinned real character donors.  
**Protected boundary:** do not change CardCarrier geometry/thickness, flight movement, camera owner, Ground owner, transition logic or card physics.  
**Done when:** Georg can compare the candidate sizes in zero-install HTML / Stage views and choose one scale direction without reading diagnostics.

---

# Review A · Surf rider scale study

## Keep fixed

- exact animated Travel CardCarrier;
- exact card artwork;
- existing seat/contact logic;
- existing verified Surf pose donor unless a stronger exact Studio v17 pose source is explicitly verified;
- same camera / lighting / review harness between variants.

## Change only

The **rider presentation scale**.

Start with three clearly separated variants:

1. **CURRENT** · current verified rider scale;
2. **LARGE** · approximately `1.8×` current rider presentation;
3. **XL** · approximately `2.0×` current rider presentation.

These are visual comparison variants, not automatic production values.

Do not silently compensate by enlarging the card.

## Acceptance question

**Which rider/card proportion reads like the intended flying-card vehicle?**

The review must make this answerable by sight.

---

# Review B · three-character capacity study

Use one exact animated CardCarrier and the three already verified Orc-family sources at their current source proportions.

Target arrangement:

`Legacy Orc A · Orc Brute / Rig_Large · Legacy Orc B`

Placement:

- Brute / largest central anchor in the middle;
- the other two left and right;
- all three visibly planted on the card;
- no hidden overlap that makes the composition falsely look roomy;
- no beauty-pose tuning that changes class scale.

This is a **capacity / relation proof**, not a party animation.

## Source-object-first rule

Before integrating the three together, each source used in this comparison must already be identified by:

- repository/ref;
- asset path;
- blob SHA;
- rig / class if applicable;
- source-object screenshot or previously accepted source proof.

A loaded URL alone is not donor proof.

“Large Rick” is treated as the speech-to-text form of **Large Rig** here. The center actor is therefore the already measured Orc Brute / `Rig_Large`; no substitute XL actor is introduced.

## Acceptance question

**Does the current CardCarrier read as a plausible flying mobile for these three scale classes, or does the vehicle need a larger flight-card class?**

---

# Review surface · HTML first

Default human loop follows:

- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/LOCAL_PREVIEW_FIRST.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/PORTABLE_PREVIEW_PACK.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`

Preferred first review deliverables:

- `TMB1E_SURF_SCALE_REVIEW.html`
- `TMB1E_THREE_RIDER_CAPACITY_REVIEW.html`

They should be zero-install and reuse the verified 3D review template pool rather than inventing new review chrome.

Only move to the fixed `kayfabizarro.pages.dev` Stage route when a comparison is worth shared/public acceptance.

---

# Helpful skill stack · do not load blindly

For browser-3D review construction:

- `skills/design-3d_v1.md` — scene / GLB / camera / lights / WebGL / export discipline;
- `skills/design-3d_3d-reference_v1.md` — load only when deeper GLB, scale, framing or failure diagnosis is needed.

For visual proof discipline:

- `skills/session-design-briefing.md` — especially “Ansehen → Messen → Verstehen → Bauen” and the seven proof conditions.

For character / donor assembly:

- `skills/kfb-frankensteining_v1.md` — only when mounting or combining existing donor parts / actors; measure the attachment frame and show the donor first.

For pose / motion:

- `skills/cartoon-motion_v1.md` — only when the question becomes character motion / follow-through rather than static construction.

For Claude Design direct paste workflows:

- `skills/design-3d_combined_for-design_v1.md` can be used as the one-file combined 3D instruction surface instead of separately loading the base + reference.

The canonical KFB review workflow remains the Web-first HTML review contract above. These skills add domain expertise; they do not replace owner/branch/Stage/GitHub rules.

---

# Review evidence requirements

For each comparison:

1. exact candidate revision visible in the review;
2. exact donor/source IDs recorded;
3. same camera and lighting across size variants;
4. a comparison view where the relevant silhouettes are fully visible;
5. at least one side / ¾ view that reveals card contact and body overlap;
6. no generic UI or decorative chrome that competes with the comparison;
7. screenshot / review artifact registered with the owning Return.

For the three-rider study, the full card boundary must be visible in at least one proof image.

---

# Explicitly out of scope

- no card thickness redesign;
- no TMB-2 double-Space implementation;
- no landing logic;
- no Ground↔Flight transition;
- no Drive handoff;
- no new flight movement owner;
- no new camera owner;
- no Studio v17 implementation;
- no Toolbox integration;
- no party-flight gameplay;
- no auto-merge / Live promotion.

---

# Human feedback to preserve

Current TMB-1 human finding from Georg:

- CardCarrier: good;
- contact/planting: good;
- rider: too small;
- likely desired rider scale: roughly `~2×` current;
- Surf pose direction: correct family, stronger Studio v17 Surf source may exist;
- card thickness: slightly heavy, **defer**;
- next useful question: rider scale and multi-character capacity.

---

# Exactly one next gate

**TMB-1E · build the two isolated HTML comparison reviews from the verified TMB-1D baseline.**

Stop after Georg can choose:
- preferred single-rider scale; and
- whether the current card size is sufficient for the three-character class comparison.

Do not start TMB-2 from this slice.
