# KFB Web-First Execution v1 · No-Work-by-default

Status: **CURRENT EXECUTION DEFAULT**  
Date: 2026-09-22  
Owner: Georg / KFB

This workflow supersedes the idea that routine KFB lead/control-plane work should happen in Work/WSA.

**Default rule: Web/GitHub + Claude Design + zero-install HTML review first. Work is escalation-only.**

The goal is to protect scarce Work quota while keeping KFB production fast, crash-safe, additive and visibly testable.

---

## 1 · Execution lanes

### A · Web Lead / Web GitHub — DEFAULT

Use for:

- source recovery and GitHub truth;
- architecture/planning;
- current-status check-ins;
- issue/gate classification;
- implementation in repository source;
- unit/integration tests;
- CI;
- donor extraction;
- debugging from code/log evidence;
- bounded repair;
- changelog / Return / Hub metadata;
- creating fresh-chat briefs;
- preparing exact Work escalation packets when truly necessary.

This is the normal KFB production lane.

Routine cross-project coordination does **not** require Work.

### B · Claude Design — VISUAL AUTHORING

Use for:

- 3D visual composition;
- world/environment authoring;
- shape/material/light exploration;
- donor-first visual comparison;
- interactive authoring sessions;
- complete Session Cuts.

Claude Design receives source-locked technical inputs from Web.

It should not spend its long context on repository archaeology, repeated axis tuning or deployment.

### C · Zero-install HTML Review — HUMAN DEV LOOP

Every browser/game/3D slice should first return a **zero-install review artifact** that Georg can open from the chat without cloning a repository, installing a CLI or waiting for Cloudflare.

Preferred workflow:

`Web/Claude branch → implementation checkpoint on GitHub → generated REVIEW.html artifact in chat → Georg feedback → Web/Claude repair → repeat`

The review artifact is a **development/human-review surface**, not public acceptance.

Preferred review form:

- one self-contained HTML file where practical;
- JS/CSS bundled or inlined;
- exact remote assets pinned to immutable GitHub/jsDelivr revisions where needed;
- no localhost server requirement;
- no Python/Terminal requirement;
- no Cloudflare deployment requirement.

If a single HTML file is technically impossible because of browser/CORS/asset constraints, use the smallest zero-install fallback that still does not require Georg to set up tooling. Localhost is a fallback, not the default.

Every visual slice should return:

- exact branch/head;
- one generated `REVIEW.html` artifact or equivalent zero-install review file;
- expected visible revision marker;
- known limitations.

#### ChatGPT attached-HTML texture rule

For 3D review files opened directly from ChatGPT, read:

`CHATGPT_HTML_TEXTURE_PREVIEW_LIMITATION_2026-09-23.md`

A missing texture in the ChatGPT attachment host is not proof that the GLB/GLTF or Resident source is untextured. The WB1 Caveman case proves that an embedded GLB PNG can fail in the attachment host while the source asset remains valid.

Human-verified review-host fallback:
`fetch → Blob → createImageBitmap → THREE.Texture`, with `THREE.TextureLoader` fallback, exact donor texture pin, sRGB color space and glTF `flipY = false`.

This adapter is review-only. Do not mutate source assets, Registry, Resident Atlas or consumer runtime merely to make the ChatGPT attachment render a texture.

### D · Work / WSA — ESCALATION ONLY

Use Work only when a capability is unavailable or impractical in Web + Claude + zero-install HTML review.

Legitimate examples:

- local/private binary bytes must move across repositories and the Web connector cannot transfer them;
- an exact local multi-repository checkout is required;
- OS/browser automation is needed and Georg cannot reasonably perform the small local preview;
- a hard cross-repo runtime seam requires simultaneous local repositories;
- final release packaging requires local build artifacts not obtainable through Web/GitHub;
- final cloud/browser verification genuinely needs Work's computer environment.

Work is **not** the routine project lead.

---

## 2 · Mandatory Work escalation test

Before opening Work, create a short escalation record answering:

1. What exact outcome requires Work?
2. Which capability is missing from Web/Claude/HTML review?
3. What exact source head is already prepared?
4. Has the candidate already passed CI?
5. Has Georg already reviewed the zero-install HTML artifact when applicable?
6. What is Work explicitly forbidden to change?
7. What is the one success check?
8. What is the immediate stop condition?

If #2 has no concrete answer:

**DO NOT USE WORK.**

---

## 3 · Minimal-Work contract

The ideal Work job is:

> Take this already prepared, CI-green, locally reviewed source at exact SHA. Perform the one unavailable integration/packaging/browser action. Do not redesign or debug. If the smoke gate fails, preserve evidence and STOP.

Work should normally receive:

- exact repo(s);
- exact branch(es);
- exact SHA(s);
- closed file roster;
- tests already passing;
- local preview result;
- one integration script/command if possible;
- one browser sequence;
- one target URL if publication is required.

### On failure

Work must **not** enter an open-ended repair loop.

It returns:

- first failing transition;
- exact log/evidence;
- screenshot/telemetry when useful;
- candidate preserved.

Then:

**Web diagnoses and repairs.**

A new Work escalation happens only after a new Web/Claude/HTML-reviewed candidate is ready.

---

## 4 · What Work must not spend quota on

Do not use Work for:

