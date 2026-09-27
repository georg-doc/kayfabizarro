# HANDOVER · an WSA · KFB ToolBox Production-03 · 2026-09-27 r2
**Von:** Claude Design (Projekt »KFB ToolBox«) · **An:** WSA (Web-/Repo-Lead) · **Schreibweg Claude Design → GitHub:** 403.

## Was WSA tun soll
1. Diesen Ordner unverändert nach `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/` legen (oder aus dem ZIP entpacken). Commit-SHA zurück an Georg.
2. `zipcheck.py` im entpackten Ordner laufen lassen, Ergebnis ins TEST_REPORT eintragen (hier NOT_RUN, kein Python in Claude Design).
3. Kaltstart über HTTP (`python3 -m http.server` im Ordner): Seite lädt, »…« › Run self-test → Erwartung 33/33. Ergebnis zurückmelden.
4. Owner-Übernahme prüfen, **nicht** mischen:
   - `kfb-lib/face-mount.v1.js` · geändert: Mund-Wrap auf lokales Hautstück (wrapMouthToSkin). Kandidat für den Owner-Pfad neben `frizzlegraft-v1/graft-mount.v1.js`.
   - `kfb-lib/anim-map.v1.js` · 1:1 aus `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/frizzlegraft-v1/anim-map.v1.js` @main (Blob 7120f80e). Owner der 24 Zustände; im Runtime-Pin 8922d4b1 fehlt die Datei unter `kfb-rigs-embed-v3/frizzlegraft-v1/`.
   - `kfb-lib/pose-rig.v1.js` · Owner-Fix vom 25.09. (Handgelenk-Ketten), Patch für `petstudio-v9/studio-v13/pose-rig.v1.js` steht weiter aus.
5. Befund an WSA: `stage-first/src/KFB FrankenStein Studio v18.dc.html` und `KFB Animation Lab v3.dc.html` liegen **nicht mehr auf main** (nur als Projektkopie). Bitte klären, ob gewollt; die Paritätstabellen zitieren diese Zeilen.

## Pins
Runtime 8922d4b1 · Ear Rig 19088b14 · Stock-Animationen b97b5ac5 · Motion Library 032c9d50 · Mund-Decals main. Details: SOURCE.json, docs/github.md.

## Offen (P2, nicht Teil dieses Gates)
Cube-Pet Material/Surface/Color/Light-Mood · Material- und Kopfzonen am Driver · Pad/Klo-Rolli · Satz-Export (File-Menü) · Voice/Blasen-Rework · Cross-Rig M+L · Waffe/FX · Carl-Graft-Felder · Roster Carl/Rolli/Recherchi.

## Next Gate
**GEORG-ACCEPT-P03:** Georg klickt Production-03 durch (Studio › Face Viseme + »Zu«, Rigging › Mouth/Eyes/Emotes, Animation Studio › States/Strip/Sheet/Trail) und gibt ACCEPTED oder eine Befundliste. Erst danach BODY-02.
