# PD-POOL-01 · source-page review

Date: 2026-09-27
Status: PRE-DOWNLOAD CANDIDATE REVIEW · API RECHECK STILL REQUIRED

## The Met · object 86434

Source: https://www.metmuseum.org/art/collection/search/86434

Observed before implementation: the collection page labels the 1890–95 American bathing suit “Public Domain” and exposes Download Image. The downloader must still require isPublicDomain=true and primaryImage from the Met Open Access API.

## Art Institute of Chicago · artwork 24645

Source: https://www.artic.edu/artworks/24645/

The AIC API documentation explicitly recommends using only artworks tagged is_public_domain=true for reusable image workflows and uses artwork 24645 as a IIIF example. The downloader must still require both is_public_domain=true and image_id.

## Wikimedia Commons · File:Silent film.svg

Source: https://commons.wikimedia.org/wiki/File:Silent_film.svg

The file page identifies it as Pbroks13’s own work (14 July 2008) and states that the copyright holder released it into the public domain worldwide. The downloader still reads the file’s current extmetadata license before retrieval.

## Internet Archive · TheGeneral1926

Source: https://archive.org/details/TheGeneral1926

Manual cross-check before implementation: current Commons metadata identifies The General (1926) copy as sourced from this Archive item and marks the work with Public Domain Mark 1.0; a current external benchmark likewise records the Archive identifier as Public Domain Mark 1.0. Neither statement overrides Archive metadata. The downloader must see an acceptable licenseurl on the Archive item itself.

For GitHub suitability PD01 requests only the Archive Item Tile (max 2 MB), not the 1.6 GB film.
