# WSA · V-1146 · lokale Repository-Ablage · 01.11.2026

Auftrag: Georg / WS0, Arbeitskopien sichern und nur eindeutig saubere inaktive Altkopien in den Papierkorb verschieben. Keine endgültige Löschung, keine Arbeit an laufenden Jobs, keine Kaufdateien oder privaten Quelldateien öffentlich hochladen.

## Ab jetzt

1. Pro bekanntem Repo bzw. eindeutig zugeordneter Site ein zentraler Git-Spiegel unter `~/.codex/mirrors/`, Remote-Abrufe mit `--filter=blob:none`. Aktuelle Zweige dort abrufen; bloß unterschiedliche HEADs sind kein Beweis ungesicherter Arbeit. Ancestry/Erreichbarkeit prüfen.
2. Task-Arbeit als Worktree mit Sparse Checkout außerhalb Dropbox. Keine weiteren Vollklone pro Auftrag; keine neuen Arbeitskopien in Dropbox. Fehlenden privaten Git-CLI-Zugang konkret melden; keinen Vollklon-Ersatz und keine Token-Anforderung an Georg.
3. Am Job-Ende benötigte Arbeit auf benannten Branch sichern, Ref und Dateien nachlesen, eigenen Worktree beenden. Vorher Status einschließlich untracked/ignored, Stash/weitere Refs, verbundene Worktrees/Objektverzeichnisse, Submodule/LFS, Symlink-Abhängigkeiten und aktive Aufträge prüfen. Im Zweifel liegen lassen und begründen.
4. V-1146-Sicherungsrefs heißen `housekeeping/2026-11-01/<ID>-<Kopie>/HEAD` plus getrennt erhaltene weitere Refs. Sie sind **LOCAL_ONLY**, nicht automatisch auf GitHub gesichert. Private lokale Objekt-Sicherungen erhalten vorhandene Git-Objekte per Hardlink ohne neue Vollklone; die bekannte Lücke eines ursprünglichen Partial-/Shallow-Klons wird dadurch nicht in vollständige Historie verwandelt. Vorhandene ausgecheckte Dateien werden gegen die Sicherungsobjekte verifiziert.
5. Niemals lokale Recovery-Namespaces oder `git push --mirror` veröffentlichen. Im öffentlichen Repo stehen nur diese Regeln, Tabelle und Prüfnachweise. Keine Audio-/Modell-/Kaufdateien, Credentials, Roh-Patches oder privaten Site-Bundles.
6. Nur verifizierte inaktive saubere Kopien nach `~/.Trash/KFB-WSA-V1146-2026-11-01/`; Papierkorb leert Georg selbst. Verschieben gibt noch keinen freien Speicher. Du/Dateigrößen, verbleibende Hardlinks und tatsächlich gemessenen freien Platz getrennt berichten.

Die Regel wurde additiv in der lokalen Projekt-`AGENTS.md` verankert und zurückgelesen; `sources/` bleibt unverändert. Kein Site-Update, Merge oder World-/Audio-Produktpatch.

## Umsetzung / offene Prüfung

90 Git-Arbeitskopien inventarisiert (82 Projekt, 8 Dropbox). Ein neuer gefilterter Public-Spiegel hat 614 aktuelle Branch-Heads gelesen. Von 40 Kopien mit explizitem Public-Origin sind 17 HEADs von aktuellen Remote-Zweigen erreichbar; 23 werden nicht als remote-gesichert bezeichnet. Private Git-CLI kann ohne vorhandene Anmeldung nicht fetchen; GitHub-Connector kann private Metadaten lesen. Diese Lücke führt nicht zu einem öffentlichen Push.

Die endgültige Verschiebe-/Bleibe-Tabelle, Dateiprüfzähler, lokale Sicherungsbranches und Messungen folgen als Evidence/Return. Geprüfte Abhängigkeiten werden erhalten; unklare lokale Datenbanken, veränderte/konfliktbehaftete/unvollständige Checkouts und aktuelle Arbeitsorte werden nicht abgeräumt.
