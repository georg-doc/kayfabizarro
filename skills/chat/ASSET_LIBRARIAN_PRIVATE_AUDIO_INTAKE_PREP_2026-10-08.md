# ASSET LIBRARIAN · PRIVATE AUDIO INTAKE PREP · 2026-10-08

Status: PLANNING_ONLY · NO RUNTIME/SITE WRITE
Owner: KFB Asset Registry / Asset Librarian
Receiving product: existing KFB Asset Librarian
Canonical Site: https://kfb-asset-librarian.frizzlebob.chatgpt.site/
Source: tools/asset_registry/librarian/

## Current truth

The existing Asset Librarian is already suitable as the common browser for audio:

- Registry builder classifies `.wav`, `.ogg`, `.mp3` as `kind: "audio"`;
- Librarian exposes an `Audio` asset type/filter;
- audio detail uses a real HTML audio preview;
- Live mode reads `bot/asset-registry-update`;
- new generated Registry content becomes searchable without Librarian redeploy.

The missing seam is not audio browsing. It is **private intake + private-source metadata projection**.

The current Librarian source is intentionally read-only. Do not turn it into a second asset owner.

## Existing private upload infrastructure

KFB Production Control already exposes an authenticated private Production Inbox:

- direct text/base64 save: up to 4 MB decoded;
- public HTTPS import: up to 32 MB;
- private chunked upload: up to 32 MB per artifact;
- deterministic readback/chunk read + SHA-256 verification.

This already supports:
- individual songs;
- textures;
- animation files;
- manifests;
- ZIPs up to 32 MB.

Do not provision another upload backend merely to support audio.

## Product goal

Give Georg one Asset Librarian-facing intake workflow for new assets while preserving ownership:

```
Asset Librarian UI
   ├─ Browse/Search → existing Live Registry
   └─ Intake
        ↓
KFB Production Inbox (private)
        ↓
Intake classifier / metadata record
        ↓
Registry private/external metadata feed
        ↓
bot/asset-registry-update
        ↓
Asset Librarian Live
```

No site redeploy for each uploaded song.

## Audio is one dimension, not a new subsystem

Use the same intake model for:
- 3D assets;
- textures/images;
- animation/motion sources;
- UI/SFX audio;
- music/songs;
- ZIP/package drops.

Audio-specific metadata is additive.

Suggested audio fields:

```
assetKey
title
artist
collection
audioClass = MUSIC | SFX | UI | VOICE | AMBIENCE
format
sourceVisibility = PRIVATE | PUBLIC
sourceOwner
durationSec?
sampleRate?
channels?
loopClass?
bpm?
roleTags[]
license / rightsEvidence
creditText
creditUrl
runtimeStatus
previewStatus
```

Never infer BPM, rights, loop suitability or semantic role from filename alone.

## Private binary rule

Private source binaries must NOT be converted into public raw GitHub URLs merely so the current Librarian preview code can play them.

For a private asset Registry record:

- `source.private = true`;
- source repo/path may be recorded only where appropriate for authenticated tooling;
- public Registry/browser metadata uses logical `assetKey`;
- preview uses a deployed/authorized preview URL if one exists;
- otherwise UI shows `Private source · preview pending`.

The current audio preview should be extended from:

`source.rawPinned || source.rawLatest`

to a resolver order like:

`delivery.previewUrl || delivery.runtimeUrl || source.rawPinned || source.rawLatest`

without exposing credentials.

## Music display contract

For songs, Librarian cards/detail should support:
- Title
- Artist
- Collection/Pack
- duration when measured
- format / size
- role tags
- source/rights
- preview
- runtime status.

Example:

```
Whispering Woods
Pizza Doggy
Cozy Tunes - The Classics
MUSIC · OGG · forest / cozy
```

This metadata should be reusable by:
- Jukebox / Radio;
- KFB Audio;
- HUB ticker;
- Credits / Abspann.

Do not duplicate song metadata separately in each consumer.

## Automatic update contract

Existing public flow already works:

`main media change → asset-registry workflow → bot/asset-registry-update → Librarian Live`

Extend it with one **metadata projection input** for private/intake assets.

Recommended generated public-safe overlay:
`registry/assets/private-projection/v1/catalog.jsonl`

or equivalent current-owner path.

The overlay contains metadata only, never private binary bytes or browser credentials.

Librarian Live combines:
1. current generated public Asset Registry;
2. validated private-source projection.

A new private upload should therefore need:
1. upload once;
2. classify/verify once;
3. registry refresh;
4. automatically appear in Live Librarian.

No Site rebuild/redeploy per asset.

## Intake UI recommendation

Add one compact `Intake` action/tab to the existing canonical Librarian Site.

It is a frontend for the existing Production Inbox, not a second storage system.

Minimum UI:
- drag/drop or file picker;
- multiple files where supported;
- optional ZIP;
- Asset Class;
- Title/Artist/Collection for music;
- Source/license/credit;
- Private/Public source toggle;
- tags/notes;
- upload progress;
- persisted Intake ID/status.

After upload:
`UPLOADED → CLASSIFIED → VERIFIED → REGISTRY_READY → LIVE`

Do not make Georg wait for a Work run for ordinary future song uploads.

## Size policy

Production Inbox per-artifact maximum is currently 32 MB.

Therefore:
- ordinary songs <32 MB: direct upload;
- ZIP/package <=32 MB: direct ZIP upload;
- larger collections: upload constituent files individually if each fits;
- exceptionally large packs: private Git/media-owner migration remains fallback.

Do not introduce Git LFS merely for ordinary <32 MB songs.

## Existing Cozy Tunes use case

The current 24-track Pizza Doggy pack is a migration case because it was already uploaded publicly.

Future packs should use this Intake flow directly so the public-repo detour disappears.

## Work/WSA implementation target later

One bounded Asset Librarian/Registry slice should:
1. preserve canonical Librarian Site/project;
2. add Intake UI backed by existing private Production Inbox;
3. implement `kfb.asset-intake.v1`;
4. implement private-source metadata projection;
5. combine projection in Live Registry;
6. extend audio preview resolver for authorized deployed preview URLs;
7. prove a song upload appears in Live Librarian without Site redeploy;
8. prove an image/texture or ZIP intake still works through the same contract;
9. return exact Site/project/version/evidence.

No new Asset Librarian Site.
No second Registry.
No second Inbox backend.

## Acceptance

PASS requires one end-to-end future-style test:

`upload song → private Inbox → classify → Registry refresh → Live Librarian search → detail → artist/credits visible → playable preview if authorized`

and no Librarian redeploy after upload.

## One next gate

Implement this only when Georg chooses to spend one Work/WSA run on the Asset Librarian intake bridge.
