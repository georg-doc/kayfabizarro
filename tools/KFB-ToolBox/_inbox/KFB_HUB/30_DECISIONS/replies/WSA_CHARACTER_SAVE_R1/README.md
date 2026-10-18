# Existing ToolBox / Asset Library · GitHub proposal core R1

Prepared backend component, **not a working hosted save endpoint**. ToolBox v11 and Asset Library v16 remain unchanged. No new Site, renderer, app, credentials or alternative persistence store.

## Current blocker and authority

Sites integration reference requires `sites_list_plugin_eligibility` before selecting/declaring a hosted connector. This operation is absent from the current callable tools. Plugin discovery confirms GitHub and Sites are installed; that does not establish Sites eligibility. Do not guess a connector ID, copy the agent's token, put credentials in a browser, or invent a proxy. Preserve `.openai/hosting.json` until eligibility is available.

Native `github_create_branch` is described as create/update. The hosted adapter must prove atomic create-only behaviour on collision. The core refuses adapters without that guarantee. Do not set the capability flag just because a method is named createBranch.

The existing Sites must receive the supported Worker/server integration in place after that gate; no replacement Site. A shared import of this component can serve the two existing products, with ToolBox owning appearance and Asset Library owning character text.

## Transaction contract

`saveProposal(adapter, request, trustedAuth, {now, catalog})`

Server owns repository `georg-doc/kayfabizarro`, register ref, file paths, connector/action map, catalogs, timestamp and authenticated context. Browser supplies only document kind/id, exact source blob/body/recipe pins, edited values and an opaque request ID. Auth fields are **trusted server results**, never request-body booleans.

Trusted request ticket binds request ID and proposal date before mutation and remains the same over retries/midnight. Require authenticated owner, explicit platform write consent and same-origin POST. No GET/build/render mutation.

1. Inspect deterministic request branch and receipt first; same ID/different payload conflicts.
2. Read exact register head and document. Reject changed blob, body or recipe, including the forthcoming Hunky/Dory fixes.
3. Validate explicit editable fields. Preserve immutable sources/GLBs/original-removal/rig-module references, conflicts, todo and overall approval.
4. Prepare only the edited document plus a proposal receipt. Character edited leaves become `{v,src,status:'GEORG'}`; figure edits carry per-field provenance. Never approve the whole figure by saving.
5. Create tree and commit with the exact base parent. Re-read current card before exposing branch.
6. Atomically create `characters/edit-<id>-<date>-<requestId12>`. The suffix prevents same-day proposals replacing one another. Never update the register ref or merge.
7. Read back branch, document digest, receipt, exact parent and exact two-file change allowlist. Only then return `status:'success'`. On uncertain write outcome inspect this request, never blindly retry.

Private account ID is not written into GitHub files. Fixtures/test values are labelled test-only and never committed to canonical card paths.

## Supported edits / unresolved integration

Figure paths currently cover sourced eye controls/pupil/anchor positions, delivered BrowRig-v2 scalar fields, and catalogued mouth set/rest/tint. No GLB/body replacement, original-part removal, runtime module change, head-transform/dangle/surface patch or planned brow generation is accepted. Full Studio export is **not** a valid request: the future UI adapter must show unsupported dirty controls and refuse a partial save rather than silently dropping them. A changed body requires fresh source admission and explicit reapplication by Georg.

Character paths cover name/display name/aliases, background, existing trait leaves, catalogued deck assignments, relationship templates, and render style only from explicit alternatives. Figure appearance stays referenced; player-specific runtime memory is forbidden. Actual colour/surface editing needs a separately schema-backed figure field mapping before enabling those form controls.

Catalogs are server-fetched, source-pinned inputs, not browser-provided lists. The native GitHub adapter, trusted request ticket/consent route, preview of the diff, Studio save UI, saved-proposal readback UI, and hosted authorization/write tests are still required. R2 forms/R3 web-chat return transport remain dependent work; do not mark R2 or R3 complete.

## Validation

Run `node --test character-proposals.test.mjs` from this directory. Node built-ins only. 36/36 local tests passed; all remote APIs are deterministic fakes. Includes changed body/recipe, stale card during save, immutable fields, duplicate clicks, midnight retry, timeout-after-write reconciliation, mismatched idempotency payload, tampered readback, unauthorized writes, relationship-template memory injection and malformed brow values.

These tests prove the prepared transaction logic, not hosted visitor identity/consent, connector access or real GitHub writes from a Site. No integration test proposal was falsely attributed to Georg.

## Dramatis Personae continuation

Register snapshot `2a842c5f67cb75c2f6839e50f31ca5dc5b9c1856`: 11 character sheets and 13 figure cards. `4gtn_ceo` and `4gtn_forgotten` now have character sheets but no figure card; the R1 union reader already includes them after GitHub Refresh. Black Knight, Demon Lord, Monstrosity and Witch still have no character sheets. Do not create those four on WSA initiative.

All 13 figure cards have at least one unresolved item, including FrizzleBob's remaining R2-light clay proof despite card status approved. Brain-Cyborg has no delivered GLB/eye setting. Asset Library 3D remains locked. Current WS1 vendor listing @32480cf497e75640790b63f52eb8b1e7f5e6b4ef has light but no shared figure-card loader. Do not substitute ToolBox's temporary tuning admission for that consumer.
