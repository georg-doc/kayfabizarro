# RECOVERY PLAN · falls dieser Stand bricht (2026-09-27 r2)
1. Seite leer / »logic class eval FAILED«: `[dc-runtime]`-Text lesen, zuletzt geänderte Zeile prüfen. Rückweg: Production-02 + face-mount.v1.js aus Cut 27.09. r1 (alle anderen Module abwärtskompatibel).
2. Rote Box »SOURCE MISSING«: Pin-Pfad prüfen (SOURCE.json). Nichts ersetzen, Befund melden.
3. Mund sitzt schief / verschwindet nach Regler: face-mount.v1 `mouthWrap` lesen (`__kfbTB.runtime.face.mouthWrap`: hit muss n sein). Rückfall-Pfad greift unter 90 % Treffern automatisch.
4. States leer: Figur braucht Rig_Medium/Rig_Large; Sets, die nicht laden, stehen unter »not loaded« (Notes an).
5. Lider doppelt: `_postRig` muss nach `rig.update` laufen (Clay-Sync dort).
6. Workspace verdorben: Rigging › Import einer exportierten JSON. localStorage nie ohne Georg löschen.
7. Zweimal am selben Gate gescheitert: stoppen, ARCHIVED_FAILED_CANDIDATE, POSTMORTEM.md.
