# HOUSEKEEPING · KayKit Resident Atlas

Lebendes Dokument. Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`.
Stand 2026-09-25 (Sprint S40f · RES-DISCO-CD-01 + Rotation/MC/Monstrosity). **Nichts wird ohne ausdrückliche Freigabe gelöscht.**

## Deliverables

| Datei | Status | Anmerkung |
|---|---|---|
| `KFB_Resident_Atlas_S9.html` | **AKTIV · NEU (S40)** | S8 + Disco-Resident `#__disco` (Source Cast · Motion Audition · Ensemble · Discokugel). Review-Artefakt RES-DISCO-CD-01 |
| `KFB_Resident_Atlas_S8.html` | AKTIV (S39b) · von S9 überdeckt, nicht abgelöst — Band-Strang läuft dort weiter | S7 + Band-Modul als Resident (`#__band`), Glieder-Auswahl per Klick, CCD-IK wie three.js `webgl_animation_skinning_ik` |
| `KFB Resident Band Module 01.dc.html` | SUPERSEDED (S39b) | eigenständige Band-Seite, nicht im Atlas integriert — von S8 abgelöst, nicht gelöscht |
| `KFB_Resident_Atlas_S7.html` | SUPERSEDED (S39b) | Rig-Werkstatt: Puppe, geteilte Editor-Schicht, Prüfstand |
| `KFB_Resident_Atlas_S6.html` | SUPERSEDED | von S7 abgelöst, läuft unverändert weiter (eigener Anfasser, kein `noGizmo`) |
| `KFB_Resident_Atlas_S5.html` | SUPERSEDED | Vorstufe ohne Studio-Schicht |
| `KFB Quaternius Mode Family POC v0.dc.html` | AKTIV | eigener Faden (S37), nicht Teil dieser Session |
| `KayKit_City_Sample_S4.html`, `KayKit_Dungeon_Room_S1.html`, `Kenney_City_Block_S2.html`, `Kenney_Racing_Track_S3.html` | FROZEN | frühere Scheiben, unberührt |

## Module

| Datei | Status | Anmerkung |
|---|---|---|
| `lib/disco-ensemble.js`, `lib/disco-workshop.js`, `lib/song-transport.js`, `data/resident-disco-01.json` | **AKTIV · NEU (S40)** | Disco-Modul, Host-Werkstatt, eine Songuhr. S40e: Rotation + Tempokarte, D8 FrizzleBob-MC (Graft), Drum Machine, Kreis ×1,35 |
| `data/disco-playlist-01.json` | **AKTIV · NEU (S40e)** | 8 Titel, am Audio gemessen (BPM, erster Schlag, Tempokarte, Blob). Taktanfang gesetzt |
| `lib/host-env.js` | **AKTIV · NEU (S40c)** | Atlas-Umgebung für alle Residents: prozeduraler Boden + Himmel + Tageszeit · Platzhalter für den WorldBuilder-Boden. **Georg-Notiz 2026-09-25:** der prozedurale Wiesen-/Terrain-Look ist nicht der endgültige Boden, gefällt aber als eigene Variante — als Terrain-Option für den WorldBuilder vormerken |
| `lib/resident-collide.js` | **AKTIV · NEU (S40d)** | RESIDENT-COLLIDE-01 · weiche Körperkollision als Standard. `makeCrowd` (Tänzer schubsen sich weg, federn zurück) im Disco-Ensemble eingebaut; `makeWalker`/`stepWalker` (Mobs prallen an Grabsteinen/einander ab, drehen weg, laufen weiter) bereit, noch ohne Einbau. three.js-frei → ToolBox-Kandidat |
| `lib/disco-ball-core.js`, `data/disco-ball-core-01.json` | **AKTIV · NEU (S40)** | DISCO-BALL-CORE-01 · wiederverwendbares Welt-Objekt, eigene Naht — Kandidat für die ToolBox |
| `lib/ik-rig.js`, `lib/band-workshop.js` | **AKTIV · NEU (S39b)** | CCD-IK + Glied-unter-Zeiger; Band-Werkstatt für S8 |
| `lib/band-module.js`, `lib/band-review.js` (nur DC, SUPERSEDED), `data/resident-band-module-01.json` | **AKTIV · NEU (S39)** | Band-Modul-Laufzeit, Review-Host, Definition. `edit-layer` ist damit im **dritten** Einbau → ToolBox-Kandidat |
| `lib/edit-layer.js` | **AKTIV · NEU** | Editor-Schicht; zweiter Einbau des S21-Blocks. **Kandidat für die ToolBox beim dritten Einbau** |
| `lib/rigwork.js` | **AKTIV · NEU** | Gliederpuppe; hängt an `edit-layer` und an `atlas.js` (`reachChain`, `skinnedWorld`) |
| `lib/studio.js` | **AKTIV · GETEILT** | von S6 **und** S7 importiert. Änderungen additiv: `noGizmo`, `recordBone`/`recordNode`, `check`/`bundle`/`merge`. **Nicht als tot einstufen** |
| `lib/atlas.js` | AKTIV · GETEILT | von S5, S6, S7 und mehreren Sonden importiert. In dieser Session unverändert |
| `data/cast.js` | AKTIV · GETEILT | Rezept-Quelle aller Residents. In dieser Session unverändert |
| `lib/props.js`, `lib/kit-lab.js`, `lib/track-chain.js`, `lib/modefamily*.js` | AKTIV | andere Fäden |

