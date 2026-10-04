# Failure Timeline · ToolBox + Birthday · 2026-09-15

**Status:** INCIDENT TIMELINE / ANALYSIS INPUT

This timeline is intentionally blunt. Its purpose is to show where upstream briefing choices amplified cost and produced false confidence.

## ToolBox UI/UX

### T0 · Existing product reality

- Studio v17 already existed as the working authoring surface.
- It had its own Paper/Light visual language and functional tabs.
- Rigging Lab / CapsuleCarl existed as specialist tooling/test fixture.
- Pilot v1 had useful UX findings but was not the product SSOT.

### T1 · Bad Lead brief

The first UI rework brief instructed downstream Design to use the Pilot as the active design object and emphasized an abstract workflow rail:

`Select → Shape & Look → Attach & Fit → Motion & Talk → Export`

It did not protect the Studio feature model, visual language, complete roster or information architecture strongly enough.

### T2 · Rational downstream drift

Design began producing:

- DocCheck-like red/dark chrome;
- Carl-centred workflow assumptions;
- reduced character roster;
- missing Talk/Voice/Bubbles;
- replacement of Studio structure by the workflow abstraction.

### T3 · Corrections

The Lead then issued corrective addenda:

- Studio v17 restored as primary source;
- Paper/Light restored;
- full 39-section coverage required;
- roster completeness required;
- Carl explicitly demoted to regression fixture.

### T4 · Second-order failure

The next design direction still became cluttered:

- multiple stacked header/navigation rows;
- meta/explanatory copy in the working surface;
- cards inside cards;
- source/status/provenance ballast;
- stage reduced relative to UI chrome.

Georg rejected the result as less usable than the original Studio.

### T5 · New reset direction

A separate `UI_RESET_MINIMAL_STAGE_FIRST` brief was created with a harder principle:

> EVERY PIXEL / WORD / LETTER / CELL HAS TO PAY RENT.

Current direction is to prove workflows in old Studio v17 first and build the clean new ToolBox shell later.

---

# Birthday / Astra

### B0 · Rich intended experience

The user intent included a recognizably KFB Birthday/Town entrance with living-world qualities and identity-bearing elements such as:

- Travel sunset/coast/world depth;
- theatre curtain entrance;
- Uncle FrizzleBob;
- GothGirl-source hero;
- Hihi Love-Hope;
- Birthday music / D6 ritual;
- disco balls;
- lighthouse;
- fireworks/celebration;
- world toys/props including Newton cradle;
- living character motion and microinteractions;
- minimal UI that feels embedded in the world.

### B1 · Initial Lead slicing error

To keep the P0 small, the briefing moved several identity-bearing elements to later priority or made them conditional. It also emphasized owner safety and implementation boundaries more strongly than the exact experience sequence.

This created a legal path to a sparse selector that could satisfy many written checks while missing the product's identity.

### B2 · Astra implementation

PR #8 was created:

- 90 changed files;
- ~10k additions;
- separate Birthday consumer;
- automated tests and source checks passed;
- critic rounds reported PASS in several categories;
- actor clip binding and technical audio checks passed.

The PR itself explicitly still said `GEORG FREEPLAY: Not performed` in the Return.

### B3 · User-facing rejection

During Georg inspection, major visible/experience failures remained, including reported examples:

- initial top-down / actor-on-curtain staging;
- Hihi too small;
- Hihi shown without the expected KFB Cube-Pet face/eye/mouth presentation;
- raw GothGirl presentation without the intended KFB face rig look;
- generic/blob-like shadows rather than convincing scene-integrated 3D grounding;
- cheap/wrong curtain behavior;
- Enter/click not reliably producing immediate feedback;
- insufficient loading feedback and microinteraction;
- missing/insufficient visible D6;
- missing disco balls;
- missing/weak lighthouse;
- missing Newton cradle and other setting/interaction inventory;
- characters not reading as living inhabitants of the world;
- character animation/liveliness not convincingly visible.

### B4 · Rescue cascade

The Lead responded with multiple corrections:

- naming/scale/camera correction;
- shadow/lighting correction;
- P0 Experience Reset;
- hard reset of RUN_NEXT;
- mandatory briefing red-team review;
- Birthday briefing postmortem.

This rescue history is itself evidence of the original brief's failure: a production brief that requires a long emergency addendum chain was not sufficiently complete or prioritized.

### B5 · Cost consequence

Georg reported the failed Birthday/Astra path consumed approximately **12% of the week's usage limit**.

This is a central process requirement for future templates: they must optimize not only for correctness but for **early falsifiability and bounded expensive-model exposure**.

---

# Cross-incident pattern candidates to test

Do not assume these are the final diagnosis; validate them in your audit.

1. **Abstraction before inventory** — compact model created before full source/feature/identity coverage was protected.
2. **Prototype/test fixture promotion** — a convenient recent artifact became the implicit product model.
3. **Implementation constraints louder than product promise** — owner/architecture safety was easier to satisfy than user-visible intent.
4. **P0 compression removed identity** — implementation depth and experience completeness were conflated.
5. **Pass criteria measured the wrong layer** — technical green did not prove taste, composition, feel, loading feedback or world identity.
6. **Critics reviewed bounded evidence too narrowly** — local PASS did not force a holistic world/experience PASS.
7. **Human gate too late** — meaningful user-facing frame/flow was not surfaced early enough to stop expensive work.
8. **Corrections accumulated instead of resetting precedence early** — rescue addenda increased context complexity.
9. **No explicit literal-executor adversary before build** — ambiguity was discovered by implementation rather than by cheap preflight.
10. **No cost gate** — expensive autonomous execution could continue despite unaccepted product direction.