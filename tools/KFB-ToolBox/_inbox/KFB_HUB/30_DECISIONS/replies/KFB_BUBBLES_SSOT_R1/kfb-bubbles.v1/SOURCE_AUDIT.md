# kfb-bubbles.v1 · source audit & QA evidence · 2026-10-18

- Core GitHub blob: f59a8a1affb3038bba903d26182c2e007cda1d07, 26722 JS characters; Dropbox Wireface: 26723. Comparison: first 26722 code units identical; Dropbox adds exactly one LF; chosen **Dropbox newer copy**, all preceding bytes untouched (ASCII/Unicode source text preserved).
- Adapter GitHub blob: 19e67ae9a5b21b37e8c368f3fde598f495bac1ff, 6305 JS characters; Dropbox Wireface: 6306. Comparison: first 6305 code units identical, one terminal LF added; chosen **Dropbox newer copy**.
- SVG-defs extract from GitHub ChatterBox Studio v2: 2905 characters, seven named ids verified; rendered sample references these actual ids (not a replacement palette).
- Binders: ES module original core side-effect plus unchanged `bubbles.module.js`; classic script contains the original adapter code except import/export shim and wraps new helpers. No state owner duplicated.
- Static source checks (in connected JavaScript run): 2 source-copy comparisons PASS; 7 defs present; all eight `KINDS` and four `WORD` classes preserved inside unmodified core by reference.
- Runtime Node syntax / browser rendering / source-isolated screenshots / Cloudflare or Site acceptance: **NOT RUN / UNVERIFIED**. Do not claim LIVE.
- Exact semantics gap: R9.1 HTML source script inaccessible through Dropbox extracted text; its *visible description* and updated WS0 briefing used, no claim of byte-port.
