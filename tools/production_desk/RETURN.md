## CURRENT UPDATE · PRIVATE SITES MIRROR · 2026-09-26

Status: **PRIVATE SITES DEPLOYED · CANDIDATE MIRROR · NO NEW BROWSER PROOF · NOT KFB LIVE**.

The exact PR #217 Hub UX Recovery v2 candidate is available at https://kfb-production-hub.frizzlebob.chatgpt.site. It is owner-private. HUB-CTRL remains the only registry/build owner; this Site is a distribution copy. Source and actual checks: [Sites mirror Return](SITES_MIRROR_RETURN_2026-09-26.md).

The PR #217 Cloudflare Stage is still the project's public acceptance route. The Site deployment has not been checked in a real browser here; Georg's mobile defect remains `HUB-MOBILE-TUNE-01`. No KFB Live promotion or auto-merge.

Exactly one next gate: Georg checks the private Site on desktop and mobile and reports whether it works as his daily mirror, including the known mobile issue.

---

## CURRENT UPDATE · HUB UX RECOVERY v2 · Georg review · 2026-09-25

Status: **GEORG HUMAN PASS_WITH_TUNE · MOBILE KNOWN BROKEN · STAGE ACCEPTED FOR NOW · NOT LIVE**

Human result:
- Georg accepts the current Hub UX Recovery v2 candidate **for now**;
- desktop / overall Hub direction is accepted as the working candidate;
- **mobile is explicitly still broken** and is not considered solved by the earlier automated overflow check;
- automated mobile geometry/overflow PASS therefore does **not** override Georg's real-device visual/interaction feedback.

Boundary:
- do not reopen the accepted desktop/design integration in order to fix mobile;
- mobile becomes a later bounded responsive repair slice;
- preserve the current candidate and public Stage evidence;
- no auto-merge and no Live promotion were authorized by this review message.

Unresolved item:
**HUB-MOBILE-TUNE-01** — real-device mobile layout/interaction repair against the accepted v2 shell.

Exactly one next gate:
explicit Live-promotion/merge decision, or a separately started HUB-MOBILE-TUNE-01 slice before promotion.

---


## CURRENT UPDATE · HUB UX RECOVERY v2 · Stage integration + legacy donor audit · 2026-09-25

Status: **PUBLIC_VERIFIED STAGE · HUMAN REVIEW OPEN · LIVE ROOT UNCHANGED**

Owner:
**HUB-CTRL / tools/production_desk / PR #202**.

Integration PR:
**#217** · branch `chatgpt-web/hub-ux-recovery-v2-integration-2026-09-25`.

Result:
- Georg-accepted Claude Design Session Cut is integrated as a HUB-CTRL presentation consumer;
- Production Desk registry/builder remains the single status owner;
- runtime order remains live bot registry → main registry → generated embedded fallback;
- the dated frozen embedded-registry JS owner was removed;
- shared Design runtime is rehomed under `/kfb-hub/runtime/`;
- existing FrizzleBob/GothGirl/Black Knight overlay remains a consumer of current actor/motion owners;
- Stage navigator links the candidate;
- production `/kfb-hub/` was **not** replaced.

Technical evidence:
- Production Desk builder/renderer: **18/18 PASS**;
- Hub v2 contract: **31/31 PASS**;
- exact public Cloudflare Chromium proof: **20/20 PASS**;
- public proof run `36178669464`, job `108215402496`;
- proof artifact `10883650417`;
- artifact SHA-256 `3cdd0319e880e37b6576e01779db8c46c7726939b67110f7f7082f3427791068`;
- evidence includes desktop candidate, Stage navigator and mobile screenshots;
- exact build marker `HUB-UX-RECOVERY-V2` was visible;
- Stage navigator card and direct link were present;
- desktop + mobile overflow checks passed;
- page/HTTP error checks passed;
- public proof explicitly verified that the Live root is **not** the candidate.

Publication:
- `cloudflare-live@1125f310d7a27ece4ea97c3875088fbd04c244f1`;
- direct human route: `https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ux-recovery-v2/`;
- Stage navigator: `https://kayfabizarro.pages.dev/kfb-hub/stage/`;
- Live root blob remained unchanged during publication.

Public-proof repair history:
- first run `36178363947` failed on an invalid QA assumption that the Design runtime registers `x-dc` as a Custom Element;
- source inspection proved the runtime instead boots through `window.__dcContentKeyed` / `__dcRegistry`;
- repair pass 1 changed the test only; candidate code was not altered;
- second run passed 20/20.

Legacy GVW Hub v0.8.2:
- exact v0.8.2 source was recovered and inspected;
- current chat web viewer could not render the historical pages.dev URL, so no visual-public claim is made for it;
- reusable donors are documented in `HUB_V082_DONOR_ANALYSIS_2026-09-25.md`;
- strongest future donors: voice capture → Pocket Inbox, browser TTS, selected-card/context → character interaction, source-derived related links, local snapshot/export semantics;
- old project manifest, direct API-key chat drawer, Crit Row/Comic floors as default UI and private Vault-path ownership are **not** adopted.

