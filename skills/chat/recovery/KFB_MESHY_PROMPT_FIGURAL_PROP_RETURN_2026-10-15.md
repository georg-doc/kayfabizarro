# KFB Asset Scene Composer / Meshy prompt safety — Return 2026-10-15

## What changed
Outcome: prevent future Meshy text-to-3D prompts from deleting required **figural static scene props** (e.g. a golden goblin statue) because of overbroad actor exclusion terms like `No characters`. A positive request for sculptural props overrides generic simplification/exclusion lists. Also translate project shorthand into self-contained external-model shape/material instructions.

User incident: Goblin Bank/Vault claymation diorama prompt contained a gold goblin statue and pig sculpture but later ended with `No characters`. The contradiction was caught by Georg before paying Meshy credits; no failed actual Meshy run was reported or observed.

## One owner and bounded scope
- Source/canon owner: **KFB Asset Scene Composer** private ChatGPT skills plugin; original `compose-kfb-scene` intact.
- Repo: `georg-doc/kayfabizarro`.
- Branch: `docs/meshy-prompt-figural-prop-guard-2026-10-15` based on `main@e082405ee54455feac8cf6e0a5f8101053b7c72e`.
- Draft PR: **#401**; not merged, no publication.
- Prior verified checkpoint: `b41cac61dd75bb837e09b907e6780162d64eface` (guard file created, branch re-fetched and file content matched).
- Final branch tip is verified separately after this Return write; do not infer it from the previous checkpoint.

## Persisted assets and exact plugin release
1. `skills/chat/KFB_MESHY_PROMPT_FIGURAL_PROP_GUARD_2026-10-15.md`: binding prompt-assembly and pre-credit semantic collision check, with eight authoring regression scenarios and a bank-specific safe example.
2. This Return: trace, QA facts and next gate.
3. Existing private plugin `plugins_6acaa1b6b0688191b66448db92767870` updated in-place **v0.1.2 -> v0.1.3**, release `pluginrel_6ad0b25616448191a69bd3a02a39ffba`.
4. New bundled plugin skill `skills/meshy-scene-prompt-preflight/SKILL.md` and updated plugin manifest/default Meshy prompt route. Original `skills/compose-kfb-scene/SKILL.md` and three reference files retained, not overwritten.

The private plugin package is a separately managed installed tool. Its release is not a GitHub commit and the GitHub documentation is not a claim about actual model enforcement.

## Evidence and tests actually run
- GitHub branch created from exact main head and re-fetched: **1 branch check PASS**.
- Guard doc write: one GitHub file create; exact branch head and blob readback, full content equality: **1 doc readback PASS**.
- PR #401 creation: returned OPEN/DRAFT; exact branch head and intended guard file re-fetched: **1 PR/head readback PASS**.
- Plugin v0.1.3 update: release API returned `status=updated`.
- Plugin source readback: **7/7 static checks PASS** (new skill present; goblin statue case present; broad-negative guard present; no assumed project knowledge; original compose skill retained; both manifests are v0.1.3).
- Plugin file inventory after update includes all six original source files plus the new Meshy skill: **7 files**.
- Regression matrix: **8 authored scenarios; 0 automated Meshy executions**.
- Model output / Meshy Credits / GLB geometry / separation of vault door: **NOT TESTED**. Source/image-generation isolation not implicated in this prompt-safety doc and no new source-proven asset is claimed.
- Site/Stage/Cloudflare: **NOT REQUIRED / NOT DEPLOYED**; this is a prompt-authoring safety slice.

## Remaining limits
- This is a skill-level instruction/pre-credit checklist, not a deterministic block inside Meshy's generation API. A model may still ignore prompt intent; inspect preview before committing further credit/render passes.
- Unqualified live-character negatives must be rejected in the authored prompt whenever named figural props are requested. Positive-only mentions of those props are not sufficient when the negatives contradict them.
- No cross-project runtime/editor or Asset Librarian Site change; no second prompt authoring/runtime owner.

## One next gate
On the **next real Meshy scene prompt**, run the installed `meshy-scene-prompt-preflight` against an explicit KEEP/REMOVE list, confirm the exact user-selected statue/display/stage props remain in the *final copy-ready prompt*, and only then submit it to Meshy. Human review if substantive object/visual intent changes. No auto-merge, no Live promotion.
