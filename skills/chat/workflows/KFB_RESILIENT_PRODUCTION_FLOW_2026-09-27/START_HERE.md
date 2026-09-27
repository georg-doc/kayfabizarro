# KFB Resilient Production Flow v2

Status: **READY · BINDING RECOVERY ADDENDUM**  
Date: 2026-09-27  
Owner: existing project owner + existing HUB/Publication owner

## Problem statement

KFB has four recurring failure classes which must not be collapsed into the word “timeout”:

1. **Chat transport/client interruption** — a long Web/Design conversation stalls or disconnects.
2. **GitHub write response lost** — commit/ref update may or may not have happened; result is `UNKNOWN` until the ref and files are read back.
3. **CI harness timeout** — the product may be healthy while a fixed test wait or wrong diagnostic key fails, as observed in World/OSM PR #257.
4. **Publication/routing lag** — source is safe on GitHub but Cloudflare or its route has not yet produced a verified public receipt.

The workflow cannot prevent every network or service interruption. It must guarantee that an interruption loses at most one small operation and never the slice's only useful state.

## R0 implementation outcome

Create one repository-native continuation contract, not another dashboard:

- `RUN_STATE.json` schema;
- stable checkpoint id;
- exact branch head and intended file hashes;
- one next operation and stop condition;
- `PUBLISH_REQUEST.json` schema;
- `DEPLOYMENT_RECEIPT.json` schema;
- one publication dispatcher owned by the existing Hub/Cloudflare owner.

No product runtime changes in R0.

## Mandatory checkpoint cadence

Checkpoint 0 occurs immediately after source lock and bounded plan, no later than ten minutes after production begins and always before a long command, upload, browser matrix or deployment wait.

Then use only:

1. `C0_SOURCE_LOCK`
2. `C1_IMPLEMENTATION`
3. `C2_EVIDENCE_RETURN`
4. `PUBLISH_REQUESTED`
5. `DEPLOYMENT_RECEIPT`
6. `PUBLIC_VERIFIED` or explicit failure state

A small slice may combine C0 and C1. It may not skip the verified head readback.

## Minimal RUN_STATE

```json
{
  "schema": "kfb.run-state/1",
  "sliceId": "EXAMPLE-R1",
  "checkpointId": "EXAMPLE-R1-C1",
  "owner": "existing owner",
  "repo": "owner/repo",
  "branch": "named-branch",
  "verifiedHead": "exact sha",
  "completed": "implementation",
  "nextOperation": "run fixed browser proof",
  "protected": ["movement owner", "camera owner"],
  "blockers": [],
  "stop": "two failed repair candidates"
}
```

## Timeout recovery

Never regenerate first.

1. Mark the operation `UNKNOWN` with timestamp and checkpoint id.
2. Fetch the exact branch ref.
3. Read intended files and compare hashes/markers.
4. If present, continue from that head.
5. If absent, retry once with the same checkpoint id.
6. If still unknown, stop and preserve the local/intended tree or full recovery package.

## Durable publication

The authoring chat ends after source/evidence is safely pushed and a publication request exists. A single GitHub-owned publisher builds and tests the exact source head, publishes it, and writes a receipt containing:

- source head;
- publication head;
- direct route;
- test/run ids;
- deployment result;
- public browser result when available.

The Hub reads only verified source metadata or receipts. It never treats a PR, commit or CI PASS as `PUBLIC_VERIFIED`.

## Web/Design session sizing

One chat = one bounded outcome, normally at most two commits/checkpoints. Do not combine source census, broad implementation, full QA, public deployment and Hub consolidation in one fragile conversation.

Use a fresh continuation from `RUN_STATE` when the chat becomes long, accumulates contradictory history or stalls once after a successful checkpoint.

## Client/network diagnostic, separate from repository recovery

Official OpenAI guidance identifies long chats, VPN/proxy/secure-DNS/content blockers, network changes and WebSocket interruption as relevant troubleshooting dimensions. Run one controlled comparison:

- short fresh chat;
- same task class;
- VPN/proxy/content blockers disabled where safe;
- optionally a second network;
- record time, model, conversation URL/id and exact error.

If failures persist across browsers/networks, collect browser console output and a HAR file with timestamps for OpenAI Support. Repository checkpointing remains mandatory regardless of that result.

Official references:

- <https://help.openai.com/en/articles/7996703-troubleshooting-chatgpt-error-messages>
- <https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps>

## Acceptance

R0 is complete when an intentionally interrupted sample slice can resume in a fresh chat using only GitHub:

- no transcript reconstruction;
- no duplicate commit after simulated timeout;
- publication can finish without the authoring chat;
- Hub status is derived from the receipt;
- exactly one next gate remains.
