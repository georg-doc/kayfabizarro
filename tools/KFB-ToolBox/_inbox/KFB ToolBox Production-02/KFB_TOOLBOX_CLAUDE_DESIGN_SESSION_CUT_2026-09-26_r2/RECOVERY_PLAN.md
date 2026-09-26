# RECOVERY PLAN · falls dieser Stand bricht
1. **Seite leer / »logic class eval FAILED«:** fast immer ein Syntaxfehler in der DC-Logik. Den `[dc-runtime]`-Text lesen, dann die zuletzt geänderte Zeile auf `//`-Kommentare in einzeiligen Anweisungen und auf offene Klammern prüfen. Rückweg: die DC aus r1 (`../KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-26_r1/`) plus die kfb-lib dieses Cuts laden. Die Module sind abwärtskompatibel, nur face-mount liest zusätzliche Felder.
2. **Figur fehlt, rote Box »SOURCE MISSING«:** Pin-Pfad prüfen (SOURCE.json). Nichts ersetzen, nichts nachbauen, den Befund melden.
3. **Lider falsch:** in Rigging › Eyes Style auf »Shell (EyeRig)« stellen, das ist der Originalweg. Den Clay-Stand exportieren und den Befund mit `clay.report()` melden (Konsole: `__kfbFaceLog`).
4. **Ohren kaputt:** Rigging › Ears › »Reset ears to rig default«. Ohne ear-base (Import fehlt) fallen die Werte auf Knochen 1 zurück, das Panel sagt es.
5. **Body komisch:** Rigging › Body › Reset. `body-shape.v1.dispose()` stellt die Geometrie und die boneInverses byte-gleich wieder her.
6. **Schatten falsch:** `docs/LESSONS_SHADOWS.md` Prüfteil. Bekannter Rückfall: DoubleSide-Ausschluss.
7. **Workspace verdorben:** Import · Export › Import einer zuvor exportierten Rig-JSON. localStorage nie löschen, ohne dass Georg zustimmt.
8. Zweimal am selben Gate gescheitert: stoppen, Status ARCHIVED_FAILED_CANDIDATE, POSTMORTEM.md schreiben.
