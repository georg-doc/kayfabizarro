# ATTEMPT LOG · WORLD-INTEGRATION-r2

| Attempt | Head | Run | Change | Result | Decision |
|---|---|---:|---|---|---|
| Initial | `590bd54b8a1bb82e7c8af8d9de36ebb5a0f1215b` | 36198357755 | Add World r2 owner/closure + browser CI | FAIL | retain candidate; test harness needed correction |
| Repair 1 | `aee760986e6817240a283db796f30da607c0108b` | 36198517698 | Apply Playwright wait timeout correctly | FAIL · Hürth never reached 55 PASS lines | one final targeted repair allowed |
| Repair 2 / final | `204afd6dbb1285f8cd77807af0db5fdd6e75308d` | 36198999279 | Immutable GitHub Raw ToolBox profile + boot diagnostics | FAIL · stale variant-label selftest contract exposed | **STOP · ARCHIVE CURRENT GATE** |

## Final run facts

Static:
**20/20 PASS**

Browser diagnostic before abort:
- zone through wd1-seam: PASS · Hürth 700 buildings;
- city layer count: PASS;
- WB2 terrain tile: PASS;
- WB2 scene document: PASS;
- KayKit semantic states bound: PASS · 13 states;
- pageErrors: 0;
- failed source requests: 0.

Failing assertion:
`source-backed clips only (variants labelled)`.
