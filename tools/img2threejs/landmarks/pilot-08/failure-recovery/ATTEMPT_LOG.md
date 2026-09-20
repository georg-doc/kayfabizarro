# ATTEMPT LOG

## Source candidate proof · PASS

- Tested runtime: `aa28a743628699271c94c1911af23d0564c6f3cc`
- Workflow: `35471351012`
- Artifact: `10591829944`
- Static/source: **27/27 PASS**
- Chromium/WebGL: **19/19 PASS**
- Browser errors: **0**

This is retained evidence, not the failed public gate.

## Public attempt 1 · FAIL

- Workflow run: `35471646709`
- Run attempt: 1
- Source/main Stage package commit: `35e17833bd7e65709542c2b22583ae38a812c6b5`
- Public marker result: KFB Hub fallback HTML
- Error: `Unexpected token '<'`
- Proven cause: candidate had not been mirrored to `cloudflare-live`.

## Publication repair 1

- Candidate + required canonical dependencies mirrored to `cloudflare-live`.
- First mirror commit in this slice: `b95d0d3501cbf30489582f4e6be5e3d130a86017`.
- Candidate path verified in GitHub on the publication branch.

## Public attempt 2 · FAIL

- Workflow run: `35471646709`
- Run attempt: 2
- Public marker now reached candidate content.
- Error: `Unexpected non-whitespace character after JSON at position 2183 (line 56 column 2)`.
- Proven marker blob: `08550009f6d32c3e33cfae6796a9f79ba095049f`.
- Proven tail: closing JSON + literal `\\n`.

## STOP

Two failed repair passes reached the same public Stage gate. No third pass in this slice.
