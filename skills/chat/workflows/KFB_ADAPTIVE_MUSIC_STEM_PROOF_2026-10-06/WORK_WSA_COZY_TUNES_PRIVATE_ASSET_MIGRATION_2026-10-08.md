# WORK/WSA BRIEF · COZY TUNES PRIVATE ASSET MIGRATION

Date: 2026-10-08
Execution mode: BOUNDED_SLICE
Executor: ChatGPT Work/WSA
Public metadata owner: georg-doc/kayfabizarro · Audio PR #365
Private binary owner: georg-doc/KFB-Travel-Globe
Outcome: move the 24 Pizza Doggy Cozy Tunes OGG source files to the private repo without asking Georg to upload them again, then leave only metadata/provenance in the public repo.

## Source

Public source repo:
`georg-doc/kayfabizarro`

Current source folder:
`media/3D_Assets/Sounds/Cozy Tunes - The Classics/Audio/ogg/Tracks/`

Observed:
- 24 non-empty OGG files
- current public source pin observed during intake: `main@f8f8f1fd72f76220688af78edbf9703086dac972`

Do not download these manually one-by-one.

## Target

Private repo:
`georg-doc/KFB-Travel-Globe`

Target path:
`assets/audio/third-party/pizzadoggy/cozy-tunes-classics/`

Recommended structure:
```
assets/audio/third-party/pizzadoggy/cozy-tunes-classics/
  README.md
  tracks/
    *.ogg
```

README must record:
- Creator: Pizza Doggy
- Pack: Cozy Tunes - The Classics
- Official source: https://pizzadoggy.itch.io/cozy-tunes
- Credits string: `Music: Pizza Doggy · Cozy Tunes`
- original pack README phrase if available: `Enjoy this stuff? Find more at https://pizzadoggy.itch.io/`
- KFB use: game/web soundtrack source
- no claim of CC0/public-domain status

## Transfer method

Use normal Git/filesystem transfer inside Work/WSA:

1. clone/fetch the exact current public source;
2. clone the private `KFB-Travel-Globe` repo with existing authenticated GitHub access;
3. copy the 24 OGG files locally between working trees;
4. do not transcode;
5. verify:
   - 24/24 filenames;
   - byte sizes;
   - SHA256 hashes source == private copy;
6. commit/push the private copy on one bounded branch/PR or directly according to that repo's current write rules;
7. refetch the exact private branch head + target files.

The GitHub chat connector is not the transport for the binaries: its text/blob read path cannot safely materialize these OGG bytes. Use normal git/file copy in Work/WSA.

## Public repo after private-copy verification

Only after the private copy is verified:

- remove the 24 OGG files from the CURRENT public tree;
- keep public metadata/catalog/provenance only;
- update the public Cozy Tunes pool manifest to reference logical `assetKey` identities, not public raw GitHub URLs.

Do not rewrite `kayfabizarro` history in this slice.

Important:
deleting from current main removes casual/current-tree exposure but old Git commits may still retain historical blobs. Full history purge would be a separate high-risk maintenance gate because it can invalidate active branch/PR SHAs.

## App / Site playback

Do NOT put GitHub private-repo tokens or private `raw.githubusercontent.com` URLs into browser JavaScript.

Private repo = source-of-truth, not browser CDN.

At build/deploy time:
1. Work/WSA or the authorized build process reads selected tracks from the private source using server-side credentials;
2. selected runtime tracks are copied into the actual Site/app bundle or approved media store;
3. browser receives ordinary app asset URLs only;
4. public metadata exposes title + artist + logical asset id, not source credentials.

Recommended public metadata:
```json
{
  "title": "Whispering Woods",
  "artist": "Pizza Doggy",
  "collection": "Cozy Tunes - The Classics",
  "creditUrl": "https://pizzadoggy.itch.io/cozy-tunes",
  "assetKey": "pizzadoggy.cozy-classics.whispering-woods"
}
```

Runtime/build resolves `assetKey` to the deployed asset location.

This supports:
- Jukebox/Radio playback;
- HUB ticker title + `Pizza Doggy`;
- Credits/Abspann;
- private source ownership;
- no browser GitHub credential leakage.

## Audio QA

Do not activate all 24 automatically merely because the private move succeeds.

After migration:
- OGG browser decode QA;
- duration/sample-rate/channel inventory;
- loudness/peak audit;
- listening tags;
- crossfade QA;
- mark approved tracks for rotation.

Use them as a MASTER_ROTATION_POOL around adaptive C/M/N/O; do not replace adaptive stems.

## No-touch

Do not:
- touch Open World PR #348;
- modify Coworker result;
- redesign KFB Audio Site;
- create second AudioContext/music runtime;
- expose private Git credentials;
- history-rewrite kayfabizarro in this slice;
- merge/promote Live automatically.

## Final Return

Report:
- exact public source pin;
- exact private repo/branch/head;
- 24/24 transfer verification;
- checksum result;
- target path;
- README/provenance file;
- public-tree cleanup status;
- public metadata/catalog changes;
- deployed playback test status, if actually performed;
- unresolved history-purge question;
- one next gate.
