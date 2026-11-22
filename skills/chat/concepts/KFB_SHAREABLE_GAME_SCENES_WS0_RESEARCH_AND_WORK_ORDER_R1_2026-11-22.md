# KFB Shareable Game Scenes / Deep-Link Presets · WS0 Research + Execution Work Order R1
**Date:** 2026-11-22
**Status:** GEORG REQUEST / RESEARCHED DESIGN / WS0 TASK PREPARED · NOT IMPLEMENTED · NO LIVE LINKS
**Owning coordinator:** existing **WS0 Lead**; receiving runtime: existing **WB2 / World Studio** and actual product game Site owner as confirmed by an exact source census (NOT a new Link Runtime). **WSA/WorldBuilder** executes shared router changes only when authorized; WS0 may spawn one bounded Claude *design/implementation* job after confirming its route, not an independent runtime owner.
**Repository/PR:** `georg-doc/kayfabizarro` · Draft PR #477 · `planning/kfb-human-nature-book-processor-scenelet-r0-2026-11-22`.
**Stage:** none for this planning/task checkpoint. Never invent a test URL or label a private ChatGPT Site/public mirror LIVE without opening the exact released revision.
**Intended outcome:** Georg chooses switches/scene/shot/look in the existing KFB game, selects **Copy scene link**, sends it to a permitted person, who sees the **same intended scene and authored starting beat** with zero manual settings work.

## 1. Actual user scenarios and boundary

**A · Cousin / Human Nature book:** invited recipient clicks an authorized private ChatGPT Site link and appears in the existing KFB world at the **BOOK PROCESSOR** attraction or its existing scenelet instance, with book visible and a source-verified default camera composition; optional preset jumps to book opening / machine assembly / reader or to a selected verified PDF page. The original book is built by WSB/Blender MCP; WS0's dedicated Claude child produces machine Scenelet; shared-link code does **not** reimplement that module. Specific book deck/card cropping remains unsafe until source mapping verification.

**B · Colleague / satirical GTA-style aquarium:** link boots the exact existing working KFB game/review Site, scenelet/attraction ID for the aquarium module, the intended world/look, a cinematic camera approach and optional soundbed. **IMPORTANT:** this chat's repository-scoped GitHub search found no authoritative Aquarium/GTA VI runtime module path/ID in current `kayfabizarro` main; the source may be in an unpublished GPT Site/Claude chat or different owner/repo. **WS0 MUST inventory the real current Site/source, module ID and switches before recording any live ID or claiming a playable URL.** No invented aquarium scene, placeholder prop, external GTA branding or unlicensed media.

**C · generic future share:** an authored event, resident encounter, route/quest segment, mini-game, world composition, camera shot, lighting/weather/look and optional music context can be shared through one stable entry contract. Initially observational/demo mode; normal play available after the configured starting beat when safe.

**Explicit separation:** a scene-link is a *requested starting presentation*, not the current player's authoritative savegame; it is not an invitation/password, a chat transcript, production God Mode command, or a release/promotion request.

## 2. GitHub evidence of existing KFB foundation

1. `kfb-hub/stunt-race/track-environment-lab/boot.mjs`: existing `new URLSearchParams(location.search)`; reads `world`, `seed`; changes real environment; updates URL through `history.replaceState`. This is **runtime source evidence** for a narrow existing configuration round-trip, not proof that a GPT Site currently honors a new scene-link spec. Existing browser evidence is historical; no browser ran for this job.
2. `KFB Comic Card Deck Viewer v4 (WS0)/RETURN.md` and `KFB Deck Viewer v5.dc.html`: stable `?deck=&card=` / `?deck=&page=` candidate. Book's `help_i_am_a_human` 56 cards still have unverified exact card-page mapping, so allow full source PDF page or verified spread as safe fallback.
3. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`: owner WB2, versioned modules (`MINI_SCENE_MODULE`, `ATTRACTION/INSTANCE`, `WORLD_RECIPE`, `LIGHT_PROFILE`, `MEDIA/CARD SURFACE`), manifest-based Stage/Live, world authored scene object identity, Lean Memory/PLAYER_SAVE separate from authoring.
4. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md`: existing anchor, route, entry and return semantics are the receiving intent; don't invent a new travel system.
5. `skills/chat/KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md` and `skills/chat/KFB_SURFACE_HIERARCHY_CURRENT_2026-10-06.md`: existing GPT Site is primary product; Cloudflare `kayfabizarro.pages.dev` is secondary formal mirror where explicitly needed, not a replacement or debug loop.
6. `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`: Island MVP R4 STOP, NO MVP; this design work does not restart it, authorize world changes or claim final integrated playable world.

