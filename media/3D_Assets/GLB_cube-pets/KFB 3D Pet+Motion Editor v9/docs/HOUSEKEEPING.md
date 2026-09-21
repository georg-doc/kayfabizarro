# HOUSEKEEPING — KFB 3D-Table (living document)

Zweck: EINE Quelle für Aufräum-Entscheidungen und saubere Clean-Runs. Deckt den Pet- und
Motion-Editor-Scope ab sowie den Rest des Projekts. Kein Automatismus, nichts wird ohne Freigabe
gelöscht. Status-Spalte ist die Wahrheit, nicht das Datum.

Pflege: wer eine Version einfriert, ein Experiment beendet oder Assets verschiebt, trägt es hier
nach. Beim nächsten Clean-Run von oben nach unten durchgehen.

Legende Status: **AKTIV** (produktiv, weiterbauen) · **FROZEN** (Referenz, nicht anfassen, nicht
löschen) · **SUPERSEDED** (durch neuere Version ersetzt, archivierbar) · **EXPERIMENT** (unklarer
Wert, Entscheidung offen) · **DEAD** (Fehlversuch, löschbar nach Sign-off) · **ASSET** (Binär/Bild).

---

## 1. Pet- und Motion-Editor (mein Scope)

### SSOT und Contracts (die eigentliche Wahrheit)
| Artefakt | Rolle | Status |
|---|---|---|
| `pet-LIBRARY.json` (root) | Deploy-Snapshot Aussehen, `kfb.pet-library/1` v0.4.3 (2026-07-18) | AKTIV, inhaltsgleich mit Working-Copy |
| `PET_EDITOR/pet-LIBRARY.json` | Working-Copy, die die Editoren lesen, v0.4.3, 24 Pets | AKTIV |
| `media/3D_Assets/pet-LIBRARY.json` | Mirror der kanonischen URL, v0.4.3 | AKTIV |
| `motion-LIBRARY.json` (root) | Bewegung, `kfb.motion-library/1` v1.2.0, mit `canonical` | AKTIV für v1-Konsumenten; **Schema-Nachfolger: `motion-LIBRARY.v2.json`** |
| `motion-LIBRARY.v2.json` (root) | Bewegung Contract v2 (`kfb.motion-library/2` v2.0.0, 2026-07-19): motions (aus v1.2.0) + `clips` + `face` (Mienenspiel) + `triggers`. Motion-Editor v2 liest/schreibt; Export überschreibt beim Commit die kanonische URL | AKTIV |
| kanonisch: GitHub-raw `…/media/3D_Assets/pet-LIBRARY.json` | die eine Wahrheit, Apps fetchen sie | extern |

Regel: wer schreibt, zählt `version` hoch, setzt `updated`, verliert `canonical` nie. Lokale Kopien
sind Snapshots, im Zweifel die URL fetchen.

### Geteilte Runtime-Module (ein Code-Pfad für beide Benches und alle Apps)
| Datei | Rolle | Status |
|---|---|---|
| `pet-library.v6.js` | Character + Face-Chirurgie (stripEyes/stripSnout) | AKTIV, geteilt |
| `pet-eye-rig.v4.js` | EyeRig v4 — nur noch von den EINGEFRORENEN v1-Benches referenziert (Motion-Editor v1, Journey) | SUPERSEDED von v5 (Rig-v5-Hub 2026-07-19: beide aktiven Benches auf v5) |
| `pet-eye-rig.v5.js` | EyeRig v5 (Actor: Asymmetrie/Leben/Kinetik + lid-Flag) — **beide aktiven Benches** (Pet-Editor v9, Motion-Editor v2; dort Life AUS, PetFace trägt den Drift) | AKTIV, geteilt |
| `pet-motion.v1.js` | PetMotion (Squash-Schicht) | SUPERSEDED von `pet-motion.v2.js` (v1 bleibt Referenz für den v1-Editor) |
| `pet-motion.v2.js` | PetMotion v2: v1 + Clip-Layer (alle 8 GLB-Clips), Trigger-Bus (drop/brake/curveL/R/card/still), Combos (doubleTake/shiver/tada/random), Sekundär-Federn (ear/tail/antler-Knoten, additiv nach Mixer) | AKTIV, geteilt |
| `pet-face.v1.js` | Mienenspiel (SPRINT_mienenspiel.md): kontinuierlicher Emote-Raum, Drift+Tremor, reaktiv, Augen-Pop/Oval-Federn; treibt EyeRig nur über Public API | AKTIV, geteilt |
| `pet-fx.v1.js` | Cartoon-FX: dust/ring/star/speedlines, Cel-Look, settlet in Ruhe | AKTIV, geteilt |
| `pet-mouth.v1.js` | Talking Mouths: 12 Character-Animator-PNGs (GitHub raw `FrizzelBob-Mouth_01`) als Surface-Fit-Plane, Visem-Shuffle ohne Lip-Sync, Ruhe-Mund folgt Mienenspiel | AKTIV, geteilt |

