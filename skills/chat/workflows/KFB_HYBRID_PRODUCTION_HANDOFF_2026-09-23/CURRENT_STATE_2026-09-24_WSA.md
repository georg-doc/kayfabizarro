# KFB WSA Current State · 2026-09-24

Status: READ-ONLY CONSOLIDATION ROUND 01 · ITEMS A–F ONLY · NO MERGE · NO DEPLOY

Control source before this write: georg-doc/kayfabizarro / chatgpt-web/kfb-hybrid-production-handoff-2026-09-23 @ a4bd9fb754b042411df85acaeb49b80748842609.
Protocol adopted: skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md @ main blob fb23165f… . Every open item below is classified before more Work/Claude budget is spent.

## Decisions 1–8 remain locked

1. GitHub is the only implementation SSOT; Dropbox/local are source inputs only.
2. World base is continuous terrain on a sphere. ZyFou Planet is the MIT donor. Travel Globe terrain is not the new world base. TinySkies contributes sky/weather/day-night/mood and a flight-camera idea only.
3. The next visible world build remains Claude Design WorldBuilder v1 from START_CLAUDE_DESIGN_WORLDBUILDER_V1.md.
4. Elastic Grotesque Clay Hürth V2 remains TUNE ONCE; Clean/Cartoon/Grotesque stay switchable.
5. Raw Mixamo FBX stays private; runtime motion output may enter the public motion library. EyeRig is on by default.
6. Review transport remains an unchanged multi-file app behind a small base-href wrapper pinned to an exact commit.
7. One live KFB Hub; Production Desk is config-driven and not merged.
8. Racer remains on Stunt PR #33 R3d TUNE; next is Anatomy Foundation, not vehicle grounding.

## Gate proportionality

- CORE_BLOCKER: prevents the smallest intended loop or boot.
- ACCEPTANCE_BLOCKER: prevents a named human/public gate.
- MINOR_QUARANTINABLE: one actor/asset/attachment/detail can be held while the proven set continues.
- COSMETIC_DEFERRED: polish only.
- A minor item gets one focused diagnosis, then HOLD. A core/acceptance item gets one diagnosis and one repair pass; a second pass is allowed only after measurable progress.

## A · Current public-repo PR census (all open PRs #174–196)

