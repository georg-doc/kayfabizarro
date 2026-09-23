# TEST REPORT · KFB Elastic Grotesque Clay v1 · Hürth 01

Date: 2026-09-23
Status: **BROWSER PASS · HUMAN VISUAL REVIEW PENDING**
Implementation tested head: `1db61b9c882e178000cf700a7d5f4d18ec03eba0`

## Browser / WebGL evidence

Workflow:
`OSM Elastic Grotesque Clay · Hürth 01`

Successful run:
- run: `35904415847`
- head: `1db61b9c882e178000cf700a7d5f4d18ec03eba0`
- result: **SUCCESS**
- browser assertions: **16/16 PASS**
- artifact: `10769948842`
- artifact digest: `sha256:fa8823edeeec10c6e25cb11b08c15d85a205e6ecb17c6c66c9c8f1236e71c9a9`

Proven in Chromium/Playwright with SwiftShader:
- source city = `huerth-v0`;
- 22/22 pinned real OSM building IDs loaded;
- 49 nearby real road parts used as context;
- modes = `clean / grotesque / elastic`;
- all three canvases booted WebGL2;
- current Grotesque path reports donor `src/style/cartoon-city.js`;
- elastic path reports no collision mutation;
- full block = 22 visible buildings in every panel;
- isolated source `way/371401492` = exactly 1 visible building in every panel;
- returning from isolation restores 22 in every panel;
- page/console errors = 0.

Screenshots in the evidence artifact:
- `01-block-comparison.png`
- `02-isolated-source-comparison.png`
- `report.json`

## Recovery history

Run `35903709243` failed by timeout before useful failure diagnostics.
Run `35904140456` added diagnostics and proved the actual cause:

`pageerror: SyntaxError: Invalid or unexpected token`

Root cause:
a literal `\\n` was accidentally written between `isolate()` and `visibleCount()` while adding evidence observability.

Repair:
commit `1db61b9c882e178000cf700a7d5f4d18ec03eba0` replaced that one invalid token seam with an actual newline. No form/deformer parameters changed in the repair.

The next run passed. This is one runtime repair pass, not a visual retune.

## Chat artifact static checks

The companion standalone chat HTML was checked separately:
- title present;
- 3 comparison canvases;
- exact-current-Grotesque donor marker present;
- current Grotesque preset values present;
- 22 building records;
- 22 unique OSM building IDs;
- 22/22 closed footprints;
- finite positive heights;
- 13 embedded nearby road slices for the zero-install chat artifact;
- five named road families present;
- extracted inline JavaScript: `node --check` PASS.

Result: **11/11 bounded static checks PASS**.

## Evidence boundary

Automated PASS proves boot, source fixture, WebGL contexts, comparison modes, source isolation and absence of browser errors.

It does **not** prove that the Elastic Grotesque Clay look is aesthetically accepted. That remains Georg's visual gate.

No Cloudflare/public Stage proof is claimed in this slice.
