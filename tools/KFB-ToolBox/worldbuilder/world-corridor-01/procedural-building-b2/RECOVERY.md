# RECOVERY · PROCEDURAL BUILDING B2 → B3

Status: **RECOVERABLE · B2 PASS · NEXT = REAL OWNER REHOME + WORLDBUILDER CONSUMER**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Fresh-chat instruction

Do not ask Georg to reconstruct this chat.

Read:
1. `SOURCE.json`
2. `RETURN.md`
3. `B2_TEST_REPORT.md`
4. `B2_EXISTING_FACADE_OWNER_CONTRACT.md`
5. parent B1 `RECOVERY.md`
6. WC1 `START_HERE.md` / `RETURN.md`

GitHub state overrides chat memory.

## Exact lane

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-building-b2-2026-10-02`
- Draft PR: #323
- base: `chatgpt-web/wc1-procedural-building-b1-2026-10-02@8a397f2b9fd1b439643007ee7db9b600b9461585`
- tested head: `99a390d3b828fc132528a65e3cff52d165299990`
- Stage: none
- merge: none
- Live: none

Fetch branch head before writing; docs will be newer than tested head.

## Last proven result

**B2_EXISTING_FACADE_OWNER_INTEGRATION_PASS**

Real existing owner:
`wd1-city.js::buildCityLayer()`

Owner blob:
`c11b6f7156eaee808fe4689ee406f9b3480b6f0b`

Facade rule:
`kfb-facade-rule-v1`

Real seam:
`wd1-seam.js`
blob `95c6bfa04a4dd2106039db600b1e826ef48f4490`

Real frozen Hürth fixture:
`huerth-crop-v0.json`
blob `c242f09421a72249edb9c9ba8e431532666ab321`

One real presenter call:
- 700 buildings
- 164 roads
- 7,376 details
- 6,672 windows
- 434 doors
- 946 party edges
- 700 FACE_NORMALS building shells

Three B1 siblings:
- compact: 19 windows / 1 door
- ordinary-notched: 34 windows / 1 door / 3 party edges / 0 party-edge details
- large-complex: 28 windows / 1 door / 2 party edges / 0 party-edge details

All three:
- real road-aware door edge;
- multi-floor window span;
- support record;
- real owner detail ranges;
- no facade clone.

Final run/job:
`37043662315 / 110959643486`

Artifact:
`11243896554`

Digest:
`sha256:4591394170e0fe8d03f068e055be5c020ec0bb72a037ed8a5bfcd02cb1933bd8`

0 console errors / 0 page errors / 0 QA problems.

## Important owner-recovery finding

The active shared presenter is still stored under the r2 Session Cut / WB-D2 source.

The stable router path:
`tools/KFB-ToolBox/worldbuilder/world-integration-01/`

is missing on the current branch.

Do not create a second owner to work around that absence.

## Exactly one next gate

# PROCEDURAL BUILDING B3 · REAL OWNER REHOME + WORLDBUILDER CONSUMER

Rehome the proven owner first, preserving provenance and behavior.

Then feed B1 siblings through that stable current owner inside the real WorldBuilder consumer.

No material decision.
No facade rewrite.
No city-generator expansion.
