# AUDIO-STEM-BED-01 · TEST REPORT

**Status:** PUBLIC_VERIFIED · HUMAN LISTENING PENDING

## Branch QA

Current tested source head:
`e8e3831342272ff60e3f1e1ce615238b3095ecf8`

Run/job:
`37127242414 / 111214932398`

- source / exact donor validation: **22/22 PASS**
- Chromium/WebAudio: **19/19 PASS**
- artifact: `11274659711`
- digest: `sha256:583091c280e4695812860fda12fbe6a4364ba0ec2d27221e5af505c99d3bd020`

Browser proof covers:
- one AudioContext;
- master + eight real MP3 stem decodes;
- zero stem-duration spread;
- exact sample-synchronous eight-stem start;
- Activity raises Drums/Percussion;
- Road-Lift raises Drums/Bass;
- Night lowers Percussion and retains/increases Synth bed;
- Voice Focus ducks Keyboard strongly while preserving Bass proportionally more;
- no HTTP/page/external-runtime failures.

## Public proof

Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-01/`

Publication:
`cloudflare-live@5943f7bbd6c768ea8c92d5c2010b0e07a16d0b5b`

Cloudflare Pages:
`111214744359` → **SUCCESS**

Exact public run/job:
`37127139985 / 111214619612`

Result:
**19/19 PASS**

Artifact:
`11275318621`

Digest:
`sha256:8bd1bcb61da7417363d8d73e6ab40c9e11636daef789cb78785dba85540e9438`

## Not proven

Automation does not decide:
- whether the adaptive mix still feels as musical as the master;
- whether the control curves are tasteful enough;
- whether Road-Lift is energetic enough;
- whether Night is sufficiently distinct;
- whether Voice Focus should preserve more or less rhythmic energy.

These are the human listening gate.
