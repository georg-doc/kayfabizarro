## 2026-10-02 · EyeRig Control R2 · pupil seating + exact values + Orc texture

- PR #104: independent pupils are now re-seated against the deformed eye ellipsoid after gaze updates instead of using a Depth-only offset.
- Stress proof: **3,125/3,125** tested oval/gaze combinations keep the sampled pupil cap outside the sclera; worst `F=1.0397`.
- Controls: Converge **-2…3**, Gaze drift **0…1.5**, flexible ranges auto-expand around direct values; numeric readouts are click-to-edit with Enter/blur commit and Escape cancel.
- Browser persistence remains `kfb.toolbox.eye-rig-batch.v0`; stored profiles are not cleared or silently reset.
- Orc Raider source GLB contains material `orc_texture_A` but no image/texture table. The workbench now applies exact `orc_texture_A.png` blob `2035dea0…` to that named material.
- Focused checks: **15/15 PASS**.
- Stage mirror: `cloudflare-live@7fc4e208cb956a74cfa8ab409f9eed74eb2ef69c`; exact readback PASS, deployment/public visual verification still open.
- Deferred: per-eye L/R authoring, Survivalist one-eye visibility, and separate FrankenStein/Pet Studio click-to-edit parity.

## 2026-10-02 · EyeRig Mystery coverage + pupil-independent oval · final