Exactly one next gate:
**GEORG HUMAN REVIEW · HUB UX RECOVERY V2** on the direct Stage route.

No auto-merge and no Live promotion.

---


## CURRENT UPDATE · WORLD / TOOLBOX CLAUDE CONTINUATION BRIEFS · 2026-09-25

Current paste-ready starts now exposed in Hub:

- World Integration:
  `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/CLAUDE_DESIGN_WORLD_INTEGRATION_CONTINUATION_2026-09-25.md`
- ToolBox Production:
  `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/CLAUDE_DESIGN_TOOLBOX_PRODUCTION_CONTINUATION_2026-09-25.md`

Both continue Georg PROCEED PASS candidates rather than restarting them.

World brief:
- shared KayKit locomotion consumer;
- preserve in-world WB2 authoring;
- global OSM facade / roof / contact-shadow presentation;
- Blender MCP route pieces are future pinned intake only.

ToolBox brief:
- canonical KayKit locomotion profiles;
- shared Pose/IK owner;
- fix pose-rig wrist/intermediate-bone chain once;
- Ear Rig first consumer;
- S39 no-baseplate band fixture;
- Vehicle/Flight seams prepared, not expanded into this gate.

Source validation: **11/11 PASS** in Architecture TEST_REPORT.

No Live shell or product runtime promoted.



## CURRENT UPDATE · FINAL GRAVEYARD / MUSIC LIVE ROUTING · 2026-09-25

Live bot registry:
`bot/production-desk-update@ce06ab9b3f04b2c58fe165fc8efa78aa22f885e6`

Manifest:
- checkedAt `2026-09-25T18:06:00Z`;
- **1 LOOK_AT · 6 RUNNING · 7 CAN_START · 4 WAITING**;
- 18 current lanes;
- 90 self-service jobs / 42 READY / 48 HOLD;
- moved = 0.

Corrections:
- Graveyard removed from current review; archive/concept/lighting donor only.
- Music Performance moved to CAN_START/TUNE; timeline/audio donor retained, newer S39 band animations are preferred.
- Music tool card marked `TUNE / Donor`.
- shared architecture rule: `WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.
- no public Hub shell changed.



## CURRENT UPDATE · GRAVEYARD / MUSIC / WORLD PRESENTATION CORRECTION · 2026-09-25

Status: **HUB ROUTING CORRECTED · NO PUBLIC SHELL CHANGE**

### Graveyard
The current Graveyard review is removed from current Human Review.

Correct status:
**historical concept prototype / lighting donor only**.

Not authoritative:
- movement;
- asset placement;
- world/gameplay integration.

Useful:
- spatial Postmortem/Graveyard concept for a future game-version of the Hub;
- grave-light illumination and flicker atmosphere.

### Music Performance
Current public MUSIC-PERF surface is no longer a human acceptance gate.

Correct status:
**TUNE / donor**.

Keep:
- timeline;
- beat/bar ruler;
- song/audio coupling.

Replace as canonical performance source:
- old visible guitarist/drummer animations.

Preferred source:
S39 Resident Band Module:
- Guitar A / ml.guitar.a.fit;
- drum.v5c + measured strike/contact work;
- no baseplate.

### Resident scene placement
S39 proves the desired module contract:
host surface + anchor, local support plane, **no mandatory baseplate**.

Future Resident demos should be terrain-placeable and use WorldBuilder-compatible sky/light/ground presentation.

### OSM / World presentation
Shared architecture rule:
`WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.

It promotes:
- WB-D2 FACADE_RULE v1 beyond Hürth to ordinary Cologne buildings;
- deterministic mildly asymmetric windows/doors;
- recurring roof/shadow fix from WB-D1 as a global OSM presenter rule;
- contact/shadow/clipping checks to prevent floating buildings/props.

No new runtime owner or public shell was introduced.



## CURRENT UPDATE · LIVE REGISTRY AFTER STATUS-SYNC CI · 2026-09-25

Status: **LIVE BOT DATA REFRESHED · PUBLIC SHELL STILL TUNE**

Current live data branch:
`bot/production-desk-update@cab4fcef34abfe7e438f31942db009c5ec960ca8`.

Manifest:
- source = HUB-CTRL `74c6fa5cd623dc378dec880905c6616f6a171754`;
- checkedAt = `2026-09-25T17:41:10Z`;
- stale threshold = **2 h**;
- **3 LOOK_AT · 6 RUNNING · 6 CAN_START · 4 WAITING**;
- 19 lanes;
- 90 self-service jobs / 42 READY / 48 HOLD.

Current new LOOK_AT item:
**HUB-STATUS-SYNC-01 · PR #215 · CI PASS**.
It asks only whether the workflow-only PR may merge to main to activate scheduled 30-minute registry refreshes.

The bot update contains no Hub HTML and no Cloudflare publication.

Exact public pages.dev rendering of this refreshed bot data remains unverified from the current URL tool.



