# KFB God Mode Workshop · Existing Tool/Capability Census v0.7
2026-10-09 | SOURCE/OWNER INVENTORY · planning only
Owner of this document: KFB AI Game Art Academy / Maker Space (integration concept and tutor presentation ONLY)
Repo/branch: georg-doc/kayfabizarro / planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09
No World or ToolBox runtime writes authorized; all listed paths from current GitHub main unless stated.

## 0. Result

A **single diegetic production workbench** can route to many established tools while retaining each tool's existing runtime/source/truth owner. The target is NOT a monolithic import of all ToolBox HTML into World, NOT a new global JSON schema, NOT a second eye/rig/material editor. World God Mode is the permitted authoring orchestrator/presentation consumer; existing specialist tools continue to own editing semantics and their formats. Academy consumes task/rubric/evidence and ChatterBox NPC presentation.

**Important status distinction:** source-present does not imply site-integrated; live specialist site does not imply shared runtime or persisted cross-site config, and Site surface registry is a dated routing statement, not a new browser QA in this slice. Some older documents list superseded Cloudflare routes; current canonical Site inventory wins.

## 1. Capability / source / status / MakerSpace opportunity

| Capability | Current sources / owner | Observed source or Site state | Existing reuse operation / boundary |
|---|---|---|---|
| ToolBox front door | `tools/KFB-ToolBox/START_HERE.md`; `TOOLBOX_MANIFEST.json` | Exactly one canonical specialist router required; its current Site URL still unresolved. Old Stage/standalones history, not live router | World MakerSpace should surface links/actions into existing specialist tools, not become an alternate ToolBox owner |
| Asset search/intake/provenance | `tools/asset_registry/librarian/` | `https://kfb-asset-librarian.frizzlebob.chatgpt.site/` current canonical Site per dated registry | Search approved model/clip/texture; pin exact source & license; validated artifact handoff. Do not write inventory or publish new media from arbitrary catalog results |
| FrankenStein face/actor/look | `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/` and `tools/KFB-ToolBox/kfb-rigs-embed-v3/` | `https://kfb-frankenstein-composer.frizzlebob.chatgpt.site` current source-first specialist Site. Legacy v16/standalone v17 source is **not** proof current Composer fully implements every v17 feature | Host/body graft, face zones, material zones, head/eye/part rig, pose. Save the **existing kfb.pets/1 actor config** plus provenance, not an invented replacement format |
| EyeRig workbench | `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`; EyeRig batch | `https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/` current specialist Site. Source EyeRig v6; `kfb.eye-profile/0.1-candidate` and `kfb.eye-rig.protocol/1` coexist | Eye size, gaze, pupils, lids, blink; per rig-family compatibility and source-eye geometry cleanup. Preserve current profile schema, not duplicate eye solver |
| Head zones | `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/frizzlegraft-v1/headzones.v1.js` blob `f373c5e3f4685e66d1787d2ab6e34da1b27b2217` | **Actual source exists:** `kfb.headzones/0.1`; skull, face, sclera, pupil, lid, nose, brow, moustache. Six of eight point at existing actor/rig fields, two represent eye colors; values rebuild-aware | COLOR / PARAMETER change on measured original head/eye geometry. Not automatically universal geometry replacement |
| Grafted nose/brows | `tools/KFB-ToolBox/kfb-rigs-embed-v3/lab-v6/facegraft.v1.js` blob `5b5015c3df9bb9867e22b9511e88e926bba382fd` | Real `kfb.nosegraft/1` and `kfb.browgraft/1`, measured CapsuleCarl source, EyeRig.eyeFrame anchor, source geometry graft | First genuine **alchemical swap candidate**: source-donor nose/brow graft onto an approved host; source-specific host measures, fit, clipping, motion and undo must be proved, not universal swap yet |
| Donor-eye cleanup | `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/frizzlegraft-v1/donoreyes.v1.js` blob `b0b46bdca058e0feb3dbe18b7067b3d30e625395` | Original overlapping donor eye shells measured and hidden non-destructively; restore exists | Required before installing replacement EyeRig; no destructive deletion |
| Material/skin palette | `.../frizzlegraft-v1/matzones.v1.js` blob `a62f7a1ac5d6f977122a9caaf2789febe0ae8015`, Surface/Material Lab owners | Real `kfb.matzones/0.1`: original atlas zones, finish presets (fabric, matte, leather, lacquer, metal) and UV masks on measured host, not generic tint | Skin/jacket/shoes material variant, source geometry unchanged. KFB Clay Surface remains independent canonical material truth |
| Mouth/face expression | `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v3/pet-mouth.v1.js`; brow/moustache/pose modules | Source located; NOT yet verified that arbitrary mouth graft onto current Player v5b is accepted or exportable | Candidate expressive accessory/mouth function, with host/skinning/viseme and render proof gate. **Do not promise arbitrary mouth swaps now** |
| Legacy Rigging Lab v1 | `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`, Studio v17 source; `tools/KFB-ToolBox/docs/CONTRACTS.md` | Standalone known / historic source, QA not generally promoted to current Site; Actor/Face/Pose configs separate from World | Attachments, anchor calibration and host-rig fits; consume by source-verified module/config contract, not iframe or copy of editor |
| Motion/Animation Lab | `skills/chat/tool-nodes/animation-lab.md`; legacy Animation Lab v2 standalone; `tools/asset_registry/librarian/animation-sources.js` | Node `UNVERIFIED`, legacy Lab v2 WIP; separate KayKit Motion Lab v1 historical browser evidence but does NOT make Lab v2 current Site | Preview source-backed rig-family clips, retarget only after measured compatibility and persistence receipt. Distinct motion owner |
| 2D Animation / Face Modifier | `tools/2D Animation Studio/`; `tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md` | 2D/3D semantic EyeRig protocol and modifiers; not geometry-sharing. 2D studio owns native 2D art | Shared blink/gaze/emote vocabulary; 2D facial decorations may inform 3D accessory *recipe*, not auto-convert geometry |
| KFB Material/Clay/Shader | Existing K1/K2 canonical Surface/Material family, research on `planning/hybrid-baked-clay-texture-architecture-2026-10-07` | Shader inspector/TSL donor research static; K1 Golden and K2 owner protected | Inspect/tune a **clone** of current asset, save material recipe receipt, do not overwrite World material globals |
| Audio / ChatterBox / Voice | `https://kfb-audio.frizzlebob.chatgpt.site`; ChatterBox Studio/Voice Layer branch | Audio productive Site; ChatterBox/Comic VFX specialist routing prepared, voice acceptance separately planned after world A/B | FrizzleBob tutor voice/bubbles consume existing Audio and dialogue owners, no new AudioContext or LLM speech runtime |
| HyperNormalisation/MediaSurface | `https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site`; existing KFB Billboard/MediaSurface/Quote owner | Curator has private Site; Billboard runtime receiver remains source-isolation gated | Show Cards/video/tutorial/RTT lesson on approved receiver, no new Player/iframe owner; quote provenance retains curator owner |
| World God Mode / editor | `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` | One canvas/input router, Object Edit, SCENE_COMPOSE, Stage candidate, typed actions architecture. World R4 **STOPPED / NO MVP** | Later the *same actual World in-place editor* can host Maker actions with permission presets. Do not claim current playable God Mode integration |
| Backpack, Fluff HUD | `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js`, `kfb-backpack.js` | Source prototype has `setFluff`, `addFluff`, 20-slot overlay; separate miniature WebGL renderer, not World-accepted inventory or economy | Validated item REF after owner-approved packaging. No automatic Fluff crafting currency until old Fluff=HP vs new 6-color resource is reconciled |
| 3D interactive lessons | `travel/KFB Travel Combat v25/terrain-v25/academy-lessons.js` / `academy-live.js` | Three real runnable source examples incl. Drag and dynamic instancing, one existing host RTT; 30 curriculum topics not 30 runnable examples | God Mode operations become missions with Feynman Explain→Modify→Build→Show, no second renderer |

