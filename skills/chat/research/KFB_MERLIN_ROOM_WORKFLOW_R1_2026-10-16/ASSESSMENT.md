# KFB research R1 — Merlin spaceship-room portfolio, in-world computer, Blender/Three workflow

Date: 2026-10-16
Mode: RESEARCH / SOURCE-ROUTING NOTE only
Owner: KFB Chat Production / Town & motion research (NOT a new world/OS/runtime owner)
Repo: georg-doc/kayfabizarro
Branch: research/kfb-merlin-spaceship-workflow-r1-2026-10-16
Status: WATCH / OPTIONAL BOUNDED DEMONSTRATION / NO INTEGRATION AUTHORIZED

## Original source provenance — important separation

This is **NOT** the Dany's Video / VHS-room KTX2 compression author/case.
- Separate Reddit post, source text verified: https://www.reddit.com/r/threejs/comments/1x7f3k7/i_made_my_portfolio_a_3d_room_on_a_spaceship/
- Creator: u/urquhartdesign.
- Reddit author's claim: created in approximately two weeks; sit at a desk in a 3D spaceship and interact with a computer to browse a portfolio; Milo robot, gravity switch, and an ominous button; assets modelled in Blender, designed in Figma, rendered/implemented using three.js with AI-assisted coding (ChatGPT and Claude); desktop-only.
- Author points to **How it's made** on the in-world computer or https://www.urquhart.design/os/work/merlin.
- **Access limitation:** Direct Merlin /os/work/merlin page repeatedly returned unavailable/DisabledError with the available web fetcher on 2026-10-16; browser interaction with exact product and article NOT verified. The site's accessible home/about is unrelated portfolio content and must NOT be substituted for the missing article. The detailed workflow, precise libraries, code, meshes, animation, gravity implementation, in-world OS implementation, performance numbers and license are **UNKNOWN**.
- The author's Reddit description is primary testimony for architecture at broad outline level, not independently verified implementation evidence. Do not claim screenshots or source isolation.

## Why this has KFB value

The user-facing pattern, **a real tool accessible as an object inside an interactive 3D environment**, is already explicitly decided in KFB Town:
- `skills/chat/town/LIVING_KFB_TOWN.md`, J-04: embody usable search, lists and LLM chat as 3D-world phones/dice/boards; the original world is a *town on a craft table*, NOT a standalone room.
- J-05: direct URL/deck deep-link must remain for returning visitors.
- §08: search-indexable, non-WebGL document/deck layer retained; the world is not the only readable layer.
- §10 explicitly records a cassette/CRT portfolio reference as an original trigger and then the deliberate rejection of a "room instead of town". Merlin is a useful new implementation inspiration, NOT permission to revert those decisions or copy a room aesthetic.

Existing relevant KFB owners/systems:
- Current 3D world owner under Open World #360 / receiving WB2 PR #348, strict single camera/motion/world and source-donor rules.
- Current KFB Clay presentation canonical `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`, K1/H0 visual Golden vs K2/v10 technical baseline; original source assets and Clay presentation keep authority.
- Existing KFB Billboard media/scheduler (B1/B2a) and KFB 2D Animation Studio; reuse their visual/media systems. No shadow 'computer screen renderer' or parallel scheduler.
- Existing motion/sequence semantics: `skills/kfb-cartoon-animation/references/75-vfx-audio-camera-comic-motion.md`; separate comic beat timing/camera/vfx authority from navigation physics and content routing.
- Theatre Curtain Core v1/v2 already provides a reused transition donor with single-host ownership; do not copy Merlin transition mechanics over it.

## Applicability / design routing

