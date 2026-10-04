# MANUAL REVIEW · PD-POOL-R1 · Internet Archive object

Status: **PASS · SOURCE/OBJECT CORRESPONDENCE**

Date: 2026-09-27  
Owner: **Asset Librarian / Billboard Media**  
Persisted asset: `media/public_domain/ia/the-general-1926-item-tile.jpg`  
Persistence commit: `f3acaaeb98530dd9ffb7d200d61956891e738336`  
Asset SHA-256: `bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19`

## Visual observation

The persisted Internet Archive Item Tile is a dark/sepia silent-film title card reading:

> Copyright by  
> Joseph M. Schenck

It is a real image payload, not an HTML/error body.

## Correspondence check

The stored sidecar identifies:
- Archive identifier: `TheGeneral1926`;
- title: `The General 1926`;
- selected format: `Item Tile`;
- source file: `https://archive.org/download/TheGeneral1926/__ia_thumb.jpg`;
- recorded rights marker: `http://creativecommons.org/publicdomain/mark/1.0/`.

Independent identity cross-check:
- AFI Catalog, *The General* (1926), identifies Joseph M. Schenck as producer and copyright claimant (22 Dec 1926, LP23453): `https://catalog.afi.com/Film/9303-THE-GENERAL`.
- Wikisource's film transcription includes the exact card text “Copyright by Joseph M. Schenck” in *The General*: `https://en.wikisource.org/wiki/The_General_(film)`.

## Result

**PASS.** The downloaded Archive Item Tile corresponds to the intended *The General* (1926) object rather than an unrelated thumbnail.

This manual identity check does not replace the persisted Archive metadata rights gate. The downloader independently required an acceptable `licenseurl`, which resolved to Public Domain Mark 1.0 during R1.
