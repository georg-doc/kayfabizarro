# HANDOVER · KFB Card Zone Lab v2 — Voll-Export 1:1

**An:** WSA Chat Review
**Von:** Claude Design (KFB)
**Datum:** 2026-09-22
**Artefakt:** `export/card-zone-lab-v2-full_2026-09-22/`

---

## SOURCE

- `KFB Card Zone Lab v2.dc.html` und alle lokalen Abhängigkeiten aus dem Projekt
  *Hex Assets Worldbuilding*, Stand 2026-09-22.
- Bestandsdokumente unter `docs/bestand/` stammen aus `docs/` desselben Projekts
  (Stand 2026-07-26 bzw. 2026-08-02, unverändert).
- Post Mortem 21.09. aus `tools/KFB-ToolBox/POSTMORTEM_2026-09-21_SHADER.md`, unverändert.
- Externe Assets: SourceRefs auf `georg-doc/kayfabizarro@main`, nicht kopiert.

## DECISION

Die Modul-Extraktion (ToolBox v1.0.0 / v1.1.0) wird **eingestellt** statt ein drittes Mal
repariert. Ausgeliefert wird die Quelle selbst, unverändert, mit beiden Post Mortems.
Begründung in `POSTMORTEM_2026-09-22_EXTRAKTION.md`.

Die fünf ToolBox-Module bleiben im Projekt, sind aber **nicht** Teil dieser Lieferung und
gelten als unvalidiert.

## IMPLEMENTATION

Kopiervorgang, keine Codeänderung. 11 Code-/Datendateien, 6 Bestandsdokumente,
4 neue Dokumente, 3 Screenshots.

Neu geschrieben für diese Lieferung:
- `README.md` — Start, Inhalt, Abgrenzung
- `docs/CODE_MAP.md` — 143 Methoden nach Aufgabe, mit Zeilennummern
- `docs/DEPENDENCIES.md` — lokaler Importgraph, externe URLs, Fehlermodi
- `docs/POSTMORTEM_2026-09-22_EXTRAKTION.md`

**Am Lab-Code wurde nichts geändert.** Byteweise identisch mit der Projektdatei.

## TESTED RESULT

| Prüfung | Ergebnis |
|---|---|
| Dateigleichheit Export ↔ Projekt | bestätigt (Kopiervorgang, kein Schreibzugriff auf den Code) |
| Importgraph vollständig | geprüft: alle `import()`, `<script src>` und `fetch()` auf relative Pfade aufgelöst, alle Ziele enthalten |
| Export-Ordner geladen | Oberfläche baut auf, Bedienleisten vollständig, Konsole zeigt genau eine Meldung (`SCRIPT failed to load`) — **dieselbe Meldung wie beim Original an seinem Projektpfad**, also keine Regression durch den Export |
| Export auf fremdem Webserver | NOT_TESTED — der Test lief unter demselben Origin wie das Projekt; das belegt keinen Fremdserver und kein WebGL-Bild |
| ToolBox-Module gegen Quelle | NOT_TESTED — deshalb nicht Teil der Lieferung |

Die Screenshots unter `evidence/` zeigen die **ToolBox-Bank** nach der Fluid-Korrektur vom
21.09. Sie sind Kontext zum Post Mortem, kein Beleg für diesen Export.

## EXPORT

ZIP aus `export/card-zone-lab-v2-full_2026-09-22/`.

## PUBLIC DEPLOYMENT

Keines. Claude Design pusht nicht nach GitHub. Integration liegt beim Web Lead.

## GEORG ACCEPTANCE

Offen.

## OPEN

1. Sollen die fünf ToolBox-Module gegen das Original geprüft werden, oder ersatzlos gelöscht?
2. Wenn geprüft: wer prüft — derselbe Chat, der sie geschrieben hat, ist der schwächste Prüfer.
3. Start aus dem Export-Ordner auf einem echten Webserver ist noch von niemandem gelaufen.
4. `asset-repo.json` ist ein 335-KB-Spiegel im Export. Offen, ob das Review den Spiegel will
   oder eine Referenz auf `registry/assets/v1`.

---

## Prüfpfad für das Review

```
python3 -m http.server 8000
open http://localhost:8000/KFB%20Card%20Zone%20Lab%20v2.dc.html
```

Erwartet: Voxel-Insel mit Kartenzone, Wanne mit Fluss, Kartenstapel, Projektor.
Das Wasser muss **wandernde Schlieren** zeigen und darf **keinen grauen Schaumsaum** haben.
Zeigt es einen Saum, ist der Shader-Pfad falsch — dann fehlen `waterdudv.jpg` / `water.jpg`
(`DEPENDENCIES.md`, Abschnitt Extern).
