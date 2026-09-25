---
name: "session-zip"
description: "Voller lauffähiger Session-Cut als ZIP für Claude Design (kein GitHub-Push möglich). Trigger nur auf /session-zip oder 'Session Cut ZIP'; Aufruf = Exportfreigabe."
---

# /session-zip — KFB Claude Design Session Cut + ZIP

Die vollständige, geprüfte Fassung (v1.0, inkl. eingebettetem zipcheck.py) liegt im Projekt „Skills“ unter `claude/session-zip-SKILL.md`. Beim Trigger diese Datei vollständig lesen und exakt befolgen; sie ist die Quelle der Wahrheit.

Kurzfassung, falls die Datei nicht erreichbar ist:

- Aufruf = ausdrückliche Exportfreigabe. Nicht nachfragen, nichts löschen, kein Veto-Fenster (anders als /session-export).
- Workspace ist die Wahrheit: kein Redesign, kein Refactor, keine Ersatzassets, keine Fixes vor dem Export.
- Ablauf: Entry Point + Pins bestimmen (nichts raten, sonst SOURCE_REQUIRED / VOICE_INPUT_UNCERTAIN) → Closure-Analyse ab Entry Point → Asset-Inventar (EXPORTED, PINNED_REMOTE, UNPINNED_REMOTE, CDN_EXTERNAL, LOCAL_NOT_EXPORTED, REPLAY_DEPENDENCY_MISSING, RELATIVE_PATH_RISK) → Secret-Scan → Staging (kopieren) → Pflichtdokumente (START_HERE, RETURN, HANDOVER, CURRENT_STATE, CHANGELOG, HOUSEKEEPING, SOURCE.json, EXPORT_MANIFEST.json, TEST_REPORT, CHECKSUMS.sha256, NEXT_CHAT, evidence/) → Manifest, dann Checksums, dann ZIP → Clean-Run-Check gegen das entpackte ZIP.
- Name: <PROJECT>_CLAUDE_DESIGN_SESSION_CUT_<YYYY-MM-DD>_r<N>.zip
- Nur wirklich ausgeführte Tests heißen PASS (sonst NOT_RUN). Keine Tokens/signierten URLs. Keine Datei > 2 MB im ZIP.
- HANDOVER endet mit genau einem Next Gate.
- Nach zwei gescheiterten Reparaturversuchen am selben Gate: nicht weiterreparieren, Status ARCHIVED_FAILED_CANDIDATE plus POSTMORTEM.md.
- Rückgabe kompakt: ZIP-Link, Dateiname, Dateizahl, Größe, Entry Point, Tests, externe/fehlende Abhängigkeiten, offene Punkte, ein Next Gate. Kein Preamble.
