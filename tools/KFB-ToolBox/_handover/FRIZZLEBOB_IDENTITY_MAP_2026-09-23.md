# FrizzleBob · three distinct 3D lineages · 2026-09-23

Status: **CURRENT IDENTITY GUARDRAIL**

Purpose: stop ToolBox, WorldBuilder, Combat and Claude Design from silently substituting one FrizzleBob for another.

## 1 · Cube-Pet FrizzleBob

**Use name:** `FrizzleBob · Cube-Pet`

Source family:
- `animal-bunny.glb`
- `kfb.pets/1`
- old Pet/Patch Studio lineage

This is the compact Cube-Pet rabbit.

It remains a valid legacy actor and keeps its own saved Pet configuration.

It is **not** the current biped FrizzleBob Driver.

## 2 · Combat-v3 Platformer FrizzleBob

**Use name:** `FrizzleBob · Combat Platformer`

This is the squatter rabbit used by the old Combat Arena v3 line.

Verified source:
- repository: `georg-doc/KFB-Combat-Arena`
- Combat page: `KFB Combat Arena v3.dc.html`
- actor reader: `combat-arena-v1/frizzlebob.v1.js`
- body source: Kenney `Platformer Game Kit - Dec 2021/Character/glTF/Character.gltf`
- gun source: `Character_Gun.gltf`
- local yellow variants: `FrizzleBob_Yellow*.gltf`

The source describes itself as:
`FrizzleBob als Platformer-Figur mit Pet-Studio-Gesicht`.

It uses the older Platformer body with the older face path.

This is **legacy Combat presentation**, not the current FrizzleBob.

Important naming note:
Georg may refer to this visually as “FrizzleBob v3” because it belongs to the Combat-v3 period. The actor source file itself is named `frizzlebob.v1.js`; do not confuse product-era naming with source-file version.

## 3 · Current FrizzleBob Driver Graft

**Use name:** `FrizzleBob · Driver Graft`

Current ToolBox source:
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`
- actor id: `graft-driver`
- rig family: `Rig_Medium`

This combines the Driver body with the current FrizzleBob head/face system.

Current contract visibly distinguishes it from the older versions, including the current red nose configuration and `carl-original` brow configuration.

This is the default meaning of **FrizzleBob** in current ToolBox / WorldBuilder / current Combat integration unless a legacy variant is explicitly requested.

## Hard rule

Never silently substitute:

`Cube-Pet ↔ Combat Platformer ↔ Driver Graft`

Every review artifact that contains FrizzleBob must show one of the three explicit labels above and its source.

If a requested source is unavailable, show `SOURCE REQUIRED` rather than falling back to another FrizzleBob.

## Current review implication

The rejected Claude ToolBox Round 1 used the Cube-Pet line where the current Driver Graft was expected.

Future source reviews must show these lineages separately before combining them into a common ToolBox roster.
