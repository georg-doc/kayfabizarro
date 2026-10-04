# WSA job · Librarian hotfix (short, dedicated) + Georg's fast-review hosting request · 2026-09-26

**Author:** Claude Coworker.
**Priority:** P0 for part A (Georg uses the Librarian daily).

## A · Librarian copy/download buttons are broken

**Live page:** https://kayfabizarro.pages.dev/tools/asset_registry/librarian/

**Root cause (verified in the browser):**
- The page loads `../consumer_profiles.json` (= `tools/asset_registry/consumer_profiles.json`).
- On the live site this URL returns the KFB Hub HTML fallback, not JSON.
- Boot therefore fails ("Registry unavailable: Unexpected token '<'"), `state.manifest` stays null, and `buildHandoff()` throws `Cannot read properties of null (reading 'sourceRepo')`.
- Result: Copy and Download do nothing. Search and metrics are empty too.

**The file:**
- exists on `main` (blob `03aff57138f31754300a9384de1ebb1076e0f037`);
- was missing on `cloudflare-live` (that branch only had `tools/asset_registry/librarian/`).

**Proof that the file alone fixes it:** in Georg's browser, serving that file to the page gave "Registry ready" and a handoff with all 16 selected assets.

**Done by Coworker:**
- Commit `71fca15c0c954df6e32e6bb5b7450e3ff984d906` on `cloudflare-live` restores the file (byte-identical to main).

**Still broken:** ~8 min after the commit the live URL still returns the HTML fallback. So the Cloudflare build/publish step does not pick this path up, or it does not deploy on this branch automatically.

**WSA job (one bounded slice):**
1. Find why `tools/asset_registry/consumer_profiles.json` is not in the published output (build command, output dir, `_redirects`, or a missing deploy trigger).
2. Publish it.
3. Verify in a browser: the JSON URL returns JSON, the Librarian says "Registry ready", and Copy/Download produce the handoff.
4. Add a publish check so a mirror rebuild can never drop data files that a live tool fetches. This is the same failure class as the lost Travel/Free-Roam routes.

**Stop-gap for Georg:** Coworker delivered his 16-texture handoff JSON directly in chat, built from the same registry commit `378b209`.

## B · Georg's hosting request (repeated)

Georg (26.09, verbatim gist): the Cloudflare round-trip is too slow, and he does not want to keep shuffling files by hand. He has asked several times for a faster review site ("GPT-Site or something") so that the team can work sensibly.

**Coworker proposal for WSA to decide:**
- **GitHub Pages** (or an equivalent that publishes directly from a branch and folder, with no separate mirror branch) for review/preview surfaces: Librarian, ToolBox review pages, Stage review.
- Cloudflare stays only where it is really needed.
- **Goal:** a commit on GitHub is the whole publication step, with no mirror sync.

**Exactly one gate:** WSA decides A (fix now) and B (hosting model), then reports one line to Georg.
