# DECISION · Drummer parked · Mixamo motion-donor lane opened · 2026-09-23

Für Georg: Der Trommel-Orc ist geparkt, nicht verworfen. Hier steht alles, was wir brauchen, um den Faden später wieder aufzunehmen, plus der neue Mixamo-Weg für Tänze und der erste echte Test damit.

Status: **ORB drummer PARKED** · **DANCE-M1 (Mixamo lane) OPEN** · no merge, no runtime change.
Context: the WSA/Web Lead chat was lost; this file replaces its pending reconciliation for ORB. Router files are still not edited (PR #193 edits the same files; editing them here would create a conflict).

## 1 · Drummer: parked with these rules for the restart

Baseline stays `exports/orb_band_module_v5.glb` clip `drum` (= v0, restored 1:1). Leader and guitarist stay accepted.

When the drummer is resumed, ORB-D1 runs **two reference lanes side by side, unchanged clips only**:

- **Lane A · KayKit, no retarget:** `Melee_2H_Slam`, `Melee_2H_Attack`, `Melee_Dualwield_Slash`, `Melee_Unarmed_Smash` played unchanged on the Orc Brute (Rig_Large).
- **Lane B · Mixamo:** Georg searches Mixamo for drumming / percussion / hammering / slam / heavy strike, applies it to the Orc Brute FBX (same path as §3) and drops the FBX in `BLENDER MCP/_inbox/`.

Georg picks one of 4–6 references. Then:

1. **Clip first:** find the contact frame in the picked clip.
2. **Move the drum**, not the orc (and scale it if needed) until the contact lands on the inner head.
3. **Only small corrections:** one shoulder offset plus a slight wrist tip at contact. No IK bending to a fixed target: that is what broke v1–v4.
4. Clubs stay in the fist (Atlas identity grip).
5. Joint audit before review (limits recalibrated, see §4).

## 2 · Mixamo is a motion donor, not a rig owner

Rule: `Mixamo motion → KayKit rig (Rig_Medium / Rig_Large) → bake → audit → GLB`.

- KayKit skeletons, Resident Atlas, attachments and runtime contracts stay as they are.
- FBX is only the exchange format. GLB stays the runtime format.
- No new bones are invented (no `neck`).
- Licence (per Adobe's Mixamo FAQ, not checked by a lawyer): royalty-free for personal, commercial and non-profit projects, including games. KayKit assets are CC0.

## 3 · First probe: `_inbox/ORC BRUTE - MIXAMO - Thriller Part 3.fbx`

Georg uploaded the KayKit Orc Brute FBX to Mixamo and downloaded "Thriller Part 3" on it.

| Check | Result |
|---|---|
| Skeleton | **KayKit `Rig_Large`, all 23 bones, same names and hierarchy.** Mixamo kept the existing rig; it did not auto-rig. Bone lengths match the v5 Brute (hips 0.402 vs 0.384 and chest/head 1.057 vs 1.015; all others identical). |
| Consequence | **No retarget needed** for characters uploaded this way. The clip plays directly on our bone names. |
| Scale | Same as the v5 Brute (height ≈ 3.9 vs 4.1 incl. bounds). |
| Length | 768 frames @ 30 fps = 25.6 s. One action. |
| Keys | Irregular: bone curves have 768 to 1636 keys (sub-frame keys); 127 of 189 curves are constant. Must be resampled to whole frames when baking. |
| Animated bones | root, hips, spine, chest, arms (upperarm/lowerarm/wrist/hand), legs, feet. **`head` is not animated** (it follows the chest rigidly). Toes and handslots are static. |
| **Root motion** | **Sits on the armature object, not on the hips bone.** The object's location moves (travel up to ~6.7 units) and its rotation changes (full turn, ±27° body tilt); the `hips` and `root` bones are constant. **Must be baked into `root`/`hips` before GLB**, or Atlas placement would fight the clip. |
| Texture | Not embedded (renders magenta). Irrelevant: we keep the original KayKit mesh/material from the GLB. |
| Joint audit (current candidate limits) | worst elbow 41.9° · **wrist 105.5°** · **twist 109.5°**; 510 of 768 side-samples exceed a limit, mostly the 35° wrist limit. |

Contact sheet (raw, unchanged, 12 frames): `evidence/mixamo_thriller_raw_sheet.png`.

## 4 · What the probe teaches about the joint limits

Human mocap on the same rig routinely exceeds the 35° wrist and 70° twist limits. So these limits flag normal human motion; they are not a quality bar by themselves.

What went wrong in v1–v4 was the kind of motion: the wrist drove the strike and the club rotated through the fist. A single angle threshold does not capture that.

Proposal (for Georg to decide):

- Calibrate the limits per action family against a small Mixamo reference corpus (the 95th percentile of the reference = the warning line; the reference maximum = the hard stop).
- Add one targeted check for strikes: the wrist angle *change* during the swing must be smaller than the shoulder and elbow change (the arm leads, the wrist follows).

## 5 · DANCE-M1 · next small step (proposal)

1. Bake the Thriller probe onto the original Brute rig:
   - resample to 30 fps
   - move the object motion into `root` (travel) and `hips` (tilt/turn)
   - keep the head rigid, or give it a small follow of the chest
2. Export one GLB with one clip and review it in the band review page. No stylisation yet, no library.
3. **Rig_Medium:** Georg uploads one Rig_Medium KayKit FBX (Orc Raider or GothGirl) to Mixamo once. From then on, dances can be downloaded directly on Rig_Medium; "Without Skin" downloads are enough for additional clips once the skeleton is proven identical.
4. Only after that: KFB stylisation (weight, bounce, hip accents, timing to 100 BPM), plus a mix of KayKit clips and Mixamo clips.

## 6 · Suggested Mixamo download settings for the inbox

- Format: FBX Binary
- Skin: With Skin (first clip per rig), then Without Skin
- 30 fps
- Keyframe reduction: none (we resample and bake ourselves)
- In Place: off for dances that travel. Travel is handled in the bake.

## 7 · Inbox convention

- Georg drops sources in `BLENDER MCP/_inbox/` in Dropbox.
- Probes go to `_inbox/_probe_<name>/`.
- Nothing from the inbox reaches Git unless it is referenced in a Return/Decision file like this one.
- Source FBX files stay in Dropbox (licence and size).
