# RETURN · Mixamo lane · Playing Drums on the Orc Brute · 2026-09-24

Für Georg: Der Trommler nach dem neuen Weg: erst die Mixamo-Bewegung, dann Arme verschieben, dann die Trommeln dorthin stellen, wo die Schläge landen. Die Keulen stecken nicht mehr im Kopf. Offen ist die starke Unterarm-Drehung rechts.

Status: **CANDIDATE · waiting for Georg's review** · Guitar A (Raider) was accepted by Georg on 2026-09-24 ("passt so"). No GLB export yet.

## 1 · Pipeline (clip first, rig second, drums last)

1. **Transfer:** Mixamo "Playing Drums" (Rig_Large, uploaded Brute) → duplicate of `Rig_Brute`. The bone heads are identical, so the transfer is exact (error 0). Clubs: `Orc_WardrumStick`, scale 2, Atlas identity grip on `handslot.*`. They never rotate inside the fist.
2. **Diagnosis (raw):**
   - The Brute's short arms and big chest put the mocap hands inside the chest.
   - The right fist plays at face height.
   - With the perpendicular club grip, the clubs point up.
   - The club is in the head/body/shoulderpad in **71/71 (right)** and **65/71 (left)** sampled frames.
3. **Shoulder-only offsets** (abduction/flexion up to 45°/50°) were tested first, as Georg proposed. They are **not enough on their own**: the hands start inside the chest.
4. **Hand-path remap:** Each hand's mocap path, in chest space, is moved as a whole. The strike motion and timing are unchanged.
   - Right: forward 0.2, down 0.2, 0.25 toward the midline.
   - Left: forward 0.35, down 0.2, 0.25 outward.
   - Arms follow by IK (`lowerarm.*`, chain 2); the pole follows the mocap elbow.
5. **Forearm rotation** (constant, on `wrist.*` about the forearm axis), so the clubs point forward instead of up: right +75°, left −20°. Everything is baked to rotation keys; no constraints remain.
6. **Contacts:**
   - 13 strikes per hand were found as local minima of the club head with a downward approach.
   - Left strikes cluster at knee/hip height, in front, left.
   - Right strikes sit at chest/face height, in two groups.
7. **Drums placed on the contacts** by a search with a cylinder model (hit gap, club penetration, body clearance):
   - `DR_drum_main`: war drum, scale 1.0, floor, at (0.2, −1.5).
   - `DR_tom_B`: scale 0.35, on a stand, tilted 50° toward the orc.
   - `DR_tom_C`: scale 0.35, on a stand, tilted 25°.

## 2 · Numbers (`DR_check.json`, 71 sampled frames)

| | raw | fitted |
|---|---|---|
| Club head/grip in head, body, shoulderpad or leg armour | 71 (R) / 65 (L) | **1 (R) / 2 (L)** |
| Club pommel in body | 3 / 32 | 0 / 0 |
| Joint audit elbow min / wrist max | 54° / 76° | 96° / 99.5° |
| Forearm (wrist bone) twist max | — | L 60° · **R 96°** |

- Hit gaps, club to drum head: mostly within ±0.05, worst ±0.2.
- Body in drum (cylinder test): 1 sample point, at the small tom.

## 3 · Open points for Georg

1. **Right forearm twist of 96°** is at the natural limit. The alternative, +60° (81° max), brings the club back into the body in 7 frames. Options: accept, split the twist between lower arm and wrist, or use a different club direction.
2. **Kit vs. one big drum:** in this clip the right hand plays high, like cymbals, hence the two toms on stands in front of the chest. A war gong in the same place would fit orcs better. Pushing the right hand down onto one big drum failed: the IK cannot reach the lowered targets (error 0.4).
3. **The main drum is smaller** than in v0 (scale 1.0 vs 2), because the left hand strikes at knee/hip height.

## 4 · Files

- Here: `drm_tools.py` (collision, IK remap, twist tools), `drm_cfg.json`, `DR_check.json`, `DR_contacts.json`, `DR_drumsearch.json`, `DR_tomsearch.json`, `preview/dr_brute_{front,f34,right}.mp4`.
- Dropbox: `_inbox/_probe_batch1/mixamo_probe_batch1_GA_DR.blend`, a copy with the scenes `GTR_RAIDER_A` and `DRM_BRUTE` (actions `GA_fit`, `DR_brute_drums_fit`).
- `orb_band_module_v5.blend` was not saved.