- PR #104: Eye shape / oval now deforms sclera+lids while pupil scale remains independent; **7/7 behavior PASS**.
- Current catalogs: **55 Medium + 8 Large = 63 visible Batch actors**.
- Monthly physical Mystery coverage remains **49/49 = 41 Medium + 8 Large**.
- Whole historical Mystery source-container GLB inventory: **53/53 classified**; Mummy A/B added as Medium; Santa + CharacterTemplate explicitly classified as 41-joint custom/template sources rather than mislabelled.
- Paladin physical models remain; new visible `paladin-king` authoring actor loads exact palette B (`eb45816a…`) before cleanup/face-color sampling.
- Final focused contract **22/22 PASS**; latest Georg batch maps **33/33 IDs + 33/33 exact paths**.
- Stage mirror: `cloudflare-live@c42e8cbf2e31d39b7ca6d851e0525254c2009664`.
- Human gate: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`; public verification remains open until direct visible check.

## 2026-10-02 · EyeRig · Mystery 49/49 + Oval/Pupil isolation

- Latest Georg batch pinned: `eye-rig-medium.batch (1).json` · blob `0ed0a157…` · 33/33 exact actor/source resolution.
- Fixed shared EyeOval owner: W/H/D now deform sclera + lids **without scaling pupils**; canonical ToolBox and current FrankenStein Studio snapshot are the same repaired blob `9a559f78…`.
- EyeOval behavior proof: **7/7 PASS**; focused source/catalog/adapter proof: **26/26 PASS**.
- Batch catalogs now expose **52 Rig_Medium + 8 Rig_Large** actors.
- Owned monthly Mystery Series 4–7 coverage is **49/49 physical character GLBs** = 41 Medium + 8 Large.
- Added both Paladin model variants. Palette B is pinned as Georg's light/blonde **King** candidate; calibration remains geometry-based.
- Stage mirror: `cloudflare-live@8627efb436bbba9e1fec09aad7598892f9eab4d1`; exact mirror readback PASS, public browser verification remains open.
- Human gate: Oval pupil isolation + Paladins + representative new Mystery Medium/Large actors.

## 2026-10-02 · EyeRig Medium +6 Adventurers / KayKit availability follow-up

- EyeRig PR #104 Medium roster expanded **27 → 33** with all six `KayKit_Adventurers_2.0_FREE` characters: Barbarian, Knight, Mage, Ranger, Rogue, Rogue Hooded.
- Direct GLB inspection: all six = `Rig_Medium`, 23 joints, 0 embedded clips; exact blobs pinned.
- Focused extension evidence: **12/12 PASS**.
- Stage mirror: `cloudflare-live@dac15d6ec55bed733aff5d55adfe438d29cb0ec5` · 33 actors read back.
- Cross-tool finding: Mannequin Medium/Large exist in Asset Registry, but Librarian Town `isAnimationSource()` excludes the entire `kaykit-character-animations-1-1` pack, hiding the character models from the Character lane.
- No duplicate Registry asset should be created. Next gate is an Asset Librarian-owned all-KayKit character availability audit/fix.

## 2026-10-02 · EyeRig Batch · Studio-parity control semantics

- PR #104 / `toolbox/eye-rig-batch-2026-09-18`: repaired a control leak where Eye size/ring also changed eye seating depth.
- Shared EyeRig v6 remains owner; Batch adapter now compensates radius-relative inset so **Eye size changes size only and preserves eye centre**.
- Gaze drift now updates amplitude without rebuilding the rig. Spacing=X, Height=Y, Inset=depth; Splay remains intentional surface-following orientation.
- Studio references read before repair: Pet Studio v12 controls blob `90ec845b`; newer face-mount adapter blob `5424bff3`.
- Evidence: **16/16 focused PASS + 252/252 numeric seat-invariant PASS**, max error `8.88e-16`.
- Stage mirror: `cloudflare-live@0f3fa194746c7eabbf15d590a18532ecb42332c1`; exact source readback PASS, public browser verification still open.
- Human route remains `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`.

# KFB Chat Production Router · additive changelog

## 2026-09-19 · Claude Design failure recovery + export

### DECISION
After two consecutive repair passes without progress on the same explicit gate, stop the repair loop. Preserve the current candidate as `ARCHIVED_FAILED_CANDIDATE` and spend the remaining session on a complete editable export, evidence, post-mortem, salvage map and one smaller next gate.

### CURRENT_REFERENCE
Add `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` as the reusable provider-specific recovery/export template. It requires source, data/state, dependency and asset manifests, actual tests, checksums where possible, known omissions and a paste-ready stop/export request. An export is a recovery result, not implementation or visual acceptance.

### FAILURE REVIEW
Record the reported three Quaternius/Platformer attempts and the current Hex-Baukasten screenshot as a pre-export post-mortem under `workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/`. Viewer/UI/catalog code may be salvageable; current composition and generator rules are not accepted before a measured three-part connection proof.

## 2026-09-19 · Stage → Live and Vehicle Lab v3

### DECISION
Add a simple public Stage playground so browser/mobile review no longer requires replacing Live or
handling GitHub. Stage merge is not Georg acceptance; deliberate promotion moves the Live pointer.

### BRIEFING
Add the bounded Vehicle Lab v3 brief: C0 is the existing OSM driving baseline; C1 adds the
presentation-only vehicle deformer and TinySkies/Travel visual grammar, then one measured
drive-to-flight transition. Runtime physics owners remain unchanged.

History is additive. Earlier statements are not silently rewritten. If a later entry corrects or replaces an earlier one, mark it `SUPERSEDES` and keep both.

## 2026-09-19

### CURRENT_REFERENCE / FRESH CHAT SLICES
Add `FRESH_CHAT_SLICE_PROTOCOL.md` for bounded cold starts, parallel web-chat slices, modules and POCs. It requires current GitHub recovery, one explicit slice, additive changes, actual test evidence and a compact next-day Work review packet. It does not grant a new owner, broad runtime scope, automatic promotion or automatic merge authority.

### HUB ROUTING
Group the human Production Hub into separate KFB and DocCheck tabs. Add current Hürth/Grotesk OSM City Lab and City Drive C1 review pointers plus the shared fresh-chat protocol. Hub todos remain personal browser state and never become project status.

## 2026-09-14

### CURRENT_REFERENCE
Persist `skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md` beside the Town living document. Its source status remains `SOURCE FACT` for the Frankensteining Lab and `PROPOSAL` for Town; Lab `L-nn` references are preserved and no Town `J-` decisions are minted by the reference itself.

### MASTERPLAN ADDENDUM
Add `skills/chat/masterplan/KFB_META_NARRATION_ADDENDUM_2026-09-14.md` as lead assessment of the Lab concept collection. It identifies closure, world-as-toy, embodied state, Triplet relations and build-vs-judge separation as reusable directions while keeping the source's open tensions unresolved.

### META-CANON CONSOLIDATION PROPOSAL
Do not bulk-move duplicated canon files. First create a verified Canon Home Map with proposed home, public surface, duplicate locations and pointer/snapshot/editable status. Only verified touched copies should later become pointers or archived history.

### CURRENT_REFERENCE
Persist WS0 `KFB_META_COMPENDIUM_v1.md` under `skills/chat/meta/` as a cross-module meta index. It is explicitly an index/routing reference, not a new canon or implementation SSOT.

### CURRENT_REFERENCE
Persist `skills/chat/town/LIVING_KFB_TOWN.md` as the current Town-specific living concept with its J-decisions. Add `skills/chat/town/START_HERE.md` as the fresh-chat entry point. Town remains a meta-narrative/world-design reference, not a built runtime.

### MASTERPLAN ADDENDUM
Add `skills/chat/masterplan/KFB_META_TOWN_ADDENDUM_2026-09-14.md` and register it in `REGISTRY.json`. The addendum links Town, meta-canon routing and cross-module reuse without copying the source documents into the main masterplan.

### DRIFT RULE
Version labels, asset counts, old tool statuses and similar operational claims in meta compendia are snapshots. Before operational use, verify the current project/tool SSOT and GitHub state.

### META REUSE RULE
Reuse-before-rebuild applies to concepts as well as code. Before creating a new hub, dialogue, presenter, card-navigation or world-memory system, check whether the idea already has a named home and donor path.

## 2026-09-13

### DECISION
`skills/chat/` becomes the current LLM production routing layer shared by ChatGPT/Astra and Claude Design.

### DECISION
The core production SOP is provider-neutral. Provider-specific behavior belongs only in `adapters/`.

### DECISION
Existing canonical/current skills remain at their canonical paths. `skills/chat/` references them instead of copying them.

### CLASSIFICATION
`skills/KFB Setup Game Design/KFB Design-Bootstrap_v02/` classified `LEGACY_REFERENCE` for current production routing. Its durable rules remain valuable; its project/module/asset state is not assumed current.

### CLASSIFICATION
`skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/` classified `LEGACY_REFERENCE`; FrankenStein Studio v16 is the current actor/look/pose tool reference.

### CURRENT_REFERENCE
`skills/session-design-briefing.md` registered as current design-session reference, version 1.2.

### CURRENT_REFERENCE
`skills/kfb-cartoon-animation_v2.md` registered as animation/motion reference, declared version 2.0 and `canonical-draft` in its own header.

### CURRENT_TOOL
Asset Librarian registered with its repository path and live site.

### CURRENT_PROJECT_SSOT
`georg-doc/KFB-Travel-Globe` registered as Travel implementation SSOT.

### UNVERIFIED
Animation Lab receives a routing node but is not promoted to `CURRENT_TOOL` until its current implementation SSOT and site are explicitly pinned.

### DECISION
Add `LIVING_MASTERPLAN.md`, `RECOVERY_PATH.md` and `SYNC_PROTOCOL.md` so chat/context loss does not require transcript reconstruction and active chats synchronize through GitHub shared state.

### CURRENT_PROJECT_SSOT
`georg-doc/KFB-Combat-Arena` registered as a project node and Combat Web registered as a synced consumer of the central router while Combat remains its own implementation SSOT.

### CORRECTION
The generic game-production workflow does not require Georg Freeplay before every merge. Human acceptance is a gate when look/feel/play or the project contract requires it; merge authority always comes from the current project contract.

### CURRENT_TOOL
FrankenStein Studio v16 node expanded with verified weapon attachment/mod presentation measurement through existing `weapon-mods.v1.js`. Projectile, damage, runtime combat aim and consumer-specific world facing remain outside Studio ownership.

### DECISION
Do not refactor Travel `cardrider.v1` into a generic shared rider-placement schema during an active consumer slice. Preserve the measured current contract; extract a generic additive successor only after real multi-consumer use proves the need.

### DECISION
Add `INBOX_PROTOCOL.md` for shared cross-project intake packages. The initial staging path was `travel/wip/travel_globe_wsa/_inbox/`; its Travel location never conferred Travel ownership and inbox content was never automatically an SSOT.

### UNVERIFIED PROJECT INTAKE
DocCheck Wissens-Pilli / Interactive Microlearning registered as a project intake. Intended destination: `micro-learning/wissens-pilli/`. Current source package: `travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`. The target path exists only as a placeholder and is not yet promoted to a complete implementation SSOT/runtime.

### OWNER BOUNDARY
For Wissens-Pilli, current intake assigns CapsuleCarl actor preparation to FrankenStein Studio; the learner runtime owns cards/scene/interaction, while Animation Lab is a later motion consumer. Shared actor vocabulary does not authorize copying FrizzleBob measurements into CapsuleCarl.

### DECISION
The long-term shared intake moves to a dedicated private repository: `georg-doc/KFB-Production-Inbox`. Repository creation is a one-time provisioning action; after that, authorized production chats/tools maintain it through normal Git operations.

### SUPERSEDES
The public Travel-mirror inbox is superseded as the planned cross-project intake location. Existing packages there remain provenance/history until verified migration.

### DECISION
Every active inbox job/project gets one self-contained folder under `_inbox/<job-or-project>/` containing its relevant briefing/docs/sources/manifests/returns.

### DECISION
After a package is processed and its accepted result is pinned in the receiving SSOT, move the whole package to `_inbox/archiv/<job-or-project>/` with final destination/return pointers. Archive replaces deletion as the normal cleanup path.

## 2026-09-14 · Canon-home and fractal-design follow-up

### IMPLEMENTATION / INDEX ONLY
Add `meta/CANON_HOME_MAP.json`. Known narrator sources are pinned at the inspected revision; Layer Zero, Global Intent, Infinite Comic, Almanac authoring homes and the exact Game Sim/FrizzleCrits chain remain explicitly unresolved. No canonical source is moved or rewritten.

### DECISION / MASTERPLAN ADDENDUM
Record Georg's Infinite Canvas of the Tenth Art direction with McCloud, Blair, Warburg, Gabriel/Sinnfelder and Heim/D6/color references. Fractal thinking, satirical emergence and player closure apply across modules, not only to a future Museum. Exact historical dimension/color mapping is not invented.

### SOURCE LOCATED / BACKLOG
Register the located Quaternius Planet/Plant sources and KayKit playerstand bases in the addendum. Record future Sky/UFO-pill-alien and cardboard-public-figure mini-game directions. No runtime build, global NPC replacement, new Pop owner or expansion of Bath MVP1.

### ROUTING
Town onboarding and central Registry now route to the Home Map and `masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`. Add the previously created meta-narration addendum to the masterplanAddenda list. Existing entries, owners and Town J-decisions are preserved.

## 2026-09-14 · ChatterBox and Tourbus source review

### CURRENT_REFERENCE / MASTERPLAN ADDENDUM
Add `masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` and `meta/CHATTERBOX_TOURBUS_SOURCE_INDEX_2026-09-14.json`. Review 17 uploads against pinned GitHub counterparts: seven exact blob matches, eight differing counterparts, two unresolved. This is an analysis/index, not a full attachment archive or replacement ChatterBox master.

### REUSE / NO RUNTIME PROMOTION
Record existing phrase, behavior, bubble, identity, Caption/Afterglow and NIE-hook seams. Locate later v13 bubble sources and v14 freeze package. Do not overwrite these with older v10 uploads or treat historical LÄUFT as current consumer acceptance.

### TESTED RESULT
Seven uploaded JS files pass syntax checks. Read-only Node probes reproduce a legacy Card-priority inversion, verify its positive control and additive title retention. The same problematic expression is read in the pinned v10 Repo counterpart. Evidence lives under `masterplan/evidence/chatterbox-tourbus-2026-09-14/`; no browser, audio, 3D or consumer-integration PASS.

### DECISION / SUPERSEDES MODEL SELECTION ONLY
Georg selects WaterBowser in `media/3D_Assets/Frankensteining/KFB Truck/` as Tourbus. Earlier Armored Truck remains historical donor. Do not transfer its geometry, mounts, material assumptions or licence. FBX/BLEND file metadata verified; conversion/material-zone production explicitly not requested now and not performed.

### IDEATION
Append Town §11: parked Tourbus as encounter/media place; collected rejoinder as future montage material; old CCTV/livery preserved as Museum memory. These scene treatments remain PROPOSAL. Existing J-decisions and runtime owners remain unchanged.

### CORRECTION / SUPERSEDES PREVIOUS AMBIGUITY
Georg explicitly corrected the earlier Skydome request to planets. Planet versus plant ambiguity in the previous addendum is resolved in favor of Quaternius planets; existing plant assets do not become part of that request.


## 2026-09-18 · 2D Animation Studio routing

- registered `tools/2D Animation Studio/` as a `CURRENT_TOOL`;
- first lab: DocCheck Eumel browser cutout rig;
- loads with `skills/kfb-cartoon-animation_v2.md`;
- established a scoped tool-local inbox for the incoming DocCheck AD Illustrator source;
- preserved the evidence boundary: inbox input != accepted SSOT, and no supersession of the older Animation Lab node is claimed yet.

## 2026-09-19 · Cloudflare-only human review publication

### DECISION
Georg requires all active KFB human-facing preview, Stage and Live publication through the existing Cloudflare/KFB Hub surface. New active review instructions must use `kayfabizarro.pages.dev` routes and must not use githack/rawcdn.githack or similar third-party GitHub rendering/CDN mirrors.

GitHub links remain correct for source, PR, commit and recovery documents. Existing raw GitHub asset fetch contracts are not reclassified as publication URLs.

### IMPLEMENTATION
- added the rule to `START_HERE.md` and `STAGE_LIVE_WORKFLOW.md`;
- removed the active githack review URL from the current Astra Integration source baseline while leaving archived history intact;
- added the Resident Scene Modules WSA review card to the KFB Hub using the Cloudflare Resident Atlas route.

### EVIDENCE BOUNDARY
A third-party CDN success is never a KFB `PUBLIC DEPLOYMENT` or browser PASS.


## 2026-09-19 · Modular 3D Mini-Game Hub + ChatGPT Web POCs

### RECOVERY EVIDENCE
The complete Hex Platformer failure export was locally verified against its SHA-256 manifest. It remains recovery evidence, not a promoted implementation. Inventory, measurement, loader, pack-family, grid, camera and jump/contact donors are retained; the large generated island, current platform generator and automatic diorama composition are rejected as foundations.

### CURRENT_REFERENCE
Add `workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md` as the detailed plain-language briefing. It starts with one visual measured Baukasten catalog covering structural kits, all six Tiny Treats packs, residents and FrizzleBob, then routes three independent POCs: D01 furnished Dungeon rooms, H01 three-piece Hex proof/Babel micro-tower, and C01 Combat Arena platform level.

### OWNER BOUNDARY
World Atlas keeps Dungeon/authoring grammar, Resident Scene Modules keep resident activity only, the FrizzleBob graft keeps the actor contract and `georg-doc/KFB-Combat-Arena` keeps combat implementation truth. The Production Hub coordinates links and prompts; it does not become a game runtime.

### HUB ROUTING
Add one P0 C0 catalog todo and four ready-to-copy ChatGPT Web starters for C0, D01, H01 and C01. Each slice uses a separate branch, fixed Stage route, additive return packet and PR without automatic merge.


## 2026-09-19 · Hub UI rejection response + Race 3D radio rebrief

### GEORG UI DIRECTION
Adopt “every letter and every pixel has to pay rent” as the KFB Hub and visual-brief North Star. The prior Hub default is rejected for explanatory header ballast, oversized focus tabs, an unprioritized card wall and a hidden Pocket Inbox/dropzone.

### IMPLEMENTATION
The Hub now defaults to a compact `Heute` view: short header utilities, small KFB/DocCheck switch, search, permanently visible local Inbox/dropzone, four P0 actions and four current briefings. Full project/reference lists appear only through explicit filters. The rejected HUD Rig v1 Stage card is replaced by a rejection-history pointer.

### CURRENT_REFERENCE
Add `ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md` and the bounded Claude Design brief under `workflows/KFB_HUB_UI_V2_2026-09-19/`. Future briefs must prove each source donor visually before composition, fail loudly instead of using aesthetic fallbacks, keep task/FOV clear and separate technical PASS from Georg acceptance.

### RACE REBRIEF
The Hub briefing box now routes to `georg-doc/KFB-Stunt-Car-Race/_handover/RACE_HUB_3D_AUTORADIO_RESTART_BRIEF_2026-09-19.md`. R0 proves only the exact Tiny Treats radio with invisible hit targets and the existing Audio owner. HUD Rig v1 remains rejected and is never the restart baseline.

## 2026-10-03 · EyeRig Batch · recovery + appearance variants

### RECOVERY
The newer 40-profile Medium browser export is preserved on the existing PR #104 owner. It extends the previous 33-profile export additively; **33/33** previous profile payloads remain unchanged and seven additional actor profiles resolve to current roster/source truth.

### IMPLEMENTATION
EyeRig Batch now consumes the Resident Variant SSOT from PR #330 for palette coverage instead of inventing a second variant catalog. **25 character texture families / 56 source appearances** map onto **31 existing EyeRig geometry actors**. Palette selection is separate from geometry profile ownership. Magical Girl has A/B/C/D; Driver BASE/B; Paladin King remains fixed B. Farmers A/B remain source-gated because exact texture-to-model mapping is not yet proven.

### TESTED RESULT
Focused readback contract **20/20 PASS**; variant source identity **56/56 exact path/blob/revision**. Same LocalStorage key, additive appearance persistence, and 55 Medium / 8 Large geometry catalogs remain unchanged.

### STAGE / ROUTING
Stage mirror `cloudflare-live@479c4e91967565b583c76ed0c6ea07433c5b28ce` contains the new selector/manifest and updated ToolBox card. Direct pages.dev verification is still OPEN because the current opener cannot access the route; no Live claim. One current human gate: `GEORG_EYERIG_CONTROL_R2_VARIANTS_VIS_01`. No merge/promotion.

## 2026-10-03 · EyeRig Batch · Stage boot repair

### OBSERVED
Human Stage test exposed a real boot blocker: `Loading actor catalog…` never advanced and the Large class button was inert.

### PROVEN CAUSE / IMPLEMENTATION
The inline-number editor initialized a single `querySelector` result as if it were a list: `$('output[data-out]').forEach(...)`. The exception occurred before roster/class event wiring. Repair changes that call to the existing multi-query helper `$$`, wires roster/class navigation first, and adds visible boot progress / exact failure text.

### TESTED RESULT
Focused repair regression: **6/6 PASS**. Existing 25-family / 56-appearance palette layer retained. Full historical suite not rerun in this repair.

### STAGE / ROUTING
Exact repaired app mirrored at `cloudflare-live@d2cbc94ddde4d7c281a492db350119005f22e153`; ToolBox Stage card and actual public Hub task updated. Public browser verification remains OPEN in this environment. Exactly one current gate: `GEORG_EYERIG_BOOT_REPAIR_VIS_01`. After that passes, resume Control R2 + appearance review.


## 2026-10-03 · EyeRig Batch · view comfort + Clay K1

### HUMAN PASS
Georg confirms the prior EyeRig boot repair works: roster loads and Rig_Large switching responds.

### IMPLEMENTATION
The existing OrbitControls owner now uses a substantially slower wheel zoom (`zoomSpeed=.28`; bounded distance .8–14). A reversible `Neutral | Clay K1` authoring view reuses the exact Resident Atlas S15 K1/H0 donor, not a new clay implementation. `clay-k1.js` and `clay-soften.v1.js` are byte-identical donor copies. K1 keeps its 4k-tris/mesh, 2-level, 160k-added-tris performance budget and cache; EyeRig/FaceHost are excluded from deformation. The floor reuses pinned `clay_floor_001` diffuse/normal/roughness. GTAO/K2 stays off.

### TESTED RESULT
Focused source/readback contract: **15/15 PASS**. Full historical Node suite is `NOT_RUN`: the isolated test container could not resolve github.com before checkout. This is not relabeled as PASS or FAIL.

### STAGE / ROUTING
Exact Stage mirror: `cloudflare-live@6406774131723288b757fd676e6d7be3f08b1123`; app/index/K1/soften plus ToolBox and public Hub routing read back successfully. Direct pages.dev visibility remains unverified in the current tool environment. Exactly one gate: `GEORG_EYERIG_VIEW_COMFORT_CLAY_VIS_01`. No merge or Live promotion.

## 2026-10-03 · EyeRig Batch · wheel zoom repair 02

### HUMAN FEEDBACK
The first comfort pass (`zoomSpeed=.28`) still jumped to extreme near/far camera positions.

### IMPLEMENTATION
Native OrbitControls wheel zoom is disabled. OrbitControls remains the orbit/target/rotation owner; a bounded wheel-input adapter controls only distance to that same target. Absolute distance is 1.6–8.0, base step 0.12/event, one gesture is capped to 0.65 inward / 0.85 outward, reset after 160 ms idle, damp factor 14, max physical movement 0.09 units/frame. Camera presets re-sync the wheel target.

### TESTED RESULT
Focused repair checks: **13/13 PASS**. Boot repair, Clay K1, Control R2 and the 25-family/56-appearance palette layer remain retained.

### STAGE / ROUTING
Stage mirror `cloudflare-live@888a57cfe820890fa2ac3a86f991d05a58834ee3`; source/stage app blob match. Exactly one gate: `GEORG_EYERIG_WHEEL_ZOOM_VIS_02`. After PASS resume Neutral ↔ Clay K1 review. No merge or Live promotion.

## 2026-10-03 · EyeRig Batch · human acceptance and next slice

### HUMAN ACCEPTANCE
Georg confirmed the current EyeRig Stage **works**. The accepted runtime app blob is `5635b28496af0e06cfe7f60a01b23e5612bad6e1`, still present unchanged in the later concurrent `cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`.

Closed:
- boot/roster repair;
- Rig_Large switching;
- bounded wheel zoom v2;
- Neutral / Clay K1 view for continuation.

### NEXT SLICE
`EYE_RIG_PER_EYE_CONTROL_01`

Bounded outcome:
- preserve mirrored paired eyes as the default/backward-compatible mode;
- optional independent L/R position offsets;
- explicit per-eye visibility;
- first concrete proof: Survivalist eyepatch / one-eye-off;
- existing 40-profile browser data must load unchanged;
- no automatic profile reset or schema-wide migration;
- no second EyeRig runtime owner.

Later: Farmers palette mapping, unresolved Blender/NoEyes cleanup, separate Studio numeric-parity, then consumer/profile promotion.

No merge or Live promotion.

## 2026-10-03 · EyeRig roadmap correction · Legacy review next

Georg reprioritized correctly: per-eye/eyepatch controls are a detail, while Legacy coverage is the next major EyeRig expansion.

Current Legacy owner already exists:
- Draft PR #162;
- branch `chatgpt-web/legacy-eye-batch-17-2026-09-21`;
- 17/17 persisted Legacy profiles;
- 16 MEASURED_CANDIDATE;
- Skull HUMAN_REQUIRED;
- automatic source-first browser/WebGL **247/247 PASS**;
- persisted-profile reconstruction **215/215 PASS**.

Current next gate is therefore:
`KLR-EYE-VIS-01 · 17-head human visual review`

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`