1) **Blender → Three.js scene handoff**: strong as a reference workflow. In a future authorized owner slice, isolate exact KFB original GLB/source meshes and inspect pivots, named nodes, animation clips, materials, texture formats, transforms and interactive hit volumes. Keep editable Blender source and deterministic exported GLB metadata. Verify source object isolated before integrating it; no asset URL-only claims. No architectural change just because another portfolio site used Blender.
2) **Diegetic computer / in-world UI**: high KFB concept fit. Possibilities: a Town study desk, world computer, kiosk, billboard or mounted display reveals existing Deck Browser, PDF/card reader, Almanac or Writer's Room in the world. Technical choices for later evidence:
   - focus/camera/pointer raycast to screen mesh; map hit UVs to declared input surface;
   - maintain an existing HTML/DOM accessible UI in a focus/overlay mode (often better for text entry, keyboards, iOS accessibility), with a 3D screen preview as representation;
   - CanvasTexture or render-to-texture for a genuine in-world dynamic screen only if frame/bandwidth and focus life-cycle prove worthwhile;
   - clear transitions `explore -> approach -> focus -> interact -> exit -> explore`, single authoritative scene/camera/input; restore prior focus and world state; deep-link bypass and non-WebGL accessible access.
   - Do NOT claim any of those techniques is Merlin's actual implementation; they are KFB proposals.
3) **Gravity switch**: an attention-grabbing mechanic, but secondary to KFB output. If adopted, existing movement/physics owner must decide whether gravity changes physically (one authoritative gravity/up vector, collision/contact, camera stabilization) or is merely a non-gameplay visual theatrical roll/scene illusion (an isolated bounded transition). Do not allow independent Three camera or fake gameplay state in a viewer.
4) **Small details**: strongest production discipline is a controlled hero-room with authored set dressing, not many scattered high-texture props or generic assets. The source claims overkill; does NOT quantify benefits or memory. Existing KTX2 research PR #410 is separate and relevant only where many distinct textures are resident on GPU.
5) **Comic motion / Remotion**: for a deterministic authored slice, reuse Blender scene/camera and Three/React Three Fiber only if 3D parallax and deep scenes add expressive value. Use one timeline beat/frame authority and synchronize screen content, text, ink VFX, sound and camera by authored cues. Normal Remotion HTML/SVG/Canvas/video has no reason to require KTX2 or a real interactive OS. Preserve real KFB 2D/2.5D rig and readable typography.

## Technical pitfalls / acceptance boundaries

- Desktop-only source experience cannot serve as KFB mobile/touch acceptance evidence.
- In-world displays need credible keyboard/pointer focus, escape/return, accessible fallbacks, text legibility, correct screen coordinate mapping and pointer event routing. Avoid duplicating CSS/DOM apps inside a texture surface without keyboard/ARIA.
- Dynamic HTML canvas/video textures refresh frequently and are not the same as static KTX2 geometry textures; don't promise GPU compression for live UI.
- Texture count and materials are not the only perf costs; report geometry, draw calls, shading, skinning, WebGL contexts, upload/copy, GPU RAM, interaction and iOS fallback when test exists.
- No use of proprietary meshes, code, designs, character branding or direct port of external portfolio without permission. Research as design/interaction pattern only.
- Source article not read. No speculative reconstruction of its internal gravity physics or UI architecture.
- WorldBuilder/Travel/Race camera/physics owners and Hub/Site policy unchanged. No new formal Cloudflare Stage, no live claim.

## Candidate smallest independent future proof — no work started

Only if WS0 / Georg prioritizes it over current active product gates:
- Receiving owner: current KFB Town / existing Billboard or ToolBox viewer host, decided from live project SSOT at that time; NEVER a second WorldBuilder/interaction engine.
- One isolated current-source KFB desk/computer/monitor model (verify source object visibly), one current, already-functional KFB Deck or PDF viewer (no fake content).
- Show the same content in standard accessible 2D and through the existing world's one monitor/focus adapter; exact link and exit state preserved.
- Proof in local browser on desktop and touch-width: click/focus/escape/return, typing/scrolling, deep-link, no stale media scheduler, scene/camera/input ownership, screenshots incl. source isolation, memory/load budget.
- Comparison should prove that spatial presentation adds value without reducing basic utility. If not, retain the functional viewer and archive the 3D interaction.
- **Exactly one next gate:** source-exact, *non-production* in-world monitor + existing viewer interaction/focus proof, only when current receiving owner authorizes. No gravity mechanic in this gate.

## Explicit current result

RESEARCH_ONLY: no source assets copied, no Merlin build article read, no browser scene operated, no source donor screenshot, no code implementation, no tests, no installation, no Stage/Site/Live, no current owner changes. Keep source as a reference in GitHub for later.
