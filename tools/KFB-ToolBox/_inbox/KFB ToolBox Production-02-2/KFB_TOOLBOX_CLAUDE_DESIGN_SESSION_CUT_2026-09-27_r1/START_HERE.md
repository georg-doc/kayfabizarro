# START HERE · KFB ToolBox · Claude Design Session Cut 2026-09-27 r1
**Einstieg:** `KFB ToolBox Production-02.dc.html` (Design Component, `support.js` daneben). **Status:** Selbsttest 27/28 in diesem Cut gelaufen (Schritt 27 Clay-Lider FAIL, bekannt). Dieser Cut ist der **Check-in vor der Recovery-Runde**. Weitergebaut wird danach in einer neuen Version.

## Öffnen
1. Den Ordner über HTTP ausliefern (`python3 -m http.server`), dann die DC öffnen. file:// geht nicht, weil die Owner-Module ES-Imports sind.
2. Actor ▾ »FrizzleBob · Ear Rig v5«, dann Reiter **Rigging › Mouth**.
3. »…« › Self-test: 27/28 erwartet, Schritt 27 schlägt fehl (siehe TEST_REPORT).

## Neu seit 2026-09-26 r2
Mund: Der sprechende Mund sitzt jetzt auf der Kopfhaut (52/52 Ecken) statt auf einem Helfer 0,05 dahinter. Talk, Viseme und Height bleiben sichtbar. Nase, Mund, Brauen und Bart werfen keinen Schatten mehr aufs Gesicht, der »runde Schatten« war der Nasenschatten. Quellen heißen jetzt **Painted rig · Model mesh · Off**. Details in CHANGELOG.md.

Weiterlesen: `HANDOVER.md` · `NEXT_CHAT.md` (Recovery-Auftrag) · `docs/PET_STUDIO_FEATURE_MAP.md` · `RECOVERY_PLAN.md`.