## CURRENT UPDATE · HUB-STATUS-SYNC-01 CI PASS · 2026-09-25

Status: **DRAFT PR #215 · CI PASS · MERGE/HUMAN GATE OPEN**

Separate status-sync PR:
- PR #215;
- branch `chatgpt-web/hub-status-sync-v1-2026-09-25`;
- tested head `d45f215bce544ad1eb7e71a6aa743ca59919f08d`;
- exactly one changed file: `.github/workflows/kfb-hub-status-sync.yml`.

Purpose:
make the existing `bot/production-desk-update` registry refresh durable from the default branch without merging the human-rejected Hub shell.

CI run:
- workflow run `36168223283`;
- job `108181095987`;
- **18/18 inherited Production Desk tests PASS**;
- online registry build PASS;
- built **19 lanes · 2 LOOK_AT · 5 RUNNING · 7 CAN_START · 4 WAITING · 0 problems**;
- registry validator: **VALID**;
- content hash `6a85be902e95…`;
- current HUB-CTRL source resolved dynamically to `work/hub-ctrl-01-2026-09-24@2bbcb7964233bc703e231e78690108f593bd075c`;
- publish decision = `content-changed`;
- publish step correctly **SKIPPED on pull_request**, proving the PR cannot mutate Live registry during review.

First CI attempt failed only because inherited render tests expected the existing bot-registry fixture. Repair pass 1 seeds that fixture before tests; second run passed. No second repair pass needed.

Merge is not authorized automatically.
After merge to main, schedule/dispatch becomes available and may update only the bot registry, not Hub HTML or Cloudflare.



## CURRENT UPDATE · HUB RECOVERY / LIVE REGISTRY / UX DONOR · 2026-09-25

Status: **LIVE DATA REFRESHED · CURRENT SHELL STILL HUMAN-TUNE · UX RECOVERY + DURABLE SYNC PREPARED**

### User decision now recorded

ToolBox Production-01 and World Integration-01 are both:
**PROCEED PASS · not exhaustive detail acceptance**.

They no longer occupy old review gates.

### Live registry recovery

The public Hub shell already polls:
`bot/production-desk-update/registry/production/v1`
before main/embedded fallback.

That live registry was manually refreshed after the timeout and now carries:
- ToolBox Production-01 → PROCEED PASS / next shared locomotion + Ear Rig;
- World Integration-01 → PROCEED PASS / rehome then OSM+Mobility;
- Ear Rig / EAR-DANGLE-01;
- Hub UX Recovery;
- Hub Status Sync v1;
- 90 self-service jobs / 42 READY / 48 HOLD.

Current bot manifest:
- checkedAt: `2026-09-25T17:15:29Z`;
- staleAfterHours: **2**;
- source: HUB-CTRL;
- old WB-W0 and Hürth proof review cards removed from current operational review queue.

This refresh changes live Hub **data**, not the public shell.

### Hub UX

The current v3 Production Desk shell remains **HUMAN TUNE / not accepted**.

Exact accepted donor recovered:
- main commit `dfaafac070747f9543b5eb5a635e2aaa74e57b83`;
- `kfb-hub/index.html`;
- blob `0de46343ddeb70a5f423876e75dc916ae7200c5b`;
- accepted Hub UI v2 Paper/Dark, Today flow and Pocket Inbox.

Prepared Claude Design sprint:
`tools/production_desk/HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md`

Hard rule:
show that exact donor in isolation first, then mount current data into it. Do not redesign from zero.

Candidate UX adds an honest decision queue:
`PASS · TUNE · HOLD · DONE · MISSING`
with local persistence + export/copy sync packet only. It must not pretend to be shared persistence.

### Durable freshness

Root cause of the hours-old state:
GitHub scheduled workflows only run from the default branch, while the Production Desk workflow/config is still on HUB-CTRL.

Prepared Web/GitHub repair:
`tools/production_desk/HUB_STATUS_SYNC_V1_2026-09-25.md`

Target:
public Hub reads fresh bot-registry state within minutes without requiring Cloudflare rebuild for ordinary status changes.

No second database / Worker / D1 is authorized before the raw-GitHub status path is proven insufficient.

### Current gates

1. **HUB STATUS SYNC V1** — make bot-registry refresh durable.
2. **HUB UX RECOVERY** — Claude Design Session Cut from accepted v2 donor.
3. Georg reviews the UX candidate.
4. Only then publish a replacement shell.

No new Live shell is claimed by this checkpoint.

# CURRENT UPDATE · WB-D2 / S40 ROOT HUB PUBLICATION · 2026-09-25

Status: **DEPLOY COMMIT WRITTEN · PUBLIC PROOF RUNNING**

Current Hub source:
- HUB-CTRL root fallback = **90 jobs / 42 READY / 48 HOLD**;
- **19 To-do lanes**;
- WB2 HUMAN PASS → Claude Design remains CAN_START;
- WB-D2 Hürth/Alstädten shell = WAITING behind WB2 Design/Rehome + WB-ZONE-SEAM;
- Resident Disco S40 Bridge = CAN_START;
- B3 Billboard handover ref remains PR #211 branch, not main.

