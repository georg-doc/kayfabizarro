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

## Checkpoint 05 · Billboard B2b precursor ruled out

Historical PR #211 / branch `chatgpt-web/billboard-b2b-research-2026-09-25` was inspected because it is the clearest precursor to the later Public Domain Pool work.

Verified source files:
- `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/OPTIONS_MEMO.md`
- `RECOVERY.md`
- `RETURN.md`
- `SOURCE.json`
- `TEST_REPORT.md`
- `B2B_P1_BUILD_BRIEF_2026-09-25.md`
- `B2B_P1_FRESH_CHAT_START_2026-09-25.md`
- `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_P1_2026-09-25/collage-provenance.json`

Findings:
- research proposed **6–12 curated KFB/CC0 stills**, not a 130-row historical pool;
- source order included Smithsonian CC0, LOC Free to Use/Reuse, Chronicling America, Europeana PDM/CC0 allow-list and Wikimedia PD/CC0 allow-list;
- the implemented B2b-P1 provenance file contains **6 local Kenney CC0 stills** only;
- no `84 free / 6 attribution / 40 rejected` counts;
- no historical selection UI path;
- no historical `pool-manifest.jsonl`;
- no object-level 130-decision export.

Classification: **DERIVED_REFERENCE_ONLY · PRECURSOR, NOT ORIGINAL**.

This branch may explain why a later Public Domain Pool was commissioned, but it must not be used to reconstruct the missing historical selections.

## Checkpoint 06 · personal Library / prior-chat source search

Read-only search of prior ChatGPT/library sources for the exact 84/6/40 artifact produced no original manifest, UI export filename or attachment. Results were unrelated World/WSA/Town material or later PD references.

Classification: **NO ORIGINAL CANDIDATE**.

## Refined next actions

1. Search Dropbox for a Claude Design/DC HTML or export created **after B2b research** and before PD01 intake, including generically named `.dc.html`, HTML, JSON, JSONL or ZIP files.
2. Inspect Dropbox activity/deletion history in the relevant 2026-09-25 → 2026-09-27 window for files/folders added then removed or renamed outside the active `/CLAUDE` root.
3. Search local Dropbox-synced KAYFABIZARRO workspace for untracked/ignored Public Domain artifacts only if Dropbox exposes them as normal files.
4. If no original is recoverable from those sources, return **RECOVERY_NOT_FOUND** rather than inventing a manifest; a new curated discovery round remains a separate explicitly new dataset.

## Checkpoint 07 · earliest durable 84/6/40 evidence recovered

The earliest durable GitHub evidence for the historical UI has been recovered.

### First PD briefing commit

Commit:
`68f312e72a60c832420566fc5076fd75ca061eeb`
at **2026-09-26T23:08:10Z**

Created:
`tools/production_desk/briefings/PUBLIC_DOMAIN_POOL_PD01_2026-09-27.md`

The new file states as already proven at that time:
- the selection UI queried **The Met, Art Institute of Chicago, Wikimedia Commons and Internet Archive**;
- the existing `silent film` preview showed **84 free**, **6 requiring attribution/name credit**, and **40 rejected**;
- clicking an object could place it in an **export list**;
- a downloader package existed but was **UNTESTED / HOLD**.

This is the strongest recovered description of the lost interface so far.

Classification:
**DERIVED_REFERENCE_ONLY · HISTORICAL COUNTS/FUNCTIONALITY PROVEN, OBJECT ROWS ABSENT**.

It does **not** contain the original object-level results or export list and therefore is not the missing manifest.

### Routing chronology

- `68f312e…` 23:08:10Z — smoke-test brief created;
- `97b1949…` 23:08:35Z — public-domain pool surfaced on Hub Today;
- `6d342db…` 23:08:57Z — lane `public-domain-pool-pd01` added to production registry;
- `b9d934b1…` 23:10:24Z — later intake metadata sync; it did not create the PD lane.

The later Hub decision marker `manual-b9d934b1-pd-pool-intake-sync` therefore points to already-existing PD routing, not the original manifest.

## Checkpoint 08 · known ZIP history exhausted

Known ZIP:
`tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip`

Git history:
- exactly **one** commit touches this path:
  `d52325945805f8d27cc636907afcd85036e09aa0`
  at **2026-09-26T21:10:39Z**;
- no older GitHub revision exists to restore;
- commit contains only that ZIP upload.

Previously verified ZIP contents remain:
1. `media/public_domain/README.md`
2. `tools/public_domain/fetch_pool.py`

No selection UI and no exported hit manifest.

## Checkpoint 09 · Dropbox timing and deleted-file evidence

Read-only Dropbox activity was checked around both critical windows.

### Around ZIP GitHub upload · ~21:10Z
- `/Mac`, `/Mac/Downloads`, `/CLAUDE` and root activity show **no Public Domain Pool file**;
- first nearby Downloads additions are unrelated:
  - `KFB Asset Kontaktbogen · Stadt.dc.html` at 21:14:36Z;
  - `AN_PROFILE_02_REVIEW_PLAIN.html` at 21:15:32Z.

### Around first PD briefing · ~23:08Z
- `/CLAUDE` activity shows the city contact sheet at 23:07:16Z, then Racetrack files from 23:21Z;
- no Public Domain Pool HTML/JSON/ZIP add/delete/move event appears in the sampled critical interval.

The city contact sheet itself was fetched and inspected:
- World/Hürth city-asset contact sheet;
- Registry pin / city-assets source;
- no 84/6/40 data;
- no four-provider Public Domain UI.

Classification: **UNRELATED**.

## Checkpoint 10 · UI-text and untracked-file searches

Dropbox searches using recovered UI semantics returned no candidate:
- four-provider combinations (Met / AIC / Commons / Internet Archive);
- `silent film Exportliste`;
- `Namensnennung verworfen Exportliste`;
- `freie Treffer Namensnennung verworfen`;
- `silent film 84 6 40`;
- exact known ZIP/manifest name variants.

Dropbox-synced local KAYFABIZARRO workspace was searched outside `.git` for:
- public
- domain
- pool
- manifest
- selection

Result: **0 non-Git relevant files**.

Personal Library/prior-chat search also found no original attachment or filename.

## Current recovery assessment

**ORIGINAL MANIFEST / SELECTION UI NOT RECOVERED FROM CONNECTED GITHUB, DROPBOX, OR CHAT/LIBRARY SOURCES.**

What *is* recovered and durable:
- exact historical counts;
- exact four providers;
- query phrase `silent film`;
- existence of an interactive export-list UI;
- downloader hold state;
- precise first durable briefing commit and chronology.

What remains missing:
- original UI source/artifact;
- object-level search result rows/cards;
- export-list contents;
- 84 free identities;
- 6 attribution identities;
- 40 rejected identities.

Therefore no historical 130-row manifest can be reconstructed honestly from current evidence.

## Remaining recovery frontier

The remaining likely source is a **Claude Design session-only artifact/state that was never exported into Dropbox/GitHub**, or another local non-synced browser/download location unavailable through the connected sources.

Next chat should:
1. verify PR #251 branch head;
2. read `START_HERE.md`, this log and `NEXT_CHAT.md`;
3. do **not** repeat connected-source searches already listed here;
4. pursue only newly available Claude Design/session export/history evidence;
5. if no new source surface exists, close as `RECOVERY_NOT_FOUND` rather than manufacture the 130 rows.

No new curated discovery round is authorized by this recovery branch.

