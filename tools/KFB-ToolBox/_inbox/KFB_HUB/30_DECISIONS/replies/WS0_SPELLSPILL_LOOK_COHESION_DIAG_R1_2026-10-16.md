# WS0 Source-First Look Cohesion Diagnosis R1 — SpellSpill Reference
16 October 2026 · GEORG ART-DIRECTION FEEDBACK / RESEARCH INPUT · NOT an independent WS1 runtime, new V-number or design acceptance.

## Owner and current authority
- Repo georg-doc/kayfabizarro, WS0 register branch docs/kfb-decisions-register-2026-10-11.
- Canon: ARCHITECTURE_R1 V-228; BRIEF_WS1_LIGHT_R1 V-329 (amended V-342); BRIEF_WS1_LOOK_RUN_L2 V-340; latest WS0_TO_WS1 16 Oct V-346 (Georg TUNE) and V-345; WS1_STATUS §§47–49/57 on ws1/r3f-frame.
- Existing owner: one WS1 R3F stage/light/camera, existing Clay K1/H0 SSOT from work/clay-style-ssot-2026-10-01. Do not add another renderer, light rig, palette or world-material owner.
- One existing open intake: Issue #404. This record is source/quality evidence for *already ordered* L2/V-346 repair, not a new parallel milestone.

## 1. Georg's identified visual seams
The game is not yet a coherent warm/cozy clay diorama. Figures and Meshy stages seem to live in different exposure/material spaces: a too-strong colored outline/halo on GothGirl, overexposed character clay, a relatively dark FB mouth, different terrain color/texture response, separated Meshy surface and stage base. V-346 already names these issues in WS0_TO_WS1:
- Look B becomes the warm default; its sky must be the same original skydome as A, just toned. Reduce GothGirl violet rim to a **trace**, light FB face/mouth without washing the body; reduce overexposed GothGirl clay.
- Daytime shadow length/direction follows timeOfDay solar elevation/azimuth.
- ACES global with proposed terrain `toneMapped:false` to preserve desired ground color; **test whether bypass makes the ground perceive a different light/exposure space** before treating the current workaround as a solved cohesion problem. Compare same-camera same-time pixel pairs. Do not contradict V-346 on the live host without WS0 direction.
- Figure/vehicle clay relief+roughness, original painted albedo virtually unchanged (vehicle saturation >=95%); test actual material, not only metalness=0 and roughness threshold.
- Stage footprint/edgePalette per V-342/V-345 and L2 step 4 V-341: terrain smoothly joins the actual model's base over a 3–8m contact skirt; stage-matched edge hue and deeply planted irregular clay rocks, not floating egg pebbles. Do not disguise seam with artificial platform.