Publication:
- `cloudflare-live@2781b7ba064a6a1bb5eedf8fe736e92fe4ccbf8e`;
- root blob `f934ee1436ee0eb1f7473fce71a448a1dc4bdbe9`;
- source markers verified in the published blob;
- Cloudflare/Public-Proof checks were RUNNING at this checkpoint.

No WB-D2 or S40 product Stage route was created. This publication changes the Hub root only.

---

# CURRENT UPDATE · WB-D2 + RESIDENT S40 HUB ROUTING · 2026-09-25

Status: **HUB SOURCE UPDATED · LIVE REGISTRY REFRESH NEXT**

New Inbox updates classified without promoting Inbox copies to owners:

### WorldBuilder WB-D2
- source upload `706c3f121bc3a305778306917613ea23eb772c16`;
- current Hub lane: **WAITING**;
- Hürth/Alstädten shell is presentation candidate only;
- current priority remains WB2 HUMAN PASS → Claude Design;
- after Web rehome, next integration gate is `WB-ZONE-SEAM-01`;
- Alstädten OSM must be re-cached by OSM City Lab before source promotion.

### Resident Disco S40
- source upload `a46dbdff150362e7153c143b21fa76ffe8ffb5e4`;
- current Hub lane: **CAN_START**;
- use the existing S9/S40 candidate; do not rebuild Source Cast/Audition;
- bridge owner hygiene, one performance transport and Motion Library metadata, then prepare bounded human review;
- unresolved Graft raw@main, mic slot, HIT-2 placeholder, set-not-measured downbeats and Band second transport remain explicit.

Architecture target after this intake: **90 jobs / 42 READY / 48 HOLD**.

No new product Stage route or Live gameplay claim.

---

# CURRENT UPDATE · ROOT HUB CLOUDFLARE PUBLISH · 2026-09-25

Status: **DEPLOY COMMIT WRITTEN · CLOUDLFARE/PUBLIC-PROOF RUNNING · EXACT URL VERIFY UNKNOWN**

Publication:
- `cloudflare-live@8101c2c18f2210720649a3ecb6e3f388176eed23`;
- root blob `ccf3a46dde16e99cdda11b13f628725e690d832b`;
- source root/desk contains **89 jobs / 43 READY / 46 HOLD**, WB2 HUMAN PASS→Claude, LOOP_REAL gate, Direct FBX, v17+ ToolBox and NPC-LIFE markers;
- live registry branch `bot/production-desk-update` is restored and carries the same 89-job self-service source.

Current checks at handoff:
- Cloudflare Pages: **RUNNING**;
- four public-proof jobs: **RUNNING**;
- exact `https://kayfabizarro.pages.dev/kfb-hub/` could not be opened by the available URL tool, so **PUBLIC_VERIFIED is not claimed yet**.

No product Stage route, merge or Live product promotion was changed by this Root-Hub refresh.

---

# CURRENT UPDATE · ROOT HUB 89-JOB REFRESH · 2026-09-25

Status: **SOURCE RENDERED · LIVE REGISTRY RECOVERED · CLOUDFLARE ROOT PUBLICATION NEXT**

Current Hub source:
- HUB-CTRL PR #202;
- rendered root/desk head `51eedf5297b19cfbf6ce1faf2986a941f4942f24`;
- `kfb-hub/index.html` and `tools/production_desk/desk/KFB_PRODUCTION_DESK_V0.html` are byte-identical.

Live registry branch:
`bot/production-desk-update` recovered from HUB-CTRL and refreshed.

Current Registry:
- **18 lanes**;
- **4 LOOK_AT / 7 RUNNING / 2 CAN_START / 5 WAITING**;
- **89 briefings / 43 READY / 46 HOLD / 89 prompts**;
- **10/10 current tools available**;
- Work/WSA = **NOT_NEEDED**.

Current focus visible in Hub:
- WB2 HUMAN PASS → Claude Design authoring/UI refinement;
- WorldBuilder Mobility waits behind WB2 design + technical dependencies;
- Racer RKIT-08/09 → LOOP_REAL first, no world placement yet;
- ToolBox Production / v17+ / Direct-FBX with AN-PROFILE human FAIL kept explicit;
- NPC-LIFE running;
- Music Performance remains a human review item;
- Resident Disco / FrizzleBob body family / Direct FBX / AI-Town-KISS available through the self-service catalogue.

Registry recovery note:
the scheduled bot branch was absent, so this sync restored the branch manually through the existing HUB-CTRL owner. The Hub already prefers this branch before main/fallback.

Exactly one next gate:
publish the rendered root Hub file to `cloudflare-live`, then verify deployment. Do not claim PUBLIC_VERIFIED unless the exact pages.dev route can be opened and the 89-job revision is visible.

---

# CURRENT UPDATE · WB2 HUMAN PASS → CLAUDE DESIGN · 2026-09-25

