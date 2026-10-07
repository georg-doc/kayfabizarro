# SOURCE_AUDIT · KFB Theatre Curtain Recovery · Issue #372 · 2026-10-07

Executor: Claude Design · mode BOUNDED_SLICE · read at 2026-10-07T03:01Z from `georg-doc/kayfabizarro@main` (tree resolved as `6efd7c807eaf`; commit sha not separately verified).

## Read-first chain (all read in full)
1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. skills/chat/CLAUDE_DESIGN_THEATRE_CURTAIN_RECOVERY_PRODUCTIZATION_2026-10-07.md (binding brief)
5. skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md
6. …/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/docs/HANDOVER_WSA_THEATRE_CURTAIN_2026-09-24.md
7. …/docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md
8. tools/KFB-ToolBox/_handover/BILLBOARD_CURTAIN_NEXT_2026-09-24.md
9. skills/chat/recovery/CLAUDE_COWORKER_BRIEFING_AUDIT_2026-09-15/FAILURE_TIMELINE.md
10. skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md
11. …/CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md

## Source roles (Style Router §D)
| Source | Role |
|---|---|
| `KFB Theatre Curtain v2.html` | BINDING physical/visual donor |
| three.js `webgpu_compute_cloth.html` @ 7300402f | upstream of the donor (HISTORICAL, not re-imported) |
| old-theatre reference webp | BENCHMARK / visual direction, not a template |
| v1 `KFB Theatre Curtain.dc.html` + `kfb-theatre-curtain.mjs` | HISTORICAL · rejected implementation (lessons only, not opened as code donor) |
| Golden Journey Beat 0, Curtain Character Select | semantic intent only; plaque/sign execution = NEGATIVE evidence |
| FrizzleBob v5b, Black Knight, Combat Mech GLBs | host content for compositions (not Curtain Core) |

## Exact pins
| Path | Blob | Bytes | Check |
|---|---|---|---|
| tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/KFB Theatre Curtain v2.html | db96d54bd7618587d9f15db02a142701e0e38afc | 15507 | git-blob SHA-1 recomputed on the project copy = match |
| tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/CURATIN-THREE-js - old-stage-red-curtains-wooden-architecture-dilapidated-velvet-set-aged-ornate-stone-architectural-frame-387640660.webp | 068887825acd85d78bf27d7fdbf89066518670ec | 72160 | git-blob SHA-1 recomputed = match (= brief) |
| …/Three.js Donor - webgpu_compute_cloth.html | 00945a9e7a67… | 17628 | tree listing |
| …/KFB Theatre Curtain.dc.html (v1) | 8870da983918… | 6998 | tree listing |
| …/screenshots/v2-closed.png | f26631769fbf… | 14765 | viewed; matches donor-01 |
| …/screenshots/postmortem-donor-webgpu-clean.png | 6a7d9c05ca71… | 28995 | tree listing |
| …/screenshots/postmortem-kfb-cpu-verlet-final-state.png | 1221c98883ca… | 32558 | tree listing |

Host-content pins (loaded at runtime via jsDelivr, not copied):
- FrizzleBob v5b: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb` @ `93abbf22d14335e517cac75cc79bf2022af45ee3` (J17 pin, branch georg-doc-patch-3). The path does not exist on main. SOURCE_PIN_RECONCILE (23615cff vs 93abbf22) remains open.
- Black Knight: `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb` @ `2c92dd13cbc379ad3a6028144b8976bb3d6a840d`
- Combat Mech fallback: `…/1 - July 2024 - Combat Mech/characters/CombatMech.glb` @ `2c92dd13`
- Idle clips: `KayKit_Character_Animations_1.1/…/Rig_Medium_General.glb` and `Rig_Large_General.glb` @ `b97b5ac5`. Clip binding is optional in the demo and was **not verified** (actors may show bind pose).
- Environment: `royal_esplanade_2k.hdr.jpg` from threejs.org, the same file the donor uses.

## Donor isolation method
`donor-probe.html` loads a byte copy of the donor (`donor/KFB Theatre Curtain v2.html.txt`; the preview host wraps served .html, so the copy is fetched as .txt and blob-verified on disk) into an iframe. It adds **one external probe module before the donor module** and changes no donor line:
- `THREE.Timer.prototype.getDelta` → fixed 1/60 (sandbox iframes report `document.hidden`, the donor timer then returns 0; documented in the donor handover);
- `setAnimationLoop` callback captured → frames stepped deterministically;
- after `render` the WebGPU canvas is copied to a 2D mirror so DOM screenshots can read it.
Controls used: the donor's own OPEN/CLOSE buttons.

## Texture search (brief §7)
Existing repo curtain/fabric texture = the v1 KFB fabric set, which is the documented cause of the stripe/flicker artifact. Router corpus contains no velvet texture with recorded licence. Reference image is a stock photo (watermarked) → never a texture source. **Decision: no texture imported.** External texture sourcing stays optional follow-up.
