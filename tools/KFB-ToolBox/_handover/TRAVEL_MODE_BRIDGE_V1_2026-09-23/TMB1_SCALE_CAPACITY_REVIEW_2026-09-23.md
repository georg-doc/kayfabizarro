# KFB Travel Mode Bridge v1 · TMB-1E Scale / Capacity Review · 2026-09-23

**Status:** REPAIR PASS 1 · TECHNICAL / CI PASS · GEORG HUMAN RE-REVIEW PENDING · NOT PUBLIC  
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
- corrected human intent for the capacity comparison is three **different rig classes**:
  - the existing ActionFigure / Rig_Medium on one side;
  - Orc Brute / Rig_Large in the center;
  - Legacy Warband Orc B / Rig_Legacy on the other side;
- the earlier first implementation using Legacy Orc A + Brute + Legacy Orc B was a misread and is HUMAN_REJECTED;
- “Large Rick” is resolved as **Large Rig**, not as a separate fourth character source;
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

`ActionFigure / Rig_Medium · Orc Brute / Rig_Large · Warband Orc B / Rig_Legacy`

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

“Large Rick” is treated as the speech-to-text form of **Large Rig** here. The center actor is the already measured Orc Brute / `Rig_Large`; the other two are the existing Medium ActionFigure and one Legacy Warband Orc B. No substitute fourth actor is introduced.

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

# Implementation result · 2026-09-23

Travel Draft PR #37:
- branch: `chatgpt-web/travel-mode-bridge-tmb1e-scale-capacity-2026-09-23`;
- current handoff head after Return: `5110f3617246d05278e0435b3b1e0a99c33e62e5`;
- technical test head: `33b4a5bf9904d3e9e86c99f6efd5cbdde8448641`;
- CI run `35823280576` / job `107059518887`: **SUCCESS**;
- repository tests: **99 PASS · 0 FAIL · 0 skipped**;
- build: PASS;
- verify: PASS.

HTML-first review artifacts:
- `site/travel-mode-bridge/tmb1e/TMB1E_SURF_SCALE_REVIEW.html`;
- `site/travel-mode-bridge/tmb1e/TMB1E_THREE_RIDER_CAPACITY_REVIEW.html`.

The capacity trio is now source-locked as:
`Legacy Orc A · Orc Brute / Rig_Large · Legacy Orc B`.

The earlier spoken “Large Rick” wording is resolved as **Large Rig**. No separate XL / substitute actor is introduced.

Travel Return:
`_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/TMB1E_RETURN.md`

Cloudflare / KFB Stage remains intentionally deferred during this HTML visual-review gate.

# Exactly one next gate

**GEORG HUMAN HTML REVIEW · open both TMB-1E artifacts.**

Decide only:
- preferred single-rider scale: CURRENT / 1.8× / 2.0× / between; and
- whether the unchanged card reads large enough for Legacy Orc A + Rig_Large Brute + Legacy Orc B.

Do not start TMB-2 from this slice.


## Repair Pass 1 · human rejection / corrected capacity trio

Georg's first direct HTML review rejected the initial capacity artifact.

Findings:
- the intended comparison was **not three Orc-family actors**;
- the required trio is **Medium + Large + Legacy**;
- the downloaded capacity HTML also hit a real `THREE.GLTFLoader: Failed to load buffer "data:application/octet-stream;base64,..."` error;
- visible material/texture presentation was not acceptable.

Corrected Travel implementation is Draft PR #37:
- repair implementation: `360836ce494f76ea4c1b3133d566bd3b39e14970`;
- hardened tests: `fd3b665174184d6ee4f6e0db23a2568f4cd9c366`;
- corrected source/evidence head: `bb8541267723ba9d980650735c5dcc437e36736d`;
- Return handoff head: `658e95af4963b25c7d3224d4b1d7fb2e43880896`.

Corrected exact trio:
1. ActionFigure / `Rig_Medium` · blob `4785276defdb929cb397954eb74b76aecb84486b`;
2. Orc Brute / `Rig_Large` · blob `1b56aac3d98cc978bd1311ddc61f1260a870494d`;
3. Warband Orc B / `Rig_Legacy` · parts blob `2dfd0bf6661bb207516053758a26baf5cb6407f1`, Legacy rig blob `7ea2893af394b00dd1b33de296c5d5104819d9c7`.

Material truth:
- ActionFigure: embedded `actionfigure_texture.png` + `actionfigure_faces.png`;
- Orc Brute: embedded `orcbrute_texture_A.png`;
- Legacy Orc B: source-authored named materials, not a texture-sheet map.

Legacy repair:
- reuse Resident Atlas assembly rule (four rigid source groups → six-bone Legacy rig via `skeleton.boneInverses`);
- convert the exact embedded Orc-B JSON+BIN to an in-memory GLB before `GLTFLoader.parseAsync()`, bypassing the failed nested data-URI FileLoader path;
- no geometry or material value is rewritten.

Repair CI:
- run `35860054421`;
- job `107177777296`;
- **102 PASS · 0 FAIL · 0 skipped**;
- build PASS;
- verify PASS;
- artifact `10750096111`;
- digest `sha256:0065f59d330a31d11c15d4a66019d6ad6200744e4c653f0f48e099d28dff273f`.

The repaired capacity review uses the **2.0× rider-size candidate** while preserving native Medium/Large/Legacy proportions.

Exactly one next gate remains:

**GEORG HUMAN RE-REVIEW · repaired three-rig Capacity HTML.**

TMB-2 remains HOLD.
