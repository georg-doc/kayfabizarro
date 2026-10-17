# Editorial scenelets and dioramas

Storage stays with the existing Asset Library / character owner:
WEBCHAT_AUTHORING_R1/scenelets/<id>.scenelet.json
WEBCHAT_AUTHORING_R1/dioramas/<id>.diorama.json

The editorial contract is kfb.authoring-scene/1, not a new executable scene/runtime schema. It preserves authoring intent for existing resident-set/world/performance owners. Search the current sources first; existing accepted scene documents keep their own format and owner. This contract never replaces them.

Required document:
- schema: kfb.authoring-scene/1
- id: snake_case stable ID matching filename
- kind: scenelet or diorama
- status: DESIGN (whole concept remains a proposal; confirmed individual leaves can be GEORG)
- title, premise, playerRole: each {v,src,status}
- characterIds: array of exact existing or explicitly proposed character IDs
- beats: array of {v,src,status} causal beats; empty only with explicit todo
- composition: {v,src,status}, with focal action, spatial relations and purpose, or null/todo
- assetRefs: array of {repo,commit,path,role,licenseEvidence,visualEvidence}; commit 40 hex, repository paths only, no executable URLs. Empty when assets unknown.
- runtimeRef: null unless an existing accepted runtime document is actually found; then {repo,commit,path}
- provenance: array of checked source references
- conflicts: array of unresolved sourced alternatives
- todo: array of missing production/content needs

Allowed leaf statuses GEORG, SOURCE, DESIGN, PREFILL, todo. Non-todo leaves require src; todo requires v:null. A proposal authored by an agent is DESIGN even when saved. Do not invent IDs or mark whole scenes approved.
New scene characters without figure cards are text-only/todo; every later renderer must resolve the shared figure card. No raw GLBs, copied rigs or private light presets. Existing stage light remains authoritative.
No generated meshes/images/audio are included by default. A prompt or concept is not a produced asset, and a source link is not proof of visual inspection.
