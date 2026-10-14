# Claude Design · KFB Clay Eyelids — mesh recovery & tutorial evidence
Date: 2026-10-14
Status: RESEARCH / BRIEF PREPARED · VIDEO TRANSCRIPT GATE OPEN · NO DESIGN PASS
Owner: KFB ToolBox / Eye Actor Studio source-donor lane (existing Draft PR #159).
Receiving 3D runtime/profile owner: KFB ToolBox / EyeRig v6 + Batch PR #104.
Source repo: georg-doc/kayfabizarro
Branch: chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21
Current source at briefing: head 2973bd9453c6d22c0b4c52c7217b5956c48e4d67
Delivery: source-isolated real 3D review in the existing EyeRig/ToolBox workbench; GPT Site first only if publication is later authorized. No Cloudflare public Stage required for the present research/design task.

## Binding human result · 2026-10-14
**Georg HUMAN VISUAL FAIL** for prior thin-clay proof: top surface destroyed, visible cracks, edge tearing, bad/incoherent mesh. The 30/30 local structural assertions and CPU image segmentation DO NOT validate this geometry. Do not present as a candidate PASS or use it as a base for tuning. Keep as negative visual/geometry fixture:
`tools/KFB-ToolBox/eye-actor-studio-v1/thin-clay-lid.v1.mjs` (blob 79eb8abe57bd2671422d037a10fcb575640464dd).
Original accepted EyeRig v6 eye-placement/profile state must stay unchanged; no automatic consumer migration.

## Source-critical YouTube analysis · TRANSCRIPT A RECEIVED / B PENDING

### Video A · Jen Abbott / Olde Tinkerer Studio · DIRECT USER-SUPPLIED TIMECODED TRANSCRIPT

**Source:** https://www.youtube.com/watch?v=y3Q3oD7A1kM · "How to rig and animate cartoon eyes with Bones in Blender [2.9]". Georg supplied the English timecoded transcript (0:03–8:57) in chat on 2026-10-14. **Provenance:** user-transcribed/copied transcript; its caption origin (creator-verified vs auto-generated) is not established. Timestamped procedural points below are transcript-grounded, not a direct video-frame inspection. Earlier creator-authored companion article remains independent corroboration: https://oldetinkererstudio.com/how-do-you-rig-and-animate-cartoon-eyes-bone-rig-in-blender-3d/

**Timecoded exact procedural extraction (verified = explicit user-supplied transcript, not visual/video verification):**

| Time | Transcript-grounded step | Blender implementation / relevance | Limit |
|---|---|---|---|
| 0:15–0:37 | Name eye `eye.R`, lid objects `eyelid_bottom.R` and `eyelid_top.R`; hide lids temporarily | Three independent **already-present** mesh objects for one eye | NO lid mesh modelling or topology shown |
| 0:41–1:13 | Enable Rigify add-on; Shift+A single bone; place/scale in front; armature named `eyebone.R` | Eye target/locator | This does not mean KFB must depend on Rigify |
| 1:19–1:54 | Eye mesh gets `Track To` constraint targeting `eyebone.R`; Track axis negative Y, Up Z; moving locator on X/Z aims eye | Separate gaze targeting; preserve EyeRig v6 gaze owner | Blender-local axis convention; DO NOT copy axis signs blindly to Three.js |
| 1:57–2:37 | Unhide lids; add lid bone ahead of eye; rotate 90° about X; Ctrl+A apply rotation; `eyelid_bone.R` | Prepare clean local controller orientation | Apply-rotation must be confirmed against actual Blender file transforms |
| 2:37–3:26 | Top and bottom mesh each add `Copy Rotation` constraint targeting same lid bone; animate/test X rotation | One per-eye closure channel drives both lids | Inputs presume lid meshes already modelled & correctly pivoted |
| 3:29–3:45 | Bottom-lid `Copy Rotation` sets **Invert X**; repeat X-rotation test | Counter-rotating upper/lower closure | Need contact-aware mapping for KFB, not simply mirrored Euler angles |
| 3:47–4:02 | Controller bone Y/Z rotation locked, X free | Restrict degree of freedom | Does not solve canthus deformation or sphere-hugging surfaces |
| 4:06–4:34 | Duplicate meshes+controls and suffix .L; test | Symmetrical first pass with per-eye independence | Later KFB asymmetric eye slots need their own geometry/anchors |
| 4:59–5:59 | Add single master **Eye Controller** between eye bones; parent individual eyebones to master; each still individually steerable | Shared gaze with independent overrides | Preserve existing EyeRig v6 semantic signals |
| 6:13–7:14 | Add second master **Eyelid Controller** between the lid controllers, rotate X 90°, apply, parent per-eye lids; individual control remains | Shared Blink + individual L/R offsets | At 7:00–7:07 transcript unexpectedly says "eyebones" in eyelid section — probable caption/narration slip; verify actual Blender viewport before final operational recipe |
| 7:30–8:37 | Set controller keyframes neutral frame 1, move eyes frame 25, close lids frame 35, reopen frame 45, playback | Minimal reproducible gaze/closure test curve | Keyframes do not prove topology, lack of pupil leaks, clean rendering |

**Transcript normalization / uncertainty:** `track 2` (1:24) is very likely ASR for Blender's `Track To` constraint; `eyelet bone` (3:50) and `eyid` (8:19) refer to eyelid; `blank` (8:50) is likely `blink`. These are interpretations, not verbatim corrections. At 7:00–7:07 check whether the instruction actually parents *eyelid* bones (not eyebones). No frame/image proof was available in this intake.

**What this tutorial demonstrably does NOT establish:**
- No creation of the upper/lower eyelid mesh, topology, connected rounded rim, bevel, manifoldness, inner/outer shell, or crease-free crown.
- No auto-fit for oval/ellipsoidal KFB eyes; no compatibility demonstration for varying eyelid thickness across KayKit hosts.
- No tested no-gap contact line, pupil depth-occlusion, full closure from arbitrary gaze, or side/3⁄4 quality.
- No guarantee that Rigify armature constraints export as GLTF/Three.js behavior. Adapt **semantic control graph**, not Blender constraint runtime.

**KFB-specific transferable control graph:** authoritative EyeRig v6 gaze target → L/R eye aim; authoritative EyeRig v6 blink/upper/lower channels → L/R per-eye upper/lower lid boundary sweep; optional shared blink + independent left/right overrides. A KFB lid builder must FIRST generate clean, bounded, normals-correct 3D lid volumes around the actual measured eyeball; only then attach motion controls. Counter-rotation alone cannot ensure canthus attachment/contact or wrinkle-free clay topology. The earlier failed `thin-clay-lid.v1.mjs` remains a negative QA fixture.

**Video A evidence status:** `TRANSCRIPT_RECEIVED_TIMECODED`; key procedural transcript extraction **complete**, video-frame comparison **not run**; no claim of modelling method proven.

**Video B** — RG3D Animation Studio: "How to make cartoon oval eyes rigging in Blender 2.8+" (2020-04-09).
Video URL: https://www.youtube.com/watch?v=hTl825DO-Aw
Verified from original public video description only: step-by-step simple oval cartoon-eye rig, GIMP manipulation of eye texture precedes Blender; jump to Blender at 1:43.
Critical applicability: ***oval/ellipsoid transfer candidate***. Exact deformation method, bones/weights, lid topology, and eye gaze mechanics are NOT source verified; cannot yet be asserted.

**TRANSCRIPT INPUT GATE (mandatory before labeling a tutorial-based instruction final):**
- Obtain creator/auto captions or transcripts for BOTH exact video IDs, with language, provenance, timestamps and whether manual or machine transcription.
- For Video A, check steps/axis orientation and whether lid meshes are pre-modeled. Cross-check against published written tutorial, note any discrepancies.
- For Video B, inspect workflow from 1:43 onward: how oval geometry is formed, how eyes track, whether lids are used, whether deformation depends on lattice/shapekey/bone, if scaling or transforms are applied, and whether any topology step is actually demonstrated.
- Extract timecoded **concepts and operational build steps** (summarize rather than reprint full copyrighted transcripts). Maintain VERIFIED / INFERRED / NOT SHOWN flags.
- If captions are unavailable, report TRANSCRIPT_NOT_AVAILABLE rather than invent them; request transcripts/screen recordings from Georg or source analysis by a video-capable executor. Do not fabricate quotations, timings, or procedural specifics.

## Preserved KFB source contracts / candidates
- KFB Eye Actor Studio Geometry Contract: `skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md`, blob `9617ab624ad55b8e298eb6c9a0c0efb773270c5c`. Binding sections 3/5/6/15/16.
- Existing donor original `tools/KFB-ToolBox/eye-actor-studio-v1/clay-lid.v1.mjs`, blob `30201095b2f686ba3a78b8512e7cee37d07e30b7`, independently show whole eye and lid BEFORE adaptation.
- Existing alternative `tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs`, blob `f2ac451aa5252acd6d3e072547441bbd379e8c01`, independently isolate actual geometric source.
- Existing animation donor `clay-lids.v1.js` inside the September/October ToolBox Claude Design source cut (hinge / slide, rounded lip, shared canthi).
- Existing Lid Motion Lab already compares Slide / Sweep / Hybrid (historical reported 34/34 browser checks); not approved as final aesthetics.
- Later WS1 F1 evidence: eye white entirely obscured while protruding pupil still visible, so full opaque blink needs *independent pupil* occlusion validation. Do not call full closure PASS from white-pixel count alone.
- Protect approved per-character eye profiles / FaceHost / source-eye cleanup; no second 3D eye runtime; KFB_NATIVE / WIREFACE_* mutually exclusive full-face owners per V-228.

## Claude Design bounded assignment · AFTER TRANSCRIPT GATE
Outcome: one intact, visually convincing compact upper+lower Claymation eyelid system on one exact KFB EyeRig-v6 donor eye, in isolation. The surface MUST remain clean in every view and every animated closure state. Do not start on FrizzleBob, an entire face or a general UI.

**Design build sequence**:
1. Display original donor `clay-lid.v1.mjs` and `upper-lid-volume.v1.mjs` as actual visible 3D geometry, independently in front / 3⁄4 / side / back, wireframe overlay. Identify which source construction (if any) is worth preserving; preserve donor IDs and code unchanged.
2. Show failed `thin-clay-lid.v1.mjs` in isolation as negative evidence. Specifically inspect upper/rear surface, silhouette, polygon windings, pole degeneracies, continuity of lat/lon ring order, thickness taper and side/canthus closure. Edge-manifold count alone is not proof against self-intersection or bad normals.
3. Construct from ONE measured eyeball sphere/ellipsoid and ONE shared enclosing closed skin: coherent ring layout / consistent face winding / matched front/back lid topology, duplicate/split into upper/lower according to the shared seam. No free-floating edges, nonmanifold borders, holes, flipped normals, unsmoothed pinching, self-intersections, disconnected side walls, fake tube rims or billboard cutouts.
4. Inner surface tracks measured actual eye ellipsoid at minimal geometric clearance (no z fighting and no visually detached gap). Outer clay surface has compact, low-profile thickness, tapered smoothly and consistently toward canthi. The visible slightly rounded lip is *part of the same volume*, while inner eye-facing contact is visually firm.
5. First visually solve neutral eye aperture against original KFB eye proportions, without default tired/skeptical face. Preserve eye placement/size; do NOT alter them to conceal the lid defects. Use spherical eye first, then unequal ellipsoid eyes.
6. Only after clean static geometry, animate matching upper/lower against existing EyeRig closure signals. Compare shared-shell sweep/hybrid and bone/constraint principles from source tutorials; copy only verified useful concepts, not Blender-only mechanics that cannot be exported/used by Three.js.
7. Test open, 25%, 50%, 75%, full closure, reopening; independent L/R expression and gaze without lids rotating with pupil. Pupils/irises must be occluded **even at the most protruding allowed pupil depth**; test side and frog yaw as later compatibility checks after single-eye baseline.
8. Show clean flat clay material in existing KFB palette, identical scale to source host. Material tricks may not hide topology. No outline/tube hacks, no extra browser/stage/UI owner, no replacement KFB style.

**Acceptance evidence**:
- Actual 3D mesh front, 3/4, side, back/upper and cutaway; shaded & wireframe.
- One 0→100→0 blink sequence and an isolation sheet showing neutral/half/full closure.
- Geometric QA: boundary/nonmanifold edges zero; consistent winding and outward normals; no nonzero-area duplicate/self-intersecting faces or severe triangle aspect spikes; seam and poles inspectable; no texture-based occlusion fakery.
- Visual QA: zero tears, spikes, holes, crown pinches, shingle overlaps, visible gap at lid-eye contact; soft exterior / crisp inner silhouette; no pupil leak.
- Source fidelity QA: KFB eye/pupil shape and neutral facial read unchanged.
- Compare real shaded objects, not abstract diagrams or loaded asset URLs.
- Claude Design outputs source cut and 3D evidence plus concise recipient contract to the SAME EyeRig owner. If source/geometry cannot be viewed in real 3D, report BLOCKED; do not claim pass from synthetic illustrations.

## Execution limits / Return
Current operation is RESEARCH/BRIEF PREPARED only; no Claude Design run launched; no tutorial transcripts yet; no new browser tests or new runtime claim.
Store eventual result under the existing PR #159 donor branch; receiving EyeRig-v6 PR #104 adopts only following independent 3D visual PASS and export parity.
Do not merge, change profiles, promote Live, or create Cloudflare Stage.
Exactly one next gate: `EYELID_VIDEO_TRANSCRIPTS_SOURCE_PIN_AND_CLAUDE_DESIGN_INTAKE`.
