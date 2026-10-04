# SC02 · Decision: default support = classic cylinder · 2026-09-26

**Georg:** "default sind aber die zylinder von anfang". Trunk is "not optimal yet, but usable as a style".

- **Default:** `classic`, the cylindrical SC02b family profile with a round footing and the soffit capital band.
- **Optional look styles:** `trunk`, `vine`, `rope`. They are built only when they are requested explicitly with `SC_STYLES`.
- **Builder:** `build_sc02_supports.py` now defaults to `[DEFAULT_STYLE]` (md5 `81a20e08…`). `sc02_supports.placement.json` carries `default_style` and `optional_styles`.
- **Classic re-exported on the fixture:** 22 supports, PASS.
- **Known limit of trunk:** it looks "melted" below ~4 m clear height (see `prev/sc02_v5_trunk_stations00-03.png`). It stays a style, not a default. Any improvement follows the no-tinkering rule: a new short-form concept, not patches.
