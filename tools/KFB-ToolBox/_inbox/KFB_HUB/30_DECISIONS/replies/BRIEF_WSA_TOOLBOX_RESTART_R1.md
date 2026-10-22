# WS0 → WSA work · Wiederaufnahme ToolBox · R1 · 2026-10-22 (V-682, V-658, V-669)
**Georg hebt die Pause mit diesem Auftrag auf** (er reicht ihn selbst weiter).
**Tier 0:** Erst den Bestand aus dem Charakter-Register wiederherstellen, dann FrizzleBob mit Referenzbild. Keine neuen Figuren, keine neuen Einstellungen, keine Glättung oder Ersatzgeometrie.

## 0 · Aufräumen (nur mit Georgs Ja direkt an dich)
Aus `WSA_TO_WS0_WORKDIR_CLEANUP_R1.md` nur die Gruppen „doppelt“ (`kayfabizarro-voice-r1/`, 7,7 GB) und „Zwischenstände“ (0,8 GB) löschen, und erst, wenn Georg es dir direkt bestätigt. „behalten“ und „unklar“ bleiben.

## 1 · Roster aus dem Charakter-Register
- **Quelle:** `CHARACTERS_R1/` (Register-Branch `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/CHARACTERS_R1/`): `index.json`, `characters/<id>/character.json`, `aliases.json`.
- **Studio-Auswahl:** Die Auswahl im Studio und Dramatis Personae lesen dieselben IDs aus `index.json`. Anleitung für Dramatis Personae: `CHARACTERS_R1/DRAMATIS_PERSONAE_LINK.md`.
- **Aussehen:** über `appearance.figureRefs` im Register (Schema kfb.character/1.1, Feld `kind`: canonical, scene_variant, state, pose, duplicate); geladen wird die Karte mit `kind: canonical`. Figuren ohne Karte erscheinen in der Liste als „Karte fehlt“, werden nicht geladen und gemeldet. Nie ein rohes GLB (V-391, V-214).
- **Wiederherstellen ohne Neubau:**
  - Pencil und Eraser über ihre B46-Figurenkarten (`50_BLENDER/B46/data/pencil.figure.json`, `eraser.figure.json`);
  - die Kit-Charaktere aus dem Register;
  - Textur-Varianten (z. B. Hexe A/B) als eigene Looks.
- **Gespeicherte Konfigurationen:** Früher gespeicherte ToolBox-Konfigurationen (kfb.pets-Profile) suchen und zuordnen, nicht neu einstellen.
- **Lader-Prüfungen bleiben** (V-391, V-395): Augen-Rig ist Pflicht, Karten ohne eyeRig werden sichtbar abgewiesen. Offene Design- und Kandidaten-Karten sind in der ToolBox erlaubt (Figuren-Werkstatt, V-409).
- **FrizzleBob bleibt außerhalb von Teil 1:** keine alten FB-Karten oder -Profile laden, FB nicht im Paritäts-Test, bis der FB_CANON-Hash gesetzt ist (V-658).
- **Parität als Test:** Fehlt eine Register-Figur in der Auswahl, schlägt der Test fehl.

## 2 · FrizzleBob, erst Referenzbild, dann Export
1. **Referenzbild:** In der ToolBox P08 laden, mit Georgs Werten (Rig-Augen, Brauen −0,08, Pitch 8, Nase, Kopf, Ohren unverändert). Nur zwei Abweichungen von P08: Die Lider sind die E2-Lidhaut nach `replies/E2_REFERENCE/E2_approved_closed_lid_skin.png` statt der v6-Schalen (V-420, V-669), und der Mund ist sichtbar und sauber, ohne den dunklen Schmierfleck aus R2.
   - Bilder über die Proof-Stage mit kfb-stage-light: Gesicht nah (Augen offen, halb, zu, Mund sichtbar), vorn, ¾, Seite.
   - Diese Bilder sind die Vorlage. Georg nimmt sie ab, bevor exportiert wird.
2. **Export erst nach Georgs PASS:**
   - E2-Lidhaut aus clay-eyelid.v2 mit derselben Knete wie die Haut, keine v6-Schalen (V-420).
   - Mund sauber und sichtbar, Kopftextur wie in der Vorlage.
   - Prüfung: 1,81 m, alle 38 Clips.
3. **Bildvergleich:** Jede Exportansicht neben der Vorlage. Jede sichtbare Abweichung (Lider, Mund, Kopftextur, Augen) ist FAIL, bevor Georg etwas sieht.
4. **Rückmeldung:** `WSA_TO_WS0_FB_CANON_R4_RETURN.md`. Erst nach Georgs PASS trägt WS0 den Hash in FB_CANON.json ein. Ohren-Reduktion (V-643) kommt danach.

Nichts live, kein Merge.