| PR | Exact head | State | Decision / proportionality | Owner | Single next gate |
|---|---|---|---|---|---|
| #174 Resident Story Zones | 8e147c62bcf38c4a8763bb14e0f4f420cf996265 | HOLD · planning only | Not runtime truth; reconcile with current main. | Resident Story / World life | Reconcile once after WorldBuilder base is stable. |
| #175 WB1-P0 | 17fd31a907b4346fddef7501490f738c251c2a37 | COMPLETE · historical | Source/license gate passed; later gates supersede it. | WorldBuilder evidence | None; consume evidence only. |
| #176 post-WB1-P2 ToolBox plan | 44cd0a25372925409e335f5a216a5d77cac5181a | HOLD | Older consolidation plan; current ToolBox owner is #185. | ToolBox planning | Route useful notes through #185 only. |
| #177 WB1-P1 Environment Profile | 6cbe54f343a8b7fb07f1b6b9fe4e8a6e52bf509b | ACCEPTED donor | Human scope PASS; 8/8 + 4/4 + public browser PASS. | WorldBuilder environment | Consume in WorldBuilder v1; no repair. |
| #178 Racer RSTAB mirror | df82e1fa31213d21c13af1f39f369608078633a3 | HOLD · historical | Old seam foundation superseded by Stunt PR #33. | Racer mirror | None; retain evidence. |
| #179 Orc Raider texture map | 0ad133b373c8ac41c024e9a97753234f46848c45 | MINOR_QUARANTINABLE | One source packaging anomaly must not block roster/world. | Asset Librarian / texture adapter | One isolated texture-adapter proof, otherwise HOLD actor. |
| #180 WB1-P2 rigid Hex proof | c35bc76486891973a8f64b18f153b44468770ff0 | REJECTED visual · evidence retained | Visible rigid Hex macro-world rejected. | WorldBuilder research | No repair; use terrain-first reset. |
| #181 TMB1 CardCarrier proof mirror | 8979fd0f55fdbd2b28632f3da158d2e1c19f4ca6 | HISTORICAL checkpoint | Superseded by accepted TMB1E/TMB2. | Travel mirror | None. |
| #182 TMB1 ActionFigure proof mirror | b7308cecd8a0d9e9e768bdeeb5c58adc9424d887 | HISTORICAL checkpoint | Superseded by accepted TMB1E/TMB2. | Travel mirror | None. |
| #183 TMB1 neutral mount mirror | a9fda3322127744634d7829b269adafdec4cc44d | HISTORICAL checkpoint | Superseded by accepted TMB1E/TMB2. | Travel mirror | None. |
| #184 TMB1 Surf mirror | 017906a2f201fcf4ee21deceec4fba1e632e4a6e | HISTORICAL accepted direction | Later Travel PRs carry current truth. | Travel mirror | None. |
| #185 ToolBox source-safe integration | 2833674b36be707fa4d14c8b532faee78ef3ba28 | ACTIVE · ACCEPTANCE_BLOCKER | Current ToolBox milestone owner; no fake thumbnails/second owners. | Coworker / ToolBox | One coherent Source-Safe Integration 01 review artifact. |
| #186 WB1 terrain scene editor | 7267185cdbdc60e576b946ee589f0b2e932c8c8b | ACCEPTED donor | R1/R2 human PASS; shared edit-layer remains sole transform owner. | WorldBuilder scene authoring | Consume accepted editor in WorldBuilder v1. |
| #187 Coworker WS0 | 3ae2b8a22dbf75beeb044844df5dc1a880642263 | SUPERSEDED | Do not route current work here. | Historical control plane | None. |
| #188 Billboard media | 00583a6758b09da4533cc7773a29205f5099fa8f | REJECTED candidate · HOLD | First output was asset-URL theatre; not MVP critical. | Billboard visual slice | B0 source-card proof only when reopened. |
| #189 Theatre Curtain | dfd39255811e6f5b7cdde4092beb753d2b40713b | REJECTED candidate · HOLD | Visual module is not a current core blocker. | Curtain module | One exact donor/source visual gate when reopened. |
| #190 WB2 terrain sculpt | 5a98e674184ea4694a5ad7d696d8cc84c1618bdf | ACCEPTED | Human ACCEPT at tested 8922d4b1; wheel-radius wish is COSMETIC_DEFERRED. | WorldBuilder sculpt | WorldBuilder v1 composition; wheel-radius may be a cheap later patch. |
| #191 Production Flow v2 | ef379d3acbdf36a298e39e1a39267c54d2ea4a78 | SUPERSEDED | Do not route current work here. | Historical control plane | None. |
| #192 Blender animation POC | b49fb6e1adde070d658e1cc21dadb3294164cb29 | ACCEPTED POC · integration open | Juggling visual PASS ~80%; browser playback not proven. | Blender animation lane | JUG-P2 exact GLB playback in existing three.js consumer. |
| #193 Hybrid production handoff | a4bd9fb754b042411df85acaeb49b80748842609 pre-write | ACTIVE control plane | This round only; branch advances with these return files. | WSA/Coworker bridge | Human chooses next bounded MVP after this return. |
| #194 Hürth Elastic Grotesque Clay | 1742a4d05851af68bc5024e2527bad0b0ff14b95 | TUNE ONCE · ACCEPTANCE_BLOCKER | Shape/facade direction accepted; current visual tune remains bounded. | OSM presentation / form language | One visual TUNE, then ACCEPT or REJECT. |
| #195 Orc band | e2250c96e26ae67f4e518552e1a1b2176a58f4e4 | PARTIAL ACCEPT · drummer HOLD | Leader/guitar accepted; drummer is MINOR_QUARANTINABLE/manual. | Blender band module | Georg manual drummer pose task; no automated arm-patch loop. |
| #196 | — | NOT OPEN | Referenced as a manual drummer task, but no open PR #196 exists in the refreshed census. | Georg / Blender task | Create only if/when the human task needs GitHub tracking. |

