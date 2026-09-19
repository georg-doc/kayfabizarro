# Pilot 08 · TinySkies × OSM Integrated Stage · FAILURE RECOVERY

**Status:** ARCHIVED_FAILED_PUBLICATION_GATE · source candidate retained  
**Date:** 2026-09-20  
**Owner:** `tools/img2threejs/`  
**Source PR:** [#110](https://github.com/georg-doc/kayfabizarro/pull/110) · DRAFT / OPEN  
**Source tested runtime:** `aa28a743628699271c94c1911af23d0564c6f3cc`  
**Public Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/  
**Public status:** **NOT PUBLIC_VERIFIED · HUMAN REVIEW BLOCKED**

## Why this recovery exists

The source candidate itself is healthy:

- **27/27** static/source checks PASS;
- **19/19** real Chromium/WebGL checks PASS;
- **0** page/console/HTTP errors in the source browser proof;
- visual evidence covers isolated TinySkies-derived lighthouse/observatory references plus integrated OSM / Evening / Rain views.

The same public Stage gate then failed twice for **publication/marker reasons**, not because the source scene failed.

Per KFB stop rule, no third repair pass is attempted in this slice.

## Read order

1. [POSTMORTEM.md](POSTMORTEM.md)
2. [ATTEMPT_LOG.md](ATTEMPT_LOG.md)
3. [TEST_REPORT.md](TEST_REPORT.md)
4. [SALVAGE_MAP.md](SALVAGE_MAP.md)
5. [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
6. [NEXT_GATE.md](NEXT_GATE.md)
7. [EXPORT_MANIFEST.json](EXPORT_MANIFEST.json)
8. [RECOVERY.md](RECOVERY.md)

## Bottom line

**Do not rebuild the scene.**  
The smallest next gate is only:

> repair the trailing literal `\\n` in Stage `SOURCE.json`, publish that exact marker, prove the exact public JSON revision, then rerun the existing public Playwright proof unchanged.

No palette, camera, terrain, OSM, landmark, weather or physics changes belong in that gate.
