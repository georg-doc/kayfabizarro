# RETURN · KFB Animation Library V1 · ToolBox Production-05 · 2026-09-28

Status: GEORG PASS (28.09., »PASS mit UI/UX → TUNE später«) · LIBRARY SELF-TEST 24/24 (Arbeitskopie und Staging-Kopie) · NOT MERGED ANYWHERE

## Problems and open points (read first)

1. **Card previews are contact sheets, not live 3D.** Each card flips through the six real frames of `sheets/<group>/<id>.png` (the row that matches the actor's rig). The brief asked for live cards on the selected character "where affordable". I did not build a render pool; the main preview is the only live 3D view. The sheets show the KayKit Raider/Brute from the bake, not FrizzleBob.
2. **FBX parsing has not been tested.** FBXLoader loads (L20b), but no FBX fixture exists, and none may exist in GitHub. The Drop Zone lane was tested with a Motion Library GLB (`KFB_Motion_throw.glb`) as a stand-in local file. The first real Mixamo FBX dropped in will be the first FBX test.
3. **"PROVEN" means track binding, not a visual check.** For a clip to count as PROVEN, every track of the baked clip has to bind on this actor's skeleton. On FrizzleBob Driver (Rig_Medium) and Orc Brute (Rig_Large), all 204 clips bind. Whether a clip looks right (feet, wrists, facing) is still Georg's eye; the per-actor verdict records that judgement.
4. **Render R0 not consumed.** Branch `work/render-r0-shared-preset-2026-09-28` holds only a START_HERE, no preset code. P05 keeps the P04 shadow path (`LESSONS_SHADOWS.md`). Swap it in when the preset code lands.
5. **Seat context is a gate, not a seat.** `kfb_talk_meeting_a` and `kfb_talk_sitting_a` show SEAT REQUIRED in Studio and Terrain. No seat prop is placed, so the pelvis floats at seat height.
6. **Shoulder throw plays one half.** The pair cross-links (Open partner). The two-actor sync preview is not built. The catalog does carry a hand-speed peak for the aggressor (f59); it is shown as NO PROP RELEASE, not as a marker.
7. **Terrain is the first Resident Atlas scene** (Caveman camp at the current pin). It works as a consumer; there is no road or curb strip. Switching the stage rebuilds the scene document, the same way the top-bar stage menu does.
8. **Fit & Motion axes are bone-local guesses** (Y along the bone). Twist and wrist bend are correct for KayKit bones. Abduction sign per side is untested on Mixamo-named rigs.
9. **Screenshots can't show scrolled panels.** The capture tool renders scroll containers at the top. Resident roles and the JSON roundtrip are proven by L09 and L15, not by a screenshot.
10. **Your browser's local patch holds test edits.** The evidence runs left »Reden · Schultern hoch«, the tag `resident` and a talk.explain assignment in `kfb-anim-library.patch.v1`. Press Reset in the patch block if you want it clean.
11. **Still open from P04:** the empty `[error] {}` at startup is still logged, and the two stale P04 tests (09, 22) are unchanged. P05 now has its own workspace key (`kfb-toolbox-production-05`), filled once from P04's key, so P04 and P05 no longer overwrite each other. P03 and P04 still share a key.

## Result

- New **Library** tab in the existing ToolBox shell (Studio · Animation Studio · Rigging · Library). No second shell.
- Motion browser: search across name, id, tag, cluster, group, notes and intake. Multi-select filters are derived from the manifest: group, compatibility on this actor, loop/one-shot, in-place/travel, rig bake, export, needs (seat/partner/release), intake. A cluster filter appears once editorial clusters exist. The list is virtualized and only mounted cards animate. It has a card pause, a low-device mode (static cards, 1× pixel ratio), and reduced motion is honoured.
- Main preview uses the real actor and the real clip from the per-clip `library` path, including the `*_i03.glb` supplements. It has a status badge (PROVEN / UNVERIFIED / INCOMPATIBLE / SOURCE REQUIRED), play/scrub/step/speed/loop, In place (catalog rootMotionRule), a feet-contact indicator and contact bands from the catalog, a release marker and a poster marker. Studio and Terrain are toggles.
- Inspector: source facts (read-only) are kept separate from editorial fields (display name, tags, cluster, notes, export, poster frame, per-actor verdict). Resident roles point at immutable ids and support fallbacks; unassigned roles are shown as missing.
- Patch: separate `kfb.animation-editorial-patch/1`, export/import/reset. The catalog is deep-frozen and its sha256 checked; unknown ids are kept as orphans, and immutable fields are dropped on import.
- Drop Zone »Animation ausprobieren« (LOCAL ONLY) covers three lanes:
  - A: parse in memory, with facts, SHA-256 and compatibility.
  - B: Fit & Motion A/B offsets, additive after the mixer.
  - C: an intake receipt with no bytes and no filename.
- Asset Librarian: the projection adapter builds one derived row per manifest clip and keeps optional v3 facts. It links both ways (`?asset=motion:<id>`, `?motion=<id>&actor=<id>`); the return trip keeps the actor, the motion and the patch.
- Narrow (<760 px): the browser becomes a drawer, and the dock keeps search, play, Studio/Terrain, Loop, Export and Details. The inspector becomes a sheet. Between 760 and 1180 px the inspector starts closed (Details button).

## Files

- `KFB ToolBox Production-05.dc.html` (copy of P04 + Library tab)
- `kfb-lib/anim-library.v1.js` (new · patch, gates, search, intake, Fit & Motion)
- `kfb-lib/librarian-motion-projection.v1.js` (new · Librarian adapter, no catalog copy)
- `samples/` · editorial patch (real ids) and intake receipt (fake hash)

## Next gate

See HANDOVER.md (exactly one gate).
