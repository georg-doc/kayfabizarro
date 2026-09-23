# DECISION · Drummer arms: manual posing by Georg · 2026-09-24

Für Georg: v2 ist abgelehnt (Arme verdreht). Die Arme werden ab jetzt von dir von Hand posiert, in einer vorbereiteten Blender-Werkstatt mit Gelenkschlössern. Ich posiere keine Arme mehr automatisch.

## Verdict on v2 (Georg, 2026-09-24): FAIL

- The clubs land on the drum.
- The arms are **grotesquely twisted, "broken several times"**.

## Root cause

- The v2 fit put constant wrist offsets on top of the mocap: twist up to 75°, plus ±45° on the other two wrist axes.
- The search optimised only club contact and club direction.
- The joint-limit audit **measured** the violation (right twist 101°, wrist 134°) but did not **block** it. Limits were reported, not enforced.

This is the same failure pattern as v1–v4: the arms were bent numerically toward a target.

## New rule

- **No automated arm posing for the drummer.** The arms are posed by hand by Georg.
- Claude's role is limited to:
  - preparing the scene
  - checking (clubs in body or in drum skin, joint angles)
  - exporting and documenting
- Joint limits are **hard constraints** in the rig (`LIMIT_ROTATION`, local space, "Affect Transform"), so a broken pose cannot be created in the first place.

## Pose workshop

`BLENDER MCP/ORB/DRUMMER_POSE_WERKSTATT.blend` (Dropbox, a separate file; the v5 file is untouched):

- **Base:** raw Mixamo "Playing Drums" on `Rig_Brute`, as a locked NLA base track.
- **Corrections:** an empty `Korrektur_Arme` action in COMBINE mode for the corrections.
- **Joint limits:**

  | Joint | Range |
  |---|---|
  | Elbow | local Z 0…150° (R) / −150…0° (L); X and Y locked |
  | Wrist | X −20…75/80°, Y −35/−45…30/35°, Z −40…25° |

  The raw mocap lies fully inside these ranges (checked), so the base motion is unchanged: pose error vs raw is 0.0001.
- **Grip:** clubs centred in the fist, offset `(±0.203, −0.269, 0.128)`, no diagonal tilt.
- **Drum:** `Orc_Wardrum` at scale 2, at (0, −2.3).
- **Timeline:** markers "R Schlag" / "L Schlag" on the mocap strike frames.

Guide in German: `ANLEITUNG_DRUMMER_POSE_WERKSTATT.md`.

## Still valid from earlier passes

- **Grip correction:** the Atlas/v0 offset put the club at the thumb-side edge of the fist. This probably affects every weapon attachment on the handslot and should be fixed centrally.
- **Accepted:** the Guitar A fit on the Orc Raider.