## A/B · Private Travel census

Main: georg-doc/KFB-Travel-Globe @ 8614282aab2ced43bb5dda9fcf7abadf9768100a.

| PR | Exact head | Classification | Current use / next gate |
|---|---|---|---|
| #38 | 08147fb4a6726f4c0248ff79ade67eec24afdbca | HUMAN ACCEPTED | TMB2 400 ms closed; TMB3 landing HOLD until explicitly opened. |
| #37 | 603f2a9e8fb2c8efd1008ed67607cf7a712de0bd | HUMAN ACCEPTED | TMB1E closed; source for #38. |
| #36 | 88382c111acf32f6b934c15ce7b6b1f6d4d15283 | HISTORICAL | Surf checkpoint, superseded by #37/#38. |
| #35 | 2b4e5969a19fa55aa75951d0ac2f1be5400a596b | HISTORICAL | Neutral mount checkpoint. |
| #34 | c6d2e0d14254dd5c48160bbc1d13decb6d29078b | HISTORICAL | ActionFigure source proof. |
| #33 | 397e84f47e66bf760944af81fb2a17e11da1f04d | HISTORICAL | CardCarrier source proof. |
| #32 | 048499315581d2b9916a4d3fcbaba5f3adef719c | HISTORICAL | Mode-bridge seam lock. |
| #31 | 35a0b6c8380feb009bd27f1ca811064c1ad74be7 | HOLD / wrong world-base premise | TC-01 evidence only; do not promote Travel terrain as world base. |
| #30 | ee240a72cfa2305a77a1a083636f567d1fb9d482 | HOLD / donor evidence | TinySkies terrain isolate is not new macro-world ground. |
| #8 | bbf78434aea3ea25e3f6d2ee4e8ec673af1cf2b8 | HOLD sidequest | Birthday visual slice, outside current MVP. |
| #7 | cae4a1104a4e6f29c721da7227f556bd717de7be | HOLD sidequest | Bath-flight slice, outside current MVP. |

Reusable Travel facts, without reviving Travel as world base:
- Input/mode seam: PR #38 paths site/world-builder/mode-intent.js, ground-controller.js, wb0.js; accepted 400 ms double-Space; 119/119 PASS recorded.
- Sky/weather/light donors on kayfabizarro main: travel/wip/travel_globe_wsa/globe-v13/{sky-presets,sky-atmosphere,day-night,weltstimmungen,rain-overlay,starfield,sun-shadow,light-budget}.js.
- TinySkies files are not standalone modules: most assume a host-provided global THREE; day-night.js and light-budget.js also require relative sky-presets.js. Preserve one Three instance/import map and adapt through an explicit host wrapper.
- Superseded: Travel terrain-surface as universal world ground; TC-01 as final track/world architecture.

## A/B · Private Racer census

Main: georg-doc/KFB-Stunt-Car-Race @ 3ef3ebec6975736edb6ec8d5dabebc4ee5b51402.

