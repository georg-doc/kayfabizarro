# KFB UI Standard · Quiet Status + Complete Inline Editor · 2026-09-28

Status: BINDING FOR NEW TOOLBOX / ATLAS / EDITOR SLICES
Source verdict: Animation Library V1 = **PASS → UI/UX TUNE later**
Applies to: ToolBox, Animation Library, Resident Atlas, WorldBuilder, Dungeon/Platformer editors and every reused 3D in-scene editor.

## 1. The viewport belongs to the object

The central 3D view is the work surface. Status copy, validation explanations and source prose must not cover the actor, prop, track or scene.

Rules:

- PASS/PROVEN in the viewport is a small green check with an accessible tooltip.
- TUNE is a small amber dot or wrench icon.
- HOLD/ERROR is a compact icon with the explanation in the inspector or info drawer.
- Never place a large PROVEN, SOURCE REQUIRED or sentence-length label over the model.
- Long technical wording belongs in Details, not in the stage.
- Controls already present in the standard editor are not repeated as extra buttons around the viewport.

PROVEN remains a technical binding result, not a claim of visual correctness.

## 2. Animation card preview must paint its full frame

The Production-05 card-strip artefact is a TUNE item:

- no transparent or unpainted side gutters;
- always provide a background-color fallback;
- crop/position the contact-sheet frame inside one stable aspect ratio;
- never let sprite stepping expose the neighbouring frame or an empty strip;
- preserve the selected actor/clip identity while the card animates;
- low-device mode may use a static poster but must fill the same frame.

Acceptance view: first, middle and last preview frame at normal and narrow width, with no grey side line.

## 3. One complete 3D Inline Editor

There is one reusable editor contract. Consumers may hide irrelevant groups, but must not invent reduced private variants.

Required mini-menu:

- Select / Translate / Rotate / Scale;
- X / Y / Z axis lock plus free transform;
- Local / World space;
- snap on/off and step;
- numeric position, rotation and scale;
- focus selected;
- ground/contact fit;
- duplicate when the consumer allows creation;
- reset current transform;
- undo / redo;
- delete only when the consumer owns deletion;
- import/export through the consumer's existing JSON patch, never a second scene format.

Required interaction:

- visible transform gizmo;
- keyboard and pointer/touch operation;
- Orbit remains usable, including below the character where the consumer permits it;
- selection and transform survive switching Studio/Terrain or equivalent views;
- editor ownership is explicit: the shared editor emits a patch; the host runtime applies and saves it.

If this editor is present, redundant one-off transform buttons are removed. If the complete editor cannot be mounted, keep the existing host controls and label the editor integration as HOLD; do not ship a translate-only imitation.

## 4. Density budget

For any first viewport:

- at most one primary toolbar;
- at most one compact status icon per selected object;
- one inspector/drawer for secondary facts;
- no repeated technical badges;
- no prose banner unless the user must act before continuing;
- the active task, selected object and primary action must be visually obvious within three seconds.

## 5. Current Animation Library verdict

Functional base accepted:

- 204 clips;
- 24/24 Library checks;
- Studio/Terrain flow;
- editorial patch;
- Librarian projection;
- local intake preview.

Deferred TUNE bundle:

1. replace the large stage status label with the quiet status icon;
2. remove grey side gutters from animated card previews;
3. adopt the complete shared 3D Inline Editor contract instead of another partial integration.

These are one later ToolBox UI tune, not three MVP blockers and not a reason to rebuild Production-05.
