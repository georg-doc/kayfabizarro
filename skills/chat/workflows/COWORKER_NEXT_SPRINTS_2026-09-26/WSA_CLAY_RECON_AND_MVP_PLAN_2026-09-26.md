# WSA · Claymation recon + MVP plan · 2026-09-26

Status: **RECON LOCKED · GEORG PRIORITY OVERRIDE APPLIED · NO IMPLEMENTATION IN THIS PR**

This file reconciles the new Claymation line with the already-approved WSA dispatcher and current product owners. GitHub state at execution time overrides the observed refs below.

## 0 · Current priority override

Georg's current decision supersedes the former first gate: the texture/Asset-01 byte lock is **secondary** and has already been handled in the Blender MCP workstream. The exact Blender artifact/ref is not present in the GitHub sources inspected by this checkpoint, so no Blender/material PASS is invented here.

Classification:
- Asset-01 byte/hash lock: `DEFERRED_NON_BLOCKING`;
- Clay/Blender result: parallel intake when an exact return ref exists;
- WSA/Work critical path: **WORLD-R2-STAGE-PREP-01** on PR #190;
- Track/OSM/Clay follow-ons remain behind their named owners and are not mass-dispatched here.

## 1 · Exact current source matrix

| Lane | Source / observed ref | Current meaning |
|---|---|---|
| main intake | `main@622249e79f586c648ad175309122cd39a0e273d6` | current uploads / router baseline |
| general WSA + timeout recovery | PR **#222** · `chat/wsa-mvp-dispatch-prep-2026-09-26@974989ae…` | reuse; do not run another broad WSA audit |
| Clay asset + Blender pipeline | PR **#228** · `claude/claybound-blender-lane-plan-2026-09-26@19d51b70…` | primary Clay asset/Blender handoff |
| Clay WSA/consumer recon | PR **#229** · `chatgpt-web/claymation-production-recon-2026-09-26@6d196645…` | ToolBox → WorldBuilder → Race route; briefing Stage PUBLIC_VERIFIED |
| external-source + Gemini QA | PR **#230** · `chatgpt-web/clay-gemini-seam-qa-2026-09-26@b3a2a3da…` | source/provenance review; Gemini rx1f NEEDS FIX |
| this Clay WSA addendum | PR **#231** · `claude/coworker-next-sprints-2026-09-26` | planning only |
| Production Architecture | PR **#204** · observed `77907f00…` | product/owner dependencies; no Work default |
| HUB-CTRL | PR **#202** · observed `251a6e90…` | only Hub/status/publication owner |
| ToolBox r2 review | PR **#221** · `da20e926…` | PUBLIC_VERIFIED · GEORG TUNE · direction accepted |
| WorldBuilder | PR **#190** · `58028b07…` | contract reset PASS; next World gate WORLD-R2-STAGE-PREP-01 |
| Track Core | PR **#219** · `6610e5b0…` | track architecture owner; #222 newer dispatcher treats W0 as startable |
| OSM City furniture | PR **#223** · `5003240a…` | presentation-only city dressing donor/consumer |
| bridge/scenery shells | PR **#226** · `00ad57cf…` observed | scenery only; no new centreline geometry |

## 2 · Clay source truth

### Asset 01 · smooth matte clay r1

Authoritative durable record: PR #228 `ASSET_MANIFEST.json`.

- state: **HUMAN_ACCEPTED**
- tile QA: **PASS**
- size: **1024×1024**
- format: **PNG RGB 8-bit**
- role: **Base Color candidate**
- SHA-256: `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`
- 3×3 QA preview SHA-256: `a1fd17f1ff5b814c754737b3cdf03819dfd5dd4e263dc1f155c8bdd334e83251`
- Blender proof: **0**
- exact PNG repository destination: **UNRESOLVED**
- bounded Dropbox ClayBound search in this recon: **no matching production source found**

Interpretation:
**do not re-open visual acceptance.** The missing gate is byte retrieval + hash identity only.

### Asset 02

Main now contains:
`Asset 02 - ChatGPT-Bild 26. Sept. 2026, 19_08_37.png` via `622249e…`.

PR #228 still records queue item 02 as `DEFERRED_EXPLICIT_USER_JUMP`. No durable QA/approval text for the new upload was found during this recon.

State:
**UNCLASSIFIED_ARRIVAL**.

WSA must not infer PASS, queue completion, dimensions, tileability or Blender role from the filename alone.

### Asset 03 · rough handmade meso-height

PR #228:
- r2: 2048², 16-bit grayscale, Non-Color relative height; **4/4 tile criteria PASS**; human look **OPEN**;
- r3: sculpt direction better, X/Y seam FAIL; **recovery only**;
- same-gate two-repair budget exhausted; no r4 in that slice.

Do not use Asset 03 in a production KFB material until Georg accepts a fresh valid candidate or r2 look.

## 3 · External source decisions

From PR #230:

- **Xargiv / RandTextureGen**: supporting texture-authoring tool. Repository code MIT; generated images recorded as **CC BY**, commercial use allowed with attribution. Do not relabel generated textures CC0.
- **Dandruff Clay seamless pack**: calibration/source pack; inventory after exact arrival/provenance.
- **Clay Knight**: combat feel/behavior reference, not a material/animation owner.
- **Unreal clay stop-motion project**: concept donor only.
- **Belimoth Clay (Classic)**: generative-art patch/environment donor, not the production clay-material source.
- Gemini `rx1f`: 2048² JPEG; CI QA 6/6 executed successfully, but visual/repeat verdict **NEEDS FIX FOR CLAY-ASSET-01**. Preserve only as a later worked/compressed-clay donor.

