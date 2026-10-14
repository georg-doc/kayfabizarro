# Claude Design · KFB Clay Eyelids — mesh recovery & tutorial evidence
Date: 2026-10-14
Status: VIDEO TRANSCRIPTS 2/2 ANALYZED · CLAUDE DESIGN INTAKE READY · NO MESH PASS
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

## Source-critical YouTube analysis · BOTH TRANSCRIPTS RECEIVED / VIDEO FRAMES NOT INSPECTED

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

### Video B · Raymond Gabriel / RG3D Animation Studio · DIRECT USER-UPLOADED TIMECODED TRANSCRIPT

**Source:** https://www.youtube.com/watch?v=hTl825DO-Aw · "How to make cartoon oval eyes rigging in Blender 2.8+".
**Provenance:** Georg's attachment `Eingefügter Text(5).txt`, text transcript with timestamps from 0:00 through 18:02. Uploaded transcript was inspected, not the video frames. The separately pasted **non-timecoded "Rigging the Eye" Step 1...** message repeats Video A/Jen Abbott's steps and is not used as evidence for RG3D/Video B. Captions' manual/automatic origin unconfirmed. Transcription contains evident recognition errors (e.g. "I K", "corneal", "eick"; contextual interpretations noted below).

| Video time | Transcript-grounded operation | Implication for KFB / qualification |
|---|---|---|
| 0:18–1:41 | Download eye-image JPG; add alpha channel in GIMP/Photoshop; remove white with fuzzy selection; save PNG | Optional *texture-eye* donor, not required for existing KFB mesh pupils |
| 1:47–2:40 | Create UV sphere, rotate about X 90°, front orthographic UV editor, **Project from View** | Iris image placement aligned to a specific view; not a lid-building technique |
| 2:45–6:03 | Image Texture material, UV scale; change image extension Repeat → Clip; mix image and white shader using alpha | Avoid unintended iris texture repetition; **not** physical eye occlusion |
| 6:09–7:32 | Armature with visually accessible bone; duplicate nested local bone in Edit Mode and parent it to outer bone | Separate eye/region controls; exact bone orientations must be inspected in Blender before copying |
| 7:40–8:29 | Edit eyeball in side view; flatten selected front-area vertices along Y then move them backward; smaller bone controls **cornea region**, outer bone controls eyeball motion | Cornea is a weighted *region of the eyeball mesh*, not proof of a separate lid object |
| 8:36–11:16 | Rename local bones (ASR makes names uncertain), disable deform on target controller; create armature weights, then assign one region exclusively to outer-eye vs cornea bone | Eye movement and local cornea shaping have distinct vertex-group ownership. This is transferable *semantics*, not the existing KFB rig's literal vertex groups |
| 11:21–12:46 | Pose constraints: outer eye bone targets master via **Inverse Kinematics**; cornea follows controller via **Copy Scale**, with Y scaling locked | Control localized cornea scale while eye is steered; verify constraints and exported behavior before reuse |
| 12:52–15:46 | Shift/mirror to create L/R eyes, symmetrize bones, rename duplicated eye vertex groups so each follows its correct side, parent both to main eye control | Crucial parity/regression check: L/R bone names and vertex-group IDs must not cross-drive the wrong eye |
| **15:46–17:38** | Demonstrates direct Z-scaling of eyeballs, warns about undesirable protrusion/animation; **adds Lattice modifier**, surrounds full eye, edits lattice to ovalize in X/Y, copies modifier to other eye. Rig moves while the shaped eye follows | **Core design donor for KFB ellipsoid/oval adaptation.** The transcript demonstrates lattice applied to eyeballs, **NOT to eyelids**; keeping lids conformal with the same deformation is a KFB hypothesis requiring separate 3D proof |

**Critical source boundary:** Video B contains **no construction, weighting or closing of upper/lower eyelid meshes**. Its title "oval eye rigging" does not imply Claymation eyelid topology. It does NOT establish that simply adding a Blender lattice to existing Three.js/KFB lids preserves manifold topology, canthal contact, normals, or pupil occlusion. Blender's active lattice, constraints and IK cannot be assumed to survive GLB export as runtime behavior.

**KFB design inference (UNPROVEN until source-isolated, editable 3D evidence):** Start from an accepted watertight *spherical* eye + two-lid shared source volume. Adapt sphere AND both lid meshes together through **one equivalent eye-local deformation frame** to ellipsoid/oval, or generate all three from the same ellipsoid parametric surface. Consider a Blender lattice as authoring-reference for this common deformation, with baked editable/exported meshes or an explicit existing-owner Three.js deformation adapter, rather than a second live rig. The lid thickness, seam, canthi, pupil depth and blink must be revalidated after deformation. Do not change existing approved EyeRig-v6 profiles.

**Video B evidence status:** `TRANSCRIPT_RECEIVED_TIMECODED`, model/rig procedure **source-grounded**, visual Blender step confirmation **not run**. Blender UI axes and bone names are transcript-derived with ASR uncertainty.

### Comparative evidence verdict — both video transcript sources now accounted for