**Unproven current products:** identity/version of the player's actual game GPT Site, whether it preserves query params end-to-end, source of each on-Site switch, exact aquarium module recipient, signed-in private viewer deep-link behavior. These require exact same-site browser proof.

## 3. Hosting, sharing and authentication research (primary docs, checked 2026-11-22)

### OpenAI ChatGPT Sites
Official: https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites
- Sites are owner-private by default; Share allows permitted audiences and, where available, **named external email invitees**. External viewer signs in with the ChatGPT account to which access was granted. They can view, not edit. Availability/account/workspace setting must be verified at actual Site.
- Public Site can be opened by anyone when public publishing is enabled, without needing to sign into ChatGPT. A Site can separately add its own application login; these are independent from host-level visibility.
- **Do not assume a URL query can override Site permission.** The receiver must be authorized; a forwarded private link does not enroll an uninvited person.
- Custom domains may be available under Site settings; they are domain plumbing, not proof of delegated custom identity control.
- The help document does **not** prove that a private Site reliably preserves all query and fragment parameters across sign-in/redirect. Verify in a non-owner browser/session with the exact intended external viewer.

### Optional alternative authentication, later
OpenAI Sign in with ChatGPT: https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt — an identity-provider option for supported contexts. Not a guarantee that the currently hosted KFB game has custom app auth.
Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/ ; one-time PIN for permitted guests: https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/ . Could be used **only on a supported domain/deployment/route explicitly configured to use Access**; DO NOT claim it simply protects an unchanged `*.chatgpt.site` Site or creates a bypass for private Site permissions. If own app domain or Cloudflare product becomes the authorized primary hosting owner, separately prove route, headers, login return, asset access and policy.
The user's term **HTX** is not established by repository/source research as a defined KFB identity provider. Treat `HTX_LOGIN_PROVIDER_UNCONFIRMED`; do not invent integration details.
OWASP redirect guidance: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html — reject user-provided external callback URLs; use allowlisted internal destinations or IDs.

**Recommendation:** for initial cousin and colleague demos use **existing private GPT Site + named viewer access where enabled** and validated scene deep links. Defer introducing another identity provider until an actual external access limitation is proven. For broader player release: Site public mode + separate app-level account only if player save/entitlements require it, or an independently authorized supported self-hosted/custom-domain deployment with real Access/OIDC integration. No identity migration is authorized by this planning request.

## 4. Design of the thin SceneLink adapter (proposal, **not** a new state owner)

### UX
- **Capture:** from existing game controls, player/Georg selects a meaningful authored configuration and clicks **Copy scene link**. In normal player mode only safe public-approved settings may be shared; **God Mode** may additionally draft private authoring links but must not leak private assets/unreleased features.
- **Open:** correct Site loads; host permission evaluated; link parsed and schema-validated; pinned released manifest resolves module/assets; existing World Studio loads world/anchor/scenelet; then applies **a permitted presentation-only preset** before first visible frame if possible. Provide visible error/nearest valid return if scene module isn't in that release.
- **Play:** full-screen experience with normal controls returned after any scripted opening; never stranded in camera lock or frozen pause. Existing PLAYER_SAVE remains authoritative and must not be overwritten by a visitor link.
- **Share:** route uses canonical existing Game Site origin, not GitHub raw/githack, not fabricated `kayfabizarro.pages.dev` Stage. If a verified Cloudflare mirror later exists, it may accept the same semantic scene preset with its own proper base URL and asset permissions.

### Proposed URL contract: two tiers (examples are **NOT LIVE**)

**Tier 1: immutable named presets, preferred for demos:**
`?kfbScene=human-book-processor&r=1`
`?kfbScene=aquarium-satire-demo&r=1`

These are human-readable *suggested IDs* only. A committed allowlisted preset registry maps them to source-backed world ID, module ID, start phase, camera/look/audio profile, revision and min compatible release. `r=1` is an authored preset revision, not implicit Git branch head. A game release without the module must say **SCENE_UNAVAILABLE_IN_RELEASE** rather than placing a substitute.

