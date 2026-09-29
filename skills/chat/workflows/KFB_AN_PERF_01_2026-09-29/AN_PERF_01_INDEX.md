# AN-PERF-01 · Resident Performance Batch · index · 2026-09-29

Executor: Blender MCP chat (headless bpy 5.0.1).

Georg chose the queue on 29.09. The 24.09 briefing named no queue and counted 33 clips; the library now has 263. Each item followed this chain: donor audition → pose-or-motion decision → author → contact check → Action → GLB → preview.

Donors were read straight from the published Motion Library GLBs (`georg-doc-patch-3`), on Rig_Medium (Orc Raider) and Rig_Large (Orc Brute).

| # | Item | Result | New clips |
|---|---|---|---|
| 1 | Gift give / receive | **Done** (both rigs) | `kfb_interaction_gift_give_a`, `kfb_interaction_gift_receive_a` |
| 2 | Cartoon punch with a step | **Stopped** after two failed repair passes (Rig_Medium); on Rig_Large the existing clips already land with staging | none |
| 3 | Nutcracker march | **Done** (both rigs) | `kfb_locomotion_nutcracker_march_a` |

## Defects and open points (read first)

1. **The Raider cannot land a fist without heads touching.** On Rig_Medium the face sits 0.72 m ahead of the hips, but the fist at the hit is only 0.63–0.82 m out. Two things were tried:
   - **Pass 1, hop-in step:** the fist then reaches, but the heads overlap. See `_punch_hop_contact_proof.png`: top row is the Raider, bottom row the Brute; each pair shows the donor, then the hop variant.
   - **Pass 2, side-on staging:** a search over 0–88° off the attack line found no angle that keeps the heads apart.

   So the problem is proportion, not animation. It needs a look decision: rubber-hose arm stretch at the hit (Choreo Lab), heads allowed to squash on contact, or head hits instead of body hits. No clip was exported.
2. **Rig_Large boxes are huge.** On the Brute the carry pose holds the hands 2.1 m apart, so a two-hand prop must be about 2 m wide or the hands float. On Rig_Medium the gap is 0.56 m. Box size classes must be defined per rig.
3. **The gift offer is small on the Raider.** Short arms: the offer pushes the hands only a few centimetres beyond the carry pose. It reads clearly on the Brute. Georg judges.
4. **The rifle is a placeholder in the previews.** The march clip carries no prop. The rifle attaches at `handslot.r`, barrel up. The hanging right hand works for "rifle carried upright at the side". A rifle on the shoulder would need a different arm pose, which is a Pose Studio job.
5. **A reader fix also touches Choreo Lab 01.** The GLB reader shared with Choreography Lab 01 sampled keys one frame late (keys sit at t = frame/30, not (frame−1)/30). It is fixed in `source/glb.py`, and this batch used the fixed reader: calibration drift 0°, GLB round trip 0.0 cm. The Choreo Lab 01 storyboards were posed one frame early, which is not visible in the pictures.
6. **Contact measures on the march.** For a travelling clip, the "slide while planted" number includes root travel, so donor and march values are not a slide measure. By construction, the knee lift only acts while a foot is off the ground, and stance frames stay as in the donor.

## Item 1 · gift give / receive

Donor audition: the library has no give/receive clip. Mixamo could not be searched without a login. The motion changes over time, so it was authored in Blender.

- **Sources:**
  - legs and torso: `kfb_idle_breathing_a`;
  - carry arms: `kfb_locomotion_jogging_with_box_a`, frame 1.
- **Give (90 frames, one-shot):**
  - frames 1–10: carry;
  - 10–30: arms straighten and push the box forward and up, torso leans 12° with the face kept up;
  - hold until 50, then **release at 50**;
  - 50–72: empty arms settle to idle.
- **Receive (90 frames, one-shot):**
  - frames 1–15: idle;
  - 15–38: both arms reach out;
  - **grab at 40**;
  - 45–68: box pulled into the carry pose;
  - then a happy head wobble.
- **Markers in the catalogue patch:** give `offerReady 30`, `release 50`; receive `reachReady 38`, `grab 40`, `secured 68`. The runtime moves the prop from the giver's hand sockets to the receiver's at release/grab.
- **Contacts:** feet stay planted for all 90 frames. Slide is at most 0.6 cm (Medium) and 0.3 cm (Large).
- **Staging for the pair:** use the Choreo Lab head-spacing rule (1.49 m hips on Medium). At that spacing the hands cannot meet in the middle on Rig_Medium, so hand the box over with a short pop or squash (as in the Choreo Lab).

