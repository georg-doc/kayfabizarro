# KFB Control Plane Recovery 01

Status: **ACTIVE TECHNICAL RECOVERY · NO STAGE REQUIRED**
Date: 2026-10-01
Owner: Georg / KFB production routing in `georg-doc/kayfabizarro`
Workflow: `KFB-CONTROL-PLANE-RECOVERY-01`

## One bounded outcome

Make the current Production Hub usable as a navigator without allowing it to become a second SSOT or an expensive WSA lead loop.

This slice closes three operational gaps:

1. **safe Production-Control reads** for active workflow recovery;
2. **portable Claude briefings** that remain executable when `chatgpt.site` is not readable by Claude;
3. **WSA escalation-only routing** with a mandatory missing-capability reason and stop condition.

It also removes the stale root-Hub wording left behind by the entrypoint migration.

## Source and protected boundary

Base source is the current Hub-entrypoint migration candidate, not a replacement Hub implementation.

Protected:
- GitHub/project SSOTs remain authoritative;
- Production Control remains navigator / inbox / checkpoint surface;
- Web/GitHub remains the default production lane;
- Claude Design remains the visual-authoring specialist;
- Work/WSA remains escalation-only;
- all existing `kayfabizarro.pages.dev/kfb-hub/...` child Stage/review/asset routes remain untouched;
- no merge, Live promotion or Cloudflare publication is part of this slice.

Stage route: **NONE — technical control-plane recovery; no human Stage decision exists.**

## Observed failures

### CP-READ-01 · broad authenticated read

Observed on 2026-10-01:
- `kfb_web_read({limit:100})` failed server-side while resolving `production_files`;
- `kfb_web_read({limit:20})` succeeded;
- exact workflow-filtered reads succeed.

Until the backend query is repaired, active recovery uses:
- exact `workflow` whenever known;
- `limit <= 20`;
- Production Control as convenience state only, never as the only source of project truth.

Do **not** claim the server defect fixed from this repository slice.

### CP-CLAUDE-01 · Site-only briefing

An active Claude briefing is invalid if its only usable source is a Production-Control `chatgpt.site` URL.

Every ACTIVE/READY briefing must carry a portable source fallback:
- exact GitHub repo + immutable head + path; **or**
- a complete copy-ready self-contained prompt.

Claude Design must be able to start from that fallback without reading the Production Hub.

### CP-WSA-01 · Work used as routine lead

A briefing may name Work/WSA only when Web + Claude cannot perform one required capability.

The briefing must state:
- missing capability;
- already-prepared exact source;
- forbidden changes;
- one success check;
- immediate stop condition.

No concrete missing capability = **route back to Web/Claude**.

## Implementation in this slice

- portable `briefing-contract.v1.mjs` validator for active briefing metadata;
- repository-native no-dependency test suite;
- Claude adapter rule requiring GitHub/self-contained fallback;
- Web-first rule requiring explicit WSA escalation data;
- safe-read rule for the Production-Control connector;
- Hub README correction: Production Control is the current human Hub owner; the old Cloudflare root is a compatibility entrypoint only;
- additive Return + changelog.

## Done when

- validator tests are green;
- current routing docs contain the three hard rules above;
- this workflow is persisted to Production Control and read back;
- exact branch files are read back after writes;
- unresolved backend defect remains explicitly visible rather than being converted into a false PASS.

## Backend escalation boundary

If the Production-Control backend itself is to be repaired, that is one legitimate minimal Work/WSA escalation because this Web connector exposes read/checkpoint APIs but not the Site server source.

The escalation is only:
> repair the broad `kfb_web_read` file-join/query path so `limit:100` does not fail; preserve API shape and Site UI; prove `limit:20` and `limit:100` both return successfully; stop on first unrelated failure.

No Hub redesign, briefing rewrite, routing archaeology or deployment cleanup is included.

## Exactly one next gate

Adopt the validated briefing contract in the Production-Control briefing generator/UI; if server-source access is required, use only the bounded backend escalation above.