**Tier 2: share bounded view variations** (after explicit adapter proof):
`?kfbScene=human-book-processor&r=1&shot=book-front&phase=opening&look=salvage-clay&seed=HM-01`.
Only approved keys and enumerated values; no arbitrary `url`, `script`, `asset`, `manifest`, `api`, `debug`, `grant`, `god` or remote asset replacement allowed. Unknown/untrusted params ignored or rejected with a visible reason; no dynamic code, unsafe scene injection, game settings escalation, arbitrary redirects or unsafe asset fetches.

**Tier 3 later:** large user-composed configurations stored by current authorized owner as an **immutable versioned snapshot** with short opaque ID `?kfbSceneRef=<id>`. A short ID is NOT an access token to private player data, and never grants Site access. Snapshot fetch must be authorized/rate limited; either recipient can read a deliberately shareable public preset or owner has specifically granted access. Do not build this store if Tier 1 covers the two demos.

### Proposed schema `kfb.scene-link/0.1` (not existing implementation)
```json
{
  "schema": "kfb.scene-link/0.1",
  "id": "human-book-processor",
  "revision": 1,
  "release": {"channel": "published-site", "minManifest": "REQUIRED_AT_BUILD"},
  "entry": {"worldId": "SOURCE_REQUIRED", "anchorId": "SOURCE_REQUIRED", "moduleId": "SOURCE_REQUIRED"},
  "presentation": {
    "shot": "book-front",
    "phase": "idle-display",
    "lookId": "salvage-clay",
    "seed": "HM-01",
    "audioContextId": "SOURCE_REQUIRED"
  },
  "permissions": {"shareClass": "named-viewer-demo", "saveImport": false, "godMode": false},
  "source": {"bookAssetRef": "SOURCE_REQUIRED", "cardRef": null}
}
```
All `SOURCE_REQUIRED` tokens in this **design-only schema** are explicit unsatisfied references, not values a playable runtime should silently accept; real preset registry entry only promoted after exact source/manifest alignment. No fake branded/visually substituted objects.

### Resolver order / safe persistence
1. Parse URL with built-in `URL`/`URLSearchParams` after Site access is granted; apply key/type/length/enum/allowlist validation. Handle multiple keys deterministically (reject conflicts), canonicalize URL, no blind `eval`.
2. Resolve `kfbScene` against **published compatible manifest** (or explicit verified Stage for owner-only testing), not `main` or latest unreleased PR. Pinned module/asset refs are immutable at the published revision.
3. Merge `preset defaults → allowed per-link presentation overrides`; never merge arbitrary saved player data into shareable scene description. Keep **player save**, user preference, host permissions, and scene-start separately scoped.
4. Distinguish modes: `OPEN_AS_VISITOR` starts authored scene without modifying existing save; `IMPORT_TO_MY_SAVE` only after explicit visitor opt-in and already permitted progression; `RESUME_MY_SAVE` ignores link entry by explicit user choice.
5. `seed` deterministic for authored geometry/config where the current module already supports it, NOT a guarantee deterministic animation physics across arbitrary browsers. Avoid exposing unpublished content and entitlement flags.
6. Do not leak user ID, private email, save data, API key, editor tokens, auth code, raw unrestricted world patch, or private download URLs in the address. Treat the URL as public-to-anyone-with-it even if the host is private.
7. Camera/input: existing World Studio owns camera and player movement; adapter requests a named `shot` / entry anchor and releases ownership. Audio remains controlled by the existing audio mix; muted visitor still sees meaningful book page/scene.
8. `page` and `card` from existing Viewer are separate specialized reader routes; **only source-verified card mappings** can be deep-linked by card number.
9. Inactive/deleted scene uses an honest unavailable/return state with a safe place in existing game; old links preserve identity/owner, not guaranteed visual bit-for-bit renderer continuity.

## 5. Link-to-scene minimal interface, not a giant new engine

**Suggested adapter methods** (proposed names to reconcile against actual code):
- `getShareableSceneState(existingRuntimeSnapshot)` → only approved preset fields, strips private/player/editor state
- `resolveSceneLink(url, publishedManifest, allowlist)` → typed valid entry or named error, no side effects
- `enterScene(existingWorldOwner, resolved)` → asks owner to travel to existing anchor/module and apply presentation request
- `createSceneLink(canonicalSiteUrl, approvedPresetAndOverrides)` → canonical URL; copy action, clipboard result feedback; don't use a public link until host access is verified
- `restorePreviousPlayState()` → return travel/camera/input to existing owner, never a second savegame.
Use existing module registry if it actually exposes these operations; otherwise add only a tiny adapter in the real receiving owner after contract approval. No new UI chrome / generic share dashboard needed; a discreet **Copy scene link** action in existing switch UI is enough.

