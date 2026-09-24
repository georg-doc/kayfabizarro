# RETURN · AN-PROFILE-02 · ToolBox Animation Studio consumption

Date: 2026-09-24  
Status: **IMPLEMENTED · CI PASS · CHAT HUMAN REVIEW OPEN**

## Repository / owner

Repository:
`georg-doc/kayfabizarro`

Existing ToolBox owner:
Draft PR **#185**

Branch:
`chatgpt-web/toolbox-source-lock-2026-09-23`

ToolBox state before this slice:
`a6dff1a4e465433daea7f38618b3925db6714b90`

Runtime-tested AN-PROFILE-02 head:
`93d9dd6f763c064313fe5d3bef690496487145a9`

Handoff head immediately before this Return:
`144d88ba8344312533a6ce2ff3b8b24cffb53b5a`

Read back the exact final branch head after this Return commit; do not substitute the pre-Return head for the final handoff head.

No new PR was created. This follows Production Architecture v3's one-active-integration-PR-per-owner rule.

## Outcome

AN-PROFILE-01 is now consumed by the **current ToolBox Animation Studio surface** rather than remaining metadata only.

The existing donor/owner remains:

`tools/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html`

This does **not** promote the older standalone Animation Lab node as a separate current tool.

## What is now usable

Inside the existing v3 clip browser / Inventar / Data UI:

- Rig_Medium lazily loads its real **33-clip** KFB Motion Library;
- Rig_Large lazily loads its real **33-clip** KFB Motion Library;
- KFB clips enter the existing `allClips() → selectClip() → AnimationMixer` path;
- semantic Motion filters are generated from measured profile state families;
- search includes state/gait/direction/stance/root-travel semantics;
- Inventar/Gallery shows KFB Motion identity, semantic family/direction and reference speed when measured;
- Data shows:
  - state / gait;
  - loop;
  - direction / stance;
  - root mode + travel metres per cycle;
  - measured-derived reference speed;
  - foot-contact/planted status;
  - hand-contact status;
  - acceptable-rate-window status;
  - explicit measured action markers;
  - immutable AN-PROFILE evidence source.

Unknown stays unknown:
- Rig_Large foot contacts are not copied from Medium;
- hand contacts remain unmeasured;
- per-clip acceptable rate windows remain unknown;
- action markers are not inferred from filenames.

## Source chain

ToolBox current owner:
PR #185.

Production Architecture v3:
PR #204 · T4 Animation Studio inside ToolBox.

AN-PROFILE-01:
PR #206 · exact source head
`032c9d50cd5de6764fa37fec65cb203ed35fcb11`.

Motion Library:
PR #197 · 33 clips each on Rig_Medium / Rig_Large.

The consumer adapter pins the immutable AN-PROFILE-01 commit. It does not copy the profile JSON or GLB libraries into ToolBox.

## Owners preserved

No new:
- AnimationMixer owner;
- WebGL renderer;
- animation database;
- movement owner;
- physics owner;
- gameplay-state owner;
- persistence schema;
- local motion-library binary copy.

Measured before/after:
- `new THREE.AnimationMixer`: **3 → 3**
- `new THREE.WebGLRenderer`: **2 → 2**

The same existing Stage mixer remains selected-clip playback owner.

## Tests / evidence

GitHub Actions:

Run:
`36032905791`

Job:
`107745811232`

Conclusion:
**SUCCESS**

### Existing regression suite

- coherent static/source/owner: **22/22 PASS**
- coherent Chromium flow: **20/20 PASS**

### AN-PROFILE-02

- static/source/contract: **34/34 PASS**
- Chromium Animation Studio: **25/25 PASS**

Total assertions in the successful owner run:
**101/101 PASS**

Additional exact-GitHub source sanity before CI:
**32/32 PASS**

Browser proof includes:
- 33/33 Medium clips;
- 33/33 Large clips;
- real Run Forward playback through existing mixer path;
- semantic locomotion filtering;
- semantic travel search;
- visible measured Data rows;
- Medium measured feet;
- Large foot contacts explicitly unknown;
- Large reference speed from its own measured travel distance;
- hands unknown;
- no invented run markers;
- explicit climb `endsOnTop`;
- **0 KFB Motion/profile network failures**;
- **0 page errors**.

Screenshots:
**0**. Browser assertions are the recorded technical proof; human visual/usefulness review is still open.

Hub inline JavaScript after routing update:
**1/1 syntax PASS**.

## Files changed by this slice

Relative to ToolBox pre-slice head `a6dff1a4...`, before this Return: **13 files**.
With this Return: **14 files**.

