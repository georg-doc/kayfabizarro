# KFB CREATURE_LAB_01 · Surreal Creature SDF + Headless Rig QA

**Status:** BRIEF READY · NOT IMPLEMENTED · NO VISUAL/RUNTIME PASS  
**Date:** 2026-10-12  
**Mode:** BOUNDED_SLICE, isolated offline/source-backed prototype  
**Existing owner:** KFB ToolBox · FrankenStein / Rigging / Animation authoring lane (no separate runtime or brand)  
**Repo:** `georg-doc/kayfabizarro`  
**Planning branch:** `planning/kfb-creature-lab-01-rig-qa-2026-10-12`  
**Intended executor:** Claude Code, once the already-running MasterSelects proof is finished or separately parked; WSA Work only if an actual authenticated browser/Site/integration seam later requires it.  
**Outcome:** Three genuinely generated surreal/fantastic simple 3D creature fixtures, each with an SDF-derived welded mesh, minimal skeleton, procedural material roles and reproducible **headless skinning-quality measurements**. Validate the pipeline, not character lore or World integration.

## Read first — current GitHub state wins

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `tools/KFB-ToolBox/START_HERE.md`, `tools/KFB-ToolBox/docs/CONTRACTS.md`, `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`, current ToolBox Return/Recovery
5. `skills/kfb-cartoon-animation/SKILL.md` and only relevant `references/40-blender-authoring-rig-export.md` / `references/90-validation-debug-evidence.md`
6. `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/RETURN.md` and **current PR #355** to avoid concurrent mutation
7. This brief, `TEST_MATRIX.json`, `RETURN.md`, `CHANGELOG.md`; then exact project/ref/PR head at execution start.

## Owner and protection

