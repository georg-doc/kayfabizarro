# WSA Recon + Plan Approval · 2026-09-26

Status: **WSA DECIDED · APPROVE WITH D2/D3/D6 TUNES · NO EXECUTION**

## WSA decision · 2026-09-26

| ID | Decision | Binding result |
|---|---|---|
| D0 | **APPROVE** | JavaScript is the single authoritative route/geometry Track Core. Race retains contact, vehicle physics, flight, landing and recovery. Blender/Python is oracle + scenery only. |
| D1 | **APPROVE** | W0 inventories the real Race contact/collider path. `project(pos,sHint)` remains a contract proposal; no physics migration in W0. |
| D2 | **TUNE** | `CAMERA-CORE-0` is recon + contract only. Do not create a new camera owner/module before WB2, WhackMan, Travel donors and current consumer owners are measured. |
| D3 | **TUNE** | Exactly one Surface Adapter resolves final visible/support height. WorldBuilder owns editable base height; OSM/Track provide local constraints/offsets; Race retains contact/physics. No per-consumer height recomposition. |
| D4 | **APPROVE** | Publish and human-review PR #221 before feature expansion on the same ToolBox owner. |
| D5 | **APPROVE** | Additive ENV Preview Stage comparison may proceed. WORLD_MATCH becomes default only after human PASS. |
| D6 | **TUNE** | Correct superseded Travel-world ownership wording in PR #204 and PR #218 metadata before default reuse. This is metadata/contract correction, not runtime migration. |
| D7 | **APPROVE** | Add future-consumer fields to contracts only; rail/arbitrary-up/gravity/skins remain unimplemented. |

Overall: **APPROVE WITH TUNES**. Playable Track R0 and Cologne OSM R0 remain **HOLD**.

## Defects / contradictions first

1. **Playable Track R0 was routed too early to Claude Design.** The brief exists on Cologne Route PR #216, not `main`; more importantly, its required input package does not yet exist because current Track-Core planning explicitly blocks R0 until the core sequence is proven. See `CLAUDE_DESIGN_RACER_R0_BLOCKER_RETURN_2026-09-26.md`.
2. **Hub Racer status drift:** HUB-CTRL currently marks Track Core `CAN_START`, while the latest PR #219 addendum says **G0 JS decision → W0**. Hub needs to distinguish Track-Core preparation from Playable-R0 HOLD.
3. **World truth wording drift:** PR #204 and PR #218 metadata contain the older statement “Travel/TinySkies remains macro-world truth”. Georg’s newer decision on `main@388e9087…` supersedes that: Travel Globe is not world base; sky/weather/light/mood and selected movement/camera ideas remain donors.
4. **World r2 stop condition is binding:** two repair passes were exhausted. Do not patch the failed runtime again. The next gate is contract/test semantics only.
5. **ToolBox r2 is technically reviewable but public status is not yet a human PASS.** PR #221 has 33/33 browser proof; Stage/public publication must remain separately verified.
6. **OSM `rhein-muelheim-v0` exists in Dropbox and a duplicate upload staging folder.** Do not delete/move. Promotion remains WSA/OSM provenance approval and blocks only the later OSM/RKIT-11 provenance gate, not Track-Core W0/B1–B4.

## Exact current checkpoints

| Lane | Current source | State for planning |
|---|---|---|
| main lead decisions | `388e90875a0b28b9241f126f26ba44456419e43d` | binding |
| HUB-CTRL | PR #202 · `1542f045…` observed | owner |
| Hub status sync | PR #215 · `d45f215b…` | merge gate, not assumed |
| Hub UX v2 | PR #217 · `2b4d800d…` | PASS_WITH_TUNE, mobile known broken, not Live |
| Environment preview | PR #218 · `6718eef0…` | 30/30 static + 15/15 Chromium at final candidate, Stage comparison next |
| Track Core | PR #219 · `6610e5b0…` | planning, G0 open |
| Cologne Route | PR #216 · `a65b23f7…` observed | downstream of Track Core |
| ToolBox owner | PR #185 · current branch `10a83a63…`; tested r2 owner checkpoint `5dcf34bc…` | owner |
| ToolBox r2 review | PR #221 · `e935f7eb…` observed | 33/33 browser, publication/human gate pending |
| Motion Library v2 | PR #213 · `7b5cf664…` | 179 clips |
| EarRig v5 | PR #214 · `19088b14…` | source candidate |
| WorldBuilder | PR #190 · current head `d5d1ff69…` | WB2 accepted checkpoint retained; World r2 failure recovery later on same owner branch |
| Production Architecture | PR #204 · `31df6556…` observed | catalog/brief source, contains one superseded world-rule sentence |

