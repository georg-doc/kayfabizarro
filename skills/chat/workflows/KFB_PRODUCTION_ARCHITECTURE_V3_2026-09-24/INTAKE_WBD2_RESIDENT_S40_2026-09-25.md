# Intake · WB-D2 + Resident Atlas S9/S40 · 2026-09-25

Status: **CLASSIFIED INPUT · receiving owners unchanged**

These are Inbox exports on `main`. Inbox location does not promote them to SSOT.

## A · WB-D2 · Cologne / Hürth / Alstädten shell

Source:
- upload commit: `706c3f121bc3a305778306917613ea23eb772c16`;
- folder: `tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/`.

Useful candidate delta:
- one presenter/seam with three zones: Cologne Dom, Hürth and Alstädten;
- global `kfb-facade-rule-v1`;
- corrected contact-shadow strategy;
- street-name module with road/sign modes;
- Alstädten homebase marker at Stotzheimer Str. 26;
- explicit freeze/change-lock rules;
- later corridor/world-frame plan remains separate from presentation.

Human evidence:
Georg's exported handover records **positive feedback ("top!") for the Hürth-Alstädten look and shadow fix**. This is not a complete shell acceptance; sign anchoring B2 and other open items remain.

Do not promote as geographic truth:
- `huerth-alstaedten-v0` was fetched inside Claude Design as an explicit rule deviation;
- OSM City Lab must re-cache it with SOURCE_SPEC + provenance before it becomes source truth;
- `huerth-v0` is reported mislabelled and needs source-owner correction.

Current open visual/editor items:
- B1 pixelated road/curb edges;
- B2 floating street signs must move to road edge, no pin/stick;
- S1.2 live zone switch without reload;
- S1.4 Hürth/Alstädten landmark.

Receiving route:
1. finish current `WB2-DESIGN-REFINE-01` and Web rehome;
2. execute `WB-ZONE-SEAM-01`: dock this shell through `wd1-seam.js` into the current WorldBuilder/editor and accepted baked World Zone owner;
3. only then continue Ehrenfeld → shared frame/corridor.

The shell stays presentation. World Zone/OSM owns normalized geographic data. WorldBuilder owns terrain/editor/persistence.

## B · Resident Atlas S9 / S40 Disco Rotation

Source:
- upload commit: `a46dbdff150362e7153c143b21fa76ffe8ffb5e4`;
- folder: `tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/`;
- review entry: `KFB_Resident_Atlas_S9.html#__disco`;
- Session Cut status: **candidate-only · review open · nothing published**.

Useful candidate delta:
- Source Cast / Motion Audition / Ensemble in one Atlas page;
- 8-song rotation with measured BPM/beat tracking and tempo maps for drifting titles;
- 16-bar choreography with shared hits;
- root/wander correction for travelling dance clips;
- `RESIDENT-COLLIDE-01` crowd collision;
- `DISCO-BALL-CORE-01` reusable event/world-object candidate;
- FrizzleBob DJ/MC graft candidate;
- no baseplate; host environment owns ground/sky/time-of-day;
- S40 explicitly consumes Motion Library ids rather than inventing a second motion owner.

Keep quarantined / unresolved before promotion:
- Graft reader itself is pinned, but internally loads Driver/head/textures from raw@main;
- microphone left-hand slot is mirrored but unverified;
- HIT 2 still uses Happy Idle placeholder;
- bar/downbeat start per track is set, not measured;
- S9 Band still has its own transport instead of the shared `song-transport`;
- Disco Motion Library pin and Band pin differ;
- `makeWalker` exists but has no integrated NPC scene;
- do not retire S5–S7 just because S9 export calls them superseded; that needs Georg/owner approval.

Receiving owners:
- Resident/ToolBox host remains the Resident/scene owner;
- MUSIC-PERF/shared performance transport owns the single song/beat clock direction;
- Motion Library + Direct FBX intake owns clip assets/metadata;
- NPC-LIFE host owns movement/encounter legality; `resident-collide` is a behavior donor, not a movement owner;
- WorldBuilder may later consume `host-env` look as an optional environment variant, never as terrain truth.

Current next gate:
**Bridge S40 candidate into current owners without rebuilding it, fix/pin owner-boundary hygiene, then present one bounded human review.**

Georg review questions preserved from the candidate:
1. which actor/motion pairings stay;
2. whether Skeleton Minion bounce reads as intentional party motion;
3. whether Disco Ball reads as reusable KFB world object;
4. whether beams/dots stay lively without swallowing actors.
