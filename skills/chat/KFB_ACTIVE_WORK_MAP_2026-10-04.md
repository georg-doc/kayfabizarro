# KFB Active Work Map · 2026-10-04

Status: **CURRENT PORTFOLIO ROUTER**
Owner: Georg / KFB
Purpose: one cross-project view of current Web Chats, Sites, implementation slices, human gates, holds and next iterations.

GitHub current state wins. This file is a portfolio map, not a replacement for project SSOTs.

## 0 · Operating rules

1. **One owner per runtime/system.**
2. **GPT Sites first** for Site-capable tools/workbenches/MVP products.
3. **PUBLISH_ONLY** uses the lowest-cost / lowest-reasoning Sites-capable executor.
4. **Human gates are product gates**, not technical-checkpoint gates.
5. Old open PRs are not automatically active work. Classify them as OWNER / ACTIVE CONSUMER / DONOR-HOLD / HISTORY.
6. Do not start model/provider comparisons while a current product still needs a direct human product decision.
7. Research/data curation may run in normal Web Chat when it does not mutate an active runtime.

---

# 1 · Current executive picture

There are currently four genuinely active product lanes:

### A · World Studio / Playable MVP · P0
Owner: WB2 / PR #348

Current state:
- four-island Joyride/LifeTree recovery implemented;
- exact 92-file frozen candidate published in place to the existing GPT Site;
- Site deployment succeeded;
- **Georg freeplay is the current acceptance gate**.

Primary Site:
https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/

Current runtime source:
`3d9aaf5f6623f9009d6e68dd3c042009a160b044`

Current PR handoff head:
`2460dfda5213e0b67e7125f20357cad577309cd8`

Do not build more before Georg freeplay unless publication itself is broken.

### B · Card-Hex Combat Ascent · P0 human gate
Owner: KFB Combat Arena / PR #19

Current state:
- full S3 public product;
- two complete runs and restart verified;
- GitHub Actions validates the source/build successfully;
- CORE Duel/Rifle issues repaired;
- current gate = Georg plays it and returns PASS / TUNE / FAIL.

Public review:
https://kayfabizarro.pages.dev/kfb-hub/stage/combat/card-hex-ascent-coworker/

Product source:
`16928236485d3535670599694f836d042029d004`

Current PR metadata head:
`b6ed820ce1ba2d3295b7c620ad079097c34814d3`

Do not start Sol/Astra comparison. Comparison remains HOLD.

### C · Tool/Content Sites · active but not P0
The tool surfaces are now usable enough to support production:
- Asset Librarian;
- Audio;
- EyeRig;
- FrankenStein;
- Hypernormalisation Curator;
- Production Hub.

Their next work should be driven by concrete World/Resident/Media consumer needs, not by generic feature expansion.

### D · Production-source preparation · bounded active lanes
- Environment Atlas PR #353;
- Fluff Work Motion Pack PR #356;
- Resident appearance/variant lane PR #330 / EyeRig cleanup PR #315;
- Motion SSOT PR #344;
- Audio source/update branch PR #352;
- Quote research/data on PR #354.

These are source/data/tool lanes. None may displace World Studio or Combat human gates.

---

# 2 · GPT Site inventory

## Published / usable

### KFB Production Control
URL:
https://kfb-production-control.frizzlebob.chatgpt.site/

Owner:
KFB Production Control

State:
**PRODUCTIVE DATA OWNER · CURRENT/HISTORY SPLIT SITE_VERIFIED**

Current workflow:
`KFB-PORTFOLIO-ROUTER-01`

Current data now includes the portfolio board, two P0 human gates, P1 next briefings, cheap parallel lanes, provider-comparison HOLD and Production-Hub PUBLISH_ONLY status.

The Site source now reads CURRENT records directly from its D1 store. CURRENT is the default view; additive history is a secondary tab. It is deliberately not another daily dashboard.

Site publication:
`appgprj_6ab82e3950b88191a8ead3c495e21454` · version `appgprj_6ab82e3950b88191a8ead3c495e21454~appgver_855c03b14a448191b13ab7b4c2040aba` · deployment `appgdep_6ac2bc9f55e0819183bac00466aa3e5a`


### KFB World Studio MVP1
URL:
https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/

Owner:
WB2 / PR #348

State:
**FOUR-ISLAND CANDIDATE DEPLOYED · GEORG FREEPLAY PENDING**

