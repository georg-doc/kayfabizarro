# INTAKE · Pizza Doggy · Cozy Tunes - The Classics · OGG pool

Date: 2026-10-08
Status: **CONTENT_POOL_REGISTERED · GAME_USE_ALLOWED · PUBLIC_RAW_REDISTRIBUTION_BLOCKER**
Owner: KFB Audio / Jukebox / Mixer
Canonical KFB source observed: `main@f8f8f1fd72f76220688af78edbf9703086dac972`

## Source

Creator:
🍕 Pizza Doggy

Official pack:
https://pizzadoggy.itch.io/cozy-tunes

KFB current folder:
`media/3D_Assets/Sounds/Cozy Tunes - The Classics/Audio/ogg/Tracks/`

Observed files:
**24 OGG tracks**, all non-empty.

## License / rights reading

Current official itch page says:
- the music pack is free;
- the creator invites payment if used commercially;
- pack is tagged Royalty Free;
- downloadable `License Agreement.pdf` is provided.

Creator comments also explicitly permit commercial game/media use and say payment/donation is optional/appreciated.

The creator's Game Asset License Agreement is described as allowing use and modification in games, including commercial games, while prohibiting resale/redistribution/sharing of the assets on their own or inside asset packs/templates/bundles.

### KFB consequence

**USE IN KFB GAME/PRODUCT: YES.**

**PUBLIC RAW-ASSET HOSTING: DO NOT TREAT AS ALLOWED.**

The KFB repository is currently public and contains the raw OGG tracks as standalone downloadable files. This is inconsistent with the no-redistribution intent of the license and must be corrected before these files become a production runtime source.

Do not infer CC0/public-domain status.
Even classical compositions such as Gymnopédie / Minuet / Tales from the Vienna Woods do not make Pizza Doggy's particular recordings/arrangements public domain.

Attribution is appreciated but not required by the general Pizza Doggy Game Asset License description. KFB should nevertheless credit:
`Music: Pizza Doggy · Cozy Tunes`
with the official itch source in Credits/Third-Party Assets.

## Proposed KFB use

This pack is valuable as a **master-only rotation pool**, not an adaptive stem family.

Best role:
- long-duration island/exploration variation;
- cozy/staying fallback;
- low-intensity roaming;
- dusk/night alternates;
- POI/landmark color;
- anti-repetition rotation around C/M/N/O.

Do not replace the adaptive C/M/N/O stem architecture.
Use as optional master cues selected by Audio profiles.

## Technical gate before runtime activation

1. Fix raw-public-hosting/license seam.
2. Decode all OGG files in target runtime.
3. Capture duration / sample rate / channels.
4. Identify loop-friendly versus one-shot/finite cues.
5. Loudness/peak normalization audit.
6. Listen/classify musical role and repetition risk.
7. Test crossfade into/out of C/M/N/O/G/D.
8. Register only approved tracks in data-driven Audio profile pools.

OGG source may remain OGG if target browser/runtime QA is green. Do not convert merely to change extension; conversion does not change redistribution rights.

## Current classification

`LICENSED_GAME_USE_SOURCE_PRESENT_RUNTIME_UNVERIFIED`

Runtime activation: **BLOCKED only by hosting/license hygiene + technical/listening QA.**
