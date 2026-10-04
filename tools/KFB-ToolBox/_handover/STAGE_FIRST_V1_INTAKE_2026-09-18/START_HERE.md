# KFB ToolBox · Stage-First v1 · Intake / Promotion Brief · 2026-09-18

**Status:** SOURCE RECEIVED / REVIEWED INTAKE · OWNER-REPO PROMOTION PENDING  
**ToolBox owner repo:** `georg-doc/kayfabizarro`  
**Owner-repo package:** `georg-doc/kayfabizarro/tools/KFB-ToolBox/_inbox/KFB ToolBox v1-1.zip`  
**Readable expanded mirror:** `georg-doc/KFB-Stunt-Car-Race`  
**Important:** the Stunt Race inbox is only the readable expanded mirror. It does **not** become ToolBox implementation ownership.

## 0 · Exact source

### Owner-repo export package

`tools/KFB-ToolBox/_inbox/KFB ToolBox v1-1.zip`

Git blob: `5943ee108609a7916bf231fec59848ef4c58f965`  
Compressed size: `1,801,302` bytes  
Upload commit: `eabc87255ee3da6283f9d438390454d70e9d2e55`

Georg identifies this ZIP as the Stage-First-v1 export described below. The GitHub connector cannot unpack binary ZIP content itself, so exact byte-for-byte ZIP→expanded-tree identity is not independently asserted here.

### Readable expanded export mirror

For code/document inspection, use:

```text
georg-doc/KFB-Stunt-Car-Race
/_inbox/KFB ToolBox v1/KFB-ToolBox/_handover/
EXPORT_STAGE_FIRST_V1_2026-09-17/
KFB_ToolBox_Stage-First_v1/
```

Race main at intake review:

`c9503c7d6529a6ecc8e192ce1fbee10ab0d12fca`

Export self-name:

`KFB_ToolBox_Stage-First_v1_EXPORT_2026-09-17`

Entry:

`src/KFB ToolBox Stage-First v1.dc.html`

Export facts from its own manifest:

- 132 files;
- 4,524,631 B ≈ 4.32 MiB uncompressed payload;
- no build step; source is the browser application;
- complete editable source tree is present;
- product shell: `Actor · Face · Pose · Motion · Voice · Stage`;
- export reports a successful cold start from the export tree;
- export status is deliberately `EXPORT_PARTIAL`, not a release.

Classification:

`OWNER-REPO EXPORT PACKAGE RECEIVED · USER-IDENTIFIED SAME EXPORT · BINARY CONTENT NOT INDEPENDENTLY UNPACKED`

Do **not** infer semantic version order from the filename suffix `v1-1`; the explicit intake pin above decides.

This intake does not convert exporter-reported tests into Georg acceptance.

---

## 1 · What the export actually proves

The included `docs/TEST_REPORT.md` reports PASS for:

- boot / `window.__TOOLBOX` ready;
- visible Stage;
- critical module closure for the checked path;
- eye-source guard;
- runtime font loading through the export's RAW links;
- full 35-entry roster presence;
- Klo-Rolli load;
- CapsuleCarl load;
- GothGirl load;
- Recherchi load;
- desktop-width preview for the tested view.

The same report explicitly leaves major authoring flows `NOT_TESTED`:

- Actor → Face → Pose → Motion → Voice → Stage traversal;
- profile export → reload → import roundtrip;
- Resource Picker Preview / Accept / Revert;
- Pose save / reload;
- Motion playback across a useful clip set;
- Voice / Talk / Audio;
- Stage place → transform → save → reload;
- ~832 px split-screen.

Therefore:

`SOURCE COMPLETE ENOUGH FOR PROMOTION WORK`

is supported.

`TOOLBOX V1 ACCEPTED / PUBLIC READY`

is **not** supported yet.

---

## 2 · Corrections to the export's own source-gap report

GitHub state overrides the export's historical search result.

### 2.1 Audio manifest is not a real missing-source problem

Export issue:

`src/petstudio-v9/kfb-pinball-sfx.json` absent from the delivered tree.

Verified existing GitHub source:

```text
georg-doc/kayfabizarro
skills/KFB PetStudio/KFB Pet Studio v9-1/
pet-studio-v9_2026-08-28_ws0-rehome/
kfb-pinball-sfx.json
```

Git blob:

`5f7b52e2666a19961f2f71e6e657424ee0008e9f`

**Decision for promotion:** consume the existing GitHub file through a pinned/same-origin path. Do not reconstruct the JSON and do not create a second audio manifest.

### 2.2 FrizzleBob_Yellow.gltf already exists on GitHub

The export marks this asset:

`NEW_ASSET_REQUIRES_GITHUB_IMPORT`

That classification is stale.

Verified existing GitHub source:

```text
georg-doc/kayfabizarro
tools/KFB-ToolBox/kfb-rigs-embed-v3/
petstudio-v9/assets/models/FrizzleBob_Yellow.gltf
```

Git blob:

`e0a757ece30accabc4c61f1ad11751b15bd06974`