- **Video A (Jen Abbott):** already-modelled eye + upper/lower lids, gaze Track To (-Y / Z), X-axis Copy Rotation, lower Invert X, shared & per-eye master controls, blink frames 1/25/35/45. **Transferable:** conceptual controller graph. **Not shown:** mesh construction, bevel and lid contact.
- **Video B (Raymond Gabriel):** textured UV-sphere, local cornea region under separate vertex-group weights, IK / Copy Scale controls, mirrored L/R, **Lattice for oval eyeballs**. **Transferable:** region-specific deformation and oval-eye authoring principle. **Not shown:** eyelid geometry or closure.
- **KFB itself must solve:** connected and correctly oriented closed-shell topology; non-self-intersecting smooth outer crown; small integrated rounded margin and direct crisp occlusion boundary; measured sphere/ellipsoid auto-fit; full closing including projecting pupils; expressive neutral rest. **Neither tutorial is evidence of this part.**
- Keep **no speculative bone/controller stack** beyond the existing EyeRig v6, and do not make the tutorial texture/Cornea/Lattice elements mandatory KFB features.

**Transcript gate outcome:** `TUTORIAL_TRANSCRIPTS_RECEIVED_2_OF_2`. Detailed timecoded *source text* is available for both; original Blender file and direct video-frame inspection are optional separate provenance checks, not prerequisites for beginning a bounded real 3D source-isolated clay-lid geometry design. Distinguish text-proven operations from inferred fixes throughout.

## Preserved KFB source contracts / candidates
- KFB Eye Actor Studio Geometry Contract: `skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md`, blob `9617ab624ad55b8e298eb6c9a0c0efb773270c5c`. Binding sections 3/5/6/15/16.
- Existing donor original `tools/KFB-ToolBox/eye-actor-studio-v1/clay-lid.v1.mjs`, blob `30201095b2f686ba3a78b8512e7cee37d07e30b7`, independently show whole eye and lid BEFORE adaptation.
- Existing alternative `tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs`, blob `f2ac451aa5252acd6d3e072547441bbd379e8c01`, independently isolate actual geometric source.
- Existing animation donor `clay-lids.v1.js` inside the September/October ToolBox Claude Design source cut (hinge / slide, rounded lip, shared canthi).
- Existing Lid Motion Lab already compares Slide / Sweep / Hybrid (historical reported 34/34 browser checks); not approved as final aesthetics.
- Later WS1 F1 evidence: eye white entirely obscured while protruding pupil still visible, so full opaque blink needs *independent pupil* occlusion validation. Do not call full closure PASS from white-pixel count alone.
- Protect approved per-character eye profiles / FaceHost / source-eye cleanup; no second 3D eye runtime; KFB_NATIVE / WIREFACE_* mutually exclusive full-face owners per V-228.

## Claude Design bounded assignment · READY FOR SOURCE-ISOLATED MESH DESIGN
Outcome: one intact, visually convincing compact upper+lower Claymation eyelid system on one exact KFB EyeRig-v6 donor eye, in isolation. The surface MUST remain clean in every view and every animated closure state. Do not start on FrizzleBob, an entire face or a general UI.

**Design build sequence**:
1. Display original donor `clay-lid.v1.mjs` and `upper-lid-volume.v1.mjs` as actual visible 3D geometry, independently in front / 3⁄4 / side / back, wireframe overlay. Identify which source construction (if any) is worth preserving; preserve donor IDs and code unchanged.
2. Show failed `thin-clay-lid.v1.mjs` in isolation as negative evidence. Specifically inspect upper/rear surface, silhouette, polygon windings, pole degeneracies, continuity of lat/lon ring order, thickness taper and side/canthus closure. Edge-manifold count alone is not proof against self-intersection or bad normals.
3. Construct from ONE measured eyeball sphere and ONE shared enclosing closed skin: coherent ring layout / consistent face winding / matched front/back lid topology, duplicate/split into upper/lower according to the shared seam. No free-floating edges, nonmanifold borders, holes, flipped normals, unsmoothed pinching, self-intersections, disconnected side walls, fake tube rims or billboard cutouts.
4. Inner surface tracks measured actual eye ellipsoid at minimal geometric clearance (no z fighting and no visually detached gap). Outer clay surface has compact, low-profile thickness, tapered smoothly and consistently toward canthi. The visible slightly rounded lip is *part of the same volume*, while inner eye-facing contact is visually firm.
5. First visually solve neutral eye aperture against original KFB eye proportions, without default tired/skeptical face. Preserve eye placement/size; do NOT alter them to conceal the lid defects. Use spherical eye FIRST. Only after true topology/shape PASS, examine Video B's Lattice as an authoring donor to produce the *same* eye/lid pair in oval form by a common deformation frame or by rebuilding all parts from one measured ellipsoid. Recheck normals/contact/pupil depth after warp; never deform just the eyeball and leave the lid behind.
6. Only after clean static geometry, animate matching upper/lower against existing EyeRig-v6 closure signals. Video A's Copy Rotation + Invert X is controller-logic inspiration (not an exportable dependency); Video B's IK/Copy Scale + isolated cornea vertex weighting is optional eye-rig reference, not a second runtime. Compare the existing shared-shell Slide / Sweep / Hybrid donor and preserve the approved EyeRig control API.
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
Current operation is RESEARCH/CLAUDE DESIGN INTAKE READY only; no Claude Design execution launched. Both timecoded video transcripts received from Georg and analyzed. Video-frame/Blender file inspection NOT run; no new mesh, browser test, Stage/Site publication or runtime claim.
Store eventual result under the existing PR #159 donor branch; receiving EyeRig-v6 PR #104 adopts only following independent 3D visual PASS and export parity.
Do not merge, change profiles, promote Live, or create Cloudflare Stage.
Exactly one next gate: `CLAUDE_DESIGN_KFB_EYELID_SOURCE_ISOLATION_AND_CLEAN_MESH_PROOF_01` — actual original-donor 3D isolation and clean spherical Upper/Lower topology first; oval/Lattice adaptation only after static mesh PASS.
