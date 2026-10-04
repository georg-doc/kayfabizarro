# TEST REPORT · 2026-09-25

| Test | Ergebnis | Wie |
|---|---|---|
| World-Selbsttest `wi1-selftest.js` | **PASS 26/26** | im Claude-Design-Preview ausgeführt nach der letzten Codeänderung (Eckmasten), live auf `window.__wb2d`; Nutzer-Speicher gesichert/wiederhergestellt |
| WB2-Sandbox bootet ohne `world` | **PASS** | iframe im Preview: Status „source actor · Melee_Unarmed_Idle · texture bound", Key `kfb-wb2-terrain-sculpt-01`, Doc-ID `wb2-terrain-sculpt-01`, kein tile |
| WB2-Selbsttest 34/34 | NOT_RUN | löscht den Nutzer-Speicherschlüssel; Web führt aus |
| Human Gate (11 Schritte) | NOT_RUN | Georg |
| Mobil | NOT_RUN | — |
| ZIP Clean-Run (statisch) | siehe unten | Einträge, SHA-256, relative Imports gegen das entpackte Archiv |
| ZIP im Browser entpackt geöffnet | NOT_RUN | aus dieser Umgebung nicht möglich |

## Selbsttest-Zeilen (26)
Zone durch wd1-seam · Stadt = alle Gebäude · WB2-Terrain = Welt-Tile · WB2-Dokument · Zustände gebunden · Walk-Tempo = Clip × Kadenz · ein Face-Owner · Walk: Strecke = Tempo × Zeit · Walk: Zustand aus Bewegung · Walk: Standfuß-Rutschen < 25 % · Run ×3 (dieselben) · Sprung Start→Air→Land · Apex in Metern · Bodenkontakt · Raise ändert Wahrheit · Mesh = Wahrheit · Walker auf gehobenem Gelände · Clear · Reload stellt Sculpt her · Play nach Reload · Boulder vorhanden · verschobenes Objekt fest · Objekt übersteht Reload · Tusche schließt Unsichtbares aus.
