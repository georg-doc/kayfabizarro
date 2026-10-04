# START HERE · KFB ToolBox · Claude Design Session Cut 2026-09-26 r2
**Einstieg:** `KFB ToolBox Production-02.dc.html` (Design Component; `support.js` liegt daneben). **Status:** LOAD_PASS in der Vorschau · Selbsttest in diesem Cut NOT_RUN · **Georgs Sichtabnahme offen**.

## Öffnen
1. Den Ordner über HTTP ausliefern (`python3 -m http.server`) und die DC öffnen. file:// geht nicht, weil die Owner-Module ES-Imports sind.
2. Actor ▾ »FrizzleBob · Ear Rig v5« → Reiter **Rigging**.
3. »…« › Self-test → alle Schritte PASS erwartet. Danach die Punkte in TEST_REPORT.md »Sichtprüfung« durchgehen.

## Neu seit r1 (Details: CHANGELOG.md, additiv)
Unten eine Leiste für Emotes, Viseme und Anim in jedem Reiter, wie in v18. Der Reiter **Animation Studio** hat den Namen gewechselt. Das 3D-Menü am Objekt kann jetzt auch Snap und Reset, die alte Werkzeugleiste ist entfernt. Rigging hat neue Teile: Ears (Dangle, Basis-Knochen), Body (dicker/dünner, Höhe) und Import · Export. Die Lider sitzen per Auto-Fit auf dem Augapfel und schließen per Glide oder Fold. Die Brauen haben XYZ-Skalierung und ein eigenes Leben. Talk wechselt beim gemalten Mund auf den Rig-Mund. Das Schatten-Rezept steht in `docs/LESSONS_SHADOWS.md`.

Weiterlesen: `HANDOVER.md` (WSA) · `docs/PET_STUDIO_FEATURE_MAP.md` (vollständiges Mapping + Sprintplan) · `NEXT_CHAT.md` (Onboarding für den frischen Chat) · `RECOVERY_PLAN.md`.
