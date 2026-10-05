# SITE PUBLISH PACKET · KFB World Kernel Lab

Status: **PUBLISH_ONLY · SITES_PUBLISHER_REQUIRED**
Date: 2026-10-05

## Product role

Private KFB specialist research Site below ToolBox/Hub.
It is not a dashboard and not a World Studio replacement.

Suggested Site title:
**KFB World Kernel Lab**

Suggested slug if available:
`kfb-world-kernel-lab.frizzlebob.chatgpt.site`

Do not create a Cloudflare substitute merely because this executor lacks GPT Sites publication capability.

## Exact source root

`tools/KFB-ToolBox/world-kernel-lab/`

Runtime files:
- `index.html`
- `style.css`
- `app.js`
- `world-worker.js`
- `world-kernel.js`

Support/evidence files are not required by the browser runtime:
- `START_HERE.md`
- `WORLDSPRING_REFERENCE.md`
- `TEST_REPORT.md`
- `RETURN.md`
- `CHANGELOG.md`
- `package.json`
- `tests/world-kernel.test.mjs`

## Publication rules

- publish the exact frozen source; no redesign in PUBLISH_ONLY;
- keep source module paths relative;
- Worker must be served as same-origin module;
- preserve private/review audience initially;
- after deploy, open the exact Site URL;
- verify initial seed 23 renders;
- verify Detail 0→5 keeps the displayed world fingerprint;
- verify click adds authored edit;
- verify generator 1→2 changes fingerprint and shows migration warning;
- verify Accept edit migration clears the warning;
- record Site project/version/deployment/source identity.

Only after exact Site verification:
- add/update the ToolBox/Production Hub link;
- optionally mirror to Cloudflare later if a formal public KFB-Hub acceptance route is actually needed.

## Human review action

Georg needs only this:
1. seed 23;
2. drag Detail 0→5;
3. add 2–3 square authored anchors;
4. change generator 1→2;
5. observe migration warning;
6. click Accept edit migration.

Decision returned:
`USEFUL / TUNE / DROP` for the architecture experiment.
