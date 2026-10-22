# WSA Return · Repo private switch R1 · V-599 · 2026-10-22

**PARTIAL CANDIDATE — NOT READY TO SWITCH.**

Owner: WSA preparation; Georg owns merge and visibility. One draft PR: [#443](https://github.com/georg-doc/kayfabizarro/pull/443), `wsa/repo-private-switch-r1-2026-10-22`, base `7e1c4ab0f143b2f1c0f33017eb473574f20190c9`.

The implementation/evidence checkpoint is `7db84628fe2b5c345c4af6239e1f8599c2e111aa`. All 34 intended files were read back from that immutable GitHub commit and matched their expected Git blob SHA. The tested source identities are the 29 entries in `TEST_REPORT.json`; closure documents are added afterward. Read the PR head for the final documentation commit.

## Implemented

- FrizzleBob reading/PDF addresses, the reader registry bases and v1/v3/v4/v5/shared-corpus/standalone reader addresses use the existing Cloudflare origin. v1 uses the deck registry instead of anonymous GitHub directory listing. Exactly the 18 public reading Markdown files are admitted to the build; general Markdown publication remains excluded.
- Both existing standalone readers' embedded gzip/base64 corpus modules were rebuilt. The earlier failed 0-comics browser result was corrected and rechecked. v4 retains its existing 1,914-page semantics; v5 retains 1,915 pages. Both show 130 comics and 6,985 cards.
- An explicit 24-pack CC0 allowlist publishes 3,956 source media files (202,060,727 bytes), each with content hash, Git blob identity and licence source. Immutable pack URLs and historical aliases require matching complete pack inventories. Pins never become latest silently. Source registry `rawLatest`/`rawPinned` are projected at build time, not manually edited.
- Unlisted purchased/unknown packs remain excluded. Exact restricted binary copies elsewhere and named FrizzleBob/template GLBs are also excluded. Two previously projected unverified terrain-image copies are withheld. No repository file is deleted. This is not a completed audit of embedded/derived resources or all existing public content.
- Two hud-rig proof-script URLs and their source metadata use Cloudflare. Two legacy inbox githack primary imports use Cloudflare. Their whole module graphs have not been accepted. GitHub Pages documentation links were updated where in the current public/router scope.
- Candidate `START_HERE.md` and `kfb-hub/current-board.json` point to this return and show NOT READY. These changes are only in this draft PR; the deployed Hub was not changed.

## Evidence and limits

| Check | Result |
| --- | --- |
| Delivery unit tests | PASS 9/9 |
| Existing deck registry tests | PASS 4/4 |
| Fresh isolated browser network harness | PASS 283/283: 18 readings, 130 PDF HEADs, 130 JSON parses, 5 denied-host controls |
| Eight reader/home UI cases with hosts denied | PASS_LOCAL; exact routes and scopes in `PAGE_MATRIX.md` |
| Full source readiness gate | FAIL: 249 files with references; 53 of 192 HTML entries have a direct reference |
| Entire public page inventory | NOT_ACCEPTED; local passes are scoped, no production PASS |
| Three private game repos | 233 runtime source files read with no read errors; source audit only, no code writes or runtime PASS |
| Twelve existing chatgpt.site identities | Versions/status inventoried; no migration deployment or blocked-host PASS |
| Actions account quota | NOT_VERIFIED; no billing/quota capability available |

The fresh 9,967-file candidate is below the existing 18,000-file build guard. The 130 active registry PDF files have valid PDF signatures and the 130 associated JSON files parse. A historical unused `media/kfb/KAYFABIZARRO_FREESTYLE_RULES.pdf` is only two bytes (`CR LF`), predates this change and was left untouched. Do not report all 135 repository PDFs as valid/rendered.

The FrizzleBob reread check changed only one temporary preview-copy Markdown version marker, observed it in the browser, then restored the exact source. No figure, deck or production value was overwritten.

## Concrete remaining gates

1. **Purchased figures in existing public games.** Arena source references Mystery Orc Brute, Monstrosity, Toy Soldier and Avian. Travel source references Mystery Hiker, Caveman, Paladin and Action Figure, among others. Race still has historical-pinned shared pet/texture dependencies; its complete licence/deployment dependency graph is unresolved. See exact repo heads, file blobs and source lines in `SLICE_SOURCE_AUDIT.json`. Do not publish those GLBs to a public bucket. Georg must decide how the affected public scenes will work while purchased source files remain private. A public game that downloads a purchased GLB exposes its bytes even if the asset catalog hides the link.
2. **Private tools need supported server reads.** WS1 Staging v4 has environment revision 0 and no configured entries. Its inspected source snapshot fetches Raw/API without an Authorization header. A configured server-secret path and matching server implementation are prerequisites, not evidence already satisfied by the chat's GitHub connector. No credential was created, copied or placed in a browser.
3. **ToolBox visitor writes remain platform-blocked.** The existing private ToolBox stays v11. Native `sites_list_plugin_eligibility` is absent; no real visitor save/readback can be claimed. Existing core PR #416 and its adapter tests are separate prior work. Switching code agents does not itself expose that capability.
4. **Complete the remaining public dependency migration and proofs.** Resolve dynamic ref roots, third-party Raw/jsDelivr dependencies, source licences, the remaining public-proof scripts and all required page graphs. Compare the inventory with Georg's current Hub links. `PAGE_MATRIX.md` is an explicit current checklist, not an assertion that no other linked page exists.
5. **Deployment and platform checks.** No Cloudflare/R2 management capability is available here. Verify deployment source bindings, Actions private-repo quota and the existing public Site/private audience boundaries. Run the candidate on the intended Cloudflare preview revision and all current private tools, with blocked-host proofs and visual/interaction parity. Georg's merge/private-switch gate follows only after every required entry passes.

## Next decision for Georg / WS0

The brief explicitly says: “Wo eine öffentliche Seite gekaufte Medien zeigt: melden, Georg entscheidet.” The findings above trigger that decision. Keep purchased downloads private. Decide which affected public scenes should use owned/free replacements, or provide another rights-compatible product solution before migration acceptance. WSA has not silently changed the cast or relaxed the purchased-media boundary.

WS0 / Claude Code is useful for the remaining Cloudflare deployment/configuration and private-repo runtime work if that environment has the required permissions. It can continue this exact branch and PR; a fresh replacement project is unnecessary. The original ToolBox connection still requires the supported Sites server integration, whoever implements it.

No merge, visibility change, replacement Site, production deployment, browser token, paid-asset upload, canonical figure edit, source deletion or history rewrite was performed.
