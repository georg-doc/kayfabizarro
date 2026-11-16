# #369 Addendum 5 · Brick Fish toss (culture mechanic), first pass

- **Status:** FIRST PASS, made while Georg was away (2026-10-08). Waiting for his look decision on the fish and the burst.
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Boundaries:**
  - no merge;
  - no raw Mixamo FBX;
  - no textures;
  - `.blend` stays in Dropbox;
  - this is a Blender test bench, not the WorldBuilder runtime (PR #254 keeps that boundary).
- **Design source:**
  - PR #254 `KFB_PROP_TOSS_BRICK_FISH_2026-09-27.md`: beat grammar, a role palette for the throw, tossable metadata;
  - Georg's 05.10 note: Brickfish throws shatter in claymation into little clay pellets that bounce away.

## What is built

**Brick Fish prop** (`assets/KFB_BrickFish_clay01.glb`, 48 KB, built by `kfb_brickfish_asset.py`):

- a red clay brick body, 0.36 × 0.17 × 0.11 m, with rounded, slightly uneven edges;
- a thick-lipped round mouth on the front face;
- two big cartoon eyes;
- tail fin and dorsal fin;
- pivot = grip (body centre), nose = +X.

The colours are a first proposal: body `#c8402e`, fins `#9e2a22`, lips `#f07a6e`. Tossable metadata is in `KFB_BrickFish_clay01.tossable.json`. The bench shows the fish at display scale 1.35 so it reads at game-camera distance.

**Toss bench** (`kfb369_brickfish_toss.py`, scene `369_BRICKFISH`):

- **Release:** the measured frame of peak hand speed on the prepared clip, at 24 fps:

  | Clip | Release frame | Peak hand speed |
  |---|---|---|
  | `throw_a` (short) | f22 (Medium) / f21 (Large) | 8.3 m/s Medium |
  | `goalkeeper_overhand` (long) | f35 | — |

  The fish rides `handslot.r` until release.
- **Flight:** a deterministic cartoon ballistic (g = 12 m/s²) aimed at the target's head anchor. The nose follows the velocity, with a slow roll.
- **Impact:**
  - two frames of squash (0.55 / 1.3 / 1.3);
  - then a clay burst: 9–11 lumps in the body colour, two fin bits, both eyes popping out whole;
  - the pieces bounce on the ground (restitution 0.42) and roll with friction.
- **Retaliation:**
  - the pellets crawl back together;
  - the fish pops back with a squash overshoot;
  - it hops into the target's reaching left hand (pick-up clip, grab frame 31);
  - it passes to the right hand and is thrown back.
- **Long throw:** `goalkeeper_overhand` is a travel clip, and its run-up would run into the target. It plays in place: the travelling root/hips channels are frozen.
- **Miss:**
  - the target dodges (`dodging_a`, head fully out of the way at clip frame 22);
  - the fish passes 0.47 m from her head and bursts on the ground behind her;
  - she mocks him (`taunt_b`, `amused`), and he is disappointed.
- **Data:** everything is keyed per frame on objects, with no physics cache. The beats and key frames are in `data/brickfish/*.json`.

## Videos

| File | Beats |
|---|---|
| `BRICKFISH_A_hit_retaliation.mp4`, 13.8 s | Orc short throw (release f41) → hit on the Farmer's head (f53) → clay burst → regather + POP → hop into her hand → she throws back (release f202) → hit on the Orc (f215) → he is outraged |
| `BRICKFISH_B_long_miss.mp4`, 9.6 s | Orc long overhand throw from 7 m (release f55) → Farmer dodges, miss by 0.47 m → burst on the ground (f77) → she mocks him, he is disappointed |

## Open

| ID | Item |
|---|---|
| BF1 | The look is Georg's: colours, lip size, eye size, and the display scale 1.35. |
| BF2 | The pick-up clip grabs at hip height, so she does not bend to the ground. The fish hops up into her hand as a cartoon solution. |
| BF3 | The hit reaction is `standing_react_small_from_right` regardless of the hit side. No hit-stop yet. |
| BF4 | Pellets do not collide with the residents. The burst set from the first hit is reused for the regather. |
| BF5 | Not wired into the talk engine yet: a toss would be one outcome of an outburst (`outburst → throw`). |
| BF6 | The runtime (WorldBuilder) still needs the release-marker contract from PR #254. The measured frames above are the candidates. |

## Files

**Scripts:**

- `scripts/kfb_brickfish_asset.py`
- `scripts/kfb369_brickfish_toss.py`
- `scripts/kfb369_bf_clips.py`
- `scripts/beat_overlay.py`

**Data:**

- `data/BF_A_hit_retaliation.json`
- `data/BF_B_long_miss.json`

**Assets:**

- `assets/KFB_BrickFish_clay01.glb`
- `assets/KFB_BrickFish_clay01.tossable.json`

**Previews:**

- `previews/BRICKFISH_A_hit_retaliation.mp4`
- `previews/BRICKFISH_B_long_miss.mp4`
- `previews/BRICKFISH_look.jpg`

**Blend copy (Dropbox):** `blend/KFB369_brickfish_toss_01.blend`.
