# KFB Asset Librarian · KayKit Reference Atlas · Checkpoint 3

**Date:** 2026-09-15  
**Recovery branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Status:** TOOL-BOUNDARY + PLATFORMER PREFLIGHT NOTE

## 1 · ZIP inspection boundary · TESTED RESULT

Attempted read-only inspection of GitHub ZIP-only KayKit packs.

### GitHub blob path

`GitHub.fetch_blob` on `KayKit_City_Builder_Bits_1.0_FREE.zip` failed with a UTF-8 `UnicodeDecodeError`, confirming the connector is text-oriented for this path and does not expose ZIP binary contents for extraction.

### Sandbox direct network path

The local container has no general GitHub network/DNS access. Direct `git ls-remote` failed because `github.com` could not be resolved.

### Conclusion

Archive contents for City Builder / Space Base / Resource Bits / Medieval Hexagon remain **NOT INSPECTED**, but the reason is now a tested tool boundary rather than an omitted step.

Do not retry the same GitHub text/blob/container paths in a fresh chat unless tool capabilities change.

## 2 · Dropbox visual-reference boundary · TESTED RESULT

Dropbox `download_link` successfully returned a temporary single-use URL for the annotated Block Bits sample image.

However:

- the local container rejected the private Dropbox URL because it had not been whitelisted through the web safety layer;
- the web tool would not open the private connector URL because it was not a web-search/user URL;
- Dropbox documents the URL as single-use, so consuming it in a preflight request would invalidate it anyway.

### Conclusion

The current connector/tool combination can inventory, preview in the Dropbox widget and extract supported text, but cannot hand the private reference-image bytes to the analysis runtime for forensic pixel/frame inspection.

Therefore `OBSERVED DEMO` remains intentionally empty for pixel-level findings in Atlas v1. Filename/source-page facts remain valid.

## 3 · Platformer identity preflight

### Current official KayKit Platformer Pack · SOURCE FACT

Current official product description states:

- 120+ unique FREE models / 370 including recolours;
- level blocks including floors, walls, ramps, barriers, platforms and pipes;
- powerups/pickups including stars, diamonds, hearts and bombs;
- decorative railings, barriers, signage, supports and flags;
- gameplay assets including hoops, goals, ball, finish line, buttons and switches;
- EXTRA adds traps, conveyors, bumpers, chests, chains, cannon and more;
- single gradient atlas;
- FBX / GLTF / OBJ;
- CC0.

### KFB legacy/current source candidate · SOURCE FACT

`media/3D_Assets/Platformer Game Kit - Dec 2021/` currently has top-level groups:

- Character
- Cubes
- Enemies
- Level and Mechanics
- Modular Platforms
- Nature
- Powerups and Pickups
- glTF
- Preview images

Its Character glTF identifies only the Blender glTF exporter as generator and contains no creator/provenance metadata in the inspected header.

### Assessment · INFERENCE

There is thematic overlap with the current KayKit Platformer Pack, but the KFB 2021 source also has prominent Character / Enemies / Nature / Cubes groupings not described as the current product's core structure.

This strengthens the existing classification:

`UNRESOLVED IDENTITY / PROBABLY OLDER OR DIFFERENT SOURCE`.

It is still not enough evidence to call them definitely unrelated. Do not reacquire until provenance or asset-level overlap is checked through a source that exposes the actual current download/file list.

## 4 · Web-current source check

Official Kay Lousberg itch profile and Platformer product page were checked on 2026-09-15. Current official catalog confirms the modern Platformer Pack and the broader KayKit pack set used in the coverage matrix.

The Complete KayKit public product page is updated 2026-08-14 and exposes `The Complete KayKit Collection v6.1`; saved newer Sep-2026 KayKit source material refers to later additions such as Mixed Bag 1 / Complete Collection v7 context. Treat the saved newer source snapshot as later evidence for those additions rather than assuming the public bundle page list is fully current.

## 5 · Restart advice

A future continuation should **not** spend time retrying:

- GitHub text/blob decoding of ZIPs;
- direct sandbox GitHub network fetch;
- private Dropbox single-use image URL handoff to the container.

Better next options are:

1. user/local extraction or a connector that exposes ZIP entries;
2. user-upload of selected reference images/GIFs into chat when visual annotation becomes priority;
3. account/download-history evidence for paid-tier entitlement;
4. continue source-text/Registry mapping where connector evidence is sufficient.
