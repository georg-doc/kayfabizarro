# GIF Loop Pilot R0 · 2026-11-07

Status: **TECHNICAL FAIL · STOPPED AFTER ONE AUTHORIZED PILOT**  
Owner: WS0 / existing Asset Registry and KFB Asset Librarian. WS1 remains game runtime owner.  
Scope: one reference-conditioned native Work pilot for `SL_MAGIE_BLITZMAGIER`; no series expansion, no Librarian admission, no game/runtime change.

## Product question

Can the current built-in Work image path preserve the exact canonical Slop PNG and return a genuine transparent animated GIF loop suitable for the existing KFB Asset Librarian and later WS1 receiving path?

## Exact source object

- Repository: `georg-doc/KFB-Stunt-Car-Race`
- Commit: `58ca51561a70957aa77013d4e75e8a5727886c52`
- Path: `slop_r1/SL_MAGIE_BLITZMAGIER.png`
- Git blob SHA: `9a74f93075512efb8ddfbbd55bf87e199e97f8b4`
- Existing Librarian identity: `popup:SL_MAGIE_BLITZMAGIER`
- Source was opened and shown alone before the pilot. It is the edit target / identity authority, not a prose-only reference.

## Golden-loop evidence supplied by Georg

Six local GIF files were inspected; two pirate filenames are byte-identical, so there are five unique GIF payloads.

| Golden sample | SHA-256 | Canvas | Frames | Timing | Loop | Alpha |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Animierter Tintenblob mit Steampunk-Goggles.gif | `61754d01a4ef4aa6ae05c3cb21e8564298ff8acd1824a33a5c175d6861837686` | 512×512 | 6 | 6×220 ms = 1.32 s | infinite | binary transparency |
| Animierter Tintenblob-König geschniegelt.gif | `29771b8bc3fd97d511e794979d99faa96909a02bb8cc2b91d915ad6bfbb9b523` | 627×418 | 6 | 6×220 ms = 1.32 s | infinite | binary transparency |
| Animierter lila Blob-Pirat / KFB_Ink_Blob_Pirat_Claymation_Loop.gif | `acbaa492cc350ec893f133949cce22c45959a38590d2f96d0f02940324ef687a` | 512×512 | 6 | 6×240 ms = 1.44 s | infinite | binary transparency |
| Gif des ruhelosen Schleimzauberers.gif | `3b33b0f6b8bcdc267773cccf5668b6c8a3c4195ab027e597a4d5bde4ae90d6f5` | 768×340 | 6 | 6×220 ms = 1.32 s | infinite | binary transparency |
| Sechsfaches Tintenmonster im Schlummerloop.gif | `1b56c79d1256ad7e37ccd384c4007f765f5f313a6ecbe35214a4e8830c027dcb` | 627×418 | 6 | 6×220 ms = 1.32 s | infinite | binary transparency |

These are motion/format benchmarks only. No costume, face, silhouette or prop from them was authorized as a style parent for Blitzmagier.

## Actual pilot invocation

Built-in image generation/edit path. Exposed arguments:

- `num_last_images_to_include: 5`
- `transparent_background: true`
- reference roles stated explicitly in the prompt
- no model ID, seed, generation ID or animation-specific API parameters were exposed

Exact prompt:

```text
Use case: identity-preserve
Asset type: KFB game sprite animation pilot and Asset Librarian preview
Primary request: Create one genuine animated GIF idle loop from the exact KFB character in the most recent input image: SL_MAGIE_BLITZMAGIER. This is an animation edit, not a redesign and not a new character.
Input images: the most recent image is the authoritative edit target and identity reference. The preceding GIF images are motion/format benchmarks only; do not copy their costumes, faces, silhouettes, props, or backgrounds.
Subject: preserve the Blitzmagier exactly—same rounded dark-purple clay ink-blob body, red irises and black pupils, mouth, teeth, tongue, yellow lightning bolts, droplets, proportions, framing, and handmade clay material.
Animation: exactly 6 frames, seamless infinite loop, about 220 ms per frame (about 1.32 seconds total). Very restrained idle motion: one soft clay squash-and-breathe cycle, tiny eye/gaze settle, and controlled electrical flicker/pulse in the existing yellow lightning bolts. The first and last loop states must join without a visible jump. Keep every existing lightning bolt and body feature attached to the same locations; no new effects or floating symbols.
Composition: 512×512 square; entire silhouette and all droplets/lightning remain inside a generous transparent margin; stable center and scale with no camera movement.
Constraints: preserve character identity aggressively; change only motion across frames. True transparent background in every frame. No floor, no shadow disc, no matte, no text, no extra character, no new costume, no new prop, no scene, no palette change, no anatomy change, no redesign, no cropped lightning.
Output: one actual animated GIF file, looping forever. Do not return a static PNG, contact sheet, sprite sheet, or simulated animation.
```

## Actual result

The built-in path returned:

- format: **PNG**, not GIF;
- dimensions: **1254×1254**, not the requested 512×512;
- frames: **1**, not 6;
- SHA-256: `1826c228f4753b27fa5acdd3aaf34b519d9a22247f8f273ca5f54a4c724f95bc`;
- bytes: 1,376,924;
- RGBA alpha present, but the actor was visibly re-rendered rather than preserved as the exact source pixels;
- local-only file: `exec-3f5f47ab-281a-4fc0-a08c-1504aabf9274.png`;
- status: **TECHNICAL FAIL / DESIGN NOT EVALUATED / QUARANTINED / NOT A STYLE PARENT**.

The output is not admitted to GitHub assets, the Asset Librarian, the game, a registry, or a public Site version.

## Acceptance matrix

| Gate | Result |
| --- | --- |
| Exact source actually supplied | PASS |
| Genuine animated GIF returned | FAIL |
| Six frames / 1.32 s / infinite loop | FAIL |
| Requested 512×512 canvas | FAIL |
| Exact identity/pixel preservation | FAIL |
| Transparent output | PARTIAL: static RGBA only |
| Librarian registration | NOT RUN |
| WS1 runtime/game proof | NOT RUN |
| Site publication | NOT RUN |

## Owner and publication state

The existing KFB Asset Librarian remains the only Site owner:

- Site project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- public URL: `https://kfb-asset-librarian.frizzlebob.chatgpt.site`
- inspected Site source head: `7b3e16cbc36f7d386069f3d7648981f0a1dbeff8`
- live version at inspection: 56
- source was read-only inspected; zero Site files changed; zero publication/deployment.

## Exactly one next gate

**Georg explicitly decides whether to authorize one CLI/API fallback pilot for the same Blitzmagier source in a locally configured OpenAI API project.** Until that explicit authorization exists, do not run an API/CLI job, do not build a deformer or synthetic wobble replacement, do not register the failed PNG, and do not expand to more Slops.
