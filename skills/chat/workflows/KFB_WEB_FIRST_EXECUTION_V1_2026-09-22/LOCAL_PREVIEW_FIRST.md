# KFB Local Preview First · browser/game/3D slices

Status: CURRENT DEVELOPMENT REVIEW CONTRACT  
Purpose: fast visible iteration without Work and without Cloudflare.

## Rule

Every new browser/game/3D slice should be testable through local HTTP before public Stage packaging.

`file://` is not an acceptable preview path for ES-module/Three.js apps.

## Slice deliverables

Return:

- exact GitHub branch;
- exact head;
- local setup command;
- local start command;
- localhost URL;
- expected revision/status marker;
- stop command;
- known browser requirements.

Prefer existing project dependencies and scripts.

Do not introduce a new dev framework merely to serve files.

## Preferred user loop

1. Web/Claude commits candidate.
2. Georg pulls the branch in GitHub Desktop.
3. Georg runs the supplied local preview command.
4. Browser opens localhost.
5. Georg reports only visible/interaction issues.
6. Web/Claude repairs the same branch.
7. Repeat locally.
8. Only after local acceptance consider Cloudflare or Work.

## Browser evidence

Where possible expose a compact debug/report surface for:

- source SHA;
- loaded asset failures;
- console/runtime error count;
- current mode/state;
- key ownership markers.

This is diagnostics, not generic UI chrome.

## Work escalation

Local preview failure does not automatically trigger Work.

Use Web for source/runtime diagnosis.

Escalate only when the next required action needs a capability Web + local preview cannot provide.

## Public status

A local preview may be:

`LOCAL REVIEW · NOT PUBLIC`

This is a valid productive result.

Do not pretend it is `PUBLIC_VERIFIED`.
