# KFB Game Dev Studio

**Permanent public lane:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/  
**Tool/recovery home:** `tools/game-dev-studio/`  
**Game-ready packages:** `game-ready/`

KFB Game Dev Studio is the **human-facing package/preview lane** between canonical GitHub assets and named KFB runtime consumers.

It is intentionally **not** a second Asset Librarian, Registry, Rig owner, animation owner, physics engine or audio engine.

## UX rule

The Asset Librarian remains useful as a broad source/registry workbench, but its filter/drawer-heavy UI is not the interaction model for this lane.

Game Dev Studio is package-first:

```text
current package
→ visual preview
→ source / derived / QA state
→ consumer handoff
→ recovery / changelog
```

No global asset-browser workflow is required to review one production package.

## Data flow

```text
GitHub canonical source
→ Registry / Librarian source facts
→ game-ready package metadata / explicit derivatives
→ tools/game-dev-studio/catalog.json
→ /kfb-hub/free-roam/game-dev-studio/
→ named Travel / Race / Town / Dungeon / other consumer
```

The public page loads preview models from **pinned GitHub revisions**. It does not silently reinterpret `main` as the historical source.

## Files

- `catalog.json` — small presentation catalog consumed by the public site.
- `RECOVERY.md` — current production cursor; update after every substantive turn.
- `CHANGELOG.md` — append-only project history.
- `index.html` — stable tool URL redirect to the Free Roam Game Dev Studio entry.

## Turn protocol

After each substantive Game Dev Studio turn:

1. update `RECOVERY.md`;
2. append `CHANGELOG.md`;
3. update `catalog.json` if package/source/gate state changed;
4. update package-local files under `game-ready/<package>/` when the package itself changed;
5. keep Free Roam / Lead navigation wired;
6. report implementation, automated/browser evidence, public deployment and Georg acceptance separately.

Ordinary package additions should require **catalog/data changes, not a redesign of the site**.
