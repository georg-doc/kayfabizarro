# CURRENT RETURN · Manual Webchat GIF Worklist R1 · 2026-11-07

**Outcome:** Georg rejected the CLI/API fallback and selected manual ChatGPT Web production. A standalone, directly usable HTML worklist was generated at `artifacts/KFB_Slop_GIF_Worklist.html` in the current KFB Hub project. The same additive Asset Librarian implementation is preserved in the existing Site source repository at commit `8d208cd19978220d42d9bf20dd41fc3c61b1be77`.

**Coverage:** 1,191 canonical Slop records from pinned media commit `58ca51561a70957aa77013d4e75e8a5727886c52`: 1,077 base actors shown by default and 114 optional variants. Each row supplies the pinned GitHub original, direct raw PNG URL, stable asset ID, proposed `*_idle_r1.gif` filename and a copy-ready German Webchat prompt requiring the actual PNG attachment, six frames, approximately 220 ms/frame, transparency, seamless looping and exact character identity.

**Workflow decision:** Webchat generates and downloads the GIF only. Do not let every individual chat write GitHub. Mark accepted files `Batch-bereit`, export the manifest, then perform one controlled check-in/registry QA pass per 20–30 files. Game acceptance remains a separate WS1 gate.

**Checks:** standalone inline scripts compile; embedded inventory 1,191/1,077/114; Blitzmagier present; Site worklist test PASS; library model PASS (24,508 assets); popup roster/filter PASS; Slop metadata PASS (1,191 canonical Slops); workflow parity PASS; intake reconciliation PASS. The Site package build also passed its content and expanded-archive budget checks.

**Publication status:** the existing public Asset Librarian remains live at version 59 / source `b20514738d8c710b88a78a28620bff07abb66afc`. No new public version is claimed. The worklist source commit is remotely preserved, but two archive transfers timed out after five minutes before any version was created; version history was inspected after the timeout and contained no partial or duplicate version. The upload seam was stopped after two non-improving attempts. No registry, game, merge or Live promotion was performed.

**Owners preserved:** WS0 remains character/curation owner; the existing Asset Registry/KFB Asset Librarian remains asset truth; WS1 remains game/runtime owner. The worklist records candidates and progress but does not admit GIF bytes.

**Exactly one next gate:** Georg opens the standalone HTML worklist, produces the first controlled batch of 20 base Slops in ChatGPT Web, then returns the 20 named GIFs plus the exported batch manifest for one verified intake/check-in pass.

Final branch HEAD must be fetched after this Return commit.

---

# CURRENT RETURN · GIF Loop Pilot R0 · 2026-11-07

**Outcome:** one explicitly requested, reference-conditioned `SL_MAGIE_BLITZMAGIER` loop pilot was run through the current built-in Work image path. The canonical GitHub PNG was shown alone and supplied as the identity authority. Five unique user-provided Golden GIF payloads were inspected as motion/format references.

**Result:** **TECHNICAL FAIL · STOPPED AFTER ONE PILOT.** The path returned a single 1254×1254 RGBA PNG, not a 6-frame 512×512 looping GIF, and visibly re-rendered the actor. The static output is quarantined, not registered, not a style parent and not imported into the Site or game.

**Durable evidence:** `GIF_LOOP_PILOT_R0_2026-11-07.md` at evidence commit `f8f6c680a9e32c24921f84829fe88a88be8807ef`. It records source/Golden identities and hashes, exact prompt/exposed arguments, output hash and the acceptance matrix.

**Owners preserved:** WS0 remains character/curation owner; existing Asset Registry/KFB Asset Librarian remains asset truth; WS1 remains game runtime owner. Existing Site project `appgprj_6ac1afef08148191b62b95f184bf845e` was read-only inspected at source head `7b3e16cbc36f7d386069f3d7648981f0a1dbeff8`, live version 56. Zero Site files changed; zero deployment, Stage, game or registry writes.

**Exactly one next gate:** Georg explicitly decides whether to authorize one CLI/API fallback pilot for the same Blitzmagier source in a locally configured OpenAI API project. No fallback job, synthetic wobble/deformer, series expansion, Librarian admission or game intake before that decision.

Final branch HEAD must be fetched after this Return commit.

---

# RETURN · R2 Ink Monster production recovery · 2026-11-04

Owner WS0; repository georg-doc/kayfabizarro; branch docs/ws0-black-ink-blob-series-2026-11-04; existing intake issue #466. Documentation / plugin update only. Implementation checkpoint e46fd5582fa64f320acf69768ea4d3503ab2d7fe; final branch HEAD must be fetched after this closure commit. No new PR, merge, Stage, Site or Live deployment.

## Result
SOP_INK_MONSTERS_R2.md is current production rule; POSTMORTEM_2026-11-04.md records Georg's TOTAL FAIL, omitted reference inputs, drift, false positive commentary and interrupted/retried batch. Current image generation is STOPPED. This request generated zero new images.
README.md, PROMPT_SYSTEM.md and EXPORT_QA.md route to R2 before older recipes. BENCHMARKS_2026-11-04.json identifies six real user references, hashes, dimensions, bounded roles, Library IDs and plugin paths; three rejected local outputs remain quarantined. Actual failed prompts preserved in REJECTED_VETERAN_PROMPTS.md.
Existing KFB Asset Scene Composer updated to 0.2.3, release pluginrel_6aeb4c431e788191b3721fa79137b998. New produce-kfb-ink-monsters profile and existing 2D/scenelet route hooks, six exact reference PNGs bundled privately. Text source mirror under composer-plugin-source/; COMPOSER_RELEASE.md provides receipt. No parallel runtime/asset registry.