Current Site project:
`appgprj_6ac27631f74c8191b52e4819c1973668`

Current recovery Site version:
`appgprj_6ac27631f74c8191b52e4819c1973668~appgver_5543685a956081918fb6fcf4c0767b74`

Deployment:
`appgdep_6ac2a03072788191a4d542b2ea7b7301`

### KFB Asset Librarian
URL:
https://kfb-asset-librarian.frizzlebob.chatgpt.site/

Owner:
Asset Registry / Librarian · PR #349

State:
**PHASE A BUILT · 8/8 WSA QA PASS · GEORG REVIEW OPEN**

Current useful capability:
- 15,272 assets;
- Family → Pack → Collection;
- image/audio/3D inspector;
- Saved Sets;
- `kfb.asset-handoff.v1`.

Next meaningful consumer step after review:
WorldBuilder placement seam / durable set handoff, not generic Intake expansion.

### KFB Audio
URL:
https://kfb-audio.frizzlebob.chatgpt.site/

Owner:
Audio & Soundscape · PR #350 / update PR #352

State:
**SITE VERIFIED · PRODUCT CONTINUATION**

Current source/intake branch contains a newer catalog/mixer candidate and Groove Ecology work.
PR #352 currently has one frozen mixer-source binding defect in a later fold; do not rewrite the whole Audio Site.

Priority:
preserve current working Site; repair/update only when a consumer needs the new catalog/mixer delta.

### KFB EyeRig Workbench
URL:
https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/

Owner:
ToolBox / EyeRig · PR #104 lineage

State:
**PRODUCTIVE · HUMAN ACCEPTED FOR CONTINUATION · PROFILE RECOVERY OPEN**

Global presentation rule:
**Integrated visible KFB characters use EyeRig v6 by default.** Untouched source eyes are donor-isolation only; integrated presentation hides/replaces source eyes through the existing cleanup/FaceHost path and mounts EyeRig. Use approved/recovered profiles first; otherwise source-derived candidate = `PROFILE_TUNE`. No stock-eye fallback and no parallel EyeRig owner.

Current profile truth:
- Medium roster 55; newest durable export 40 profiles and is older than Georg's later Stage session;
- therefore `EYE_RIG_PROFILE_RECOVERY_01` is first;
- 15 Medium identities are absent from the durable 40-profile export and remain `RECOVERY_OR_PROFILE_TUNE`;
- Large durable approved = Monstrosity / Black Knight / Demon Lord / Orc Brute; FrostGolem / 4GTN / 4GTN Forgotten / Clanker remain review/tune;
- Legacy 17/17 candidates need durable human review; Skull = HUMAN_REQUIRED.

Durable TODO:
`tools/KFB-ToolBox/eye-rig-batch/docs/EYERIG_CURRENT_TODO_2026-10-04.md`

### KFB FrankenStein Composer
URL:
https://kfb-frankenstein-composer.frizzlebob.chatgpt.site

Owner:
KFB ToolBox / PR #355

State:
**PRIVATE SOURCE-FIRST SITE DEPLOYED**

Verified donor isolation:
- GothGirl;
- Black Knight;
- pinned FrizzleBob v5;
- Pencil A long.

Eraser:
`SOURCE_REQUIRED`

Next useful iteration:
connect existing FaceHost/headgraft/EyeRig/brow/lid/motion owner adapters and prove one real composite + motion roundtrip.
Do not build a new rigging stack.

### KFB Hypernormalisation Curator
URL:
https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site

Owner:
Billboard Media Residency / PR #354

State:
**PRIVATE CURATOR SITE DEPLOYED · DATA POPULATION ACTIVE**

Current role:
- browse canonical 130 decks;
- curate quote pool;
- validate provenance/rights/FrizzleQuestion;
- map later to Cards/decks/worlds.

H13/3D/audio runtime integration remains deferred until data is good enough.

### KFB Production Hub
URL:
https://kfb-production-hub.frizzlebob.chatgpt.site

Owner:
HUB-CTRL / Production Hub

State:
**SITE_VERIFIED · ONLY HUMAN FRONT DOOR · GEORG GATE OPEN**

The GitHub source now has a small data-driven CURRENT board, links to exactly one ToolBox and to Production Control/history, and no competing tool/runtime ownership.

