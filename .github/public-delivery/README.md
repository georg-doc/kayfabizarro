# Private-repo delivery candidate · V-599

**NOT READY for the private switch.** PR [#443](https://github.com/georg-doc/kayfabizarro/pull/443), branch `wsa/repo-private-switch-r1-2026-10-22`. No production deployment, merge, repository visibility change or history removal.

This candidate moves the public reader data to the existing `kayfabizarro.pages.dev` origin and adds a narrowly admitted free-media projection to the existing Cloudflare build. It does not create another Site or a general proxy for the repository.

- [Return and remaining work](RETURN.md)
- [Page-by-page local results](PAGE_MATRIX.md)
- [Machine-readable test report](TEST_REPORT.json)
- [Newly admitted media and licences](PUBLIC_MEDIA_R1.tsv) — 3,956 files, 24 explicitly admitted CC0 packs; exact file and licence hashes in [policy.json](policy.json).
- [Remaining source references](SOURCE_SCAN.json), [private-game source audit](SLICE_SOURCE_AUDIT.json), [existing Site identities/status](SITES_STATUS.json).
- [Change record](CHANGELOG.md)

The TSV covers the added media overlay, not a new licence certification of every pre-existing public PDF, image, embedded resource or page. Existing public reader content is retained. Purchased and unverified media are not admitted to the overlay; a full public-build licence review is still a release gate.

## Reproduce

Use a checkout with the admitted media packs present. Fetch the two exact historical refs in `policy.json` if their verified aliases are needed. The builder fails if an admitted pack's licence, Git inventory or actual bytes differ from the reviewed snapshot. Missing historical refs are reported, never silently replaced with main.

```sh
node --test .github/scripts/public-delivery.test.mjs
python3 -m unittest discover -s tools/asset_registry/tests -p test_ar3.py
node .github/scripts/build-cloudflare-pages.mjs
node .github/scripts/audit-public-delivery.mjs .cloudflare-pages --strict
```

The strict audit currently fails as expected: 249 text files contain at least one blocked-host reference. These include third-party sources, package libraries, comments and dynamic root constants. This count is not a browser failure count. Of 192 HTML entries, 53 contain a blocked-host reference directly; absence from an entry does not prove its dependency graph.

For isolated browser QA, use a **new empty** preview directory:

```sh
node .github/scripts/prepare-private-proof.mjs .cloudflare-pages /workspace/sites/kfb-private-proof-next
sites-preview start /workspace/sites/kfb-private-proof-next
```

Open `/__private-switch-proof.html` through the managed local preview. The disposable copy maps the existing Cloudflare origin to the candidate and applies a CSP excluding Raw, all jsDelivr, github.io, GitHub API and githack. It checks 18 readings, 130 PDF HEAD responses, 130 JSON parses and five blocked-host negative controls. It does not render all 130 PDFs, emulate Cloudflare redirects, test game semantics or prove a production deployment. Stop the preview after QA.

`rebuild-reader-bundles.mjs` repairs the embedded corpus module in the two existing gzip/base64 standalone readers. The production builder also transforms embedded text modules. Source registries are preserved; public delivery URLs are generated per admitted asset with exact blob/ref verification.