Status: **WB2 ACCEPTED · CLAUDE DESIGN CURRENT · NO NEW CLOUDFLARE / NO MERGE**

WorldBuilder WB2:
- PR #190 · `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`;
- GEORG HUMAN PASS;
- accepted interaction: Raise/Lower · Radius/Strength · Wheel/Touchpad Radius · Space-Orbit · `1/2/3` · Undo/Clear · Save/Reload · return to shared Object Edit.

Current Hub routing:
- WB2 Claude Design authoring/UI refinement = **CAN_START / P0**;
- use the existing `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` handoff;
- Mobility MVP is now WAITING behind this design gate and its existing technical dependencies;
- Smooth and Flatten/Set Height remain later separate Web slices;
- shared editor R3 uniform `−/+` remains optional/non-blocking.

No new WB2 Cloudflare publication is claimed. PR #190 stays Draft/unmerged.

Architecture self-service target is now **89 jobs / 43 READY / 46 HOLD**.

---

# CURRENT UPDATE · RACER RKIT-08/09 · 2026-09-25

Status: **TRACK-SOCKET REGISTERED · NOTHING DRIVEN · WORLD PLACEMENT BLOCKED**

Race source:
- PR #41 · `chat/rkit-08-09-stunts-2026-09-25`;
- registration implementation head `0bbdc539c0d26c8d1feb40a7eda53162a66e7070`;
- current PR head `22c3b2e2ebb66f1da999116e1b9547ac93d6a91d` (Recovery/Changelog added).

Registered by reference:
LOOP_REAL · LOOP_SLIM · LOOP_MAG_HERO · LOOP_MAG_CASCADE · SKYRAMP-01.

Binding gate:
**Race drives LOOP_REAL first.**

Until that measured Rapier result:
- later stunt modules remain HOLD;
- MAG/cloud-pad behavior remains unimplemented Race-owned work;
- WorldBuilder placement remains blocked;
- no Stage/public gameplay claim.

---

# CURRENT UPDATE · TOOLBOX HUMAN FAIL ALIGNMENT · 2026-09-24

Status: **HUB SOURCE ALIGNED · AN-PROFILE-02 HUMAN FAIL/HOLD · PRODUCT OWNER PRESERVED**

Parallel ToolBox recovery clarified the distinction:
- technical owner/runtime evidence remains useful;
- **AN-PROFILE-02 human review is FAIL/HOLD**;
- observed human failure: source/GLB load failure plus measurement/data palettes obstructing the 3D stage;
- failed review surfaces stay frozen;
- WorldBuilder Motion must not be promoted from that review;
- future State/Action / Direct-FBX work needs a new bounded review surface with real source loading and an unobstructed stage.

Hub Today + ToolBox source card now say this explicitly.

Root 88-job Production Desk regeneration remains pending.

---

# CURRENT UPDATE · MVP FOCUS / TOOLBOX ROUTER · 2026-09-24

Status: **HUB SOURCE CURRENT · TOOLBOX/STAGE SOURCE UPDATED · ROOT 88-JOB DESK REBUILD STILL PENDING**

Architecture source:
`georg-doc/kayfabizarro#204` · current self-service target **13 strands / 88 jobs / 42 READY / 46 HOLD**.

Current visible Hub source changes:
- Today: ToolBox Production/v17+, WorldBuilder Mobility, NPC-LIFE and Racer next gate are current;
- old Dance D1 is retained as history and points to `RES-DISCO-01`;
- ToolBox Stage page now contains **29 cards = 10 public + 5 missing/blocked + 14 source/briefs**;
- all ten public ToolBox routes were re-read on `cloudflare-live@597930b8...`;
- new v17+/Direct-FBX/FrizzleBob-body/Resident-Disco items are explicitly source/brief cards, not fake public previews;
- Stage navigator ToolBox card reflects the same counts/current focus.

Root Production Desk boundary:
- the self-service builder already points at PR #204 and will ingest the 88-job catalog;
- connector-authored commits have not yet produced a fresh Production Desk registry run on this current source;
- therefore **the public root Hub is not yet claimed to show all 88 jobs**.

Work/WSA remains unnecessary.

---

# CURRENT UPDATE · KFB FOCUS RECOVERY / WORK ROUTING · 2026-09-24

Status: **HUB SOURCE METADATA CURRENT · NO ROOT DESK REPUBLISH CLAIMED**

Current architecture recovery source:
`georg-doc/kayfabizarro#204` at `298378fc00f13bcca5fda35b3e1564063d88187f`.

Current focus:
World Building · Resident Scenes · ToolBox · Car Racer.

The three newest Flow Design Inbox exports have been classified in the architecture owner and are not promoted as Hub tools merely because they were uploaded.