## 6. WS0 Lead work order · bounded research/preparation, can be delegated

**Task owner:** WS0 Lead, concept/design and source routing. **Receiver:** current Game Site / WB2 owner. **Execution mode:** BOUNDED RESEARCH + HANDOFF, no game build or publication in this task. **Builder:** WS0 or one WS0-spawned designated Claude researcher (no runtime writes). **Integration Tester:** existing independent QA when there is actual implementation. **Independent Critic:** source/UX/permission review on proposed contract. **Production Guard:** existing KFB production routing; stops only outcome-blocking seam. **Georg gate:** no product acceptance until a real link can be opened by a named external viewer.

### Required steps
1. **Source inventory FIRST:** from current owning GitHub branch and **existing actual Game GPT Site project**, identify every existing switch, default, URL/deep link, runtime-state setter, module/scenelet ID, source for Aquarium/GTA-style module, book module contract, God Mode/Scene Composer state, input/camera/movement owners and current/target published manifest. Record `VERIFIED_SOURCE`, `PLANNED`, `MISSING` per seam and exact SHA/routes.
2. **Choose ONE recipient game surface**. If two products are indeed separate owner-sites today, don't silently create an all-in-one host: specify two origin-specific share URLs implementing the same semantic preset contract when each owner adopts it, with clear future World Studio integration. Avoid new Site or universal engine.
3. **Produce 2 named authored example preset records** (book and aquarium) **only from real module sources**. If Aquarium source is still missing, save its record as a blocked fixture without usable `moduleId`, not a fake playable example. Book can remain design-only until WSB/Claude module exists.
4. **Build/propose a small serializer/resolver implementation seam** using existing switch owners, with schema, versioning, state precedence, deterministic seed, enum validation, explicit permissions and failure modes.
5. **Design copy flow and QA matrix**: owner vs invited external viewer, private vs public, signed-in/signed-out, permission denial, URL preservation after login, switch round-trip (capture→copy→fresh browser→same approved state), unknown preset/revision, schema-mismatch, saved progress untouched, back/forward, mobile/touch, old link after new build, hard reload and direct navigation. Verify auth redirects only on actual host; do not treat docs as implementation proof.
6. **No speculative login provider build.** Confirm available ChatGPT Site sharing control on the **current** Site. Separately write optional future external identity plan only if first viewer test is blocked. `HTX` is unresolved, not an assumed supported IdP.
7. **Return** exact source map, one working source-backed share roundtrip as a future authorized implementation target, two example launch plans, and one next engineering gate. Existing Site publication remains a separate verified owner operation.

### Acceptance targets for **later implementation** (not completed)
- A test link on a single actual deployed Site is opened in a fresh non-owner profile, with explicit host permission; the intended module/shot/look/phase is visibly correct.
- User may exit scene and continue/return; player save unaffected until opt-in; all inputs restored.
- Existing switch UI → copied link → fresh browser → same named scene and allowed settings **round-trip**; exact source/preset/release revisions recorded.
- Negative tests prove invalid module, poisoned asset URLs, unsupported phase and private viewer denial do not leak data or open a generic fallback.
- Browser proof of actual book and actual aquarium **only when real source assets exist**. Measure fps/startup, and show screenshots for desktop and mobile. Do not invent test counts.
- Direct `https://kayfabizarro.pages.dev/…` Stage link linked from the KFB Hub **only if formally required and actually published/verified**. GPT Site remains primary under existing site-first policy; no Cloudflare substitution.

## 7. Design verdict and one next gate

**Design verdict:** Do a small **preset ID → published manifest → existing scenelet/shot/look switch** adapter first. This works for personal demo invitations and can later expand into authored/player-composed snapshots; avoid large auth/backends before the two real use cases prove that they need them.

**One next gate:** **WS0 validates the actual recipient Game GPT Site and current switch/module ID inventory, especially the Aquarium owner, and returns a source-backed two-scene link contract.** No runtime/Stage authorization by this document.

**References:** `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, `skills/chat/concepts/KFB_HUMAN_BOOK_PROCESSOR_WS0_WSB_CLAUDE_EXECUTION_BRIEF_R1_2026-11-22.md`, `skills/chat/concepts/KFB_HUMAN_BOOK_PROCESSOR_RETURN_R0_2026-11-22.md`.
