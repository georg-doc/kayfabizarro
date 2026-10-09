# KFB Clay Stage · Session-Paket 09.10.2026

Von Claude Design an Georg / Web Lead / Coworker. Claude Design pusht nicht. Dieses ZIP + Preview ist die Lieferung, Integration macht der Web Lead.

## Stand in einem Satz
Billboards (sieben Clay-Familien) und Bühne mit Theatervorhang teilen einen Clay-Look und eine Rollenpalette. **R2 ist Referenzstand** (Georg 09.10.: „passt so mit TUNE für später"), R1 bleibt als Vergleich.

## Lesereihenfolge
1. `00_START_HERE.md` (diese Datei)
2. `HANDOVER.md` – Module, Schnittstellen, Einbau in die MVP-Slice, Abhängigkeiten
3. `BAUSTELLEN.md` – offene TUNE-Punkte, nach Priorität
4. `CHANGELOG.md` – additiv, R1 → R2
5. `code/KFB_Clay_Stage_R2/RETURN.md` – Ehrlichkeitstabelle des letzten Laufs

## Inhalt
```
00_START_HERE.md · HANDOVER.md · BAUSTELLEN.md · CHANGELOG.md
code/
  KFB Clay Stage R2.dc.html        Preview R2 (Referenz)
  KFB Clay Stage R1.dc.html        Preview R1 (Vergleich, unverändert)
  support.js                       DC-Runtime für die Previews
  KFB_Clay_Stage_R2/               Module R2 + RETURN.md + evidence/
  KFB_Clay_Stage_R1/               Module R1 + RETURN.md + evidence/
  KFB_Billboard_Family_v1/sequence.js   Code-Abhängigkeit der Billboard-Bühne (Quote-Pool, Sequenz)
  billboard-dummy-v1/h14-hypernorm.js   Code-Abhängigkeit (H14-Frame-Loader)
```

## Starten
Statischer Server im Ordner `code/` (z. B. `npx serve code`), dann `KFB Clay Stage R2.dc.html` öffnen. `file://` geht nicht (ES-Module).
- Bildschirm **Bühne + Vorhang** braucht WebGPU (Chrome/Edge aktuell).
- Bildschirm **Billboards** läuft mit WebGL. Ohne H13-Rahmen und H14-Frames (nicht im Paket, siehe HANDOVER §4) zeigen die Tafeln den Ersatzinhalt.

## Regeln, die beim Weiterbau gelten
- R2 nicht überschreiben. Weiterbau als R3-Kopie (`KFB_Clay_Stage_R3/`).
- Vorhang-Kern (`kfb-curtain-core.js`, Issue #372) wird nur importiert, nie kopiert oder geändert. Falten-Tuning ist ein Kern-TUNE beim Eigentümer.
- Eine Palette: Farben nur über `palette-roles.js → roles()`. Keine Hex-Werte in Modulen.
- Keine Assets im Paket: Modelle, Fonts, Frames, Bibliotheken kommen über jsDelivr/raw oder vom Host.
