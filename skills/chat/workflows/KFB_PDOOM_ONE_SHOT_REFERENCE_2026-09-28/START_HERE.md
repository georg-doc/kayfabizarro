# KFB · PDoom / coded-animation one-shot reference · START HERE

**Status:** CURRENT_REFERENCE CANDIDATE · EXTERNAL CASE STUDY · NO RUNTIME OWNER  
**Date:** 2026-09-28  
**Owner:** KFB Chat Production Router / reusable production research  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `research/pdoom-one-shot-reference-2026-09-28`  
**Outcome:** source-backed lessons for design, animation, coded-video technology and autonomous prompting  
**Stage:** none; this is documentation/research, not a human review surface

## Read order

1. `skills/chat/START_HERE.md`
2. `skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`
3. `skills/kfb-cartoon-animation_v2.md` when motion/camera is relevant
4. this folder's `CASE_STUDY.md`
5. this folder's `RETURN.md`

## External sources inspected

Primary implementation:
- https://github.com/JohnHeibel/PDoomVideo
- inspected head: `fa546a38092e75f2b079e6a86d6abc54dd525d17`
- especially `README.md`, `STORYBOARD.md`, `ANIMATION_GUIDE.md`, `src/core.js`, `src/timeline.js`, `studio.html`, `render.mjs`, chapter files

Prompt / creator context supplied by Georg:
- https://x.com/donaldjewkes/status/2102801469976248500

Successor/generalized implementation explicitly linked by PDoom:
- https://github.com/JohnHeibel/ClaudeAnimationBase
- used only to distinguish one-off tricks from the generalized production pattern

## Core finding

The useful lesson is **not** “one prompt magically created a film”.

The stronger model is:

`one human delegation → autonomous multi-stage studio workflow`

Inside that single delegation the agent can:
- inspect references and skills;
- derive a style sheet / production grammar;
- storyboard;
- assign isolated modules to subagents;
- build deterministic scenes;
- render evidence;
- inspect contact sheets / strips / clips;
- repair;
- re-watch the whole candidate;
- export the final film.

The human interaction can therefore be one-shot while the **internal production process is explicitly iterative**.

## KFB relevance

This reference is load-worthy for:
- autonomous animation / short-film runs;
- Elisa 18 one-shot and later KFB cinematic consumers;
- coded animation architecture;
- prompt design for Work/WSA/Claude Code-style agents;
- animation QA tooling;
- scene/shot modularization;
- deterministic capture and parallel rendering.

It does **not** replace:
- KFB visual canon;
- `skills/kfb-cartoon-animation_v2.md`;
- ToolBox / actor / rig owners;
- WorldBuilder / Race / Combat / Audio owners;
- current ClayBound material ownership;
- project-specific source manifests.

## Reuse boundary

Adopt principles, not implementation identity.

PDoom is a 2D p5.js/p5.brush system. KFB frequently needs Three.js, real source assets, rigs, mixers, cameras and owner contracts. The portable ideas are production architecture, timing/staging grammar, transition planning, deterministic evidence and prompt structure.

Do not copy external code into production merely because it is public. PDoom's `package.json` declares ISC, but no root LICENSE file was present in the inspected PDoom tree; its successor `ClaudeAnimationBase` has an explicit MIT LICENSE. Treat PDoom here as an analytical reference unless licensing/provenance for a concrete code reuse is separately verified.

## Productive-review rule

This case study creates **no Georg gate**.

For KFB one-shot production, internal source/look/shot evidence should be machine/critic QA whenever it can be. Human review belongs at a meaningful integrated candidate unless a real artistic decision or blocker requires intervention.
