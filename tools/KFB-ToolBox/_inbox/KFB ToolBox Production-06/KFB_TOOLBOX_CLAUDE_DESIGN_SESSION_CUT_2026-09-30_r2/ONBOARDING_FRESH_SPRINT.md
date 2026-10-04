# Onboarding · frischer Sprint (Claude Design, Projekt »KFB ToolBox«)
**Rolle:** Du arbeitest an `KFB ToolBox Production-06.dc.html`. Georg schreibt knapp, oft per Sprache, Deutsch. Tippfehler sind normal, lies die Absicht. Antworten kurz, ohne Vorrede.

## Zuerst lesen (in dieser Reihenfolge)
1. `docs/PROJECT_RULES.md` (CLAUDE.md): Schatten nach LESSONS_SHADOWS, Gesichtsfelder nur über face-mount.v1, Ohren über ear-dangle.v1.
2. `HANDOVER.md` → `CURRENT_STATE.md` → `TEST_REPORT.md`.
3. `HANDOVER_BLENDER_MCP.md` (was die Lane noch liefern muss), `HANDOVER_WSA.md` (was WSA tut).
4. `docs/LESSONS_SHADOWS.md` vor jedem Licht-/Schatten-Eingriff. `docs/RECOVERY_01_INVENTORY.md` = gültige Lückenliste.

## Arbeitsregeln
- Kleine Edits gezielt (str_replace), Neuversion nur bei großem Umbau. Nur gelaufene Tests heißen PASS, sonst NOT_RUN.
- Neue Gesichtsfelder gehören in `face-mount.v1.js`, nicht in die Oberfläche.
- Kein `//`-Kommentar mitten in einer einzeiligen Anweisung. `sc-if` immer mit `hint-placeholder-val`. Klammern nach Skript-Edits prüfen: ein Tippfehler im Logikblock macht die Seite leer (passiert am 30.09.).
- Metatext hinter »Notes«; neue Rigging-Abschnitte als `isHead`.
- Sprint-Ende: `ready_for_verification`, dann kurze Zusammenfassung.

## Ausgangslage
Lids (Hinge/Slide, Round/Cut, Level/Roll), Ohren (Floppy, Wind, Presets), angepasster Mund (Fit to head) sind in P06. Offen: Georgs Sichtprüfung, Augenkanten-Feinheit (12 Schritte vs. Toleranz), Mund-Abnahme 1–7.

## Sprintplan
| # | Sprint | Inhalt | Gate |
|---|---|---|---|
| S0 | **LOOK-CALL** | Level/Roll-Lider, Mund Fit On/Off, Kantenentscheidung; danach Startwerte als Defaults | Georgs Urteil |
| S1 | **MOUTH-ACCEPT** | FB-MOUTH-FIT-01 §6 Checks 1–7 als Selbsttest in P06 (Muster 21c–21f) | 7/7 PASS auf frizzlebob-earrig-v5 |
| S2 | **LIDS-EDGE** | 12 Schritte Rundung, Check 7 neu messen, R2 (unregelmäßige Lidränder) | Check 7 PASS oder Toleranz-Entscheid |
| S3 | **REGRESSION** | P05, Cube Pets, Selbsttest 01–28e nach den Shared-Lib-Änderungen | alle PASS oder Befundliste |
| S4 | **BROWS-TUBE (R5)** | Röhrenbrauen als Standard, Stroke-Brauen Legacy, Haut-Anschmiegen wie Mund | Georgs Sichtprüfung |
| S5 | **BODY-02 / BODY-03 / FILE-01 / DRIVER-02 / ROSTER-02 / VOICE-01 / LAB-R3 / HUNKY-01** | siehe docs/ONBOARDING_FRESH_CHAT.md (Sprintplan S1–S8) | je Gate dort |

## Erste Handlung im frischen Chat
Georg fragen: »Level/Roll-Lider und angepasster Mund abgenommen?« Ja → S1/S2. Befunde → erst diese, im selben File.
