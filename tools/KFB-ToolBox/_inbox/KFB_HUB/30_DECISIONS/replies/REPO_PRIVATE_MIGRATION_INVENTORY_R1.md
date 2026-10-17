# REPO_PRIVATE_MIGRATION_INVENTORY_R1

**Date:** 2026-10-17
**Scope:** This is a read-only inventory of `georg-doc/kayfabizarro`. Nothing was changed, pushed or reconfigured.
**Base:** `gh/main` @ `c746a9567` (2026-10-17 17:07, PR #417). The WSA sources were read from `gh/docs/kfb-decisions-register-2026-10-11` @ `3d9c0ae30`.
**Method:** `git grep`, `git ls-tree` and `git show` on the fetched refs, plus anonymous HTTP HEAD/GET probes of the public endpoints. The public GitHub API was called without a token.

---

## 0. Bottom line

* **The repo currently leaks through two public channels, not one.**
  1. Raw and jsDelivr URLs.
  2. **GitHub Pages is live.** The API reports `has_pages: true`, and `https://georg-doc.github.io/kayfabizarro/media/3D_Assets/KayKit_Mystery_Series6/LICENSE.txt` returns HTTP 200. Pages mirrors the *entire* repo, including the Mystery Series.
* **Cloudflare Pages survives the switch.** `kayfabizarro.pages.dev` is built through Cloudflare's Git integration: there is no wrangler deploy in any workflow, and `wrangler.jsonc` has `pages_build_output_dir: ./.cloudflare-pages` with build script `.github/scripts/build-cloudflare-pages.mjs`. That keeps working with a private repo. **But the build deliberately excludes `media/2D_Assets/` and `media/3D_Assets/`**, so every page that shows 3D/2D assets or songs fetches them at runtime from `raw.githubusercontent.com`. Those pages break.
* **The PDF viewer breaks today as built, even though all 135 PDFs are already on Cloudflare.** It loads its deck registry and every PDF via `raw.githubusercontent.com`. The fix is small: change about 4 URLs and rebuild one bundle.
* **The chatgpt.site tools load data client-side from raw/API without a token** (Asset Library/Librarian incl. Dramatis Personae, Audio, ToolBox). They break. The WS1 staging Site fetches server-side and only needs a token secret.
* **Workflows survive.** They use `GITHUB_TOKEN` and checkout. None fetches raw/jsDelivr anonymously. Risks: the Actions minutes quota for private repos, and 11 "public-proof" scripts that probe `kayfabizarro.pages.dev`, two of which also probe `georg-doc.github.io`.
* **Forks:** 0 (public API). Going private therefore leaves no public fork behind. Content that was already public (clones, jsDelivr cache, archives) cannot be recalled.

---

## 1. Places that load repo content via public GitHub URLs

### 1.1 Totals on `gh/main`

Numbers are matching *lines*, from `git grep -c`.

| Pattern | Files | Lines |
|---|---:|---:|
| `raw.githubusercontent.com/georg-doc/kayfabizarro` | **762** | **125,242** |
| `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro` | 139 | 288 |
| `github.com/georg-doc/kayfabizarro/(blob\|raw\|tree)` (human links) | 60 | 429 |
| `api.github.com/repos/georg-doc/kayfabizarro` (no token) | 9 | 11 |
| `georg-doc.github.io` (GitHub Pages) | 11 | 12 |
| `raw.githack.com` (third-party, banned by STAGE_LIVE_WORKFLOW) | 13 | 14 (2 code files, both in `_inbox`) |
| `media.githubusercontent.com` (LFS) | 0 | 0 |

Most of the raw lines are registry data: `registry/assets/v1` holds 51,034 `rawLatest` fields plus 51,034 `rawPinned` fields. **The fix is not 125k edits.** Live code builds its URLs from about a dozen base constants. Distinct prefixes in code:

* `…/main/media/3D_Assets` ≈ 420 occurrences
* `…/<sha>/media/3D_Assets` ≈ 205
* `…/main/media/2D_Assets` ≈ 46
* `…/main/media/kfb` ≈ 31
* jsDelivr `@main/media/3D_Assets` ≈ 43
* jsDelivr `@main|<sha>/tools/KFB-ToolBox` ≈ 31

### 1.2 By consumer

**A. Sites and tools**

133 deployed code files (`.html/.js/.mjs/.ts/.py` outside `skills/`, `_inbox`, `_handover`, `_handoff` and `registry/`) contain raw, jsDelivr or API URLs.

| Consumer | Where it is hosted | Key files (on `gh/main` unless noted) | What breaks |
|---|---|---|---|
| **PDF viewer / deck reader** | `kayfabizarro.pages.dev/media/kfb/` (also mirrored on github.io) | `media/kfb/index.html`, a 1.59 MB Claude Design bundle with embedded `kfb-corpus.js` where `REGISTRY_URL = https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json`. `media/kfb/index.json` (130 decks) and `media/kfb/kfb-index.json` (4 decks) both set `baseUrl = https://raw.githubusercontent.com/…/main/media/kfb`. The card back `KayfaBizarro_Card_Backside_01_lowrez.png`, `media/scissors_open.png` and `scissors.gif` are loaded via raw. Source: `KFB Comic Card Deck Viewer v4 (WS0)/deckviewer/kfb-corpus.js`. | **All of it**: the deck list, the PDFs and the card backs. Older viewers (`KFB Deck Viewer.dc.html`) also list PDFs via `api.github.com/…/contents/media/kfb`. `kayfabizarro_browser.html` links 4 booklet PDFs via raw. |
| **Asset Librarian / Asset Library** (chatgpt.site `kfb-asset-librarian`, Site `appgprj_6ac1afef…`) | OpenAI Sites (HTTP 401 = sign-in gated) | **Docs branch** `…/replies/WSA_DRAMATIS_PERSONAE_R1_SOURCE/app.js`: 4 raw constants (`LIVE_BASE` = raw `bot/asset-registry-update/registry/assets/v1`, `CANONICAL_BASE` = raw main, SHA-pinned base, `PRIVATE_ASSET_LIVE_URL`), 1 API, 1 web. `dramatis-personae.js`: API plus a RAW builder reading `docs/kfb-decisions-register-2026-10-11/…/FIGURES_R1/`. On main: `tools/asset_registry/librarian/state.js` (`LIVE_REGISTRY_BASE` raw), `rig-preview.js` (`RAW_3D` = raw main `media/3D_Assets/`). Every preview uses the registry's `rawLatest`/`rawPinned`. | Registry load, every thumbnail and 3D preview, Dramatis Personae and private-intake projection. |
| **Audio site** (chatgpt.site `kfb-audio`, PR #350) | OpenAI Sites (401) | **The Site source is not in the repo** (no `WSA_*SOURCE*`, nothing under `tools/`). Its media lives in `media/3D_Assets/Sounds` (2.25 GB: Jukebox v2 1.43 GB, `kfb_deck_songs` 554 MB) and `media/3D_Assets/Audio` (220 MB), which are excluded from the CF build, so raw is the only public path. | **Very likely broken** (not verified: source unavailable). |
| **ToolBox** (chatgpt.site `kfb-toolbox`; CF `kfb-hub/stage/toolbox/`) | OpenAI Sites (401) + CF Pages | `kfb-hub/stage/toolbox/index.html` (about 20 GitHub tree/blob/PR links). `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/lab.mjs` (raw, Mystery Series). `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` and `petstudio-v9/studio-v3/pet-mouth.v1.js` (raw + jsDelivr). | 3D donors/rigs stop loading. GitHub source links show a 404 to anonymous viewers. |
| **WS1 staging** | `ws1-preview.kayfabizarro.pages.dev` (CF branch build of `ws1/preview`) + chatgpt.site `kfb-ws1-staging` | The live preview HTML (18.7 MB) contains about 20 raw URLs: `main/media/…`, 3 pinned SHAs and `${var}/media`. **Docs branch** `WSA_GPT_STAGING_R1_SOURCE/lib/staging.ts`: server-side Worker with `ROOT = raw…/`, `API = api.github.com/repos/…/` (reads `build.json` and `git/trees`), plus an R2 archive. | The CF build still deploys, but its 3D assets fail. The Worker's GitHub fetches return 404/403. **It is fixable with a token secret** because it runs server-side. |
| **kfb-hub stages and labs** (CF Pages) | `kayfabizarro.pages.dev/kfb-hub/...` | 17 code files with raw (208 lines), 5 with jsDelivr. Examples: `stunt-race/track-lab/feel-lab-v0{7,8,9}.mjs`, `track-environment-lab/host/feel-lab-v08.mjs`, `stage/stunt-world/hud-{2d-v1,game-v3,racer-v2}/index.html`, `track-ribbon-st01/site/feel-lab-st01.mjs`, `stage/stunt-world/*/osm-city-drive`. `kfb-hub/live/open-world-mvp.json` (202 lines) and `current-board.json` (62) contain only human **blob** links. | 3D/2D assets. Blob links show a 404 to anonymous viewers. |
| **Game prototypes** (CF Pages) | `travel/`, `overworld/`, `Nexus Castle/`, `KFB Boxel Blitz/`, `KFB Combat Arena/`, deck viewers | 62 code files with raw (1,403 lines), 15 with jsDelivr. Examples: `Nexus Castle/nexus-castle-v5/quellcode/*.dc.html` (13/13/10), `travel/*/kfb-pets.js` (7 each), `travel/wip/travel_globe_wsa/**` (20 files), `globe-v13/asset-inventur.js` (API tree listing). | Assets. Mostly legacy, so breakage could be accepted. |
| **Media-side catalogs** | excluded from the CF build (raw only) | `media/3D_Assets/CATALOG/asset-browser.html` and `KFB_AssetLibrary_v1.html` (API `git/trees?recursive=1` + raw), `media/3D_Assets/kfb-pets.js(on)`, `media/2D_Assets/sprite-sheet-builder.html` | Fully dead. Already superseded by the Librarian. |
| **Other tools** (CF Pages) | `tools/*` | 11 code files with raw. Examples: `tools/world_atlas/source/KayKit_Cards_Hourglass_S10.html`, `tools/kfb-cartoon-map-board/src/app.js`, `tools/kfb-graveyard/*`, `tools/resident_atlas_s6` (jsDelivr) | Assets. |
| **GitHub Pages mirror** | `georg-doc.github.io/kayfabizarro/` | 11 files reference it: `kfb-hub/stage/stunt-world/hud-rig-v{1,2}/SOURCE.json` + `public-proof.mjs`, `kfb-hub/README.md`, `skills/chat/RECOVERY_PATH.md` (fallback URL), `kfb-hub/stunt-race/track-lab-v062/repair-bootstrap.mjs` | The mirror disappears, or stays public: see §2. |
| **Not deployed, but may run in claude.ai / Claude Design** | `tools/KFB-ToolBox/_inbox/**`, `skills/**` | `_inbox`: 261 files with raw (2,985 lines), 84 with jsDelivr (175), 3 with API. `skills`: 61 raw files (35,195 lines, mostly 3 stale copies of `kfb-asset-library*.json` at about 11–12k lines each). | Any Claude artifact or `.dc.html` that loads raw URLs breaks, for example the `/kfb-hub` redirect target `claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d`, which was not inspected. |

**B. Registry JSONs** (`rawLatest`/`rawPinned`)

* `registry/assets/v1`: 264 files, 51,034 `rawLatest` + 51,034 `rawPinned` fields.
  * `catalog.jsonl` alone holds 16,726 assets × 2 URLs.
  * Plus `kinds/*.json` (3), `packs/*.json` (125) and `decks/*` (134).
  * Biggest: `catalog.jsonl` 16,726 lines; `kinds/model-3d.json` 15,638; `kinds/image-2d.json` 13,372; `kinds/audio.json` 4,442; `packs/audio.json` 3,438; `packs/kaykit-mystery-series6.json` 1,896.
* `registry/resources/v1`: 5 files, 336 lines (`resources.jsonl` 168, `motions.jsonl` 155, `configs` 6, `fx` 4, `actors` 3).
* Generator: `tools/asset_registry/config.json` sets `sourceRepo: georg-doc/kayfabizarro` with roots `media/2D_Assets`, `media/3D_Assets` and `media/public_domain`. `build.py` emits the raw URLs. This is the only place that needs changing; the JSON is regenerated.
* Catalog volume by root: 3D 11,590 assets / 3.26 GB; 2D 5,132 / 122 MB; public_domain 4 / 0.5 MB.

**C. Workflows** (`.github/workflows`, 52 files)

* **0 anonymous raw/jsDelivr/API fetches.** 14 workflows push (`asset-registry`, `resource-registry`, `asset-unpack`, `box-stop-publish`, `osm-city-*`, `public-domain-pool-*`, `race-box-stop-status-sync`), all with `GITHUB_TOKEN`. That works on a private repo.
* 11 QA scripts called by workflows hit **public hosts**:
  * `kayfabizarro.pages.dev`: free-roam, game-dev-studio, kcl-m1, tinyskies-osm, hud-2d/game-v3/racer-v2, cartoon-map-board.
  * `georg-doc.github.io` + pages.dev: `hud-rig-v1/public-proof.mjs` and `hud-rig-v2/public-proof.mjs`.

  They will fail if assets no longer load or Pages is turned off.
* 34 workflows trigger on push to `main`. 44 jobs use `ubuntu-latest`, many with Playwright and timeouts of 10–24 min. **On a private repo, Actions minutes count against the plan quota**: 2,000 min/month on Free, 3,000 on Pro, plus 500 MB of artifact storage on Free.

**D. ChatGPT-site sources** (docs branch, `replies/WSA_*SOURCE*`)

| Source | Site | Public-URL use |
|---|---|---|
| `WSA_DRAMATIS_PERSONAE_R1_SOURCE/` (6 files) | Asset Library `appgprj_6ac1afef08148191b62b95f184bf845e` | `app.js`: 4× raw, 1× API, 1× github.com. `dramatis-personae.js`: API + raw builder against branch `docs/kfb-decisions-register-2026-10-11`. **Client-side**, so a token cannot be used safely. |
| `WSA_GPT_STAGING_R1_SOURCE/` (17 files) | WS1 staging `appgprj_6ad2ac305b788191af0bdfc68823a300` (R2 bucket bound) | `lib/staging.ts`: 1× raw ROOT, 1× API (server-side Worker). `lib/links.ts` whitelists `ws1-preview.kayfabizarro.pages.dev`. `evidence/hosted-http.json` contains 16 links to it. **Server-side**, so a token secret fixes it. |
| other `WSA_*SOURCE*` (`LIGHT_STUDY_C_R1`, `TRACK_MODULE_LOOK_SPEC_R1/R2`, `RHYTHM_PROPS_INVENTORY_R1`, `PLACE_RELATIONS`, `LAB_IMPORT_RELATIONS`) | none (manifests/evidence) | 0 runtime URLs |

---

## 2. Deploy paths and whether they survive a private repo

| Path | Mechanism | Works with private repo? | Notes |
|---|---|---|---|
| **Cloudflare Pages `kayfabizarro`** → `kayfabizarro.pages.dev` | CF Git integration. `wrangler.jsonc` (`pages_build_output_dir ./.cloudflare-pages`, `nodejs_compat`). Build: `node .github/scripts/build-cloudflare-pages.mjs`. `.assetsignore` and `_redirects` (89 KB: 28 → claude.ai artifacts, 28 → kfb-toolbox, 24 → kfb-audio, 8 → kfb-asset-librarian, rest → archive) | **Yes**, as long as the Cloudflare GitHub App keeps access to the repo | The build excludes `skills/`, `_handoff/`, `.github/`, `media/2D_Assets/`, `media/3D_Assets/`, `tools/KFB-ToolBox/_inbox/`, `**/_handover/`, `.md/.zip/.blend/.fbx/.obj/.psd/...`, and files over 25 MiB. The projection is about 2,036 files / 0.71 GB, under the script's 18,000-file guard and CF's 20,000-file limit. **It already contains all of `media/kfb`** (284 files, 449 MB). Verified: `https://kayfabizarro.pages.dev/media/kfb/index.json` and a PDF return HTTP 200 with `access-control-allow-origin: *`. |
| **CF branch previews** (`ws1-preview.kayfabizarro.pages.dev` ← `ws1/preview`, `cloudflare-live`, `cloudflare/workers-autoconfig`, …) | same Git integration (533 remote branches) | **Yes** | Their runtime raw fetches break, as in §1. |
| **GitHub Actions** | `GITHUB_TOKEN`, checkout | **Yes** | Minutes quota (see §1C). |
| **GitHub Pages** `georg-doc.github.io/kayfabizarro/` | branch deploy (`.nojekyll` in root). Currently live and public, **serving everything including the Mystery Series** | **On GitHub Free: no.** Pages is disabled when the repo goes private. **On Pro/Team: yes, and it stays PUBLIC**, which would keep leaking the assets. | **Georg must explicitly unpublish Pages before or at the switch.** The plan could not be queried (no `gh`, no token). Pages can only be private on Enterprise Cloud. |
| **OpenAI Sites** (`*.frizzlebob.chatgpt.site`: asset-librarian, audio, toolbox, production-hub, world-studio-mvp1, production-control, eyerig-workbench, frankenstein-composer, hypernormalisation-curator, ws1-staging, play-kayfabizarro) | deployed through OpenAI Sites tooling, not GitHub integration. All probed sites return 401 (sign-in gated) | **The deploy is unaffected; runtime GitHub fetches are not** | Client-side raw/API calls break: Librarian, Audio, ToolBox, and presumably Frankenstein Composer and Curator (which browses 130 decks; not inspected). Server-side Workers can use a token. |
| **Anonymous `raw.githubusercontent.com`** | — | **No.** Returns 404 immediately. | This is the main dependency. |
| **jsDelivr `cdn.jsdelivr.net/gh/...`** | — | **No.** jsDelivr only serves public repos. | Copies already cached, especially SHA-pinned ones, may keep being served for a while. Check after the switch and purge where possible. |
| **`raw.githack.com`** | — | **No** | Used only in 2 `_inbox` exports; already banned by `skills/chat/STAGE_LIVE_WORKFLOW.md`. |
| **Anonymous `api.github.com`** | — | **No** (404), and rate-limited to 60/h anyway | 9 files (§1). |
| **Human `github.com/.../blob\|tree\|pull` links** | — | Visible only to logged-in collaborators | Fine for Georg. Public hub pages show 404 links to visitors (`kfb-hub/index.html`, `stage/toolbox/index.html`, `current-board.json`, `live/open-world-mvp.json`). |
| **Claude sessions / connectors** | SSH deploy key `kfb_kayfabizarro_deploy`, GitHub connector | **Yes** (key or OAuth based) | The `plugin:github` MCP currently fails with "Authorization header is badly formatted". That is unrelated, but it will matter once anonymous access ends. |

The public **root hub** `kayfabizarro.pages.dev/` (`index.html`) contains **no** repo URLs. It links `media/*.pdf` relatively and pulls YouTube/Gumroad/fonts, so it is unaffected.

---

## 3. Purchased or licence-restricted asset folders on `main`

Sizes are git blob sizes.

| # | Folder | Size | Files | Licence finding | Recommendation |
|---|---|---:|---:|---|---|
| 1 | **`media/3D_Assets/KayKit_Mystery_Series6/`** | **297.1 MB** | 1,235 | `LICENSE.txt` says CC0 ("Monthly Mystery Characters Series 6, July 2025–June 2026"), but the content is Patreon-distributed and **includes 64 SOURCE/.blend files (96 MB) = SOURCE tier**. 36 monthly characters + 4 animation sets + Santa/Mummy/GothGirl/DemonLord/UltraTurboHeroMan/CapsuleCarl/CharacterTemplate. Registry: `packs/kaykit-mystery-series6.json` (948 assets). Referenced by **47 code/data files** outside registry/skills/_inbox (263 including `_inbox`): `tools/resident_atlas_s6/**` (15), `travel/wip/travel_globe_wsa` (5), `tools/KFB-ToolBox/kfb-rigs-embed-v3` (4), `kfb-hub/stunt-race/track-lab` (3), `kfb-hub/stage/toolbox` (3), `tools/asset_registry/librarian` (2), `game-ready/pilot-01-lorekeeper-sedan/manifests` (2), … | **Private only.** Ship it only inside game/tool builds, never as a raw download. A thinned copy is in `_inbox/KFB_RESIDENT_ATLAS_..._2026-09-28_r1/media/3D_Assets/KayKit_Mystery_Series6/` (0.6 MB). |
| 2 | `media/3D_Assets/Kaykit_Medieval Snow Biome/` + `media/3D_Assets/Medieval Snow Biome.zip` | 3.8 MB + 7.1 MB | 80 + 1 | The licence header reads "Medieval Builder Pack **Patreon Bonus**"; includes `Overview_PatreonExclusives.png` | Private only. |
| 3 | KayKit packs **without the `_FREE` suffix** (possibly EXTRA/paid tier; check against Georg's purchases): `KayKit Legacy/` 55.2 MB, `KayKit_Bits_Bundle1_1.1/` 39.1 MB, `KayKit_Character_Animations_1.1/` 12.6 MB + zip 14.9 MB, `KayKit Medieval Builder Pack 1.0/` 9.0 MB + zip 7.0 MB, `KayKit_HalloweenBits/` 9.3 MB, `Kaykit_Festive Mini-Pack/` 4.9 MB, `KayKit_Skeletons/` 12.2 MB (but the zip is named `…_1.1_FREE`) | ≈ 165 MB | — | Every licence file says CC0 ("free to use… support me by purchasing EXTRA or SOURCE") | Treat as **private by default** until Georg confirms which ones were bought. All `*_FREE` KayKit/Tiny Treats packs can be public (CC0). |
| 4 | Audio packs with unverified or likely paid licences: `media/3D_Assets/Sounds/Cozy Tunes - The Classics/` 194.4 MB, `Audio/S050C-ArcadeShooter/` 49.5 MB (licence only as `Text/Licence.pdf`, not decoded), `Audio/Musical Effects/` 39.5 MB, `Audio/Classic Arcade SFX Complete/` 22.9 MB + `Classic Arcade SFX/` 7.2 MB, `Audio/Cartoonish Music Pack/` 17.3 MB, `Audio/Match Three/` 5.8 MB | ≈ 337 MB | — | "Complete"/"The Classics" naming suggests a purchase; no licence check done | Private until checked. |
| 5 | **CraftPix** (licence `https://craftpix.net/file-licenses/` allows use in projects and **forbids redistributing the files**): `media/2D_Assets/free-top-down-goblin-character-sprite` 21.8 MB, `free-medieval-bandit-4-direction-character-pack` 18.8, `free-water-and-fire-magic-sprite-vector-pack` 6.4, `free-cartoon-smoke-effects-asset-pack` 6.3, `free-2d-top-down-pixel-dungeon-asset-pack` 5.0, `free-simple-summer-top-down-vector-tileset` 1.9, `free-poison-swamp-…` 1.5, `free-pixel-art-tiny-hero-sprites` 0.3, `KFB Knight` 0.3, `KFB Mage` 0.4, `KFB Rogue` 0.3 | ≈ 63 MB | 11 folders | redistribution not allowed | Private (in builds only). |
| 6 | Pixel Frog packs (itch.io): `Tiny Swords (Free Pack / Update 010 / Enemy Pack)` 10.6 MB + 2 zips 6.4 MB, `TreasureHunters` 1.4, `Pirate_Bomb` 0.9, `Kings_and_Pigs`, `Palm Tree Island` | ≈ 20 MB | — | no licence file in the repo; itch terms usually forbid resale/redistribution | Check; private by default. |
| 7 | Mixamo: `tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/mixamo/` | 8.8 MB | 59 | Adobe terms forbid redistributing raw Mixamo files | Private. |
| 8 | **Sketchfab** (no folder named "Sketchfab"): `media/3D_Assets/HumanBaseMeshes/human_body_base_mesh_male/`, part of 20.4 MB in `HumanBaseMeshes` | — | — | **CC-BY-4.0** (ferrumiron6), attribution required | Can be public with attribution. |
| 9 | Poly Pizza / Google Poly / single creators (`media/3D_Assets/KFB/* by <Author> - <id>.glb`) | ≈ 96 MB (187 files, incl. KFB's own) | — | CC-BY/CC0 mix ("by Poly by Google", "by Evol-Love", …) | Public with attribution list. |
| 10 | **Meshy** (Georg's own): `media/3D_Assets/WSB_BLENDER/B7/*.glb` (JungleComputer A/B/LOD1) | 24.9 MB (4 GLBs; B7 total 87.6 MB) | — | Sources live in `~/Dropbox/CLAUDE/MeshyModels` (not in the repo). Meshy grants ownership on a paid plan; the free tier is CC-BY. | Fine; can be public at Georg's choice. |
| 11 | **BodyParts3D** | 0 bytes on main | — | Only referenced in `_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/*` (5 files). CC BY-SA 2.1 JP. | Fine. |
| 12 | Names containing *privat/kauf/purchased/patreon/Sketchfab/CGTrader* | — | — | **No asset folders match** except the Patreon PNG in #2. *privat* hits are only docs: `skills/chat/workflows/KFB_PRIVATE_SOURCE_PUBLIC_HUB_V1_2026-09-22/` and `tools/asset_registry/librarian/_handover/PRIVATE_AUDIO_INTAKE_R1_2026-10-09/`. `tools/asset_registry/librarian/live/private-asset-live.json` is a deliberately byte-free projection (`private_projection.py` strips paths, IDs and tokens). | — |
| 13 | Georg's own audio: `Sounds/kfb_deck_songs` 554 MB (Suno), `Sounds/KFB RoadTrip JukeBox v2` 1.43 GB, the rest of `Sounds` | ≈ 2.05 GB | — | own content (Suno commercial rights depend on the plan used) | Public if Georg wants it. Too big for CF Pages, so → R2. |

Public-safe open packs (CC0 Kenney ≈ 129 MB, Quaternius ≈ 215 MB, KayKit/Tiny Treats `*_FREE`, ambientCG `Textures` 314 MB, `media/public_domain`) can stay public.

**Media totals on `main`:** `media/` ≈ 6 GB of blobs. GitHub reports the repo at 6.1 GB. `media/3D_Assets` deployable formats come to ≈ 14,068 files / 3.74 GB, of which the Mystery Series is 682 files / 105 MB. `media/2D_Assets` is ≈ 5,178 files / 125 MB. Even the public part of these **does not fit into CF Pages** (20,000-file limit with the existing ≈ 2,036 files), so bulk assets belong in **R2**.

---

## 4. PDFs used by the PDF viewer

* `media/kfb/`: **135 PDFs, 422.2 MB**. The largest is 3.96 MB, so every PDF is under the CF 25 MiB limit. With the `.pdf.json` card data, wall images and the viewer, the folder is 285 files / 449.5 MB.
* Registry `media/kfb/index.json`: 130 decks (schema `kfb-deck-registry/v2`). `kfb-index.json`: 4 decks.
* **Already deployed** to `kayfabizarro.pages.dev/media/kfb/`. Verified: a PDF and `index.json` return 200 with `ACAO: *`. Only the URLs inside the viewer and the registry point to raw.
* Other PDFs on main: root/`media` booklets 13.1 MB (5; already linked relatively from the hub), `tools/KFB-ToolBox` 69.1 MB (5), `media/3D_Assets` 11.4 MB, `media/2D_Assets` 1.5 MB.

---

## 5. Target architecture (proposal)

1. **Private source repo.** `georg-doc/kayfabizarro` stays the single source of truth, private. Everything (including purchased assets) lives there. Access is via the SSH deploy key, the GitHub connector and `GITHUB_TOKEN`.
2. **Public front end = Cloudflare Pages (unchanged mechanism).** `kayfabizarro.pages.dev` keeps building through Git integration from the private repo. It serves the hub, tools, labs and **all deck PDFs** (already in the projection). Rule: **nothing on the public surface references `raw.githubusercontent`, jsDelivr, the anonymous API or github.io.** Add a CI guard (`git grep` on deployable paths, failing on those hosts) to `build-cloudflare-pages.mjs`.
3. **Public asset CDN = R2 bucket** behind a custom domain such as `assets.kayfabizarro…`, or `pub-…r2.dev` to start. A GitHub Action syncs **only an allowlist of public-safe packs** to R2, keyed by path (`/main/…`) and by content SHA (`/sha/<blobSha>…`) so pinned references keep working. Public-safe means CC0 Kenney/Quaternius/KayKit-FREE/Tiny-Treats-FREE, ambientCG, public_domain, Georg's own songs/models, and CC-BY with an attribution file. A deny list (Mystery Series, Patreon bonus, CraftPix, Pixel Frog, Mixamo, unverified audio) can never reach R2. Set CORS `*` on the bucket.
4. **Registry emits `publicUrl` instead of `rawLatest`/`rawPinned`.**
   * `tools/asset_registry/build.py` + `config.json` gain `publicBase` and an allowlist.
   * Restricted assets get `publicUrl: null` plus `delivery: "build-only"`. The existing private projection already models this.
   * The Librarian and the Dramatis Personae site switch their base constants (`LIVE_BASE`/`CANONICAL_BASE` → CF/R2-hosted copy of `registry/assets/v1`, which the CF build already includes since `registry/` is not excluded).
   * Restricted assets appear as metadata cards without bytes.
5. **Purchased assets only in game/tool builds.** WS1, ToolBox, Resident Atlas and Frankenstein copy the specific GLBs they need into their `dist/` at build time. That happens in a private CI step; the output goes to CF Pages or the WS1 R2 archive. Assets are embedded and served as part of a game, never as a browsable pack or registry download, and never with SOURCE `.blend` files. (KayKit's CC0 makes this legally unproblematic. The point is not to republish paid tiers wholesale.)
6. **Server-side consumers use tokens.** The WS1 staging Worker (`lib/staging.ts`) gets a fine-grained read-only PAT (Contents: read, this repo only) as a Site secret and sends `Authorization: Bearer`. Never put tokens in client-side code (Librarian, Audio, ToolBox).
7. **Turn off GitHub Pages** and move the 2 github.io proof scripts and docs to `kayfabizarro.pages.dev`. Update `skills/chat/RECOVERY_PATH.md` and `kfb-hub/README.md`.
8. **Legacy prototypes:** fix the live surfaces only (PDF viewer, Librarian, Audio, ToolBox, WS1, current kfb-hub stages and labs). Use a one-line base-constant swap; most files share about a dozen prefixes. Archive the rest (`travel/` v13–v25, `overworld/`, `Nexus Castle`, `media/3D_Assets/CATALOG`, `skills/**` copies) with an "archived, assets offline" note rather than fixing them.
9. **Optional alternative to R2:** a small **public mirror repo** (`georg-doc/kayfabizarro-public`) holding only site builds, PDFs and CC0 packs, synced by an Action and served via CF Pages. It is simpler to reason about, but it is still a git repo of several GB (the 20k-file CF limit and GitHub size limits apply). R2 is the cleaner fit for 3–4 GB of binary assets.

### Migration order

1. **PDF viewer first** (smallest change, highest value).
   * Set `baseUrl` in `media/kfb/index.json` and `kfb-index.json` to `https://kayfabizarro.pages.dev/media/kfb`, or better a relative `.`/same-origin path.
   * Set `REGISTRY_URL` in `deckviewer/kfb-corpus.js` to same-origin `./index.json`.
   * Move the card back and scissors to the CF path.
   * Rebuild the `media/kfb/index.html` bundle and verify on pages.dev.
2. **Create the R2 bucket and an allowlist sync Action**, then backfill the public-safe packs.
3. **Registry `publicUrl`** plus the Librarian, Dramatis Personae and Audio base switch. Redeploy the OpenAI Sites.
4. **WS1/ToolBox/Resident Atlas build step** for restricted donors. Then the WS1 staging token.
5. **CI guard** against raw/jsDelivr/github.io on deployable paths. Swap the base constants in the live kfb-hub stages.
6. **Georg: turn off GitHub Pages → set repo Private → check that the Cloudflare app still has access → test the public URLs.**
7. After the switch: re-run the public proofs, probe jsDelivr cache for still-served Mystery files (purge), and watch Actions minutes for the first month.

### What Georg must do himself

* Decide the allowlist/denylist, especially #3, #4 and #6 in §3 (what was bought).
* GitHub → Settings → Pages: **Unpublish**. Settings → General → Danger Zone → **Change visibility → Private**.
* GitHub → Settings → Applications → **Cloudflare Workers and Pages**: confirm repository access still includes `kayfabizarro`.
* Cloudflare dashboard: create the R2 bucket, enable public access or bind a custom domain, set CORS, and create an R2 API token as a GitHub Actions secret.
* Create a fine-grained read-only PAT for the WS1 staging Site and add it as a Site secret.
* Check the GitHub plan and Actions minutes: on Free, either trim the push-on-main proof workflows or upgrade.
* Optional: fix the `plugin:github` MCP auth (currently a "badly formatted" header).

### Rough effort

| Block | Effort |
|---|---|
| PDF viewer fix + bundle rebuild + verification | 1–2 h |
| R2 bucket + allowlist sync Action + backfill (≈ 3 GB) | 0.5–1 day |
| Registry `publicUrl` + Librarian/Dramatis/Audio switch + Site redeploys | 1 day |
| Build-time bundling of restricted donors for WS1/ToolBox/Resident Atlas | 0.5–1 day |
| Base-constant swap in live kfb-hub stages + CI guard + proof scripts | 0.5–1 day |
| WS1 staging token | 1 h |
| Georg's clicks (Pages off, visibility, CF/GitHub settings, R2, PAT) | ≈ 1 h |
| **Total** | **≈ 3–5 agent workdays + ≈ 1 h Georg** |

**Fast fallback:** going private *immediately* (after unpublishing Pages) is technically possible today. The cost is that the PDF viewer, Librarian, Audio, ToolBox and all 3D-loading stages stay broken until steps 1–5 land. The hub, the PDFs as files, and the CF deploys keep working.

---

## Open points / not verified

* The Audio Site source was not found in the repo, so the Audio breakage is inferred from the media location.
* Frankenstein Composer, Hypernormalisation Curator, Production Hub and World Studio Sites were not inspected; they very likely use raw too.
* Claude artifacts behind the `_redirects` targets (`claude.ai/artifact/...`) were not inspected.
* The GitHub plan (Free vs Pro) is unknown, and that decides what happens to Pages and how many Actions minutes are available.
* The licence PDF of `S050C-ArcadeShooter` was not decoded. Licence status of `Cozy Tunes`, `Classic Arcade SFX Complete`, `FlowerPower_PNG` and `Foods Asset HQ` is unknown.


## Addendum WS0 17.10. (Georg)
- **FrizzleBob contains Mystery Series parts:** brows from `KayKit_Mystery_Series6/CapsuleCarl/gltf/enemy.gltf`, nose from `…/CapsuleCarl/gltf/player.gltf`. Every FB GLB is therefore **not public as a raw download** (neverPublic in the R2 allowlist). Using it built into game and tool builds stays possible. In the long run: replace brows and nose with our own clay parts if FB is to be published as a single file.
- Meshy stages (B7/B8/B9) come from Georg's Meshy subscription (V-230), so they count as own content, public OK (final confirmation by Georg).

## Georg's answers (Hub 17.10. evening)
- Repo-private plan: **later** (do not start yet).
- **All KayKit packs without "_FREE" count as purchased** (Georg has both the Patreon membership and the extended version), so they are private and only allowed built into builds.
- **Keep the Meshy stages (B7/B8/B9) private**, so they are not in the public allowlist (overrides the WS0 assumption above).
- Potions + witch station = magic colour variants and the fluff recipe station (V-368), confirmed.