## Evidence and limitations
- Implementation commit exact file readbacks: 18/18.
- Three YAML frontmatter checks, two manifest version checks, six original-reference SHA256 matches, one ZIP CRC check.
- Plugin read-back: version/release, new skill, two route hooks, ledger and full 26-file inventory; no missing requested text paths. Existing 15 files retained, 11 added (five profile/text files + six PNGs).
- Independent read-only continuation test: six bundled hashes match, fresh request routes to one pilot before six-pack. Count clarified: accepted pilot counts as slot 1 unless user requests a separate study.
- Six reference images decode RGBA. Construction alpha extrema 1..253 is a technical hold, NOT true clean transparency PASS; Professions/RPG max alpha254 also requires inspection. No reference altered.
- Zero new image tests for recovery workflow; zero runtime tests, zero new accepted game assets; no guarantee of zero drift.
- This six-reference set is distinct from historical 18-sheet/108-candidate intake. Their binary import/48 crop warnings remain unresolved.
- Benchmark binaries live in current Composer release and existing Library, not GitHub; failed pixels in Library, not accepted asset folders. Local Work must retrieve and verify actual bytes.

## Exactly one next gate
Local Work uses LOCAL_WORK_START.md, current Composer profile and originals. On Georg's next explicit image request produce ONE source-conditioned pilot retaining rounded body/material and benchmark prop craft, with white sclera/red iris/black pupil; compare actual original and candidate at full/64/96px. Georg design decision precedes series expansion. Do not silently restart rejected six-pack. Six singles are a candidate method, not proven superior to sheet generation.

## Prior intake Return (historical, retained)
# RETURN · WS0 Black Ink Blob Sprite-Family Production System · 2026-11-04

**Owner:** WS0. **Repo:** georg-doc/kayfabizarro. **Branch:** `docs/ws0-black-ink-blob-series-2026-11-04`. **Issue:** #466. **Mode:** BOUNDED_SLICE, documentation, prompt provenance, source/QA inventory, receiving brief; **NO Runtime implementation**. **Implementation checkpoint:** `7495c6ea3c3b113fa13ce4f259eb5d6c077d188d`. **Evidence checkpoint:** `ea38bcf6a09bf697e8dc30cfc0a8b7139d484387`. Final branch HEAD must be fetched live; this file does not pretend to contain its own future commit SHA.

## Product outcome
- Reusable KFB black-ink clay visual DNA with L0 ordinary footless low-level blobs, L1 specials and L2 lore/leader characters. Copy-ready two-new-job 3x2 prompts plus 12-slot character variation method.
- 18 visually PASS source sheets / 108 candidates reconstructed into exact source-name and SHA-256 intake ledger; 18 local PNGs inspected, 108 mechanically cropped 512px variants, 48 crop-boundary warnings, one real Granny donor visually isolated, one ZIP integrity PASS.
- Existing WS0 game owner evidence discovered: 72 actors in private `assets/inkblobs-r1` atlas and `game/inkblobs-r1` deform/jump/splat/hit/spawn source, not replaced.
- Detailed existing Asset Librarian and WS1 handoff for ingestion, controlled deformer trial, collision/hit, Webchat generator → WSA/Work pipeline and eventual read-only asset workbench.
- Hub candidate pointer added **only on review branch**, not claimed as a published/live refresh. No Cloudflare Stage URL, no opening or human browser proof, no merge.

## Tests actually run
See `TEST_REPORT.md`: 18/18 RGBA decode, 18/18 source SHA, 108/108 mechanical exports + SHA, 48 flagged cells, 1 isolated source visual read, 1/1 ZIP test, 0 runtime tests, 0 Source PNGs committed, 0 GPU performance runs. `game-dev` not in this container; native GitHub/Pillow fallback used. Exact original files and derived candidate ZIP are a conversation artifact, **not uploaded into repository**. Asset Library registration of these 108 is **not claimed**.

## Owners preserved
WS0 register `docs/kfb-decisions-register-2026-10-11` / DECISIONS.md holds decisions/V-numbers. Asset Registry/Librarian remains the one asset truth. WS1 is the game runtime and collision owner. `KFB-Stunt-Car-Race` keeps current `game/inkblobs-r1` and `assets/inkblobs-r1` existing implementation. No second material, face, audio, atlas, physics or runtime owner.

## Open / deferred
- Actual PNG byte import into durable git/private storage and tagged Asset Registry query: **NOT DONE**.
- 48 flagged cells need visual crop scrutiny; 108 single sprites not all individually re-approved.
- ChatGPT Images account library programmable bulk access: **UNVERIFIED**; only explicit Webchat PNG/ZIP export bridge is assumed.
- In-game deformer, collision, projectile hits, friendly NPC distinction and performance of the **new** 108 sprites: **NOT RUN**.
- Public Stage/Hub activation and actual visual browser proof: **NOT REQUIRED for docs-only, NOT DONE**.
- WS0 must assign any canonical V-number after its own steering intake; this branch does not forge one.

## Exactly one next gate
**WS0:** use issue #466 to admit one actual six-actor `normie_a` low-level source sheet via existing Asset Librarian into the 72-actor receiving pipeline, prove alpha/96px, animate in existing `mobs2d`, show one real WS1 in-game bounce/hit/splatter/collision screenshot/clip with honest test counts. Do not merge/promote automatically. Georg action required now: **nothing**.

