# Archiv bearbeiteter Eingangs-Jobs

Ziel: `_inbox/archiv/<job-id>/`. Nur abgeschlossene/bewusst vertagte und dokumentierte Eingangspakete hierher verschieben, einschließlich START_HERE, Originaldaten, Manifest, Entscheidungen und finalem Return-/SSOT-Pointer.

Vor dem Move: Inhalt/Hashes sichern, Zielkollision ausschließen, referenzierende Index-/Handoff-Dateien aktualisieren; bei Bedarf alten Pfad mit MOVED-Hinweis erhalten. Git-Historie bleibt. Kein Löschen und keine Änderung der alten Quellenwerte zur nachträglichen Bereinigung.

Unabhängig davon hält `../../_archive/` ersetzte ToolBox-Releases/Docs. Die zwei Archive haben verschiedene Aufgaben.