1. `.github/workflows/toolbox-coherent-integration-01.yml`
2. `kfb-hub/index.html`
3. `skills/chat/START_HERE.md`
4. `tools/KFB-ToolBox/CHANGELOG.md`
5. `tools/KFB-ToolBox/START_HERE.md`
6. `tools/KFB-ToolBox/_handover/AN_PROFILE_02_2026-09-24/SOURCE.json`
7. `tools/KFB-ToolBox/_handover/AN_PROFILE_02_2026-09-24/START_HERE.md`
8. `tools/KFB-ToolBox/_handover/AN_PROFILE_02_2026-09-24/TEST_REPORT.md`
9. `tools/KFB-ToolBox/_handover/AN_PROFILE_02_2026-09-24/RETURN.md`
10. `tools/KFB-ToolBox/_handover/TOOLBOX_COHERENT_INTEGRATION_01_2026-09-24/RETURN.md`
11. `tools/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html`
12. `tools/KFB-ToolBox/stage-first/src/lab/motion-library.v1.js`
13. `tools/KFB-ToolBox/stage-first/test/an-profile-02.browser.mjs`
14. `tools/KFB-ToolBox/stage-first/test/an-profile-02.static.mjs`

## Router / Hub synchronization

Updated in the same handoff:
- ToolBox current START;
- ToolBox additive CHANGELOG;
- current Coherent Integration Return;
- central `skills/chat/START_HERE.md`;
- KFB Hub source.

Central Router and Hub were rebuilt from the current `main` versions at write time, then given the current #185 / AN-PROFILE-02 state. This avoids regressing parallel main work while retaining the current ToolBox owner state.

No Cloudflare publication was performed.

## Review / Stage

Direct review:
**Chat HTML first**.

Review artifact:
`AN_PROFILE_02_REVIEW.html`

Human question:
Is the 33-clip Library now useful/readable enough — especially search/filter, semantic labels and the measured Data panel?

Future Stage route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/animation-studio/`

Status:
**NOT PUBLISHED · NOT PUBLIC_VERIFIED**

Do not claim this route live.

## Unresolved

- Georg human review is open.
- The broader Coherent Stage-First human gate is still not retroactively accepted by this slice.
- WorldBuilder Motion consumption remains HOLD.
- TB-EYE-01 remains a later ToolBox capability.
- No merge / Live promotion is authorized.

## Exactly one next gate

**AN-PROFILE-02 HUMAN REVIEW · direct Chat HTML**

Open `AN_PROFILE_02_REVIEW.html` and judge only:
1. browse/filter/search the real KFB Motion clips;
2. select a few clips on the current actor;
3. inspect Data;
4. verify the distinction between measured Medium feet and unknown Large feet;
5. check whether root/travel/speed/marker facts are understandable and useful.

If accepted, the next technical consumer may be WorldBuilder using the same shared profile layer. Do not build a second WorldBuilder motion database.


## ADDITIVE CORRECTION · Chat review transport

The original two DC-based Chat attachment transports failed at the human visualization surface:
1. raw DC bindings/placeholders visible;
2. Chat visualization error after inlining the DC runtime.

They are frozen as `ARCHIVED_FAILED_CANDIDATE` transport attempts. Product/runtime evidence above remains valid.

Current human-review surface is now:
`tools/KFB-ToolBox/stage-first/review/an-profile-02-review.html`

It is a purpose-built **plain Three.js review adapter** using:
- real pinned Mannequin Medium/Large source actors;
- real 33-clip-per-rig KFB Motion Library GLBs;
- real motion catalogue;
- real AN-PROFILE catalogue;
- ordinary DOM/Three.js only;
- no DC compiler, proxy geometry or copied profile database.

Final review validation:
- technical review head: `ce3181bbf9114b7f00086368130fe610fd5810c7`;
- Actions `36055391088 / 107820911138`: **SUCCESS**;
- plain review: **13/13 Chromium PASS**;
- full successful owner run: **114/114 PASS**;
- 0 page errors;
- 0 failed source/module requests.

The current human gate is still exactly one gate:
**open the plain review HTML and judge Library/Data usefulness.**

No Cloudflare publication or Live claim was added.


## HUMAN REVIEW RESULT · FAIL

Georg reviewed the final plain Three.js review surface in the actual Chat visualization host and rejected it.

Observed:
- `source failed`;
- visible `GLB failed: Mannequin_Medium...`;
- no actor/animation could be meaningfully inspected;
- independently of that source failure, Georg reports the measurement/data palette layout obscures the stage so much that the actual motion would not be meaningfully visible.

Human result:
**FAIL / NOT ACCEPTED**

This supersedes all earlier “human review open / review-ready” wording for AN-PROFILE-02.

The repository/browser CI remains technical source/runtime evidence only. It does **not** override the human-facing failure.

Current status:
- Animation Studio consumer implementation: technically evidenced;
- supplied human review surface: **FAILED**;
- Cloudflare: not published;
- WorldBuilder Motion consumption: **HOLD**;
- no further repair pass in this slice.

Exactly one next gate:
**HOLD until a new bounded review-surface brief is explicitly started.**
That future brief must prove the actual review host can load the source assets and must keep the 3D stage visually dominant and unobstructed by measurement palettes.
