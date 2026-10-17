# RETURN · KFB World + Racer + Hub Masterplan · 2026-09-24

Status: **RECON + PLAN COMPLETE · NO RUNTIME CHANGE · HUMAN REVIEW OPEN**

## Repo / branch / head

- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-racer-hub-masterplan-2026-09-24`
- Base: `main@730ddb26fd5b94ab547acc0b8478796b3398bb9b`
- Masterplan checkpoint: `dbedddd714b995f28db946c37dbb3219c05455a3`

## Ergebnis

- WB-W0, Racer PR #33/#34/#35, Production Desk/Hub, Hürth, Billboard, Motion Library, Orc Band und ToolBox wurden gegen aktuelle Quellen eingeordnet.
- Der aktuelle öffentliche Hub wurde im echten Chrome-Browser geöffnet. Er rendert den eingebauten letzten Stand und ist nicht leer.
- Die kompakte Production-Desk-Ansicht ist als einzige Hub-Richtung festgelegt; kein neues Hub-UI wurde gebaut.
- Claude Coworker ist auf Registry-/Snapshot-Arbeit begrenzt. Produktive Briefings benötigen künftig einen sichtbaren Review.
- WB-W0 ist der aktuelle World-MVP-Kandidat; die verworfene WorldBuilder-v1-Fassung bleibt eingefroren.
- Die Breitenkonfusion ist aufgelöst: `STANDARD 14,4 m`, `WIDE 18,0 m`; die vorhandene 18-m-WB-W0-Geometrie bleibt unverändert und wird als WIDE bezeichnet.
- RKIT-01 bleibt Review-Kandidat; RKIT-02/Stunts bleiben für den ersten MVP HOLD.
- WORLD-RACER-MVP-01 ist als kleinster Kernloop definiert.

## Geänderte Dateien

- `skills/chat/workflows/KFB_WORLD_RACER_HUB_MASTERPLAN_2026-09-24/START_HERE.md`
- `skills/chat/workflows/KFB_WORLD_RACER_HUB_MASTERPLAN_2026-09-24/RETURN.md`

## Tatsächliche Checks

- GitHub main / relevante PR-Heads neu gelesen.
- Dropbox WB-W0 Return neu gelesen: 10/10 Preview-Gates PASS, Human Gate offen.
- Dropbox RKIT-01/RKIT-02 Returns und WSA-Handover gelesen.
- Öffentlicher Hub im echten Browser geöffnet:
  `https://kayfabizarro.pages.dev/kfb-hub/`
- Ergebnis: Embedded-Stand sichtbar; Hub nicht leer; Datenstand noch unvollständig/stale gegenüber den neuesten Slices.
- Masterplan-Datei vom neuen Branch zurückgelesen.
- Optionaler `game-dev`-Helper: nicht installiert; kein Blocker für diesen Recon-/Planungs-Slice.

## Nicht gemacht

- keine Runtime-Datei geändert;
- kein Hub-Redesign;
- keine Registry-/Cloudflare-Promotion;
- kein Merge;
- keine Racer-/WorldBuilder-Implementierung;
- keine Claude- oder Blender-Aufgabe gestartet.

## Ungeklärt / Human Gates

- WB-W0 visuelle/spielerische Abnahme;
- RKIT-01 Look-Abnahme und Wahl Standard-/Taper-Bogenfuß;
- Billboard B2a PASS/TUNE;
- Hürth Proof A/B/C PASS/FAIL;
- aktuelle Registry kennt noch nicht alle neuen Slices.

## Genau ein nächster Gate

**HUB-CTRL-01**: Registry auf die exakten aktuellen Heads bringen, widersprüchliche startbereite Briefings auf HOLD/Archiv setzen und Never-empty mit eingebautem Stand plus fehlerhaftem/fehlendem Live-Stand beweisen.

STOP danach. Kein WORLD-RACER-MVP-01, kein RKIT-02 und kein neuer Hub in diesem Handoff.
