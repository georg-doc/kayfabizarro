# AN-PROFILE-01 · TEST REPORT

Date: 2026-09-24  
Owner: KFB ToolBox / shared motion metadata  
Branch: `chatgpt-web/an-profile-01-motion-profile-enrichment-2026-09-24`

## Scope tested

This slice adds metadata only. It does not add an animation runtime, mixer, movement state machine or WorldBuilder movement owner.

Tested artefacts:
- `KFB_Motion_Library.profile-catalog.v1.json`
- `motion-profile-reader.v1.js`
- `source/test_an_profile_01.mjs`
- source catalogue relationship to PR #197

## Deterministic GitHub-branch validation

Executed against the exact files fetched from the AN-PROFILE-01 branch after commit:

`53380ee546d107041d181f515353403a8b23cdef`

Result:

**1603 / 1603 PASS · 0 FAIL**

Coverage includes:
- profile schema and exact 33/33 clip coverage;
- exact clip-id equality with PR #197 source catalogue;
- source duration/root mode/direction preservation;
- measured Rig_Medium foot windows preserved verbatim;
- derived phase/seconds planted intervals remain within clip bounds;
- travel reference speed arithmetic = `abs(travelMetersPerCycle) / durationSec`;
- in-place clips receive no fake locomotion reference speed;
- Rig_Large foot contacts remain `UNKNOWN_NOT_MEASURED`;
- hand contacts remain `UNKNOWN_NOT_MEASURED`;
- per-clip acceptable playback-rate windows remain unknown;
- contact/release/impact/recovery markers remain null unless explicit evidence exists;
- explicit `endsOnTop` marker survives for `kfb_climb_to_top_a`;
- seated/kneeling stance tags are only applied where source evidence exists;
- unmeasured stance remains `unknown`;
- ToolBox Animation Studio and WorldBuilder consumer contracts are present;
- reader exposes metadata accessors and contains no `AnimationMixer`.

## Repository-native Node validator

File:

`media/3D_Assets/Animations/KFB_Motion_Library/source/test_an_profile_01.mjs`

A local container attempt was made against the exact commit content.

Result:

**0 assertions executed · ENVIRONMENT BLOCKED**

Observed error:

`curl: (6) Could not resolve host: raw.githubusercontent.com`

The failure occurred while trying to materialize the GitHub commit into the local container; the Node test itself did not start. This is not counted as a test failure or PASS.

## GitHub Actions

Workflow:

`.github/workflows/an-profile-01.yml`

At the first post-write query for head:

`53380ee546d107041d181f515353403a8b23cdef`

GitHub returned **0 workflow runs**.

Status at this checkpoint:

`CI_PENDING / NOT CLAIMED`

A pull request may trigger the same repository-native Node validator. Do not claim `CI_PASS` until a run exists and completes successfully.

## Browser / Cloudflare

Browser runtime tests: **0 by design**  
Cloudflare deployment/public verification: **0 by explicit scope**

Reason: AN-PROFILE-01 is a reusable metadata layer. Georg explicitly requested small steps and no waiting on Cloudflare. Existing runtime/browser owners remain unchanged.

## Current evidence state

- deterministic profile validation: **PASS · 1603/1603**
- repository-native Node validator: **PREPARED**
- GitHub Actions: **CI_PENDING**
- browser/runtime: **NOT REQUIRED FOR THIS METADATA CHECKPOINT**
- Cloudflare: **HOLD / NOT PUBLISHED**
- human motion acceptance: unchanged from source owners; no new acceptance inferred