| PR | Exact head | Classification | Current use / next gate |
|---|---|---|---|
| #33 | 71e7051b2eea1ad731912b634f44ce5ba0218736 | ACTIVE · TUNE | R3d track/barrier/ground reviewed TUNE; next is closed Racer Anatomy Foundation packet. |
| #32 | 9e4636a1ca7dc337d5ba8e5c22d3300a69c3fd31 | REJECTED foundation | Failure recovery only; no third seam patch. |
| #31 | 58d837a5b858bdf7af178bcf0bb578d6ab018ff4 | COMPLETE audit | Valid source lock/base evidence for #33. |
| #30 | f4436c83c674bc5bde017a0c33ca19e5da682894 | HOLD | HUD v4 plan waits for accepted track/world seam. |
| #29 | a47047be2cb63f1c1fa2f70d1d1bf4f5411ce8cc | FROZEN wrong foundation | Historical only. |
| #28 | 8918471bf6c5e3fa1b945109fd37019df600cad6 | HOLD / older HUD | Donor only; #30 is later briefing. |
| #25 | af1da3a1112720145cc9194b502ae784967f8354 | HOLD donor | Industrial HUD donor, not active runtime gate. |
| #24 | 37ba93f45d07660ed69a7d049840581612d8a14a | HOLD donor | OSM depth/Ink donor; world presentation now belongs to composed look lane. |
| #23 | 167f4d8620c6a68ded1b8b50da49df53fd473b63 | HOLD donor | 3D HUD component grammar only. |
| #22 | b169ddec8770ba29c5d7ef667f25d2c886445e7a | HOLD donor | Track/environment design notes only. |
| #17 | ca580109d346b16c0ad0663816668b2c35e77ed8 | HOLD legacy | OSM visual parity evidence. |
| #14 | 4136fd04ac28a6c0dc5e8ed2aff623cac8e8f3c7 | HOLD POC | Older ribbon grammar. |
| #13 | f1e185fa839930c7fd1084460e578bb0e9587b95 | HOLD docs | Design grammar reference. |
| #12 | 5f97f462a814dffac6f7d2c3a0abeb05f4f8f90a | REUSABLE route donor | Hürth–Ehrenfeld OSM corridor; placed-content source, not terrain owner. |
| #11 | 3c8e84b0020e26957431c8ae61699e7396f079c0 | HISTORICAL docs | Old handover only. |
| #10 | 406cd26f44f22811fe3b3a58776839be7ffb7b2c | HOLD donor | Vehicle Deformer v2 evidence; not current track gate. |
| #9 | c9bed546f6bd290fba48df596ff7e9132c3df22c | REUSABLE OSM donor | Hürth/Ehrenfeld cartoon/Grotesk evidence. |
| #1 | 22cc70efd0ae1e6c6e020c1bd3d1ed5a56cf1a79 | HISTORICAL setup | No current gate. |

Reusable Racer facts:
- Current owner paths on PR #33: KFB Cologne Race Option C-3/lab-v9/cologne-route.v1.js, cologne-track.v1.js, cologne-tunnel-architecture.v1.js, cologne-world.v1.js.
- Current return/evidence: _handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/RETURN.md and review/R3d_TUNE_2026-09-23.md.
- Accepted donor behavior: one route/causeway, dense arch scenery, no second road/contact owner. SP13KTRA remains observation-only because its license is All Rights Reserved.
- Superseded: RSTAB-1 ground-cut/shell seam and all blind coefficient/micro-patch chains.

## C · Proposed private-to-public status bridge (not deployed)

Smallest safe bridge:
1. Travel and Stunt each emit one sanitized repository_dispatch payload to georg-doc/kayfabizarro after main/PR status changes.
2. The public repo workflow writes only status/private/KFB-Travel-Globe.json and status/private/KFB-Stunt-Car-Race.json on a dedicated status branch.
3. Production Desk reads those two tiny JSON files. No private source, PR body, file path, log or artifact is copied.
4. Payload fields: repoAlias, mainSha, selectedPr, selectedPrHeadSha, state, checkedAt, publicSafeSummary.

Georg must create one fine-grained PAT named KFB_PUBLIC_STATUS_TOKEN and store it as the same Actions secret in both private repositories. Scope it only to georg-doc/kayfabizarro with Contents: write (needed for repository_dispatch on the target). Preferred long-term alternative: a GitHub App installed on exactly these three repos; do not create either credential from a chat.

## D · cloudflare-live route audit; no restore

- Current cloudflare-live head: 9c0756004ccc3a56664fe46ce923c35c6780522b.
- Current main head: 380bca340ca0da34e5968d0ddc8fc4814a063dea.
- Branches are deeply diverged (cloudflare-live ahead 248 / behind 572 relative to main).
- Contrary to the earlier symptom, the current Git tree contains kfb-hub/pruefen/travel-welt/index.html and kfb-hub/pruefen/free-roam/index.html on cloudflare-live; neither exists on main.
- Therefore no current Git deletion can be proven. The likely loss mechanism is branch/snapshot publication drift: review routes are branch-only ad-hoc files and are not rebuilt from a canonical keep-manifest. A deploy/snapshot from main can omit them.
- Browser re-verification is UNKNOWN in this runtime: pages.dev and direct jsDelivr were blocked by the available viewers. No PUBLIC_VERIFIED claim.