## Werkzeuge

| Datei | Status | Anmerkung |
|---|---|---|
| `tools/band-module-probe.html`, `tools/band-module-smoke.html` | AKTIV · NEU (S39) | Quellen/Clips/Blob-Prüfung; Laufzeit ohne Oberfläche |
| `tools/eye-lid-color-probe.html` | **AKTIV · NEU** | misst die Gesichtsfarbe der vier Rig_Large-Köpfe gegen `#b58f83` |
| `tools/prop-qa.html`, `tools/measure.html` | AKTIV | wiederverwendbare Prüfläufe |
| `tools/*-probe*.html` (24 Stück) | FROZEN | Einmal-Sonden mit Beweiswert; jede gehört zu einem Changelog-Eintrag |

## Docs

| Datei | Status |
|---|---|
| `docs/HANDOVER_WSA_S40.md` | **AKTIV · NEU** (Handover für den WSA-Chat: Codebasis, FBX-Intake-Vertrag, nächste 5) |
| `docs/DISCO_BEAT_MEASURE_01.md` | **AKTIV · NEU** (Beatmessung der Rotation, Verfahren + Quelltext) |
| `docs/SUNO_DISCO_INSTRUMENTALS_01.md` | **AKTIV · NEU** (fünf Suno-Instrumentals für die Disco) |
| `docs/RESIDENT_DISCO_CD_01.md` | **AKTIV · NEU** (Session Cut + Return RES-DISCO-CD-01) |
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
| `screenshots/s9-*`, `screenshots/0?-s9-*` | Prüfbilder dieses Laufs (S40) | nach Georgs Blick entbehrlich |
| `uploads/disco-01.studio.json`, `uploads/Bildschirmfoto 2026-09-25 um 04.02.53.png` | Georgs Studio-Export + Screenshot (Drum Machine) | Befund ist als Standard ins Rezept übernommen (CHANGELOG S40e-Nachtrag) → archivieren |
| `export/S39-band-module-01/` | alter Teil-Export | durch den S40-Export überholt, nicht löschen ohne Freigabe |
| `KFB_Resident_Atlas_S6.html`, `S7.html` | von S9 überholt | stilllegen erst mit Konsolidierung (Handover §5.5) |
| `screenshots/` | Abnahmebilder älterer Scheiben | Kandidat fürs Auslagern, kein Laufzeit-Bezug |
| `ref/atlas/*.gif` | schwere Binärdateien | gehören per RAW-URL geladen, sobald sie im Repo liegen |
| `_inbox/` | Eingangsordner | durchsehen, wenn der Pack-Browser (E3) kommt |

## Pfad-Hygiene

**S40e · neue Fremdlade-Stelle, benannt:** Der MC lädt `graft-mount.v1.js` über jsDelivr, gepinnt auf `5f268e80`, weil raw JS als text/plain liefert. Sein Profil kommt über raw. Der Leser selbst holt Driver, Kopf und Texturen über raw@**main** (Konstante `RAW` im Leser). Das ist nicht gepinnt: Wenn sich main ändert, kann sich der MC ändern.

**S39d · Ausnahme aufgehoben:** Die Motion Library lädt jetzt über die RAW-URL an PR #209 `f91c4e0f` (`media/3D_Assets/Animations/KFB_Motion_Library/`). Die lokale Kopie ist gelöscht; sie war byte-identisch (Git-Blob `45e12910…` im Browser nachgerechnet). `ref/orb/ga2_*.png` bleiben als Vergleichsbilder. **Pin nachziehen, sobald #209 gemergt ist.**


Geprüft für S7: alle **Geometrie- und Texturpfade** laufen über
`raw.githubusercontent.com` an gepinnten Commits (`lib/atlas.js`, `raw()`), keine relativen
Asset-Pfade. **Eine Ausnahme, benannt statt übersehen:** `reference.src` in `data/cast.js` zeigt
teils auf `ref/atlas/*.gif` und `uploads/*.png` — also auf Projektdateien. Im schlanken Export
fehlen diese, das Referenzbild bleibt dann leer. Betrifft nur die Überblendung
(Regler „Referenz", Standardwert 0), nicht die Szene. Fix-Kandidat: die `media/3D_Assets/…`-Fälle
auf die RAW-URL umstellen, die `ref/`- und `uploads/`-Fälle erst ins Repo heben.
