# Job · WS0_2026-09-15 · KFB FrankenStein ToolBox (WS0) · Quelllieferung

Status: **REVIEWED** (Quellstand geprüft und übernommen · Abnahme des sichtbaren Stands bei Georg)
Owner der Arbeit: WS0 (Authoring-Workspace) · Prüfung und Ablage: ToolBox/WSA
Ziel-Consumer / Implementation-SSOT: unverändert der WS0-Authoring-Workspace. Die ToolBox ist Eingang und Prüfstelle, **nicht** Implementation-Owner.
Öffentlich freigegeben: YES für diesen Umfang (Quelltext, Verträge, QA-Bilder). **Keine Schriftdateien, keine Tokens, keine privaten Berichte** — im Paket ist auch keine.

## Quelle und Identität

| | |
|---|---|
| Archiv | `tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip` |
| Größe | 1 846 232 B |
| sha256 | `948d195017e2ab7dd26f3e9c5cb4f01d00fa614e0e6425431db04e43b2393c5b` |
| Bezug | `georg-doc/kayfabizarro@main`, abgerufen 15.09.2026 01:40 UTC über `raw.githubusercontent.com` |
| Commit | **UNRESOLVED** — der Connector liefert für `tools/KFB-ToolBox/` den Tree `a3adb84692fd`, keinen Commit-SHA. Nicht geraten. |
| Referenz-Pin (WS0) | `525288d67a9fdfd94caacf19e47b4ba333dc1ca2`, Unterbaum `tools/KFB-ToolBox/kfb-rigs-embed-v3/` |

Das Original liegt unverändert unter `original/`. ⚠ Der Dateiname wurde bei der Ablage von
`… (WS0).zip` zu `… -WS0-.zip` bereinigt (Klammern); **Bytes und sha256 sind unverändert**,
Nachweis in `SOURCE_MANIFEST.json`.

## Ordner dieses Jobs

    original/        Archiv unverändert
    unpacked/        113 Einträge, beim Entpacken je Datei sha256 berechnet
    SOURCE_MANIFEST.json   Archivhash + 113 Dateien mit Bytes und sha256
    qa-wsa/          eigene Prüfungen (Präfix -wsa, getrennt von WS0s qa/)
    START_HERE.md · DELTA_WSA.md · RETURN_WSA.md   Einstieg, Delta, Rückgabe

Archivinhalt: 104 Dateien `A_QUELLSTAND/` (davon 87 `src/`, 11 `qa/`) · 5 `B_OBERFLAECHE/` ·
3 `docs/` · `LIES_MICH.md`.

## Zuerst lesen — in dieser Reihenfolge

1. `unpacked/LIES_MICH.md` — WS0s Lesepfad, zwei Ergebnisse, vier bezahlte Fallen.
2. `unpacked/A_QUELLSTAND/RETURN.md` — Inhalt, Startweg, Offenes.
3. `DELTA_WSA.md` (hier) — nachgerechnetes Delta gegen den gepinnten Rig-Embed-Stand.
4. `RETURN_WSA.md` (hier) — was wir selbst gemessen haben, getrennt nach Beleg.
5. `unpacked/A_QUELLSTAND/DELTA.md` · `DELTA_FOLGE_01.md` — WS0s eigene Rechnung.

`unpacked/docs/LIVING_frizzlegraft.md` (171 kB) ist Chronik: nur bei konkreter Frage öffnen.

## Startweg — gemessen, nicht angenommen

Der Quellstand startet **über HTTP aus dem entpackten Ordner**, ohne Build und ohne Paketmanager:

    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB FrankenStein Studio v17.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB Rigging Lab v1.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB Animation Lab v3.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB Recherchi Lab v1.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB Vergleich Graft vs Carl v1.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB FrizzleDummy Lab v1.dc.html
    _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/KFB Mech and Vehicle Rig v2.dc.html

⚠ `file://` trägt nicht (ES-Module). ⚠ **Die Ordnerstruktur ist Teil des Vertrags**: Studio v17
setzt `__KFB_MODBASE = petstudio-v9/` und lädt `./studio-v7/…` **und** `../lab-v6/…`.
Umsortieren bricht beide Wege. Nachgeprüft in `qa-wsa/closure-wsa.json`.

## Bestand und Nachweise

- **SOURCE FACT** · 101 von 101 Zeilen in `A_QUELLSTAND/CHECKSUMS.sha256` stimmen mit den beim
  Entpacken berechneten Hashes: `qa-wsa/checksums-wsa.json`.
- **SOURCE FACT** · Modulschluß je Einstieg, 0 unauflösbare lokale Modulreferenzen: `qa-wsa/closure-wsa.json`.
- **SOURCE FACT** · Identität gegen den Repo-Stand der Embed-Module: `qa-wsa/identity-wsa.json`.
- **TESTED RESULT (WSA, 15.09.)** · alle **7** Blätter im Browser aus dem frisch entpackten Ordner
  gestartet: `qa-wsa/coldstart-*-wsa.png`, Beurteilung in `RETURN_WSA.md`.
- **historische Donor-QA (WS0, 15.09.)** · `unpacked/A_QUELLSTAND/qa/` — getrennt geführt, nicht als heute ausgeführt gezählt.

## Abnahme / offene Fragen

Wer entscheidet den sichtbaren Stand: Georg. Nicht angefragt.
Konkret fehlende Tests: Feldabdeckung je Kanal · Rundlauf Export/Import auf frischer und
vorhandener Sitzung · vier Prüfgrößen · Klangbank · Publikationsidentität. Liste in `RETURN_WSA.md`.

## Verlauf (additiv)

| Datum | Status | Änderung / Entscheidung | Beleg |
|---|---|---|---|
| 2026-09-15 | RECEIVED | Archiv über den Repo-Rohpfad geholt, Hash festgehalten, in diesen Jobordner entpackt | `SOURCE_MANIFEST.json` |
| 2026-09-15 | REVIEWED | Prüfsummen, Modulschluß, Identität, Feldzahlen nachgerechnet; 7/7 Blätter gestartet | `qa-wsa/` |
| 2026-09-15 | REVIEWED | Ergebnis B (`B_OBERFLAECHE/`) unangetastet mitgesichert, **nicht** geprüft und **nicht** eingespielt | Auftrag: B bleibt separat |

## Abschluß / Archivierung

Angenommene Ausgabe: dieser Jobordner (Quellstand liegt als lesbarer Baum vor, kein zweiter Fork).
Return: `RETURN_WSA.md`.
Ziel `_inbox/archiv/WS0_2026-09-15/` erst nach Georgs Abnahme des sichtbaren Stands und nach
aktualisierten Referenzen in MANIFEST, MASTERPLAN und Startseite.