GitHub state at execution time overrides these observed refs.

## WSA decisions requested

### D0 · Track Core authoritative implementation
**Candidate:** JavaScript is the single authoritative Track Core. Blender/Python is oracle + scenery atelier, never a second solver.

WSA action: verify no current Race owner fact contradicts this. If clean, return **APPROVE G0**. If not, return the exact conflicting owner/path only.

### D1 · Track Core contact interface
Do not decide Race physics in planning. W0 must census the current Race contact/collider path. The core may expose branch-safe route projection `project(pos,sHint)`; Race decides whether/how to use it.

WSA action: approve this as a contract investigation, not a physics migration.

### D2 · Shared camera owner
Candidate owner: one shared ToolBox/browser camera module, analogous to `edit-layer.js`, consumed by WorldBuilder, ToolBox preview and track editor where compatible.

Required recon donors:
- accepted WB2 orbit behavior;
- WhackMan cursor-focused zoom behavior;
- accepted Travel ground↔flight transition/camera movement only.

Required interface goals:
orbit · pan · cursor-focused zoom · touch · fit/target · consumer-owned movement writer. No renderer/world ownership.

WSA action: approve owner location or name the existing better owner.

### D3 · World height authority seam
Before OSM roads/tracks are embedded into sculpted terrain, define one small contract:
- WorldBuilder terrain owns base editable height;
- OSM/track corridors supply authored corridor constraints/offsets;
- consumer composition resolves final visible/support height without a second terrain engine;
- track physics remains Race-owned.

WSA action: approve a contract-first Web slice; do not prescribe carving implementation yet.

### D4 · ToolBox publication vs feature expansion
Recommended sequence:
1. prove/publish PR #221 review surface through existing Stage/Hub path;
2. human review;
3. then body-family/v17+/motion-intake expansion on the same ToolBox owner.

This prevents adding new features to an unreviewed front door.

WSA action: approve or explicitly reorder.

### D5 · Environment preview
PR #218 is useful independently of the failed World r2 runtime: it is a shared **presentation consumer**, not a world owner.

WSA action: approve its Stage-comparison gate now. After human review, use it as the default World Match environment in previews/Resident Atlas/ToolBox where supported.

### D6 · World base correction
Record as current:
- no Travel Globe terrain/world base;
- reuse TinySkies/Travel sky/weather/light/mood and selected camera/mobility donors when they are best;
- current WorldBuilder/OSM/terrain owners remain authoritative for local world construction;
- future procedural environment work consumes this owner stack rather than replacing it.

WSA action: approve correction of PR #204 metadata/brief wording; no runtime migration implied.

### D7 · Future Track Core consumers
Contract requirements now, implementation later:
- `driveMode = free | rail`;
- arbitrary up/frame orientation, including loops/spherical normals/space bands;
- gravity policy/reference as data;
- skin/profile/material/set pieces separate from route/physics truth.

WSA action: approve as non-blocking future requirements in W0 contracts.

## Recommended MVP sequence after approval

**Parallel prep wave**
- A: ENV-PREVIEW-01 Stage comparison.
- B: ToolBox r2 review publication.
- C: Track Core G0 → W0.
- D: shared Camera Core recon only.

**Then**
- ToolBox human gate → FrizzleBob body family + surf poses.
- World r2 contract reset → mobility seam.
- Track W0 → Blender oracle sprints → Web runtime parity → Claude Design visual grammar.
- Only then: Playable Track R0 → real Cologne OSM route.
- Small Resident scene can dock into the first stable World/Mobility host.

### D8 · Timeout-safe long jobs / orphan recovery

Current recon correction:
- **B2b-P1 is recovered, not orphaned**: latest PR #211 failure-recovery freezes the candidate at 39/40 after two repair passes; Web owns the isolated lifecycle test, Claude Design may only show the frozen candidate unchanged.
- **City Builder Bits remains the real recon orphan**: source inventory exists, application matrix missing.

Candidate protocol:
`LONG_JOB_CHECKPOINT_PROTOCOL_2026-09-26.md`

Key rule:
before a long research/CI/browser job starts, persist a **C0 preflight** with owner/branch/goal/`JOB_STATE.json` + recovery stub. Then checkpoint source → implementation → evidence → publication → Return separately. `Stream cache expired` = `UNKNOWN`, inspect before retry.

WSA action: approve/tune canonical adoption into Fresh Chat protocol + template; do not create a second control plane.

## WSA output requested

Return one compact decision table:
`ID | APPROVE / TUNE / HOLD | correction | owner | next gate`.

Do not build, merge, publish Live, or start Claude Design R0 during this review.
