# Startbriefing · MVP-1 Bau-Sitzung R1 („Town + Protopia“) · Auftrag jetzt: nur Stufe 1

Stand: 2026-10-10 · von der Steuer-Sitzung (Claude Code, „KFB Open World Visual Terrain Recovery Lab“) · Auftraggeber Georg.

## 0 · Rolle und Zusammenarbeit

- **Du bist die Bau-Sitzung für MVP-1.** Du baust im Lab `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab` (Vite + three.js r186, Port 5192).
- **Die Steuer-Sitzung** plant, gleicht ab und startet den **blinden Kritiker**. Du startest keinen eigenen Kritiker und bewertest dich nicht selbst als „bestanden“.
- **Meldeweg:** `ListAgents`, dann `SendMessage` an „KFB Open World Visual Terrain Recovery Lab“. Melde dich bei: Plan steht · Blocker · Stufe fertig gemessen (Q1–Q8 + harte Regeln) · Frage zu Inhalt bzw. Weltlogik.
- **Georg nur über die Steuerung,** außer er schreibt dir direkt. Keine Technik-Fragen an Georg (Git, PRs, Merge-Reihenfolge, CI); die klärst du mit der Steuerung.
- **Jetziger Auftrag ist nur Stufe 1.** Stufe 2 startet erst nach bestandenem Kritiker und Georgs OK.

## 1 · Pflichtlektüre (in dieser Reihenfolge)

1. `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`: §0 Grundsätze 1–8, §4 Besitzer, §5 Stufen und DoD, §6b (was **nicht** gebaut wird).
2. `docs/STAGE1_R2D_PORT_PLAN.md`: dein Bauplan, komplett (Zuordnung, `planFromSpec`, Adapter, r186-Punkte, Reihenfolge §5, harte Regeln §6, Risiken).
3. `donors/kfb-island-kit-r2-2026-10-08/`: `00_START_HERE.md`, `BAUANLEITUNG.md`, R2D v0 und Scholle v7 (Vorlage, **nicht** nachbauen, portieren).
4. `docs/QA_CRITIC_PROTOCOL_R1.md`: §1b Bauqualität Q1–Q8 und Kamerasatz „Nah“, §2 Ablage, §3 Kamerasatz Insel I1–I5, §4 G1–G7.
5. `docs/QA_RULEBOOK_ENVIRONMENT_R1.md` §00, §01; `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §6 (Insel-Rezept `kfb.island-config/1`).
6. `docs/PROJECT_STATE.md` (neueste Einträge oben) und `docs/SCALE_CONTRACT_K2.md`.

## 2 · Auftrag Stufe 1

Den R2D-v0-Inselbau (Höhe, Masken, `aTW`-Gewichte, Polarnetz, Farbkarte, Sprenkel S1 `kfbSpeckleLayer`, Viertelkreis-Kante, Scholle v7, Wasser) nach `src/island/r2d/*` portieren, wie im Bauplan beschrieben. Die vorhandene `IslandField`-Fassade bleibt, damit Environment, Probes und Straßenbett weiterlaufen.

**Inseln:** KFB Town (Hub ≈ 40 × 40 MC, Plateau-Archetyp) und Protopia (Satellit 20–28 MC, Berg-Archetyp). Noch keine Gebäude-, Bewohner- oder Straßenarbeit über das hinaus, was der Bauplan für Stufe 1 verlangt.

**Speicherformat:** Jede Insel als Rezept `kfb.island-config/1` mit festem `worldId`, `decks: [{ deckId, role }]` (Town `frizzlebob_s_mission_control` primary, Protopia `embrace_protopia` primary), Bewohnern `{ id, card, variant }`, Ankern `{ id, kind }` und `nodes: []`. Das Rezept speichert **nie** Spielerzustand. Abnahme-Teil: Export → Neuladen → Import ergibt dieselben IDs und dieselbe Insel.

**Licht:** eine Licht- bzw. Umgebungs-Einstellung für die ganze Welt (Vorlage `~/Dropbox/CLAUDE/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js`: ambient, world, fog, torch, exposure, ein schattenwerfender Hauptlicht-Strahler; siehe KayKit-Tutorial-Recherche auf GitHub, Branch `research/kaykit-creator-tutorial-atlas-2026-10-10`). Kein eigenes Licht je Figur. KayKit-Assets unter neutralem Licht und unter dem Spiel-Licht prüfen, damit Licht- und Materialfehler nicht verwechselt werden. Farben nur über `ENV_ROLES`.

## 3 · Harte Regeln (nicht verhandelbar)

- **§00 Weltlogik zuerst, §01 keine harten Schnitte bzw. sichtbaren Kanten** (Knetgummi-Cartoon-Logik).
- **Kein eigenes Gelände erfinden:** R2D portieren. Abweichungen nur mit Begründung an die Steuerung.
- **Maßstab K2:** keine Meter; H = 3,64, MC = 6,4, Tür ≥ 1,15 H, Rennprofil × 1,46.
- **Vor jedem Bild an Steuerung, Kritiker oder Georg:** harte Regeln Stufe 1 (Bauplan §6) **und** Q1–Q8 per Skript gemessen, Werte als JSON (`qcheck.json`). Fällt etwas durch: reparieren, kein Bild.
- **Eigene Sichtung:** Jedes Bild selbst in voller Größe ansehen, bevor du es meldest.
- **Rechner schonen (§0.8):** vor schweren Läufen `df -h /System/Volumes/Data` und `sysctl vm.swapusage`; unter 40 GB frei kein Lauf. Schwere Läufe im Hintergrund mit Wächter.
- **Port 5180 gehört einer anderen Sitzung:** nie benutzen oder beenden. `~/Dropbox/CLAUDE/KFB Open World/` nie anfassen.
- **Keine fremden Besitzer nachbauen:** Straßen, Brücken und Rennstücke macht RKIT; Natur macht Environment; Figuren kommen aus Blender. Brauchst du etwas davon, melde es der Steuerung.
- **Lizenzierte Assets** (`~/KFB-AssetCache/`, Unity, StreakByte) bleiben lokal, nie in ein öffentliches Repo und keine Renders davon öffentlich.
- **GitHub:** nur über die Steuerung bzw. nach ihrer Vorgabe; nichts nach `main`.
- **Stopp-Regel:** Nach 2 erfolglosen Reparaturrunden beim Kritiker wird gestoppt. Ein Kriterium unter 4 heißt zurück zum Konzept.

## 4 · Umgebung

- **Node 24 LTS** liegt unter `~/.local/node` (ab 2026-10-10). Im Lab vor npm-Befehlen `. tools/env.sh`. Dev-Server: Preview-Konfiguration `kfb-island-worldbuilder-lab` (Port 5192).
- **Blender** nicht im PATH: `/Applications/Blender.app/Contents/MacOS/Blender`.
- **Shots** mit `tools/shoot.mjs` bzw. eigenen Presets: 1600 × 1000, gleiches Licht. Ablage `docs/critic/lab-stage1/<YYYY-MM-DD>_<lauf>/shots/` (I1–I5 + Satz „Nah“ für Kante und Scholle) + `qcheck.json`.

## 5 · Erste Meldung an die Steuerung

Nach der Lektüre, vor dem ersten Code: dein Plan für Stufe 1 in Schritten, offene Fragen und Risiken, geschätzter Platzbedarf. Dann bauen.

## 6 · Nicht im Scope

Prison Planet, Fluff, Crafting, Loot, Reputation, Gott-Modus-Werkzeuge, Academy (Masterplan §6b). Stufe 2 und später erst nach Freigabe.
