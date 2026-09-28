# TEST REPORT · Library self-test · ToolBox Production-05 · 2026-09-28

Run: `… → Run LIBRARY self-test` inside Claude Design, real sources at `4fa08271` (PR #275). **Result: 24/24 PASS.**
The run backs up `kfb-anim-library.patch.v1` (the backup survives an aborted run), the URL and the workspace, then restores all three.

| # | Check | Measured |
|---|---|---|
| L01 | v3 manifest · rows = unique ids = clipCount | 204 rows · 204 unique · clipCount 204 · kfb.motion-catalog.v1 v2026-09-28 · sha256 49a82685ccaa… |
| L02 | per-clip library path · both rigs · i03 supplements | 204/204 rows with both rigs · 28 files · 6 `*_i03` files → agony, casting_spell, catwalk_walk, walk_in_circle |
| L03 | Intake 03 · talk + throw as filters | talk 11 · throw 10 · action 1 · locomotion 2 · reaction 1 · all five groups are filter chips |
| L04 | Driver · »talk« · talk/gesture · PROVEN | Rig_Medium · all tracks bind on 204/204 · 13 hits |
| L05 | »Reden« · distinct variants | 7 hits · kfb_talk_talking_a … _f, all distinct |
| L06 | play talk variant in Studio | kfb_talk_talking_b · 69/69 tracks · 5.87 s |
| L07 | rename + tags · id, label_de, catalog unchanged | displayName set · label_de »Reden« · catalog frozen · sha256 unchanged |
| L08 | Terrain · same clip · feet readable | resident scene · same id · catalog contacts at the frame |
| L09 | talk.explain → immutable id | stays kfb_talk_talking_b after a second rename |
| L10 | exportEnabled false → Excluded filter | only kfb_dance_house_b |
| L11 | SEAT REQUIRED in Terrain and Studio | meeting_a badge on both stages · sitting_a gated |
| L12 | run and throw | release f53 · hand.l · RUNTIME CONFIRMATION REQUIRED · source loop true → play once · 6.463 m · 1 marker |
| L13 | shoulder throw pair | cross-linked · aggressor f59 peak shown as NO PROP RELEASE · 0 markers |
| L14 | Rig_Large actor (Orc Brute) | PROVEN 204 on Rig_Large · talking_b 69/69 · Driver role kept |
| L14b | Rig_Legacy | INCOMPATIBLE · »no silent retarget« |
| L15 | export → reset → import | fingerprint equal · reset differed · unknown id kept as orphan · immutable `durationSec` dropped · catalog sha256 unchanged |
| L16 | Librarian projection | 204 rows · 204 assetIds · editorial name wins · release f53 and intake survive |
| L17 | Librarian ⇄ Library | `?asset=motion:kfb_talk_talking_c` → `?motion=…&actor=frizzlebob-driver` · patch unchanged |
| L18 | Drop Zone local preview | fixture GLB · 10 clips · 69/69 on Driver → PROVEN · sha256 04e7f7a4… |
| L19 | Fit & Motion A/B | wrist A→B 20° · back to A residue 0° |
| L20 | intake receipt | 2.8 KB JSON · 64-hex hash · PRIVATE_LOCAL_ONLY · rawFbxIncluded false · autoPublish false · 4/8 checks (promotion checks stay open by design) |
| L20b | FBX parser present | FBXLoader loaded · **FBX parsing NOT exercised** (no fixture) |
| L21 | no raw FBX in URL, patch, receipt, Librarian rows | no ».fbx« in any of them |
| L22 | narrow 420 px | drawer closed: dock search, ☰ Motions, play and Export; drawer open: full-width browser; actor picker in the top bar |

## Package checks

| Check | Result |
|---|---|
| Library self-test on the **staged copy** in this folder (Claude Design preview, same origin) | PASS 24/24 · evidence/13 |
| Closure: 1 entry + support.js + 14 kfb-lib modules, all relative, all present | PASS (script) |
| Secret scan (tokens, signed URLs, keys) over all text files | PASS · 0 hits |
| No file > 2 MB | PASS (largest: entry ≈ 0.46 MB) |
| JSON parse: SOURCE.json, EXPORT_MANIFEST.json, samples/* | PASS (script) |
| zipcheck.py | NOT_RUN (no Python in Claude Design) |
| Clean run from the unpacked ZIP | NOT_RUN (Next Gate) |
| PRODUCTION-01 self-test (P04 block, 38 steps) | NOT_RUN in this cut (unchanged from P04: 36/38, 09 + 22 stale-save) |
| Georg acceptance | PASS 28.09. (UI/UX tune later) |

## Not covered by a PASS

- Visual correctness of any clip on any actor (feet, wrists, facing). Only track binding is measured.
- FBX parse path (see L20b).
- Two-actor shoulder-throw playback, seat placement, live 3D cards.
- Render R0 (not in the source package).

## Evidence

`evidence/01…12`: Studio + search, editorial rename, Terrain, Librarian record, back in Library, filter panel, self-test 24/24, Drop Zone local preview, local clip on the KFB actor, narrow dock, narrow drawer, narrow inspector sheet. The capture tool shows WebGL and background images with a delay, so some cards look grey in the shots; in the live page they have images.
