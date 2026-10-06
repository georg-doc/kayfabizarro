# KFB Style Reference Library · Claude Design bridge

Status: **R2 BRIDGE PROPOSAL · READY FOR IMPLEMENTATION**
Date: 2026-10-06
Owner: **KFB Asset Registry / Asset Librarian**
Transport owner: **GitHub reference-pack export**
Receiving consumer: **Claude Design**

## Problem

The private Asset Librarian Site is the human authoring/curation surface, but Claude Design does not need or receive direct access to that private Site.

Do not solve this by making the Asset Librarian public.

Instead export the selected Reference Set as a small portable **Design Job Packet**.

## Binding transport model

`Private Asset Librarian → curated Reference Set → portable Design Job Packet → GitHub → Claude Design`

GitHub repository:
`georg-doc/kayfabizarro`

The repo is public, so a Claude Design session can receive a stable GitHub path without private Site access.

If a Claude Design session cannot read GitHub in that environment, the exact same packet can be uploaded manually as files. No data model changes are required.

## Packet pair

Every Claude Design job should have two synchronized files:

1. `<job-id>.json`
   - machine-readable source identities;
   - exact URLs/locators;
   - reference roles;
   - rights/visibility;
   - source-isolation requirements;
   - related assets;
   - target consumer/output.

2. `<job-id>.md`
   - short human-readable design brief;
   - what to inspect;
   - what to extract;
   - KFB target language;
   - forbidden assumptions;
   - output requirements.

Do not make Claude Design reconstruct intent from raw Librarian JSON.

## Public vs private references

### Portable public-source pack

Allowed in GitHub:
- reference IDs;
- creator/collection;
- canonical official page URLs;
- direct creator-hosted image URLs where appropriate;
- Georg notes;
- construction principles;
- relationship metadata;
- target KFB use;
- source-inspection status.

Do not copy the remote image binary into GitHub merely for convenience.

Claude Design must open the exact original source itself.

### Private-source pack

For purchased book pages/private PDFs/photos:
- GitHub packet contains metadata + opaque locator only;
- `requiresAttachment: true`;
- no private image/page binary in GitHub;
- Georg attaches the actual crop/page directly to the Claude Design job when needed.

This preserves one transport format without publishing private sources.

## Source-isolation contract

The packet starts each reference with:
`sourceInspectedInIsolation: false`

Claude Design must:

1. open the exact public source URL or attached private source;
2. inspect the actual reference in isolation;
3. state what is OBSERVED;
4. only then use it in composition/design;
5. return evidence that the source was inspected.

A source URL existing in the packet is not proof of use.

## Design-analysis rule

Reference packs are **construction/reference guidance**, not an instruction to imitate an artist's style.

Claude Design should extract:
- form construction;
- silhouette logic;
- overlap;
- visual rhythm;
- negative space;
- grouping;
- spatial relationships;
- material/presentation principles where relevant.

Then translate those into the receiving KFB visual language.

## Recommended Site extension

Add a single action to Reference Sets:

**Export for Claude Design**

It produces:
- `kfb.style-reference-pack/1` JSON;
- companion Markdown brief.

Optional later action:
**Prepare GitHub Design Job**

This should be performed by an authenticated KFB agent/Work/Web workflow, not by embedding GitHub credentials in the Site.

The Site itself should not own GitHub write credentials.

## Default GitHub location

Portable design jobs:

`tools/asset_registry/librarian/reference-packs/claude-design/<job-id>/`

Each folder contains:
- `PACK.json`
- `START_HERE.md`
- optional `RETURN.md` after Claude Design
- no copyrighted/private image binaries by default.

## Consumer start contract

Claude Design gets one exact GitHub folder and this instruction:

> Read START_HERE.md and PACK.json. Open every required source object in isolation before designing. Do not substitute search-engine images or infer unseen source content. Preserve the exact reference IDs in your Return. Reuse pinned KFB assets/donors before creating replacements.

## Future direct service access

A read-only Claude service principal may later resolve selected Asset Librarian/Production Control data directly, but this is optional.

Do not block the useful bridge on service-access engineering.

For now:

**GitHub Design Job Packet is the canonical Claude Design bridge.**

## Exactly one next implementation gate

Add **Export for Claude Design** to Reference Sets and prove one real Clouds packet roundtrip:
Asset Librarian → exported JSON/Markdown → GitHub job folder → Claude Design opens exact Etherington source → returns KFB design output with retained reference IDs.
