# KFB Production Desk v0 · Current Operations Artifact

Status: **PREPARED FOR COWORKER BUILD · DOES NOT REPLACE KFB HUB**

## Für Georg

Der KFB Hub bleibt Navigator/Archiv.

Das **KFB Production Desk** wird die aktuellere Arbeitsoberfläche für:
- laufende Slices;
- Human-Gates;
- direkte Review-Artefakte;
- aktuelle Briefings;
- Claude/Blender/Coworker-Handoffs;
- WSA-Queue;
- Standards/Templates.

Ziel:
Du sollst nicht erst einen neuen Webchat eröffnen müssen, um herauszufinden:
- was gerade läuft;
- was du anschauen musst;
- welches Briefing jetzt gilt;
- welcher Agent als Nächstes dran ist.

## 1 · Truth model

GitHub bleibt Wahrheit.

Das Desk ist ein **rendered operational mirror** aus einem aktuellen Snapshot.

Standalone HTML darf **nicht** so tun, als hätte es automatisch Zugriff auf private GitHub-Repos.

Coworker aktualisiert:
`PRODUCTION_DESK_STATE.json`
über den GitHub-Connector.

Desk zeigt sichtbar:
- `lastSyncedAt`;
- source branch/head;
- stale warning if older than configured threshold.

No hidden live-data claim.

## 2 · Primary surfaces

### NOW
Maximal 4 aktuelle Dinge.

Jede Karte:
- plain-language title;
- owner/provider;
- state;
- repo/PR/head;
- what is being built;
- what Georg must do, if anything;
- next step.

### HUMAN REVIEW
Only actual Georg decisions.

Each review card must have:
- direct artifact state;
- direct clickable artifact when available in the current environment;
- durable GitHub/CI artifact location;
- 1–3 questions;
- ACCEPT / TUNE / REJECT result.

### ACTIVE BUILDS
Coworker / Blender / Web.

Examples:
- ToolBox Source-Safe Integration;
- Warband Blender authoring;
- WorldBuilder WB2.

### CLAUDE RECOVERY
Current resumable donor-locked briefs:
- Curtain;
- Billboard.

One button:
`Copy current start prompt`

No stale brief without warning.

### NEXT SLICES
Prepared but not started:
- Racer Anatomy Foundation;
- VFX/SFX Consolidation;
- next accepted MVP.

### WSA
Show:
- `NOT NEEDED`;
- or exact CLOSED packet + missing capability.

No generic “send to Work” button.

### STANDARDS
Compact links:
- Hybrid Handoff;
- Donor Lock;
- Closed Packet;
- Review Scene Base;
- Performance Animation Pilot;
- Human-readable status;
- current 3D cartoon form-language lane.

## 3 · Web Slice Launcher

Provide a small template generator/copy block for a new Webchat.

Inputs:
- project/lane;
- owner repo;
- target PR/base;
- one outcome;
- relevant donor(s);
- review artifact name.

Generated start text must include:
- current START_HERE;
- GitHub-wins rule;
- closed owner/scope;
- direct clickable review requirement;
- durable review artifact requirement;
- two-pass stop rule;
- no Cloudflare debug loop.

## 4 · Review artifact registry

Desk stores metadata only:

- artifact id;
- owner lane;
- source head;
- filename;
- durable GitHub/CI location;
- direct chat-delivery status;
- human result.

Do not embed every large review HTML into the Desk.

## 5 · Briefing registry

Every current briefing record:

```json
{
  "id": "...",
  "title": "...",
  "status": "CURRENT | HOLD | RECOVERY | REFERENCE",
  "provider": "Coworker | Blender MCP | Claude Design | Web | WSA",
  "source": "repo/path@head",
  "startPrompt": "...",
  "nextGate": "...",
  "supersedes": []
}
```

Old briefings remain searchable but cannot appear as CURRENT automatically.

## 6 · Current sections required in v0

1. ToolBox / Coworker
2. WorldBuilder
3. Travel
4. Racer
5. Blender Warband
6. 3D Cartoon Form Language / Hürth
7. Curtain recovery
8. Billboard recovery
9. VFX/SFX consolidation
10. WSA status

## 7 · Visual design

Keep it more operational than the KFB Hub.

Desired:
- dense but readable;
- no giant hero;
- desktop split-screen friendly;
- mobile usable;
- status color restrained;
- one top command strip;
- cards compact;
- detail drawer rather than card-wall bloat.

Do not introduce a new KFB visual brand.

## 8 · Update workflow

Coworker refresh:

1. fetch named current PRs/heads;
2. read current Returns only;
3. update `PRODUCTION_DESK_STATE.json`;
4. regenerate/update artifact;
5. syntax/self-test;
6. persist HTML;
7. return one direct clickable artifact.

No manual copy of dozens of histories.

## 9 · GitHub Connect behavior

Inside Coworker/Claude:
GitHub connector can be used to refresh the snapshot.

Inside standalone HTML:
assume **no authenticated private GitHub API** unless explicitly proven.

Therefore the artifact is deterministic from the checked-in snapshot.

## 10 · Done v0

v0 passes when Georg can answer from one surface:

- What is running now?
- What needs my decision?
- What brief can I resume right now?
- What is Coworker doing?
- What is Blender doing?
- Is WSA needed?
- How do I launch the next Web slice with the standard review setup?

No Cloudflare required for v0.