Minimal WSA/Work routing:
- current Work decision: **no Work execution**;
- WorldBuilder Flow shell → baked Cologne seam stays Web/GitHub;
- Resident Card / Resident Band wait for Georg visual/pose gates;
- Audio calibration is accepted;
- MUSIC-PERF remains the existing public human-review gate;
- ToolBox direct runtime and repaired plain review transport are green (20/20 coherent · 25/25 Animation Studio · 13/13 plain review);
- Racer TRACK_A real Rapier runtime/contact proof stays with the documented Web/Race owner.

Handoff:
`skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/WSA_WORK_FOCUS_HANDOFF_2026-09-24.md`.

Public root Production Desk refresh remains a separate HUB-CTRL gate. This metadata update does not claim a new public root snapshot.

---

# CURRENT UPDATE · MUSIC-PERF-01 PUBLIC REVIEW MOUNT · 2026-09-24

Status: **STAGE NAVIGATOR + DIRECT REVIEW PUBLIC_VERIFIED · ROOT DESK REBUILD STILL SEPARATE**

HUB-CTRL remains the only Hub/registry/render owner.

MUSIC-PERF source additions on this owner:
- `tools/production_desk/config.json` now contains one `LOOK_AT` lane `music-perf-01`;
- the same config contains one Tool entry `music-performance`;
- `kfb-hub/stage/index.html` contains one Human Gate card linked to the exact Stage route;
- HUB-CTRL source head carrying those additions before this note: `79309a28f90b1b65643ac3ecf13363ae82a01619`.

Public publication:
- exact MUSIC-PERF stage files were mirrored without rebuilding the donor at `cloudflare-live@a29b2cdb140238d2d1056dbffaad7065d87f9fe3`;
- the Stage navigator link was published additively at `cloudflare-live@5658557e8d23a68ea1f5f6183d237c9a3284e29a`;
- direct review: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`;
- Stage navigator: `https://kayfabizarro.pages.dev/kfb-hub/stage/`.

Public proof:
- MUSIC-PERF public QA run `36047130373` / job `107793328531`;
- **22/22 PASS**;
- artifact `10829491166`;
- digest `sha256:d9461a8b85e30b2e53d32b8d26db3af7fbd365147e65b048c465e10c657c2b56`;
- direct route marker, exact ORB/song pins, public scrub/playback, Stage card/link, 0 page errors and 0 HTTP failures all verified.

Important boundary:
- this does **not** claim the generated root `kfb-hub/index.html` Production Desk snapshot has been rebuilt from the newest HUB-CTRL config;
- the existing Production Desk workflow still needs its separate regeneration gate;
- the public Stage navigator is current and reachable through the existing Hub → Stage path;
- MUSIC-PERF human result remains **PENDING**;
- no PR #207 merge or ToolBox owner promotion occurred.

Exactly one next MUSIC-PERF gate:
Georg reviews the direct Stage route and returns PASS / TUNE / REJECT.

---

# CURRENT UPDATE · Recovery test status · 2026-09-24

Status: **TEST FIX COMMITTED · HUB REBUILD NOT YET VERIFIED · PUBLIC REFRESH PENDING**

What happened:
- the last Production Desk workflow failure was traced to a stale browser-test assumption, not to the Hub catalog;
- the test expected the Curtain lane to own a briefing even though that lane intentionally has no briefing now;
- the test was repaired to use any current lane that actually has a real briefing source;
- the current architecture source still contains the two newest READY jobs and remains the regeneration source.

Important evidence boundary:
- the GitHub connector write did not launch a new `KFB Production Desk Registry` workflow run;
- therefore the refreshed 81-job Hub build is still **UNVERIFIED**;
- a Cloudflare preview check started separately, but that is not a substitute for the Hub registry/browser test;
- no public refresh is claimed.

Exactly one next gate:
run the existing Production Desk workflow against the current HUB-CTRL head, confirm the regenerated catalog/browser tests, then use the existing publication path once.

---

# CURRENT UPDATE · Recovery sync · 2026-09-24

Status: **SOURCE SYNC CHECKPOINT · PUBLIC HUB REFRESH NOT YET CLAIMED**

In plain language:
- the current production plan now contains two additional startable briefings:
  1. the Cologne WorldBuilder visual/authoring shell;
  2. the Resident Card speculation scene based on the Pet Podcast donor.
- the architecture source already contains both jobs;
- this existing HUB-CTRL branch remains the only Hub owner;
- the Hub must regenerate from the current architecture source rather than creating another registry or Hub;
- no runtime owner changes, no merge and no Live promotion are authorized by this checkpoint.

Current architecture source for regeneration:
`a7b4d9c4f6e541a50a640f42182d5ec4cf332bd7`.

Expected result of the existing builder:
**13 strands · 81 jobs · 38 READY · 43 HOLD**.

Next gate:
the existing HUB-CTRL pull-request workflow must regenerate and validate the Hub from that source. Only after that evidence exists may the normal publication owner refresh the public Hub once.

---

# CURRENT UPDATE · Toolbox Stage triage · 2026-09-24

Status: **HUMAN TRIAGE APPLIED IN HUB SOURCE · PUBLICATION PENDING**