### Benches
| Datei | Status |
|---|---|
| `KFB Pet Editor v9.dc.html` | **AKTIV (aktueller Aussehen-Editor, 2026-07-19)**: v8 + Mund-Tab (Talk-Münder pro Pet platzieren, `pet.mouth {size,dy,sx}` im Contract; Motion-Editor v2 liest sie). Doku `docs/PET_EDITOR_v9.md` |
| `KFB Pet Editor v8.dc.html` | SUPERSEDED von v9 (Textur-Diagnose + Triplanar-Fell + Actor-Schnitte bleiben in v9 enthalten) |
| `KFB Pet Editor v7.dc.html` | SUPERSEDED von v8 (runder Kenney-Look default, Pfad Colormap+Papier+Gelb, `facet`/Look im Contract, v0.4.2) |
| `KFB Pet Editor v6.dc.html` | SUPERSEDED von v7 (Lid-Farbe aus Colormap, 24 Pets, v0.4.1) |
| `KFB Pet Editor v5.dc.html` | SUPERSEDED von v6 |
| `KFB Pet Editor v5 - standalone.html` | SUPERSEDED (Standalone von v5) |
| `KFB Pet Motion Editor v2.dc.html` | **AKTIV (aktueller Bewegungs-Editor, 2026-07-19)**: DAW-UI (Pad-Bar unten: Clips · Motions · Gesicht · Events · Combos; Tuning+Global rechts), Pet-Dropdown (alle 24), Talk-Münder, Abstands-Regler Begleiter↔Vehikel, Cursor-Blick, FX, kompakter Modus <920px. Doku `docs/MOTION_EDITOR_v2.md` |
| `KFB Pet Motion Editor v1.dc.html` (v1.1) | SUPERSEDED von v2 (eingefroren, liest weiter Contract v1) |
| `KFB Pet Editor v1/v2/v3/v4.dc.html` | SUPERSEDED (jede eingefroren als Referenz) |
| `KFB Pet Editor v3 - standalone.html` | SUPERSEDED |
| `pet-eye-rig.v1/v2/v3.js` | SUPERSEDED |
| `cube-pet.js`, `cube-pet.v6.js` | SUPERSEDED (Vorläufer der Library) |

Clean-Run-Kandidat: v1 bis v7 der Benches (v8 ist der aktive) plus die alten Rigs nach
`archive/pet-editors/` verschieben, danach CLAUDE.md-Pfade nachziehen. Nicht vor Sign-off, weil
CLAUDE.md sie als Referenz führt. **Achtung:** CLAUDE.md kennt v8 noch nicht (führt v7 als aktuell) —
beim nächsten CLAUDE.md-Update die v8-Zeile ergänzen und v7 auf SUPERSEDED setzen.

---

## 2. Restliche Projekte (Kontext, nicht mein Scope, hier nur geflaggt)

### Die Reise / Infinite Journey
| Datei | Status |
|---|---|
| `KFB InfiniteJourney v1.dc.html` + `infinite-journey.v1.js` | AKTIV, SUPERSEDED von v2 laut CLAUDE.md |
| `KFB InfiniteJourney v2.dc.html` + `infinite-journey.v2.js` | FROZEN (bend-Referenz) |
| `backup/KFB InfiniteJourney v1.CURRENT/.REFERENCE.dc.html` + zwei `.js` | EXPERIMENT/Backup, Wert prüfen |

