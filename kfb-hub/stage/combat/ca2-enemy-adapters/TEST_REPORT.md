# CA2-03B · Test Report

Status: **PUBLIC_VERIFIED**

Runtime: `8e9b368305ca7ec76bdb9e4b4b89136ef527b2fe`

Workflow `35493474052`:
- branch job `106032266047`: **109/109 PASS**
- public job `106032265920`: **109/109 PASS**
- public marker: PASS
- Combat Web Stage navigation: PASS
- delivered playback module body: PASS
- failed resources: 0
- page errors: 0

For each of five states and three actors the proof checks exact clip, deterministic phase, finite skinned bounds, no collapse and stable world anchor. Non-attack states additionally check ground residual; attack states check bounded floor penetration.

Artifacts:
- branch `10600470645` · `sha256:0a9cb18451fa7af3f1e4e10e3c5d59e73f4fa0bc05e58761bdbb6db43ab38713`
- public `10600420826` · `sha256:99bf8505d9cb9a499751b88a888fab9271ccb80ad1bbd277574e198c19a49578`

The earlier public timeout was a stale same-path JS delivery issue, not an actor-state failure. Versioning the module URL fixed the publication seam.