Role:
one human entry point to the current production surfaces.
Do not turn it into another runtime or spend High Reasoning on the host refresh.

Final publication:
`appgprj_6ab7358322a8819183d2fa036b7b12f9` · version `appgprj_6ab7358322a8819183d2fa036b7b12f9~appgver_61d8fd9c75d08191872e1acf9bdfd3ef` · deployment `appgdep_6ac2be0ca3c88191b7224b910a98b786` · browser checks 12/12.

### KFB ToolBox
URL:
https://kfb-toolbox.frizzlebob.chatgpt.site

Owner:
KFB ToolBox

State:
**EXACTLY ONE CANONICAL SITE · SITE_VERIFIED**

Site project:
`appgprj_6ac2ba44282881919d1a49287a32054e`

Version/deployment:
`appgprj_6ac2ba44282881919d1a49287a32054e~appgver_bffb1a7eb0b081919f94ef702f44a79c` · `appgdep_6ac2bc4091d48191a3e127372122d34d`

Role:
one router to current specialist tools. Old ToolBox Home/Stage and standalone Studio/Rigging/Animation surfaces are visibly classified as history/donors and may not compete as current front doors.

## Prepared but not yet published

### KFB Environment Atlas
Owner:
`tools/world_atlas` · PR #353

State:
**SITE PREPARED · FULL CORPUS RECOVERY INCOMPLETE**

Important:
S11/S12/S13.2 plus S14–S22 lineage must be recovered honestly.
Do not reconstruct missing S14–S17 runtime from prose.

Next gate:
recover/full-export missing corpus → reconcile → publish one Atlas Site.

---

# 3 · Current Web Chat / work lanes

This section maps current chats/workstreams by durable owner rather than by tab title.

## World Studio / MVP Web Chat
Durable owner:
PR #348

Current task:
**human freeplay of newly published four-island candidate**

Do not reopen:
- Player micro-slices;
- Cloudflare-first publication;
- route-bot repair;
- generic WorldBuilder architecture.

## Quote Pool / Billboard Web Chat
Durable owner:
PR #354

Mode:
**normal Web Chat research/data**

Current state:
- Hypernormalisation Curator Site exists;
- research reserve has additional quote candidates;
- quote data validation is passing;
- quote-to-deck mapping must remain editorial, not invented.

Next:
continue batch curation in normal Web Chat; no WSA needed for bulk research.

## Audio / Jukebox Web Chat
Durable owner:
PR #350 + update PR #352

Current state:
- Audio GPT Site exists;
- source library discovery performed;
- Groove Ecology / Ambient Beds / source-intake data growing;
- newer mixer candidate has one localized frozen bug.

Next:
consumer-driven repair/update only; do not spawn new audio architecture.

## Asset Librarian Web Chat
Durable owner:
PR #349

Current state:
Phase A human review open.

Next:
Georg review → only then Phase B placement/durable-set seam.

## Environment Atlas Web Chat
Durable owner:
PR #353

Current state:
full source-corpus/site prep.

Next:
recover missing real project export and publish Atlas Site.
This is the world-building source consolidation lane.

## FrankenStein Web Chat
Durable owner:
PR #355 + private Site

Current state:
source-first frontend is real; composite/runtime integration remains open.

Next:
one representative composite per Rig_Medium / Rig_Large plus Pencil PropActor, then motion.
No Eraser substitute.

## Fluff / Construction Economy Web Chat
Durable owner:
PR #356 + Production Control workflow `KFB-CLAY-WORKER-CONSTRUCTION-ECONOMY-01`

Current decisions:
- Life Trees grow collectible Fluff;
- High/Low vibrational Fluff controls assembly/dismantle behavior;
- biome-specific prop grammars;
- Blender reuse-first Worker Motion Pack.

Next:
Blender Part 1 source audition/reuse matrix.
Do not make 28 new clips before proving reuse gaps.

## Resident / appearance lane
Durable owners:
Resident Atlas + EyeRig

PRs:
- #330 appearance variants;
- #315 EyeRig cleanup prep.

Current:
Magical Girl A/B/C/D source variants are required; runtime unchanged.

Next:
only promote variants needed by current Residents/FrankenStein/World Studio.

## Motion / animation lane
Owner:
Motion SSOT / PR #344 + merged cartoon-animation skill.

Current:
KayKit-native locomotion is current baseline.
World Studio already consumes the proven Medium set.