`backup/` hält vier Dateien, die wie manuelle Sicherungen aussehen (CURRENT/REFERENCE-Paare). Wenn
die in v1/v2 aufgegangen sind, ist `backup/` löschbar. Entscheidung offen.

### Card-Viewer
| Datei | Status |
|---|---|
| `KFB Card Viewer v1.dc.html` + `card-viewer.v1.js` | DEAD (Fehlversuch, in CLAUDE.md dokumentiert, eingefroren) |
| `KFB Card Viewer v2.dc.html` + `card-viewer.v2b.js` | EXPERIMENT, NICHT in CLAUDE.md, Wert unklar |
| `KFB Card Viewer v3.dc.html` + `card-viewer.v3.js` | EXPERIMENT, NICHT in CLAUDE.md, Wert unklar |

Card-Viewer v2 und v3 sind nach v1s Post-Mortem entstanden, aber nirgends dokumentiert. Bitte
Ansage: dokumentieren, archivieren oder löschen.

### Tisch / Table
| Datei | Status |
|---|---|
| `KFB Table v6.dc.html` + `kfb-table.v6.js` | AKTIV (aktueller Tisch) |
| `KFB Table v3/v4/v5.dc.html` + zugehörige `.js` | FROZEN/SUPERSEDED (Referenzen) |
| `KFB Table v4 - standalone.html` | SUPERSEDED |

### Greybox / Explorationen
| Datei | Status |
|---|---|
| `KFB Comic Cube v1.dc.html` + `comic-cube.v1.js` / `comic-cube.v2.js` | FROZEN (Greybox-Proto, v2 = Graybox-Basis für die Reise) |
| `Hex Canvas.dc.html` + `hex-canvas.v1.js` | FROZEN (demoted, Overworld-Layer) |
| `Canvas.dc.html` | EXPERIMENT, nicht dokumentiert, Wert prüfen |
| `Sprint 08 - Floor & Bases Studie.dc.html` | EXPERIMENT/Studie, archivierbar |
| `archive/phase1/`, `archive/v2/` | FROZEN (Phase-1-Archiv, nicht weiterbauen) |
| `explore/bases_sample.png`, `explore/hex_preview.png` | ASSET (Explorations-Renders) |

---

## 3. 3D-Modelle (schwere Binärdateien, Projekt-Root-Hygiene)

CLAUDE.md-Regel: Assets IMMER per GitHub-raw laden, nichts Schweres ins Projekt. Verstöße:

| Datei | Flag |
|---|---|
| `dice_ugur_lowpoly.glb` (root) | ASSET, schwer, liegt im Repo-Root statt per raw-URL. Prüfen ob noch referenziert (Table nutzt Würfel), sonst raus und per URL ziehen. |
| `assets/dungeon/*.glb` (banner, barrel, chest, column, …) + `assets/dungeon/Textures/` | ASSET, Kenney-Dungeon-Props für Comic Cube v1 (FROZEN). Wenn die Greybox eingefroren ist, kann der Ordner nach GitHub und aus dem Projekt raus. |
| `.thumbnail` (root) | System-Artefakt, ignorieren. |

Aktion: erst prüfen, wer die GLBs noch lädt (grep), dann per raw-URL ersetzen und lokal entfernen.
Nicht blind löschen, der Table und die Greybox referenzieren evtl. lokale Pfade.

---

## 4. Screenshots (Produktion und Abnahme)

### Deine Produktions-Screenshots
| Ort | Inhalt | Flag |
|---|---|---|
| `uploads/Bildschirmfoto 2026-07-15…/2026-07-16…png` (19 Stück) | deine manuellen Screenshots aus der Produktion | zu sichten. Feedback-relevante nach `captures/<projekt>/` umbenennen und einsortieren, Rest löschen. |
| `uploads/GREYBOX INK OUTLINE 90von100 v1*.png` (4 Stück, teils Duplikate mit Hash-Suffix) | Outline-Feedback-Bilder | verarbeitet? dann löschen (Hygiene-Regel CLAUDE.md: Feedback-Bilder nach Verarbeitung löschen). |