- Authoring concepts and later compatibility belong to existing **ToolBox** Studio/Rigging/Animation owners. The separate **FrankenStein Composer PR #355** is active/authorized for its own product; this slice must not write there, replace its editor, or become a second actor/rig system.
- Source-authoritative **KayKit Native Motion**, accepted Medium locomotion set (Motion PR #344), KFB EyeRig v6/FaceHost, Actor formats (`kfb.pets/1`), the Asset Registry/Librarian and KFB Surface/Material Language remain unchanged.
- Existing **Plant Prop Lab / Wobbleflora** and **2D Animation Studio** are optional downstream consumers, not this experiment's owner.
- **WorldBuilder Island R4 remains STOPPED / NO MVP / F-R39 FAIL.** Do not resurrect R4/R5, change World/Resident/Travel/Combat or publish a new game runtime.
- This is permitted **synthetic testing geometry**. Do not present it as replacement KFB canon, a donated source-faithful asset, or a final Resident. Do not import another site's animal model and claim it was procedurally created.

## Three test fixtures · distinct failure targets, not cast canon

| ID | Working name | Anatomy / SDF challenge | Rig + QA focus |
|---|---|---|---|
| CL01-A | **Fassbeiner** (barrel-backed quadruped) | Soft, rounded torso, four stubby legs, tiny eccentric muzzle | Four leg roots; symmetric/left-right weight leakage at leg midline; squat and alternating foot lift |
| CL01-B | **Schleifenschwanz** (ape-like ribbon-tailed oddity) | Round torso, long arms and extended curlable tail | Multi-bone tail bend, arm reach; stretched edges and misweighted tail root |
| CL01-C | **Turmhals** (absurd long-necked hybrid) | Compact torso, narrow very long neck, small head, short limbs | Neck bend/compression, head orientation, twist-induced collapse |

Start with CL01-A only. Add B/C when A can be regenerated and measured reproducibly. Keep silhouette and a small number of clear primitive volume parameters, not anatomical realism; 6–16 export bones as actually needed, no forced arbitrary skeleton.
Optional shader variation: spots/stripes/flat clay-like swatches derived from **named material regions**. Do not substitute a custom shader for the current KFB Surface/Clay owner. No unique per-creature image-generation dependency.

## Functional pipeline

`seed + creature recipe → SDF blend/union → iso-surface meshing (marching cubes or pinned equivalent) → weld/normal/topology audit → deformation skeleton + weighted skin → procedural coat/material roles → named poses → headless evaluated mesh → per-region metrics + GLB/images/report`.

Before writing a new mesher, rig helper or exporter, inventory pinned ToolBox modules, tested Blender/Node libraries and existing SDF/generator donors. Record KEEP/ADAPT/REJECT. Use repository-native test tools; if optional `game-dev` is missing, record it once and continue. May use headless Blender or Node as implementation host after an explicit **source/runtime compatibility choice**; never assume Blender rigs behave identically in glTF/Three.js.

**Isolation:** show geometry alone in 4 fixed views, then rig-only pose overlay, then material pass. Where real KFB modules/donors are used, show their source object alone with provenance before integration. A loaded URL is not donor design evidence. Screenshots are proof only for what they actually show.

## Independent execution

Reference `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`.

- **Builder / only writer:** Claude Code, one worktree/branch, bounded scripts and candidate assets
- **Integration Tester:** deterministic mesh/skin/pose export checks plus local preview screenshots; writes results, not acceptance
- **Independent Critic:** short read-only check of actual source/negative-controls/render evidence, not Builder self-score
- **Production Guard:** CONTINUE / REPAIR / QUARANTINE / HUMAN_DECISION / STOP for the smallest seam; only STOP authority
- **Human gate:** only if a meaningful creature visual/style choice is presented; not required just to accept numeric test metrics.

After two non-improving repairs to the same minor flaw, quarantine smallest seam, export its candidate + evidence, continue other independent fixture work; only Guard-confirmed outcome-critical blockage stops this proof.

## Execution order

1. **Inventory/preflight:** exact branch heads, source modules/rig QA donors, versions, licensing. Select one offline execution path and seed. Confirm no concurrent writer conflict with Composer PR #355.
2. **A mesh proof:** fixed seed, 4-view screenshots, mesh/topology checks, repeatable source regeneration. No cosmetic UI or production editor.
3. **A rig QA proof:** export deformation rig; sample rest, left/right leg lift, squat and stress pose headlessly; compute metrics on actually skinned/evaluated positions; introduce **known-bad leg weights** as negative control and prove localization.
4. **B/C extension:** only after the A gate works. Tail and neck rigs, named poses, second **known-bad tail** negative control. Controlled material-role swatches/patterns optional, no new KFB shader.
5. **Roundtrip:** export to GLB (or native target documented by owner), fresh import, reconstruct rest and sampled pose measurements, compare identities/scale/axes/skeleton and metrics. At least one real rendered post-export screenshot, not just DCC viewport.
6. **Return:** actual pass/fail/unknown counts, source code, 3× neutral/pose captures, seeded recipes, raw per-region QA CSV/JSON, negative-control outcomes, limitations, selected donor reuses and one next gate.

Test contract and discriminating failure criteria live in `TEST_MATRIX.json`. Clearly distinguish test *design* from test *execution*. Never fake measured FPS or source evidence.

## Non-goals

No custom character-catalog UI, Site, public Cloudflare Stage, new motion owner, 3D World integration, full quadruped locomotion, generative-agent batches of dozens of NPCs, speculative lore or automatic promotion to the KFB Asset Registry. Source-only and headless evidence is enough for the first gate. If a formal human public acceptance route is authorized later, use the current project's existing named Site/Hub and only direct Hub-linked `https://kayfabizarro.pages.dev/…` review routes when required.

## Return packet and next action

Write the owning `RETURN.md` plus additive `CHANGELOG.md` only at material phase boundaries. After each GitHub write, fetch the exact branch head and intended file. A timeout is UNKNOWN pending ref inspection, not a reason to duplicate a write. KFB Hub/global router update **not warranted for this research-only briefing**.

Return exact repo/branch/PR/head, source pin, changed files, commands and environment, test count, visual proof, unsolved defects, no merge/live. **One next gate: CL01_A_SOURCE_ISOLATED_MESH_AND_HEADLESS_RIG_QA_PROOF**.
