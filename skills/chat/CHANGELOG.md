# KFB Chat Production Router · additive changelog

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
