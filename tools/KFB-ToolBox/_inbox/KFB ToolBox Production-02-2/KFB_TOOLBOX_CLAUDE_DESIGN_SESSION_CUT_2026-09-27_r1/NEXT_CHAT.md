# Onboarding · frischer Chat (Claude Design, Projekt »KFB ToolBox«)
**Rolle:** Du arbeitest an `KFB ToolBox Production-02.dc.html`. Georg schreibt knapp, oft per Sprache, auf Deutsch. Tippfehler sind normal, lies die Absicht.

## Zuerst lesen
1. `CLAUDE.md` (Projektregeln).
2. `handover/PET_STUDIO_FEATURE_MAP.md` und `handover/PARITY_STUDIO_V18_TOOLBOX.md`. Das sind die bisherigen Mappings, sie decken aber nur v18 ab.
3. `handover/LESSONS_SHADOWS.md`, bevor du Licht oder Schatten anfasst.
4. `github.md` (Repo, Pins). Schreibweg 403: nie »gepusht« behaupten.

## Auftrag: RECOVERY-01 (Georg, 27.09.)
Erst den jetzigen Stand einchecken (dieser Cut), dann in einer **neuen Version** weiterbauen. Vorher kommt die Recovery-Runde. Nichts ausbauen, bevor sie steht.
1. **Alle Vorgänger inventarisieren**, jede Funktion und jede Einstellung:
   FrankenStein Studio v18 (`tools/KFB-ToolBox/stage-first/src/`, `_inbox/V18_BIRTHDAY_7_2026-09-16/`) · »Patch-Studio« (VOICE_INPUT_UNCERTAIN: vermutlich Pet Studio v9–v13 unter `kfb-rigs-embed-v3/petstudio-v9/`, zuerst bei Georg nachfragen) · WS0-Werkzeuge (`_inbox/WS0_2026-09-15/`) · Stage-First v1/v3 · Round1 · Coherent-01 · Production-01 · Animation Lab v2/v3 (v1 fehlt, SOURCE_REQUIRED).
2. **Gegen Production-02 mappen.** Zeile für Zeile mit dem Status HAVE / MOVED (liegt in einem anderen Reiter) / SCHWUND (schlechter als vorher) / MISSING / OUT (bewusst raus). Quelle mit Datei und Zeile angeben, nicht aus dem Gedächtnis.
3. **Lückenliste plus Nachzieh-Reihenfolge**, kurz und ohne Metatext.
4. »Webcheck« (VOICE_INPUT_UNCERTAIN): klären, ob damit ein Abgleich gegen das Repo auf GitHub gemeint ist oder eine Prüfung im Browser. Im Zweifel beides: Repo-Stand lesen und jede HAVE-Zeile in der Vorschau klicken.

## Georgs konkrete Befunde als Startpunkte
- Viseme fehlen im Studio: kein Mund-Reiter. v18 Face hatte Show viseme, Form je Visem, 5 durchspielen, Default look, Asymmetry (evidence/georg-2026-09-27-0441-v18-face-visemes.png).
- Zu viele Metatexte und Messwerte in den Panels.
- Die untere Palette überdeckt die Bühne, Animationen sind schlecht zu sehen.

## Arbeitsregeln
- Kleine gezielte Edits, keine Neuschreibungen. Kein `//`-Kommentar mitten in einer einzeiligen Anweisung.
- Nur wirklich gelaufene Tests heißen PASS. Am Ende jeder sichtbaren Änderung `ready_for_verification`.
