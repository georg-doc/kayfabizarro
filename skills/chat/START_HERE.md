## 2026-11-23 · KFB SOP R1 · ONE ENTRY FOR EVERY SESSION (V-2097)

**Read first, before anything below:** [KFB_SOP_R1.md](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/KFB_SOP_R1.md) (the single maintained version, on the register mirror branch; this block is only a pointer).

- Precedence: Georg's words → hard guardrails → canon/register → SOP → specs → local habits.
- One loop: inventory → mirror the intent in one sentence → target as image (existing asset/genre refs; webchat only where a look is missing, fetched by WS0) → one owner builds → craft gates in code → silent blind critic (≤ 5 rounds, stop after 2 without improvement) → WS0 → Georg.
- Brief form: ABSICHT · GENRE · OWNER · ZIEL · FERTIG · GRENZEN · DETAIL.
- Blind-critic matrix A–H: [qa_matrix.r1.json](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/tools/qa_matrix.r1.json), prompt [CRITIC_BLIND_PROMPT.md](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/tools/CRITIC_BLIND_PROMPT.md). PASS = no axis < 7, mean ≥ 8.
- Texts never from scratch (Georg's lines, card texts, golden samples); [anti-samples](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/META_TEXTE/ANTI_SAMPLES_R1.md).
- Missing 3D models: WSB via official Meshy MCP, [workflow](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/TOOLS/MESHY_MCP_WORKFLOW_R1.md) (V-2099).
- Register authority: `DECISIONS.md` V-numbers on the same mirror branch. Where this router conflicts with the SOP, the SOP wins.

---


## 2026-11-28 · WSA KICKOFF → WS0 · ARENA-REZEPT R1

**KANDIDAT · RENDER-ABNAHME OFFEN.** [Kickoff Draft PR #172](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/172). Drei Rezeptvarianten auf dem Originalstadion. Der Direktstart ist zusätzlich als [isolierter V14-Hotfix](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b2a00ca698baa22859117d0c76cdf52546349788/docs/kickoff/RETURN.md) vorbereitet. Die private Site führt weiter V14 mit Aufrufparameter. Nächster Schritt im vorhandenen Owner-Lauf ist der Bildsatz mit zwei Kameras pro Rezept aus einem Build mit dem verifizierten Medienbestand. Anschließend erstellt WS0 die Abnahmekarte. Kein Stage-Eintrag ohne geprüften Spielbuild.

---


## 2026-11-27 · GEORG → WS0 → WS1 · CYMATIC DICE RUSH / SHARED RACING SYSTEMS

**IMPLEMENTATION REQUESTED · CONSOLIDATED INTAKE · NOT BUILT.** [Complete WS0 handoff and WS1 execution sequence](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/167#issuecomment-7222692233) in the existing active racer issue #167. WS0 schedules WS1 via the existing WS0-only dispatch channel and remains sole stem integrator; HUD #130 / WSA Audio #168 keep their seams. Resolve connector stem `game/integration-r2 @94c87df1b1e566335fca86e48020a4095860e1ef` vs comms N-325 mention of @3683fa95 before branching; do not interrupt current Kicker/Aquarium work. A: existing car + elastic sphere on one shared high-speed course; B: procedural cymatic/polyhedral biomes, existing Sky/Atmosphere and FX; C: actual Bubble FM stems, W6/W20, safe control/morph; D: clean HUD + original Thorn expanded cockpit, DJ Freeze; E: later card-deck racer/softbodies/expanded track modules. No second runtime/clock/audio owner, no new human pre-gate, no automatic merge/Live. Source index retains all earlier decisions and tests. 0 code changes, 0 new runtime tests, no deployment. Next: WS0 resolves branch and dispatches A to WS1; WS1 returns actual playable evidence.

---


## 2026-11-26 · WS0 · CLEAN HUD R2 / ICON-FIRST GAMEPLAY

**GEORG DESIGN DIRECTION · DOCS ONLY.** [Existing HUD owner #130 addendum](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/130#issuecomment-7203566972). Normal HUD uses clean icons/buttons, Primary/Secondary + contextual interaction; no permanent weapon/car/option 3D hero shots. Portrait and selected expressive elements optional. Real hero previews in flyouts, Thorn hardware in expanded mixer. Keep createHudV6, loadout/hostKeys/audio ownership and existing assets; responsive layout, no stretched raster chrome. Earlier hero-in-default-HUD direction superseded, no historical acceptance rewritten. Next existing owner: actual action cluster + weapon/vehicle flyout, desktop/mobile, existing Thorn seam unchanged. 10 proposed NOT_RUN, no runtime/Stage/Live/merge. Game snapshot `game/integration-r2 @ 94c87df1b1e566335fca86e48020a4095860e1ef`.

---


## 2026-11-26 · WS0 · CLEAN HUD / THORN HARDWARE MIXER DESIGN CORRECTION

**GEORG DESIGN DIRECTION · DOCS ONLY.** [Racer #167 correction](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/167#issuecomment-7203508206), [existing HUD owner #130](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/130#issuecomment-7203510368). No Aquarium/Submarine requirement for Bubble FM; clean, theme-flexible HUD; realistic original Thorn hardware as mixer target, responsive structural layout rather than scaled raster panels. Keep existing controller/state/audio owner and prior functional cockpit/pause/morph contracts. Thorn original controls isolated before import; no full demo or second context. First proof compact radio + real expanded control at desktop/mobile, existing stem-load/pulse gate retained. Proposed checks NOT_RUN, no runtime/Stage/Live/merge. Earlier AquaCare aesthetic suggestion superseded for this slice; historical accepted assets preserved.

---


## 2026-11-26 · WS0 · CYMATIC DICE / BUBBLE FM DIEGETIC STEM COCKPIT

**PROPOSAL · DOCS ONLY.** [Racer owner #167 addendum](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/167#issuecomment-7203455934) combines verified Thorn source controls (InstaLanding #486) with existing Bubble FM mixerControls, one audio host and shared racing physics. One expanded cockpit, same radio state: local gameplay pauses while music audition continues, style mix, actual stem selection and safe sphere/die morph are separate axes. No new style authority, no second engine, no multiplayer pause, no live terrain-collider changes. Existing stem load/pulse and car/sphere gates retained; then one original isolated Thorn control → actual mix → safe body handoff/resume. 12 proposed NOT_RUN, no implementation or Stage/Live. Game snapshot `game/integration-r2 @ 94c87df1b1e566335fca86e48020a4095860e1ef`.

---


## 2026-11-26 · WS0 / WSA AUDIO · BUBBLE FM REACTIVE MUSIC / RUBBER RUSH + RPG RACER

**SOURCE_CHECKED · PRODUCT DIRECTION / DOCS ONLY.** [Additive racer owner brief #167](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/167#issuecomment-7203374002), [WSA Audio cross-reference #168](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/168#issuecomment-7203376187). Existing Suno Bubble Mixer, one audio host/pulse, ride songkarte and motion telemetry retained. Manual/reactive/opt-in guided ride proposed, one active musical clock, real telemetry drives stem arrangement; audio drives visual presentation only. Music-skill v0.9.3 game layer export verified in docs, optional offline candidate, rejected synth mixer not revived, existing Atlas-first policy unchanged. First gate: actual existing stem load in receiving owner, active mixer pulse to existing HUD and one world visual, manual mode preserved. Current game `game/integration-r2 @ 94c87df1b1e566335fca86e48020a4095860e1ef`. 18 checks NOT_RUN, no new runtime/assets/Stage/Live/merge.

---


## 2026-11-26 · WS0 / WSA AUDIO RESEARCH INTAKE · SFX-SKILL R0

**SOURCE_CHECKED · PROPOSAL ONLY.** [Existing game/audio owner issue #168](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/168) contains donor audit, Atlas-first transfer candidates, provenance requirements and additive Return/changelog. Upstream `owoevan-dev/sfx-skill @ 56d2136d2f794402feefa82786bc94a0e02bf73f`, v0.3.0, MIT code/docs, upstream CI 7/7 jobs successful. Editable offline sound layers and reproducible variants, measured loops and per-source exports; optional music-skill/Surge XT. Preserve existing WSA Audio ownership and V-1989/V-448 production constraints; no new synthesis approval implied. Next: one rights-cleared Atlas recording, original versus four edited variants, isolated technical and listening comparison before any policy-compatible native cue integration. No installation, downloads, assets, runtime changes, KFB tests, Stage/Live or merge.

---


## 2026-11-26 · WS0 RESEARCH INTAKE · INSTALANDING R0 / KFB + DOCCHECK

**SOURCE_CHECKED · PROPOSAL ONLY.** [Hub owner issue #486](https://github.com/georg-doc/kayfabizarro/issues/486) contains ranked UI/motion/learning donors, license/dependency findings, additive Return/changelog and next gate. Upstream `RayVelez27/instalanding.ai @ 011a0defe0c189d9cbed82999bed13024f9ea76a` (MIT root, individual third-party rights pending). Prioritize Jelly Squeeze, Thorn hardware controls, Driving UI, Coverflow and Medura anatomy interaction; preserve existing KFB and DocCheck owners/skins/data. No asset or runtime import, 0 runtime tests, no Site/Stage/Live. Next existing owner: isolate one donor, verify rights, compare against existing module and measure native integration. No new runtime owner or human pre-gate.

---


## 2026-11-26 · WS0 INTAKE · INVISIBLE HANDSHAKE R27.1 / RULE LAB GPT SITE

**GEORG PROCEED ON LAB DIRECTION · DOCS ONLY.** [R27 build brief + additive return](https://github.com/georg-doc/kayfabizarro/blob/b7ede2119b9c80b74f8d3444195ebfb8595f218a/games/invisible-handshake/R27_RULE_LAB_SITE_BUILD_BRIEF_2026-11-26.md) · [existing draft #475](https://github.com/georg-doc/kayfabizarro/pull/475). WSA implements next in coordination with WS0; Georg proposes reusable narrated boardgame laboratory: A Quick Claim / B Tower Circuit rotating spoke access / later C hybrid, one R24 table, play/learn/demo/settings/headless compare/print, EN then DE. Existing R07 Site project `appgprj_6afc38fcfc5c8191beb9ffc978208e6c` located; current deployment/URL unverified, recover before publishing, preserve legacy. No duplicate runtime/Site, no new game tests (16 NOT_RUN), no Stage/Live. WS0 next: recover Site and exact R24 source, A/B legal replay + sim parity, then playable comparison. R27.1 adds D1 mobile die obstacles (hard bypass vs fourth-D6 challenge) and D2 optional 0–3 intermediate fields, separately testable after A/B; 10 additional checks NOT_RUN. No new preliminary gate. Meta later. Existing #166 is receiving intake.

---


## 2026-11-26 · WS0 INTAKE · INVISIBLE HANDSHAKE R26 / CUT & PLAY QUICK CLAIM

**PROPOSAL · DOCS ONLY.** [12 concept slides + additive Return/changelog](https://github.com/georg-doc/kayfabizarro/blob/e84c3e64439002235d0f7dc2038d48a701150dd1/games/invisible-handshake/R26_CUT_PLAY_QUICK_CLAIM_CONCEPT_SLIDES_2026-11-26.md), [existing Draft PR #475](https://github.com/georg-doc/kayfabizarro/pull/475). R23/R25 source recovered, R24 scene donor [handover](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f65b69a74c9894726cb1ba6e52783fa3367f041c/table-diorama/HANDOVER_WS0_R24.md); six seats, center card, deliberate three-die move+turn, optional claim, card-centered paper-first, 1–6 humans/bots proposal. Preserve original Freestyle, R19, R24 and R25; no new runtime. WS0 receives via existing #166; next existing real-card R25 trial then R24 bridge; 12 NOT_RUN, no Stage/Live; meta progression deferred. Exact dice appearance/naming and balancing open.

---


## 2026-11-26 · WS0 INTAKE · LUDOWALA R0 / BOARD-GAME META

**DOCS ONLY · SOURCE-CHECKED · PROPOSAL.** [Owner Issue #166](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/166) holds the research, additive changelog and Return: Ludo/Snakes rules, show versus actual rule effects, progression, daily rewards, private rooms/rejoin and scene separation. Source snapshot `game/integration-r2 @ 94c87df1b1e566335fca86e48020a4095860e1ef`; refetch before implementation. Extends [#165 Schacharena](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/165), Kicker/Kickoff and #158; no new runtime owner, no code/assets copied, no game tests (16 NOT_RUN), no Stage/Live. Next WS0: one legal capture/goal through shared existing arena show adapters with rule-neutral replay; no new human gate. Public documentation conflicts on defaults/monetization noted; live play unverified. Owner issue is the Hub active worklist.

---

## 2026-11-25 · WSA → WS0 · DECK-LAUF R0

**Geprüfte Bausteine · Merge bei Georg.** [Arena PR #30](https://github.com/georg-doc/KFB-Combat-Arena/pull/30), `wsa/deck-lauf-r0 @ 5c4af56a38f2f514c2f699ef3eb7bded3aa63f83`. [Return](https://github.com/georg-doc/KFB-Combat-Arena/blob/5c4af56a38f2f514c2f699ef3eb7bded3aa63f83/RETURN_DECK_LAUF_R0.md): Inventur A/B gegen den Stamm, Mentalmodell und zwei eigenständige ES-Module für Rundenablauf und Original-Monstermessung. 12/12 isoliert, 72/72 Arena. Als erster Einzelkartenfall für WS0 ist `help_i_am_a_human/3` mit `mensch-symbiose` belegt. `/1` beginnt das vollständige Deck und hat noch keine Einzelsaat. Georg entscheidet den separaten Quellenmerge mit `[CF-Pages-Skip]`. WS0 übernimmt später in `game/integration-r2` links vom MiB-Turm. Keine Stage-Abnahme. Die früher automatisch ausgelösten Branch-Previews sind im Return dokumentiert.

---

## 2026-11-24 · WS0 INTAKE · CARD WORLDS R0 / WORLD EVERY DAY

**SOURCE-CHECKED · DOCS ONLY · PROPOSED.** Active game owner WS0/Integration-R2: [Issue #158](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/158) contains full donor audit, seed/recipe design, InfiniteRooms portal integration, daily/standalone/main-world scenarios, 18 NOT_RUN checks and Return/additive changelog. Production snapshot `game/integration-r2 @ e75112a99ab6ef9fa6177ca3de58a2b1d3954359`; refetch before building. Upstream [World Every Day @ 1ce9ce7](https://github.com/acher249/world-every-day/tree/1ce9ce7adc95aa5d7cb2e3eb329200a82695d4ea): semantic JSON → art direction → panorama → Marble SPZ → landmark mapping. Native deterministic KFB recipe first; optional SPZ visual backend only with rights/budget/renderer/physics proof. Existing card registry, InfiniteRooms host and tuerPortal owners retained; relates to #127 and #155 without superseding their gates. No runtime changes, no paid calls, no tests, no Stage/Live. Next: one actual card recipe through native portal, safe return + reload. Hub active worklist is the owner issue; no public mirror needed for docs.

---

## 2026-11-24 · AQUACARE GTA R4 · CURRENT CREATIVE WRITER BRIEF

**R2 #484 and R3 #485: EXTREME FAIL, closed/unmerged, all proposed replacements quarantined.** No reuse, import or voice rendering. Georg explicitly requests a fresh complete English text set: short, precise, natural, genuine wit; evil mastermind, gangster fish, KFB meets GTA; no forced jokes or stop cascades. [R4 Writer Brief — complete self-contained packet](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/META_TEXTE/AQUACARE_GTA_R4_WRITER_BRIEF_2026-11-24.md) supersedes all R3 writing instructions. [R3 Postmortem](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/META_TEXTE/POSTMORTEM_AQUA_R3_EXTREME_FAIL_2026-11-24.md). Original 389 IDs and seven Golden lines remain the source. GTA research is background, not approved transfer hypotheses. Existing WS0/Aqua text owner; no new runtime or Stage. Next: fresh writer delivers the complete new candidate, no mandatory intermediate human gates. Runtime source remains unresolved.

---


## 2026-11-24 · WS0 INTAKE · FRIENDLIES SOCCER / KFB CARD ARENA + DOCCHECK CELLULAR ARENA

**Status: DOCS_ONLY · UNMERGED DRAFT · no runtime, no Stage/Live.** Existing KFB gameplay owner: georg-doc/KFB-Stunt-Car-Race, target game/integration-r2. Separate WS0 planning Draft [PR #156](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/156) on branch planning/friendlies-soccer-kfb-doccheck-r0-2026-11-24.

- [Full handoff / phases / medical and card concepts](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/friendlies-soccer-kfb-doccheck-r0-2026-11-24/docs/konzepte/friendlies-soccer-r0/WS0_HANDOFF_2026-11-24.md)
- [Technical contract + 50 proposed NOT_RUN tests](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/friendlies-soccer-kfb-doccheck-r0-2026-11-24/docs/konzepte/friendlies-soccer-r0/TECHNICAL_CONTRACT_AND_TEST_PLAN.md)
- [Return + additive changelog](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/friendlies-soccer-kfb-doccheck-r0-2026-11-24/docs/konzepte/friendlies-soccer-r0/RETURN_AND_CHANGELOG.md)
- [ArenaSkin / HyperNorm background donor audit](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/friendlies-soccer-kfb-doccheck-r0-2026-11-24/docs/konzepte/friendlies-soccer-r0/ARENA_SKIN_BACKGROUND_DONOR_AUDIT_2026-11-24.md) — current KFB multi-surface canvas texture donor verified; actual Friendlies background implementation still UNKNOWN; 14 proposed checks NOT_RUN.

Georg's direction: reuse Patch Friendlies original soccer/controller, AI, 2v2 and characters. Add verified KFB Rig_Medium/Rig_Large, existing Mixamo and FrankenStein actors with real Soccer Pack kick/motion, without making new ball physics. KFB court = **one actual card OR entire original 2×2 FOUR-card sheet**, both canonical CARD_AR **1.74:1**, source crop order intact. DocCheck version = restrained membrane/signal/receptor cellular arena reusing DocCheck branding/medical review, not forced blood-cell soccer. **Known discrepancy:** game src/cardImage.js uses 1.79, canonical CardBuilder 1.74; do not retune unrelated game code. Raw PDF page ≈1.79265; never stretch.

Soccer Game Pack.zip found privately in Dropbox, contents not inspected; real Patch source/remix permissions and hooks UNVERIFIED. Actual gameplay/browser tests 0, screenshots 0, Stage 0, 50 planned tests NOT_RUN. **One next gate:** WS0 source/rights + isolated real Patch donor and a source Soccer Pack kick; then one KFB actor in actual unchanged 2v2. DocCheck sim-blood/doc-animation owners unaffected. No automatic merge/promotion.

---

## 2026-11-22 · KFB REALITY REMIX COMPLETE WS0 CHAT META HANDOFF

Georg's whole Reality Remix / Hackable Multiverse / Creator Commons conversation is consolidated in the current game owner **Draft [PR #155](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/155)**, review branch `planning/reality-remix-multiverse-r0-2026-11-22`:
- [Full WS0 Meta Summary](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/reality-remix-multiverse-r0-2026-11-22/docs/konzepte/reality-remix-r0/META_HANDOFF_WS0_2026-11-22.md) — product vision, Gray Swan/adversarial QA angle, playstyle loops, MiB/NPC/world reactions, no-code/MCP/Git, external/Patch asset search, CC/credits, versions, community forks, additional proposals and R0-first roadmap;
- [Direct WS0 Start Prompt](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/reality-remix-multiverse-r0-2026-11-22/docs/konzepte/reality-remix-r0/WS0_EXECUTION_PROMPT_2026-11-22.md);
- [Source/Evidence Index](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/planning/reality-remix-multiverse-r0-2026-11-22/docs/konzepte/reality-remix-r0/SOURCE_EVIDENCE_INDEX_2026-11-22.md).

Owner documentation is in `georg-doc/KFB-Stunt-Car-Race/docs/konzepte/reality-remix-r0/`. Current integration branch snapshot as of this handoff: `game/integration-r2 @ 9cfd61a6e83d9786b379ec35ad5591fa597763df` (**re-fetch** before execution); PR docs checkpoint `0b364921358257286b4bbe6531807fa62d1ee178`. This is **DOCS_ONLY**: R0 Runtime/browser tests 0, no screenshots, no Stage/Live, no merge, no global CC license. **One next gate:** named existing WS0/Integration-R2 writer proves real Gameplay event → existing HyperNorm visual interpretation → persistent/reversible Save/Reload/browser evidence. The separate WB2 R4 NO MVP/STOP is unchanged; no new owner or additional human gate for this transfer.

---

## 2026-11-22 · REALITY REMIX COMMONS DISCOVERY + COMMUNITY FORKS

Georg extends [KFB Reality Remix Draft PR #155](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/155): searchable KFB Asset Librarian + external Patch/3D candidate previews and native gameplay replacements, player-owned per-component media/code licensing, automatically inherited creator credits, optional share/fork/upstream permissions, opt-in community versions that may become curated KFB defaults ONLY after source/CI/owner/human gates. See `docs/konzepte/reality-remix-r0/{CREATOR_DISCOVERY_PATCH_LIBRARIAN_R0,CONTRIBUTOR_COMMONS_LICENSES_R0,COMMUNITY_EVOLUTION_LOOP_R0,DISCOVERY_COMMUNITY_QA_PLAN_R0}.md` on game review branch `planning/reality-remix-multiverse-r0-2026-11-22` at verified head `4e9b63efd0ed87596b4fdb9467292250bb75a208`. Docs-only, NO runtime, NO release, NO public CC license, 20 proposed new QA cases all NOT_RUN. Current gameplay→HyperNorm persistence proof gate unchanged; no new Registry/runtime owner.

---

## 2026-11-22 · CREATOR CREDITS / PROVENANCE ADDENDUM · SAME KFB REALITY REMIX OWNER

Georg extends [KFB Reality Remix Draft PR #155](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/155) with an automatic Creator Credits / Licenses / Provenance design: all **15** existing `src/data/credits/kfb-credits.r1.json` editorial entries are referenced, **seven source-scoped** CC0/MIT/mixed/private/idea evidence records are indexed, and Creator-Pack export carries pertinent full notices even when the player opts to hide the visual ending credits. Existing source Credits, Audio License Evidence and third-party NOTICE/Licenses remain authoritative; no false redistributable status for private or unclear assets. Source files on same game branch under `docs/konzepte/reality-remix-r0/CREDITS_*.{md,json}`. 16 proposed provenance tests NOT_RUN. No new runtime owner, no public CC license, no Stage/Live claim. Next gate **unchanged**: existing game event → HyperNorm persistent/reversible browser proof; then Creator-S0 exported credits test. Do not confuse this game with the separately stopped Four-Island WB2 R4.

---

## CURRENT ADDITIVE KFB PRODUCT DIRECTION · 2026-11-22 · REALITY REMIX MULTIVERSE

Georg extends **PULL, DON'T GATE** to a freely hackable, persistent, shareable game-world: **Explore → Play → Create → Remix → Share → Explore**. No mandatory funnels/unlock gates. Real player acts trigger emergent NPC/social/system/media responses; voluntary forks/crossovers may mix incompatible source worlds. Reuse existing game and source owners; no second runtime or invented canon. Current **KFB-Stunt-Car-Race** owner, target `game/integration-r2`, Draft PR [#155](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/155), work branch `planning/reality-remix-multiverse-r0-2026-11-22`:
`docs/konzepte/reality-remix-r0/{BRIEF,CONTRACT,TEST_PLAN,RETURN,CHANGELOG}.md`.

State: **GEORG PRODUCT DIRECTION CAPTURED · DESIGN/CONTRACT ONLY · NO IMPLEMENTATION/TESTS/STAGE**. First gate to WS0/Integration-R2 single writer: one real gameplay event → existing HyperNorm host → reversible persistent interpretation + native browser/reload evidence. Existing MiB event/world event gate, Save/Chronik/NPC-Memory, Cards, HyperNorm and script/asset owners retained. This does not revise or restart the separate Four-Island WB2 R4 STOP/NO MVP state.

---

## ADDITIVE WS0 INTAKE · 2026-11-04 · BLACK INK BLOB SERIES (DOCS/PROVENANCE ONLY)

Georg visually accepted 18 Black Ink Blob PNG sheets (nine 12-character series). WS0 owns prompt/character curation; verified current WS1 `game/inkblobs-r1` / private atlas (72 actors) remains runtime recipient. Candidate contract: `media/2D_Assets/KFB_Custom/WS0_BLACK_INK_BLOB_SERIES/README.md`; intake issue **#466**. 18 original PNG bytes were locally inspected but **NOT committed**; 108 sprite crops are review candidates with 48 boundary-risk flags. One real source character was visually isolated. Next gate: WS0/Asset Librarian import **one** safe six-pack and WS1 show one actual hit/bounce/ink collision proof. No new renderer/runtime owner, no auto-merge, no Stage/Live claim. The WS0 DECISIONS register remains the V-number authority.

---

## CURRENT ADDITIVE DECISION · 2026-10-12 · WORLD MONUMENTS01 CLAUDE DESIGN PASS / TUNE LATER

Georg has accepted the uploaded **WORLD MONUMENTS01 Claude Design session cut r1** as **PASS · TUNE LATER** for the next Claude Code / WSA implementation intake.

Binding handoff:
`tools/img2threejs/docs/WORLD_MONUMENTS01_CLAUDE_DESIGN_PASS_RETURN_2026-10-12.md`

Accepted source:
`tools/KFB_WORLD_MONUMENTS01_CLAUDE_DESIGN_SESSION_CUT_2026-10-12_r1.zi`
at upload commit `7ea1385ac5cd3b7092407ad527baf98315b4c919`.

Owner remains the existing Landmark / img2threejs authoring lane with current OSM / Travel / Race / Audio owners unchanged. Next executor is **Claude Code / WSA**: inventory the actual session cut, show source objects in isolation, reuse verified donors/modules, then implement one bounded receiving slice. **Tune later is non-blocking.**

This is human design/handoff acceptance only — no new Runtime, Stage, public-verification, merge or Live claim.

---

## CURRENT ADDITIVE DECISION · 2026-10-08 · VOICE REQUIRED IN NEXT RUNTIME MVP AFTER A/B

Georg has authorized the KFB ChatterBox Voice Layer as a required acceptance seam for the **first runtime MVP slice explicitly authorized after the current Four-Island Story Vision A/B gate**.

This does **not** authorize R5 or runtime work inside the current visual-only design task.

Binding route:
`skills/chat/KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md`

Voice integration prep:
- Draft PR #379;
- branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`;
- current evidence head `5e115d7ea5e416c613312370eb319045ced58eb4`;
- S1 canonical pool adapter: **13/13 PASS** against current `chatter-phrases.js`;
- 166 stable source-backed voice records;
- no second dialogue owner or AudioContext.

Minimum later runtime proof:
- source-backed Dystopia + Utopia + Protopia speakers;
- bubble remains authoritative/readable muted;
- valid silence preserved;
- KFB Audio remains ducking/mix owner;
- static/Whole-or-fragment route + browser fallback;
- one real Golden-Journey Social Call through an accepted curated voice asset.

Current world-design gate remains:
**Four-Island Story Vision R1 → Georg A / B / FAIL**.

---

## CURRENT DESIGN RECOVERY OVERRIDE · 2026-10-08 · FOUR-ISLAND STORY VISION R1 AUTHORIZED

Georg has authorized **story recovery + visual world direction only** after Island MVP R4 failed.

R4 remains:
- **STOPPED**
- **NO MVP**
- `F-R39 = FAIL`
- **NO GOLDEN BASELINE**
- no repaired R4;
- no R5;
- no runtime / geometry fan-out.

Recovered story SSOT:
`skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`

Current visual-design brief:
`skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md`

Current next executor:
**Claude Design · visual world-direction only**

Current product decision:
Create exactly **two visual/spatial interpretations A/B of the same recovered four-island story**:
- KFB Town;
- Dystopia;
- Utopia;
- Protopia.

Do not invent replacement lore.
Do not turn proposal-level Life-Tree / six-sector / ring-road ideas into canon automatically.
Do not use generic SVG/flowchart output as the visual product.
Source families must be shown in isolation before integration into concept boards.

Required human gate:
**Georg: A / B / FAIL**

No implementation is authorized by this design task.
Only a later explicit Georg instruction after the visual gate can authorize a build blueprint or geometry.

---

## CURRENT OVERRIDE · 2026-10-08 · KFB ISLAND MVP R4 STOPPED · NO MVP

R4 is stopped.

Authoritative fail state:
- Draft PR #348 head: `0a8240b83d4fbfdb69cdba47b812e618cc5cd897`
- `F-R39 = FAIL`
- **NO GOLDEN BASELINE**
- failure class: **WORLD_MODEL / COMPOSITION_SYNTHESIS_FAILURE**
- no repaired One-Shot
- no further runtime fan-out
- no merge / Live promotion.

Authoritative Return:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/R4_FAIL_RETURN_2026-10-08.md`

Current Postmortem:
`skills/chat/recovery/POSTMORTEM_ISLAND_MVP_R4_WORLD_MODEL_SYNTHESIS_FAILURE_2026-10-08.md`

Key process finding:
The Frozen Matrix v5 successfully prevented feature loss, but it did not prevent a repeated, already-documented Micro-Storytelling / relation failure. The same failure class existed in the 2026-09-20 “Die Szene, die keine war” Postmortem: bridge without destination, buildings without social relation, objects at coordinates instead of a network of reasons.

Do not treat this as a request for a larger Story specification.
Do not start R5 or a repaired R4 automatically.
Do not ask Georg to restate the product vision.

Any future geometry requires a new explicit authorization after a cheap world-model/composition gate.

Binding engineering contract remains preserved:
- Frozen Matrix operationalVersion **5**
- 44 REQUIRED / 13 STRONGLY INCLUDE / 7 OPTIONAL PROOF
- existing technical salvage remains evidence only, not product PASS.

All older READY / runtime-paused / Recovery-Lead / previous One-Shot routing below is historical where conflicting. This R4 STOP state wins.

---

## ADDITIVE RESEARCH ROUTE · 2026-10-08 · KFB 3D SHADER / INSPECTOR DONORS (NON-RUNTIME)

The new AI Game Art Academy discussion surfaced a separate **KFB production reuse research** lane. This is **not** the Academy implementation and **not** a new material/World owner.

Existing owner/branch: KFB Surface / Material Language · `planning/hybrid-baked-clay-texture-architecture-2026-10-07`.

New branch research records:
- `skills/chat/research/KFB_3D_EDITOR_SHADER_INSPECTOR_DONOR_AUDIT_2026-10-08.md`
- `skills/chat/research/KFB_3D_WORKFLOW_RESEARCH_TEST_REPORT_2026-10-08.md`
- `skills/chat/research/KFB_3D_WORKFLOW_RESEARCH_RETURN_2026-10-08.md`

Donors: `threlte/three-inspect`, `RhythrosaLabs/webgl-studio`, `takahirox/tsl-node-editor`, `Design0r/shaderpass`. Source inspected, **NOT VISUALLY ISOLATED / NOT TESTED / NOT ADOPTED**. Existing K1/H0 Golden, K2/v10, surface A–E material comparison and current World R4 STOP remain binding. The 3D AI Classroom is a UX donor for separate Academy planning only; its legacy backend is rejected for direct reuse.

Next conditional gate: isolated existing-material-lab inspector proof; **no WB2 runtime writes, no new editor, no Stage/Live promotion** without an explicit Georg go-ahead.

---

## CURRENT RECOVERY INDEX · 2026-10-07 · WEB-CHAT IDEATION

For recovery of the 2026-10-07 design work spanning Asset Librarian/external 3D MCP, textures/materials, World Pulse, Cube/MacroCell, Build/Destroy/Repair, Paper/Facade, Threshold grammar and Oxijolt-derived Physics Acceptance/Test Architecture, read:

`skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md`

This is a routing/recovery index only. Named project owners/branches remain authoritative for implementation.

Oxijolt donor note:
`skills/chat/recovery/KFB_OXIJOLT_PHYSICS_ACCEPTANCE_DONOR_2026-10-07.md`
Classification: **acceptance/test-architecture donor only · no current runtime adoption**.

---

## SUPERSEDED ADDITIVE OVERRIDE · 2026-10-07 · ISLAND MVP MATRIX v4 · STATEFUL THRESHOLD DOOR · INCORPORATED INTO v5

Georg added one bounded Strong-Include proof without changing REQUIRED acceptance scope.

Current operational matrix:
- **44 REQUIRED** — unchanged;
- **13 STRONGLY INCLUDE** — adds **F-S13 State-dependent Threshold Door / Paper-Facade portal proof**;
- **7 OPTIONAL PROOF** — unchanged;
- **operationalVersion = 4**.

F-S13 intent:
- one source-backed freestanding or Paper/Facade threshold;
- base/locked state = ordinary local pass-through, no realm change;
- unlocked/revealed state = existing portal/instance/realm routing or deliberate controlled portal target;
- walking around the facade remains in the current world and may expose the cardboard/stage construction;
- threshold consumes authoritative progression/world state and never becomes a second progression/world/portal owner;
- save/fresh reload preserves the authoritative threshold state.

This is **STRONGLY INCLUDE**, not a 45th REQUIRED row. Full key/quest/realm progression remains outside first-Island MVP scope.

Binding matrix files remain:
`skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.{md,json}`

---

## SUPERSEDED OVERRIDE · 2026-10-07 · FINAL ISLAND MVP ONE_SHOT v3 READY · SUPERSEDED BY v5

The binding Work/WSA brief and Frozen Matrix were hardened after an independent Coworker sanity read.

Binding final brief:
`skills/chat/WORK_WSA_ISLAND_MVP_ONE_SHOT_FINAL_2026-10-07.md`

Operational Frozen Matrix:
`skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.json`
**operationalVersion = 3**

Additional required donor-read:
`skills/chat/recovery/KFB_OPEN_WORLD_VISUAL_TERRAIN_LAB_DONOR_FINDINGS_2026-10-07.md`

New binding refinements:
- mandatory **Georg Visual Product Gate after Phase 3**: 4–6 screenshots + one ≤30 s clip, decision PASS/FAIL only; no Phase 4 until PASS;
- known Track Core donor facts are persisted: 60° STANDARD-arm roundabout refusals, missing T-junction in v0.12, defective plate fallback forbidden;
- performance PASS requires visible focused window on target GPU with no parallel meaningful GPU load; otherwise UNKNOWN;
- Astra Medium remains baseline; **High reasoning explicitly allowed in Phase 3 and Phase 4**;
- PASS and NO MVP Returns must include the complete 44-row REQUIRED status/evidence table.

No REQUIRED row was added or removed. Product remains NO MVP until all 44 are GREEN.

---

## SUPERSEDED OVERRIDE · 2026-10-07 · FINAL ISLAND MVP ONE_SHOT BRIEF READY · SUPERSEDED BY v5

Georg authorized the next productive step: execute exactly one **ChatGPT Work/WSA Island MVP ONE_SHOT** against the operational Frozen Matrix v2.

Binding final execution brief:
`skills/chat/WORK_WSA_ISLAND_MVP_ONE_SHOT_FINAL_2026-10-07.md`

This brief supersedes the older World Integrator brief where it still refers to the former 37-row contract.

Receiving owner:
- repo: `georg-doc/kayfabizarro`
- Draft PR: **#348**
- branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`
- product: **NO MVP** at start
- execution mode: **ONE_SHOT**
- only production writer: **ChatGPT Work/WSA Integrator**

Binding contract:
- 44 REQUIRED rows;
- 12 STRONGLY INCLUDE;
- 7 OPTIONAL PROOF;
- full operational owner/readiness/delta/proof/shortcut fields;
- ToolBox Inbox Donor Audit is required source routing;
- no second runtime owner;
- no placeholder substitution;
- no Receiving-Core stop;
- no auto-merge or Live promotion.

Fresh Work/WSA must recover current GitHub state and then continue autonomously through the phases in the final brief until either:
`MVP PASS · ALL 44 REQUIRED ROWS GREEN · HUMAN PRODUCT GATE READY`
or
`NO MVP · PROVEN OUTCOME BLOCKER · <one concrete blocker>`.

---

## SUPERSEDED OVERRIDE · 2026-10-07 · ISLAND MVP FROZEN MATRIX v2 OPERATIONALIZED · SUPERSEDED BY v5

Georg authorized continued Web-Chat refinement of the bounded-Island MVP contract and persistent crash-safe recovery.

Binding frozen contract:
`skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md`

Machine-readable contract:
`skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.json`

Current state:
- **44 REQUIRED** rows; product remains **NO MVP** until every REQUIRED row is GREEN.
- **12 STRONGLY INCLUDE** rows and **7 OPTIONAL PROOF** rows are separately classified.
- operational matrix v2 adds per-row owner, readiness, smallest missing delta, acceptance proof and forbidden shortcut/quarantine guard.
- prior 37-row Open-World contract is preserved and explicitly mapped; no required row was deleted.
- explicit additions/refinements include P0 locomotion + Cartoon Jump, Flight, Drive KEEP+TUNE, Claybound compatibility, grounded/no-pasted-on world placement, real Quote Pool → real Billboard/HyperNormalisation, Early Visual/Physical Golden, Negative Goldens and No-Placeholder firewall.
- Full Combat remains later; Combat Arena retains full Combat ownership. Seed World/Combat Mech POC is a strong shooting/VFX/destruction donor candidate but must win source-isolated donor arbitration before integration.
- Fresh-chat recovery path: **START_HERE → Frozen Matrix → ToolBox Inbox Donor Audit → Integration Census → current WB2 Island Foundation/PR #348 → Prototype Graveyard only for negative Goldens/salvage**.
- current next action: execute the binding final Work/WSA ONE_SHOT brief. Do not reopen broad architecture planning or shorten the required matrix to match an implementation.

No second runtime owner. No auto-merge. No Live promotion. Routine Hub status remains GitHub-live JSON; no Site republish is needed for these planning updates.

---

## 2026-10-07 · Current Georg steering: bounded islands in WB2

Georg accepted bounded island documents inside the existing WB2 owner and the narrower foundation handoff. Existing-owner recipes, editor, scene store and Track Core remain the receiving contracts. Current [topology decision](https://github.com/georg-doc/kayfabizarro/blob/e82c4c7e164b6258fb535df72e5c28143f2ce4cf/tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/ISLAND_TOPOLOGY_DECISION_2026-10-07.md) and [source-backed handoff](https://github.com/georg-doc/kayfabizarro/blob/e82c4c7e164b6258fb535df72e5c28143f2ce4cf/tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/ISLAND_FOUNDATION_RETURN_2026-10-07.md) override older execution routing below where conflicting. The old full37 product matrix remains NO MVP. Next gate: one edited bounded island through existing WB2 store, exact fresh load and independent same-seed document isolation; visible geometry/contact/collision must replay. No endless-world optimization, custom street owner, merge or Live. Proposal story, sizes and new schemas remain unapproved. Routine Hub updates use JSON only; existing Site deployment remains unchanged.

## CURRENT ADDITIVE OVERRIDE · 2026-10-07 · ROAD / TRACK CORE OWNERSHIP

Georg clarified the existing Road + Joyride/Track requirement while the single Integrator is running.

Binding canon:
`skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md`

- Coworker road graph/network may be reused for planning/topology intent only.
- Ordinary roads and race/stunt roads use the same **Track Core** construction family: RouteRecipe/graph/profile/socket/junction/contact/road-bridge-tunnel-ramp pieces.
- Joyride owns the required visible road/track presentation where applicable.
- Continuous Terrain / Surface Truth remains macro terrain/support/collision owner and reconciles road contributions/seams.
- No parallel bespoke Bézier road geometry/contact owner.
- This clarifies existing MVP rows; it does not add scope or authorize a second runtime.

---

## SUPERSEDED OVERRIDE · 2026-10-07 · SINGLE OPEN WORLD INTEGRATOR AUTHORIZED · SUPERSEDED BY FINAL v5 BRIEF

Georg has explicitly authorized exactly one **ChatGPT Work/WSA WorldBuilder Integrator** to start now.

Receiving owner/branch: KFB WorldBuilder / WB2 · Draft PR #348 · `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`.

Binding execution brief:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/WORK_WSA_OPEN_WORLD_INTEGRATOR_ONE_SHOT_2026-10-07.md`

Recovery Audit PR #373 is complete. Do not rerun it.

Dependency order:
1. Continuous Surface Truth + stable WorldObject identity;
2. existing WB2 authoring/sculpt/save/fresh-reload;
3. Motion/camera/Clay visual foundation;
4. required existing-owner KFB seams;
5. fresh independent module critics + different whole-product critic;
6. complete 37-row Acceptance Matrix gate.

Product remains **NO MVP** until every required row is GREEN. No Receiving-Core stop, no second runtime owner, no auto-merge or Live promotion.

---

## HISTORICAL OVERRIDE · 2026-10-07 · Recovery audit completed · EXECUTION ROUTING SUPERSEDED BY FINAL v5

#360 Recovery audit and the one-time existing-Hub migration are complete. Current route: **RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR**. Product remains **NO MVP** and runtime work remains paused until Georg separately authorizes exactly one Integrator. The older ready-to-run audit instructions below are history; do not rerun them. Read the current [owning Recovery Return](https://github.com/georg-doc/kayfabizarro/blob/recovery/open-world-master-acceptance-audit-2026-10-07/skills/chat/recovery/OPEN_WORLD_RECOVERY_RETURN_2026-10-07.md) and frozen ledger on PR #373.

Actual source audit classified **HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT** at exact Dropbox candidate head 5f0cdfa2eb4c6927c50ca399f8dbd62fa79dc3a4. Correct continuous mesh/support/collision/contributions and stable IDs/override invalidation first, then reuse WB2 editor/sculpt/store and existing KFB owners. Actual visual source isolation remains required before presentation KEEP/ADAPT/integration.

The existing Production Hub internal view is verified: https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp. One in-place v11 publication preserved accepted v10 Hub behavior. Subsequent JSON-only revision2026-10-07.4 was visibly loaded while v11/source/deployment stayed unchanged; ordinary matrix/status/donor/proof edits now use main/kfb-hub/live/open-world-mvp.json + refresh. No Cloudflare route, product Site, merge or Live promotion.

# KFB Chat Production Router

Status: **CURRENT ROUTER v1.0**
Date: 2026-10-05
Owner: Georg / KFB

This file is intentionally short. It is a router, not project history.
Historical decisions and superseded states belong in `skills/chat/CHANGELOG.md`, project Returns/Recovery files and Git history.


## HISTORICAL PRODUCTION OVERRIDE · 2026-10-05 23:20 CEST · SUPERSEDED BY KFB ISLAND MVP R4

A direct Georg product review supersedes the earlier "Surface Recovery closed / two P0 freeplay gates" state.

Current routing:
- **#360 Open World = COWORKER LOCAL CORE COMPLETE · GITHUB INTAKE PENDING.** Coworker reports local HEAD `1d4f8c8`, final build stable, but critic FAIL remains on Camera (6.5). This local result is a **receiving core**, not the final One-Shot product, until its exact Return/evidence is imported to GitHub.
- **SCOPE CORRECTION · BINDING.** The current One-Shot contract still requires Authoring + Persistence and one representative Joyride Track, Sky, Billboard, Resident/ChatterBox, Card/Almanac, Audio and Drive seam. Only full Combat, full Golden Journey, every Resident/Card and multiplayer are non-blockers. Earlier “do not add new feature waves during Coworker’s final critic rounds” wording was an execution freeze for that local endgame, **not** a reduction of the final product contract.
- **PR #348 = receiving integration contract, not current executor.** After Coworker returns, ChatGPT Work/Astra becomes the Anschluss-Integrator: ingest the exact Coworker result, preserve what works, close missing KFB seams and run fresh-context critic/whole-product gates.
- **Ground Controls Canon = BINDING.** Do not choose among historical/local controls docs. Use `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`: W/S forward/back · A/D turn · Q/E strafe · Shift run · Space jump · RMB drag camera · wheel zoom; one Ground movement writer, one active camera owner.
- **Clay / Surface Canon = BINDING CORRECTION.** `KayKit style` never means default KayKit materials. Preserve source-proven KayKit/Kenney/KFB identity **and** apply the KFB Clay SSOT/Golden rules. Read `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`. `clay_floor_001` triplanar is a bounded stand-in/microtexture donor; K2/v10 + Golden parity is the final new-stage material direction.
- **Style Reference Router = CURRENT DESIGN Q&A/BENCHMARK.** Read `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`. `KFB_OPEN_WORLD_STYLEGUIDE_2026-10-07` is the curated benchmark; `KFB Style References` is the broad inspiration/comparison pool. Neither overrides current system SSOTs or source-isolation.
- **#372 Theatre Curtain Recovery + Productization = PASS · CLAUDE DESIGN DONOR READY · CHECKED IN MAIN.** Georg PASS on r3. Checked-in package commit `7ca4a36bfeae16dfbc0e0ba99427a4da1b1c2d3e`; actual packet root: `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain Recovery Board/KFB_THEATRE_CURTAIN_RECOVERY_SESSION_2026-10-07/tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/`. Candidate keeps the donor cloth kernel and adds real gathering, rounded pleats/hem weight, motion-safe oxblood macro patina and aged stage hardware; no fake plaque/sign/wordmark/SVG overlay. Consume `IMPLEMENTATION_HANDOFF.md` only when the receiving runtime seam opens. Issue #372 is closed/completed; no Open World runtime write or Live promotion.
- **PUBLIC SURFACE PLAN · BINDING TARGETS.** Final playable game target: `https://play-kayfabizarro.frizzlebob.chatgpt.site` (**PLANNED / NOT YET PUBLISHED**). Existing `kfb-world-studio-mvp1.frizzlebob.chatgpt.site` remains an interim review/authoring surface during Freeze/integration, not the final public game URL. Public KFB Hub target: `https://kayfabizarro.pages.dev/` with public rules, full tab/navigation set, Gumroad/download links and thumbnail gallery/viewer. Private Production Hub remains `https://kfb-production-hub.frizzlebob.chatgpt.site`. Keep game, public hub and private production hub as separate surfaces over one GitHub source truth; no second runtime owner.
- **URGENT POST-FREEZE TERRAIN GUARD · BINDING.** The current Coworker Freeze is already running and cannot be interrupted here. Its terrain-topology output is therefore **not automatically canon**. Existing binding decision remains: continuous procedural terrain = PRIMARY macro world surface; Hex = optional spatial/semantic/local kit. Read `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`. After the running Freeze returns, inspect actual code and classify exactly `HEX_ROLE = SPATIAL_OR_SEMANTIC_ONLY · FREEZE COMPATIBLE` or `HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT · TERRAIN SEAM MUST BE CORRECTED BEFORE FAN-OUT`. No Authoring/Persistence or module fan-out may hard-bind to Hex terrain before this audit.
- **#360 OPEN WORLD RECOVERY OVERRIDE · AUDIT ONLY · MVP LIVING DOC ROUTED.** Product runtime work is paused after the contract-collapse review. Exactly one current executor is authorized: a **fresh ChatGPT Work/WSA Recovery Lead / ChefWSA** on Draft PR #373 / branch `recovery/open-world-master-acceptance-audit-2026-10-07`, using `skills/chat/WORK_WSA_OPEN_WORLD_RECOVERY_LEAD_BRIEF_2026-10-07.md` plus the hardened `skills/chat/WORK_OPEN_WORLD_RECOVERY_AUDIT_2026-10-07.md`. The anti-feature-loss input ledger currently contains **37 required MVP rows + 6 explicit non-blockers**; candidate limitations may not delete requirements. Human-facing read-only projection belongs **inside the existing Production Hub GPT Site** at `https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`, backed by `main/kfb-hub/live/open-world-mvp.json`. Exactly one bounded in-place Hub Site shell update is authorized in the same Work/WSA recovery run; after that, routine matrix/status changes are GitHub-live JSON + refresh only and require no further Work/Sites publish. **No Cloudflare route belongs to this workflow.** The Living Doc is documentation only, never an MVP candidate or second product owner. No Open World runtime implementation, camera/Hex polish, module fan-out, product Site publish, merge or Live promotion until the audit returns.
- **#364 Production Hub = HUB UI REGRESSION · BINDING.** Live-board data path is proven, but Georg confirms the wrong older shell was published. Restore the exact accepted `KFB Hub UX Recovery v2` controls/UX while preserving live data, and add a GitHub-live CSS layer so future simple style changes are CSS+refresh only. Binding contract: `skills/chat/HUB_SHELL_DATA_STYLE_CONTRACT_2026-10-06.md`.
- **#361 Combat = HISTORY / HOLD.** Failed candidate is evidence only, not a current Today/Next lane.
- **#362 Triplet / ChatterBox = HOLD / NOT TODAY.** Resume only after the Open World integration result shows what dialogue seam remains.
- **Audio PR #365 = separate current listening gate.** It does not mutate the Open World.
- **#369 Resident Performance + Character Choreography = Blender MCP READY NOW · PARALLEL SOURCE-ISOLATED · BEFORE #367.** Binding execution brief: `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_EXECUTION_2026-10-07.md`; deep prep/spec: `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`. Blender may audit/reuse rigs/motions and author only genuinely reusable missing body-performance assets while Coworker code review / Architecture Freeze work runs in parallel. It must not write PR #348 / Open World runtime. Priority is world-impacting pose/proximity/gesture/micro-motion, Resident↔Resident/Player staging, shop/trade/gift, Fluff/work and repair/rebuild choreography.
- **#367 Shield Fit · Rig_Medium + Rig_Large = SECOND BLENDER JOB after #369 unless newly outcome-critical.** Binding brief: `skills/chat/BLENDER_MCP_SHIELD_FIT_MEDIUM_LARGE_2026-10-07.md`. Audit existing Atlas attachment rules first; if they already fit in isolation, return `RUNTIME_ATTACHMENT_CONSUMER_MISMATCH` instead of authoring new assets.
- **Resident Performance Event Contract = Web Chat architecture prep.** Main contract: `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`. It adds Pose/Proximity/Micro-motion and Emanata as read-only presentation channels; optional Work review brief exists but no runtime writes are allowed before Coworker return.
- **Resident Life semantic data prep = READY ON MAIN.** Candidate model: `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`; Affect/Emanata map: `skills/chat/RESIDENT_AFFECT_EMANATA_MAP_PREP_2026-10-06.json`; 3-Resident fixture: `skills/chat/RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`. These are proposal data for Architecture Freeze, not runtime truth.
- **Resident Reaction / Encounter Matrix = READY ON MAIN.** Human-readable: `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`; machine-readable: `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.json`. It maps world/social events to Affect → Pose/Proximity → Gesture/Micro-motion → Face/Emanata → Bubble/Audio → recovery, with no LLM requirement.
- **UFO / Hunky & Dory Event Lab = PASS/TUNE DONOR READY.** Returned package: `tools/KFB-ToolBox/_inbox/KFB UFO Tractor Beam Event Lab/KFB_UFO_TRACTOR_BEAM_EVENT_LAB_2026-10-07/`. Rick's UFO is V1-primary; deterministic r2 tractor-beam phases/Clay transfer grammar are accepted as donor input. Kenney A–D remain optional alternatives; Kenney beam mesh is backup/not preferred for V1. Audio map still requires human ear review. Runtime integration waits for the post-Coworker Architecture Freeze.

Primary World recovery brief:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md`
with binding integration roster:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`
on Draft PR #348.

GitHub Issues remain the active job list.

## 1 · Authority order

Use this precedence:

1. explicit current Georg decision;
2. named project/tool SSOT + current Return/Recovery;
3. exact current owner branch/PR/head;
4. current GitHub Issues for active job state;
5. this router and the Active Work Map;
6. historical briefs, changelogs, old Sites and archived candidates.

If two sources conflict, follow the higher authority. Do not invent a synthesis.

GitHub state overrides chat memory.

## 2 · Current operating model

- **GitHub Issues = active job list.**
- **Production Hub = orientation/front door**, not the job database.
- **Production Control = durable decisions/Returns/history.**
- **ToolBox = one specialist-tool router.**
- World Studio, Combat and specialist Sites are products/tools, not dashboards.
- Routine TODO/status changes do **not** require Hub/Cloudflare republishing.

### Executor names are explicit

Never use bare **"ChatGPT"** as the executor in a KFB job, Issue, Hub card, Return or briefing.

Use one of:
- **ChatGPT Web Chat** — cheap/default research, intake, GitHub/admin, data curation, bounded non-Work production;
- **ChatGPT Work/WSA** — substantial implementation, multi-system integration, hard runtime/debugging, Work cloud-computer/Sites operations when actually required;
- **Claude Design** — visual/interaction authoring from pinned sources;
- **Blender MCP** — 3D/rig/animation authoring;
- **PUBLISH_ONLY / Sites-capable executor** — deterministic host publication without reopening engineering.

Executor label = actual execution surface, not model family.

Current portfolio reference:
`skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md`

Surface Recovery was reopened by concrete Georg-visible defects on 2026-10-05.
Current Hub recovery owner: Issue #364.
Current product recovery owner: Issue #360 / WB2 PR #348.
Do not treat the previously published Hub/World/Combat candidates as accepted.

## 3 · Resolve execution mode first

Every task is exactly one of:

- **ONE_SHOT** — one continuous product outcome; internal checkpoints continue automatically.
- **BOUNDED_SLICE** — one named module/repair/POC.
- **RECOVERY** — salvage/restore a failed candidate or route.
- **RESEARCH** — read-only/source/options work.
- **PUBLISH_ONLY** — frozen source; host publication only.

The named execution mode outranks generic slice defaults.

For ONE_SHOT:
- default = **CONTINUE**;
- local failures stay local;
- optional defects quarantine/defer;
- no internal checkpoint becomes a Georg gate by default.

## 4 · Core execution rules

### Outcome first
The named product outcome outranks local tests, diagnostics and proxy artifacts.

### One production writer
One Builder/Integrator owns production writes for the receiving owner.
Parallel research/testing/critic work may be read-only.

### Independent execution for substantial jobs
Read:
`skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`

Use:
- Builder / Integrator = only production writer;
- Integration Tester = factual evidence;
- Independent Critic = short read-only evaluation;
- Production Guard = routing authority.

These are roles inside the same run by default, **not separate expensive Work jobs**.

No agent may materially change a candidate and then certify that same change as accepted.

### Stop authority
A failed test is not proof of product blockage.

After two non-improving repair passes:
1. identify the **smallest failing seam**;
2. preserve its evidence;
3. Production Guard decides:
   - `QUARANTINE/DEFER + CONTINUE`, or
   - stop only the blocked outcome path.

Global One-Shot/Product STOP requires demonstrated blockage of the named outcome.

### Reuse before rebuild
Use verified donors and existing owners before creating anything new.
A loaded URL is not source/design proof; show the actual donor/source in isolation when identity matters.

### Crash-safe persistence
Default GitHub checkpoints:
1. coherent implementation milestone;
2. material evidence/test milestone;
3. Return/handoff milestone.

Do not checkpoint every internal test iteration.
After every actual GitHub write, fetch the exact branch head and intended file.

Timeout = `UNKNOWN`. Inspect actual state before retrying.

## 5 · Human gates

Read:
`skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`

Do not manufacture human gates from:
- counters;
- ownership tables;
- technical diagnostics;
- isolated harnesses;
- CI/deployment success.

Use Georg only for a real visual/play/audio/product decision, an irreversible action, or a decision he explicitly requested.

## 6 · Budget / repair proportionality

Read:
`skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`

Classification:
- `CORE_BLOCKER`
- `ACCEPTANCE_BLOCKER`
- `MINOR / QUARANTINABLE`
- `COSMETIC / DEFERRED`

A local defect does not become a project blocker merely because it is measurable.

## 7 · Site publication

Read:
- `skills/chat/KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md`
- `skills/chat/SITES_PUBLISH_ONLY_CONTRACT_2026-10-04.md`

For Site-capable products:
`GitHub source → product QA → existing GPT Site update → exact Site verification`

Cloudflare is only a downstream mirror/public acceptance surface when actually required.

If engineering is complete and only hosting remains:
`PUBLISH_ONLY`

Use the lowest-cost Sites-capable executor.
Do not redesign in the publish lane.

## 8 · Briefing contract

Keep briefs compact. State only:

- **Executor**
- **Outcome**
- **Owner**
- **Read first / exact source**
- **Protected boundary**
- **Done when**
- **INDEPENDENT EXECUTION** block for substantial Work/WSA/One-Shot jobs

Reference global contracts; do not paste them into every brief.

## 9 · Read order for a production task

1. this router;
2. current GitHub Issue if one owns the job;
3. named project/tool SSOT;
4. current Return/Recovery;
5. exact active branch/PR/head;
6. only the global contract(s) relevant to this task;
7. only the specialist skill(s) actually needed.

Do **not** load unrelated historical workflows merely because they are in the repository.

For bounded slices:
`skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`

For GitHub/publication work:
`skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`

Production control:
`skills/chat/KFB_PRODUCTION_CONTROL_CONTRACT.md`

## 10 · History / recovery

Historical router state:
`skills/chat/CHANGELOG.md`

Registry:
`skills/chat/REGISTRY.json`

If context is lost:
`skills/chat/RECOVERY_PATH.md`

Do not ask Georg to reconstruct an old chat when GitHub can recover the state.

## Core shorthand

**Outcome first. One writer. Tester measures. Critic checks. Guard routes. Georg decides product questions.**

**Freeze the smallest failing thing, not the whole project.**


## 2026-10-06 · DocCheck SVG Creator / Flexikon Basic

Current DocCheck project/tool node:
`georg-doc/doccheck/SVG_Creator/`

Status:
- seven working animated Flexikon Basic donor graphics/process forms;
- Musterblatt reviewed by Georg as **PASS WITH TUNE**;
- current upstream lane is a Flexikon Process Curator that discovers, scores and prepackages biochemical/molecular/cellular/physiological articles;
- preferred source is authorized Flexikon MCP/internal structured access, not an uncontrolled bulk HTML mirror;
- active Coworker setup job: `georg-doc/doccheck#12`.

This node is separate from SimBlood. It owns Flexikon Basic process-SVG production and its curator queue, not microscopy morphology.
