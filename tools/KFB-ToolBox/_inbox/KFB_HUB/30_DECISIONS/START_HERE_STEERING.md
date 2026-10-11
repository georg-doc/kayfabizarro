# START HERE · KFB Steuerung (für jede Sitzung: Claude Code, WSA, Blender-Coworker, Webchats)

Stand: 12.10.2026 (bis V-187) · gepflegt von der Steuer-Sitzung (Claude Code). Spiegel auf GitHub: Branch `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`.

## Maßgeblich (in dieser Reihenfolge)
1. `DECISIONS.md` / `decisions.json`: Georgs PASS / TUNE / FAIL / RULE / TBD mit V-Nummern, Warum und Wann. Was dort steht, gilt.
2. `CHANGELOG.md`: additiv, neueste oben.
3. `lab-docs/KFB_WORLDBUILDER_PLAN_R1.md`: Phasen A–H.
4. `lab-docs/PROJECT_STATE.md`: oberster Abschnitt = aktueller Stand.
5. `lab-docs/PHASE_C_DONORS_R1.md`: Vorlagen für Phase C.
6. `STYLE_GUIDE_3D_R1.md`: 3D Style Guide v0.1 (Synthese, Offen-Liste §10).
7. `REVIEW_STEUERUNG_R1.md`: Entscheidungen der Steuerung, die Georg noch durchsehen soll, und offene Konflikte.

## Gilt auch für WSA (V-122)
Der WSA-Router (`planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`) ist Design-Eingang, nicht Plan. Vier-Insel-A/B = Eingang für Phase D/F, kein Tor für das Lab.

## Abgelöst (V-117), nicht mehr als Grundlage nutzen
- `KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` (R2/R2.1), insb. §4 Besitzer-Tabelle („Straßen, Übergänge, Brücken, Rennstücke → RKIT“) und §7 („Joyride nur Physik“).
- Weg A aus `POSTMORTEM_MVP1_STAGE1_R1.md` §5.1 (Golden-Referenzen von Claude Design; V-084). Ersatz: V-119 Blender Island Form Kit 01.
- `MVP_DRIVE_LOOP_R1_PLAN.md`, `STAGE1_R2D_PORT_PLAN.md`.
- `PROJECT_STATE.md`-Abschnitte vor „Stand 11.10.“ sind Geschichte.

## Feste Regeln (Kurzfassung)
- Vorlage zuerst: eine Zeile an die Steuerung vor jedem neuen Teil; Nachbau ohne Freigabe = nicht bestanden.
- Joyride J17 ist Goldstandard für den Gesamt-Look (V-010, V-102: schieferblaue Fahrbahn, orange Banden).
- Georg gestaltet, Sitzungen bauen Werkzeuge (V-002). Höchstens zwei Bau-Baustellen gleichzeitig (V-005).
- Parity vor jeder Lab-Lieferung (`tools/parity`), Bericht mit V-Nummern.
- Lizenzen V-071 sind geklärt; keine Lizenz-/Public-Floskeln mehr in Briefs und Berichten, nur neue ungeklärte Fälle in einer Zeile (V-184). Figuren nie skalieren (V-060). Maßstab K2 (H = 3,64).
- Recherche: zuerst `ACCEPTANCE_INDEX.md` bzw. PASS/TUNE/FAIL; „nicht gefunden in …“ statt „gibt es nicht“.
- **Bilder prüfen, nicht erfinden (V-148):** Logik generierter Referenzbilder im Detail prüfen und im KFB-Stil umsetzen; Uneindeutiges mit Bildstelle an die Steuerung melden, Georg entscheidet. Nie selbst ausdenken.
- **Use what works (V-140):** „fehlt“ bzw. „braucht Georgs Entwurf“ nur mit Such-Protokoll über Donor-Karten, Acceptance-Index, Joyride-Cuts J14/J15 (TC1)/J16/J17, Organ-Inseln v4–v7, RollerCoaster v11, Stunt Car Race und frühere Lieferungen.
- Neue Georg-Entscheidungen, auch wenn sie in einer anderen Sitzung fallen: an die Steuerung melden, damit sie hier eine V-Nummer bekommen (V-120 zeigt, was sonst passiert).

## Wo liegt was (lokal, Dropbox `~/Dropbox/CLAUDE/`)
- Lab: `KFB Island Worldbuilder Lab/` (Vite + three r186, Port 5192). Lieferungen `docs/critic/lab-*/`.
- Referenzbilder Georg: `KFB Island Worldbuilder Lab/docs/golden/candidates/` (prison-maze, dystopia-vulkan, protopia-makerspace; je README).
- Scholle v7 / R2D: `KFB World Core R2D v0 Insel + KFB Scholle Bench v7/kfb-r2d-session-2026-10-03/`.
- Joyride J17: `KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/` (Bilder `pictures/chase-curve.jpg`, `chase-straight.jpg`, `chase-tunnel.jpg`).
- Organ-Inseln: `KFB Organ-Inseln + race track v4+/` (v4 bis v7).
- Track Core: privat, `~/Developer/rkit-r3` (nie öffentlich).

## Sperrliste Lab-src (V-141, Stand 11.10. abends)
Gesperrt für alle außer der Bau-Sitzung (MVP-1): `src/main.ts`, `src/play/travel.ts`, `src/play/surface.ts`, `src/play/race-fx.ts`, `src/audio/*`, `src/sky/sky.ts`, `src/world/organ/*`, `src/world/tunnel/*`, `src/bench/*`, `j17-track.lab.js`.
WSA-Bereich (mit Georgs OK): `src/editor.ts`, `src/island/spec.ts`, `src/scene-study.ts`; Änderungen nur nach Vorlagen-Zeile an die Steuerung, parity vor und nach.

## Aktuelle Aufträge (12.10.)
- **Bau-Sitzung (Lab, Port 5192):** C4c-Folgen nach V-183 (Auto in die Haltebucht, Randlinie unterbrochen, Zebra 3 Balken, Spalt bis zur Nase füllen), dann C4c als Standardansicht nach den üblichen Prüfungen. Danach V-171 Punkt 2 (Flacker-Paket, begonnen hinter `?flk=1`) und Punkt 3 (Insel-Cache, warm ≤ 5 s). Reihenfolge danach: Plan R1 §5.
- **RKIT (Track Core, privat):** pausiert; Skins/Module bis 0.16.9 fertig (Plan R1 §2e).
- **Blender-Coworker:** R4 Coconino-Mesas im eigenen Branch (V-167), danach R3 Inselboden (V-142).
- **WSA:** pausiert bis zur Audit-Gegenprüfung nach V-171 Punkt 1–3 (V-178); die Steuerung meldet sich mit Branch-Link und Fragen.
- **Fable02/WSO (Mac mini):** Clip-Katalog R1 geliefert (replies/WSO_CLIP_CATALOG_R1.md).
- **Hintergrund-Agenten:** Dungeon-POC Schritt 1 (V-182; `~/Developer/kfb-dungeon-poc`, Port 5194, Lab nur gelesen) · NPC Performance Proof R1 (V-187).
- **Lab-Code-Schnappschuss** (ohne private Teile): Branch `sync/lab-snapshot-2026-10-11`.
