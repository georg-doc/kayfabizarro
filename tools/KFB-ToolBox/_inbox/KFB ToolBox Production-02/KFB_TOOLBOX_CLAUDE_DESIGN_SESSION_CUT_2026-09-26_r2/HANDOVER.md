# HANDOVER · WSA · KFB ToolBox Production-02 · Session Cut 2026-09-26 r2

## 1 · Was vorliegt
Eine Laufzeit mit drei Reitern: **Studio · Animation Studio · Rigging**. Das komplette Pet-Studio-v18-Mapping steht in `docs/PET_STUDIO_FEATURE_MAP.md`, dort ist jede Zeile als HAVE, PLUS, SCHWUND, MISSING, OUT oder V18+ eingestuft.

## 2 · ⚠ Hinweis für WSA · Animation Lab v1 fehlt
**»KFB Animation Lab v1« liegt weder auf `main` noch im Projekt** (Repo-Suche am 26.09.: 0 Treffer). Im Projekt liegen nur v2 (Standalone) und v3.
Das liegt nicht an der ToolBox. Georg: Der Web-Chat, in dem v1 entstanden ist, hat das UI nicht sauber exportiert, deshalb wurde v1 nie als Quelle abgelegt.
**Bitte:** v1 aus dem lokalen Stand bzw. dem Web-Chat sichern und ablegen (Vorschlag: `tools/KFB-ToolBox/_inbox/ANIMATION_LAB_V1/`, die .dc.html und alles, was sie lädt).
**Auftrag danach (Georg):** Das Layout von Animation Lab v1 wird mit dem ToolBox-Design (Paper-Palette, Space Grotesk / IBM Plex Mono, Inline-Stil) in den Reiter **Animation Studio** übernommen. Die Laufzeit, der Clip-Loader, Rollen, Fußkontakt-Bänder, IK-Korrekturen und die Bottom-Bar bleiben, getauscht wird nur die Anordnung. **Dann die neuen FBX-Animationen nachziehen**: als GLB-Bake je Rig-Familie über die Motion Library (`catalog` + `profile-catalog.v1`) bzw. als eigene Quelle mit Pin, nicht lose.

## 3 · Neue und geänderte Owner-Module (kfb-lib/, gehören ins Repo)
| Datei | Was | Vertrag |
|---|---|---|
| face-mount.v1.js | eine Feld-API für Driver, facehost und Cube Pets · turnBrow · browLife · Talk-Wechsel · original.*.pitch/yaw/sx/sy/sz | kfb.pets/1-Feldnamen; neue Felder nur hier |
| clay-lids.v1.js | Schema 0.2 · Auto-Fit · glide/fold · Stile | Spender PR #159 upper-lid-volume.v1 (pad 1:1) |
| ear-base.v1.js | Basis-Knochen für eine DangleChain + Umgewichtung der Wurzelhaut | für jede Knochenkette, auch Lord Hunkys Augenstiele |
| body-shape.v1.js | Dicke + Länge im Bind-Raum, Clip-Positions-Korrektur | Grenzen in META |
| (unverändert) pose-rig.v1.js · locomotion-profiles.v1.js · lipsync-text.v1.js · hair-tufts.v1.js · pet-library.v6.js | | |

## 4 · Offene Befunde, bekannt
- Nach einer Längenänderung im Body können gepinnte IK-Ziele leicht verfehlen (pose-rig misst beim Laden) → neu pinnen.
- Ohr-Ruhewinkel und -Platzierung halten nur, solange kein Clip die Ohrknochen keyt.
- Glide-Lider bauen die Geometrie bei jeder Lid-Änderung neu, etwa 4 × 3,7 k Punkte. Das ist ok, aber bei 20 Figuren nachmessen.
- Schatten auf großen Bühnen (Resident, Band): das Frustum ist auf r ≤ 14 gekappt und deshalb weicher als im Rigging.

## 5 · Push
Der Schreibweg aus Claude Design antwortet 403 (`Contents: Read and write` fehlt). Diesen Ordner lokal in das Repo kopieren: `kfb-lib/*` nach `tools/KFB-ToolBox/kfb-lib/`, die DC nach `tools/KFB-ToolBox/production/`, die Doku nach `tools/KFB-ToolBox/docs/`. Die Prüfsummen stehen in `CHECKSUMS.sha256`.

## Next Gate
**FACE-VIS-02 · Georgs Sichtabnahme im Rigging-Reiter** (Lider Auto-Fit Glide/Fold · Ohr-Basis · Body · Schatten · Talk · Bottom-Bar). Danach **ANIM-STUDIO-01** mit der Quelle von Animation Lab v1.
