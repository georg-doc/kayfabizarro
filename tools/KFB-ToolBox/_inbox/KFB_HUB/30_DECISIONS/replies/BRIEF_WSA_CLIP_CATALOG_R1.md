# Steuerung → WSA · Auftrag Clip-Katalog R1 (12.10.2026)

Für einen frischen WSA-Chat. Zuerst `replies/BRIEF_WSA_START_HERE_R1.md` lesen, dann diesen Auftrag. Branch für die Lieferung wie bisher: `docs/kfb-decisions-register-2026-10-11`, Ordner `replies/`.

## Warum
Der Motion-Leitfaden (`MOTION_GUIDE_R1.md` v0.2, V-177, V-179–V-181) braucht eine verlässliche Liste aller vorhandenen Animations-Clips, bevor die Bau-Sitzung Demos baut. Heute ist nur ein kleiner Teil im Lab.

## Auftrag
1. **Quellen:**
   - KayKit Character Animations 1.1 im Repo `media/3D_Assets/KayKit_Character_Animations_1.1/` (laut Leitfaden 139 Medium-Clips in 8 Packs, 34 Large in 6);
   - weitere KayKit-Animations-GLBs im Repo;
   - Quaternius Universal Animation Library, falls im Repo.
2. **Je Clip aus dem glTF-JSON:** Datei, Pack, Rig (Medium/Large), Clipname, Dauer in s, Schleife ja/nein (aus Name und Start-/Endpose, wenn ablesbar), betroffene Knochen (Ganzkörper, nur Oberkörper, nur Kopf).
3. **Tag-Schema der Motion Matrix** (Leitfaden §1d) je Clip vorschlagen, immer als Vorschlag markiert: TRIGGER, LAYER (Grundzustand, Ausdruck, Physik, Gameplay), EYE BEHAVIOR (lead/lag/lock/float), CAMERA READABILITY (gut/mittel/schlecht aus Chase-Kamera).
4. **Zuordnung:**
   - zu den Zuständen in Leitfaden §2b und §3b (Fortbewegung, 8 Emotionen);
   - zum Survival Kit MVP 1 (idle_breathe, look_at, blink, hop, turn_90);
   - zu den Kulturmechaniken §3f (Geschenke, Tanz, Debatte, Rauferei, Brick-Fish, Kayfabulieren, Fluff, Lesen).
5. **Lücken:** Welche Zustände und Mechaniken haben keinen Clip? „Nicht gefunden in …“.

## Ergebnis
`WSA_CLIP_CATALOG_R1.md` (Übersicht, Lückenliste, die 20 wichtigsten Clips fürs MVP) plus `clip-catalog.json`. Werte als gemessen oder Vorschlag kennzeichnen.
