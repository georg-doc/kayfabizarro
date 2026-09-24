# CHANGELOG · ORB-P1 · The KayfaBizarros band module · 2026-09-23

Additive log. Each version lists what changed per performer, the files that hold it, and Georg's verdict.
All versions were authored in Blender 5.2.2 LTS via the Blender MCP connector (Claude, Cowork).
Exports: `exports/orb_band_module_vN.glb` · previews: `preview/orb_preview_vN.gif`.

Constant across all versions:
- Beat-normalised clips: 24 frames = 1 beat; player maps `beatPos = (audioTime − phase) · bpm / 60` to clip time, so the clips follow any track.
- Track: `Rubbish Groove 2min A extend 01.mp3` (blob `368eb5ae…`), measured **100.0 BPM, beat 1 at 0.465 s** (librosa, per-30 s segment fits).
- Clips: `drum` 2 beats (Brute) · `strum` 1 beat (Raider) · `bounce` 1 beat (v0–v1) / 8 beats (v2+) (Orc B).
- Props by the Resident Atlas identity rule at `handslot.*`; clubs and drum from the Orc Raider pack.

---

## v0 · first module
- **Drummer:** arm key poses from a reach search, identity grip, drum **scale 2** at (0, −1.1, 0), Brute at y 1.3; stick tip 3.2 cm above the head at the hit.
- **Guitarist:** Orc Raider (Rig_Medium) with pink `guitar_B` as a child of the chest bone; texture repaired (source GLB ships the material without image).
- **Leader:** Legacy Orc B bounce on the spot, GothGirl microphone child of the right arm piece.
- **Review page:** three.js player with Play / Bar 1 / own track / BPM / phase / Tap / Detect.
- Georg: textures missing in the preview; wrists bent; drum more from shoulders/arms, raised arms alternating, stand further away, rebound off the skin; strum hand inside the guitar.

## v1
- **Drummer:** `solve_straight` "combat strike" from the shoulder, wind-up overhead, rebound.
- **Guitarist:** guitar re-placed by search (0 overlaps with head/body); strum = one clean arm pose + ±14° wrist flick.
- **Review page:** textures fixed (artifact sandbox blocks `fetch(blob:)`; `createImageBitmap` disabled) → `LESSON_GLB_TEXTURES_IN_ARTIFACT_SANDBOX.md`.
- Georg: textures OK; drummer "noch schlimmer, Arme grotesk verdreht"; guitar body too high on the right.

## v2
- **Drummer:** KayKit Rig_Medium "Hammering" clip + one shoulder offset; drum **scale 1.6**, Brute y 1.5, lean 28°.
- **Guitarist:** guitar tilted 32°, hangs lower on his right.
- **Leader:** 8-beat dance: travels A → B → A across the front, big downbeat hops, full turn on beat 8; mic arm angled, mic tilted.
- Georg: drummer plays from the wrist, bent down; forearm guard inside the pauldron; hits the near third. Guitar left hand too close to the body.

## v3
- **Drummer:** IK key-pose search with free forearm twist per key, hand flex ≤ 15°, de-clash keys; left = mirror of right one beat later; pauldron re-weighted chest 0.4 / upperarm.l 0.6.
- **Guitarist:** neck 10° forward, fretting grip 8 cm further up the neck, elbow 100°.
- Georg: drummer forearms twist, impact from rotation, club hangs vertically ("so hält kein Drummer seine Sticks"); guitar arm too high, guitar lower, left arm further out.

## v4
- **Drummer:** (v4a, not shipped) Chopping clip + stick rotated in the fist → stopped by Georg ("Keulen müssen in den Händen verbleiben"). Shipped v4: IK shoulder+elbow with one fixed forearm roll, identity grip, wrist tip ≤ 25°, HOLD key, Brute y 1.7, pauldron 0.8.
- **Guitarist:** guitar 10 cm lower, neck 15° forward, fretting arm further from the body → **Georg: OK**.
- **Leader:** unchanged → **Georg: OK**.
- Georg: drummer **FAIL** — clubs twisted, stabbing instead of striking. Asked for postmortem, restoration of the first version and joint limits.

## v5 · current
- **Drummer:** v0 clip restored 1:1 from `orb_band_module_v0.glb` (bone and stick positions identical, max error 0); drum scale 2 at (0, −1.1, 0); Brute y 1.3; pauldron back on the source skinning (chest 1.0).
- **Guitarist:** v4. **Leader:** v2.
- New: `blender/orb_joint_audit.py` + `JOINT_LIMITS_AND_AUDIT.md`. The audit shows that v0 (and therefore v5) also exceeds the wrist limit (99°): the restored drummer is the best-looking baseline, **not** an accepted clip.
- Files: `blender/orb_band_module_v5.blend`, `exports/orb_band_module_v5.glb`, `preview/orb_preview_v5.gif`, `preview/drummer_v5_restored_v0_sheet.png`.

## Script history
- `blender/orb_build.py` — state after v4 (drummer v4 code, guitarist v4, leader v2). Rebuilding the drummer with it reproduces the **rejected** v4; v5 is made by `blender/orb_restore_v0_drum.py`.
- `blender/history/orb_build_v3.py` — backup taken before the v4 rewrite.
- v0–v2 builder code was overwritten in place and is not preserved; the v0–v2 **results** are preserved as GLBs and GIFs.