## 4 · Owner boundaries

Clay does **not** create:
- a new game runtime;
- a global material switch;
- another Asset Registry;
- another terrain/world owner;
- another Track generator;
- another animation/movement owner.

Owners stay:
- raster candidates: **KFB Clay Asset Studio**;
- receiving material exploration: **KFB ToolBox / ClayBound**;
- approved asset discovery: **Asset Librarian**;
- Blender proof: **PR #228 / Blender MCP lane**;
- ToolBox consumer: current ToolBox owner;
- local world: **WorldBuilder PR #190 lineage**;
- geography: **OSM City Lab / current OSM truth**;
- track route/geometry: **Track Core**;
- Race contact/physics: **Race owner**;
- Hub/status/publication: **HUB-CTRL #202**.

## 5 · MVP ladder for WSA

| MVP | Status | Outcome | Required input | Receiver / owner |
|---|---|---|---|---|
| **C0 SOURCE LOCK** | **DEFERRED_NON_BLOCKING** | preserve accepted manifest/hash; no further WSA source crawl | #228 manifest | Clay/Blender owner |
| **C1 CLAY-B0** | **PARALLEL BLENDER LANE · EXACT RETURN REF PENDING** | neutral sphere + one static current KFB prop, same light/camera; T1 Cycles / T2 EEVEE / T3 GLB-safe material scaffold | Blender result as supplied by Georg | Blender MCP / #228 |
| **C2 CLAY-B1** | WAIT C1 | one copy-only current KFB character/material-zone proof; rig/slots untouched; two-pose anti-swim proof | accepted C1 + exact model selection | Blender MCP / ToolBox receiver |
| **C3 TOOLBOX-T1** | WAIT C2 | one in-owner material preview/save-reload/browser review | accepted Blender proof | ToolBox owner |
| **C4 WORLD-W1** | WAIT C3 + current World review gate | one static prop/bounded patch only; preserve terrain/OSM/sky owners | ToolBox look PASS + World owner | WorldBuilder |
| **C5 OMS-LM1** | PREP AFTER C1 | one Kölner-Dom hero override: OSM footprint/height truth + Blender bend/lean/taper + same Clay Master | source-isolated Dom + accepted Clay Master | Blender authoring → OSM/World consumer |
| **RACE CLAY PATCH** | HOLD | one roadside/scenery A/B only; no topology/grip/physics change | Track Core frame contract + prior clay/world proof | Race owner |

### C1 static proof object

Preferred low-risk first object:
one already-existing static KFB scenery/support object, not a new model. SC02 classic support is a viable calibration fixture because it is static and already tracked, but WSA may choose another current exact static donor if source isolation is cleaner.

### C2 character proof

Use one current exact KFB model on a **copy only**. Do not hardcode FrizzleBob unless WSA/source owner confirms the exact current model and material zone.

Asset 01 alone may prove Base Color behavior. Any relief/roughness/micro claim requires a separately accepted data source; do not synthesize those semantics from the color image.

### C5 OMS Dom

This is an authored **landmark override**, not new geography:
OSM footprint/height remains truth; Blender may author elastic-grotesque form. The grotesque read comes from geometry/form, while the accepted Clay Master remains the material family. Integration returns through OSM/World owners.

## 6 · Track/Racer dependency

Do not let Clay work reopen Track architecture.

General dispatcher PR #222 is newer than some wording on PR #219 and records JavaScript as authoritative Track Core with W0 startable. Blender/Python remains oracle/scenery. Until the Track frame contract exists:
- existing scenery may be look-calibrated;
- do not create new drivable hairpins, loops, ramps, crossings or centreline-defining geometry;
- any pre-W0 scenery placement is provisional and may need re-placement.

## 7 · WSA token budget

WSA should read this table, then open only the source needed for the chosen gate.

Do not spend further WSA budget on C0. Preserve the accepted manifest/hash and wait for the exact Blender MCP return ref if that material line needs integration. The missing binary is not an MVP blocker.

## 8 · Timeout/recovery contract

Use PR #222 `LONG_JOB_CHECKPOINT_PROTOCOL_2026-09-26.md` for C1+:
`C0_PREFLIGHT → C1_SOURCE → C2_IMPLEMENTATION → C3_EVIDENCE → C4_PUBLICATION(if needed) → C5_RETURN`.

Before expensive Blender/browser/CI work, persist:
- one owner;
- branch/PR;
- goal;
- last verified head;
- source refs;
- next action;
- Recovery/JOB_STATE.

Timeout or `Stream cache expired` = **UNKNOWN**. Inspect exact ref/run before retrying.

## 9 · Human/public review

Existing Clay recon briefing:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-production/`

It proves the briefing/recon surface only. It does **not** prove Blender material integration.

No new Stage route is created by PR #231.

## Exactly one next gate

**WORLD-R2-STAGE-PREP-01 — package the already-tested PR #190 World r2 candidate exactly for direct KFB Stage/Human review. No World/Track redesign, no Clay dependency, no merge or Live promotion.**
