# Briefing WSA-Work · Hub-Update: MVP-1-Briefings an einem Ort R1

Stand: 2026-10-10 · von Claude Code (Lab-Steuerung) · Auftraggeber Georg · **ein kleiner Work-Job, data-only**

## Ziel

Georg will alle laufenden Briefings an **einem** Ort sehen: im KFB Production Hub (`kfb-hub/current-board.json` auf `main`, Site `kfb-production-hub.frizzlebob.chatgpt.site`). Die Steuer-Sitzung bereitet Briefings und Pakete vor; der Hub zeigt sie.

## Auftrag 1 · Board-Update (data-only)

1. In `kfb-hub/current-board.json` die sechs Einträge unten an den Anfang von `briefings` stellen und die zwei Einträge an `quickLinks` anhängen. Schema `kfb.surface-board/2` beibehalten, `revision` hochzählen (z. B. `2026-10-10.1`), `updatedAt` setzen.
2. Den p1-Eintrag `mvp-drive-loop-island-worldbuilder-lab` aktualisieren: summary „MVP-1 Stufe 1 läuft in eigener Claude-Code-Bau-Sitzung (R2D-Insel-Port, Town + Protopia). Neue harte Bauqualität Q1–Q8 vor jedem Bild, blinder Kritiker über die Steuerung. RKIT Steinbogen im Neuaufbau (Kritiker Lauf 01: 5,1, Reparaturrunde 1).“, badge „CURRENT · MVP-1 STUFE 1“.
3. Veraltete Status-Quellen korrigieren, die WSA selbst gemeldet hat (Site-Registry: Production Hub v11; PR #380 gemergt).
4. Keine Pakete bzw. ZIPs ins Repo: Die Pakete liegen in Georgs Dropbox (`KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel/`); der Hub nennt nur den Pfad.
5. Rückgabe-Ordner anlegen: `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/` mit einer `README.md` (Unterordner `A_claude-design/`, `B_chat/`, `D_research/`, `E_claude-design/`; Georg lädt dort Ergebnisse hoch).

```json
{
  "briefings_add": [
    {
      "id": "brief-mvp1-build-session",
      "title": "MVP-1 · Bau-Sitzung Stufe 1 (R2D-Insel-Port)",
      "badge": "RUNNING · CLAUDE CODE",
      "status": "running",
      "provider": "Claude Code (Bau-Sitzung) · Steuerung + blinder Kritiker",
      "desc": "Town + Protopia als kfb.island-config/1 aus R2D v0 + Scholle v7; Q1–Q8 gemessen vor jedem Bild, dann Kritiker, dann Georg.",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEF_MVP1_BUILD_SESSION_R1.md"
    },
    {
      "id": "brief-mvp1-A-town-lageplan",
      "title": "MVP-1 · A · Town-Lageplan + 3 Kameras",
      "badge": "READY · CLAUDE DESIGN",
      "status": "ready",
      "provider": "Claude Design (Paket A_claude-design_town-lageplan.zip, Dropbox KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel)",
      "desc": "Draufsicht im MC-Raster, Weltlogik je Ort, 3 Kamera-Skizzen, Anker-Liste. Für Stufe 2. Rückgabe: tools/KFB-ToolBox/_inbox/MVP1_RETURNS/A_claude-design/",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEFS_PARALLEL_JOBS_R1.md"
    },
    {
      "id": "brief-mvp1-B-dialog",
      "title": "MVP-1 · B · Lorekeeper-Auftrag + Bewohner-Zeilen",
      "badge": "READY · CHATGPT / CLAUDE CHAT",
      "status": "ready",
      "provider": "ChatGPT mit GitHub oder Claude Chat (Paket B_chat_mvp1-dialog.zip)",
      "desc": "Dialog-JSON DE/EN mit Kartenquelle (deckId + cardNumber) für die MVP-1-Runde. Für Stufe 4a. Rückgabe: tools/KFB-ToolBox/_inbox/MVP1_RETURNS/B_chat/",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEFS_PARALLEL_JOBS_R1.md"
    },
    {
      "id": "brief-mvp1-C-character-cards",
      "title": "MVP-1 · C · Figuren-Karten-Inventur",
      "badge": "READY · COWORK (LOKAL)",
      "status": "ready",
      "provider": "Cowork auf Georgs Mac (lokaler Dropbox-Zugriff nötig)",
      "desc": "Modelle, Augen-Profile, Props, Sitz je MVP-Bewohner; DRAFT kfb.character-card/1; Eye-Rig-Kopien-Inventur. Für Stufe 4a.",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEFS_PARALLEL_JOBS_R1.md"
    },
    {
      "id": "brief-mvp1-D-kaykit-research",
      "title": "MVP-1 · D · KayKit-Creator-Recherche (MVP-Fokus)",
      "badge": "READY · GROK / CHATGPT WEB",
      "status": "ready",
      "provider": "Grok bzw. ChatGPT Web",
      "desc": "Komposition, Kamera, Charaktere/Props, Farben; ergänzt research/kaykit-creator-tutorial-atlas-2026-10-10. Rückgabe: tools/KFB-ToolBox/_inbox/MVP1_RETURNS/D_research/",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEFS_PARALLEL_JOBS_R1.md"
    },
    {
      "id": "brief-mvp1-E-protopia",
      "title": "MVP-1 · E · Protopia Eremiten-Hügel (nach A)",
      "badge": "QUEUED · CLAUDE DESIGN",
      "status": "queued",
      "provider": "Claude Design (Paket E_claude-design_protopia.zip + Ergebnis A)",
      "desc": "Wie A für Protopia: Bergweg, Bach, Eremiten-Hügel mit Schreibpult, Farmer-Felder. Für Stufe 3a.",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEFS_PARALLEL_JOBS_R1.md"
    }
  ],
  "quickLinks_add": [
    {
      "title": "MVP-1 · Architektur-Review Post-MVP-Konzepte",
      "summary": "Fluff/Academy/Reputation gegen Lab: passt, vier Rezept-Felder, Spielschicht P0–P4.",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/docs/REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md"
    },
    {
      "title": "QA · Kritiker-Protokoll mit Bauqualität Q1–Q8",
      "summary": "Gemessene Bauqualität vor jedem Bild, Kamerasatz Nah, blinder Kritiker, Stopp-Regel.",
      "url": "https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/docs/QA_CRITIC_PROTOCOL_R1.md"
    }
  ]
}
```

## Auftrag 2 · Sync-Branch nach `main` (jetzt möglich)

PR #385 hat den Cloudflare-Build auf ein eigenes Ausgabeverzeichnis begrenzt. Damit ist das Gate für `sync/lab-rkit-2026-10-09` erledigt:
- Branch gegen den aktuellen `main` prüfen.
- Als PR vorlegen, mit grünen Checks.
- Nach Georgs Freigabe mergen.

Ausschlüsse wie bisher: keine lizenzierten Assets, kein `RKIT-R3/private/`, kein `docs/content-atlas`.

## Regeln

- Neuer Branch, PR, grüne Checks; Merge nach Georgs OK (wie #380/#383).
- Georg nie bitten, Git-Werkzeuge zu benutzen.
- Rückgabe als Return in `KFB_HUB/00_INBOX/wsa-work/`.
