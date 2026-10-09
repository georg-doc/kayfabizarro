# Auftrag an WSA-Work · Hub-Update, Merges, Masterplan-Abgleich (2026-10-09)

Token-sparend, eine Slice. Alle Quellen liegen auf GitHub `georg-doc/kayfabizarro`, Branch **`sync/lab-rkit-2026-10-09`**, und zusätzlich in Georgs Dropbox unter `CLAUDE/KFB Island Worldbuilder Lab/`. Die Steuer-Sitzung (Claude Code) pusht neue Stände künftig selbst auf diesen bzw. neue `sync/…`-Branches.

## 1 · Merges (Georg: lieber mergen als lose Enden)

1. **PR #380** „Asset Librarian private audio intake bridge“: als ready markieren und mergen, wenn die Checks grün sind. Danach kurz prüfen, ob der Librarian v10 weiter lädt.
2. **Branch `sync/lab-rkit-2026-10-09`** nach `main` mergen. Er fügt nur zwei Ordner hinzu:
   - `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/`
   - `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/RKIT-R3/`

   Vorher prüfen, ob das Cloudflare-Deployment die Dateizahl verträgt (+≈ 750 Dateien; größte Datei < 20 MB). Falls nicht, melden statt kürzen.

## 2 · Hub-Update (kfb-hub)

Eine Karte bzw. einen Abschnitt **„MVP Drive Loop · Island Worldbuilder Lab“** anlegen oder aktualisieren. Alles nur verlinken, nichts kopieren:

| Eintrag | Pfad (im Lab-Ordner) |
| --- | --- |
| Masterplan R2 (SSOT) | `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` |
| Projektstand (neueste Einträge oben) | `docs/PROJECT_STATE.md` |
| Projektkontext, Glossar | `docs/KFB_PROJEKTKONTEXT.md`, `docs/KFB_GLOSSAR.md` |
| Regelwerke | `docs/QA_RULEBOOK_ENVIRONMENT_R1.md`, `docs/QA_RULEBOOK_TRANSITIONS_R1.md`, `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`, `docs/SCALE_CONTRACT_K2.md`, `docs/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` |
| Recherche (NotebookLM) | `docs/research/` (P1 Sprenkel, P2 Straßen, P3 Komposition), Prompts `docs/notebooklm/KFB_DEEP_RESEARCH_PROMPTS_R1.md` |

**Briefings zum Abrufen, je mit Empfänger:**

| Briefing | Empfänger | Pfad |
| --- | --- | --- |
| Quellen für HUD Sprint R4-0 (ENV_ROLES, kfbBlend-Pfad, Mauerwerk A) | HUD/Flug-Session (Claude Design) | `deliveries/HANDOVER_HUD_FLIGHT_R4_0_SOURCES_2026-10-09.md` |
| HUD + Flug-VFX R1 (Ursprungsbriefing) | HUD/Flug-Session | `deliveries/BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md` |
| Vorhang im Claymation-Look R1 | Bühnen-Session (Claude Design) | `deliveries/BRIEF_CLAUDE_DESIGN_CURTAIN_CLAY_R1.md` |
| Mauerwerk-Familie A (31 Module) | HUD-, Bühnen-Session, Blender-Coworker | `…/KFB Racetrack Blender Kit/RKIT-R3/masonry_a/README.md` |
| Brick-Fish aus Familie A | Blender-Coworker (Mac mini) | `…/RKIT-R3/masonry_a/HANDOVER_BRICK_FISH.md` |
| Landmarke KFB Town: Königsturm (Golden Sample) | RKIT bzw. Blender-Coworker, später | `deliveries/BRIEF_LANDMARK_KFB_TOWN_TURM_R1.md` |

**Status, den der Hub zeigen soll:**
- RKIT Bauweise-Blatt freigegeben, Bau läuft (Familie A fertig, Gehweg/Bord in Arbeit);
- Sprenkel S1 angenommen;
- HUD R3 und Clay Stage R2 mit TUNE angenommen;
- nächste Lab-Stufe: R2D-Inselbasis.

## 3 · Masterplan-Abgleich

- Den Masterplan R2 mit dem Stand im Hub und den Sites abgleichen.
- Widersprüche oder fehlende Slices als kurze Liste an Georg und die Steuer-Sitzung melden, ohne den Masterplan selbst zu ändern.
- Eigene offene Aufträge mit Status melden: FBX/OBJ-Vorschau, externe 3D-Suche.

## Regeln

- Nichts doppelt ablegen, nur verlinken.
- Keine gekauften Unity-Assets ins öffentliche Repo.
- Rückmeldung an Georg: Merge-SHAs, Hub-Link, Abgleichsliste.
