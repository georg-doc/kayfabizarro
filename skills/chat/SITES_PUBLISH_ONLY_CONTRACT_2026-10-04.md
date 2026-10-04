# KFB Sites · PUBLISH_ONLY Contract · 2026-10-04

Status: **BINDING LOW-COST DELIVERY CONTRACT**
Owner: KFB production coordination

## Purpose

Separate expensive product reasoning from cheap host publication.

A build/recovery executor should finish engineering, freeze a publish packet, and stop.

A separate low-cost Sites-capable executor may then perform the deterministic publication step without reopening product scope.

## Execution mode

`PUBLISH_ONLY`

This is not:
- implementation;
- refactor;
- architecture;
- product recovery;
- model comparison;
- visual redesign.

## Executor selection

Use the **lowest-cost / lowest-reasoning executor that can actually publish/update GPT Sites**.

Do not automatically select or escalate to a premium/high-reasoning model merely because it has Sites capability.

If no low-cost Sites-capable executor is currently available:

- preserve the packet;
- record `SITES_PUBLISHER_REQUIRED`;
- wait or hand off;
- do not escalate reasoning tier automatically;
- do not substitute Cloudflare.

## Required input packet

The engineering executor must provide:

- owner;
- repository;
- branch/PR;
- exact source head;
- exact runtime/source closure;
- existing Site project ID, if already published;
- current Site URL, if already published;
- whether update-in-place is required;
- exact files to publish;
- assets/source pins;
- current QA evidence;
- expected revision marker;
- Hub metadata update requirements;
- explicit post-publication human gate.

## Authorized actions

The publish executor may only:

1. read the exact frozen packet;
2. confirm the existing Site owner/project;
3. publish/update the exact candidate;
4. avoid code/content modification;
5. persist Site project/version/deployment/source identity;
6. open/verify the exact Site URL when capability permits;
7. update Hub metadata when required;
8. return host/deployment status.

## Forbidden actions

Do not:

- change product code;
- rebuild missing features;
- alter source pins;
- redesign visuals;
- change model/provider strategy;
- create a new Site when an existing owner Site should be updated;
- switch to Cloudflare because Sites capability is missing;
- add new acceptance gates;
- turn browser-tool failure into product failure;
- merge or promote Live unless separately authorized.

## Failure handling

### Host-only failure

If the frozen product is valid but publishing fails:

`SITE_PUBLISH_BLOCKED`

Return:
- exact failed operation;
- host/tool error;
- exact preserved source packet;
- no code changes.

Do not escalate reasoning tier automatically.

### Real engineering failure discovered

If publishing proves the frozen source cannot actually be hosted without code changes:

- stop `PUBLISH_ONLY`;
- record the concrete engineering defect;
- return to the named product owner as `ENGINEERING_RECOVERY_REQUIRED`.

Only then may a higher-reasoning engineering executor be considered.

## Completion

A publish-only task completes with:

- exact Site URL;
- project ID;
- version ID;
- deployment ID;
- source head;
- verification status;
- Hub metadata status;
- no code changes;
- exactly one post-publication human/product gate when applicable.

## Cost invariant

> **Never spend premium reasoning credits to perform a deterministic Site publication that a cheaper capable executor can perform.**
