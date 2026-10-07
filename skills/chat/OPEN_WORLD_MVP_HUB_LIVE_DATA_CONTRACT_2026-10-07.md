# KFB Open World · MVP Living Doc · Production Hub Live-Data Contract · 2026-10-07

Status: **BINDING CONTROL-SURFACE CONTRACT**
Owner: **KFB Production Hub + KFB Open World Recovery**
Human owner: **Georg**

## Purpose

Expose the complete KFB Open World MVP Acceptance Matrix as a continuously current interactive view **inside the existing KFB Production Hub GPT Site** without requiring Work/Sites publication for routine matrix/status changes.

## Human surface

Existing Production Hub only:

`https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`

Do not create a second Hub or a Cloudflare/pages.dev route for this Living Doc.

## Stable live data

Canonical Hub projection feed:

`main/kfb-hub/live/open-world-mvp.json`

The feed contains the human-facing projection of:
- binary product status;
- complete required MVP rows;
- explicit non-blockers;
- acceptance states;
- donor/owner/proof data;
- current recovery metadata.

Binding product truth remains:
1. explicit Georg decisions;
2. current binding GitHub product contracts;
3. frozen Recovery Master Acceptance Matrix.

The Hub live feed is a projection, not a second product SSOT.

## One-time Site migration

Exactly one bounded Sites-capable Work/WSA publish is needed to extend the **existing current Production Hub Site**.

The executor must:

1. load the exact currently published Production Hub Site/project before editing;
2. preserve the accepted Hub v10 shell and all current controls/behavior;
3. add internal view `?view=open-world-mvp`;
4. reuse the prepared Living Doc interaction model: binary status, search, filters, category/system overview, row details, donors/owners/evidence/proof;
5. fetch `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/kfb-hub/live/open-world-mvp.json` with `cache: no-store`;
6. retain a local deployed fallback snapshot if GitHub fetch fails;
7. preserve theme, Pocket Inbox, Decisions, Resident overlay, navigation, live-board loader and live-CSS loader;
8. publish **in place** to the existing Hub project only.

Do not reconstruct the Site from stale `kfb-hub/index.html` or an older donor.

## Required no-republish proof

The migration is not complete merely because the view appears.

After the Site publish:

1. record exact Site version/deployment;
2. modify only `main/kfb-hub/live/open-world-mvp.json` with a harmless truthful revision/updatedAt change;
3. refresh the exact `?view=open-world-mvp` Site URL;
4. visibly confirm the new revision/data is loaded;
5. confirm Site version/deployment did not change;
6. leave the feed at the truthful current audit state.

PASS proves:

`Web Chat / Recovery Audit → GitHub main JSON → Production Hub refresh`

with **no further Work/Sites run** for routine data updates.

## Routine update rule

After migration, Web Chat/ChefWSA updates the live feed at material audit checkpoints whenever any of these change:
- requirement row/state;
- donor/disposition;
- owner;
- acceptance proof/evidence;
- non-blocker classification;
- binary product status.

Routine changes to those facts are **DATA-ONLY**.

They must not trigger:
- Site republish;
- Hub redesign;
- Cloudflare work;
- Open World runtime work.

Work/Sites is needed again only for an actual Hub structure/behavior change that the current shell cannot express.

## Product-status firewall

The view may show counts and distributions but never a percentage or near-MVP roll-up.

Only:
- `MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN`
- `NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN`

The Living Doc is never itself an MVP candidate.
