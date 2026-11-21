# CONTRACT · Cozy Tunes credits, metadata and private delivery

Date: 2026-10-08
Status: PREPARED · NO WORK/WSA REQUIRED TO DESIGN THIS

## Human-visible credits

Every surfaced track uses:
- title: exact pack track title;
- artist: **Pizza Doggy**;
- collection: **Cozy Tunes - The Classics**;
- source/credit URL: https://pizzadoggy.itch.io/cozy-tunes

Required presentations:
- End credits / Abspann: `Music: Pizza Doggy · Cozy Tunes`
- Jukebox / Radio: `<Track Title> — Pizza Doggy`
- HUB ticker: artist field = `Pizza Doggy`
- Credits/Third-Party Assets: official pack URL.

## Logical asset identity

Public/product code talks only in `assetKey`, for example:
`pizzadoggy.cozy-classics.whispering-woods`.

It does not know:
- private GitHub credentials;
- private raw GitHub URL;
- private clone URL.

## Private source

Owner:
`georg-doc/KFB-Travel-Globe`

Root:
`assets/audio/third-party/pizzadoggy/cozy-tunes-classics/`

## Delivery

Private repo is source-of-truth, not browser CDN.

Allowed production patterns:
1. authorized build/publish process copies selected private tracks into the app/Site artifact;
2. authorized server/media layer materializes a deployed asset URL from assetKey.

Browser receives only deployed app/media URLs.

Never:
- embed a GitHub PAT/token;
- fetch private `raw.githubusercontent.com` from client JS;
- expose a browsable private-source directory endpoint.

## Rotation architecture

The 24 tracks are **master-only rotation cues**.

They supplement, not replace:
- C Cozy adaptive stems;
- M Island Life adaptive stems;
- N Dusk/Night adaptive stems;
- O Discovery/POI adaptive stems.

Audio owns whether a master cue is appropriate for a world/profile/state.

No World consumer sends track filenames.

## Runtime promotion

Per-track promotion requires:
- OGG decode PASS;
- duration/sample-rate/channel capture;
- peak/loudness sanity;
- listening classification;
- crossfade in/out;
- no console/network errors.

Tracks may be promoted independently.

## Public cleanup

Only after 24/24 private verification:
- delete the 24 OGGs from the current public tree;
- retain catalog/provenance/credit metadata;
- do not history-rewrite in this bounded task.
