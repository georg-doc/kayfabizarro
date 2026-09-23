# RETURN · Blender MCP Animation POC (JUG-P1) · 2026-09-23

## 1. Source

| Item | Value |
|---|---|
| Router revision read | `georg-doc/kayfabizarro@10f661a542e2553b4d3433bfc5b45dfc1401e660` |
| Rules applied | `tools/resident_atlas_s6/docs/ATLAS_NEXT_SLICES.md` (four rules), `RECOVERY.md`, `DECISIONS.md` #11 |
| Asset handoff | `CLOWN KAYKIT + PROPS kfb-asset-handoff.json` (schema `kfb.asset-handoff.v1`, source commit `e0037d79af9f0546c73cee02e361f78f7d662df2`, consumer `animation-lab`, `candidate-only`) |
| Character | KayKit Clown · `Rig_Medium` · 23 joints · from Georg's `demo scene 01.blend` |
| Props | `juggling_pin_red/yellow/blue.gltf` from the local KayKit Clown pack (`KayKit_Mystery_Monthly_Series_4/11 - May 2024 - Clown/assets/gltf/`) |
| Texture | `clown_texture` 1024², packed in the .blend; same atlas the pins use |
| Tooling | Claude (Cowork) → Blender MCP connector → Blender 5.2.2 LTS on Georg's Mac |

## 2. What was built

1. **Pins imported** and switched to the scene's `clown` material (duplicate `clown.00x` materials/images removed).
2. **Grip = identity rule.** Prop origin at the grip, scale 1, no free rotation. In T-pose the prop's long axis equals the `handslot` forward axis (glTF +Y ↔ Blender +Z of the prop; `handslot` bone Y points −Y world = forward). Result: the handle sits in the fist, the knob shows below — as in the KayKit promo.
3. **Orientation comes from the arm.** Four arm poses (THROW / FOLLOW / CATCH / DIP) were found by a small search: grip on target, pin axis up, no penetration of the head ellipsoid. Upper arm, forearm and a split wrist twist (½ lowerarm, ¼ wrist, ¼ hand) are posed. The pin is never rotated by hand.
4. **Hand cycle** 16 frames: throw 0 · follow 5 · catch 12 · dip 14 · throw 16. Left hand offset 8. Hips bounce 3 cm per throw. Action `Clown_Juggle_Cascade3` (fake user).
5. **Pins baked** per frame over a 48-frame loop: R→L flight 20 f · hold L 4 f · L→R flight 20 f · hold R 4 f; phase offsets 0/16/32. Flight: lerp between release and catch grip + parabolic apex 2.5 + forward bow −0.6 (in front of the face) + one full turn; during the hold the pin follows `handslot × identity offset`.

## 3. Tests actually run

| Level | Check | Result |
|---|---|---|
| 2 · numerical | min distance pin ↔ *deformed* `Clown_Head`/`Clown_Hat`/`Clown_Body` vertices, all 48 frames | **0.103** (no penetration) |
| 2 · numerical | min distance pin ↔ pin | **0.063** @ f43 (no overlap, but tight) |
| 2 · reproducibility | `kfb_blender_juggle_cascade3.py` run on the unmodified `demo scene 01.blend` | identical metrics to the hand-built session |
| 3 · export | GLB export (`clown_juggle_cascade3.glb`, 333,964 bytes) | exports; **4 clips** (`Rig_Medium` 69 channels + one per pin, 2 channels each) |
| 4 · playback | Blender viewport OpenGL render, 48 frames → GIF | rendered, reviewed |
| 6 · human | Georg, viewport GIF | **PASS at ~80 %** (cartoon-plausible; fine-tune later) |

Not tested: GLB playback in a browser/three.js consumer · retargeting to other Rig_Medium characters · Animation Lab integration.

## 4. Evidence

In this folder: `clown_juggle_cascade3_preview.gif` (the loop Georg judged) and `clown_juggle_cascade3.glb` (export).

Full working set in Dropbox:

Folder: `Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/`

- `clown_juggle_cascade3_preview.gif` — viewport loop, the file Georg judged
- `_preview_juggle/f_0000.png … f_0047.png` — raw frames
- `demo scene 01_juggle_cascade3.blend` — hand-built session result
- `demo scene 01_juggle_cascade3_scripted.blend` — script result from the clean scene
- `clown_juggle_cascade3.glb` — export
- `demo scene 01_juggle_poseA.blend` — **SUPERSEDED** first static pose (grip was wrong: free rotation + scale 0.6)


## 5. Lessons worth keeping