## 2. Site identity vs integration truth

Canonical specialist links per current GitHub Site registry:
- [EyeRig Workbench](https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/)
- [FrankenStein Composer](https://kfb-frankenstein-composer.frizzlebob.chatgpt.site)
- [Asset Librarian](https://kfb-asset-librarian.frizzlebob.chatgpt.site/)
- [Audio](https://kfb-audio.frizzlebob.chatgpt.site)
- [Hypernormalisation Curator](https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site)

ToolBox router has no verified canonical Site URL in current registry. Old `https://kayfabizarro.pages.dev/asset-librarian/` in `skills/chat/tool-nodes/asset-librarian.md` is historical relative to current Site-first canonical route. Do not make an Academy second portal/front door; in-world signage is a **consumer**, not new ToolBox source owner.

## 3. Real first integration seam

**MVP candidate:** `Character Alchemy: Change Face → Restore and Reapply`

Start with ONE exact host actor source and ONE current donor face/nose/eye profile. Prove original host + donor in isolation first. `headzones.v1` permits safe color/parameter changes. `facegraft.v1` contains real measured nose/brow graft, but host/rig compatibility remains per-source. Mouth selection/viseme requires separate source compatibility evidence.

Flow:
1. SELECT approved player/resident *clone* from Registry; record actor ID, rig family, source commit/blob, current `kfb.pets/1` config ref.
2. Save baseline: source pose, material/eye/head states, source-specific constraints, last known-good profile. Isolate actual donor/source before graft.
3. CHOOSE exactly one operation: change an eye/head color OR measured donor nose/brow graft OR compatible face part. First functional proof should use one simpler operation rather than all three.
4. PREVIEW (sandbox clone) → check camera front/3-quarter/side, eyes not doubled, no face clipping, lip/eye/idle compatibility if used.
5. SAVE **existing format** plus small typed `ActorVariantReceipt` sidecar/provenance metadata (conceptual, not replacing schema). Version actor-specific `baseActorRef`, donor part source, op, exact params, before/after refs, owner/status, date, validation and missing tests.
6. CLOSE/REOPEN and LOAD exact saved variant: verify source identity, applied head/eye/pose/material, no unrelated actor/global default changed, restore original baseline with one click.
7. Only after this roundtrip PASS, propose *owner-approved* Apply-to-Resident and packaging for Player/Backpack and optional Feynman teach-back lesson. No unsafe silent global mutation or immediate savegame item.

First acceptance MUST show an unchanged original actor and donor geometry separately **before** combining them. A valid JSON export alone is not a visual effect.

## 4. Fundamental integration pattern

`MakerSpace Station → Capability Catalog entry (existing owner) → owner tool invocation / approved preview adapter → existing source-specific config + provenance receipt → validate/readback → approved World/Resident/Asset consumer`.

This is a **routing and transaction seam**, not a single new tool runtime. Every capability record should identify:
`capabilityId, authoritativeOwner, sourceRef, sourcePin, existingConfigSchema, actorRigScope, invocationMode(current Site/authoring/local adapter), permittedActorRefs, evidenceMethod, exportImportContract, sourceLicense, reversibility, consumerTargets, acceptanceStatus, limitations`.

The station may show the current owner Site in a focused view with safe return; cross-origin iframe/DOM restrictions and authenticated private config state are not magically bypassed. Until an API or artifact handoff is verified, a deep link plus explicit import/export remains the honest fallback. No silent cross-Site sharing; no automatic browser clipboard/file persistence claims.

## 5. Named unresolved gates

- Existing specialist Site availability and exact application version should be browser-confirmed before claiming end-to-end composition.
- Historical ToolBox standalones include bundled modules and legacy `kfb.pets/1` JSON; verify exact current Composer source/module compatibility, not speculative cross-app APIs.
- Character source pin FrizzleBob v5/v5b still requires reconciliation. Player source is distinct from Resident runtime owner.
- Stopped World R4 cannot become the active Maker Space game host. Visual/contract proof can proceed isolated, not World R5.
- No new schema migration, no new global JSON config store, no second runtime renderer, no unapproved Live changes.
- One next gate remains `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`; character-alchemy source proof is now a recommended **functional Donor B alternative** to external particle effects because it tests existing KFB tool reuse and the user priority directly.

## 6. Next actor

**Webchat:** persist census and recovery, prepare bounded concrete proof plan and source paths.
**Claude Design (preferred single visual proof executor, not started):** isolate exact original actor and face donor + existing KFB tool, then show one before/after/reload visual proof alongside original Drag RTT and current Billboard. No new generic “forge” art invented.
**Claude Code / ChatGPT Work (conditional single sequential technical executor):** only when an exact source-run, JSON roundtrip, import/export or browser test cannot be done inside Claude Design.
**Georg:** may choose interesting actor/eye/nose props in Asset Librarian, but is not required for technical progress; actual product approval only after visible evidence.
