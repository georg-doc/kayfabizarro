# Handover · Claude Code · KFB ToolBox Production-08
*14.10.2026 · Stand nach FB-LIDS-SKIN-A*

## Einstieg
`KFB ToolBox Production-08.dc.html`, lokal über einen Server starten (z. B. `python3 -m http.server`). Standalone läuft nicht.

## Was heute passiert ist
- `Lid Reference.dc.html`: drei Lid-Aufbauten × sechs Ausdrücke. Georg wählt **A** für FrizzleBob v5. B und C bleiben Optionen für KayKit-Figuren.
- `kfb-lib/clay-lids.v1.js`
  - mech `skin` (A): Scharnier im Kopfrahmen, Neigung aus dem Emote, nicht aus `e._lids.rotation.z`, volle Dicke, Schalen enden hinter dem Ball, Mandel-Ecken.
  - mech `flap` (ebener Schnitt). Thin shell wirkt jetzt auch auf hinge/slide/flap/skin.
  - Eingefrorene Stände: `kfb-lib/_ref/clay-lids.v1.lids04.js`, `…lids05.js`.
- `kfb-lib/hair-tufts.v1.js`: Zacken werfen keinen Schatten (Saum am Haaransatz).
- Production-08 migriert FB einmalig auf A (Flags `flap02`, `skinA`, `skinA2`, `skinA3` im Clay-Eintrag).
- Ausgangsstand: `handover/FB_V5_RIG_BASELINE_2026-10-14.json`.

## Entscheidung 14.10.
FrizzleBob v5 läuft vorerst mit den **EyeRig-Schalen** (Lid style › Shell), nicht mit den Clay-Lidern. Skin A bleibt im Code als Option, das endgültige Lid kommt aus Blender.

## Bekannt offen
1. **Lider endgültig in Blender** (`handover/BLENDER_BRIEF_FB_LIDS_A_2026-10-14.md`). Die Laufzeit-Schalen bleiben Ersatz, bis das GLB da ist. Danach liest die ToolBox Knochen oder Shape Keys aus dem GLB, statt Schalen zu bauen.
2. **Besitzer:** Laut `skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md` gibt es keinen zweiten EyeRig-Besitzer neben der EyeRig Workbench. `clay-lids.v1.js` muss dorthin oder ausdrücklich zum Besitzer erklärt werden.
3. Abnahmetests prüfen hinge/slide. Für skin fehlen: Ecken auf einer Linie, geschlossen = zu, Pupille durch Lid.
4. Check 7 (Kantenschärfe) offen. Editor-Checks E1–E9 nicht neu gelaufen.
5. Repo-Schreibweg 403. Übergabe weiter per ZIP.

## Nächster Arbeitsstrang · Oberfläche (Georg 14.10.)
Kein Schnellfix, erst ein Konzept:
- Studio und Rigging haben beide Rigging-Optionen. Die Aufteilung der Reiter und Workflow-Schritte ist nicht sauber.
- Die untere Leiste (Emotes / Viseme / Anim) ist zu dick.
- Farben sind schwer zu finden. Haut und Haare stehen in Studio › Body › Colour zones, Lid, Brauen und Nase je im eigenen Rigging-Teil. Seit 14.10. haben die Modell-Brauen und die Modell-Nase (Quelle »original«) einen eigenen Farbregler (Rigging › Brows/Nose › Colour, gespeichert als `partColors` im Actor).
- **Jedes Element ist ein eigener Körper** mit eigenem Inspektor (Farbe, Form, Lage, Material), wie im früheren FrankenStein Studio: Kopf, Augen, Lider, Brauen, Nase, Mund, Bart, Ohren, Haare. Anklicken auf der Bühne → genau dieses Teil im Inspektor.
- Eine Farbübersicht je Figur an einer Stelle (alle Teile untereinander), zusätzlich zu den Reglern im jeweiligen Teil.
- Ziel: festhalten, welche Werkzeuge, Ansichten und Workflow-Schritte es gibt und welche Elemente in welcher Ansicht stehen. Vor dem Aufsetzen als zentrale Werkzeug-Seite (GPT Site, laut `KFB_SURFACE_HIERARCHY_CURRENT_2026-10-06.md` »ToolBox = genau ein Werkzeug-Router«).