Next:
motion work should be consumer-driven:
- Fluff workers;
- combat tuning;
- future flight/swim;
not another general locomotion rebuild.

## Combat Web/Coworker lane
Owner:
KFB Combat Arena PR #19

Current:
S3 human gate.

Next:
Georg PASS/TUNE/FAIL only.
Provider benchmark PR #18 remains planning/HOLD.

---

# 4 · Active implementation slices

## P0 · HUMAN GATE NOW

### Slice W1 · World Studio four-island freeplay
Input:
published same Site with 92-file candidate.

Human decision:
PASS / TUNE / FAIL on:
- four islands;
- Life Trees/root-island form;
- Joyride track;
- building clearance;
- palette identity;
- Player/editor/save regressions.

No executor work before this unless the Site itself fails to load.

### Slice C1 · Card-Hex Combat Ascent freeplay
Input:
public S3.

Human decision:
PASS / TUNE / FAIL on:
- jump fun;
- combat feel;
- Card artwork;
- visible Rifle lane;
- Minigun/boss scale;
- Snow/Hex/Card composition.

No model comparison before this.

## P1 · SOURCE / TOOL CONSOLIDATION

### Slice A1 · Environment Atlas Site
Goal:
one source/provenance/visual SSOT for current environment/Hex/building/plant/dungeon corpus.

Why next:
World Studio, Combat, Fluff and future building/biome work all consume it.

### Slice L1 · Asset Librarian Phase B seam
Goal:
turn reviewed Saved Sets into durable WorldBuilder placement/source handoffs.

Depends on:
Georg Phase-A review.

### Slice F1 · FrankenStein real composite
Goal:
one real Rig_Medium composite + one Rig_Large composite + Pencil PropActor using existing owners.
No generic Site expansion.

### Slice M1 · Fluff Worker motion source · COMPLETE THROUGH PART 3
Result:
PR #356 now provides the consumer-ready Part-3 motion delta: Rig_Medium 17 clips, Rig_Large 13 clips, growing-ball variants, 2/3-worker Large-ball push, ball ride/play contact events and 6→1 merge reference. NEW CLIP REQUIRED: none.

Next:
`FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF`. Do not reopen Blender unless the real runtime proves a motion defect.

## P2 · CONTENT / SEMANTIC PRODUCTION

### Slice Q1 · Quote Pool batches
Executor:
normal Web Chat.

Goal:
high-quality provenance-checked quote pool; Curator Site is review surface.

### Slice AU1 · Audio consumer update
Goal:
repair the localized mixer bug only when the updated Audio catalog is needed by World/Combat/Billboard.
Then update existing Audio Site via PUBLISH_ONLY.

### Slice R1 · Resident variants
Goal:
promote only source-backed variants needed by actual Residents/activities.

### Slice FL1 · Fluff construction/runtime consumer · NEXT
Consume the finished PR #356 Part-3 Worker motions and Fluff resource/build-stage logic in the receiving runtime without creating another world owner. Visible worker characters use EyeRig v6 by default.

## P3 · INTEGRATION / EXPANSION

Only after World Studio and Combat human decisions:

- integrate approved Card-Hex activity as a world activity/portal, not a second overworld;
- H13 Billboard read-along + audio visualizer integration;
- Fluff build/dismantle economy;
- Flight/Card Surf;
- advanced resident scenelets;
- broader Golden Journey/content completion.

---

# 5 · HOLD / donor / history clusters

These are useful evidence but should not compete for attention.

## World donor/history
- PR #332 = older current-world donor/history; superseded as product owner by #348.
- PR #314 = OSM donor only; visible use is firewalled out of current MVP.
- closed WC1/R2D/Hex donor PRs #307–#328 = evidence/donors, not active owners.

## Audio donor/history
PRs #337/#339/#340/#341/#346/#351 contain useful donor/research/prompt history.
Current product owners are #350 / #352.

Recommendation:
later mark older audio PRs as DONOR/HISTORY or close when provenance is safely routed.

## Billboard history
PRs #321/#324/#326/#335/#338 are H13/context/worldlook lineage.
Current orchestration owner is #354.

Recommendation:
retain as donors but stop treating them as active slices.

## Combat donor stack
PRs #12/#14/#16/#17 are useful proven donor layers.
PR #19 is current product candidate.
PR #18 is benchmark planning only.
Older PRs #1/#2/#5–#11/#13/#15 are historical/frozen preparation.

