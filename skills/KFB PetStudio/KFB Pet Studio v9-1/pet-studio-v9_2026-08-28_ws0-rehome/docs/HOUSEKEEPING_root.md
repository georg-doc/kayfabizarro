# HOUSEKEEPING — living, Stand 29.08.2026 (nach Studio V9-S2 Re-Home, SpinballCast V3-S13, DC Squeeze SQ-3)

Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`
**Nichts wird gelöscht ohne Georgs Freigabe, jeder Schritt einzeln.**

---

## Deliverables

| Artefakt | Status | Anmerkung |
|---|---|---|
| `KFB Pet SpinballCast v3.dc.html` | **AKTIV** | byteidentisch mit WS0s v2 + 2 dokumentierte Zeilen (Boden an, Kachel erbt Kippung) |
| `KFB Pet SpinballCast v2.dc.html` | **FROZEN** | WS0s Stand, Vergleichsmaßstab |
| `KFB Pet SpinballCast v1.dc.html` | SUPERSEDED | von v2/v3 |
| `KFB Pet Studio v9.dc.html` | **AKTIV** | Bauplatz. Pad als Bauteil (7 gemessene Anker), Base, Zipfel als eigenes Bauteil. Griff `window.__STUDIO9` |
| `KFB Pet Studio v9 SESSION_LIVING.dc.html` | **AKTIV** | Living Document. Hausregeln R14 · R15 · **R16** (Re-Home, 29.08.) |
| `KFB Pet Studio v8.dc.html` | **FROZEN** | Fork-Basis von v9, Vergleichsmaßstab. Eine Vertragsquelle, `pet.ground`, Wächter |
| `KFB Pet Studio v7.dc.html` | **FROZEN** | Vergleichsmaßstab |
| `KFB Pet Studio v6.dc.html` | DEAD | als KAPUTT eingefroren (Blasen-Regression) |
| `KFB Pet Podcast v5.dc.html` | **FROZEN** | **darf nicht brechen** — geprüft unberührt, siehe geteilte Module |

## DC Squeeze — eigener Strang, teilt KEIN Modul

Biofeedback-Minigames aus vorproduzierten Videoclips (Handgerät »Squeeze«). Eigenes Präfix,
eigenes Material, eigene Doku, eigener Messgriff — kollidiert mit keinem anderen Strang dieses
Canvas. Einstieg: `docs/dc-squeeze/LIVING_squeeze.md`.

| Artefakt | Status | Anmerkung |
|---|---|---|
| `DC Squeeze Weightlifter v3.dc.html` | **AKTIV** | Bauplatz. Drei Bewegungsschichten mit Auslösern, gemessener Aufschlag, gemessene Wortplätze, Tempodeckel. Griff `window.__SQZ3` |
| `DC Squeeze Weightlifter v2.dc.html` | **FROZEN** | Vergleichsmaßstab (erste flüssige Fassung). Griff `window.__SQZ2` |
| `DC Squeeze Weightlifter v1.dc.html` | SUPERSEDED | Fehlweg »Video mit Seek«, bleibt als Beleg zum Post Mortem |
| `KFB Squeeze Probe v2.dc.html` | **AKTIV** | Messblatt: Hantelhöhe je Frame → `LIFT_H`. Griff `window.__SQZP2` |
| `KFB Squeeze Probe v1.dc.html` | **AKTIV** | Messblatt: Frameanzahl, Format je Clip |
| `DC Squeeze SESSION_LIVING.dc.html` | **AKTIV** | Leser des Living Documents, hat keine eigenen Inhalte |
| `docs/dc-squeeze/LIVING_squeeze.md` | **AKTIV** | Living Document (11 Abschnitte, additiv) |
| `docs/dc-squeeze/CHANGELOG_squeeze.md` | **AKTIV** | additiver Changelog, SQ-3 oben |
| `squeeze-v1/frames/*.jpg` | **ASSET** | 147 JPG, Hub-Frames 46…192, native 1440 × 1440 |
| `squeeze-v1/media/*.mp4` | **ASSET** | 9 Clips: warten · heben · 7 × absenken |

## Eigene Module SpinballCast v3 (nicht geteilt)

| Datei | Status | Anmerkung |
|---|---|---|
| `spinballcast-v3/flatface.v1.js` | **AKTIV, NEU (V3-S11)** | größte flache Fläche → Normale = Achse; Bezug für Zahnrad-Lage UND Blatt-Ebene. Kandidat für den Studio-Strang (v9: `byCube`/`cubeH`) |
| `spinballcast-v3/scissors-look.v1.js` | **AKTIV, NEU (V3-S11)** | Klingen-Anmutung an einer Stelle; `VOR_KAMERA {env 0.30, dunkel 0.27}` gegen die Klingen gemessen |
| `spinballcast-v3/gear.v1.js` | **AKTIV** | Lage aus der Messung, `faceRot` nur noch Handgriff |
| `spinballcast-v3/score.v1.js` | **AKTIV** | Papier per Name, Fläche per Messung, Ziffer auf dem Blatt |
| `spinballcast-v3/surface.v1.js` | **AKTIV** | Messschieber (`window.__SPIN3S`) |

## Geteilte Module — ⚠ nie als tot einstufen

| Datei | geteilt mit | Status |
|---|---|---|
| `podcast-v5/ground.v5.js` | Podcast v5 (frozen) · SpinballCast v1/v2/v3 | **AKTIV, hier 3 Punkte reicher als WS0** → Rückläufer |
| `podcast-v1/stage.v1.js` | Podcast v2–v5 · SpinballCast · Travel | **AKTIV**, WS0s Fassung (475 Z, mit `byCube`) → Rückläufer |
| `kfb-pets.js` | Podcast · Travel · Rollercoaster · SpinballCast | **AKTIV**, WS0s Fassung (446 Z, mit `stripEyes`) → Rückläufer |
| `pet-mouth.v1.js` | dieselben | **AKTIV**, war hier nicht vorhanden → Rückläufer |
| `podcast-v5/layout.v5.js` | Podcast v5 (frozen) · SpinballCast | **AKTIV**, hier +8 Z |
| `cardbuilder/kfb-ink-canon.js` | Cardbuilder · Podcast · SpinballCast · Bubble Shaper | **AKTIV**, hier +151 Z |
| `studio-v3/pet-library.v6.js` | Studio · Podcast · SpinballCast | **AKTIV**, Skalierungs-Fix nur lokal → Altschuld |
| `podcast-v5/pet-metrics.v1.js` | Studio v7/v8 (identische Kopie in `studio-v7/`) | **AKTIV**, 442/442 Z identisch |

## Contract- und Daten-Dateien

| Datei | Status | Anmerkung |
|---|---|---|
| `media/3D_Assets/kfb-pets.json` (Repo) | **AKTIV, kanonisch** | v1.2.8, der reichere Stand (0 fehlende Felder gegen v1.2.7) |
| `kfb-pets.v5.json` | ASSET | v1.2.7, WS0s Pin für SpinballCast — absichtlich, Entscheidung offen |
| `studio-v3/kfb-pets.json` | SUPERSEDED | byteidentisch mit `kfb-pets.v5.json`, in Studio v8 als Quelle abgeschaltet |
| `studio-v3/kfb-pets.v1.2.6-verlust.json` | ASSET | Beweisstück (die Fassung, die Arbeit gelöscht hat) — **behalten** |
| `manifest.json` | **AKTIV** | aus WS0s Vollexport, Byte-Größen je Datei |

## Docs

| Datei | Status |
|---|---|
| `docs/spinballcast-v3/HANDOVER_WS0_v3.md` | **AKTIV** — Einstieg für WS0 |
| `docs/spinballcast-v3/BRIEFING_v4.md` | **AKTIV** — Einstieg für den v3→v4-Chat |
| `docs/spinballcast-v3/POST_MORTEM_re-home.md` | **AKTIV** — Pflichtlektüre, fünf Regeln |
| `docs/spinballcast-v3/CHANGELOG_spinballcast_v3.md` | **AKTIV**, additiv (V3-S4 oben) |
| `docs/CHANGELOG_studio.md` | **AKTIV**, additiv (V8-A oben) |
| `KFB Pet SpinballCast v3 SESSION_LIVING.dc.html` | **AKTIV** |
| `KFB Pet Studio v8 SESSION_LIVING.dc.html` | **AKTIV** |
| `docs/spinballcast-v3/ws0-referenz/*.js` (3) | ASSET — WS0s Fassungen, **nicht im Ladeweg** |
| `docs/spinballcast-v2/*` (6) | ASSET — WS0s Dokumente aus dem Vollexport |
| `github.md` | **AKTIV** — Repo-Zuordnung, Sync-Stand |

---

## Clean-Run-Checkliste (vor jedem Schnitt)

1. **Import-Check prüft Gleichheit, nie Anwesenheit** — byteweise, Datei für Datei, mit Zahl. *(R1)*
2. **Fremdes System läuft erst unverändert und wird gezeigt**, bevor eine Zeile geändert wird. *(R2)*
3. **Bei »das ist falsch«: ganze Kette messen, dann EINE Sache ändern.** *(R3)*
4. **Unsichtbar ≠ falsch gebaut** — erst fragen, wer das Objekt überhaupt zeichnet. *(R4)*
5. **Eine Änderung, nach der das Bild stimmt, ist keine Ursache** — Gegentest, einmal abschalten. *(R5)*
6. **Ein Kontrastwert ist keine Schattenmessung** — Differenz desselben Pixels mit und ohne.
7. **Ein Eigentümer je Zahl.** Zwei Stellen, die dasselbe abschalten, sind ein Fehler.
8. **Geteilte Module additiv**, Default = altes Verhalten, Unberührtheit des Mitbenutzers *messen*.
9. **Pfad-Hygiene:** kein relativer Asset-Pfad; alles Schwere über RAW-URL.
9b. **Ladeweg mit einem Skript prüfen, nicht mit einer Ordneransicht** — `node tools/check-loadpath.mjs`
    im Paketordner, vor dem Verschicken **und** nach dem Auspacken: jede relative Adresse aus jeder
    Quelldatei, **seitenrelativ** aufgelöst, gegen `LADEWEG.tsv` (Pfad · Bytes · sha256-16), Exit 0/1.
    Eine Abfrage mit Tiefenbegrenzung ist keine Vollständigkeitsprüfung: beim Re-Home v9 lag
    `studio-v3/PET_EDITOR/pet-LIBRARY.json` eine Ebene tiefer, als der Abruf reichte — die Datei war
    da, die Sicht war zu flach, und das Material fiel auf eine Fläche ohne Bildquelle zurück
    (fleckig). *Anwesenheit im Repo ist keine Anwesenheit im Arbeitsplatz.* **(R16)**
10. **Kein Export über 2 MB je Datei**, kein Gesamt-Projekt-Zip.
11. **Zu jeder Flächenzahl gehört ihr Zustand** — »1,740« gilt für das Startbild (Platzhalter-Seite,
    1 Mesh), »1,794« für eine echte Karte (Blatt + Decal). Eine Zahl ohne die Angabe, was im Panel
    hing, ist keine Messung. *(V3-S5, in derselben Runde bezahlt)*
12. **Offener Konsolenfehler, nicht von einer Scheibe verursacht:** `[resource_error] SCRIPT failed
    to load:` mit **leerer** URL, in allen Läufen von SpinballCast v3, auch vor V3-S5. Im DOM steht
    kein `script` mit leerem `src` — also dynamisch eingefügt. Vor dem nächsten Schnitt einkreisen.

---

## Aufräum-Kandidaten — benannt, NICHT ausgeführt (Skill §3)

| Kandidat | Größe | Empfehlung |
|---|---|---|
| `uploads/KFB Pet Podcast v5/` | mehrere MB | **behalten bis v4 steht** — enthält WS0s v5-Umgebung als Referenz |
| `uploads/KFB Pet Podcast v2 + Pet Studio v4/` | mehrere MB | löschen — durch v5/v8 vollständig ersetzt |
| `uploads/v4_upload-*.js` | ~90 KB | löschen — anonymer Einzel-Upload, Inhalt ist in `layout.v5.js` |
| `uploads/kfb-rc-v11_2026-07-23/` | mehrere MB | löschen — Rollercoaster v11, abgeschlossen und exportiert |
| `export/overworld-*` (v1 … v10-S2) | groß | archivieren — fünf Generationen, nur v10-S2 ist Fork-Basis |
| `fonts/` (16 Schnitte) | **5,1 MB** | **ins Repo hoch**, dann `@font-face` auf RAW-URL — sonst zeigt jedes Standalone Ersatzschriften |
| `screenshots/v8-groundplane-contract.png` | 34 KB | behalten (Abnahme V8-A) |
| `captures/`, `docs/captures/` | ? | prüfen — vermutlich verarbeitete Feedback-Bilder |

**Bereits ausgeführt (mit Freigabe »housekeeping!«):** die zwei Upload-Pakete des WS0-Exports
(62 Dateien, nach dem Einzug byteidentische Dubletten), 7 veraltete Screenshots, 5 verarbeitete
Feedback-Bilder.