- routine GitHub status checks;
- briefings/todos;
- Hub maintenance;
- changelog maintenance;
- source census;
- license research;
- ordinary code edits;
- unit tests;
- CI fixes;
- actor/prop/weapon calibration;
- axis/orientation investigation;
- shader tuning;
- visual iteration;
- optional-asset repair;
- repeated browser debugging;
- “while here” cleanup;
- routine branch reconciliation that Web can do;
- routine Cloudflare content changes that can be automated or done through GitHub.

Apply `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`.

---

## Verified review donor pool

Before creating a new review UI, read:

- `REVIEW_TEMPLATE_POOL.md`
- `review-templates/REGISTRY.json`

Default:
- reuse a human-accepted harness when its focus profile fits;
- adapt only the documented subject seam;
- preserve product/runtime ownership;
- archive the exact accepted artifact back in the project repo.

Current first verified donor:
`threejs-focus-review-v1` from Racer TARCH-0 R1.

## 5 · HTML-review-first contract

A productive visual/runtime slice is not complete merely because CI passes.

Before Work or Cloudflare, prefer:

`CODE → GITHUB CHECKPOINT → REVIEW.html → GEORG LOOK/PLAY → FIX IN WEB/CLAUDE → repeat`

Only after the candidate is locally useful should it become a publication candidate.

### Why

This removes the expensive cycle:

`commit → package → Cloudflare → discover trivial bug → Work repair → republish`

and replaces it with:

`commit → generated HTML artifact → immediate human feedback`.

### Required review artifact

For new browser slices, add or maintain:

- a generated `REVIEW.html` or equivalent one-click artifact;
- a visible source/revision marker;
- exact source pins inside the artifact or adjacent `REVISION.json`;
- only the runtime/assets required for that review.

Do not create a deployment, local-server or build framework merely to make the review visible.

---

## 6 · Cloudflare policy

Cloudflare Stage is an **acceptance/publication surface**, not the normal edit-refresh loop.

Use it for:

- milestone candidate;
- cross-device/shared review;
- final human gate;
- published Hub links.

Do not republish every debugging turn.

An HTML-reviewed candidate may stay branch-only until it is worth sharing.

### Publication batching

Hub/ToolBox/briefing maintenance should be batched.

Do not spend Work quota to keep a public dashboard synchronized after every small documentation commit.

Web may update GitHub source immediately.

Public Hub synchronization happens:

- with the next meaningful accepted Stage candidate; or
- as one cheap dedicated Web/automation publication batch.

---

## 7 · Crash-safe Web chat pattern

Web chats are expected to be replaceable.

Therefore each productive slice uses:

1. one named branch;
2. one narrow outcome;
3. implementation checkpoint;
4. tests/evidence checkpoint;
5. Return/changelog checkpoint;
6. exact head readback.

Do not keep crucial state only in chat.

If a Web chat dies, a fresh chat reads GitHub and continues.

### Size cap

Prefer one runtime seam per fresh chat.

Never combine unrelated repair, publication, new feature and architecture work in one Web conversation.

---

## 8 · Additive progress

Every productive slice should leave:

- code/result;
- additive changelog;
- Return / current status;
- local preview instructions when visual;
- one next gate.

The next slice should build on that exact GitHub state.

Avoid rewriting history to make a failed path look clean.

---

## 9 · Hub role

KFB Hub is the **current navigator**, not the runtime owner.

It should expose:

- Tools;
- Briefings;
- current human gates;
- TODOs;
- direct accepted Stage links;
- source links;
- honest statuses.

Desired status vocabulary for Hub:

- `LOCAL REVIEW`
- `CI GREEN`
- `PUBLIC VERIFIED`
- `HUMAN GATE`
- `HOLD`
- `BLOCKED`
- `DEFERRED`

A WIP does not require Cloudflare just to appear in planning truth.

The Hub source can point to GitHub briefs until a real public runtime exists.

---

## 10 · Combat lesson · 2026-09-22

The expensive C-MVP-A sequence demonstrated the new rule.

### Work genuinely contributed

- exact local private/public packaging including binaries that the Web connector could not bridge;
- real interactive Chromium/WebGL/audio/input/viewport evidence;
- final exact public packaging and public browser verification.

### Work should not have owned

- optional Mage diagnosis;
- face-log interpretation;
- `forwardZ` repair;
- weapon-axis / release root-cause repair;
- ordinary tests;
- documentation;
- Hub synchronization;
- repeated runtime debugging.

Those are Web/local-preview tasks.

### Future Combat pattern

If the public Combat MVP needs a new feature:

1. Web implements;
2. CI passes;
3. Georg local-previews the exact branch;
4. Web fixes;
5. Work only if a remaining capability gap exists.

---

## 11 · Core decision

**Web is the KFB production default.**

**Claude Design is the visual-authoring specialist.**

**A zero-install HTML artifact is the normal rapid human-review loop.**

**Work is a scarce integration escalator, not a development environment.**

**Cloudflare is a milestone acceptance surface, not a debugger.**

---

## One next process gate

For the next browser/game slice, prove this workflow in practice:

**Web implements one small change and supplies one zero-install REVIEW.html artifact in chat. Georg reviews it directly. No Work and no Cloudflare until the slice is accepted enough to justify publication.**