Removed from the current Hub Tools shelf:
- EyeRig Batch
- EyeRig Legacy
- KayKit Motion Lab v1
- Ranged Calibration v1
- Tileable Macro Seam Lab
- World-Building Preflight

Reason: Georg reports these public Stage surfaces as broken, misleading, incomplete or no longer useful.

Kept:
- Card Zone Lab v2, renamed **Recovery Reference / Donor** rather than current product tool.

Important:
the old pages and source remain in the repository/history. This is a Hub visibility/status correction, not destructive cleanup.

Current productive replacements live in the v3 catalog:
- ToolBox coherent integration
- TB-EYE-01
- TB-POSE-01
- TB-ANIM-01
- WorldBuilder / World Zone / Locomotion jobs

This source correction still needs one Hub regenerate/publish pass before the public page reflects it.

---

# CURRENT UPDATE · Racer external status sync · 2026-09-24

Status: **HUB SOURCE UPDATED · PUBLICATION PENDING**

- HUB-CTRL branch now records Racer at private PR #39 / RKIT-06 / head `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.
- Previous public/registry Racer entry at PR #33 was stale because `build.py` deliberately returns early for `external:true` lanes and never queries private cross-repo state.
- One consolidated Racer lane remains; RKIT #34→#39 are a stacked implementation history, not six Hub lanes.
- Current RKIT-06 package contains TRACK_A_STUNT_8, Pit Lane, SWITCH_Y, flap-return/tunnel shortcut and Trankgasse OSM geometry.
- Next gate: real Race/Rapier runtime test on TRACK_A; WorldBuilder consumes baked geometry/metadata later.
- This checkpoint does **not** claim the public Hub has been regenerated/published yet.

### Durable fix

Recommended low-cost bridge:

`private owner repo → owning Web/GitHub Bridge writes compact status mirror into kayfabizarro → Production Desk reads same-repo mirror`.

This avoids broad private-repo crawl permissions and avoids a Work/LLM refresh just to keep Hub status current.

---

# RETURN · HUB-V3-MOUNT · self-service catalog beside Today · 2026-09-24

Status: **PUBLIC_VERIFIED · 13 STRANDS / 79 JOBS · EXISTING HUB OWNER PRESERVED**

Owner: existing KFB Production Desk / HUB-CTRL PR #202. Architecture source: Draft PR #204 at
`531a8f4c2c26b4f5ed042cc360c49546017641c6`.

## Result

- The current **Today** lanes remain unchanged and answer “what is happening now?”.
- A separate **What you can start** surface mounts the v3 architecture catalog strand-first.
- Default view is 13 collapsed strands, not a 79-card wall.
- Expanded strands group jobs into READY and a second collapsed HOLD list.
- Every job shows executor, model, reasoning and budget; its start action copies the canonical prompt.
- All prompts are extracted from their exact `## promptSection` in `STRAND_BRIEFINGS.md` or
  `SELF_SERVICE_BRIEFINGS.md`. No prompt body is duplicated in Hub config.
- An unreadable catalog degrades only this surface. Today, tools and the independent HUB-CTRL recovery remain visible.

## Evidence before publication

- Production Architecture source: **13 strands · 79 jobs · 36 READY · 43 HOLD**.
- Prompt resolution: **79/79** exact named sections; execution-profile gaps: **0**.
- Python builder/render/validation: **18/18 PASS · VALID · 0 problems**.
- Real Chrome desktop: Today lanes unchanged; all 13 strand cards render collapsed; one strand expands to its
  READY/HOLD jobs; compact execution metadata renders; copy action reports success; **0 console errors**.
- Real Chrome mobile at 390×844: single-column strand view, all 13 areas visible without a 79-card wall.

## Publication state

`PUBLIC_VERIFIED` at `https://kayfabizarro.pages.dev/kfb-hub/`.

- HUB-CTRL implementation branch after mount checkpoint: `work/hub-ctrl-01-2026-09-24@2eee5e4fc99c9dd95f7a46fff9247bcd2adff84f`.
- Architecture source remains unmerged Draft PR #204 at `531a8f4c2c26b4f5ed042cc360c49546017641c6`.
- Cloudflare publication head: `a82c38ccbdda220b668bf71a337df38586c41f3e`.
- Exact public route opened in Chrome with source marker `f89eac1`; Katalog navigation, 13 strands,
  79 nested jobs, compact execution metadata and successful start-copy feedback were visible.
- Public browser console: **0 errors / 0 warnings**.

## One next gate

Use the new WorldBuilder strand to start exactly one bounded next job: `WORLD-ZONE-BAKE-01` (Cologne OSM
Zone Bake) in Web. It is READY and does not require Work or Cloudflare.

---

# Earlier return · HUB-CTRL-01 · never-empty KFB Hub · 2026-09-24

Owner: KFB Production Desk / public route `https://kayfabizarro.pages.dev/kfb-hub/`.

## Root cause

