# RECOVERY LOG · PD-POOL historical manifest · 2026-09-27

Status: **ACTIVE · ORIGINAL NOT YET FOUND**

Branch: `chatgpt-web/public-domain-manifest-recovery-2026-09-27`  
Draft PR: **#251**  
Recovery target: original source behind **84 free / 6 attribution / 40 rejected**

## Checkpoint 01 · durable recovery path

PASS.

Created and verified:
- `START_HERE.md`
- branch from `main@154f9e9e2c13d22929996d3c47288c55a7d8e55c`
- initial recovery commit `47d10986de920e3cc4abb520b4a9675b7b18bdd8`
- Draft PR #251

## Checkpoint 02 · known GitHub/intake facts

Confirmed:
- current GitHub does not contain exact text hits for `84 free`, `84 frei`, `6 attribution`, or `40 rejected`;
- current PD docs explicitly state the intake ZIP lacked the historical selection UI / `pool-manifest.jsonl`;
- GitHub search finds only the later R1/R2/R3 evidence and four-object smoke manifest;
- no current GitHub object-level 84/6/40 manifest has been found.

Classification: **DERIVED_REFERENCE_ONLY**.

## Checkpoint 03 · Dropbox active-file searches

Read-only searches performed.

### /CLAUDE filename-oriented
Searched:
- Public Domain
- public_domain
- manifest
- pool
- selection
- silent film

Result:
- no obvious `KFB Public Domain Pool` export;
- no `pool-manifest.jsonl`;
- no silent-film selection export;
- generic manifest/selection hits are unrelated.

### /Mac/Downloads filename-oriented
Searched:
- Public Domain
- pool
- silent

Result:
- no relevant Public Domain Pool export.

### Global filename-oriented
Searched likely ZIP/manifest names and `Domain Pool`.

Result:
- no active ZIP with public/domain/pool naming;
- `Domain Pool` hits are current Git branch/ref files in a Dropbox-synced local KAYFABIZARRO workspace, not the historical source.

### Exact-content search inside Dropbox-synced KAYFABIZARRO workspace
Searched:
- 84 free
- 6 attribution
- 40 rejected
- silent film

Result: **0 hits**.

## Checkpoint 04 · older Dropbox text references

Fetched:
- `/CLAUDE/_kfb_checkin/router/CHANGELOG.md`
- `/CLAUDE/_to_delete/_github_upload_2026-09-26/gh_kfz/skills/chat/CHANGELOG.md`

Neither contains the target counts or a historical manifest path.

Classification: **UNRELATED / NO RECOVERY EVIDENCE**.

## Current hypothesis

The historical source is more likely to be one of:
1. a deleted/moved Claude Design export;
2. an unindexed HTML/JSON/ZIP in another Dropbox location;
3. a local-only export that was removed after the later two-file ZIP was created;
4. a chat/session artifact never copied into the repository.

This is a search hypothesis only.

## Next exact actions

1. inspect Dropbox activity / restore history around the likely Claude Design/Public Domain Pool work for deleted or moved files;
2. list recent direct children in likely `/CLAUDE` locations and identify Public Domain / Pool / Claude session folders;
3. if a candidate path is found, inspect it read-only and classify:
   - `RECOVERED_ORIGINAL`
   - `PARTIAL_ORIGINAL`
   - `DERIVED_REFERENCE_ONLY`
   - `UNRELATED`
4. persist every meaningful finding here before chat prose.

## Fresh-chat instruction

A replacement chat must read `START_HERE.md` and this log, verify the exact PR #251 branch head, and continue at **Next exact actions**. Do not repeat completed searches unless Dropbox state has materially changed.
