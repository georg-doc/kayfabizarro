# NPC-LIFE-01 · Hub publication failure recovery · 2026-09-28

**Status:** STOPPED_AFTER_TWO_PUBLISH_GATE_FAILURES · CANDIDATE PRESERVED · NO THIRD REPAIR  
**Hub owner:** PR #202 · `work/hub-ctrl-01-2026-09-24`  
**Product owner:** PR #210 · `chatgpt-web/npc-life-01-2026-09-24`  
**Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/resident/npc-life-01/`  
**Public browser status:** UNKNOWN in this recovery slice; do not claim PUBLIC_VERIFIED.

## SOURCE

NPC-LIFE-01 itself is not the failed foundation.

Verified product facts before this recovery:
- deterministic encounter contract: **21/21 PASS**;
- exact proof residents: Resident Atlas `goth-girl` + `toy-soldier`;
- exact Stage payload already exists on `cloudflare-live`;
- published Stage index carries `data-kfb-slice="NPC-LIFE-01"` and `data-source-head="ea157c52dd6cadbae1b0fe40f6cacede65ec9792"`;
- published `app.js` blob `76e8cc5b166188c11948d7e4c101efc72be5eb70` is byte-identical to the implementation payload from PR #210;
- PR #210 evidence head at stop: `b638507eef20ae29f3e3022165714e6d567aef57`, adding only `public-proof.mjs`.

The missing acceptance condition was the generated KFB Hub root link plus an exact public browser proof.

## ATTEMPTS

### Attempt 1 · run 36470315166

Hub source head: `52883aa16253c4e325367ff2d59e7b50fdcd94f4`.

Result:
- Production Desk unit tests: **16/16 PASS**;
- render unit tests: **2/2 PASS**;
- online registry build completed;
- registry format validation: **VALID**;
- closure stopped on **6 registry problems** before Hub render/publication;
- Cloudflare root publish step was skipped;
- no public PASS claimed.

### Repair pass · safe source correction

Commit `a91928febeaeba6f321703f52d1979cde0fb8419` corrected one proven Hub config defect:
- `worldbuilder-mobility-mvp.review.path` used a full Pages URL where the registry router requires a repository-relative published path;
- corrected path: `kfb-hub/stage/world/world-drive-interact-m2a/index.html`;
- exact route existence on `cloudflare-live` was verified before the write.

### Attempt 2 · run 36471270090

Hub source head: `82f6d6dc0ee02752d84180e1761495fafb35563b`.

Result:
- Production Desk unit tests: **16/16 PASS**;
- render unit tests: **2/2 PASS**;
- online registry build: 31 lanes · 3 LOOK_AT · 6 RUNNING · 7 CAN_START · 14 WAITING;
- registry format validation: **VALID**;
- problem count improved **6 → 3**;
- strict closure still failed;
- Hub render/publication remained skipped;
- no public PASS claimed.

Exact remaining problems:
1. `combat-ranged-mvp` · `pr-missing` · external PR #5 not readable by this repository-scoped workflow token;
2. `combat-ranged-mvp` · `branch-missing` · external branch `chatgpt-web/combat-arena-integration-v2-2026-09-19` not readable by this repository-scoped workflow token;
3. `combat-ranged-mvp` · `brief-missing` · the Hub-owned brief is resolved against the Combat repo because the current resolver binds lane repo and brief repo together.

Repair budget is exhausted for this gate. Do not run attempt 3 from this state.

## FAILURE EVIDENCE

The active `combat-ranged-mvp` lane is configured with:
- product repo: `georg-doc/KFB-Combat-Arena` (private);
- product PR: #5;
- product branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`;
- Hub-local brief: `tools/production_desk/briefings/COMBAT_MVP_NEXT_2026-09-27.md` on `work/hub-ctrl-01-2026-09-24`.

The Production Desk online fetcher uses the current repository Actions token and its resolver uses the lane repo for both product facts and brief lookup.

Independent connector readback proves the external product owner exists and is healthy:
- repo: `georg-doc/KFB-Combat-Arena`;
- PR #5: OPEN DRAFT;
- exact head: `d6cf532e64d45fd3117775ec61cfc87b9e948ac0`;
- branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`.

Therefore the three registry problems are a Hub cross-repository resolver/permission contract failure, not missing Combat work.

## PROVEN CAUSES

**PROVEN**
- `kayfabizarro` Actions publication cannot resolve the private Combat repo with its current repository-scoped token.
- The current lane resolver does not have an independent `brief.repo` owner; it attempts the Hub-local brief in the lane/product repo.
- The strict publisher correctly refuses to render/publish while `manifest.counts.problems != 0`.
- Two publication attempts failed at the same strict closure gate; neither reached Cloudflare root publication.

**NOT PROVEN**
- The exact public Pages route for NPC-LIFE-01 has not been browser-opened from a successful proof workflow in this slice.
- No claim is made that the current public Hub root links NPC-LIFE-01.

## SALVAGE

| Part | Status | Evidence / use |
| --- | --- | --- |
| NPC-LIFE runtime + Stage payload | REUSE_CANDIDATE | 21/21 contract PASS; exact cloudflare-live payload already present |
| NPC-LIFE public proof script | REUSE_CANDIDATE | PR #210 head `b638507e...`; not yet executed because Hub root gate is blocked |
| Hub NPC-LIFE lane metadata | REUSE_CANDIDATE | direct review route recorded; publication pending |
| World M2A review-path correction | REUSE_CANDIDATE | removes one real registry defect |
| Diagnostic `REGISTRY_PROBLEMS` log line | REUSE_CANDIDATE | exposes exact closure blockers |
| Current Hub publisher candidate | ARCHIVED_FAILED | two closure failures; no third pass |
| Combat product owner | REUSE_CANDIDATE | healthy external PR #5; must not be copied/rebuilt |

## CURRENT WORKFLOW DELTA TO REMEMBER

The failed Hub publisher candidate currently contains two diagnostic/temporary workflow deltas:
- a temporary `pull_request` trigger added during the bounded publication attempt;
- a `REGISTRY_PROBLEMS` log line before the unchanged strict zero-problem assertion.

Do not silently normalize these during this stopped slice. The recovery owner must explicitly decide when to restore the original trigger after the cross-repo contract is repaired and proven.

## LESSONS LEARNED

1. A cross-repo product lane and a Hub-local briefing cannot share one implicit repository owner in the registry resolver.
2. A connector-visible private repo is not proof that a repository-scoped GitHub Actions token can read it.
3. Publication diagnostics must print the exact `problems.json` before a hard closure assertion; otherwise a valid registry can still fail opaquely.
4. Product Stage readiness and Hub-root publish readiness are separate gates. Preserve the product candidate when a global Hub gate fails.

## EXACTLY ONE NEXT GATE

**HUB-CROSS-REPO-RESOLUTION-01**

Repair the Production Desk cross-repository lane contract with a repository-native test first: the current Combat product facts must remain external/private while its Hub-local briefing can resolve from `georg-doc/kayfabizarro`. The online registry must reach **0 problems** before any third Hub publication attempt is permitted.

No NPC-LIFE runtime change, Combat rebuild, Cloudflare promotion, merge or Live promotion belongs to that gate.
