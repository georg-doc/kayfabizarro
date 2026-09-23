# Shared Editor · Scale Contract Note · 2026-09-23

Status: **SOURCE CLARIFICATION · DO NOT CREATE A SECOND SCHEMA**

## Für Georg

Skalierung ist **nicht mehr eine offene Datenfrage**.

Der gemeinsame Speichervertrag kann Scale bereits speichern.

Was historisch fehlte, war nur die sichtbare Scale-Bedienung im alten S21-Mini-Menü.

## Verified source split

### Persistence / patch contract

Current shared contract:
`skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`

Blob:
`7f28e293c86dbf23abffd4ad204078bc1fa1422c`

`kfb.scene-patch.v1` already defines:

```json
{
  "id": "host-object-id",
  "position": [0,0,0],
  "rotation": [0,0,0],
  "scale": [1,1,1]
}
```

Therefore:
**no additive scale schema field is required.**

### Original S21 interaction grammar

Source:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/docs/EDITOR_LAYER.md`

Blob:
`8e2d88c1d19f15a40d34ead56a612df53225e530`

Visible original menu documents:
- move;
- rotate;
- drop;
- scope;
- close.

It does not document Scale as a visible S21 menu gesture.

This is an **interaction/UI lineage gap**, not a persistence-schema gap.

### Current shared editor behavior

WorldBuilder PR #186:
R2 shared editor was human accepted by Georg with:
- Move;
- Rotate;
- free Scale;
- Drop;
- World/Local;
- Save/Reload transform roundtrip.

R3 adds only a convenience gesture:
- uniform smaller/larger;
- free Scale remains available.

## Production rule

Future ToolBox/WorldBuilder consumers:

- use existing `kfb.scene-patch.v1` for scale persistence;
- consume the accepted shared edit-layer Scale behavior;
- do not invent `scene-patch.v2` merely to add scale;
- treat uniform `−/+` scale as optional interaction convenience unless promoted separately.

## Coworker correction

If a proposal says:

> add `scale:[x,y,z]` to the shared transform contract

correct it to:

> Scale already exists in `kfb.scene-patch.v1`; only the historical S21 interaction grammar lacked a visible Scale action.

No new persistence contract is needed.
