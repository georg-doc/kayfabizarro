# VIDEO FINDINGS · KAYKIT_CREATOR_SCAN_01

Status: **SOURCE_BLOCKED**
Evidence mode: **visual-only claims required**
Date: 2026-10-03

## Result in one sentence

The three required original creator videos could not be inspected frame-by-frame in this executor, so this return contains **no fabricated visual observations** and no motion conclusions derived from transcript, metadata or general KayKit/Godot/Unity knowledge.

## Topic coverage

| topic | coverage | result |
| --- | --- | --- |
| Native gait · Idle / `Walking_A/B/C` / `Running_A/B` | **SOURCE_BLOCKED** | No original-video frames available; foot contact, passing pose, body lean, arm pose, visible clip choice and playback speed remain unverified. |
| Idle ↔ Walk ↔ Run transitions | **SOURCE_BLOCKED** | Blend tree/state machine, blend time, thresholds, start/stop/turn handling and speed parameters remain unverified. |
| Jump | **SOURCE_BLOCKED** | `Jump_Start`, `Jump_Idle`, `Jump_Land`, `Jump_Full_Short`, `Jump_Full_Long`, air-time handling and ground-motion timing remain unverified. |
| Backwards / Strafe / Sneak / Crouch / Crawl / Dodge | **SOURCE_BLOCKED** | Cannot distinguish shown from not shown without viewing the videos. |
| Bow / Ranged | **SOURCE_BLOCKED** | Draw, Aim, Release and `Running_HoldingBow` remain unverified. |
| Rig_Medium vs Rig_Large | **SOURCE_BLOCKED** | Current pack page confirms both rigs exist; visible creator comparison remains unverified. |
| Import / scale / skeleton / retarget | **SOURCE_BLOCKED** | No readable original-video UI was captured. |
| Root Motion vs In-place | **SOURCE_BLOCKED** | No visible or creator-spoken claim promoted without visual source access. |

## What is known only from source metadata

These items are useful for navigation but are **not** `SEEN` video findings:

- The current official KayKit Character Animations page labels the pack as **1.1**, with **161** humanoid animations and `Rig_Medium` / `Rig_Large`.
- Public YouTube metadata for `rwst5GnUU7s` dates the tutorial to **2022-02-07** and exposes chapter headings for Unity and Godot import/use. This tutorial date must not be silently treated as current 1.1 evidence.
- The required version check for `T1KNCtAqJ7A` — older set versus Character Animations 1.1 — remains **SOURCE_BLOCKED** because no visible frame or UI label was available.

## Evidence counts

- Original videos required: **3**
- Original videos visually completed: **0**
- Original videos visually blocked: **3**
- `SEEN` moments: **0**
- `SAID` moments promoted: **0**
- `INFERRED` motion claims: **0**
- `NOT_SHOWN` conclusions: **0**
- Substitute creator videos used: **0**
- Contact sheets produced: **0**

## Contact sheets

No contact sheet is committed in this blocked return.

That omission is intentional. A blank, thumbnail-only or transcript-derived contact sheet would be a placeholder and would violate the evidence protocol. The three expected contact-sheet filenames may only be created after actual original-video frames are inspected and selected.

## What the visual retry must capture

The next visual-capable executor should stay on the same three original sources and collect only decisive frames:

1. **Gait:** contact → passing → opposite contact for the creator's actual Walk and Run examples, plus any readable clip name / speed UI.
2. **Transitions:** source state → visible blend/intermediate state → destination state, plus the state-machine or blend-tree UI where readable.
3. **Jump:** takeoff / airborne / landing, including visible clip names or timing conditions where shown.
4. **Other movement:** only if genuinely shown; otherwise mark `NOT_SHOWN`.
5. **Rig/import:** readable scale, skeleton/retarget, root-motion/in-place or engine options only when visible.

Each captured moment must include an exact timestamped original URL and then produce one Blender comparison instruction.

## Blender status

**Do not start creator-reference side-by-side rendering from this blocked return.**

PR #344's native KayKit Blender review remains a separate valid prepared source review, but this creator-video evidence layer has not supplied trustworthy timestamps or frames yet. After the visual retry succeeds, **Blender MCP** can render the corresponding Mannequin/ActionFigure clips at matched phases.
