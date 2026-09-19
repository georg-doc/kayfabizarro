# POSTMORTEM · Pilot 08 public Stage gate

## SOURCE

Source candidate:
- repo: `georg-doc/kayfabizarro`
- branch: `img2threejs/tinyskies-osm-integrated-proof-v1-2026-09-19`
- draft PR: #110
- exact tested runtime: `aa28a743628699271c94c1911af23d0564c6f3cc`

Public route:
- https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/

## TARGET

Make the already-tested integrated proof publicly reviewable on the required Cloudflare Stage surface, linked from KFB Hub, without changing the visual/runtime source.

## ATTEMPTS

| Attempt | Change | Expected | Actual | Evidence | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Stage package written to `main`; public proof run | public `SOURCE.json` returns expected revision | public URL returned KFB Hub fallback HTML | run `35471646709` attempt 1, `Unexpected token '<'` | FAIL · publication branch missing |
| 2 | exact Stage package + missing img2threejs dependencies + Hub/Stage links mirrored to `cloudflare-live` | same public marker parses and browser proof starts | public URL reached candidate marker file, but marker JSON was invalid after the closing brace | run `35471646709` attempt 2, `Unexpected non-whitespace character after JSON at position 2183` | FAIL · stop rule reached |

## WORKING PARTS

- source runtime and visual composition;
- modular 1,050-triangle Cologne Cathedral;
- real Hürth OSM source/massing;
- Grotesque presentation;
- TinySkies-derived world cohesion rules;
- source-reference isolation views;
- shared world rim/light;
- Day/Evening/Night switching;
- rain overlay baseline;
- source Playwright browser proof;
- Cloudflare publication branch path now exists.

## FAILURE EVIDENCE

Attempt 1:
- before publication, `cloudflare-live` did not contain the candidate path;
- public marker fetch returned Hub fallback HTML.

Attempt 2:
- `cloudflare-live` contained the candidate and required dependencies;
- public marker response reached the candidate file;
- current Git blob `08550009f6d32c3e33cfae6796a9f79ba095049f` ends with a literal backslash + `n`, not whitespace;
- verified GitHub tail character codes: `[125,10,125,92,110]`;
- therefore `JSON.parse()` fails after the otherwise complete JSON object.

## PROVEN CAUSES

1. **PROVEN:** Cloudflare publishes from the lean `cloudflare-live` branch, not merely from source/main packaging.
2. **PROVEN:** the marker file itself is malformed by exactly two trailing bytes: `\\n`.
3. **PROVEN:** this is a publication-marker problem. It does not invalidate the prior source runtime/browser PASS.

## HYPOTHESES

None are required to explain the current failure.

## SALVAGE

The source candidate should be retained unchanged. Rebuilding or visually retuning it would discard working evidence without addressing the failed public gate.

## LESSONS LEARNED

**Error:** Stage was first packaged on the source/main side without checking the actual publication branch.  
**Rule:** Every Cloudflare Stage slice identifies and verifies the publication branch before the first public poll.  
**Early test:** fetch the candidate marker path from the publication branch before launching the long public workflow.

**Error:** marker JSON was generated with a literal `"\\n"` suffix.  
**Rule:** publication markers must be parsed locally/repository-side before any 9-minute public poll.  
**Early test:** `JSON.parse(readFileSync('SOURCE.json','utf8'))`.

## NEXT GATE

See [NEXT_GATE.md](NEXT_GATE.md). Exactly one gate: marker-only repair + public proof. No scene changes.