**Decision for promotion:** GitHub is the source. Do not promote the packaged copy as a second canonical asset and do not claim a new asset import is required.

### 2.3 Fonts are GitHub assets, but the export uses moving `main` URLs

The export correctly avoided putting font binaries into the package, but its runtime URLs use the moving `main` branch.

Promotion must use:

- an exact GitHub revision, or
- an existing same-origin published path backed by the same GitHub source.

Do not copy font binaries into a chat handoff or duplicate them solely for this promotion.

### 2.4 Remaining GitHub `main` asset references

The export manifest contains multiple Runtime RAW URLs against `main`.

Promotion step:

1. resolve each runtime asset to exact repo/path;
2. keep the original asset owner;
3. pin the runtime reference to a concrete revision where possible;
4. record exceptions explicitly;
5. do not create an Atlas/ToolBox-local model warehouse.

Georg's rule remains:

> If an asset already exists on GitHub, use that GitHub asset.

---

## 3 · Product direction that remains current

The old Birthday consumer is **not** the target.

Current ToolBox direction remains the Stage-First creative tool:

`Actor · Face · Pose · Motion · Voice · Stage`

Rules retained from the accepted design direction:

- one persistent navigation layer;
- Stage visually dominant;
- no permanent developer/provenance dashboard in normal authoring;
- no explanation-text walls;
- full capability retained via contextual / progressive disclosure;
- no reduced four-character demo roster;
- Resource Picker consumes Registry/Librarian candidates but does not become another Registry;
- Registry/Librarian owns source/provenance;
- ToolBox/Rigging/Animation owns receiving suitability and compatibility;
- gameplay projects keep their own runtime owners.

The export's embedded Birthday handover files are **historical source/evidence only**.

Do not use them as current product scope.

---

## 4 · Birthday classification

Georg's current decision, 2026-09-18:

`BIRTHDAY SLICE = FAIL / OUTDATED / ARCHIVED HISTORY`

This applies to the complete Birthday execution lane, including:

- Birthday Character Select as current P0;
- Travel/Astra Birthday slice;
- ToolBox Birthday consumer handoff as active assignment;
- Birthday scene QA/publish tasks;
- Birthday visual target hierarchy;
- Birthday-specific juice as current production priority.

Historical files remain in Git because they contain source provenance, failed experiments and some reusable mechanisms.

They must not appear in current execution boards as active work.

Reusable facts may survive independently, for example:

- Eye-source guard learnings;
- measured actor profiles;
- generic Pet Select provenance;
- generic D6/audio assets;
- generic Makerspace/cinema idea;
- generic archetype notes.

Reuse the mechanism only after verifying its current owner and purpose. Do not revive the failed Birthday slice around it.

---

## 5 · Promotion target

Proposed owner-repo implementation path:

`georg-doc/kayfabizarro/tools/KFB-ToolBox/stage-first/`

This path does not currently exist on `main`.

Promotion must be additive and reviewable.

Do not overwrite:

