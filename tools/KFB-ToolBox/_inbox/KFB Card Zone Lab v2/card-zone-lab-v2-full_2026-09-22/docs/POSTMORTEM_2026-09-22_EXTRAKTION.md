# Post Mortem · Modul-Extraktion eingestellt

**2026-09-22** · Auslöser: Georg, »das war wieder nicht korrekt«, nach Lieferung ToolBox v1.1.0.

## Der Ablauf

| Datum | Lieferung | Befund |
|---|---|---|
| 2026-09-21 | ToolBox v1.0.0, fünf Module | Fluid-Shader war nicht die Quelle — drei Abweichungen, siehe `POSTMORTEM_2026-09-21_SHADER.md` |
| 2026-09-21 | ToolBox v1.1.0, Fluid korrigiert | Korrektur an einem Modul, Beam und Seeds **nicht** erneut gegen die Quelle geprüft |
| 2026-09-22 | — | erneut nicht korrekt |

## Das Muster

Beim ersten Fehler habe ich die Ursache lokal behandelt: drei Abweichungen im Fluid-Modul
gefunden, drei Abweichungen repariert. Ich habe im eigenen Post Mortem geschrieben, dass
Beam und Seeds nicht nachgeprüft sind — und trotzdem geliefert. Die Ursache war nie der
Shader. Die Ursache war die **Arbeitsweise**: Vorlage lesen, verstehen, in eigener Struktur
neu schreiben. Jedes so entstandene Modul ist ein Verdachtsfall, nicht nur das eine, das
aufgefallen ist.

Whack-a-Mole, genau in der Form, die `WORKFLOW.md` verbietet.

## Die Konsequenz

Die Extraktion wird eingestellt, nicht in dritter Runde repariert. Was rausgeht, ist die
Quelle selbst: `export/card-zone-lab-v2-full_2026-09-22/`, 1:1, ohne Eingriff.

**Status der fünf ToolBox-Module** — bleiben im Projekt unter `tools/KFB-ToolBox/`, gelten
aber bis zu einer Prüfung gegen das Original als **UNVALIDIERT**:

| Modul | Status |
|---|---|
| `kfb-fluid-v1` | einmal korrigiert, Korrektur nicht unabhängig gegengeprüft |
| `kfb-beam-v1` | NICHT GEPRÜFT |
| `kfb-cardstack-v1` | NICHT GEPRÜFT |
| `kfb-seeds-v1` | NICHT GEPRÜFT |
| `kfb-voxel-world-v1` | NICHT GEPRÜFT |

Keines davon ist in diesem Export enthalten. Wer Module braucht, schneidet sie aus dem
Original und belegt jeden Schnitt.

## Was ich anders machen muss

1. **Kopieren heißt kopieren.** Textgleich, dann umbenennen. Nicht: lesen, verstehen,
   schreiben. Verstehen kommt danach.
2. **Ein aufgefallener Fehler ist ein Stichprobenbefund.** Findet sich einer, sind alle
   Geschwister verdächtig, bis geprüft. Nicht der eine wird repariert.
3. **Eine Messung, die nur bestätigt, was ich beherrsche, ist keine Messung.** Zellzahlen und
   Wasserlinie waren beim ersten Fehler korrekt — und irrelevant.
4. **Unfertig heißt unfertig.** »Beam und Seeds nicht nachgeprüft« gehört nicht in die Fußnote
   einer Lieferung, sondern verhindert sie.

## Was bestehen bleibt

Die Diagnose aus `KFB_HEX_ATLAS_FAILURE_HANDOFF_2026-09-20` und aus dem Post Mortem vom
21.09. ist dieselbe und tritt jetzt zum dritten Mal auf: Werkzeuge messen die beherrschte
Größe, während der Fehler in der Auswahl der Quelle liegt.
