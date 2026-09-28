# Claude Coworker · CLAY-CITY-MVP-01

## Execution Card · verbindlich

- **Owner/Tool:** Claude Coworker Desktop.
- **Model:** Opus 5.5 High beziehungsweise das stärkste verfügbare Claude-Coding-Modell.
- **Reasoning:** High für die zusammenhängende World-/Runtime-Integration.
- **Fallback:** Codex GPT-6 Sol High, falls Coworker an Zugriff, Browser-Deployment oder Session-Limit scheitert.
- **Slice size:** ein Acceptance-Pass, kein Stadt-Neubau: Walk/Movement-State, H0/K2-Fassaden, sparsame Cluster, derselbe Ground/Auto/T4/Flight-Test.
- **Persistence:** Site-first nach `../KFB_SITE_FIRST_PERSISTENCE_2026-09-29/START_HERE.md`; GitHub nur in kleinen kanonischen Checkpoints.
- **Stop rule:** echter Source-/Runtime-Blocker oder zwei fehlgeschlagene Reparaturversuche; dann Recovery-Paket statt Rückfragenkette.

## Site-first Übergabe

Status, Testnotizen, Screenshots, Entscheidungen und Upload-Quittungen zuerst über die KFB Production Control Site. Der Nutzer muss keine Zwischenstände zwischen Chats tragen. Ein GitHub-/Cloudflare-Timeout ist UNKNOWN: erst exakten Ref beziehungsweise Site-Receipt prüfen und nur fehlende Writes wiederholen. Der finale Site-/Hub-Abgleich ist Teil dieses Slices.





## Mission


Build one productive, playable KFB World MVP tile. This is an implementation and integration job for **Claude Coworker**, not Claude Design.


The outcome must let Georg walk, switch directly to a car, drive on and off the road, and fly over one coherent Claymation district under a real shared skydome.


Do not build the whole Open World.


## Current execution result · 2026-09-29


The first Coworker implementation is persisted on `coworker/clay-city-mvp-01-2026-09-28@939224c051afb464c553ff6f9b59609503eb1b49` and has a public review wrapper:


`https://kayfabizarro.pages.dev/kfb-hub/pruefen/clay-city-mvp-01/`


Measured result: play probe 6/7, donor isolation 13/13, T4 intake 52/52 and 45–68% fewer draw calls than R6. Ground/road continuity, direct Auto, off-road Drive, the full short T4 segment and Flight work. This is a useful candidate, not an accepted MVP.


Georg's first human test fixes the repair priority without another decision gate:


1. walking is still unacceptably slow and appears to use the wrong or incorrectly timed standard KayKit walk / Movement-State mapping;
2. the Clay look is incomplete on facades and buildings: H0/K2 cartoon bend, facade deformation and characteristic surface treatment are missing or too weak;
3. the measured 3D model cost is 213–240k internal polygon triangles against a 200k planning target. This is not a visible triangle defect and not a user decision; reduce it only where measurements connect it to loading or stutter, and never replace accepted buildings with boxes;
4. real visible p95 and boot remain unproven.


The next implementation pass is one coherent **playability + look acceptance repair**, not a choice between unrelated micro-gates: correct the movement owner and animation timing, complete the bounded H0/K2 building/facade treatment, then reduce measurable 3D cost without harming the look and rerun the same Ground/Auto/T4/Flight probe. T4 extras and the Resident pocket remain secondary until this acceptance pass is green.


The candidate currently places 64–66 buildings, although this brief asked for approximately 12–36 instances in 4–8 readable clusters. Treat that as scope drift, not as a new density target. The first model-cost/composition lever is to return to a few strong street/landmark clusters and spend the saved budget on visible Clay facade quality. Do not first degrade the geometric road, continuous ground or hero buildings.


Execution environment: **Claude Coworker Desktop**. Capability note confirmed on 2026-09-28: this Coworker session has Dropbox and Chrome/GitHub access, but no real local Git checkout or local server. Work through the existing GitHub branch and review browser surfaces with small crash-safe commits. Do not claim local tests that this environment cannot run, and do not publish every micro-checkpoint to the fixed public Stage.
