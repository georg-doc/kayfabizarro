# KFB Game Dev Studio · Additive Changelog

## 2026-09-18 · GDS-01 · permanent tool + preview lane

### USER DIRECTION
- Keep Game Development Studio as a permanent KFB production lane.
- Expose assets/packages with previews at a fixed Cloudflare URL.
- Use existing `tools/` and Asset Librarian/Registry as source infrastructure, but do not copy the Librarian's UI/UX pattern.
- Add this lane to `/kfb-hub/free-roam/`.
- Maintain recovery + additive changelog after substantive turns.

### DECISION
- `tools/game-dev-studio/` owns the small presentation catalog + recovery docs.
- `game-ready/` owns package metadata/derived package artifacts.
- `/kfb-hub/free-roam/game-dev-studio/` is the human-facing permanent page.
- Public previews use pinned GitHub source revisions.
- Librarian remains a source/registry donor, not the UX shell.

### IMPLEMENTATION
- Added data-driven package catalog.
- Added permanent public Game Dev Studio site with direct 3D previews.
- Added Free Roam navigation card.
- Added tool/recovery redirect and documentation wiring.
- Added downstream integration note to Librarian README.
- Added Game-Ready index link back to the public preview lane.

### TESTED RESULT
- Source/model preview URLs are exact pinned GitHub refs.
- Static public/browser deployment proof is still separate and must be verified after Pages deployment.

### PUBLIC DEPLOYMENT
- Target URL defined; verification pending after this GitHub update.

### GEORG ACCEPTANCE
- Pending first visual review of Game Dev Studio UI/previews.

### OPEN
- First public Cloudflare check.
- Binary Sedan collider generation/validation.
- Real consumer gates.


## 2026-09-18 · GDS-02 · first real Cloudflare proof

### IMPLEMENTATION
- Added repeatable Playwright proof at `kfb-hub/free-roam/game-dev-studio/qa/public.mjs`.
- Added workflow `.github/workflows/game-dev-studio-public.yml`.
- Test targets the actual fixed `kayfabizarro.pages.dev` URL, not GitHub Pages or localhost.
- Intended checks include catalog identity, four preview assets, WebGL Studio boot, Lorekeeper preview, Sedan preview, Sedan evidence overlay and pinned 40-character GitHub revisions.

### TESTED RESULT
- GitHub Actions run `35368827693`, attempt 1: **FAIL** at the first deployment gate.
- Exact failure: `https://kayfabizarro.pages.dev/tools/game-dev-studio/catalog.json` did not expose the current catalog during 30 × 10 s polling.
- Browser/WebGL steps were therefore never reached. This is not evidence that the viewer or models are broken.
- A second run attempt was started after all navigation/recovery wiring was committed.

### DEPLOYMENT FINDING
- Repository root contains `wrangler.jsonc` with asset directory `.`.
- No repository workflow references `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` or a Wrangler deployment action.
- No Cloudflare deployment plugin/connector is currently available in this chat.
- GitHub Pages deployment evidence remains separate and is not accepted as proof for the requested Cloudflare URL.

### OPEN
- Resolve whether the existing Cloudflare project auto-syncs the current `main` head or requires an external/manual Wrangler deployment.
- Do not label the Game Dev Studio URL PUBLIC PASS until the actual pages.dev workflow succeeds.


## 2026-09-18 · GDS-03 · public Cloudflare browser pass

### PUBLIC DEPLOYMENT / TESTED RESULT
The unchanged public proof passed on run `35368827693`, attempt 2 after deployment propagation.

- job: `105680028742`
- artifact: `10557444939`
- artifact SHA-256: `cea1a31ec087aaa697deb7c64b00f078c502735056473ee0cdb02deaa56a24ac`
- fixed public URL: `https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/`
- catalog URL: `https://kayfabizarro.pages.dev/tools/game-dev-studio/catalog.json`

**11/11 public checks PASS:**
catalog deployed; four preview assets; fixed page HTTP; Studio/WebGL boot; four asset controls; Lorekeeper preview; Sedan preview; Sedan evidence overlay; pinned source revisions; tool route HTTP 200; zero browser errors.

The first attempt remains useful deployment-propagation evidence; no code/model repair occurred between the two attempts.

### HUMAN ACCEPTANCE
Still PENDING. Automated public delivery and WebGL preview evidence do not approve presentation quality or consumer behavior.