Per-eye / Survivalist remains documented but deferred until after Legacy visual acceptance.
No merge or Live promotion.

## 2026-10-04 · EyeRig · unified Site source ready

### PRODUCT OWNER
PR #104 is now the single productive EyeRig UI/runtime owner.

One workbench now exposes:
`Medium | Large | Legacy`

The separate Legacy PR #162 UI is no longer the intended productive surface. PR #162 remains donor/evidence for the proven 17/17 Legacy profile layer and Legacy assembly/FaceHost path.

### IMPLEMENTATION
Unified source:
- Medium 55
- Large 8
- Legacy 17
- total 80 review identities

Legacy construction is the only class-specific seam:
exact Legacy source → proven modular assembly → LegacyFaceHost → persisted Legacy profile → existing EyeRig v6 → common #104 controls/review/persistence.

Exact proven Legacy donor blobs were copied locally:
- rig adapter `41ba111d264cb73f2b3fbd70370dbb0ba042c91d`
- face host `186323777ff78a9e4f4a246ad10232dd8ef82bc9`

Storage remains `kfb.toolbox.eye-rig-batch.v0`.

### TESTED RESULT
Focused unified readback: **33/33 PASS**.

Expanded repository static contract:
**160 assertions persisted · NOT_RUN** because no Actions run exists for the new head.

