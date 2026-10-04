# HOUSEKEEPING · KayKit Resident Atlas

Lebendes Dokument. Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`.
Stand 2026-09-20 (Sprint S38). **Nichts wird ohne ausdrückliche Freigabe gelöscht.**

## Deliverables

| Datei | Status | Anmerkung |
|---|---|---|
| `KFB_Resident_Atlas_S7.html` | **AKTIV** | Rig-Werkstatt: Puppe, geteilte Editor-Schicht, Prüfstand |
| `KFB_Resident_Atlas_S6.html` | SUPERSEDED | von S7 abgelöst, läuft unverändert weiter (eigener Anfasser, kein `noGizmo`) |
| `KFB_Resident_Atlas_S5.html` | SUPERSEDED | Vorstufe ohne Studio-Schicht |
| `KFB Quaternius Mode Family POC v0.dc.html` | AKTIV | eigener Faden (S37), nicht Teil dieser Session |
| `KayKit_City_Sample_S4.html`, `KayKit_Dungeon_Room_S1.html`, `Kenney_City_Block_S2.html`, `Kenney_Racing_Track_S3.html` | FROZEN | frühere Scheiben, unberührt |

## Module

| Datei | Status | Anmerkung |
|---|---|---|
| `lib/edit-layer.js` | **AKTIV · NEU** | Editor-Schicht; zweiter Einbau des S21-Blocks. **Kandidat für die ToolBox beim dritten Einbau** |
| `lib/rigwork.js` | **AKTIV · NEU** | Gliederpuppe; hängt an `edit-layer` und an `atlas.js` (`reachChain`, `skinnedWorld`) |
| `lib/studio.js` | **AKTIV · GETEILT** | von S6 **und** S7 importiert. Änderungen additiv: `noGizmo`, `recordBone`/`recordNode`, `check`/`bundle`/`merge`. **Nicht als tot einstufen** |
| `lib/atlas.js` | AKTIV · GETEILT | von S5, S6, S7 und mehreren Sonden importiert. In dieser Session unverändert |
| `data/cast.js` | AKTIV · GETEILT | Rezept-Quelle aller Residents. In dieser Session unverändert |
| `lib/props.js`, `lib/kit-lab.js`, `lib/track-chain.js`, `lib/modefamily*.js` | AKTIV | andere Fäden |

## Werkzeuge

| Datei | Status | Anmerkung |
|---|---|---|
| `tools/eye-lid-color-probe.html` | **AKTIV · NEU** | misst die Gesichtsfarbe der vier Rig_Large-Köpfe gegen `#b58f83` |
| `tools/prop-qa.html`, `tools/measure.html` | AKTIV | wiederverwendbare Prüfläufe |
| `tools/*-probe*.html` (24 Stück) | FROZEN | Einmal-Sonden mit Beweiswert; jede gehört zu einem Changelog-Eintrag |

## Docs

| Datei | Status |
|---|---|
| `docs/RIG_WERKSTATT_S7.md` | **AKTIV · NEU** (inkl. Abnahme am Testexport und Slice-Planung) |
| `docs/EYE_RIG_BATCH_REVIEW_S38.md` | **AKTIV · NEU** |
| `CHANGELOG.md` | AKTIV · additiv, nur Zuwachs |
| `github.md` | AKTIV · Sync-Beleg, zuletzt 2026-09-20 |
| `docs/*` übrige | AKTIV |

## Clean-Run-Checkliste S7

1. Seite lädt ohne Konsolenfehler (zwei three.js-Deprecation-Warnungen sind erwartet).
2. `window.__atlas` exportiert `V / ST / PUP / EDIT`.
3. Puppe: 7/7 Anfasser auf Rig_Medium, Marker sichtbar, keiner in der Fehlliste.
4. Auswahl überlebt eine Kamerafahrt (> 4 px Zug wählt nicht aus).
5. `#objmenu` ist bei leerer Auswahl **unsichtbar** und erzeugt keine Scrollhöhe
   (`documentElement.scrollHeight === clientHeight`).
6. Kopieren meldet in jedem Fall etwas Sichtbares — Zwischenablage, Rückfallweg oder markiertes Feld.
7. Studio-Ablage nach dem Prüflauf leeren (`ST.clear(id)` je Eintrag), sonst wandern Testdaten
   in den nächsten Export.

## Aufräum-Kandidaten — **nur benannt, nichts ausgeführt**

| Kandidat | Warum | Empfehlung |
|---|---|---|
| `KFB_Resident_Atlas_S5.html` | zwei Generationen überholt | behalten, solange S5 im Screen-Map von `github.md` steht |
| `uploads/*.png` (verarbeitete Rückmeldungsbilder) | Befund ist in Changelog/Docs überführt | archivieren, **nicht** löschen: `data/cast.js` referenziert mehrere davon als `reference.src` |
| `screenshots/` | Abnahmebilder älterer Scheiben | Kandidat fürs Auslagern, kein Laufzeit-Bezug |
| `ref/atlas/*.gif` | schwere Binärdateien | gehören per RAW-URL geladen, sobald sie im Repo liegen |
| `_inbox/` | Eingangsordner | durchsehen, wenn der Pack-Browser (E3) kommt |

## Pfad-Hygiene

Geprüft für S7: alle **Geometrie- und Texturpfade** laufen über
`raw.githubusercontent.com` an gepinnten Commits (`lib/atlas.js`, `raw()`), keine relativen
Asset-Pfade. **Eine Ausnahme, benannt statt übersehen:** `reference.src` in `data/cast.js` zeigt
teils auf `ref/atlas/*.gif` und `uploads/*.png` — also auf Projektdateien. Im schlanken Export
fehlen diese, das Referenzbild bleibt dann leer. Betrifft nur die Überblendung
(Regler „Referenz", Standardwert 0), nicht die Szene. Fix-Kandidat: die `media/3D_Assets/…`-Fälle
auf die RAW-URL umstellen, die `ref/`- und `uploads/`-Fälle erst ins Repo heben.
