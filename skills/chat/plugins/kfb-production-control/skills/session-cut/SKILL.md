---
name: session-cut
description: Build, verify and persist a complete recovery-ready KFB session cut for Claude Design, Cowork/Claude Code or Blender MCP, then upload it to KFB Production Control. Use only when the user explicitly requests a session cut, ZIP, export or durable handoff package.
disable-model-invocation: true
---

# KFB session cut

Workflow argument: `$ARGUMENTS`

## Canonical contract first

Read the **current GitHub version** of `georg-doc/kayfabizarro/skills/session_ZIP_v1.md` before packaging. Do not copy an old embedded version of that contract into this plugin.

Also apply the current KFB router/workflow and project SSOT/Return. GitHub truth wins over this skill if the contract has advanced.

## Build

Execute the canonical session-cut contract against the actual current workspace/candidate:

- closed replayable candidate basis;
- START/HANDOVER/RETURN/CURRENT_STATE/CHANGELOG/HOUSEKEEPING;
- SOURCE/manifest/checksums/test report/next-chat;
- source/donor pins and protected owners;
- actual evidence only;
- secret scan;
- `zipcheck.py` / clean run when supported;
- no hidden redesign before export.

For Blender MCP, preserve reproducible `.blend`/scripts and generated exports as the project/license allows. Blender remains an authoring lane unless explicitly promoted by its project owner.

## Persist

Choose the Production Control transport by actual artifact form:

- text/base64 artifact up to the direct-save limit -> `kfb_web_artifact_save`;
- public HTTPS artifact within import limit -> `kfb_web_artifact_import`;
- private binary within chunk-upload limit -> `kfb_web_upload_begin`, ordered `kfb_web_upload_chunk`, then `kfb_web_upload_finish`.

Never claim upload success before the finish/import/save result returns an artifact/file id and SHA-256.

## Verify

Use `kfb_web_artifact_read`.

If a file larger than the inline block returns a `readCursor`, call `kfb_web_artifact_read` again with that cursor as `fileId` until `readCursor: null`; reconstruct the bytes and verify the final SHA-256 when the server supports cursor reads.

If this server version does not provide cursor reads, use `kfb_web_artifact_link` only as a private short-lived verification path. Never publish that capability URL.

## Return checkpoint

Persist a `RETURN` checkpoint containing:

- exact owner/source branch/PR/head;
- session-cut filename;
- Production Control record/file id;
- SHA-256 and size;
- zipcheck/clean-run status;
- actual tests;
- missing/external dependencies;
- unresolved/TUNE/BLOCKED items;
- exactly one next gate.

A session cut is evidence/recovery, not automatic integration, Stage, merge or human acceptance.
