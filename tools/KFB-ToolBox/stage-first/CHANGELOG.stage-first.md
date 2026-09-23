# CHANGELOG · stage-first (additiv, neueste oben)

## 2026-09-16 · Stage-First v1 · P0 slice · ACCEPTED FOR WORKING BASELINE
- GEORG ACCEPTANCE: `ACCEPTED FOR WORKING BASELINE` (16.09., WSA-Chat). Kein Bug-frei-, kein Final-Look-Anspruch. Nächster Slice `Pose → Props → Stage` NICHT gestartet.
- NEU `src/KFB ToolBox Stage-First v1.dc.html`: Fork des Studio-v18-Blatts auf dem WS0-Quellbaum; Template ersetzt (eine 44-px-Kopfzeile, Bühne = Fläche, eine Kontextpalette, Actor-Popover Browse → Preview → Accept/Revert, Kamera-Chips, Emote/Anim-Chips, Diagnostics unter `…`). Logik: v18-Klasse + Adapter `_sf*`.
- NEU `qa/Stage-First QA.dc.html`: 13 Prüfungen. 13/13 PASS mit den (7).zip-Profilen (00:51:32Z) UND mit den Repo-Eingangs-Profilen `_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-{gothgirl,hihi}.json` (01:19:32Z, `window.__QA_PROFILES='repo-inbox/'`). Sitzung vor/nach dem Lauf byte-gleich (Prüfung 13).
- KORREKTUR 1 (Verifier): erster Lauf 00:32 (12/12, `qa-run-2026-09-16-first.jpg`, historisch) hinterließ Entwürfe → Prüfstand sichert/restauriert `localStorage`; `_sfExportDoc` ohne `_flushDrafts()`.
- KORREKTUR 2 (Verifier): Note-only-Abschnitte außerhalb Diagnostics ausgeblendet; bei GothGirl `matzonen`/`kopfzonen`/`weapon` ausgeblendet; `matzonen` = »Atlas zones«, `kopfzonen` = »Head zones (graft)«.
- ÜBERNOMMEN byte-gleich aus v18 (7): `goth-biped.v1.js`, `browfit.v1.js`, `inkform.v2.js`, beide Profile, das v18-Blatt.
- BEFUNDE F-1…F-8 im Return; F-6/F-7/F-8 akzeptiert OFFEN. Kanonische Dateien unangetastet.
- GIT: Push von hier weiterhin 403 (`POST /git/trees`, Contents: Read only). Checkpoint als ZIP; Commit von Georgs Rechner, SHA danach in `github.md` nachtragen.
