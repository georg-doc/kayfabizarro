# KFB Chat Production Router · additive changelog

## 2026-09-19 · Chat → GitHub → KFB Stage + Tiny Treats intake

### DECISION

Add one binding delivery workflow for Web, Claude Design and Codex slices. GitHub writes are saved in small checkpoints and verified against the exact branch head. Timeouts are `UNKNOWN`, never success. Human testing uses only direct KFB Cloudflare routes linked from the Hub; GitHub Pages, githack and local files are not acceptance surfaces.

### ASSETS / BRIEFING

Admit Tiny Treats Charming Kitchen 1.1 as a closed 244-file CC0 package on main and route the Asset Registry rebuild. Expand 3D Hub C0 to eight Tiny Treats packs, including Baked Goods and Charming Kitchen, plus the current Plant Prop Lab v2 donor for environment/resident scenery. Update Dungeon, Hex and Combat briefs to use the same delivery workflow.

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

## 2026-09-19 · Dungeon, Combat and Hex rebrief

### DECISION
Replace the executable D01/H01/C01 mini-POC prompts with three current briefs: existing Dungeon Generator v2 expansion, productive Combat Arena Driver/KayKit integration, and a verified-module-first Hex Terrain Generator.

### PORTAL SEAM
All three prepare the same neutral materialize/enter/instance/result/return contract. Direct Race/Travel coupling remains outside the first slices.

### HUB ROUTING
Keep the existing briefing IDs for stable filters, but point them to the new standalone briefs and updated copyable start texts.