Historical Legacy evidence remains historical:
- 24/24 static + 247/247 browser/WebGL
- 30/30 profile + 215/215 persisted remount

### SITE
Target is now one **ChatGPT Site** from:
`tools/KFB-ToolBox/eye-rig-batch/`
entrypoint `index.html`.

Manifest:
`site.manifest.json`

Publishing brief:
`docs/EYE_RIG_UNIFIED_SITE_01.md`

Cloudflare is recovery/regression only for this tool; this slice does not create another Cloudflare acceptance fork.

Current Webchat tooling has no Site create/publish action.

Exactly one next gate:
`EYE_RIG_UNIFIED_SITE_PUBLISH_01`

After publication:
`GEORG_EYERIG_UNIFIED_SITE_01`

Per-eye/Survivalist is deferred until unified Site acceptance.



## 2026-10-04 · Unified EyeRig ChatGPT Site publication

### PUBLICATION
PR #104's existing `Medium | Large | Legacy` EyeRig workbench was published by Work as one private ChatGPT Site without redesign:
`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

Publication identifiers:
- version `appgprj_6ac1b73620f48191ae6e7f101f4b0786~appgver_5717d8849ad48191b6e277502df17312`
- deployment `appgdep_6ac1b854cd3081919f783990f88039f4` · succeeded
- publication source revision `4f8a82cbea7a0a8c82eafc917b7968b8e77d4e00`
- owner source remained PR #104 @ `ad26045e8a7b389afe0c8127e80bb66f3e9f2ac3`

Work smoke confirmed 55 Medium / 8 Large / 17 Legacy and the common control surface. Skull remained `HUMAN_REQUIRED`.
The exact publication source static run was **187/191 PASS · 4 FAIL** locally; this is not a CI-PASS claim.

Exactly one current EyeRig gate:
`GEORG_EYERIG_UNIFIED_SITE_01`

No merge or Live promotion.
