# Checkpoint · Stage-First v1 · commit from Georg's machine

Der Connector hat auf `georg-doc/kayfabizarro` nur Leserecht (`POST /git/trees` → 403, gemessen 2026-09-16T01:20Z). Deshalb liegt der Checkpoint als ZIP vor.

1. ZIP entpacken → Ordner `tools/KFB-ToolBox/stage-first/` und `tools/KFB-ToolBox/_inbox/{V18_BIRTHDAY_7_2026-09-16,STAGE_FIRST_V3_2026-09-16}/` (nur README + INVENTORY/DIFF, keine Binär-Kopien) ins Repo legen; `github.md` = Projekt-Sync-Datei, nicht ins Repo.
2. Top-Level-Pointer: `tools/KFB-ToolBox/{START_HERE.md,MASTERPLAN.md,TOOLBOX_MANIFEST.json,CHANGELOG.md}` mit den Vorschlägen aus `DOC_RECONCILIATION_PROPOSAL.md` ergänzen (additiv).
3. `git add -A tools/KFB-ToolBox && git commit -m "ToolBox Stage-First v1 · P0 slice tested 13/13 · ACCEPTED FOR WORKING BASELINE" && git push`
4. Commit-SHA in `stage-first/SOURCE_MAP.json` (`commit`) und im Design-Projekt `github.md` nachtragen.

Nichts umbenennen, keine Module verschieben, keine kanonischen Verträge anfassen.