## Item 2 · cartoon punch with a step (stopped)

| Rig | Clip | Fist out at the hit | Face front | Head spacing | Pass 1: hop needed | Pass 2: side staging |
|---|---|---|---|---|---|---|
| Medium | quad_punch_a | 0.63 m | 0.72 m | 1.49 m | 0.25 m, heads overlap | no angle works |
| Medium | hook_punch_b | 0.82 m | 0.72 m | 1.49 m | 0.06 m, heads overlap | no angle works |
| Medium | punching_b | 0.76 m | 0.72 m | 1.49 m | 0.12 m, heads overlap | no angle works |
| Large | quad_punch_a | 1.61 m | 1.11 m | 2.38 m | not needed | defender 20° off the line, hips 2.41 m apart, fist on torso |
| Large | hook_punch_b | 2.35 m | 1.11 m | 2.38 m | not needed | straight on, hips 3.48 m apart |
| Large | punching_b | 2.20 m | 1.11 m | 2.38 m | not needed | straight on, hips 3.14 m apart |

The attack axis is where the fist is at the hit, relative to the hips:

| Clip | Attack axis (world yaw, rest facing −90°) |
|---|---|
| quad_punch_a | −98° / −110° |
| hook_punch_b | about 177° (the hook lands to the side) |
| punching_b | about −61° |

The duel runtime should turn the attacker so that this axis points at the target. Proof picture: `_punch_staging_proof_large.png`.

## Item 3 · Nutcracker march

Donor audition: `kfb_locomotion_walk_with_briefcase_a`, whose right arm hangs and carries. The soldier gait changes over time, so it was authored in Blender. A constant rifle-arm hold alone would have been a Pose Studio patch.

- **Changes:**
  - knees lifted only while the foot is in the air;
  - left arm straightened with a bigger swing;
  - right arm frozen in its carry position;
  - torso upright;
  - chest and head steadier.
- **Measurements:**

| Measure | Rig_Medium | Rig_Large |
|---|---|---|
| Foot lift | 4.9 / 5.6 cm → 18.4 / 19.0 cm | 12.6 / 15.2 cm → 46.4 / 49.0 cm |
| Left-arm swing | 47.5° → 84.1° | 47.5° → 84.1° |
| Torso lean | 2.4° → 0.4° | 5.6° → 0.7° |
| Loop difference | 0.0° | 0.0° |

- Travel per cycle is unchanged: 1.144 m (Medium), 2.937 m (Large).

## Verification

- Both GLBs have 24 nodes, 0 meshes and 0 skins. Node names and rest transforms equal the library `KFB_Motion_talk.glb` (max difference 0).
- Each GLB holds 3 animations, and the GLB round trip against the authored actions is 0.0 cm on all bones.
- `KFB_Motion_perf_an01.glb`:

| Rig | Bytes | sha256 |
|---|---|---|
| Rig_Medium | 105396 | `f9f154e1…` |
| Rig_Large | 105468 | `8d26821b…` |

Full hashes are in the catalogue patch.

## Files (candidates for the GitHub Bridge)

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_perf_an01.glb`, `libs/Rig_Large/KFB_Motion_perf_an01.glb` | 3 new clips per rig |
| `KFB_Motion_Library.catalog.patch_an01.json` | 3 clip entries + 2 library entries to append (263 → 266); nothing existing changes |
| `AN_PERF_01_INDEX.md` | This index |
| `sheets/kfb_interaction_gift_give_a.png`, `sheets/kfb_interaction_gift_receive_a.png`, `sheets/kfb_locomotion_nutcracker_march_a.png` | Library-style previews: Raider top, Brute bottom |
| `sheets/_gift_give_side.png`, `sheets/_march_front.png` | Extra angles |
| `sheets/_punch_hop_contact_proof.png`, `sheets/_punch_staging_proof_large.png` | Item 2 evidence |
| `measurements/*.json` | gift_meta, march_meta, punch_pass1_hop, punch_pass2_staging, verify (round trip) |
| `source/*.py` | Workspace build, authoring library, the three items, export, verify, fixed GLB reader |