### Abnahme-Captures (Agent-generiert)
Regel: pro Version die letzte Abnahme-Sequenz behalten, Diagnose-Frames sofort löschen. Nur in
`captures/stufeN/` bzw. `captures/<version>/`.
| Ordner | Status |
|---|---|
| `captures/v8/` | AKTIV, Abnahme Pet-Editor v8 (Fell-Triplanar, weiche Kanten, Lid-Fixes) |
| `captures/v6/`, `captures/v7/` | Abnahme Pet-Editor v6/v7, behalten bis v8 sign-off, dann löschbar |
| `captures/v5/` | Abnahme Pet-Editor v5 + Motion-Compat, SUPERSEDED, löschbar nach Sign-off |
| `captures/motion_v1/` | Abnahme Motion-Library v1, behalten oder in ein Archiv falten |
| `captures/stufe1/`, `captures/stufe2/` | Reise-Abnahme, gehört zum Journey-Scope |
| `captures/v4_check/` | Pet-Editor v4, SUPERSEDED, löschbar nach Sign-off |

---

## 5. Doku-Landschaft (docs/)

AKTIV und maßgeblich: `docs/LEAD_PLAN_MVP1.md` (Fahrplan), `docs/PET_EDITOR_v9.md` (Ist-Stand Aussehen-Editor), `docs/MOTION_EDITOR_v2.md` (Ist-Stand Bewegungs-Editor), `docs/SESSIONCUT_2026-07-19.md` + `docs/HANDOVER_editors_2026-07-19.md` (aktueller Cut/Handover), `docs/ONBOARDING_pet_studio.md` (nächster Auftrag: Studio-Merge), `skills/session-export_v1.md` (Export-Regeln: Manifest → Veto → schlankes Zip), `docs/PET_EDITOR_v8.md`,
`docs/HANDOVER_pet_editor_v8.md` (Cowork), `docs/ONBOARDING_pet_editor_v8.md` (frische Chats),
`docs/MOTION_LIBRARY_v1.md`, `docs/CARTOON_MOTION_KNOWLEDGE.md`, `docs/ONBOARDING_pet_motion.md`,
dieses Dokument.

SUPERSEDED, aufräumbar: `docs/PET_EDITOR_v4.md` bis `_v7.md`, `docs/CHECKIN_2026-07-16_editors.md`,
`docs/HANDOVER_editors_2026-07-16.md`, `docs/00_START_HERE_v3.md`, `docs/BACKLOG_v3.md`,
`docs/SPRINT_07_cube_pets_avatars.md`, ältere `00_START_HERE_v*`. Nicht löschen ohne Blick, einige
sind in CLAUDE.md verlinkt.

---

## 6. Clean-Run-Checkliste (nach Freigabe, nicht vorher)

1. Card-Viewer v2/v3 entscheiden (dokumentieren, archivieren, löschen).
2. `uploads/`-Screenshots sichten, Feedback-Bilder löschen, Rest einsortieren.
3. `backup/`-Paare prüfen, ob in Journey v1/v2 aufgegangen, dann löschen.
4. 3D-GLBs im Root und `assets/dungeon/` auf raw-URL umstellen, lokal entfernen.
5. Pet-Editor v1 bis v4, alte Rigs, `cube-pet*.js` nach `archive/` verschieben, CLAUDE.md-Pfade nachziehen.
6. SUPERSEDED-Captures und -Docs entfernen.
7. Danach Session-Export NACH `skills/session-export_v1.md`: Manifest → Georgs Veto-Fenster → nur Session-Dateien zippen (hartes 2-MB-Budget pro Datei, Assets per RAW-URL). NIE Voll-Projekt-Zip.

Jeder Schritt einzeln, jeder mit Sign-off. Keine Sammellöschung.
