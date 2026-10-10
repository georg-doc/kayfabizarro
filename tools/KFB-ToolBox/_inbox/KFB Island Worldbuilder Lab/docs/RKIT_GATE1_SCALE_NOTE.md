# RKIT R3 · Gate 1 · Maßstab-Korrektur (Steuer-Sitzung, 2026-10-08)

Bezug: `blender/rkit-r3-p1-junction-profiles-2026-10-08` · `KFB_PROFILE_FAMILIES_v013.md`. Kontrakt: `docs/SCALE_CONTRACT_K2.md` im Island Worldbuilder Lab.

1. **Spurbreiten 3,75 / 4,0 / 4,5: PASS.** Sie sind aus der gemessenen Autobreite abgeleitet und bleiben.
2. **Figur: 3,64 Lab-Einheiten (= 1 H), nicht 1,9 m.** Die 1,9 m stammen aus einem falschen Kommentar in `src/residents/resident.ts` (inzwischen korrigiert). Es gibt keine Meter, sondern Einheiten in H und MacroCell (MC = 6,4 = 4 KayKit-Einheiten).
3. **Neu rechnen:**
   - Gehweg mindestens 1,3 H ≈ 4,8 (statt 2,5);
   - Bordstein ≈ 0,35 (statt 0,18);
   - Wand und Leitplanke ≈ 1,3 (statt 1,0);
   - Durchfahrtshöhe mindestens 5,8, Fußgänger mindestens 4,8.
4. **TOWN und DRIVING_SCHOOL:** Gesamtbreite auf MC-Vielfache (12,8 oder 19,2), damit Häuser auf dem Zellraster an der Straße stehen. COUNTRY, MOUNTAIN und HIGHWAY sind frei.
5. **Rennen und Welt in einem Maßstab (Georgs Richtung):** Rennautos und Weltautos haben dieselbe Größe; es gibt keine Sonderklasse.
   - Bitte vorschlagen, wie das ohne Bruch geht, zum Beispiel RACE-Profile × 1,46 auf 6 lange Autos.
   - Den Joyride-Bestand (`track-look`, Rennphysik, Kamera) dabei nicht anfassen, sondern daneben abbilden.
   - Erst den Vorschlag zurückmelden, dann umsetzen.
6. Erst danach Gate 2.
