# Auftrag WSA work · Arbeitskopien aufräumen · WS0 · 01.11.2026 (V-1146)
Georg: Die Festplatte ist von 110 GB frei auf 9 GB gefallen. Messung WS0: 80 volle Repo-Kopien von WSA, rund 49 GB, davon 4,2 GB abgebrochene Downloads (`tmp_pack`).
- `~/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/` und Nachbarn: 72 Kopien, 32 GB.
- `~/Dropbox/Mac/Documents/Codex/`: 8 Kopien, 16,5 GB.

**Wichtig:** 63 der 80 Kopien zeigen laut WS0 Commits, die nicht in den bekannten Remote-Zweigen liegen, 8 weitere lokale Änderungen. Nichts davon darf verloren gehen. Laufende Aufträge fasst du nicht an.

1. **Prüfen:** Je Kopie: gibt es ungesicherte Arbeit, und gehört sie noch zu etwas? Hol vorher die Remote-Zweige, viele Treffer dürften schon gemergt sein.
2. **Sichern:** Was gebraucht wird, kommt auf einen benannten Branch. Nichts anderes ändern, keine Kaufdateien in öffentliche Repos.
3. **Abräumen:** Saubere Kopien in den Papierkorb (`~/.Trash`), nicht endgültig löschen. Georg leert ihn selbst.
4. **Ab jetzt:** Je Repo ein Spiegel unter `~/.codex/mirrors/`, geholt mit `--filter=blob:none`. Arbeit in Worktrees mit Sparse Checkout, nie in der Dropbox. Am Job-Ende räumt der Auftrag seinen Worktree ab. Dieselbe Regel schreibst du in deine Projektanweisungen.

**Rückgabe an WS0, dann Stopp:** Eine Tabelle: Kopie, Größe, was gesichert wurde (Branch, Commit), was im Papierkorb liegt, was bleibt und warum. Freier Platz vorher und nachher. Melde, was du nicht sicher einordnen konntest, statt es anzufassen.