Wanted routes under the locked direction:
- travel-welt: remove from active review navigation; retain only as clearly labelled ARCHIVE / Travel legacy evidence if preservation is useful.
- free-roam: keep as LEGACY FREE-ROAM BASELINE / HOLD because movement/OSM exploration remains useful, but explicitly state that it is not the new world base.
- huerth-look and gelaende-formen: keep current review routes.
- Later fix: one canonical route manifest plus a publication job that refuses to drop keep=true routes. Not implemented in this round.

## E · knowledge return from prior lead rounds

No reliable implementation fact remains chat-only after this audit. The useful lessons are already on GitHub: GitHub SSOT, donor-first, exact multi-file review wrapper, Gate Proportionality, terrain-first reset, Combat smallest-loop rule, and failure-recovery after two failed passes. Chat-memory-only claims remain non-authoritative and were not promoted.

Two policy gaps still need canonical text later:
- active-review versus archive-route lifecycle for kfb-hub/pruefen routes;
- the exact sanitized private-to-public status-bridge contract above.

## F · wrong things only, one line each + fix

1. WRONG: TERRAIN_FIRST_RESET section 5 still says Travel/TinySkies is the current runtime/world owner; FIX: state Travel is a legacy integration donor and TinySkies supplies only sky/weather/light/flight ideas, while continuous sphere terrain is the new WorldBuilder base.
2. WRONG: current Hub still uses the generic label Legacy Actor Kit for the 17-head lane; FIX: say Legacy roster, with Dungeon Pack 1.0 as the only modular kit and Skeletons/Spooktober/Orc Warband as complete characters (main commit 380bca34 already corrects the detailed handoff).
3. WRONG/UNKNOWN: WB2 is sometimes described as freshly jsDelivr browser-tested here; FIX: static pin contract passes (Three 0.160 import map + resolvable relative edit-layer/terrain-sculpt files), but this runtime blocked jsDelivr, so current browser re-test is UNKNOWN. ZyFou f58a8ddb has a real MIT Planet bundle/PlanetWorld cube-sphere implementation. TinySkies modules require host global THREE and relative sky-presets; wrap them explicitly.
4. WRONG: LOOK_COMPOSITION_01 prefixes three landmark files with tools/img2threejs/landmarks/pilot-06/; FIX: use tools/img2threejs/styles/landmark-world-style.mjs, tools/img2threejs/styles/landmark-style-profiles.v1.json, and tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_2026-09-19.md. Other checked donor paths are present.
5. WRONG: ANIMATION_INTAKE calls PRs #192/#195 a proven generic retarget path for all 33 clips and both rigs; FIX: #192 is authored Rig_Medium juggling with no retarget/browser playback, while #195 proves exact transfer for KayKit-skeleton Mixamo clips and one accepted Raider guitar fit. Inventory every FBX skeleton first; exact-transfer compatible clips, retarget only measured exceptions, and prove one clip per rig before batch.
6. WRONG: Production Desk fixture is current; FIX: its branch head 0e5d41e2 snapshot was generated 2026-09-23 22:23 and still pins older PR heads (for example #194 7ad083b0 versus current 1742a4d0), so refresh before using it as a status surface.
7. WRONG: travel-welt and free-roam should both remain active current reviews; FIX: archive/unlink travel-welt, keep free-roam only as a labelled legacy movement baseline, and do not restore or deploy anything in this round.
8. WRONG: route lifecycle and private status sync are already canonical; FIX: add the two missing policies listed in section E in a later dedicated documentation slice.

## Exactly one next gate

Georg reviews this state/return and selects one bounded MVP lane. No implementation, merge, route restoration or publication is authorized by this consolidation round.