Do not reopen them for current product work unless PR #19 explicitly needs a donor.

---

# 6 · Recommended iteration sequence

## Iteration 0 · HUMAN REALITY CHECK · now

Do only two meaningful product reviews:

1. **World Studio Site** — all four islands.
2. **Card-Hex Combat S3** — one full run + restart.

Optional quick reviews only if Georg has appetite:
- Asset Librarian Phase A;
- FrankenStein source-first Site.

No new high-cost implementation until the two game surfaces return PASS/TUNE/FAIL.

## Iteration 1 · CORE PRODUCTION TOOLCHAIN

After those human results:

1. repair only confirmed World Studio defects;
2. repair only confirmed Combat defects;
3. publish those repairs with **PUBLISH_ONLY**;
4. Environment Atlas corpus recovery + Site;
5. Asset Librarian placement seam;
6. FrankenStein one real composite roundtrip.

Outcome:
World authoring, asset choice, environment source truth and character composition form one coherent production toolchain.

## Iteration 2 · LIVING WORLD CONTENT

Run mostly in cheaper Web Chat/data lanes:

- Quote Pool batches;
- Audio deck/biome mappings and curated prompt/source intake;
- Resident variant mapping;
- Fluff world rules/data;
- Life Tree / Deck / Groove Ecology metadata.

Then one integrated consumer pass into World Studio.

## Iteration 3 · GAMEPLAY EXPANSION

If Combat freeplay is positive:
- treat Card-Hex Ascent as the first approved vertical activity grammar;
- rehome/integrate through a defined portal/activity seam;
- keep Combat as combat owner;
- World Studio only owns entry/return/world context.

Then:
- Flight/Card Surf;
- additional traversal modes;
- world activities;
- Golden Journey expansion.

## Iteration 4 · MEDIA / META WORLD

Once World + Combat + Audio + Curator are stable:
- Billboard H13 quote read-along;
- music visualizer;
- deck/world quote mapping;
- FrizzleQuestion;
- Brain Food/source links;
- controlled media residency in the world.

---

# 7 · What should NOT happen next

Do not:

- start Astra/Sol comparison;
- create another GPT Site for an existing owner;
- spend premium reasoning on Site publishing;
- reopen OSM/Hürth visible world work;
- launch another general locomotion project;
- expand Combat before Georg freeplay;
- implement H13 runtime before the quote pool has enough editorial quality;
- build Environment Atlas from missing prose instead of recovering source;
- let 30 open Draft PRs masquerade as 30 active projects.

---

# 8 · Portfolio hygiene pass · recommended but non-blocking

After the two P0 human gates, perform one administrative classification pass over open Draft PRs.

Labels / disposition:

- `CURRENT_OWNER`
- `ACTIVE_CONSUMER`
- `DONOR_HOLD`
- `HUMAN_GATE`
- `PUBLISH_ONLY`
- `HISTORY_SUPERSEDED`

Do not merge merely to clean the list.

Goal:
a fresh chat should see fewer than ~10 genuinely active lanes even if historical donor PRs remain open.

---

# 9 · Cost / executor routing

### Normal Web Chat
Use for:
- research;
- quote curation;
- source classification;
- planning/data reconciliation;
- prompt generation;
- metadata.

### Low-cost Sites-capable executor
Use for:
- `PUBLISH_ONLY`;
- updating existing GPT Sites;
- deterministic host metadata/Hub updates.

### Work / high-reasoning engineering
Use only for:
- multi-system implementation;
- difficult runtime debugging;
- architecture/seam repair;
- whole-product integration.

### Blender MCP / specialist authoring
Use for:
- measured animation/rig/prop work with exact source contracts.

Do not use expensive reasoning simply because a connector/tool exists there.

---

# 10 · Immediate next gates

1. **Georg freeplays World Studio four-island candidate.**
2. **Georg plays Card-Hex Combat Ascent S3.**
3. Record PASS/TUNE/FAIL for each.
4. Then run one bounded repair iteration per product, only from observed defects.
5. In parallel, Quote Pool research may continue in Web Chat; EyeRig profile recovery may continue without runtime changes; Fluff proceeds only as the bounded runtime consumer proof because Blender Part 3 is complete.

Everything else waits behind those decisions.
