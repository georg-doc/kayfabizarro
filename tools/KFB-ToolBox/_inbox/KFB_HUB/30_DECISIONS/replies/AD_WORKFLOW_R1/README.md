# AD-Workflow R1 · Zielbilder aus Kritiker-Screenshots

**Was:** Kritiker-Erfassung → privates Paket → ChatGPT malt die Befunde in die echten Screenshots → Georg gibt je Bild frei → Rückgabe → WS0 macht Aufträge → Blind-Vergleich Bau ↔ Zielbild (B ≥ 8) → erst dann Georg. Ablauf: `AD_WORKFLOW_R1.md`.
**Georg (je Familie ein neuer ChatGPT-Chat):** die Zeile aus der Hub-Karte einfügen (`Nutze den Skill kfb-art-direction: kfb-art-direction <Link> Familie D Lauf 1 Ordner <name> #<Prüfsumme>`) und alle Dateien aus `Dropbox › KFB_AD › <name>` hineinziehen. Nach jedem Bild „PASS“, „TUNE …“ oder „FAIL“; bei PASS das genannte Bild herunterladen, am Ende die Rückgabedatei. Fehlt in der ersten Antwort „Skript-Prüfsumme …“: neuen Chat öffnen.
**Einmal einrichten:** Georg lädt in ChatGPT unter Skills den Ordner `chatgpt-skill/kfb-art-direction` hoch (ohne Skill-Funktion: Projekt mit `SKILL.md` als Anweisung). WS0: `claude-skill/kfb-ad-package` nach `~/.claude/skills/`, Scan-Zeile in `WS0_STATE.md`, `VORSCHLAG_sync_github.diff` entscheiden.
**WS0-Werkzeuge:** `tools/` (Python; Pillow oder macOS-sips für Bildformate).
**Test:** `test_r1/LAUF.md` · Probelauf mit echtem Aqua-Material grün (simuliert, ohne Bildgenerierung), 33 Tests grün, nichts gepusht.
**Offen vor dem ersten Lauf:** öffentliche Erfassungsbilder im Spiegel (§11.1; bis dahin verweigert `build` öffentliche Quellen); Formattest im ersten Chat (§11.5); Clip-Zeit fehlt in der Aqua-Erfassung (§11.2, Ausnahme `zeit_unsicher`).