- `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/`;
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/`;
- Studio v18 donor history;
- Resident Atlas / World Atlas;
- existing contracts.

The owner-repo ZIP remains the package provenance. The Stunt Race expanded tree remains the readable inspection mirror and must not gain ToolBox ownership.

---

## 6 · First promotion slice

Do not redesign the entire ToolBox.

### Step A · Source promotion / portability closure

- copy/promote the actual editable export tree into the ToolBox owner repo;
- preserve directory structure required by `window.__KFB_MODBASE`;
- resolve the audio manifest to the existing GitHub source;
- resolve FrizzleBob_Yellow to the existing GitHub source;
- pin all existing GitHub runtime assets;
- retain `three@0.160.0` for this pass unless a separate compatibility test justifies an upgrade;
- keep the 35-entry roster;
- preserve localStorage keys and do not clear user state;
- write a promotion manifest showing every intentional delta from the original export.

### Step B · Browser candidate

Create a stable candidate route, proposed:

`/toolbox/stage-first/`

The exact public route may follow existing deployment conventions, but it must be directly usable by Georg without terminal work.

No public PASS from file presence alone.

### Step C · Functional gate

Run one connected workflow, not disconnected component checks:

```text
Boot
→ Actor
→ Face
→ Pose
→ Motion
→ Voice/Talk/Bubble
→ Stage
→ Save/Export
→ Reload
→ Import/Restore
```

At minimum verify:

1. one Cube Pet;
2. GothGirl or another Rig_Medium biped;
3. FrizzleBob/Graft;
4. CapsuleCarl or another non-biped special actor;
5. actor switching without duplicate eye/mixer ownership;
6. Face controls visibly affect the selected actor;
7. Pose save/reload;
8. Motion play/stop/rest with measured binding;
9. Voice/Talk path, including the recovered audio manifest where applicable;
10. Resource Picker preview → accept → revert;
11. Stage prop place → transform → save → reload;
12. profile export → import → same visible actor state;
13. desktop;
14. ~832 px split-screen.

A test not run remains `NOT_TESTED`.

---

## 7 · What not to do

- no Birthday rebuild;
- no Travel scene implementation;
- no new Pet schema;
- no new Registry;
- no rewritten rig system;
- no guessed animation compatibility;
- no module renaming/re-foldering just for neatness;
- no `localStorage.clear()`;
- no duplicate GitHub assets;
- no new source from screenshots/prose where the real source exists;
- no automatic promotion of candidate contract deltas to canonical contracts.

---

## 8 · Acceptance model

Keep these statuses separate:

### SOURCE RECEIVED

The export is in GitHub and readable.

### REVIEWED INTAKE

Structure, manifests and key gaps have been reviewed against current GitHub truth.

### IMPLEMENTATION

A promoted ToolBox owner-repo candidate exists.

### TESTED RESULT

Concrete browser flows were executed against a named revision.

### PUBLIC DEPLOYMENT

A public route is deployed.

### GEORG ACCEPTANCE

Georg has actually used and accepted the concrete candidate.

### ARCHIVED HISTORY

Old Birthday/A/B/failed redesign material may remain useful for provenance or donor mechanisms but is not current execution.

---

## 9 · Current intake verdict

### SOURCE

**RECEIVED**

### REVIEW

**REVIEWED INTAKE**

### EXPORT QUALITY

Strong enough to promote: complete source tree and honest test gaps.

### CORRECTIONS

- Audio manifest: existing GitHub source found.
- FrizzleBob_Yellow: existing GitHub source found.
- GitHub `main` runtime references: must be pinned during promotion.

### CURRENT BLOCKER

Not missing source. The blocker is **functional/browser acceptance of the authoring workflow**.

### NEXT

Promote into the ToolBox owner repo, close the GitHub asset references, then run the connected Stage-First browser gate.

---

## 10 · Ready-to-paste fresh-chat briefing

> @GitHub
>
> Du bist der Produktionschat für **KFB ToolBox · Stage-First v1 Intake + Promotion**.
>
> GitHub state overrides chat recollection.
>
> **ToolBox implementation owner remains:** `georg-doc/kayfabizarro/tools/KFB-ToolBox/`.
>
> Das eigentliche Exportpaket liegt im ToolBox-Owner-Repo:
>
> `georg-doc/kayfabizarro/tools/KFB-ToolBox/_inbox/KFB ToolBox v1-1.zip`
>
> Der lesbare entpackte Mirror für Code-/Dokuprüfung liegt hier:
>
> `georg-doc/KFB-Stunt-Car-Race/_inbox/KFB ToolBox v1/KFB-ToolBox/_handover/EXPORT_STAGE_FIRST_V1_2026-09-17/KFB_ToolBox_Stage-First_v1/`
>
> Lies zuerst vollständig:
>
> `georg-doc/kayfabizarro/tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`
>
> Danach im Export:
>
> 1. `START_HERE.md`
> 2. `EXPORT_MANIFEST.json`
> 3. `FEATURE_PARITY.md`
> 4. `docs/TEST_REPORT.md`
> 5. `docs/KNOWN_ISSUES.md`
> 6. `docs/RECOVERY.md`
> 7. `docs/MODULE_MAP.md`
> 8. `docs/ASSET_MANIFEST.json`
>
> Auftrag:
>
> - **kein Redesign** und kein Nachbau;
> - den echten Source-Baum additiv in den ToolBox-Owner promoten;
> - bestehende Assets immer über GitHub verwenden;
> - das angeblich neue `FrizzleBob_Yellow.gltf` **nicht duplizieren** — GitHub-Quelle ist bereits verifiziert;
> - das fehlende `kfb-pinball-sfx.json` aus der bestehenden GitHub-Quelle verwenden, nicht rekonstruieren;
> - bewegliche `main`-Runtime-URLs in der promovierten Fassung pinnen;
> - 35er Roster und bestehende Owner/Contracts erhalten;
> - zuerst einen direkt nutzbaren Browser-Candidate bereitstellen;
> - dann den zusammenhängenden Gate `Actor → Face → Pose → Motion → Voice → Stage → Save/Reload/Import` testen;
> - Desktop und ~832 px Split-Screen prüfen;
> - nicht ausgeführte Tests bleiben `NOT_TESTED`.
>
> **Birthday 2026 ist FAIL / OUTDATED / ARCHIVED HISTORY.** Keine Birthday-Szene, kein Birthday-Character-Select und kein Astra-Birthday-Slice weiterbauen. Historical Birthday-Unterlagen nur als Provenienz/Donor lesen.
>
> Kein Bash/Terminal-Auftrag an Georg.
>
> Return immer getrennt als:
>
> `SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN | ARCHIVED HISTORY`.

---

## Additive history

2026-09-18 · Complete Stage-First v1 export package received in the ToolBox owner repo; readable expanded mirror located in the Stunt Race inbox and reviewed for code/document intake. Current GitHub review corrected two stale export assumptions: the audio manifest and FrizzleBob_Yellow source both already exist in `georg-doc/kayfabizarro`. Georg classified the full Birthday slice as FAIL / OUTDATED / ARCHIVED HISTORY. No ToolBox runtime promotion is claimed by this intake document.