The published `cloudflare-live:kfb-hub/index.html` contained one extra closing brace inside
`#embedded-registry`. The page script itself was valid, but the embedded JSON was not. Live raw registry
sources were unavailable at the same time, so all three data attempts returned nothing and the old UI
displayed “Es konnte kein Stand geladen werden.” The underlying GitHub work was not lost.

## Fix

- The public Hub is again generated from `render_desk.py`; no hand-edited JSON assembly.
- `render_desk.py` reparses the exact embedded payload before it writes the output.
- A separate minimal recovery registry is compiled into the page script. Even malformed live and embedded
  data now leave a visible recovery card plus direct Stage, ToolBox and GitHub links.
- The current embedded snapshot has 14 lanes and includes WB-W0, current Hürth A/B/C proofs, Billboard B2a
  and the Graveyard review route. WB2 is retained as donor and no longer presented as the current world plan.
- Gate proportionality and the current World/Racer/Hub masterplan are visible under working rules.

## Evidence before publication

- Python builder/render tests: **16/16 PASS**.
- Registry validator: **VALID**, **0 problems**.
- Generated embedded JSON: **PASS**, 14 lanes; page-script syntax: **PASS**.
- Real Chrome at local HTTP route: full embedded Hub renders with 3 LOOK_AT, 6 RUNNING, 1 CAN_START,
  4 WAITING and all configured tools.
- Real Chrome with deliberately malformed embedded JSON: `Notfall-Stand`, one recovery card and two direct
  tool links render; the old blank-state message does not appear.

## Publication state

`PUBLIC_VERIFIED` at `https://kayfabizarro.pages.dev/kfb-hub/`.

- `cloudflare-live` publication head: `620c26350d3ecb2ea48b70da42fd92f689911584`.
- The exact public route was opened in real Chrome and visibly showed the current 14-lane Hub.
- Visible counts: 3 LOOK_AT · 6 RUNNING · 1 CAN_START · 4 WAITING.
- Hürth, Billboard and Graveyard review links plus WB-W0, VFX-01 and Curtain-v2 intake cards were present.
- The page rendered from the valid embedded snapshot while GitHub raw propagation was still pending; this is
  the designed fallback, not a blank state.

## One next gate

HUB-CTRL-01 is complete. Start the separate WB-W0 source-lock gate; do not add more Hub architecture.

---

# Earlier return · KFB Production Desk v0 (PD1 + PD2) · 2026-09-23

Executor: Claude Coworker (Opus 5.5), STEP 2 of `COWORKER_OPUS55_SEQUENCE.md`.

## Built

- `tools/production_desk/config.json` — 12 lanes (4 buckets, 2 external), WSA, standards.
- `tools/production_desk/build.py` — online/fixture builder, validator, contentHash (timestamp-free).
- `tools/production_desk/render_desk.py` + `desk/desk.template.html` → `desk/KFB_PRODUCTION_DESK_V0.html`.
- `.github/workflows/production-desk.yml` — schedule/dispatch/main-push, publish to `bot/production-desk-update`.
- `registry/production/v1/*` — canonical snapshot from `snapshots/coworker-2026-09-23.json`.

## Evidence (local, sandbox)

- builder unit tests: **14/14 PASS**
- registry validate: **VALID**, problems 0
- desk behaviour (jsdom, runs the page script): **30/30 PASS** — embedded/Live/Hauptstand source selection,
  poll switch without reload, real brief copy, link fallback, blocked-clipboard manual copy, stale banner,
  launcher rules, "Kein Stand" on no data, no PR/SHA on card faces, external lanes marked LAST_KNOWN.
- publish decision logic: first-publish / unchanged / content-changed / heartbeat — PASS.
- `node --check` on page script: PASS.

## Not verified (honest)

- `--online` against the real GitHub API was **not** run: sandbox has no network. First real run = Actions.
- No real-browser screenshot (no Chromium in sandbox); behaviour covered by jsdom only.
- Travel/Racer: GitHub connector returns 404 for both repos → values are LAST_KNOWN from `CURRENT_STATE.md`.
- PR `updatedAt` for #188/#189/#190/#192 not captured in snapshot (null); heads are from `list_branches`.

## Design deviations from PRODUCTION_DESK_AUTOSYNC_V1.md (intentional)

1. Triggers: added `schedule` (30 min) because lane state lives on unmerged draft branches; main-push alone goes stale.
2. No auto bot PR: the Desk reads the bot branch directly; a PR per refresh would be noise.
3. Heartbeat publish (6 h) so `checkedAt` stays meaningful even when nothing changed.
4. Georg-facing UI in plain German (LOOK_AT → „Schau dir das an“, RUNNING → „Läuft gerade“,
   CAN_START → „Kannst du parallel starten“, WAITING → „Wartet“). Technical facts only in the drawer.

## Human gate

Georg: one decision only — merge the workflow file (or the whole slice) to `main` so the Desk updates itself.
Plus: does the Desk answer „was läuft, was muss ich entscheiden, was kann ich starten“ at a glance?

## Next

STEP 3 — resume ToolBox Source-Safe Integration (state: project memory `toolbox_model_switch_checkpoint`).