- **Identity first also holds in Blender.** My first pose rotated the pins and scaled them to 0.6 "by eye". Both were wrong; the promo shows scale 1 in the fist. The rule from the Atlas doc fixed it in one step.
- **Grip = where the prop is attached; pose = arm.** Pin direction is controlled only by the forearm direction and wrist twist.
- **Measure against deformed meshes.** The first cascade looked fine in theory and went through the face (0.011 at f1). Checking the real vertex clouds caught it before Georg had to.
- **Pose search beats trial and error.** A small grid over upper-arm dir × forearm dir × twist, scored on grip position + pin axis + head penetration, gave four usable key poses in one pass.

## 6. Known gaps (all MINOR / QUARANTINABLE)

- Pin–pin gap at the apex is tight (0.063); a little more lateral spread would read cleaner.
- Grip entry/exit still slightly "snappy" (Georg: "noch ein bisschen unsauber, wie sie in den Händen sitzen und hochlaufen").
- Pins are baked world transforms, not live bone children. For runtime re-parenting a Child-Of switch (hand ↔ air) would be the alternative.
- GLB has 4 separate clips; a consumer must play them together (or the export merged into one clip).
- **Asset path mismatch (for the Asset Librarian, UNRESOLVED):** the handoff files the Clown under `KayKit_Mystery_Series6/11 - May 2024 - Clown`, but the KayKit promo says *Series 4 · Character 11*, and the local pack sits in `KayKit_Mystery_Monthly_Series_4/`.

## 7. Next

- **JUG-P2** (one gate): load `clown_juggle_cascade3.glb` in an existing three.js consumer, play all 4 clips in sync, human HTML review.
- **Next Blender lane candidate (PROPOSAL):** *The KayfaBizarros* Orc band — existing handoff `tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/START_HERE.md` (gate ORB-P1). Georg describes the trio as Legacy Orc · Rig_Medium Orc · Orc Brute; the handoff names Orc B (Legacy) + Orc Brute (Rig_Large) drummer. The Rig_Medium member is **UNRESOLVED** (candidate: Orc Raider, July 2023, whose props the Brute already borrows) until Georg's briefing.

## 8. Router writeback (applied in the same PR)

The blocks below were appended to the shared router files on the same branch, for traceability.

### → `skills/chat/CHANGELOG.md`

```markdown
## 2026-09-23 · Blender MCP Animation POC · Clown 3-club cascade (JUG-P1)

### TESTED RESULT
Claude (Cowork) posed and animated the KayKit Clown (Rig_Medium) directly in Blender 5.2.2 via the Blender MCP connector: three KayKit juggling pins, 3-club cascade, 48 f @ 24 fps. Pins follow the Resident Atlas identity rule at `handslot.*` (scale 1, grip in the fist); orientation comes only from arm pose + wrist twist. Clearance against deformed head/hat/body ≥ 0.103 over all frames; pin–pin ≥ 0.063. Script reproduces the result from the clean scene. GLB exports (4 clips). Browser playback not tested.

### HUMAN VISUAL PASS
Georg: believable within cartoon logic, ~80 %, usable as-is incl. Resident scenery; fine-tune later.

### PROPOSAL
Use the Blender MCP lane for pose/animation authoring in future slices instead of rebuilding motion via Claude Design HTML per slice.

Handover: `tools/KFB-ToolBox/_handover/BLENDER_MCP_ANIMATION_POC_2026-09-23/START_HERE.md`
Next gate: **JUG-P2 · GLB playback in an existing three.js consumer, human HTML review.**
```

### → `skills/chat/START_HERE.md`

```markdown
## 2026-09-23 · Blender MCP animation lane (POC)

Handover: `tools/KFB-ToolBox/_handover/BLENDER_MCP_ANIMATION_POC_2026-09-23/START_HERE.md`
Status: POC · Georg visual PASS ~80 % · candidate authoring method, no new runtime owner.
Next gate: **JUG-P2 · GLB playback in an existing three.js consumer.**
Candidate next Blender lane: KayfaBizarros Orc Band (ORB-P1), after Georg's briefing.
```

### → `skills/chat/REGISTRY.json` → `entries[]`

```json
{
  "id": "blender-mcp-animation-poc",
  "kind": "tool-candidate",
  "status": "EXPERIMENTAL",
  "repository": "georg-doc/kayfabizarro",
  "branch": "claude/blender-mcp-animation-poc-2026-09-23",
  "owner": "KFB ToolBox / Blender MCP authoring lane (POC)",
  "handover": "tools/KFB-ToolBox/_handover/BLENDER_MCP_ANIMATION_POC_2026-09-23/START_HERE.md",
  "humanAcceptance": "GEORG VISUAL PASS ~80% (viewport GIF), fine-tune pending",
  "tested": "numerical clearance on deformed meshes 48/48 frames; scripted reproduction identical; GLB export OK; browser playback NOT tested",
  "doesNotOwn": ["Animation Lab runtime", "Resident Atlas placement", "Asset Librarian truth", "KayKit source assets"],
  "nextGate": "JUG-P2 · GLB playback in an existing three.js consumer, human HTML review"
}
```
