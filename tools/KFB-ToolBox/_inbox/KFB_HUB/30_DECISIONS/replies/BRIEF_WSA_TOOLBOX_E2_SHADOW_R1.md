# Brief WSA work · ToolBox-Studio: E2 eyelids for the aliens + shadow seam (V-417) · 17.10.2026
**Tier 0:** figures only from their figure card (KFB eye rig + clay) · light only from the stage light module · a known failure means stop and report. **Your blocks:** [Figure] + [Stage/light].

Georg 17.10., with screenshots from ToolBox-Studio: the eyelids are "still or again wrong", there is a shadow seam on FrizzleBob's neck, and Dory's lower head (oval, seam) is broken. Cause, honestly: integrating the E2 lids into the aliens (V-348) was **planned and never built**. The plan has been sitting since 16.10.


> **UPDATE 17.10. (WS0): do NOT build E2 yourself.** WS0 is building the one shared module `clay-skin-attach.v1.js` with a proof page against the reference image (`replies/E2_ATTACH_R1/`, coming shortly). ToolBox-Studio **only integrates that module**, without its own interpretation. The game (WS1) gets the same module later. Do section 2 (shadow seam) and section 3 (gate) now.

## 0 · What is wrong right now (Georg 17.10.: "THOSE ARE LIDS AS CAPS!")
The aliens currently have **thick, rigid caps** as lids (the v6 lid shells `_up`/`_lo`, upper hood with a ring, lower ring). **That is not what Georg approved.**
**Approved (V-348) is E2: a thin, closed lid skin that hugs the eyeball. The lid slit is the only opening, and there is no cap and no separate shell.** Reference image: `replies/E2_REFERENCE/E2_approved_closed_lid_skin.png` (Claude Design workbench E2: rest, 25/50/75 %, closed, side, back).
- Hide the v6 lid shells **completely** (`e._up.visible = e._lo.visible = false`, see plan §3.2). No other shell in their place.
- The skin hugs the eyeball (inner surface 1.012 R, outer about 1.112 R), not a hood standing out.
- The baked eye **socket** of the aliens (head part, Georg V-332) is not a lid and stays. The E2 eye sits inside it.
- Proof before/after side by side with the reference image: open, half, closed, and from the side. Only send it to Georg once it looks like the reference.

## 1 · Integrate E2 lids exactly according to the existing plan
Plan: `tools/KFB-ToolBox/eye-actor-studio-v1/clay-eyelid/ALIEN_STALK_E2_PLAN.md` (commit `e1e60edff`, branch `eyes/kfb-clay-eyelid-e2-2026-10-16`); module `clay-eyelid.v2.js`, test `tests/clay-eyelid-skin.test.mjs`. Build `clay-skin-attach.v1.js` (`attachClaySkin(rig)`) as described in plan §3.
**WS0 decisions on the plan's open points:**
- Fit (§5): **path A**, scale eye and skin together with s ≤ 0.973. The E2 shape stays exactly as accepted. The socket shell is never hidden, replaced or covered.
- Dory `shellRadius` 1.014 vs. 1.10: **1.10 R applies** (baked socket shell from Blender R1). Correct the recipe value.
- Lid colour (§4): E2 takes `e._up.material` = **`eyeHost.lidColour` without × 0.72** (as in `_work/proof.html`).
- If the clay shader needs `uv`/`_CLAYSEED`, add them in `clay-eyelid.v3.js` (v2 stays unchanged).
Georg's rules (V-348): the eye sits in the existing socket; the socket does not move with the lid; the stalk attaches at the back, slightly below the middle; the eye tilts slightly forward; the lid is readable in the socket opening and, when wide open, retreats behind the rim. **No seam visible.**

## 2 · Shadow seam (FrizzleBob's neck, all figures)
Until the shared WS1 module `kfb-stage-light.v1` arrives: in ToolBox-Studio, **figures do not cast shadows onto themselves** (head onto body). The figure only gets a soft contact shadow on the ground, and the rest is lit by the character light. That removes the seam. Switch to the module once it is on GitHub.

## 3 · Gate before Georg sees anything
No new ToolBox state goes live or to Georg without **WS0 checking the images first**: front/¾/close-up of eyes and neck for FrizzleBob, Lord Hunky and Lady Dory, with clay. In the RETURN: before/after images of the eyes (open, half, closed) and of the neck.
Dory head shape and lower head seam: WSB is fixing these in Blender (job B14). Swap in the new GLB once it arrives.