## 2. Dropbox asset evidence — reference contact, NOT underlying shader donor proof
Georg-provided public Dropbox folder [SpellSpill VFX Study](https://www.dropbox.com/scl/fo/khq2ourkr6ihtkvsofo3b/AF6uLp4fDDyuWr_5iGNl7_s?rlkey=75r24euxt8e6ybfo3d1y9j2pe&dl=0).
Connected Dropbox metadata: folder id `id:KeQLaY5-IIAAAAAAAAp9Uw`, path `/(DB) CS 2020 Krazy Karnikl/Cancel This Comic/SpellSpill VFX Study`; **9 screenshots**, total folder 18,888,100 bytes, all PNG from 2026-10-16:
16.52.47 id:KeQLaY5-IIAAAAAAAAp9Sg
16.52.57 id:KeQLaY5-IIAAAAAAAAp9Sw
16.53.09 id:KeQLaY5-IIAAAAAAAAp9TA
16.53.30 id:KeQLaY5-IIAAAAAAAAp9TQ
16.54.03 id:KeQLaY5-IIAAAAAAAAp9Tg
16.54.20 id:KeQLaY5-IIAAAAAAAAp9Tw
16.54.36 id:KeQLaY5-IIAAAAAAAAp9UA
16.54.50 id:KeQLaY5-IIAAAAAAAAp9UQ
16.54.58 id:KeQLaY5-IIAAAAAAAAp9Ug

Dropbox file_preview produced source-file previews. However this execution did **not obtain original PNG pixel bytes** in the coding runtime: file-level color/lighting findings are NOT claimed from a per-pixel scan. The screenshots are visual design references, not source code, proof of origin/licensing, or evidence that the shader/VFX technique has been used in KFB. No identification of the screenshot-generating code is asserted. Next source-first process if needed: isolate 2–3 representative original stills visually and pin the original demo/shader creator/license before adapting any shader.

## 3. Technical hypothesis: unify response, not overlay more effects
**Likely causes to test, not proven from screenshots alone:** two different color/tonemapping responses, differing linear/sRGB and exposure paths, baked lighting in source textures plus additional dynamic diffuse, mismatched smoothness/metalness, excessive Fresnel/rim, actor Face Fill mismatch, ground intentionally un-tonemapped, terrain missing the stage's source edge colors and physical contact, unmatched UV-scale detail.
Priority and source test per single actual stage:
A. One **neutral shared host camera/light/exposure** and original objects isolated: FB, GothGirl, real Goblin Bank/Atlantis stage, terrain patch, exact full Card; toggles for rim, local practical, contact, clay, tm. Measure same pixel band where stage/terrain meets, eye/mouth clipping and light response. Keep original Card pixels ungraded.
B. Bring all receivers into a common **view transform/exposure** as far as V-346 allows; handle stage-local differences with per-source material response and only necessary emissive/practical, not another postprocessing overlay. Saturation alone not enough; compare midtone lightness, shadow color and material highlights. Limit saturation or luminance clipping under gold and night.
C. Normalize broad **material behavior**: keep Meshy's original source PBR albedo/UVs and their individual texture features, but clamp plastic/metal highlights where needed, use calibrated roughness and restrained ambient/fill, preserve readability of matte relief; character/terrain/prop families get scale-appropriate microdetail. No generic replacement branding or baked “clay” color wash.
D. Match **contact and horizon**: approved stage footprint, edgePalette source color at ring, soft 3–8m geom/OKLab skirt, compatible clay grain at meter scale and deep sunk transition stones. Shared sun shadow direction, actor contact/AO, atmospheric sky/fog hue. V-346 face has isolated fill without purple halos, do not over-light eyes or skin.
E. Only then tune VFX **to the same lighting/color space**: localized emissive sources, smoke/debris/particles responding to palette, peak brightness, soft shadow/occlusion where useful; bloom/glows selective, never full-scene sticky neon, and no extra default light writer. SpellSpill water/fluid/smoke/particle/flame/explosion donors are research candidates only after original source/license isolation.

## 4. UV-independent Clay detail: compatible and bounded
- The original Meshy `baseColorTexture` UV sampling stays intact even if UV islands are irregular. Do **not** attempt to re-unwrap dozens of imported GLBs and do **not** triplanar-replace the painted albedo as a global edit.
- Add a **secondary small-amplitude clay bump/normal or roughness detail** sampled in object-rest/local coordinates (skinned actors must respect skinning and existing bone/mouth/eyes) or triplanar world-space for static scenery. This does not need the imported UVs. Triplanar blends three projections by surface normal; use scale in actual world units, mipmapping/derivative-aware sampling, and debug surface seams. The existing `clay-material.v10` source has three-axis projection in rest space; K1/H0 v8 remains VISUAL Golden, no v10 automatic promotion.
- Possible ordered levels:
  * L0 original Meshy diffuse and original/no added bump, normalized material roughness.
  * L1 source-albedo preserved + restrained UV-free clay micro-normal/roughness; faces/painted windows protected.
  * L2 only if visual test demands: isolated geometrical softening/large-scale deformation in the **correct geometry owner**, not runtime mesh surgery. Deformation is not authorized by V-336 and should not be smuggled in by shader.
- PBR tangent normals versus triplanar transformed normals require correct coordinate basis. Overdoing the effect on existing source normal maps creates muddy double-relief. Matte material alone is not identical to Golden clay; compare exact real model with K1/H0 Golden under fixed lighting.

References: Three.js TSL `triplanarTexture()` and `normalMap()`: https://threejs.org/docs/pages/TSL.html ; current Clay SSOT on work/clay-style-ssot-2026-10-01 ; WS0 L2 V-340 step 4 explicitly requests triplanar clay detail without changing color.

## 5. One bounded receiving proof inside V-346/L2
**Do not rebuild all environments.** Same real current WS1 two-actor Card/Stage host:
1. **Proof 0 – source-only isolated contact:** one original Meshy stage with untouched original albedo, one FB, one GothGirl, one terrain receiver, genuine printed KFB Card, existing light/Clay baseline and isolated VFX reference stills (not a shader “URL loaded” assertion).
2. **Proof 1 – controlled toggles:** exact camera and time/gold/night with `look=b`, ACES/tm candidate, rim OFF vs V-346 trace, face fill ON, original vs L1 clay normal. Record whole-frame histogram/clip/midtones and screenshot with 1 neutral grey + 1 terracotta/ochre test patch (patch only as *diagnostic*, never a substitute production prop).
3. **Proof 2 – unified transition:** V-341/L2 footprint, `edgePalette`, 3–8m skirt, correct shadow/contact and equivalent color. Same 16:9 / 9:16 perspectives and orbit near stage contact.
4. **Proof 3 – one correctly sourced VFX accent** only if step 2 is visually cohesive. Compare VFX OFF/ON; localized bloom/no excessive overexposure, source/no extra shadow light owner, actual M4 p95, shader compiles and no GLB UV regressions.
5. **Proof 4 – existing L2 V-340 acceptance grid**, including G1 eyes/mouth/card, G2 <0.1% clipped actor pixels, G3 Meshy original albedo and V-286 hue constraint, G6 warm sky/ground coherence, G8/G9 correct material family, G11/G12 edge ΔE/terrain seams, G14 clay source-preserving (mean ΔE<=0.01). This is targeted visual QA, not repeated global code critic.

**Avoid premature repair:** if diagnosed split is toneMapping bypass or face Fresnel, fix *that seam first* before expensive new terrain shaders or new VFX library. WS0 decides exactly one owner task and whether proposed alternative deviates from already approved V-346. No forced new human gate before one real WS1 source stage candidate exists.

## 6. Handoff
**Status:** Source intake + grounded diagnosis; no changed running light, material, model or 3D scene. No actual original screenshots downloaded or pixel-audited; no Site/preview URL revision verified. Existing WS1 L2/V-346 is the recipient.
**Next single gate:** WS0_V346_COHERENT_LOOK_RECEIVER_CHECK — WS0 maps this Dropbox visual reference + the focused diagnostic to the EXISTING V-346/L2 tune and nominates its first real same-camera actor-stage-terrain proof. Do not create a new runtime owner, no V-number asserted.


---

## 2026-10-16 · Georg confirms approach · routed to existing WS0 V-355
**Georg's response:** the source-first look-cohesion diagnosis is intuitively plausible; **continue with this approach**. This is a GO for the *method and next comparison*, **NOT** a rendered Look PASS, new code authorization outside the established owner or acceptance of an unverified VFX donor.

**Newer WS0 authority supersedes the earlier “V-346 receiver check” gate in this historical note:** WS0_TO_WS1 now explicitly assigns **V-355 / L2 Step 5 “Ein Look für alle Schichten”** (paired with V-356 delivery/publish planning). Implement the accepted owner task **within existing V-340 L2**, following Step 4 V-341 terrain integration. WS0 has specified:
- Meshy baked lighting + real-time lighting yields muddy, overly dark stages relative to bright figures;
- **WS0 supplies de-lit/normalized Meshy texture variants**, retaining the source's colors and original asset identity; *no unverified wholesale repaint or destructive UV remap*;
- shared environment tint, horizon/haze and ambient from the stage's **source-sampled edgePalette**; actor ground hemisphere/bounce matches the stage;
- common KFB Clay fine normal/roughness at consistent scale (UV-independent triplanar **detail only**, source UV albedo retained);
- same-camera comparison among **actors, stage, terrain** at same time/look; assess mean lightness and chroma deviations ≤ 15 % as WS0's quantitative guide, while still reviewing visible material and contact continuity;
- carry forward **V-346**: very subtle GothGirl violet rim, FB mouth fill, no overexposed clay, look B default, shadows follow solar time, ACES/toneMapped:false ground trial explicitly visible in comparison.

**Smallest evidence packet for WS1 (no separate new gate):** one original real Meshy GLB and original material **shown alone** before normalized-texture variant; original FrizzleBob and GothGirl under same light; then real Meshy stage + actual terrain transition + original ungraded KFB Card. Identical cameras, look B gold/day, 16:9 and portrait where relevant. Pair current V-346 baseline | actual V-355 receiver, with **rims, local lights, tonemapping and Clayton normal** test toggles. For WS0-supplied normalized Meshy textures show original vs new together, exact source refs and ownership; inspect painted AO, luminosity clipping, source color fidelity and look at both day/night after pass. Do NOT claim a 15% metric proves visually finished; inspect original Card and actor eyes/mouth as well.

**Dropbox reference state:** confirmed nine SpellSpill PNG source IDs/preview links in connected Dropbox. Direct original pixel transfer into the local container remained unavailable in this chat environment (temporary Dropbox download URL could not be resolved from container); therefore no original screenshot color histogram or claim that any reference shader was integrated. Keep them as Georg visual inspiration and retrieve/source-isolate with the appropriate GUI/connected browser capability before VFX adoption. Never claim an asset URL loaded is visual donor proof.

**No extra runtime owner, issue, V-number, Site deployment or broad asset rewrite.** Existing Issue #404 and V-355 are the route. One next action/gate: **WS0_V355_LOOK_COMPARISON_SOURCE_AND_RECEIVER** — WS0 supplies de-lit Meshy source textures and the exact L2 Step 5 acceptance packet for the current single WS1 R3F owner, then reviews the real same-camera evidence. Current GPT-Site staging idea in WS1_STATUS §57 / WS0 V-356 is separate platform planning, not verified delivery of a revised Look build by this research chat.
